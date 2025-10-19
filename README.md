# Lxsoftroxs.github.io

This repository contains the source for a personal site built with [Jekyll](https://jekyllrb.com/). The structure below highlights where to find the main pieces of content after the recent reorganisation.

## Key directories
- `_pages/` – Standalone pages such as the diary, gallery, listening log, patrons page, and other navigation links. Each file keeps its existing permalink so published URLs remain unchanged.
- `_journal/`, `_projects/`, `_poetry/`, `_posts/` – Jekyll collections for dated journal entries, portfolio write-ups, poetry, and standard blog posts.
- `_data/` – Structured YAML/JSON data. Legacy exports like `subscribers.json` and `tetris_scores.json` now live under `_data/archive/` alongside the diary photo metadata.
- `assets/` – Static assets shared by the site. Media for the diary lives in `assets/images/diary/`, while other galleries continue under `assets/images/`.
- `_includes/` and `_layouts/` – Shared templates and layout skeletons used by the pages and collections.
- `scripts/` – Helper utilities for local workflows (e.g., the blog post generator and Windows batch script for syncing logs).
- `legacy/` – Archived resources (chat prototype and log exports) kept outside the published page tree.

## Where to edit things

| Public URL | Source file | Notes |
| --- | --- | --- |
| `/` | `index.html` | Landing page that pulls the latest posts and collection teasers. |
| `/diary/` | `_pages/diary.html` + `_data/diary_photos.yml` | Gallery of diary photos. The HTML controls layout/JS, while the YAML file lists images stored under `assets/images/diary/`. |
| `/gallery/` | `_pages/gallery.html` | Pulls images from `assets/images/gallery/`. |
| `/listening/` | `_pages/listening.html` | Fetches Last.fm data via the embedded JavaScript. Update credentials inside the page front matter/JS. |
| `/projects/` | `_pages/projects.html` + `_projects/` | Listing page lives in `_pages/`, while individual project entries are Markdown/HTML files in `_projects/`. |
| `/journal/` | `_pages/journal.html` + `_journal/` | Calendar view lives in `_pages`; daily entries stay in `_journal/`. |
| `/poetry/` | `_pages/poetry.html` + `_poetry/` | Collection landing page with individual poems stored under `_poetry/`. |
| `/quotes/` | `_pages/quotes.md` | Simple Markdown page for curated quotes. |
| `/patrons/` | `_pages/patrons.html` | Embeds the support PDF and call-to-action buttons. |
| Blog posts | `_posts/` | Standard dated posts using the `post` layout. |

### Navigation

- `_includes/header.html` controls the header links. Update both the list markup and the dropdown `<select>` so desktop tabs and the mobile picker stay aligned.

### Updating data and media

- **Diary photos**: drop new images into `assets/images/diary/` and append entries to `_data/diary_photos.yml` with matching filenames.
- **Archived JSON**: legacy exports live in `_data/archive/`. Move anything you still want to render into `_data/` and reference it from Liquid templates.
- **Reusable snippets**: shared fragments belong in `_includes/`. Create a new include and reference it from layouts or pages with `{% include %}`.

### Scripts and helper tools

- `scripts/create_blog_post.py` creates a prefilled Markdown stub when run with the desired title (`python scripts/create_blog_post.py "My Title"`).
- `scripts/update_git.bat` is a Windows helper for syncing local logs before committing; it does not affect the Jekyll build.

## Local development
Install Ruby and Bundler, then run the usual Jekyll workflow:

```bash
bundle install
bundle exec jekyll serve
```

This starts a local server at <http://localhost:4000>, letting you preview how the reorganised structure renders before pushing updates.
