# Comments Collection

This directory contains approved community comments that are displayed on the `/comments/` page.

## How It Works

1. Users submit comments through the form at `/comments/`
2. Comments are sent to the Vercel API endpoint: `https://subscriber-api-lolroxs.vercel.app/api/comments`
3. **The API must sanitize and validate all input before creating files**
4. Approved comments are created as markdown files in this directory
5. Jekyll automatically loads them into the `site.comments` collection
6. The comments page displays them in chronological order

## File Format

Each comment file should follow this format:

```markdown
---
author: "Name or Anonymous"
date: YYYY-MM-DD
---

The sanitized comment text goes here.
All HTML, JavaScript, and code must be escaped or removed.
```

## Backend API Requirements

The `/api/comments` endpoint on your Vercel API **MUST**:

### 1. Input Validation
- Validate that `comment` field exists and is not empty
- Limit `name` to 50 characters
- Limit `comment` to 1000 characters
- Reject submissions with URLs if spam is a concern

### 2. Sanitization (CRITICAL for Security)
```javascript
// Example sanitization in Node.js
function sanitizeInput(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;')
    .trim();
}
```

### 3. File Creation
- Create a new file in `_comments/` directory
- Filename format: `YYYY-MM-DD-HHmmss.md` (timestamp to ensure uniqueness)
- Use GitHub API to create the file in the repository
- Requires a GitHub Personal Access Token with repo permissions

### 4. GitHub API Integration Example
```javascript
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

await octokit.rest.repos.createOrUpdateFileContents({
  owner: 'Lxsoftroxs',
  repo: 'Lxsoftroxs.github.io',
  path: `_comments/${filename}`,
  message: 'Add new comment',
  content: Buffer.from(fileContent).toString('base64'),
  branch: 'main'
});
```

## Security Measures

### On the Backend (Required):
1. **HTML Escaping**: Convert all `<`, `>`, `"`, `'` characters to HTML entities
2. **Script Removal**: Strip any `<script>` tags or JavaScript
3. **URL Validation**: Optional - block or sanitize URLs to prevent phishing
4. **Rate Limiting**: Implement rate limiting to prevent spam (e.g., 1 comment per IP per minute)
5. **Profanity Filter**: Optional - add a profanity filter
6. **Manual Review**: Consider requiring manual approval before comments go live

### On the Frontend (Already Implemented):
1. Character limits (1000 chars for comment, 50 for name)
2. Honeypot field for bot detection
3. Client-side sanitization (backup, not primary security)
4. Jekyll's `| escape` filter when displaying comments

## Environment Variables Needed

Add to your Vercel project:
- `GITHUB_TOKEN`: Personal Access Token with `repo` scope
- `GITHUB_OWNER`: Lxsoftroxs
- `GITHUB_REPO`: Lxsoftroxs.github.io

## Testing

Create a test comment file manually to verify the display works:

```bash
cat > _comments/2025-10-29-test.md << 'EOF'
---
author: "Test User"
date: 2025-10-29
---

This is a test comment to verify the system works correctly!
EOF
```

Then check the `/comments/` page to see if it displays.

## Moderation

To remove inappropriate comments:
1. Delete the corresponding `.md` file from `_comments/`
2. Commit and push the change
3. GitHub Pages will rebuild without that comment

## Additional Security Notes

- **Never trust user input** - Always sanitize on the backend
- The `| escape` filter in Jekyll helps prevent XSS, but is not sufficient alone
- Consider implementing a profanity filter or spam detection
- Monitor the comments regularly for inappropriate content
- Consider adding reCAPTCHA for additional bot protection
