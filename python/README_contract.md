# Python JSON Contract (Frozen)

This document defines the **exact JSON response contract** for Python commands.
Use this as the source of truth for both frontend and backend integration.

## Scope

Commands:
- `scan`
- `organize`

Response scenarios:
- scan success
- scan error
- organize success
- organize partial failure
- organize error

## Contract Rules

1. Top-level keys are fixed for every response.
2. Do not rename keys.
3. If a key is not applicable for a scenario, return `null`, `[]`, or `{}` as documented below.
4. `failedFiles` is the authoritative per-file failure list.
5. `message` is always present and human-readable.

## Top-level shape (all responses)

```json
{
  "success": true,
  "command": "scan",
  "sourcePath": "/abs/path",
  "totalFiles": 0,
  "categories": [],
  "movedCount": 0,
  "createdFolders": [],
  "skippedFiles": [],
  "failedFiles": [],
  "message": "..."
}
```

## Field definitions

- `success` (boolean): overall command success.
- `command` ("scan" | "organize"): command that produced the response.
- `sourcePath` (string): absolute source directory path.
- `totalFiles` (number): number of files discovered in source at operation start.
- `categories` (array): per-category summary.
  - For `scan`: populated.
  - For `organize`: may be empty unless explicitly produced.
- `movedCount` (number): count of moved files (organize), `0` for scan.
- `createdFolders` (string[]): created category folders (organize), `[]` for scan.
- `skippedFiles` (string[]): files intentionally not moved/processed (non-fatal).
- `failedFiles` (array): per-file failures.
  - Shape: `{ "path": string, "reason": string }`
- `message` (string): stable user-facing summary.

## 1) Scan Success

```json
{
  "success": true,
  "command": "scan",
  "sourcePath": "/Users/me/Downloads",
  "totalFiles": 68,
  "categories": [
    {
      "name": "Images",
      "count": 24
    },
    {
      "name": "Videos",
      "count": 8
    }
  ],
  "movedCount": 0,
  "createdFolders": [],
  "skippedFiles": [],
  "failedFiles": [],
  "message": "Scan completed successfully."
}
```

## 2) Scan Error

```json
{
  "success": false,
  "command": "scan",
  "sourcePath": "/Users/me/MissingFolder",
  "totalFiles": 0,
  "categories": [],
  "movedCount": 0,
  "createdFolders": [],
  "skippedFiles": [],
  "failedFiles": [],
  "message": "Directory does not exist: /Users/me/MissingFolder"
}
```

## 3) Organize Success

```json
{
  "success": true,
  "command": "organize",
  "sourcePath": "/Users/me/Downloads",
  "totalFiles": 68,
  "categories": [],
  "movedCount": 68,
  "createdFolders": [
    "/Users/me/Downloads/Images",
    "/Users/me/Downloads/Videos"
  ],
  "skippedFiles": [],
  "failedFiles": [],
  "message": "Organization completed successfully."
}
```

## 4) Organize Partial Failure

```json
{
  "success": true,
  "command": "organize",
  "sourcePath": "/Users/me/Downloads",
  "totalFiles": 68,
  "categories": [],
  "movedCount": 65,
  "createdFolders": [
    "/Users/me/Downloads/Images",
    "/Users/me/Downloads/Videos"
  ],
  "skippedFiles": [
    "/Users/me/Downloads/.DS_Store"
  ],
  "failedFiles": [
    {
      "path": "/Users/me/Downloads/locked.pdf",
      "reason": "Permission denied"
    },
    {
      "path": "/Users/me/Downloads/in_use.mp4",
      "reason": "File is in use"
    }
  ],
  "message": "Organization completed with partial failures."
}
```

## 5) Organize Error

```json
{
  "success": false,
  "command": "organize",
  "sourcePath": "/Users/me/Downloads",
  "totalFiles": 0,
  "categories": [],
  "movedCount": 0,
  "createdFolders": [],
  "skippedFiles": [],
  "failedFiles": [],
  "message": "Failed to organize: source path is not accessible."
}
```

## Compatibility note (current implementation)

Current Python CLI output uses:
- `ok` instead of `success`
- nested `data` / `error.message`

When updating implementation, align producer and consumer to this frozen contract so frontend and backend use one shape without guesswork.
