# Deployment Guide

## Why Vercel instead of GitHub Pages

GitHub Pages only serves static files — it has no way to check a password,
verify a login session, or commit a file back to your repo when you save
something in the admin portal. Those all need a small server running, which
is exactly what Next.js's API routes are, and GitHub Pages can't run them.

Vercel is built by the same team as Next.js, runs this kind of app natively,
auto-deploys on every push to GitHub, and its free "Hobby" tier easily
covers a site like this. Your code still lives in the same GitHub repo —
only *hosting* moves, not version control.

## 1. Replace the repo contents

In your existing GitHub repo:

- **Delete** the old static-site files: `index.html`, `CNAME`,
  `.nojekyll`, `media_manifest.json`, and the `scripts/` folder of Python
  media-processing helpers (they did their job already; the images are now
  in `public/assets/`).
- **Extract this zip into the repo root**, so `app/`, `content/`, `public/`,
  `package.json`, etc. sit at the top level.
- Commit and push to your default branch (`main`).

If you'd rather keep history tidy, do this as one commit: "Rebuild site on
Next.js."

## 2. Create a Vercel project

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New → Project**, pick this repository.
3. Framework preset should auto-detect as **Next.js** — leave build settings
   at their defaults.
4. Before your first deploy, add the environment variables below.

## 3. Environment variables

Set these in Vercel under **Project → Settings → Environment Variables**
(add them for Production, and Preview if you want admin access on preview
deployments too):

| Variable | What it's for | How to get it |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | The (hashed) admin login password | Run `npm run hash-password -- "your-chosen-password"` locally, copy the printed value. Paste it into Vercel exactly as printed — no escaping needed there. |
| `SESSION_SECRET` | Signs the admin login session cookie | Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` locally, paste the output. |
| `GITHUB_TOKEN` | Lets the admin portal commit content edits | See step 4 below. |
| `GITHUB_OWNER` | Your GitHub username or org | e.g. `nk-udada` |
| `GITHUB_REPO` | This repo's name | e.g. `nk-udada-site` |
| `GITHUB_BRANCH` | Branch the site deploys from | Usually `main` |
| `NEXT_PUBLIC_SITE_URL` | Used for social preview links | `https://the-nkfoundation.org` |

> **Local testing only:** if you also fill in `.env.local` on your own
> machine, escape every `$` in the bcrypt hash as `\$` — Next.js expands
> `$word` in local `.env` files, which corrupts the hash otherwise (e.g.
> `\$2a\$10\$...`). This quirk **does not** apply to variables entered in
> the Vercel dashboard — paste the hash there exactly as printed.

## 4. Create the GitHub token

The admin portal needs permission to commit to this one repo:

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. **Resource owner**: your account/org. **Repository access**: "Only
   select repositories" → choose this repo.
3. **Permissions → Repository permissions → Contents**: set to
   **Read and write**. Everything else can stay "No access."
4. Generate, copy the token, paste it into Vercel as `GITHUB_TOKEN`.

Rotate this token any time by generating a new one and updating the Vercel
variable — the old one can be revoked immediately.

## 5. Set your admin password

```bash
npm install
npm run hash-password -- "the password you want"
```

Paste the printed `ADMIN_PASSWORD_HASH` value into Vercel. The plain
password is never stored anywhere — only the hash. To change the password
later, just re-run the command with a new password and update the Vercel
variable.

## 6. Custom domain

You mentioned you already own a custom domain (the old `CNAME` file pointed
at `the-nkfoundation.org`).

1. In Vercel: **Project → Settings → Domains → Add**, enter your domain.
2. Vercel shows you the DNS records to add at your domain registrar:
   - **Apex domain** (`the-nkfoundation.org`): an `A` record pointing to
     Vercel's IP (Vercel shows the exact value — currently `76.76.21.21`,
     but always use what Vercel displays for you).
   - **www subdomain**: a `CNAME` record pointing to `cname.vercel-dns.com`.
3. DNS changes can take a few minutes to a few hours to propagate. Vercel
   will show a green checkmark once it verifies.
4. In your GitHub repo, go to **Settings → Pages** and disable GitHub Pages
   if it's still turned on, so the two hosts don't fight over the domain.

## 7. First deploy checklist

- [ ] Old static files removed, Next.js project extracted into repo root
- [ ] All 7 environment variables set in Vercel
- [ ] First deploy succeeds (check the Vercel deployment log)
- [ ] Visit the `.vercel.app` preview URL — confirm the site looks right
- [ ] Log into `/admin` with your password
- [ ] Make one small text edit and save — confirm it appears live after
      the next deploy finishes (~1 minute)
- [ ] Custom domain added and DNS records updated
- [ ] GitHub Pages disabled in repo settings

## Ongoing costs

Vercel's Hobby tier is free and covers this site comfortably (it's a low
volume, mostly-static site with light server usage for the admin portal).
If traffic grows significantly or you add team members needing Vercel
seats, their paid Pro tier starts at $20/month per member.
