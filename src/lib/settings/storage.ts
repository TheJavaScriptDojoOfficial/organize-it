import { DEFAULT_SETTINGS, type AppSettings } from "../types/settings";

const SETTINGS_STORAGE_KEY = "organize-it.settings.v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function sanitizeSettings(value: unknown): AppSettings {
  if (!isRecord(value)) {
    return DEFAULT_SETTINGS;
  }

  return {
    confirmBeforeOrganize:
      typeof value.confirmBeforeOrganize === "boolean"
        ? value.confirmBeforeOrganize
        : DEFAULT_SETTINGS.confirmBeforeOrganize,
    enablePreviewBeforeOrganizing:
      typeof value.enablePreviewBeforeOrganizing === "boolean"
        ? value.enablePreviewBeforeOrganizing
        : DEFAULT_SETTINGS.enablePreviewBeforeOrganizing,
    rememberLastSelectedFolder:
      typeof value.rememberLastSelectedFolder === "boolean"
        ? value.rememberLastSelectedFolder
        : DEFAULT_SETTINGS.rememberLastSelectedFolder,
    defaultOrganizationFolder:
      typeof value.defaultOrganizationFolder === "string"
        ? value.defaultOrganizationFolder
        : DEFAULT_SETTINGS.defaultOrganizationFolder,
    lastSelectedFolder:
      typeof value.lastSelectedFolder === "string" ? value.lastSelectedFolder : DEFAULT_SETTINGS.lastSelectedFolder,
  };
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const rawSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!rawSettings) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(rawSettings) as unknown;
    return sanitizeSettings(parsed);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
