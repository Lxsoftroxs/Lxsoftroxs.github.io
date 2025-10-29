#!/usr/bin/env python3
"""
Diary Photo Updater
Renames diary photos sequentially and generates YAML metadata.
"""
import os
import sys
import yaml
from pathlib import Path

DEST = "assets/diary"
DATA = "_data/diary_photos.yml"
SUPPORTED_FORMATS = (".jpg", ".jpeg", ".png", ".webp")

def main():
    """Main execution function with error handling."""
    try:
        # Validate directory exists
        if not os.path.isdir(DEST):
            print(f"Error: Directory '{DEST}' does not exist.", file=sys.stderr)
            return 1

        # Read existing entries if any
        existing_photos = []
        if os.path.exists(DATA):
            try:
                with open(DATA, 'r', encoding='utf-8') as f:
                    existing_photos = yaml.safe_load(f) or []
                print(f"Loaded {len(existing_photos)} existing entries from {DATA}")
            except yaml.YAMLError as e:
                print(f"Warning: Could not parse {DATA}: {e}", file=sys.stderr)
            except Exception as e:
                print(f"Warning: Could not read {DATA}: {e}", file=sys.stderr)

        # Collect image files (excluding WebP originals, they're generated)
        files = []
        for f in os.listdir(DEST):
            if f.lower().endswith((".jpg", ".jpeg", ".png")):
                files.append(f)

        if not files:
            print(f"No image files found in {DEST}")
            return 0

        print(f"Found {len(files)} image files to process")

        # Sort files to maintain consistent ordering
        files.sort()

        # Rename files and build metadata list
        photos = []
        counter = 1
        renamed_count = 0

        for f in files:
            ext = os.path.splitext(f)[1].lower()
            newname = f"photo_{counter:03d}{ext}"
            old_path = os.path.join(DEST, f)
            new_path = os.path.join(DEST, newname)

            # Rename if needed
            if f != newname:
                try:
                    os.rename(old_path, new_path)
                    renamed_count += 1
                    print(f"  Renamed: {f} -> {newname}")
                except OSError as e:
                    print(f"  Error renaming {f}: {e}", file=sys.stderr)
                    continue

            # Create metadata entry
            photos.append({
                "id": f"photo_{counter:03d}",
                "src": f"/{DEST}/{newname}",
                "caption": f"Untitled {counter:03d}"
            })
            counter += 1

        # Ensure data directory exists
        data_dir = os.path.dirname(DATA)
        if data_dir:
            os.makedirs(data_dir, exist_ok=True)

        # Write YAML file
        try:
            with open(DATA, 'w', encoding='utf-8') as f:
                yaml.safe_dump(photos, f, sort_keys=False, width=80, allow_unicode=True)
            print(f"\n✓ Successfully updated {DATA} with {len(photos)} photos")
            print(f"✓ Renamed {renamed_count} files")
            return 0
        except Exception as e:
            print(f"Error writing {DATA}: {e}", file=sys.stderr)
            return 1

    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
