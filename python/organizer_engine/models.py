from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List


CATEGORY_ORDER = [
    "Images",
    "Videos",
    "PDF",
    "Excel",
    "Documents",
    "Zip",
    "Applications",
    "Code Files",
    "Others",
]


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass(frozen=True)
class ScannedFileItem:
    name: str
    absolutePath: str
    extension: str
    sizeInBytes: int
    category: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "absolutePath": self.absolutePath,
            "extension": self.extension,
            "sizeInBytes": self.sizeInBytes,
            "category": self.category,
        }


@dataclass(frozen=True)
class CategoryScanSummary:
    category: str
    fileCount: int
    totalSizeInBytes: int
    sampleFileNames: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "category": self.category,
            "fileCount": self.fileCount,
            "totalSizeInBytes": self.totalSizeInBytes,
            "sampleFileNames": self.sampleFileNames,
        }


@dataclass(frozen=True)
class OrganizedFileMove:
    fileName: str
    fromPath: str
    toPath: str
    category: str

    def to_dict(self) -> Dict[str, Any]:
        return {
            "fileName": self.fileName,
            "fromPath": self.fromPath,
            "toPath": self.toPath,
            "category": self.category,
        }
