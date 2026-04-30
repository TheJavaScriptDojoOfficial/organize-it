export interface AppSettings {
  confirmBeforeOrganize: boolean;
  enablePreviewBeforeOrganizing: boolean;
  rememberLastSelectedFolder: boolean;
  defaultOrganizationFolder: string;
  lastSelectedFolder: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  confirmBeforeOrganize: true,
  enablePreviewBeforeOrganizing: true,
  rememberLastSelectedFolder: true,
  defaultOrganizationFolder: "",
  lastSelectedFolder: "",
};
