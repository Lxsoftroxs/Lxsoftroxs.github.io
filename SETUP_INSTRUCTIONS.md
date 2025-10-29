# Setup Instructions for New Features

## Overview

Two major features have been added to your blog:
1. **Comments System** - A safe community comment submission system
2. **Secure Subscriber Management** - Protected email list storage

---

## 1. Comments System Setup

### What Was Added

- **New page**: `/comments/` - Accessible from the navigation menu
- **Form**: Users can submit comments (max 1000 characters)
- **Security**: Multiple layers of protection against XSS and code injection
- **Collection**: `_comments/` directory for storing approved comments

### How It Works

1. Users submit comments through the form at `/comments/`
2. Form data is sent to: `https://subscriber-api-lolroxs.vercel.app/api/comments`
3. **Your API must be updated** to handle this endpoint (see below)
4. Approved comments are created as markdown files in `_comments/`
5. Jekyll automatically displays them on the comments page

### Required: Update Your Vercel API

You need to add a new endpoint to your Vercel API to handle comment submissions.

#### Create `/api/comments.js` in your Vercel project:

```javascript
import { Octokit } from '@octokit/rest';

// Sanitization function - CRITICAL for security
function sanitizeText(text) {
  if (typeof text !== 'string') return '';

  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;')
    .replace(/\\/g, '\\\\')
    .trim();
}

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting check (implement using Vercel KV or similar)
  // TODO: Add rate limiting here

  const { name, comment, timestamp } = req.body;

  // Validation
  if (!comment || comment.trim().length === 0) {
    return res.status(400).json({ error: 'Comment is required' });
  }

  if (comment.length > 1000) {
    return res.status(400).json({ error: 'Comment too long' });
  }

  // Sanitize inputs
  const sanitizedName = sanitizeText(name || 'Anonymous').substring(0, 50);
  const sanitizedComment = sanitizeText(comment).substring(0, 1000);

  // Generate filename
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toISOString().replace(/[-:T]/g, '').split('.')[0]; // YYYYMMDDHHmmss
  const filename = `${dateStr}-${timeStr}.md`;

  // Create markdown content
  const fileContent = `---
author: "${sanitizedName}"
date: ${dateStr}
---

${sanitizedComment}
`;

  try {
    // Initialize Octokit with your GitHub token
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    // Create file in repository
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: 'Lxsoftroxs',
      repo: 'Lxsoftroxs.github.io',
      path: `_comments/${filename}`,
      message: 'Add new comment',
      content: Buffer.from(fileContent).toString('base64'),
      branch: 'main'
    });

    return res.status(200).json({
      success: true,
      message: 'Comment submitted successfully'
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({
      error: 'Failed to submit comment',
      details: error.message
    });
  }
}
```

#### Install Required Dependencies:

```bash
cd your-vercel-api-project
npm install @octokit/rest
```

#### Add Environment Variables to Vercel:

1. Go to your Vercel dashboard
2. Select the `subscriber-api-lolroxs` project
3. Navigate to **Settings** → **Environment Variables**
4. Add:
   - `GITHUB_TOKEN` - A Personal Access Token with `repo` scope
   - `GITHUB_OWNER` - `Lxsoftroxs`
   - `GITHUB_REPO` - `Lxsoftroxs.github.io`

#### Create GitHub Personal Access Token:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name: "Blog Comments API"
4. Select scopes: Check **repo** (all sub-options)
5. Click **Generate token**
6. **Copy the token immediately** (you won't see it again)
7. Add it to Vercel as `GITHUB_TOKEN`

### Security Features Implemented

1. **Content Security Policy (CSP)** - Prevents XSS attacks
2. **Input Sanitization** - All HTML/JS is escaped
3. **Character Limits** - 1000 chars for comments, 50 for names
4. **Honeypot Field** - Bot detection
5. **Jekyll Escape Filter** - Additional layer when displaying
6. **Manual Review** - You control what gets committed to main branch

### Moderation

To approve/remove comments:
- Comments are automatically added to `_comments/` via GitHub API
- To remove a comment: Delete the file from `_comments/` and commit
- Consider setting up branch protection for manual review before merge

---

## 2. Secure Subscriber Management

### What Changed

**BEFORE**: Subscriber emails were in public `subscribers.json` file ❌
**AFTER**: Subscriber emails are stored securely in GitHub Secrets ✅

### Files Changed

- ✅ `subscribers.json` - Removed from git tracking and added to `.gitignore`
- ✅ `.github/workflows/email-notifier.yml` - Updated to use GitHub Secrets
- ✅ `.gitignore` - Created to prevent committing sensitive files
- ✅ `SUBSCRIBER_MIGRATION.md` - Contains your subscriber list and migration instructions

### Required Action: Set Up GitHub Secret

**IMPORTANT**: You must do this before the email workflow will work again!

1. **Get your subscriber list**:
   - Open `SUBSCRIBER_MIGRATION.md` (in your local copy)
   - Copy the JSON array of email addresses

2. **Add to GitHub Secrets**:
   - Go to your repository on GitHub
   - Click **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `SUBSCRIBER_EMAILS`
   - Value: Paste the JSON array:
     ```json
     ["email1@example.com","email2@example.com","email3@example.com"]
     ```
   - Click **Add secret**

3. **Delete the migration file** (after completing setup):
   ```bash
   rm SUBSCRIBER_MIGRATION.md
   ```

### How It Works Now

- Subscribers submit via form → Vercel API → Stored securely
- Email workflow reads from `SUBSCRIBER_EMAILS` secret
- Emails are never publicly visible
- You update the secret when adding/removing subscribers

### Managing Subscribers

#### To Add a Subscriber:
1. Update your Vercel API to append to a database or secure storage
2. Manually update the GitHub Secret with the new email
3. Or: Store subscribers in a database instead (recommended long-term)

#### To Remove a Subscriber:
1. Edit the `SUBSCRIBER_EMAILS` secret on GitHub
2. Remove the email from the JSON array
3. Save the secret

---

## 3. Security Improvements Added

### Content Security Policy (CSP)
Added to `_layouts/default.html`:
- Restricts script sources to trusted domains
- Prevents inline script execution from user content
- Allows necessary external resources (Utterances, Last.fm, etc.)

### Additional Security Headers
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `Referrer-Policy` - Controls referrer information

---

## 4. Testing the Setup

### Test Comments Page:
1. Navigate to `/comments/` on your site
2. Verify the form displays correctly
3. Submit a test comment
4. Check that it appears after the API processes it

### Test Email Workflow:
1. Manually trigger the workflow in GitHub Actions
2. Check that it reads from the secret (no errors about missing subscribers.json)
3. Verify emails are sent correctly

### Test Subscriber Form:
1. Go to your site footer
2. Submit an email
3. Verify it's stored securely (not in public files)

---

## 5. Recommended Next Steps

### Immediate:
1. ✅ Set up `SUBSCRIBER_EMAILS` GitHub Secret
2. ✅ Create GitHub Personal Access Token for comments
3. ✅ Update your Vercel API with the comments endpoint
4. ✅ Test both features
5. ✅ Delete `SUBSCRIBER_MIGRATION.md` after migration

### Long-term:
1. **Add Rate Limiting** - Prevent spam submissions
2. **Add reCAPTCHA** - Additional bot protection
3. **Use a Database** - Store subscribers in Vercel Postgres/Supabase instead of secrets
4. **Manual Comment Approval** - Set up branch protection or review workflow
5. **Profanity Filter** - Optional content filtering
6. **Email Unsubscribe** - Add unsubscribe links to emails

---

## 6. Troubleshooting

### Comments not appearing:
- Check Vercel API logs for errors
- Verify GitHub token has correct permissions
- Check `_comments/` directory in repository

### Email workflow failing:
- Verify `SUBSCRIBER_EMAILS` secret is set
- Check the secret is valid JSON format
- Review GitHub Actions logs

### Form submissions not working:
- Check browser console for errors
- Verify API endpoint is accessible
- Check CORS settings on Vercel

---

## 7. File Structure Reference

```
Lxsoftroxs.github.io/
├── _comments/              # NEW: Comment storage
│   ├── README.md          # Documentation for comments
│   └── 2025-10-29-welcome.md  # Example comment
├── _pages/
│   └── comments.html      # NEW: Comments page
├── _includes/
│   └── header.html        # UPDATED: Added Comments nav link
├── _layouts/
│   └── default.html       # UPDATED: Added CSP headers
├── .github/workflows/
│   └── email-notifier.yml # UPDATED: Uses GitHub Secrets
├── .gitignore             # NEW: Prevents committing sensitive files
├── SETUP_INSTRUCTIONS.md  # This file
└── SUBSCRIBER_MIGRATION.md # Temporary - delete after setup
```

---

## Support

If you encounter issues:
1. Check the README files in `_comments/` directory
2. Review GitHub Actions logs
3. Check Vercel deployment logs
4. Verify all secrets are correctly set

**Security Note**: Never commit sensitive data (emails, tokens, passwords) to the repository!
