# Chapter 1 — Exploration: Entering the World of Secondary Science
### NCERT Grade 9 Science | Digital Edition

---

## Folder Structure

```
ch01/
├── index.html                    ← chapter content (semantic HTML)
├── css/
│   └── styles.bdd1a5e7.css       ← content-hashed; immutable cache
├── js/
│   └── chapter.0190b7fd.js       ← content-hashed; immutable cache
├── img/
│   ├── hero.webp                 ← above-fold, loads eager
│   ├── saha-stamp.webp
│   ├── fig1-1-vegetable.webp
│   ├── fig1-2-eclipse.webp
│   ├── fig1-3-rice.webp
│   ├── fig1-4-masks.webp
│   ├── icon-box.webp
│   └── icon-magnifier.webp
├── fonts/                        ← empty; system Times New Roman used
├── _headers                      ← Cloudflare Pages / Netlify cache rules
└── .github/
    └── workflows/
        └── deploy.yml            ← GitHub Actions auto-deploy
```

---

## Performance Budget (actual)

| Asset | Size |
|---|---|
| HTML | 30 KB |
| CSS | 12 KB |
| JS | 4 KB |
| Hero image (above fold) | 157 KB |
| All other images (lazy) | ~185 KB |
| **Total initial download** | **~203 KB** ✓ |
| **Full chapter (all images)** | **432 KB** ✓ |

Spec limits: initial ≤ 1 MB · full ≤ 2 MB · LCP < 2.5 s on mid-range Android / 4G.

---

## Deploy to GitHub Pages (5 minutes)

### Step 1 — Push this repo

```bash
git init
git add .
git commit -m "chore: initial chapter 1 deploy"
git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages via GitHub Actions

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push any change to `main` — the workflow in `.github/workflows/deploy.yml`
   auto-deploys `ch01/` as the site root

Your chapter will be live at:
`https://YOUR-ORG.github.io/YOUR-REPO/`

---

## Get Far-Future Cache Headers (free, 5 minutes)

GitHub Pages sets only a ~10-minute cache on all assets.
**The fix: point your domain through Cloudflare (free plan) — it takes 5 minutes.**

### Option A — Cloudflare CDN in front of GitHub Pages (recommended)

This works even if you keep GitHub Pages as the origin.

1. **Add your domain to Cloudflare** (free plan at cloudflare.com)
2. Update your domain's nameservers to Cloudflare's (your registrar settings)
3. In Cloudflare dashboard → **DNS** → add a CNAME:
   ```
   Name:    @  (or www)
   Target:  YOUR-ORG.github.io
   Proxy:   ✓ Proxied (orange cloud)
   ```
4. In Cloudflare → **Rules** → **Cache Rules** → New rule:
   ```
   When: URI Path matches regex  \.(css|js|webp|woff2)$
   Then: Edge TTL = 1 year  |  Browser TTL = 1 year  |  Cache = Cache everything
   ```
5. In GitHub repo → **Settings** → **Pages** → **Custom domain** → enter your domain

That's it. Cloudflare now serves `css/`, `js/`, `img/` with
`Cache-Control: max-age=31536000, immutable` to every browser.
HTML is cached at the edge for ~1 min with instant purge on deploy.

### Option B — Migrate to Cloudflare Pages (zero config)

If you'd rather not proxy GitHub Pages, Cloudflare Pages is a direct replacement
and respects the `_headers` file already in this repo.

1. Go to **Cloudflare Pages** → Create project → Connect to Git → select your repo
2. Build settings: leave blank (static site, no build command)
3. Root directory: `ch01`
4. Deploy

The `_headers` file activates automatically — far-future cache on all assets,
short cache on HTML.

---

## Updating the Chapter

When you change `styles.css` or `chapter.js`:

```bash
# Re-generate content hash + versioned filename
python3 scripts/hash_assets.py   # (or do it manually — see below)

# Manual steps:
# 1. Compute MD5 of the changed file (first 8 chars)
# 2. Rename: styles.css → styles.<newhash>.css
# 3. Update the <link> in index.html to match
# 4. Commit + push — GitHub Actions redeploys automatically
```

Old versioned files can be deleted; browsers holding the old URL will just miss
cache on the next visit and fetch the new file.

---

## Technology Decisions

| Decision | Choice | Why |
|---|---|---|
| Layout | Single column, 720 px max | Mobile-first readability |
| Fonts | System Times New Roman | Zero download; near-universal |
| Images | WebP + lazy load | ~80% smaller than PNG/JPG |
| Maths | KaTeX (not MathJax-SVG) | Selectable, offline-capable, fast |
| Cache busting | Content-hash in filename | Immutable headers safe to use |
| Cache headers | Cloudflare CDN rules | GitHub Pages can't set headers |
