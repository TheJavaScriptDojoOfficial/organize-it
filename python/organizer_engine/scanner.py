from __future__ import annotations

import os
from collections import defaultdict
from typing import Dict, List

from .categorizer import detect_category
from .models import CATEGORY_ORDER, CategoryScanSummary, ScannedFileItem


def scan_source_directory(source_path: str) -> Dict[str, object]:
    absolute_source = os.path.abspath(source_path)
    if not os.path.isdir(absolute_source):
        raise ValueError(f"Directory does not exist: {absolute_source}")

    scanned_items: List[ScannedFileItem] = []
    category_names: Dict[str, List[str]] = defaultdict(list)
    category_sizes: Dict[str, int] = defaultdict(int)
    skipped_hidden_files: List[str] = []
    has_subfolders = False

    try:
        with os.scandir(absolute_source) as entries:
            file_entries = []
            for entry in entries:
                if entry.name.startswith("."):
                    if entry.is_file():
                        skipped_hidden_files.append(entry.path)
                    continue
                if entry.is_dir():
                    has_subfolders = True
                    continue
                if entry.is_file():
                    file_entries.append(entry)
    except PermissionError as error:
        raise PermissionError(
            f"Permission denied while reading folder: {absolute_source}"
        ) from error

    file_entries.sort(key=lambda entry: entry.name.lower())
    for entry in file_entries:
        category = detect_category(entry.name)
        extension = os.path.splitext(entry.name)[1].lower()
        file_size = entry.stat().st_size

        scanned_items.append(
            ScannedFileItem(
                name=entry.name,
                absolutePath=entry.path,
                extension=extension,
                sizeInBytes=file_size,
                category=category,
            )
        )
        category_names[category].append(entry.name)
        category_sizes[category] += file_size

    category_summary = []
    for category in CATEGORY_ORDER:
        names = category_names.get(category, [])
        category_summary.append(
            CategoryScanSummary(
                category=category,
                fileCount=len(names),
                totalSizeInBytes=category_sizes.get(category, 0),
                sampleFileNames=names[:3],
            ).to_dict()
        )

    if file_entries:
        message = "Scan completed successfully."
        if skipped_hidden_files:
            message = f"Scan completed. Skipped {len(skipped_hidden_files)} hidden file(s)."
    elif has_subfolders:
        message = (
            "No files found in the selected folder. Only subfolders were detected."
            if not skipped_hidden_files
            else "No files found. Hidden files were skipped and only subfolders were detected."
        )
    else:
        message = (
            "Selected folder is empty."
            if not skipped_hidden_files
            else "No visible files found. Hidden files were skipped."
        )

    return {
        "sourcePath": absolute_source,
        "totalFiles": len(scanned_items),
        "categories": [{"name": item["category"], "count": item["fileCount"]} for item in category_summary],
        "movedCount": 0,
        "createdFolders": [],
        "skippedFiles": sorted(skipped_hidden_files),
        "failedFiles": [],
        "message": message,
    }
