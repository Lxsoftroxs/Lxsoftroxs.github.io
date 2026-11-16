# YO get outta herreeeeee, IM DEBUGGING
# https://lxsoftroxs.github.io/

## Editing without breaking other sections

Every pull request and every push to `main` runs **Site check** (`.github/workflows/site-check.yml`). It builds the site the way GitHub Pages does and opens every page in a browser. If it is red, something is broken, and the log names the page and the cause.

Rules that keep sections independent:

- **No inline `<script>` and no `onclick="..."`.** The Content Security Policy in `_layouts/default.html` blocks them, so the page loads but the code never runs. Put code in its own file under `assets/js/` (playable projects go in `assets/js/projects/`) and load it with `<script defer src="{{ '/assets/js/...' | relative_url }}"></script>`.
- **One file per page, wrapped in `(function () { ... })();`** so nothing leaks into other pages.
- **New script host?** Add it to `script-src` in `_layouts/default.html`.
- **New section or interactive page?** Add one line to `EXPECT` in `scripts/smoke_test.js` saying what must be on the page.

Quick check before pushing (needs only Python):

```bash
python3 scripts/check_site.py
```
