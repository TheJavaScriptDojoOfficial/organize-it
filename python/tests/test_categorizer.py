from __future__ import annotations

import unittest
from pathlib import Path
import sys

PROJECT_PYTHON_DIR = Path(__file__).resolve().parents[1]
if str(PROJECT_PYTHON_DIR) not in sys.path:
    sys.path.insert(0, str(PROJECT_PYTHON_DIR))

from organizer_engine.categorizer import detect_category


class DetectCategoryTests(unittest.TestCase):
    def test_macos_installers(self) -> None:
        self.assertEqual(detect_category("Studio.dmg"), "Applications")
        self.assertEqual(detect_category("Installer.pkg"), "Applications")
        self.assertEqual(detect_category("MyTool.app"), "Applications")

    def test_windows_installers(self) -> None:
        self.assertEqual(detect_category("Setup.exe"), "Applications")
        self.assertEqual(detect_category("Setup.msi"), "Applications")

    def test_ubuntu_packages(self) -> None:
        self.assertEqual(detect_category("package.deb"), "Applications")
        self.assertEqual(detect_category("Tool.AppImage"), "Applications")

    def test_common_archives_and_docs(self) -> None:
        self.assertEqual(detect_category("bundle.zip"), "Zip")
        self.assertEqual(detect_category("backup.tgz"), "Zip")
        self.assertEqual(detect_category("archive.tar.xz"), "Zip")
        self.assertEqual(detect_category("draft.docx"), "Documents")
        self.assertEqual(detect_category("slides.pptx"), "Documents")

    def test_case_insensitive_extensions(self) -> None:
        self.assertEqual(detect_category("REPORT.PDF"), "PDF")
        self.assertEqual(detect_category("DATA.CSV"), "Excel")
        self.assertEqual(detect_category("Image.JPEG"), "Images")
        self.assertEqual(detect_category("Archive.RaR"), "Zip")


if __name__ == "__main__":
    unittest.main()
