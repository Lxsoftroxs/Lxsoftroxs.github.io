# Setup Checklist - Complete Blog Setup for Your Friend

Use this checklist as you set everything up. Check off each item as you go!

## Information You Need

Before starting, collect:

- [ ] Friend's desired GitHub username: `___________________`
- [ ] Friend's email address: `___________________`
- [ ] Desired blog name/title: `___________________`

## Phase 1: GitHub Setup ⏱️ 10 minutes

- [ ] Create/access GitHub account for friend
  - URL: github.com
  - Username: `___________________`
  - Temp password: `___________________` (give to friend)

- [ ] Create repository named: `[username].github.io`
  - Set to Public ✅
  - Do NOT initialize with README

- [ ] Push template to repository:
  ```bash
  cd /home/user/jekyll-blog-cms-template
  rm -rf .git
  git init
  git add .
  git commit -m "Initial blog setup"
  git remote add origin https://github.com/[username]/[username].github.io.git
  git branch -M main
  git push -u origin main
  ```

- [ ] Enable GitHub Pages
  - Settings → Pages
  - Source: `main` branch
  - Save
  - Note URL: `https://_____________________.github.io`

## Phase 2: Netlify Setup ⏱️ 15 minutes

- [ ] Create Netlify account (or use existing)
  - URL: netlify.com
  - Sign up with your email/GitHub

- [ ] Import site to Netlify
  - "Add new site" → "Import existing project"
  - Connect to GitHub
  - Select friend's repository
  - Build command: `bundle exec jekyll build`
  - Publish directory: `_site`
  - Deploy

- [ ] Change site name (optional)
  - Site settings → Change site name
  - New name: `___________________`

- [ ] Enable Identity
  - Identity tab → Enable Identity
  - Registration: **Invite only** ✅

- [ ] Enable Git Gateway
  - Identity → Settings and usage
  - Services → Git Gateway
  - Enable Git Gateway
  - Provider: GitHub
  - Authorize with friend's GitHub account ✅

- [ ] Invite friend as user
  - Identity → Invite users
  - Email: `___________________`
  - Send invite ✅
  - Note: They'll receive email to set password

## Phase 3: Customize Blog ⏱️ 5 minutes

- [ ] Edit `_config.yml` on GitHub:
  - Site title: `___________________`
  - Description: `___________________`
  - URL: `https://[username].github.io`
  - Author name: `___________________`
  - Author email: `___________________`
  - Commit changes ✅

- [ ] Optional: Customize theme colors
  - primary_color: `___________________` (hex code)
  - Or let friend do this through admin panel

## Phase 4: Testing ⏱️ 5 minutes

- [ ] Test blog loads
  - Visit: `https://[username].github.io`
  - Should show demo content ✅

- [ ] Test admin panel loads
  - Visit: `https://[username].github.io/admin`
  - Should show login screen ✅

- [ ] Verify invite email sent
  - Check friend received Netlify email
  - If not, check Netlify Identity users list

## Phase 5: Prepare Handoff Documents

- [ ] Fill out `CREDENTIALS_TEMPLATE.txt`
  - Replace all `[USERNAME]` with actual username
  - Replace `[FRIEND-EMAIL]` with their email
  - Replace `[TEMP-PASSWORD]` with GitHub password
  - Save as: `credentials-for-[friendname].txt`

- [ ] Optional: Customize `HANDOFF_TO_FRIEND.md`
  - Replace placeholders with actual URLs
  - Save personalized version

- [ ] Create welcome message
  - Email or text with:
    - Blog URL
    - Admin URL
    - Instructions to check email
    - Your contact info for questions

## Phase 6: Final Steps

- [ ] Send credentials to friend
  - Preferred method: ___________________
  - Secure: Don't email passwords in plain text

- [ ] Ask friend to:
  - [ ] Check email for Netlify invite
  - [ ] Click link and set password
  - [ ] Confirm they can log into admin panel
  - [ ] Create a test blog post

- [ ] Optional: Transfer Netlify ownership
  - Netlify → Site settings → Team
  - Add friend as owner
  - Transfer ownership

## Troubleshooting Reference

If issues arise:

| Problem | Solution |
|---------|----------|
| Admin shows 404 | Wait 5 min for GitHub Pages, check URL has `/admin` |
| Can't log in | Friend must set password via email invite first |
| Posts don't save | Check Git Gateway is enabled and authorized |
| Blog shows 404 | Enable GitHub Pages, wait 5-10 minutes |
| No invite email | Check spam, re-send from Netlify Identity |

## Quick Links

- GitHub repo: `https://github.com/[username]/[username].github.io`
- Live blog: `https://[username].github.io`
- Admin panel: `https://[username].github.io/admin`
- Netlify dashboard: `https://app.netlify.com/sites/[sitename]`

## Notes & Timestamps

Setup started: `___________________`
Setup completed: `___________________`
Credentials sent: `___________________`
Friend confirmed access: `___________________`

Additional notes:
```
___________________________________________________
___________________________________________________
___________________________________________________
```

---

## ✅ Final Checklist

When everything is done:

- [ ] Friend has blog URL
- [ ] Friend has admin credentials
- [ ] Friend can log into admin panel
- [ ] Friend knows how to create posts
- [ ] Friend has support contact (you!)
- [ ] Demo content explained (for them to delete)
- [ ] You're a great friend! 🎉

**Total estimated time:** 30-40 minutes

---

## What Friend Receives

✅ Working blog at custom URL
✅ Admin panel access
✅ Email/password login
✅ Ability to create content without coding
✅ Full control over design and content
✅ Free hosting forever
✅ Your support!

**Friend's effort:** Click email, set password, start blogging (5 minutes)

---

*Save this checklist for future friends who want blogs!*
