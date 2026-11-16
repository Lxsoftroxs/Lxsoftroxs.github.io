#!/usr/bin/env python3
"""Source checks for the blog. No dependencies, no Jekyll needed.

    python3 scripts/check_site.py

Catches the mistakes that have silently broken one section while another was
being edited:

  * inline <script> blocks and on*="" handlers, which the Content Security
    Policy in _layouts/default.html blocks (the page loads, the code never runs)
  * scripts loaded from a host the CSP does not allow
  * links to /assets/ files that do not exist
  * project pages with missing or invalid front matter, or front matter keys
    that Jekyll reserves (`next`, `previous`)
  * two pages claiming the same permalink

Exit code 0 = clean, 1 = problems found. Run by .github/workflows/site-check.yml.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Everything that is rendered through a layout (and so gets the CSP).
SCAN_DIRS = ["_layouts", "_includes", "_pages", "_projects", "_posts", "_essays",
             "_poetry", "_journal", "secret", "encrypt"]
SCAN_FILES = ["index.html"]
SCAN_EXT = {".html", ".md", ".markdown"}

PROJECT_STATUSES = {"building", "design", "drafting", "research", "done", "shelved"}
PROJECT_REQUIRED = ["title", "permalink", "status", "summary"]
RESERVED_KEYS = {"next", "previous"}  # Jekyll document attributes; using them breaks pages
DATA_SCRIPT_TYPES = {"application/json", "application/ld+json", "text/template", "text/plain"}

errors = []


def err(path, line, msg):
    errors.append(f"{path.relative_to(ROOT)}:{line}: {msg}")


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def blank(match):
    """Replace a match with spaces, keeping newlines so line numbers hold."""
    return re.sub(r"[^\n]", " ", match.group(0))


def split_front_matter(text):
    m = re.match(r"---\s*\n(.*?)\n---\s*(\n|$)", text, re.S)
    if not m:
        return None, text
    return m.group(1), text


def top_level_keys(front_matter):
    keys = {}
    for line in front_matter.splitlines():
        m = re.match(r"([A-Za-z_][\w-]*)\s*:\s*(.*)$", line)
        if m:
            keys[m.group(1)] = m.group(2).strip().strip("\"'")
    return keys


def csp_script_hosts():
    layout = (ROOT / "_layouts" / "default.html").read_text(encoding="utf-8")
    m = re.search(r"script-src([^;\"]*)", layout)
    if not m:
        return None
    return {t.split("//", 1)[1].rstrip("/") for t in m.group(1).split() if "//" in t}


def files_to_scan():
    for d in SCAN_DIRS:
        base = ROOT / d
        if base.is_dir():
            for p in sorted(base.rglob("*")):
                if p.is_file() and p.suffix in SCAN_EXT and p.name != "README.md":
                    yield p
    for f in SCAN_FILES:
        if (ROOT / f).is_file():
            yield ROOT / f


def check_markup(path, text, allowed_hosts):
    # Ignore code samples and comments: they are shown or dropped, never run.
    body = re.sub(r"<!--.*?-->", blank, text, flags=re.S)
    body = re.sub(r"\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}", blank, body, flags=re.S)
    body = re.sub(r"^(```|~~~).*?^\1", blank, body, flags=re.S | re.M)
    body = re.sub(r"\{%-?\s*highlight.*?endhighlight\s*-?%\}", blank, body, flags=re.S)

    for m in re.finditer(r"<script\b([^>]*)>", body, re.I):
        attrs = m.group(1)
        line = line_of(body, m.start())
        src = re.search(r"\bsrc\s*=\s*(\"[^\"]*\"|'[^']*'|\S+)", attrs, re.I)
        if not src:
            typ = re.search(r"\btype\s*=\s*[\"']?([\w/+.-]+)", attrs, re.I)
            if typ and typ.group(1).lower() in DATA_SCRIPT_TYPES:
                continue
            err(path, line, "inline <script> is blocked by the site's Content Security Policy. "
                            "Move the code to a file under assets/js/ and load it with "
                            "<script defer src=\"{{ '/assets/js/...' | relative_url }}\"></script>")
            continue
        url = src.group(1).strip("\"'")
        host = re.match(r"(?:https?:)?//([^/\s]+)", url)
        if host and allowed_hosts is not None and host.group(1) not in allowed_hosts:
            err(path, line, f"script host '{host.group(1)}' is not in script-src of the Content "
                            "Security Policy in _layouts/default.html, so the browser will block it")

    # Blank out script and style bodies so JS/CSS text is not mistaken for HTML attributes.
    tags_only = re.sub(r"(<script\b[^>]*>)(.*?)(</script>)",
                       lambda m: m.group(1) + re.sub(r"[^\n]", " ", m.group(2)) + m.group(3),
                       body, flags=re.S | re.I)
    tags_only = re.sub(r"(<style\b[^>]*>)(.*?)(</style>)",
                       lambda m: m.group(1) + re.sub(r"[^\n]", " ", m.group(2)) + m.group(3),
                       tags_only, flags=re.S | re.I)

    for m in re.finditer(r"<[a-zA-Z][^<>]*?\s(on[a-z]+)\s*=\s*[\"']", tags_only):
        err(path, line_of(tags_only, m.start()),
            f"inline {m.group(1)}=\"...\" handler is blocked by the Content Security Policy. "
            "Give the element an id and use addEventListener in a file under assets/js/")

    for m in re.finditer(r"(?:href|src)\s*=\s*[\"']\s*javascript:", tags_only, re.I):
        err(path, line_of(tags_only, m.start()),
            "javascript: URL is blocked by the Content Security Policy")

    # Local assets referenced from tags must exist.
    for m in re.finditer(r"(?:src|href)\s*=\s*\"([^\"]*)\"", tags_only, re.I):
        value = m.group(1)
        liquid = re.search(r"\{\{\s*'(/assets/[^']+)'\s*\|\s*(?:relative_url|absolute_url)", value)
        ref = liquid.group(1) if liquid else value
        if "{{" in ref or "{%" in ref or not ref.startswith("/assets/"):
            continue
        ref = ref.split("?", 1)[0].split("#", 1)[0]
        if not (ROOT / ref.lstrip("/")).is_file():
            err(path, line_of(tags_only, m.start()), f"'{ref}' does not exist")


def check_project(path, keys):
    for key in PROJECT_REQUIRED:
        if not keys.get(key):
            err(path, 1, f"project front matter is missing '{key}'")
    status = keys.get("status")
    if status and status not in PROJECT_STATUSES:
        err(path, 1, f"project status '{status}' is not one of: {', '.join(sorted(PROJECT_STATUSES))}")
    if keys.get("kind") == "toy" and status != "done":
        err(path, 1, "a 'kind: toy' project needs 'status: done', otherwise it is also "
                     "listed under In progress")


def main():
    allowed_hosts = csp_script_hosts()
    if allowed_hosts is None:
        errors.append("_layouts/default.html:1: could not find script-src in the Content Security Policy")

    permalinks = {}
    count = 0
    for path in files_to_scan():
        count += 1
        text = path.read_text(encoding="utf-8")
        front, _ = split_front_matter(text)
        check_markup(path, text, allowed_hosts)
        if front is None:
            continue
        keys = top_level_keys(front)
        for key in RESERVED_KEYS & set(keys):
            err(path, 1, f"front matter key '{key}' is reserved by Jekyll and will return another "
                         f"page instead of your value; rename it (e.g. '{key}_step')")
        if path.parent.name == "_projects":
            check_project(path, keys)
        link = keys.get("permalink")
        if link and ":" not in link:
            norm = "/" + link.strip("/") + "/" if link.strip("/") else "/"
            if norm in permalinks:
                err(path, 1, f"permalink '{link}' is already used by {permalinks[norm].relative_to(ROOT)}")
            else:
                permalinks[norm] = path

    if errors:
        print(f"check_site: {len(errors)} problem(s) in {count} files\n")
        for e in errors:
            print("  " + e)
        return 1
    print(f"check_site: OK ({count} files)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
