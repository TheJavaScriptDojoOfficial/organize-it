from __future__ import annotations

import os


EXTENSION_CATEGORY_MAP = {
    "Images": {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".heic"},
    "Videos": {".mp4", ".mov", ".mkv", ".avi", ".wmv", ".flv", ".webm"},
    "PDF": {".pdf"},
    "Excel": {".xls", ".xlsx", ".csv"},
    "Documents": {".doc", ".docx", ".txt", ".rtf", ".odt", ".ppt", ".pptx"},
    "Zip": {".zip", ".rar", ".7z", ".tar", ".gz", ".bz2"},
    "Applications": {".dmg", ".pkg", ".app", ".exe", ".msi", ".deb"},
    "Code Files": {
        ".py",
        ".js",
        ".ts",
        ".tsx",
        ".jsx",
        ".java",
        ".go",
        ".rs",
        ".cpp",
        ".c",
        ".h",
        ".hpp",
        ".json",
        ".yml",
        ".yaml",
        ".md",
        ".html",
        ".css",
        ".scss",
        ".sh",
    },
}


def detect_category(file_name: str) -> str:
    _, extension = os.path.splitext(file_name)
    normalized_extension = extension.lower()
    for category, extensions in EXTENSION_CATEGORY_MAP.items():
        if normalized_extension in extensions:
            return category
    return "Others"
