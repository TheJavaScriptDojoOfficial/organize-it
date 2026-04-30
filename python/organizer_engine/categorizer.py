from __future__ import annotations

import os


RAW_EXTENSION_CATEGORY_MAP = {
    "Images": {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".heic"},
    "Videos": {".mp4", ".mov", ".mkv", ".avi", ".wmv", ".flv", ".webm"},
    "PDF": {".pdf"},
    "Excel": {".xls", ".xlsx", ".xlsm", ".csv"},
    "Documents": {
        ".doc",
        ".docx",
        ".txt",
        ".rtf",
        ".odt",
        ".ppt",
        ".pptx",
        ".pages",
        ".key",
        ".odp",
        ".ods",
    },
    "Zip": {".zip", ".zipx", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz", ".tgz"},
    "Applications": {".dmg", ".pkg", ".app", ".exe", ".msi", ".deb", ".appimage"},
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


EXTENSION_CATEGORY_MAP = {
    category: {extension.lower() for extension in extensions}
    for category, extensions in RAW_EXTENSION_CATEGORY_MAP.items()
}


def detect_category(file_name: str) -> str:
    _, extension = os.path.splitext(file_name)
    normalized_extension = extension.lower()
    for category, extensions in EXTENSION_CATEGORY_MAP.items():
        if normalized_extension in extensions:
            return category
    return "Others"
