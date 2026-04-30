from __future__ import annotations

import os
import shutil
from typing import Dict, List, Set

from .categorizer import detect_category
from .models import OrganizedFileMove
from .utils import build_duplicate_safe_path


def organize_source_directory(source_path: str) -> Dict[str, object]:
    absolute_source = os.path.abspath(source_path)
    if not os.path.isdir(absolute_source):
        raise ValueError(f"Directory does not exist: {absolute_source}")

    moved_files: List[Dict[str, str]] = []
    skipped_files: List[str] = []
    failed_files: List[Dict[str, str]] = []
    created_folders: Set[str] = set()
    has_subfolders = False

    try:
        with os.scandir(absolute_source) as entries:
            file_entries = []
            for entry in entries:
                if entry.name.startswith("."):
                    if entry.is_file():
                        skipped_files.append(entry.path)
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
        category_folder = os.path.join(absolute_source, category)
        try:
            os.makedirs(category_folder, exist_ok=True)
        except PermissionError:
            failed_files.append({"path": entry.path, "reason": "Permission denied creating target folder."})
            skipped_files.append(entry.path)
            continue
        created_folders.add(category_folder)

        target_path = build_duplicate_safe_path(category_folder, entry.name)

        try:
            shutil.move(entry.path, target_path)
            moved_files.append(
                OrganizedFileMove(
                    fileName=entry.name,
                    fromPath=entry.path,
                    toPath=target_path,
                    category=category,
                ).to_dict()
            )
        except PermissionError:
            skipped_files.append(entry.path)
            failed_files.append({"path": entry.path, "reason": "Permission denied or file is currently in use."})
        except Exception as error:
            skipped_files.append(entry.path)
            failed_files.append({"path": entry.path, "reason": str(error)})

    if file_entries:
        message = (
            "Organization completed with partial failures."
            if failed_files
            else "Organization completed successfully."
        )
    elif has_subfolders:
        message = (
            "No files were organized because only subfolders were found."
            if not skipped_files
            else "No files were organized. Hidden files were skipped and only subfolders were found."
        )
    else:
        message = (
            "No files were organized because the selected folder is empty."
            if not skipped_files
            else "No visible files were organized because hidden files were skipped."
        )

    return {
        "sourcePath": absolute_source,
        "totalFiles": len(file_entries),
        "categories": [],
        "movedCount": len(moved_files),
        "createdFolders": sorted(created_folders),
        "skippedFiles": sorted(skipped_files),
        "failedFiles": sorted(failed_files, key=lambda item: item["path"].lower()),
        "message": message,
    }
