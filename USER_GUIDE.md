# User Guide - How to Use Your Blog

This guide explains how to use the admin panel to manage your blog content.

## Accessing the Admin Panel

1. Go to `https://yourusername.github.io/admin` (replace with your actual URL)
2. Log in with your email and password (the one you set up with Netlify)
3. You'll see the admin dashboard

## Admin Panel Overview

The admin panel has these sections in the left sidebar:

- **Blog Posts**: Your main blog articles
- **Poetry**: Creative writing and poems
- **Daily Entries**: Journal-style daily reflections
- **Pages**: Static pages like "About"
- **Site Settings**: Configure your site title, colors, etc.

## Creating Content

### Writing a Blog Post

1. Click "Blog Posts" in the sidebar
2. Click the "New Blog Post" button
3. Fill in the fields:
   - **Title**: The title of your post (e.g., "My First Blog Post")
   - **Publish Date**: When to publish (defaults to now)
   - **Body**: Your post content (supports Markdown formatting)
4. Click "Publish" when ready

**Tips:**
- Use the rich text editor buttons for formatting (bold, italic, headings, etc.)
- Click the eye icon to preview how it will look
- Save drafts by clicking "Save" instead of "Publish"

### Writing Poetry

1. Click "Poetry" in the sidebar
2. Click "New Poetry"
3. Enter your poem title and date
4. Write your poem in the Body field
5. Use line breaks naturally - they'll be preserved
6. Click "Publish"

### Creating Daily Entries

1. Click "Daily Entries" in the sidebar
2. Click "New Daily Entries"
3. Add a title (e.g., "Reflections on a Sunny Day")
4. Pick today's date
5. Write your journal entry
6. Click "Publish"

### Adding Pages

1. Click "Pages" in the sidebar
2. Click "New Pages"
3. Fill in:
   - **Title**: Page title
   - **Permalink**: URL path (e.g., `/contact/`)
   - **Body**: Page content
4. Click "Publish"

## Editing Content

1. Navigate to the content type (Blog Posts, Poetry, etc.)
2. Click on the item you want to edit
3. Make your changes
4. Click "Publish" to save

## Deleting Content

1. Open the content item you want to delete
2. Click the three dots menu (⋮) at the top
3. Select "Delete entry"
4. Confirm deletion

## Markdown Formatting Guide

The body editor supports Markdown. Here are common formatting options:

### Headings
```markdown
# Large Heading
## Medium Heading
### Small Heading
```

### Text Formatting
```markdown
**bold text**
*italic text*
[link text](https://example.com)
```

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Images
1. Click the "+" button in the editor
2. Select "Image"
3. Upload your image or paste a URL
4. Add alt text (description)

### Quotes
```markdown
> This is a quote
```

### Code
```markdown
`inline code`

\`\`\`
code block
\`\`\`
```

## Customizing Your Site

### Changing Site Title and Description

1. Click "Site Settings" in the sidebar
2. Click "Configuration"
3. Update:
   - **Site Title**: Your blog's name
   - **Description**: Short description of your blog
   - **Site URL**: Your GitHub Pages URL
4. Update Author info (name and email)
5. Click "Publish"

### Changing Colors

In the same Configuration page:

1. Scroll to "Theme Colors"
2. Enter new hex color codes:
   - **Primary Color**: Main accent color (links, headings)
   - **Background**: Page background color
   - **Secondary Background**: Header/footer color
   - **Container Background**: Content area color
   - **Text Color**: Main text color
   - **Muted Text**: Secondary text color
   - **Border Color**: Borders and dividers
3. Click "Publish"

**Finding hex colors:**
- Use a color picker like [Google's](https://g.co/kgs/colorpicker)
- Or try [coolors.co](https://coolors.co/) for palettes
- Always include the `#` (e.g., `#6df` or `#66ddff`)

**Popular color combos:**
- Cyberpunk: `#6df` (cyan)
- Vaporwave: `#ff006e` (pink)
- Retro: `#00ff41` (green)
- Modern: `#9d4edd` (purple)

### Uploading Images

When writing a post:

1. Click the "+" button in the editor
2. Select "Image"
3. Click "Choose an image"
4. Upload from your computer
5. Images are automatically stored in `/assets/images/uploads/`

## Publishing Workflow

### Immediate Publishing
- Click "Publish" to make content live immediately
- Changes appear on your site in 1-3 minutes

### Draft Mode
- Click "Save" instead of "Publish" to save drafts
- Drafts won't appear on your live site
- You can edit and publish later

### Editorial Workflow (Advanced)
If you want an approval process:

1. Edit `admin/config.yml` in your repository
2. Add this line after the `backend` section:
   ```yaml
   publish_mode: editorial_workflow
   ```
3. You'll now have "Draft", "In Review", and "Ready" columns
4. Drag content between columns to manage publishing

## Tips and Best Practices

### Writing Tips
- **Be consistent**: Post regularly (daily, weekly, etc.)
- **Use headings**: Break up long posts with headings
- **Add images**: Visual content makes posts more engaging
- **Proofread**: Use the preview feature before publishing

### SEO Tips
- **Write descriptive titles**: Help people find your posts
- **Use headings**: Search engines love well-structured content
- **Add links**: Link to other relevant posts
- **Be authentic**: Write about what you know and love

### Organization Tips
- **Tag posts by topic**: Add categories in the body (e.g., "Filed under: #technology")
- **Use dates consistently**: Helps you and readers track content
- **Archive old content**: You can delete outdated posts

## Viewing Changes

After publishing:

1. Wait 1-3 minutes for GitHub Pages to rebuild
2. Visit your site: `https://yourusername.github.io`
3. Hard refresh your browser if needed (Ctrl+Shift+R)
4. Check that your changes appear correctly

## Common Questions

**Q: How long until changes appear?**
A: Usually 1-3 minutes. GitHub Pages needs to rebuild your site.

**Q: Can I schedule posts for the future?**
A: Yes! Set the publish date to a future date. The post will show up on that date.

**Q: Can I write offline?**
A: Not directly, but you can write in a text editor and paste into the admin panel when online.

**Q: How do I backup my content?**
A: Everything is stored in GitHub. Your repository IS the backup!

**Q: Can I add videos?**
A: Yes! Use YouTube/Vimeo embed codes or upload video files (keep them small).

**Q: What image formats are supported?**
A: JPG, PNG, GIF, and WebP work great.

---

Need more help? Check out the [Setup Guide](SETUP.md) or [README](README.md) for additional information.

Happy blogging! ✨
