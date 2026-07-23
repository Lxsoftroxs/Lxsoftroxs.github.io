#!/usr/bin/env python3
import os, sys, yaml, re

DEST = "assets/images/diary"
DATA = "_data/diary_photos.yml"

# read existing entries if any
if os.path.exists(DATA):
    with open(DATA) as f:
        photos = yaml.safe_load(f) or []
else:
    photos = []

# normalize existing IDs (entries from other tools may lack one)
ids = {p.get("id") for p in photos if isinstance(p, dict)}

# collect jpg/png files
if not os.path.isdir(DEST):
    print(f"Diary directory {DEST} not found - nothing to update.")
    sys.exit(0)

files = [f for f in os.listdir(DEST)
         if f.lower().endswith((".jpg",".jpeg",".png"))]

# Two-phase rename: move everything to temp names first so we never
# overwrite an existing photo_NNN file while shifting names.
temp_map = {}
for i, f in enumerate(sorted(files)):
    tmp = f".renaming_{i:04d}{os.path.splitext(f)[1].lower()}"
    os.rename(os.path.join(DEST, f), os.path.join(DEST, tmp))
    temp_map[tmp] = f

# rebuild list with final sequential names
photos = []
counter = 1
for tmp in sorted(temp_map):
    newname = f"photo_{counter:03d}{os.path.splitext(tmp)[1].lower()}"
    os.rename(os.path.join(DEST, tmp), os.path.join(DEST, newname))
    photos.append({
        "id": f"photo_{counter:03d}",
        "src": f"/{DEST}/{newname}",
        "caption": f"Untitled {counter:03d}"
    })
    counter += 1

os.makedirs(os.path.dirname(DATA), exist_ok=True)
with open(DATA,"w") as f:
    yaml.safe_dump(photos, f, sort_keys=False, width=80)

print(f"Updated {DATA} with {len(photos)} photos.")
