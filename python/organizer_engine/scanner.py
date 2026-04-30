from __future__ import annotations

import os
from collections import defaultdict
from typing import Dict, List

from .categorizer import detect_category
from .models import CATEGORY_ORDER, CategoryScanSummary, ScannedFileItem, utc_now_iso


def scan_source_directory(source_path: str) -> Dict[str, object]:
    absolute_source = os.path.abspath(source_path)
    if not os.path.isdir(absolute_source):
        raise ValueError(f"Directory does not exist: {absolute_source}")

    scanned_items: List[ScannedFileItem] = []
    category_names: Dict[str, List[str]] = defaultdict(list)
    category_sizes: Dict[str, int] = defaultdict(int)

    with os.scandir(absolute_source) as entries:
        file_entries = [entry for entry in entries if entry.is_file()]

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

    uncategorized = category_names.get("Others", [])
    return {
        "sourcePath": absolute_source,
        "scannedAtIso": utc_now_iso(),
        "totalFiles": len(scanned_items),
        "categorizedFiles": [item.to_dict() for item in scanned_items],
        "categorySummary": category_summary,
        "uncategorizedFileCount": len(uncategorized),
    }
