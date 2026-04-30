import { ORGANIZER_CATEGORIES } from "../constants/categories";

export type CategoryName = (typeof ORGANIZER_CATEGORIES)[number];

export type UiAsyncState = "idle" | "loading" | "success" | "error";
export type OrganizerFlowStep = "selectPath" | "scan" | "preview" | "organize";

export interface ScannedFileItem {
  name: string;
  absolutePath: string;
  extension: string;
  sizeInBytes: number;
  category: CategoryName;
}

export interface CategoryScanSummary {
  category: CategoryName;
  fileCount: number;
  totalSizeInBytes: number;
  sampleFileNames: string[];
}

export interface ScanResult {
  sourcePath: string;
  scannedAtIso: string;
  totalFiles: number;
  categorizedFiles: ScannedFileItem[];
  categorySummary: CategoryScanSummary[];
  uncategorizedFileCount: number;
  skippedFiles: string[];
  message: string;
}

export interface OrganizeResult {
  sourcePath: string;
  totalFiles: number;
  categories: CategoryScanSummary[];
  movedCount: number;
  createdFolders: string[];
  skippedFiles: string[];
  failedFiles: Array<{ path: string; reason: string }>;
  message: string;
}
