import { useMemo, useState } from "react";
import CategoryCard from "../components/organizer/CategoryCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import SectionHeader from "../components/ui/SectionHeader";
import StatusMessage from "../components/ui/StatusMessage";
import {
  MOCK_ORGANIZE_RESPONSE,
  MOCK_SELECTED_PATH,
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

const PREVIEW_STATES: Array<{ key: PageState; label: string }> = [
  { key: "empty", label: "Empty" },
  { key: "selected", label: "Selected Folder" },
  { key: "scanning", label: "Scanning" },
  { key: "preview", label: "Preview" },
  { key: "organizing", label: "Organizing" },
  { key: "success", label: "Success" },
  { key: "error", label: "Error" },
];

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
  const canRenderResults = ["preview", "organizing", "success", "error"].includes(activeState);

  const sortedCards = useMemo(() => {
    if (!scanResult) {
      return [];
    }

    return [...scanResult.categorySummary].sort((a, b) => b.fileCount - a.fileCount);
  }, [scanResult]);

  function seedForState(state: PageState): void {
    switch (state) {
      case "empty":
        setSelectedPath("");
        setScanResult(null);
        setOrganizeResult(null);
        setErrorText("");
        break;
      case "selected":
        setSelectedPath(MOCK_SELECTED_PATH);
        setScanResult(null);
        setOrganizeResult(null);
        setErrorText("");
        break;
      case "scanning":
        setSelectedPath(MOCK_SELECTED_PATH);
        setScanResult(null);
        setOrganizeResult(null);
        setErrorText("");
        break;
      case "preview":
        setSelectedPath(MOCK_SELECTED_PATH);
        void mockScanFolder().then((mockResult) => {
          setScanResult(mockResult);
          setOrganizeResult(null);
        });
        setErrorText("");
        break;
      case "organizing":
        setSelectedPath(MOCK_SELECTED_PATH);
        void mockScanFolder().then((mockResult) => {
          setScanResult(mockResult);
        });
        setOrganizeResult(null);
        setErrorText("");
        break;
      case "success":
        setSelectedPath(MOCK_SELECTED_PATH);
        void mockScanFolder().then((mockResult) => {
          setScanResult(mockResult);
        });
        setOrganizeResult(MOCK_ORGANIZE_RESPONSE);
        setErrorText("");
        break;
      case "error":
        setSelectedPath(MOCK_SELECTED_PATH);
        setScanResult(null);
        setOrganizeResult(null);
        setErrorText("Could not organize files. Please retry once the folder is accessible.");
        break;
    }
  }

  function onPreviewStateChange(state: PageState): void {
    setPreviewState(state);
    seedForState(state);
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

        <section className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#566166]">
            State Preview Controls
          </p>
          <div className="flex flex-wrap gap-2">
            {PREVIEW_STATES.map((stateOption) => (
              <Button
                key={stateOption.key}
                variant={previewState === stateOption.key ? "primary" : "secondary"}
                size="sm"
                onClick={() => onPreviewStateChange(stateOption.key)}
              >
                {stateOption.label}
              </Button>
            ))}
          </div>
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
                onClick={() => {
                  if (activeState === "empty") {
                    onPreviewStateChange("selected");
                    return;
                  }
                  onPreviewStateChange("empty");
                }}
              >
                {activeState === "empty" ? "Use mock folder" : "Clear"}
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
