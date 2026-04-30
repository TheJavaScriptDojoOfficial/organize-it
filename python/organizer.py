#!/usr/bin/env python3
from __future__ import annotations

import sys

from organizer_engine import organize_source_directory, scan_source_directory
from organizer_engine.utils import (
    error_payload,
    split_action_and_path,
    stable_json,
    success_payload,
)


def main(argv: list[str]) -> int:
    command = "unknown"
    try:
        command, source_path = split_action_and_path(argv)
        if command == "scan":
            data = scan_source_directory(source_path)
        elif command == "organize":
            data = organize_source_directory(source_path)
        else:
            raise ValueError(f"Unsupported command: {command}")

        print(stable_json(success_payload(command, data)))
        return 0
    except Exception as error:
        print(stable_json(error_payload(command, str(error))))
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
