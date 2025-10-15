#!/usr/bin/env python3
import os, yaml, re

DEST = "assets/diary"
DATA = "_data/diary_photos.yml"

# read existing entries if any
if os.path.exists(DATA):
    with open(DATA) as f:
        photos = yaml.safe_load(f) or []
else:
    photos = []

# normalize existing IDs
ids = {p["id"] for p in photos}

# collect jpg/png files
files = [f for f in os.listdir(DEST)
         if f.lower().endswith((".jpg",".jpeg",".png"))]

# rename and rebuild list
photos = []
counter = 1
for f in sorted(files):
    newname = f"photo_{counter:03d}{os.path.splitext(f)[1].lower()}"
    if f != newname:
        os.rename(os.path.join(DEST,f), os.path.join(DEST,newname))
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
