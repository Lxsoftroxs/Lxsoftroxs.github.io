import os
from datetime import date

blog_dir = "_posts"
today = date.today()
date_str = today.isoformat()

# Ensure the _posts directory exists
os.makedirs(blog_dir, exist_ok=True)

# Count existing files to determine post number
existing = sorted(f for f in os.listdir(blog_dir) if f.endswith(".md"))
post_num = len(existing) + 1

# Number to word
ordinals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh",
            "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth"]
ordinal_word = ordinals[post_num - 1] if post_num <= len(ordinals) else f"{post_num}th"

filename = f"{date_str}-{ordinal_word}-post.md"
filepath = os.path.join(blog_dir, filename)

# Only create file if it doesn't exist
if not os.path.exists(filepath):
    with open(filepath, "w") as f:
        f.write(f"""---
layout: post
title: "The Full Story"
date: {date_str}
---
""")
    print(f"Created {filepath}")
else:
    print("File already exists.")
