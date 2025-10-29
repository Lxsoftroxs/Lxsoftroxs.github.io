#!/usr/bin/env python3
"""
Blog Post Generator
Creates new blog post files with sequential numbering.
"""
import os
import sys
from datetime import date
from pathlib import Path

BLOG_DIR = "_posts"
ORDINALS = [
    "first", "second", "third", "fourth", "fifth", "sixth", "seventh",
    "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth",
    "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth",
    "nineteenth", "twentieth", "twenty-first", "twenty-second", "twenty-third",
    "twenty-fourth", "twenty-fifth", "twenty-sixth", "twenty-seventh",
    "twenty-eighth", "twenty-ninth", "thirtieth"
]

def get_ordinal(num):
    """Convert number to ordinal word."""
    if 1 <= num <= len(ORDINALS):
        return ORDINALS[num - 1]
    # Fallback for numbers beyond our list
    if num % 100 in (11, 12, 13):
        suffix = "th"
    elif num % 10 == 1:
        suffix = "st"
    elif num % 10 == 2:
        suffix = "nd"
    elif num % 10 == 3:
        suffix = "rd"
    else:
        suffix = "th"
    return f"{num}{suffix}"

def main():
    """Main execution function."""
    try:
        today = date.today()
        date_str = today.isoformat()

        # Ensure the _posts directory exists
        blog_path = Path(BLOG_DIR)
        blog_path.mkdir(parents=True, exist_ok=True)
        print(f"Using blog directory: {BLOG_DIR}")

        # Count existing markdown files to determine post number
        existing = sorted([f for f in os.listdir(BLOG_DIR) if f.endswith(".md")])
        post_num = len(existing) + 1
        print(f"Found {len(existing)} existing posts")

        # Generate ordinal word for filename
        ordinal_word = get_ordinal(post_num)
        filename = f"{date_str}-{ordinal_word}-post.md"
        filepath = blog_path / filename

        # Only create file if it doesn't exist
        if filepath.exists():
            print(f"File already exists: {filepath}")
            print("No action taken.")
            return 0

        # Create new post with front matter
        try:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(f"""---
layout: post
title: ""
date: {date_str}
---

<!-- Write your post content here -->
""")
            print(f"✓ Successfully created: {filepath}")
            print(f"  Post number: {post_num} ({ordinal_word})")
            return 0
        except IOError as e:
            print(f"Error writing file {filepath}: {e}", file=sys.stderr)
            return 1

    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
