# Step 19 - Manual QA Checklist

## Goal

Verify the MVP end-to-end across core user flows and supported desktop platforms.

## Acceptance Criteria

- All critical flows pass manually.
- No blocking regressions in scan, organize, or settings behavior.
- Results are validated on macOS, Windows, and Ubuntu.

## Test Environment

- App build: `npm run tauri dev` (or packaged app build under test)
- Test data root:
  - macOS/Linux: `~/organize-it-qa/`
  - Windows: `%USERPROFILE%\organize-it-qa\`
- Reset app state before each platform run:
  - Clear any old test data folders.
  - Start app fresh.

## Shared Test Data Setup

Create these folders before running scenarios:

- `empty-folder/` (contains no files)
- `mixed-folder/` (documents, images, videos, audio, archives, unknown extension)
- `duplicates-folder/` (same filename appears more than once in different subfolders or repeated copies)
- `existing-categories-folder/` with pre-created category directories (for example: `Images/`, `Documents/`) and uncategorized files at root
- `permissions-folder/` containing at least one unreadable/unmovable file

Example files to include:

- `report.pdf`, `notes.txt`, `sheet.xlsx`
- `photo.jpg`, `graphic.png`
- `clip.mp4`, `song.mp3`
- `archive.zip`
- `mystery.xyz`

## Scenario Checklist

Mark each scenario as Pass/Fail and capture notes/screenshots for failures.

### 1) Scan Empty Folder

Steps:

1. Select `empty-folder/`.
2. Click `Scan files`.

Expected:

- Scan completes without crash.
- Preview shows zero files (or equivalent empty state).
- No organize action errors are triggered by the scan.

Status: [ ] Pass [ ] Fail  
Notes:

---

### 2) Scan Mixed Folder

Steps:

1. Select `mixed-folder/`.
2. Click `Scan files`.

Expected:

- Scan completes successfully.
- Category cards/summary appear.
- Counts look correct for each category.
- Unknown/unmapped extensions are handled gracefully (for example in `Others`).

Status: [ ] Pass [ ] Fail  
Notes:

---

### 3) Scan Folder With Duplicates

Steps:

1. Select `duplicates-folder/`.
2. Click `Scan files`.

Expected:

- Scan completes successfully.
- Duplicate filenames do not crash scanning.
- File counts reflect all discovered files.

Status: [ ] Pass [ ] Fail  
Notes:

---

### 4) Organize Folder With Existing Category Folders

Steps:

1. Select `existing-categories-folder/`.
2. Run `Scan files`.
3. Click `Organize`.
4. Confirm organize (if confirmation setting is enabled).

Expected:

- Organize completes successfully.
- Existing category folders are reused (not duplicated with odd suffixes unless needed).
- Files move into appropriate category folders.
- Success state shows moved count and folder creation/reuse behavior correctly.

Status: [ ] Pass [ ] Fail  
Notes:

---

### 5) Organize Folder With Permissions Issue

Steps:

1. Select `permissions-folder/`.
2. Run `Scan files`.
3. Click `Organize`.

Expected:

- App does not crash.
- Operation returns graceful error or partial-failure feedback.
- Any non-movable files are reported clearly.
- Movable files still complete if partial success is supported.

Status: [ ] Pass [ ] Fail  
Notes:

---

### 6) Settings Persistence After Restart

Steps:

1. Change settings in the app (for example organize confirmation toggle and/or default behavior).
2. Close the app completely.
3. Re-open the app.

Expected:

- Updated settings persist across restart.
- Last selected folder/settings values restore as expected.
- No reset to defaults unless explicitly requested.

Status: [ ] Pass [ ] Fail  
Notes:

---

## Platform Matrix

Run all scenarios above on each platform.

### macOS

- Environment:
- Result: [ ] Pass [ ] Fail
- Notes:

### Windows

- Environment:
- Result: [ ] Pass [ ] Fail
- Notes:

### Ubuntu

- Environment:
- Result: [ ] Pass [ ] Fail
- Notes:

## Final Signoff

- Critical flows passing: [ ] Yes [ ] No
- Blocking issues found: [ ] Yes [ ] No
- Ready for MVP handoff: [ ] Yes [ ] No

Owner:
Date:
