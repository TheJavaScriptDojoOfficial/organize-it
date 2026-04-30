import type { OrganizeResult, ScanResult } from "../types/organizer";

export const MOCK_SELECTED_PATH = "/Users/demo/Downloads";

export const MOCK_SCAN_RESPONSE: ScanResult = {
  sourcePath: MOCK_SELECTED_PATH,
  scannedAtIso: "2026-04-30T10:15:00.000Z",
  totalFiles: 68,
  categorizedFiles: [
    {
      name: "vacation_photo_01.jpg",
      absolutePath: "/Users/demo/Downloads/vacation_photo_01.jpg",
      extension: "jpg",
      sizeInBytes: 2_450_024,
      category: "Images",
    },
    {
      name: "dashboard_mock.png",
      absolutePath: "/Users/demo/Downloads/dashboard_mock.png",
      extension: "png",
      sizeInBytes: 1_650_024,
      category: "Images",
    },
    {
      name: "launch_demo.mov",
      absolutePath: "/Users/demo/Downloads/launch_demo.mov",
      extension: "mov",
      sizeInBytes: 14_650_024,
      category: "Videos",
    },
    {
      name: "quarterly_report.pdf",
      absolutePath: "/Users/demo/Downloads/quarterly_report.pdf",
      extension: "pdf",
      sizeInBytes: 860_024,
      category: "PDF",
    },
    {
      name: "invoice_april.xlsx",
      absolutePath: "/Users/demo/Downloads/invoice_april.xlsx",
      extension: "xlsx",
      sizeInBytes: 120_024,
      category: "Excel",
    },
    {
      name: "meeting_notes.docx",
      absolutePath: "/Users/demo/Downloads/meeting_notes.docx",
      extension: "docx",
      sizeInBytes: 224_096,
      category: "Documents",
    },
    {
      name: "source_backup.zip",
      absolutePath: "/Users/demo/Downloads/source_backup.zip",
      extension: "zip",
      sizeInBytes: 9_120_024,
      category: "Zip",
    },
    {
      name: "editor_setup.dmg",
      absolutePath: "/Users/demo/Downloads/editor_setup.dmg",
      extension: "dmg",
      sizeInBytes: 92_100_024,
      category: "Applications",
    },
    {
      name: "organizer-service.ts",
      absolutePath: "/Users/demo/Downloads/organizer-service.ts",
      extension: "ts",
      sizeInBytes: 78_024,
      category: "Code Files",
    },
    {
      name: "notes.raw",
      absolutePath: "/Users/demo/Downloads/notes.raw",
      extension: "raw",
      sizeInBytes: 42_024,
      category: "Others",
    },
  ],
  categorySummary: [
    {
      category: "Images",
      fileCount: 24,
      totalSizeInBytes: 78_032_124,
      sampleFileNames: ["vacation_photo_01.jpg", "dashboard_mock.png", "logo_v2.svg"],
    },
    {
      category: "Videos",
      fileCount: 8,
      totalSizeInBytes: 240_032_124,
      sampleFileNames: ["demo_recording.mp4", "launch_demo.mov"],
    },
    {
      category: "PDF",
      fileCount: 6,
      totalSizeInBytes: 19_032_124,
      sampleFileNames: ["quarterly_report.pdf", "proposal_v7.pdf"],
    },
    {
      category: "Excel",
      fileCount: 4,
      totalSizeInBytes: 6_032_124,
      sampleFileNames: ["invoice_april.xlsx", "budget_q2.xls"],
    },
    {
      category: "Documents",
      fileCount: 15,
      totalSizeInBytes: 18_032_124,
      sampleFileNames: ["project_brief.docx", "meeting_notes.docx"],
    },
    {
      category: "Zip",
      fileCount: 3,
      totalSizeInBytes: 42_032_124,
      sampleFileNames: ["source_backup.zip", "assets_bundle.zip"],
    },
    {
      category: "Applications",
      fileCount: 2,
      totalSizeInBytes: 192_032_124,
      sampleFileNames: ["editor_setup.dmg", "capture_tool.pkg"],
    },
    {
      category: "Code Files",
      fileCount: 5,
      totalSizeInBytes: 2_132_124,
      sampleFileNames: ["organizer-service.ts", "parser.py"],
    },
    {
      category: "Others",
      fileCount: 1,
      totalSizeInBytes: 420_024,
      sampleFileNames: ["notes.raw"],
    },
  ],
  uncategorizedFileCount: 0,
};

export const MOCK_ORGANIZE_RESPONSE: OrganizeResult = {
  sourcePath: MOCK_SELECTED_PATH,
  totalFiles: 68,
  categories: MOCK_SCAN_RESPONSE.categorySummary,
  movedCount: 68,
  failedFiles: [],
  message: "Organization completed successfully.",
  skippedFiles: ["readme.txt"],
  createdFolders: ["Images", "Videos", "PDF", "Documents", "Code Files", "Others", "Zip", "Applications"],
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function mockScanFolder(): Promise<ScanResult> {
  await delay(800);
  return MOCK_SCAN_RESPONSE;
}

export async function mockOrganizeFolder(): Promise<OrganizeResult> {
  await delay(900);
  return MOCK_ORGANIZE_RESPONSE;
}
