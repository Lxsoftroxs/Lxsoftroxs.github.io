# Advanced Customization Guide

This guide covers advanced customization options for developers who want to dig deeper into the template.

## Understanding the Structure

### Layouts

Layouts are in `_layouts/` and define page templates:

- **default.html**: Master template, includes header/footer
- **post.html**: Individual blog post/poetry/journal entry layout
- **page.html**: Static page layout

### Includes

Reusable components in `_includes/`:

- **header.html**: Navigation and site title
- **footer.html**: Footer with copyright

### CSS Variables

All colors are defined as CSS variables in `_layouts/default.html`:

```css
:root {
  --primary-color: {{ site.theme.primary_color }};
  --background: {{ site.theme.background }};
  --secondary-bg: {{ site.theme.secondary_bg }};
  --container-bg: {{ site.theme.container_bg }};
  --text-color: {{ site.theme.text_color }};
  --muted-text: {{ site.theme.muted_text }};
  --border-color: {{ site.theme.border_color }};
}
```

These pull from `_config.yml` and can be changed through the admin panel.

## Adding New Features

### Adding a New Collection

1. Edit `_config.yml`, add to collections:
   ```yaml
   collections:
     recipes:  # new collection
       output: true
       permalink: /recipes/:title/
   ```

2. Create folder: `_recipes/`

3. Edit `admin/config.yml`, add collection:
   ```yaml
   - name: "recipes"
     label: "Recipes"
     folder: "_recipes"
     create: true
     slug: "{{slug}}"
     fields:
       - { label: "Title", name: "title", widget: "string" }
       - { label: "Body", name: "body", widget: "markdown" }
   ```

4. Create list page: `_pages/recipes.html`

### Adding Custom Fields

Edit `admin/config.yml` for any collection:

```yaml
fields:
  - { label: "Title", name: "title", widget: "string" }
  - { label: "Featured", name: "featured", widget: "boolean", default: false }
  - { label: "Tags", name: "tags", widget: "list" }
  - { label: "Cover Image", name: "image", widget: "image" }
```

### Custom Navigation

Edit `_includes/header.html` to add/remove nav items:

```html
<option value="{{ '/new-page/' | relative_url }}">New Page</option>
```

## Styling Customizations

### Adding Custom Fonts

1. Edit `_layouts/default.html`, add to `<head>`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
   ```

2. Edit `assets/css/style.css`:
   ```css
   body {
     font-family: 'Your Font', 'Courier New', monospace;
   }
   ```

### Creating Color Presets

Add preset themes to `_config.yml`:

```yaml
theme:
  primary_color: "#6df"      # Cyberpunk Cyan
  # Or try:
  # primary_color: "#ff006e"  # Neon Pink
  # primary_color: "#00ff41"  # Matrix Green
  # primary_color: "#9d4edd"  # Purple Haze
```

### Customizing Layout Widths

Edit `assets/css/style.css`:

```css
.container {
  max-width: 1200px;  /* Change from 800px */
}
```

## Advanced Features

### Adding Comments

To add a comment system:

1. Sign up for [Utterances](https://utteranc.es/) (GitHub-based, free)

2. Edit `_layouts/post.html`, add before closing tags:
   ```html
   <script src="https://utteranc.es/client.js"
           repo="yourusername/yourusername.github.io"
           issue-term="pathname"
           theme="github-dark"
           crossorigin="anonymous"
           async>
   </script>
   ```

### Adding Analytics

For privacy-friendly analytics:

1. Sign up for [Plausible](https://plausible.io/) or [Simple Analytics](https://simpleanalytics.com/)

2. Add tracking code to `_layouts/default.html` before `</head>`:
   ```html
   <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
   ```

### RSS Feed

Already included! Your feed is at `/feed.xml`

### Search Functionality

Add [Lunr.js](https://lunrjs.com/) search:

1. Create `assets/js/search.js`
2. Add search index generation
3. Add search form to header

(This is advanced - see Jekyll search tutorials)

## Performance Optimizations

### Image Optimization

Use a service like [ImageOptim](https://imageoptim.com/) before uploading.

Or add image optimization to your workflow:

1. Install [jekyll-image-size](https://github.com/generalui/jekyll-image-size)
2. Configure responsive images

### Lazy Loading

Edit `assets/css/style.css`, add:

```css
img {
  loading: lazy;
}
```

### Minification

GitHub Pages automatically minifies for production.

## Decap CMS Customization

### Custom Widgets

Add date pickers, relation fields, etc. in `admin/config.yml`:

```yaml
- label: "Author"
  name: "author"
  widget: "relation"
  collection: "authors"
  searchFields: ["name"]
  valueField: "name"
```

### Custom Previews

Create custom post previews in the CMS:

1. Create `admin/preview-templates/`
2. Register templates in `admin/index.html`

See [Decap CMS docs](https://decapcms.org/docs/customization/) for details.

### Workflow Modes

Enable editorial workflow in `admin/config.yml`:

```yaml
publish_mode: editorial_workflow
```

This adds Draft → Review → Ready workflow.

## Deployment Alternatives

### Netlify (Recommended for CMS)

Pros: Better CMS integration, instant deploys, free SSL
Cons: Need to manage two sites (GitHub + Netlify)

Setup:
1. Connect GitHub repo to Netlify
2. Build settings: `bundle exec jekyll build`
3. Publish directory: `_site`

### Vercel

Similar to Netlify:
1. Import GitHub repo
2. Framework: Jekyll
3. Deploy

### Custom Domain

1. Buy domain (Namecheap, Google Domains, etc.)
2. Add CNAME file to repository root with your domain
3. Configure DNS settings with your registrar
4. Enable HTTPS in GitHub Pages settings

## Troubleshooting

### Build Errors

Check build logs:
1. Go to repository "Actions" tab
2. Click latest workflow run
3. Check error messages

Common fixes:
- Invalid YAML syntax in `_config.yml`
- Missing frontmatter in posts
- Invalid Liquid syntax in templates

### Styling Issues

- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS variable definitions
- Inspect with browser DevTools (F12)

### CMS Issues

- Check `admin/config.yml` for syntax errors
- Verify Netlify Identity is enabled
- Check browser console for errors (F12)

## Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Jekyll Themes](https://jekyllthemes.io/)

## Contributing

Want to improve this template?

1. Fork the repository
2. Make your changes
3. Submit a pull request

## Support

Questions? Check:
1. This guide
2. [SETUP.md](SETUP.md) for setup issues
3. [USER_GUIDE.md](USER_GUIDE.md) for usage help
4. GitHub Issues for bugs

---

Happy customizing! 🎨
