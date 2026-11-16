# YO get outta herreeeeee, IM DEBUGGING
# https://lxsoftroxs.github.io/

## Editing without breaking other sections

Every pull request and every push to `main` runs **Site check** (`.github/workflows/site-check.yml`). It builds the site the way GitHub Pages does and opens every page in a browser. If it is red, something is broken, and the log names the page and the cause.

Rules that keep sections independent:

- **No inline `<script>` and no `onclick="..."`.** The Content Security Policy in `_layouts/default.html` blocks them, so the page loads but the code never runs. Put code in its own file under `assets/js/` (playable projects go in `assets/js/projects/`) and load it with `<script defer src="{{ '/assets/js/...' | relative_url }}"></script>`.
- **One file per page, wrapped in `(function () { ... })();`** so nothing leaks into other pages.
- **New script host?** Add it to `script-src` in `_layouts/default.html`.
- **New section or interactive page?** Add one line to `EXPECT` in `scripts/smoke_test.js` saying what must be on the page.

Things the checks also enforce, so you don't have to remember them:

- posts are named `YYYY-MM-DD-title.md`; poems, essays and timeline events have a `title` and a `YYYY-MM-DD` `date`
- every diary photo listed in `_data/diary_photos.yml` exists, and asset file names have no spaces
- every internal link and image on every page resolves
- repo files (`subscribers.json`, `Gemfile`, `scripts/`) are not served to visitors

Site check also runs every Monday with no edits, to catch breakage from outside the repo (a CDN library or GitHub Pages changing).

Quick check before pushing (needs only Python):

```bash
python3 scripts/check_site.py
```
