# operator.codes — Launch Checklist

## Pre-launch (do before deploying)

### 1. Formspree — wire the email endpoint
- Go to https://formspree.io and create a free account
- Create a new form → set destination to `tyler@malamaproject.org`
- Copy your form ID (looks like `xabcd123`)
- In `public/index.html`, find and replace all instances of `xpwzgvrl` with your real form ID
  - There are 2 instances: one for the apply form, one for the newsletter
- Submit a test application to confirm emails arrive

### 2. Twitter/X handle
- In `public/index.html`, confirm `@tylermalin` is your correct X handle
  - Search for `twitter:site` to find it

### 3. OG image (optional but recommended for link previews)
- Create a 1200×630px image: dark background, operator.codes wordmark, green accent
- Save as `public/og-image.png`
- This makes link previews look sharp on X, LinkedIn, iMessage

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest, 2 minutes)
```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# From the operator-codes folder
cd operator-codes
vercel

# Follow prompts:
# - Link to existing project? No → create new
# - Project name: operator-codes
# - Directory: ./  (root of this folder)
# - Override settings? No

# Production deploy
vercel --prod
```

### Option B — Vercel Dashboard (no CLI needed)
1. Go to https://vercel.com/new
2. Click "Deploy without Git" → drag the entire `operator-codes` folder
3. Vercel detects the config automatically
4. Click Deploy → you get a `.vercel.app` URL immediately

### Option C — GitHub + Vercel (best for ongoing updates)
1. Create a private GitHub repo: `operator-codes`
2. Push this folder:
   ```bash
   cd operator-codes
   git init
   git add .
   git commit -m "initial launch"
   git remote add origin https://github.com/YOURUSERNAME/operator-codes.git
   git push -u origin main
   ```
3. Go to https://vercel.com/new → Import Git Repository
4. Select the repo → Deploy
5. Future updates: `git push` → auto-deploys in ~30 seconds

---

## Connect operator.codes domain

### In Vercel Dashboard after deploy:
1. Go to your project → Settings → Domains
2. Add `operator.codes` and `www.operator.codes`
3. Vercel shows you DNS records to add

### In your domain registrar (wherever operator.codes is registered):
Add these DNS records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

DNS propagates in 5–60 minutes. Vercel auto-provisions SSL.

---

## Post-launch

### Announce
- [ ] Post on X/Twitter: "operator.codes is live. Build Sessions now open — apply at operator.codes"
- [ ] Share in relevant communities (founder/builder Slacks, Discord servers)
- [ ] Add link to your LinkedIn, Twitter/X bio, email signature

### Formspree confirm
- [ ] Submit a test application yourself and verify receipt at tyler@malamaproject.org
- [ ] Reply-to on the email should be the applicant's address (so you can reply directly)

### Future updates
- Edit `public/index.html` directly for copy changes
- Run `vercel --prod` or push to GitHub to redeploy
- Full redeploy takes ~30 seconds

---

## Folder structure

```
operator-codes/
├── vercel.json          ← Vercel routing + security headers config
├── public/
│   ├── index.html       ← Full site (all 4 pages, single file)
│   ├── favicon.svg      ← Green dot favicon
│   ├── robots.txt       ← SEO crawl permissions
│   └── sitemap.xml      ← SEO sitemap (update with real URLs)
```

---

## Quick reference

| Item | Value |
|------|-------|
| Formspree placeholder to replace | `xpwzgvrl` |
| Target inbox | tyler@malamaproject.org |
| Twitter handle in meta | @tylermalin |
| Vercel A record | 76.76.21.21 |
| Vercel CNAME | cname.vercel-dns.com |
| OG image size | 1200×630px → public/og-image.png |
