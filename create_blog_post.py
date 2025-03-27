from datetime import date
import os

# Define the directory for your blog posts
BLOG_DIR = "_posts"
os.makedirs(BLOG_DIR, exist_ok=True)

# Get today's date in YYYY-MM-DD format
today = date.today().isoformat()

# Construct the filename (you can adjust naming as needed)
filename = f"{today}-post.md"
filepath = os.path.join(BLOG_DIR, filename)

# Create the markdown file with empty title and today's date
with open(filepath, "w") as f:
    f.write(f"""---
layout: post
title: ""
date: {today}
---
""")

print(f"Created new post: {filepath}")
