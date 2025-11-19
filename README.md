# Modular Blog Template

A user-friendly, customizable blog template with a dark cyberpunk aesthetic. Perfect for non-technical users who want a beautiful blog without touching code!

## ✨ Features

- **Easy Content Management**: Write blog posts, poetry, and daily journal entries through a web interface
- **No Coding Required**: Manage everything through the admin panel at `/admin`
- **Customizable Theme**: Change colors and styling through the UI
- **Dark Cyberpunk Aesthetic**: Beautiful neon-accented dark theme
- **Fully Responsive**: Looks great on desktop and mobile
- **SEO Friendly**: Built with best practices for search engines
- **GitHub Pages Ready**: Free hosting on GitHub

## 🚀 Quick Start

### Step 1: Copy This Template

1. Click the green "Use this template" button on GitHub
2. Name your repository `yourusername.github.io` (replace `yourusername` with your GitHub username)
3. Make it public
4. Click "Create repository from template"

### Step 2: Enable GitHub Pages

1. Go to your repository Settings
2. Click "Pages" in the left sidebar
3. Under "Source", select `main` branch
4. Click Save
5. Your site will be live at `https://yourusername.github.io` in a few minutes!

### Step 3: Set Up Decap CMS (Content Management)

To enable the admin panel for easy content editing:

1. Go to your repository Settings
2. Scroll down to "GitHub Pages" section
3. Click "Choose a theme" (just to enable the feature, you can cancel after)
4. Go to [Netlify Identity](https://app.netlify.com/) (free account)
5. Create a new site from your GitHub repo
6. Enable Identity service in Netlify
7. Enable Git Gateway in Netlify Identity settings

Detailed setup instructions are in [SETUP.md](SETUP.md)

### Step 4: Access the Admin Panel

1. Visit `https://yourusername.github.io/admin`
2. Log in with your Netlify Identity credentials
3. Start creating content!

## 📝 Using the Admin Panel

### Creating Blog Posts

1. Go to `/admin` on your site
2. Click "Blog Posts" in the sidebar
3. Click "New Blog Post"
4. Fill in the title, date, and content
5. Click "Publish"

### Changing Theme Colors

1. Go to `/admin`
2. Click "Site Settings"
3. Click "Configuration"
4. Scroll to "Theme Colors"
5. Enter new hex color codes (e.g., `#6df` for cyan)
6. Click "Publish"

## 🎨 Customization

### Color Themes

All colors are defined in `_config.yml` under the `theme` section. You can change them through the admin panel or by editing the file directly:

```yaml
theme:
  primary_color: "#6df"      # Main accent color
  background: "#111"          # Page background
  secondary_bg: "#222"        # Header/footer background
  container_bg: "#1a1a1a"    # Content area background
  text_color: "#ddd"          # Main text color
  muted_text: "#999"          # Secondary text color
  border_color: "#444"        # Border color
```

### Common Color Schemes

**Cyberpunk Cyan (Default)**
- Primary: `#6df` (cyan)

**Neon Pink**
- Primary: `#ff006e` (hot pink)

**Matrix Green**
- Primary: `#00ff41` (bright green)

**Purple Haze**
- Primary: `#9d4edd` (purple)

**Sunset Orange**
- Primary: `#ff6b35` (orange)

## 📁 Project Structure

```
├── _config.yml           # Site configuration and theme colors
├── _layouts/             # Page templates
│   ├── default.html      # Main template
│   ├── post.html         # Blog post template
│   └── page.html         # Page template
├── _includes/            # Reusable components
│   ├── header.html       # Site header/navigation
│   └── footer.html       # Site footer
├── _posts/               # Blog posts (managed via admin)
├── _poetry/              # Poetry collection (managed via admin)
├── _journal/             # Daily journal entries (managed via admin)
├── _pages/               # Static pages
├── admin/                # Decap CMS admin panel
│   ├── index.html        # Admin UI
│   └── config.yml        # CMS configuration
├── assets/
│   ├── css/style.css     # Main stylesheet
│   └── images/           # Image uploads
└── index.html            # Homepage
```

## 🛠️ Advanced Usage

### Running Locally

If you want to preview your site locally:

1. Install Ruby and Jekyll ([guide](https://jekyllrb.com/docs/installation/))
2. Clone your repository
3. Run `bundle install`
4. Run `bundle exec jekyll serve`
5. Visit `http://localhost:4000`

### Adding New Sections

You can add new content collections by editing `_config.yml` and `admin/config.yml`. See the [Jekyll Collections documentation](https://jekyllrb.com/docs/collections/).

## 📖 Documentation

- [Complete Setup Guide](SETUP.md) - Detailed setup instructions
- [User Guide](USER_GUIDE.md) - How to use the admin panel
- [Customization Guide](CUSTOMIZATION.md) - Advanced customization options

## 🤝 Support

If you run into issues:

1. Check the [Setup Guide](SETUP.md)
2. Make sure GitHub Pages is enabled
3. Verify Netlify Identity is configured correctly
4. Check the [Jekyll documentation](https://jekyllrb.com/docs/)

## 📄 License

This template is free to use and modify. No attribution required.

## 🌟 Credits

Built with:
- [Jekyll](https://jekyllrb.com/) - Static site generator
- [Decap CMS](https://decapcms.org/) - Content management system
- [GitHub Pages](https://pages.github.com/) - Free hosting

---

Happy blogging! 🎉
