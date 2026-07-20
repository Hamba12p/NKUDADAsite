# NK Udada Foundation — website

A Next.js rebuild of the NK Udada Foundation site: same look, now split into
proper pages, with a weekly blog and an admin portal for editing text,
gallery captions, and posts without touching code.

**Read `DEPLOYMENT.md` before you push this anywhere** — it covers the
Vercel setup, environment variables, and custom domain migration.

## What's inside

```
app/                    Pages (App Router) — one folder per route
  admin/                Admin portal (password-protected)
  api/admin/             Admin API routes (login, save content, save posts)
  blog/                  Blog index + /blog/[slug]
  about, programs, gallery, team, volunteer, contact/
  page.js                Home page
  layout.js              Shared nav + footer + fonts
  globals.css            The entire design system (colors, type, layout)
components/             Nav, Footer, gallery lightbox, admin forms
content/                 Editable text — this is what the admin portal writes to
  site.json              Every section of every page (hero, about, team, ...)
  gallery.json           Gallery captions/categories/order
  blog/*.json            One file per blog post
lib/
  content.js             Reads content/ at request time
  github.js               Commits admin edits straight to GitHub
  auth.js                 Password check + session cookie
middleware.js            Protects /admin and /api/admin routes
scripts/hash-password.js Generates the admin password hash
```

## How content editing works

There's no database. When you save something in `/admin`, the server commits
the updated JSON file straight to this GitHub repo using the GitHub API. That
commit triggers a normal Vercel deploy, so changes go live in about a minute
— the same way a code change would. You get full history and one-click
rollback on every edit, for free, in the repo's commit log.

This means editing content **requires** the environment variables described
in `DEPLOYMENT.md` (`GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`) — without
them the admin portal loads fine but saves will fail with a clear error.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values, see DEPLOYMENT.md
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin`
for the admin portal.

## Adding weekly blog posts

Easiest way: log into `/admin/blog`, click "New post", write it, save. Posts
are plain text with light markdown support (`**bold**`, `[links](url)`,
blank lines for new paragraphs).

## Editing the gallery

`/admin/gallery` lets you edit captions, categories, and order for every
existing photo and video, and add new items by path. To add a brand-new
photo file, upload it into `public/assets/images/` in the GitHub repo first
(via GitHub's web UI or a normal git push), then add it in `/admin/gallery`
pointing at `/assets/images/your-file.jpg`.

## Design notes

Every public-facing page keeps the original site's exact visual language —
same colors, type, spacing, animations. The one page built with new,
original design work is `/gallery`, since it didn't exist as its own page
before: it has category filters, a masonry layout, and a full lightbox with
keyboard navigation. Icons throughout the site use
[lucide-react](https://lucide.dev) instead of emoji.
