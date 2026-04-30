export const ORGANIZER_CATEGORIES = [
  "Images",
  "Videos",
  "PDF",
  "Excel",
  "Documents",
  "Zip",
  "Applications",
  "Code Files",
  "Others",
] as const;

export const DEFAULT_CATEGORY_FOLDER_MAP: Record<(typeof ORGANIZER_CATEGORIES)[number], string> = {
  Images: "Images",
  Videos: "Videos",
  PDF: "PDF",
  Excel: "Excel",
  Documents: "Documents",
  Zip: "Zip",
  Applications: "Applications",
  "Code Files": "Code Files",
  Others: "Others",
};
