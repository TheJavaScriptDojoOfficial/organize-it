import { invoke } from "@tauri-apps/api/core";
import { ORGANIZER_CATEGORIES } from "../constants/categories";
import type { CategoryName, CategoryScanSummary, OrganizeResult, ScanResult, ScannedFileItem } from "../types/organizer";

interface LegacyScanEnvelope {
  ok: boolean;
  command: string;
  data?: unknown;
  error?: {
    message?: string;
  };
}

interface LegacyScanData {
  sourcePath: string;
  scannedAtIso: string;
  totalFiles: number;
  categorizedFiles: ScannedFileItem[];
  categorySummary: CategoryScanSummary[];
  uncategorizedFileCount: number;
  skippedFiles?: string[];
}

interface ContractCategory {
  name: string;
  count: number;
}

interface ContractScanResponse {
  success: boolean;
  command: string;
  sourcePath: string;
  totalFiles: number;
  categories: ContractCategory[];
  movedCount: number;
  createdFolders: string[];
  skippedFiles: string[];
  failedFiles: Array<{ path: string; reason: string }>;
  message: string;
}

interface ContractOrganizeResponse {
  success: boolean;
  command: string;
  sourcePath: string;
  totalFiles: number;
  categories: ContractCategory[];
  movedCount: number;
  createdFolders: string[];
  skippedFiles: string[];
  failedFiles: Array<{ path: string; reason: string }>;
  message: string;
}

const KNOWN_CATEGORY_SET = new Set<string>(ORGANIZER_CATEGORIES);
const IS_DEV_MODE = import.meta.env.DEV;

function logDev(message: string, payload?: unknown): void {
  if (!IS_DEV_MODE) {
    return;
  }

  if (payload === undefined) {
    console.debug(`[organizer-api] ${message}`);
    return;
  }

  console.debug(`[organizer-api] ${message}`, payload);
}

function asCategoryName(value: string): CategoryName {
  if (KNOWN_CATEGORY_SET.has(value)) {
    return value as CategoryName;
  }
  return "Others";
}

function buildNormalizedCategorySummary(
  categories: Array<{ name: string; count: number }>,
  categorizedFiles: ScannedFileItem[] = [],
): CategoryScanSummary[] {
  return ORGANIZER_CATEGORIES.map((category) => {
    const matchingCategory = categories.find((entry) => asCategoryName(entry.name) === category);
    const sampleFileNames = categorizedFiles
      .filter((item) => item.category === category)
      .slice(0, 3)
      .map((item) => item.name);

    return {
      category,
      fileCount: matchingCategory?.count ?? 0,
      totalSizeInBytes: 0,
      sampleFileNames,
    };
  });
}

function isContractScanResponse(value: unknown): value is ContractScanResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<ContractScanResponse>;
  return (
    typeof payload.success === "boolean" &&
    payload.command === "scan" &&
    typeof payload.sourcePath === "string" &&
    typeof payload.totalFiles === "number" &&
    Array.isArray(payload.categories) &&
    typeof payload.message === "string"
  );
}

function isContractOrganizeResponse(value: unknown): value is ContractOrganizeResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<ContractOrganizeResponse>;
  return (
    typeof payload.success === "boolean" &&
    payload.command === "organize" &&
    typeof payload.sourcePath === "string" &&
    typeof payload.totalFiles === "number" &&
    typeof payload.movedCount === "number" &&
    Array.isArray(payload.createdFolders) &&
    Array.isArray(payload.skippedFiles) &&
    Array.isArray(payload.failedFiles) &&
    typeof payload.message === "string"
  );
}

function mapContractToScanResult(contract: ContractScanResponse): ScanResult {
  const categorySummary = buildNormalizedCategorySummary(contract.categories);

  return {
    sourcePath: contract.sourcePath,
    scannedAtIso: new Date().toISOString(),
    totalFiles: contract.totalFiles,
    categorizedFiles: [],
    categorySummary,
    uncategorizedFileCount: categorySummary.find((item) => item.category === "Others")?.fileCount ?? 0,
    skippedFiles: contract.skippedFiles,
    message: contract.message,
  };
}

function mapLegacyToScanResult(payload: LegacyScanEnvelope): ScanResult {
  if (!payload.ok) {
    throw new Error(payload.error?.message || "Scan failed.");
  }

  const data = payload.data as LegacyScanData | undefined;
  if (!data) {
    throw new Error("Scan response missing data payload.");
  }

  const categorizedFiles = data.categorizedFiles ?? [];
  const summaryFromLegacy = (data.categorySummary ?? []).map((entry) => ({
    name: entry.category,
    count: entry.fileCount,
  }));
  const categorySummary = buildNormalizedCategorySummary(summaryFromLegacy, categorizedFiles);

  return {
    sourcePath: data.sourcePath,
    scannedAtIso: data.scannedAtIso,
    totalFiles: data.totalFiles,
    categorizedFiles,
    categorySummary,
    uncategorizedFileCount: categorySummary.find((item) => item.category === "Others")?.fileCount ?? 0,
    skippedFiles: data.skippedFiles ?? [],
    message: "Scan completed successfully.",
  };
}

function toErrorMessage(error: unknown, operation: "scan" | "organize"): string {
  const fallback = operation === "scan" ? "Scan failed unexpectedly." : "Organization failed unexpectedly.";
  const raw = error instanceof Error ? error.message : String(error ?? fallback);
  const normalized = raw.replace(/^Error invoking.*?:\s*/i, "").trim();
  const lower = normalized.toLowerCase();

  if (lower.includes("permission denied")) {
    return "Permission denied. Please choose a folder you can read and write.";
  }
  if (lower.includes("does not exist") || lower.includes("no such file")) {
    return "The selected folder is no longer available. Please pick it again.";
  }
  if (lower.includes("failed to start python process")) {
    return "Could not start the Python service. Verify Python is installed and available.";
  }
  if (lower.includes("invalid json") || lower.includes("did not match expected contract")) {
    return "The organizer service returned malformed data. Please retry.";
  }
  if (lower.includes("file is currently in use") || lower.includes("being used by another process")) {
    return "Some files are locked by another app. Close those files and try again.";
  }
  if (!normalized) {
    return fallback;
  }
  return normalized;
}

function parsePythonScanJson(rawJson: string): ScanResult {
  logDev("Raw scan JSON response", rawJson);
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    logDev("Failed to parse scan JSON response", {
      error: error instanceof Error ? error.message : String(error),
      rawJson,
    });
    throw new Error("Scan returned invalid JSON.");
  }

  if (isContractScanResponse(parsed)) {
    if (!parsed.success) {
      throw new Error(parsed.message || "Scan failed.");
    }
    return mapContractToScanResult(parsed);
  }

  return mapLegacyToScanResult(parsed as LegacyScanEnvelope);
}

export async function scanFolder(sourcePath: string): Promise<ScanResult> {
  try {
    logDev("Invoking python scan command", { sourcePath });
    const rawScanResponse = await invoke<string>("run_python_scan", { sourcePath });
    return parsePythonScanJson(rawScanResponse);
  } catch (error) {
    logDev("Scan invocation failed", {
      sourcePath,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(toErrorMessage(error, "scan"));
  }
}

function mapContractToOrganizeResult(contract: ContractOrganizeResponse): OrganizeResult {
  return {
    sourcePath: contract.sourcePath,
    totalFiles: contract.totalFiles,
    categories: buildNormalizedCategorySummary(contract.categories),
    movedCount: contract.movedCount,
    createdFolders: contract.createdFolders,
    skippedFiles: contract.skippedFiles,
    failedFiles: contract.failedFiles,
    message: contract.message,
  };
}

function parsePythonOrganizeJson(rawJson: string): OrganizeResult {
  logDev("Raw organize JSON response", rawJson);
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    logDev("Failed to parse organize JSON response", {
      error: error instanceof Error ? error.message : String(error),
      rawJson,
    });
    throw new Error("Organize returned invalid JSON.");
  }

  if (!isContractOrganizeResponse(parsed)) {
    throw new Error("Organize response did not match expected contract.");
  }

  if (!parsed.success) {
    throw new Error(parsed.message || "Organize failed.");
  }

  return mapContractToOrganizeResult(parsed);
}

export async function organizeFolder(sourcePath: string): Promise<OrganizeResult> {
  try {
    logDev("Invoking python organize command", { sourcePath });
    const rawOrganizeResponse = await invoke<string>("run_python_organize", { sourcePath });
    return parsePythonOrganizeJson(rawOrganizeResponse);
  } catch (error) {
    logDev("Organize invocation failed", {
      sourcePath,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(toErrorMessage(error, "organize"));
  }
}
