# Complete Setup Guide

This guide will walk you through setting up your blog step-by-step, even if you've never used GitHub before.

## Prerequisites

- A GitHub account (create one at [github.com](https://github.com))
- That's it! Everything else is free and web-based.

## Step-by-Step Setup

### Part 1: Create Your Blog Repository

1. **Use this template**
   - Click the green "Use this template" button at the top of this repository
   - For "Repository name", enter: `yourusername.github.io`
     - Replace `yourusername` with your actual GitHub username
     - Example: if your username is "alice123", name it "alice123.github.io"
   - Make sure it's set to "Public"
   - Click "Create repository from template"

2. **Enable GitHub Pages**
   - In your new repository, click "Settings" (top right)
   - Click "Pages" in the left sidebar
   - Under "Source", select the `main` branch
   - Click "Save"
   - Wait 2-3 minutes for your site to build
   - Visit `https://yourusername.github.io` to see your live site!

### Part 2: Set Up Content Management (Admin Panel)

The admin panel lets you write and edit content without using GitHub directly.

#### Option A: Netlify Identity (Recommended - Free)

1. **Create a Netlify account**
   - Go to [netlify.com](https://www.netlify.com/)
   - Click "Sign up" and use your GitHub account to sign in

2. **Import your site**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Authorize Netlify to access your GitHub
   - Select your `yourusername.github.io` repository
   - Leave all build settings as default
   - Click "Deploy site"

3. **Enable Identity service**
   - In your Netlify site dashboard, click "Identity" in the top menu
   - Click "Enable Identity"
   - Under "Registration preferences", select "Invite only"
   - Click "Save"

4. **Enable Git Gateway**
   - Still in the Identity section, click "Settings and usage"
   - Scroll down to "Services" → "Git Gateway"
   - Click "Enable Git Gateway"
   - Select "GitHub" as the provider

5. **Invite yourself as a user**
   - Click "Invite users" button
   - Enter your email address
   - Check your email and click the invite link
   - Create a password for your admin account

6. **Update your site URL**
   - Go back to your GitHub repository
   - Edit `_config.yml` file (click the pencil icon)
   - Change the `url` field to your actual URL: `https://yourusername.github.io`
   - Scroll down and click "Commit changes"

7. **Access the admin panel**
   - Visit `https://yourusername.github.io/admin`
   - Log in with your email and password
   - Start creating content!

#### Option B: GitHub Backend (Alternative)

If you prefer not to use Netlify:

1. Edit `admin/config.yml` in your repository
2. Change the backend section to:
   ```yaml
   backend:
     name: github
     repo: yourusername/yourusername.github.io
     branch: main
   ```
3. You'll need to authenticate with GitHub each time you use the admin panel
4. This method is simpler but requires GitHub login for editing

### Part 3: Customize Your Site

1. **Edit site information**
   - Go to `/admin` on your site
   - Click "Site Settings" → "Configuration"
   - Update your site title, description, and author info
   - Click "Publish"

2. **Change theme colors**
   - In the same "Configuration" page, scroll to "Theme Colors"
   - Enter new hex color codes (see README for color scheme ideas)
   - Click "Publish"
   - Wait a few minutes for changes to appear

3. **Create your first post**
   - Click "Blog Posts" in the admin sidebar
   - Click "New Blog Post"
   - Add a title and content
   - Click "Publish"

## Troubleshooting

### "404 - Site not found"
- Make sure GitHub Pages is enabled in Settings → Pages
- Wait 5-10 minutes after enabling GitHub Pages
- Check that your repository name is exactly `yourusername.github.io`

### "Admin panel won't load"
- Clear your browser cache
- Make sure you're using `/admin` (not `/admin/`)
- Check that Netlify Identity is enabled

### "Can't log in to admin panel"
- Check your email for the Netlify invite
- Make sure you created a password
- Try resetting your password in Netlify Identity dashboard

### "Changes don't appear on site"
- Wait 2-5 minutes for GitHub Pages to rebuild
- Check the "Actions" tab in your repository for build status
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### "Colors won't change"
- Make sure you're entering valid hex color codes (e.g., `#ff0000`)
- Include the `#` symbol
- Wait a few minutes for the site to rebuild after publishing

## Getting Help

- **GitHub Pages Issues**: Check [GitHub Pages documentation](https://docs.github.com/en/pages)
- **Netlify Issues**: See [Netlify support docs](https://docs.netlify.com/)
- **Jekyll Issues**: Visit [Jekyll documentation](https://jekyllrb.com/docs/)

## Next Steps

Once everything is set up:

1. Delete the demo content (posts, poetry, journal entries)
2. Write your own content through the admin panel
3. Customize colors to match your style
4. Share your blog URL with friends!

---

Congratulations! You now have a fully functional blog with a content management system. 🎉
