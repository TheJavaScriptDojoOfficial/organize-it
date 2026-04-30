import type { CategoryName } from "./organizer";

export type SettingsSaveState = "idle" | "saving" | "saved" | "error";

export interface CategoryRuleSettings {
  enabled: boolean;
  destinationFolderName: string;
}

export type CategoryRules = Record<CategoryName, CategoryRuleSettings>;

export interface AppSettings {
  sourcePath: string;
  destinationPath: string;
  askBeforeOrganizing: boolean;
  enablePreview: boolean;
  keepOriginalFiles: boolean;
  categoryRules: CategoryRules;
}
