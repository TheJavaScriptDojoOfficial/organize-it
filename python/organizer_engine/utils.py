from __future__ import annotations

import json
import os
from typing import Any, Dict, Tuple


def build_duplicate_safe_path(target_directory: str, original_name: str) -> str:
    base, extension = os.path.splitext(original_name)
    candidate = os.path.join(target_directory, original_name)
    counter = 1

    while os.path.exists(candidate):
        candidate_name = f"{base} ({counter}){extension}"
        candidate = os.path.join(target_directory, candidate_name)
        counter += 1

    return candidate


def split_action_and_path(args: list[str]) -> Tuple[str, str]:
    if not args:
        raise ValueError("Expected command and source path.")

    action = args[0].strip().lower()
    if action in {"scan", "organize"}:
        if len(args) < 2:
            raise ValueError("Expected source path.")
        return action, args[1].strip()

    compact = args[0].strip()
    for command in ("scan", "organize"):
        if compact.lower().startswith(command) and len(compact) > len(command):
            return command, compact[len(command) :].strip()

    raise ValueError("Command must be one of: scan, organize.")


def stable_json(payload: Dict[str, Any]) -> str:
    return json.dumps(payload, indent=2, sort_keys=True)


def success_payload(command: str, data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "success": True,
        "command": command,
        "sourcePath": str(data.get("sourcePath", "")),
        "totalFiles": int(data.get("totalFiles", 0)),
        "categories": list(data.get("categories", [])),
        "movedCount": int(data.get("movedCount", 0)),
        "createdFolders": list(data.get("createdFolders", [])),
        "skippedFiles": list(data.get("skippedFiles", [])),
        "failedFiles": list(data.get("failedFiles", [])),
        "message": str(data.get("message", "Operation completed successfully.")),
    }


def error_payload(command: str, message: str) -> Dict[str, Any]:
    return {
        "success": False,
        "command": command,
        "sourcePath": "",
        "totalFiles": 0,
        "categories": [],
        "movedCount": 0,
        "createdFolders": [],
        "skippedFiles": [],
        "failedFiles": [],
        "message": message,
    }
