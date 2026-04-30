import { useMemo, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import CategoryCard from "../components/organizer/CategoryCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import SectionHeader from "../components/ui/SectionHeader";
import StatusMessage from "../components/ui/StatusMessage";
import {
  mockOrganizeFolder,
  mockScanFolder,
} from "../lib/api/mock-organizer";
import type { CategoryName, OrganizeResult, ScanResult } from "../lib/types/organizer";

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
  { icon: string; tone?: "default" | "primary" | "error" | "tertiary"; large?: boolean }
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
  const [previewState, setPreviewState] = useState<PageState>("empty");
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [organizeResult, setOrganizeResult] = useState<OrganizeResult | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  const activeState = previewState;
  const hasSelectedPath = selectedPath.length > 0;
  const canRenderResults =
    hasSelectedPath && ["preview", "organizing", "success", "error"].includes(activeState);

  const sortedCards = useMemo(() => {
    if (!scanResult) {
      return [];
    }

    return [...scanResult.categorySummary].sort((a, b) => b.fileCount - a.fileCount);
  }, [scanResult]);

  function clearSelection(state: PageState = "empty"): void {
    setPreviewState(state);
    setSelectedPath("");
    setScanResult(null);
    setOrganizeResult(null);
    setErrorText("");
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
    } catch {
      setPreviewState("error");
      setErrorText("Could not open folder picker. Please retry in the desktop app.");
    }
  }

  async function handleScanClick(): Promise<void> {
    if (!hasSelectedPath || activeState === "scanning" || activeState === "organizing") {
      return;
    }

    setPreviewState("scanning");
    setErrorText("");
    setOrganizeResult(null);
    try {
      const result = await mockScanFolder();
      setScanResult(result);
      setPreviewState("preview");
    } catch {
      setPreviewState("error");
      setErrorText("Scan failed in mock mode.");
    }
  }

  async function handleOrganizeClick(): Promise<void> {
    if (!scanResult || activeState === "organizing" || activeState === "scanning") {
      return;
    }

    setPreviewState("organizing");
    setErrorText("");
    try {
      const result = await mockOrganizeFolder();
      setOrganizeResult(result);
      setPreviewState("success");
    } catch {
      setPreviewState("error");
      setErrorText("Organization failed in mock mode.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fb] px-6 py-10 text-[#2a3439]">
      <div className="mx-auto max-w-5xl space-y-10">
        <section className="space-y-3 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-[2.75rem]">Organize Downloads</h1>
          <p className="mx-auto max-w-2xl text-sm text-[#566166]">
            Clean your folders in one click with the precision of a digital atelier. Automated
            categorization at your fingertips.
          </p>
        </section>

        {activeState === "success" && organizeResult ? (
          <StatusMessage
            title="Files organized successfully"
            detail={`${organizeResult.totalMovedFiles} files moved • ${organizeResult.createdFolders.length} folders created`}
            actionLabel="Undo"
          />
        ) : null}

        {activeState === "error" ? (
          <StatusMessage title="Something went wrong" detail={errorText || "Could not complete request"} />
        ) : null}

        <section className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <Card className="space-y-5 p-7 md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">Selected path</p>
            <div className="flex flex-wrap gap-3">
              <div className="min-w-56 flex-1">
                <Input value={selectedPath} icon="folder_open" readOnly placeholder="/Select folder to begin" />
              </div>
              <Button
                variant="secondary"
                disabled={activeState === "scanning" || activeState === "organizing"}
                onClick={() => {
                  if (hasSelectedPath) {
                    clearSelection();
                    return;
                  }
                  void handleSelectFolder();
                }}
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
                  : "Ready to index"}
            </p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              icon={activeState === "scanning" ? "progress_activity" : "search_insights"}
              disabled={!hasSelectedPath || activeState === "scanning" || activeState === "organizing"}
              onClick={() => {
                void handleScanClick();
              }}
            >
              {activeState === "scanning" ? "Scanning files..." : "Scan Files"}
            </Button>
          </Card>
        </section>

        {!hasSelectedPath ? (
          <Card className="p-6">
            <p className="text-sm text-[#566166]">
              Select a destination folder to preview categorized files before organizing.
            </p>
          </Card>
        ) : null}

        {canRenderResults ? (
          <section className="space-y-5">
            <SectionHeader
              title="File Breakdown"
              subtitle={activeState === "organizing" ? "Applying folder structure..." : undefined}
              meta={
                scanResult
                  ? `${scanResult.totalFiles} files detected`
                  : activeState === "organizing"
                    ? "Organizing files"
                    : "No scan data yet"
              }
            />
            {scanResult ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:grid-rows-2">
                {sortedCards.map((categorySummary) => {
                  const meta = CATEGORY_META[categorySummary.category];
                  return (
                    <CategoryCard
                      key={categorySummary.category}
                      icon={meta.icon}
                      label={categorySummary.category}
                      count={String(categorySummary.fileCount)}
                      large={meta.large}
                      tone={meta.tone}
                      sample={categorySummary.sampleFileNames.join(", ")}
                    />
                  );
                })}
              </div>
            ) : (
              <Card className="p-6">
                <p className="text-sm text-[#566166]">
                  {activeState === "organizing"
                    ? "Loading mock scan details..."
                    : "No scan preview available in this state."}
                </p>
              </Card>
            )}
          </section>
        ) : null}

        <section className="flex flex-col items-center gap-5 pb-10">
          <Button
            variant="primary"
            size="lg"
            icon={activeState === "organizing" ? "progress_activity" : "auto_mode"}
            className="rounded-2xl px-12"
            disabled={!scanResult || activeState === "scanning" || activeState === "organizing"}
            onClick={() => {
              void handleOrganizeClick();
            }}
          >
            {activeState === "organizing" ? "Organizing..." : "Organize My Files"}
          </Button>
          <p className="inline-flex items-center gap-2 text-sm text-[#566166]">
            <span className="material-symbols-outlined text-base">info</span>
            {activeState === "empty"
              ? "Pick a folder to begin scanning"
              : "Files will be moved into categorized folders"}
          </p>
        </section>
      </div>
    </main>
  );
}
