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
}

export interface OrganizedFileMove {
  fileName: string;
  fromPath: string;
  toPath: string;
  category: CategoryName;
}

export interface OrganizeResult {
  sourcePath: string;
  outputPath: string;
  organizedAtIso: string;
  movedFiles: OrganizedFileMove[];
  skippedFiles: string[];
  createdFolders: string[];
  totalMovedFiles: number;
}
