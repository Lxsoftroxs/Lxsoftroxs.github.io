# Complete Setup Guide - Do Everything for Your Friend

This guide walks you through setting up the entire blog so your friend only needs to log in.

## What You'll Need

1. **Your friend's GitHub account info** - Either:
   - They create a GitHub account and give you temporary access, OR
   - You create one for them (they can change password later)

2. **Your friend's email address** - For the admin login

3. **30 minutes of your time**

## Step-by-Step Setup

### Phase 1: GitHub Setup (10 minutes)

#### 1.1 Create GitHub Account (if needed)

If your friend doesn't have GitHub:
1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Use their email address
4. Create a username (example: `janesblog`)
5. Create a temporary password (they can change later)
5. Verify email

#### 1.2 Create the Repository

1. **Log into their GitHub account**

2. **Create new repository:**
   - Click "+" in top right → "New repository"
   - Repository name: `[username].github.io` (e.g., `janesblog.github.io`)
   - Description: "My personal blog"
   - Set to **Public**
   - **Do NOT initialize** with README
   - Click "Create repository"

#### 1.3 Push Template Files

On your computer, run these commands:

```bash
# Navigate to the template
cd /home/user/jekyll-blog-cms-template

# Remove existing git history
rm -rf .git

# Initialize fresh repo
git init
git add .
git commit -m "Initial blog setup"

# Connect to friend's repository (replace with their actual repo)
git remote add origin https://github.com/[their-username]/[their-username].github.io.git

# Push to their repo
git branch -M main
git push -u origin main
```

**Alternative if you get password prompt:**
- Go to GitHub → Settings → Developer settings → Personal access tokens
- Generate new token (classic) with `repo` permissions
- Use token as password when prompted

#### 1.4 Enable GitHub Pages

1. In their repository, go to **Settings**
2. Click **Pages** (left sidebar)
3. Under "Source", select **main** branch
4. Click **Save**
5. Note the URL: `https://[username].github.io`

### Phase 2: Netlify Setup (15 minutes)

This enables the admin panel with email/password login.

#### 2.1 Create Netlify Account

1. Go to [netlify.com](https://www.netlify.com/)
2. Click "Sign up"
3. **Important:** Sign up with **your own email** (you're setting this up)
4. Choose "Sign up with GitHub"
5. Authorize Netlify

#### 2.2 Import the Site

1. Click "Add new site" → "Import an existing project"
2. Click "Deploy with GitHub"
3. Find your friend's repository: `[username].github.io`
4. Click on it
5. **Build settings:**
   - Build command: `bundle exec jekyll build`
   - Publish directory: `_site`
6. Click "Deploy site"
7. Wait 2-3 minutes for initial deploy

#### 2.3 Configure Site Settings

1. Once deployed, click "Site settings"
2. Click "Change site name"
3. Change to something memorable: `[friendname]-blog`
4. Note: You can ignore the Netlify URL, the real site is on GitHub Pages

#### 2.4 Enable Identity

1. In site dashboard, click **Identity** (top menu)
2. Click **Enable Identity**
3. Under "Registration preferences":
   - Select **Invite only**
4. Click **Settings and usage**
5. Scroll to **External providers**:
   - You can enable Google/GitHub login (optional)
6. Scroll to **Git Gateway**:
   - Click **Enable Git Gateway**
   - Choose **GitHub** as provider
   - Authorize with the friend's GitHub account

**Important for Git Gateway:**
- You'll need to authorize Netlify to access their GitHub
- This lets the admin panel write directly to their repository

#### 2.5 Create User Account for Your Friend

1. Still in **Identity** tab
2. Click **Invite users**
3. Enter your friend's email address
4. Click **Send invitation**

**They will receive an email** with:
- An invite link
- Instructions to set their password

### Phase 3: Configure the Blog (5 minutes)

#### 3.1 Customize Site Settings

You can do this two ways:

**Option A: Direct File Edit (Quick)**

1. Go to their GitHub repository
2. Edit `_config.yml`
3. Update:
```yaml
title: "[Friend's Name]'s Blog"
description: "My personal blog and creative space"
url: "https://[their-username].github.io"
author:
  name: "[Friend's Name]"
  email: "[their-email]@example.com"
```
4. Commit changes

**Option B: Use Admin Panel (After they set password)**

1. Have them check email and click invite link
2. They set their password
3. You can then log in to `[friendname]-blog.netlify.app/admin`
4. Make changes through the UI

#### 3.2 Test Everything

1. Visit `https://[their-username].github.io` - blog should be live
2. Visit `https://[their-username].github.io/admin` - admin panel should load
3. If they've set their password, try logging in

### Phase 4: Hand Over to Friend

#### 4.1 Prepare Login Information

Create a document with:

```
🎉 YOUR BLOG IS READY!

Your Blog URL: https://[their-username].github.io
Admin Panel: https://[their-username].github.io/admin

LOGIN CREDENTIALS:
Email: [their-email]@example.com
Password: Check your email for invite link to set password

GITHUB ACCOUNT (optional - for advanced users):
Username: [their-github-username]
Password: [temporary-password]
→ Change this password at: github.com/settings/security

WHAT TO DO FIRST:
1. Check your email from Netlify
2. Click the invite link
3. Set your admin password
4. Go to your admin panel: [site]/admin
5. Log in and start creating!

GUIDES:
- Quick Start: See QUICKSTART.md in your repository
- User Guide: See USER_GUIDE.md
- Need help? Text me!

DELETE THE DEMO CONTENT:
The blog has example posts. Delete them through the admin panel
under Blog Posts, Poetry, and Daily Entries.
```

#### 4.2 Optional: Create Video Tutorial

Record a 2-minute screen recording showing:
1. Going to the admin panel
2. Logging in
3. Creating a new blog post
4. Changing a theme color
5. Publishing

### Phase 5: Security & Handoff

#### 5.1 Transfer Netlify Ownership (Recommended)

Once your friend has set up their password:

1. In Netlify, go to **Site settings** → **Team and collaborators**
2. Add your friend's email as **Owner**
3. Transfer ownership to them
4. They can then remove your access if desired

OR keep it under your account if they prefer you manage technical aspects.

#### 5.2 GitHub Access

If you created the GitHub account for them:
1. Give them the password
2. Tell them to change it immediately
3. They should enable 2FA for security

### What Your Friend Gets

✅ **Fully working blog** at their custom URL
✅ **Admin panel** at `/admin` with their login
✅ **Ability to:**
   - Create blog posts through web UI
   - Write poetry and journal entries
   - Change theme colors
   - Upload images
   - Customize everything
✅ **No coding required** - everything through the web interface
✅ **Free hosting** forever (GitHub Pages)

### Troubleshooting

**"Admin panel says 'Error loading config'"**
- Make sure Git Gateway is enabled in Netlify
- Check that Netlify is authorized for their GitHub

**"Friend can't log in"**
- Make sure they clicked the email invite
- They need to set a password first
- Check spam folder for Netlify email

**"Changes don't appear on the blog"**
- Wait 2-3 minutes for GitHub Pages to rebuild
- Hard refresh browser (Ctrl+Shift+R)

**"Admin panel works but posts don't save"**
- Check Git Gateway is enabled
- Make sure Netlify has write access to GitHub repo
- Check repository isn't archived or restricted

### Alternative: Simpler Setup (No Netlify)

If the Netlify setup seems too complex, you can:

1. Set up just the GitHub Pages site
2. Show your friend how to create posts by:
   - Going to `_posts` folder on GitHub
   - Clicking "Add file" → "Create new file"
   - Naming it: `YYYY-MM-DD-title.md`
   - Adding frontmatter and content
   - Committing

This is less user-friendly but simpler to set up.

---

## Summary Checklist

- [ ] GitHub account created/accessed
- [ ] Repository created: `username.github.io`
- [ ] Template files pushed to repository
- [ ] GitHub Pages enabled
- [ ] Netlify account created
- [ ] Site imported to Netlify
- [ ] Identity enabled
- [ ] Git Gateway enabled and authorized
- [ ] Friend invited to Identity
- [ ] Site settings customized (_config.yml)
- [ ] Everything tested
- [ ] Login credentials sent to friend
- [ ] Friend has set their password
- [ ] Demo content explained (for them to delete)

**Time investment:** ~30 minutes
**Friend's effort:** Click email link, set password, start blogging!

---

This way your friend just receives:
📧 Email with login info
🔐 Password they set themselves
🚀 Ready-to-use blog

No technical knowledge needed! 🎉
