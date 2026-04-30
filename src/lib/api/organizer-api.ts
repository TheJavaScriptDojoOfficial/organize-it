import { invoke } from "@tauri-apps/api/core";
import { ORGANIZER_CATEGORIES } from "../constants/categories";
import type { CategoryName, CategoryScanSummary, ScanResult, ScannedFileItem } from "../types/organizer";

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

const KNOWN_CATEGORY_SET = new Set<string>(ORGANIZER_CATEGORIES);

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

function mapContractToScanResult(contract: ContractScanResponse): ScanResult {
  const categorySummary = buildNormalizedCategorySummary(contract.categories);

  return {
    sourcePath: contract.sourcePath,
    scannedAtIso: new Date().toISOString(),
    totalFiles: contract.totalFiles,
    categorizedFiles: [],
    categorySummary,
    uncategorizedFileCount: categorySummary.find((item) => item.category === "Others")?.fileCount ?? 0,
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
  };
}

function parsePythonScanJson(rawJson: string): ScanResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
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
  const rawScanResponse = await invoke<string>("run_python_scan", { sourcePath });
  return parsePythonScanJson(rawScanResponse);
}
