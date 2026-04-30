import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { open } from "@tauri-apps/plugin-dialog";
import CategoryCard from "../components/organizer/CategoryCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import SectionHeader from "../components/ui/SectionHeader";
import StatusMessage from "../components/ui/StatusMessage";
import { useSettings } from "../context/SettingsContext";
import { organizeFolder, scanFolder } from "../lib/api/organizer-api";
import type {
  CategoryName,
  OrganizeResult,
  ScanResult,
} from "../lib/types/organizer";

type PageState =
  | "empty"
  | "selected"
  | "scanning"
  | "preview"
  | "organizing"
  | "success"
  | "error";

const CATEGORY_META: Record<
  CategoryName,
  {
    icon: string;
    tone?: "default" | "primary" | "error" | "tertiary";
    large?: boolean;
  }
> = {
  Images: { icon: "image", tone: "primary", large: true },
  Videos: { icon: "videocam" },
  PDF: { icon: "picture_as_pdf", tone: "error" },
  Excel: { icon: "table_chart" },
  Documents: { icon: "description" },
  Zip: { icon: "folder_zip" },
  Applications: { icon: "apps" },
  "Code Files": { icon: "code", tone: "tertiary" },
  Others: { icon: "inventory_2" },
};

export default function OrganizerPage() {
  const { settings, updateSettings } = useSettings();
  const didHydrateInitialPathRef = useRef(false);
  const [previewState, setPreviewState] = useState<PageState>("empty");
  const [selectedPath, setSelectedPath] = useState<string>(() => {
    if (
      settings.rememberLastSelectedFolder &&
      settings.lastSelectedFolder.length > 0
    ) {
      return settings.lastSelectedFolder;
    }
    return settings.defaultOrganizationFolder;
  });
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [organizeResult, setOrganizeResult] = useState<OrganizeResult | null>(
    null,
  );
  const [errorText, setErrorText] = useState<string>("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isProcessingOrganize, setIsProcessingOrganize] = useState(false);

  useEffect(() => {
    if (didHydrateInitialPathRef.current) {
      return;
    }
    didHydrateInitialPathRef.current = true;

    if (selectedPath.length > 0) {
      return;
    }

    if (
      settings.rememberLastSelectedFolder &&
      settings.lastSelectedFolder.length > 0
    ) {
      setSelectedPath(settings.lastSelectedFolder);
      setPreviewState("selected");
      return;
    }

    if (settings.defaultOrganizationFolder.length > 0) {
      setSelectedPath(settings.defaultOrganizationFolder);
      setPreviewState("selected");
    }
  }, [
    selectedPath,
    settings.defaultOrganizationFolder,
    settings.lastSelectedFolder,
    settings.rememberLastSelectedFolder,
  ]);

  const activeState = previewState;
  const isBusy = activeState === "scanning" || activeState === "organizing";
  const hasSelectedPath = selectedPath.length > 0;
  const canRenderResults =
    hasSelectedPath &&
    ["scanning", "preview", "organizing", "success", "error"].includes(
      activeState,
    );

  const sortedCards = useMemo(() => {
    if (!scanResult) {
      return [];
    }

    return [...scanResult.categorySummary].sort(
      (a, b) => b.fileCount - a.fileCount,
    );
  }, [scanResult]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === "Escape" && isConfirmModalOpen) {
        setIsConfirmModalOpen(false);
        return;
      }

      if (event.key === "Enter" && isConfirmModalOpen) {
        event.preventDefault();
        setIsConfirmModalOpen(false);
        void runOrganizeFlow();
        return;
      }

      if (isBusy) {
        return;
      }

      const commandKey = event.metaKey || event.ctrlKey;
      if (!commandKey) {
        return;
      }

      if (event.key.toLowerCase() === "o") {
        event.preventDefault();
        void handleSelectFolder();
      }

      if (event.key.toLowerCase() === "k") {
        event.preventDefault();
        void handleScanClick();
      }

      if (event.key === "Enter") {
        event.preventDefault();
        void handleOrganizeClick();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isBusy, isConfirmModalOpen]);

  function clearSelection(state: PageState = "empty"): void {
    setPreviewState(state);
    setSelectedPath("");
    setScanResult(null);
    setOrganizeResult(null);
    setErrorText("");
    setIsConfirmModalOpen(false);
  }

  function persistLastSelectedFolder(path: string): void {
    if (!settings.rememberLastSelectedFolder) {
      return;
    }
    updateSettings({ lastSelectedFolder: path });
  }

  async function handleSelectFolder(): Promise<void> {
    if (activeState === "scanning" || activeState === "organizing") {
      return;
    }

    setErrorText("");
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Choose a folder to organize",
      });

      if (!selected || Array.isArray(selected)) {
        return;
      }

      setSelectedPath(selected);
      setPreviewState("selected");
      setScanResult(null);
      setOrganizeResult(null);
      persistLastSelectedFolder(selected);
    } catch {
      setPreviewState("error");
      setErrorText(
        "Could not open folder picker. Please retry in the desktop app.",
      );
    }
  }

  async function handleScanClick(): Promise<void> {
    if (
      !hasSelectedPath ||
      activeState === "scanning" ||
      activeState === "organizing"
    ) {
      return;
    }

    setPreviewState("scanning");
    setErrorText("");
    setOrganizeResult(null);
    try {
      const result = await scanFolder(selectedPath);
      setScanResult(result);
      setPreviewState("preview");
    } catch (error) {
      setPreviewState("error");
      const message =
        error instanceof Error ? error.message : "Scan failed unexpectedly.";
      setErrorText(`Scan failed: ${message}`);
    }
  }

  async function runOrganizeFlow(): Promise<void> {
    if (
      !hasSelectedPath ||
      activeState === "organizing" ||
      activeState === "scanning" ||
      isProcessingOrganize
    ) {
      return;
    }

    setIsProcessingOrganize(true);
    setPreviewState("organizing");
    setErrorText("");
    try {
      if (settings.enablePreviewBeforeOrganizing || !scanResult) {
        const latestScan = await scanFolder(selectedPath);
        setScanResult(latestScan);
      }

      const result = await organizeFolder(selectedPath);
      setOrganizeResult(result);
      setPreviewState("success");
    } catch (error) {
      setPreviewState("error");
      const message =
        error instanceof Error
          ? error.message
          : "Organization failed unexpectedly.";
      setErrorText(`Organization failed: ${message}`);
    } finally {
      setIsProcessingOrganize(false);
    }
  }

  async function handleOrganizeClick(): Promise<void> {
    if (
      !hasSelectedPath ||
      activeState === "organizing" ||
      activeState === "scanning" ||
      isProcessingOrganize
    ) {
      return;
    }

    if (settings.confirmBeforeOrganize) {
      setIsConfirmModalOpen(true);
      return;
    }

    await runOrganizeFlow();
  }

  const hasPartialFailures = Boolean(
    organizeResult && organizeResult.failedFiles.length > 0,
  );
  const showWarningState = Boolean(
    organizeResult &&
    (organizeResult.failedFiles.length > 0 ||
      organizeResult.skippedFiles.length > 0),
  );
  const showScanWarning = Boolean(
    scanResult &&
    (scanResult.totalFiles === 0 || scanResult.skippedFiles.length > 0),
  );

  return (
    <main className="min-h-screen bg-[#f7f9fb] px-6 py-10 text-[#2a3439]">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-[2.75rem]">
            Organize It
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-[#566166]">
            Sort messy folders into clean categories in seconds. Review first,
            then organize with confidence.
          </p>
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#4d44e3] transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#eef1ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4d44e3]/40"
            aria-label="Open settings"
          >
            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>
            Open settings
          </Link>
        </section>

        {activeState === "success" && organizeResult ? (
          <div className="space-y-4">
            <StatusMessage
              title={
                showWarningState
                  ? "Organization completed with warnings"
                  : "Files organized successfully"
              }
              detail={`${organizeResult.movedCount}/${organizeResult.totalFiles} files moved • ${organizeResult.createdFolders.length} folders created`}
              tone={showWarningState ? "warning" : "success"}
            />
            <Card className="space-y-4 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">
                Run summary
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-[#f0f4f7] p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-[#566166]">
                    Files moved
                  </p>
                  <p className="text-xl font-bold text-[#2a3439]">
                    {organizeResult.movedCount}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f0f4f7] p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-[#566166]">
                    Folders created
                  </p>
                  <p className="text-xl font-bold text-[#2a3439]">
                    {organizeResult.createdFolders.length}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f0f4f7] p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-[#566166]">
                    Skipped files
                  </p>
                  <p className="text-xl font-bold text-[#2a3439]">
                    {organizeResult.skippedFiles.length}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f0f4f7] p-3">
                  <p className="text-[11px] uppercase tracking-[0.08em] text-[#566166]">
                    Failed files
                  </p>
                  <p
                    className={`text-xl font-bold ${hasPartialFailures ? "text-[#9e3f4e]" : "text-[#2a3439]"}`}
                  >
                    {organizeResult.failedFiles.length}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  variant="primary"
                  onClick={() => {
                    clearSelection();
                    void handleSelectFolder();
                  }}
                >
                  Organize Another Folder
                </Button>
                <Button
                  variant="secondary"
                  disabled={!hasSelectedPath}
                  onClick={() => {
                    void handleScanClick();
                  }}
                >
                  Rescan Folder
                </Button>
              </div>
            </Card>
          </div>
        ) : null}

        {activeState === "error" ? (
          <StatusMessage
            title="Something went wrong"
            detail={errorText || "Could not complete request"}
          />
        ) : null}

        {activeState !== "success" && scanResult && showScanWarning ? (
          <StatusMessage
            title={
              scanResult.totalFiles === 0
                ? "No files ready to organize"
                : "Scan completed with notes"
            }
            detail={scanResult.message}
            tone="warning"
          />
        ) : null}

        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <Card className="space-y-5 p-7 md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">
              Selected path
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="min-w-56 flex-1">
                <Input
                  value={selectedPath}
                  icon="folder_open"
                  readOnly
                  placeholder="/Select folder to begin"
                  aria-label="Selected folder path"
                />
              </div>
              <Button
                variant="secondary"
                disabled={
                  activeState === "scanning" || activeState === "organizing"
                }
                onClick={() => {
                  if (hasSelectedPath) {
                    clearSelection();
                    return;
                  }
                  void handleSelectFolder();
                }}
                title="Select folder (Cmd/Ctrl+O)"
              >
                {hasSelectedPath ? "Clear" : "Select folder"}
              </Button>
            </div>
          </Card>
          <Card className="space-y-4 p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">
              {activeState === "scanning"
                ? "Scanning"
                : activeState === "organizing"
                  ? "Organizing"
                  : settings.enablePreviewBeforeOrganizing
                    ? "Preview available"
                    : "Preview optional"}
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              icon={
                activeState === "scanning"
                  ? "progress_activity"
                  : "travel_explore"
              }
              disabled={
                !hasSelectedPath ||
                activeState === "scanning" ||
                activeState === "organizing"
              }
              onClick={() => {
                void handleScanClick();
              }}
              title="Scan files (Cmd/Ctrl+K)"
            >
              {activeState === "scanning" ? "Scanning files..." : "Scan files"}
            </Button>
            <p className="text-xs text-[#566166]">
              Shortcuts: Cmd/Ctrl+O select, Cmd/Ctrl+K scan, Cmd/Ctrl+Enter
              organize.
            </p>
          </Card>
        </section>

        {!hasSelectedPath ? (
          <Card className="p-6">
            <p className="text-sm text-[#566166]">
              Select a folder to start. You can run a scan preview first, then
              organize when ready.
            </p>
          </Card>
        ) : null}

        {canRenderResults ? (
          <section className="space-y-5">
            <SectionHeader
              title="File Breakdown"
              subtitle={
                activeState === "organizing"
                  ? "Applying folder structure..."
                  : undefined
              }
              meta={
                scanResult
                  ? `${scanResult.totalFiles} files detected`
                  : activeState === "organizing"
                    ? "Organizing files"
                    : "No scan data yet"
              }
            />
            <p className="text-sm text-[#566166]">
              Files will move into category folders in this location.
            </p>
            {scanResult ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
                {sortedCards.map((categorySummary) => {
                  const meta = CATEGORY_META[categorySummary.category];
                  const hasSamples = categorySummary.sampleFileNames.length > 0;
                  const samplePreview = hasSamples
                    ? categorySummary.sampleFileNames.slice(0, 3).join(", ")
                    : categorySummary.fileCount === 0
                      ? "0 files"
                      : undefined;
                  return (
                    <CategoryCard
                      key={categorySummary.category}
                      icon={meta.icon}
                      label={categorySummary.category}
                      count={String(categorySummary.fileCount)}
                      large={meta.large}
                      tone={meta.tone}
                      sample={samplePreview}
                    />
                  );
                })}
              </div>
            ) : (
              <Card className="p-6">
                <p className="text-sm text-[#566166]">
                  {activeState === "organizing"
                    ? "Preparing final scan details..."
                    : activeState === "scanning"
                      ? "Scanning folder and building preview..."
                      : "No preview available yet. Run a scan to see category breakdown."}
                </p>
              </Card>
            )}
          </section>
        ) : null}

        <section className="flex flex-col items-center gap-5 pb-10">
          <Button
            variant="primary"
            size="lg"
            icon={activeState === "organizing" ? "progress_activity" : "bolt"}
            className="rounded-2xl px-12"
            disabled={
              !hasSelectedPath ||
              activeState === "scanning" ||
              activeState === "organizing"
            }
            onClick={() => {
              void handleOrganizeClick();
            }}
            title="Organize files (Cmd/Ctrl+Enter)"
          >
            {activeState === "organizing"
              ? "Organizing files..."
              : "Organize files"}
          </Button>
          <p className="inline-flex items-center gap-2 text-sm text-[#566166]">
            <span className="material-symbols-outlined text-base">
              tips_and_updates
            </span>
            {activeState === "empty"
              ? settings.enablePreviewBeforeOrganizing
                ? "Choose a folder to preview and apply changes."
                : "Choose a folder to organize now, or scan first."
              : settings.enablePreviewBeforeOrganizing
                ? "Organize always runs a final scan before moving files."
                : "Scan is optional when preview-before-organize is off."}
          </p>
        </section>
      </div>
      {isConfirmModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f10]/40 px-4 backdrop-blur-sm">
          <Card
            className="w-full max-w-lg space-y-5 p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm organization"
          >
            <div>
              <h3 className="text-lg font-bold text-[#2a3439]">
                Confirm organization
              </h3>
              <p className="mt-2 text-sm text-[#566166]">
                {settings.enablePreviewBeforeOrganizing
                  ? "We will scan this folder first, then move files into category folders."
                  : "Files will be moved into category folders immediately."}
              </p>
              <p className="mt-3 rounded-xl bg-[#f0f4f7] px-3 py-2 text-xs text-[#2a3439]">
                {selectedPath}
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  void runOrganizeFlow();
                }}
              >
                Confirm and organize
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
