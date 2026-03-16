#!/usr/bin/env python3
"""
Read corrections.json and print a status report. Run manually to track progress.
Usage: python check-status.py
"""
import json
from pathlib import Path

CORRECTIONS_PATH = Path(__file__).parent / "corrections.json"


def main():
    with open(CORRECTIONS_PATH) as f:
        data = json.load(f)
    print("Entity corrections status")
    print("=" * 40)
    for name, entry in data.items():
        status = entry.get("status", "UNKNOWN")
        url = entry.get("url", "(no URL)")
        print(f"  {name}: {status} — {url}")
    print("=" * 40)


if __name__ == "__main__":
    main()
