# Quick Start Guide - 5 Minutes to Your Blog

The absolute fastest way to get your blog up and running.

## Step 1: Create Your Blog (2 minutes)

1. Click the green **"Use this template"** button at the top of this page
2. Name it: `yourusername.github.io` (replace `yourusername` with your GitHub username)
3. Make sure it's set to **Public**
4. Click **"Create repository from template"**

## Step 2: Turn On Your Site (1 minute)

1. In your new repository, click **Settings** (top right)
2. Click **Pages** (left sidebar)
3. Under "Source", select **main** branch
4. Click **Save**
5. Wait 2-3 minutes
6. Visit `https://yourusername.github.io` - your blog is live! 🎉

## Step 3: Customize Basic Info (2 minutes)

### Option A: Quick Edit (No CMS Setup)

1. Click `_config.yml` in your repository
2. Click the pencil icon (edit)
3. Change these lines:
   ```yaml
   title: "My Cool Blog"              # Your blog name
   description: "My thoughts and stuff"  # Short description
   url: "https://yourusername.github.io"  # Your actual URL
   author:
     name: "Your Name"
     email: "you@email.com"
   ```
4. Scroll down, click **Commit changes**
5. Wait 2 minutes, refresh your site

### Option B: Full CMS Setup (Recommended)

For the full admin panel experience, follow [SETUP.md](SETUP.md) - takes 10 minutes.

## Creating Your First Post

### Without CMS:

1. Click `_posts` folder
2. Click **Add file** → **Create new file**
3. Name it: `2024-12-01-my-first-post.md`
4. Add this content:
   ```markdown
   ---
   layout: post
   title: "My First Post"
   date: 2024-12-01
   ---

   Hello world! This is my first blog post.

   ## I can use headings

   And **bold text** and *italic text*.

   Pretty cool!
   ```
5. Click **Commit changes**
6. Your post appears in 2 minutes!

### With CMS:

1. Go to `https://yourusername.github.io/admin`
2. Click "New Blog Post"
3. Write and publish!

## Changing Colors

Edit `_config.yml` and change the hex color codes under `theme:`:

```yaml
theme:
  primary_color: "#6df"  # Try "#ff006e" for pink!
```

Popular colors:
- Cyan (default): `#6df`
- Hot Pink: `#ff006e`
- Green: `#00ff41`
- Purple: `#9d4edd`
- Orange: `#ff6b35`

## Next Steps

✅ You now have a working blog!

**Learn More:**
- [Full Setup Guide](SETUP.md) - Set up the admin panel
- [User Guide](USER_GUIDE.md) - How to use the admin panel
- [Customization Guide](CUSTOMIZATION.md) - Advanced features

**Your URLs:**
- Blog: `https://yourusername.github.io`
- Admin: `https://yourusername.github.io/admin` (after CMS setup)

## Help!

**"My site shows 404 error"**
- Wait 5 minutes after enabling GitHub Pages
- Check repository name is exactly `yourusername.github.io`

**"Changes don't show up"**
- Wait 2-3 minutes for rebuild
- Hard refresh browser (Ctrl+Shift+R)

**"I need more help"**
- Read [SETUP.md](SETUP.md) for detailed instructions
- Check GitHub Pages docs

---

That's it! You're ready to start blogging. 🚀

**Remember:** Delete the demo posts in `_posts`, `_poetry`, and `_journal` folders and add your own!
