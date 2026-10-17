# Empire Cigars

*A Collection of Empires. A Legacy in Every Puff.*

Brand system, asset library and catalog website for **Empire Cigars**, a luxury cigar house in development whose twelve collections are inspired by the great empires of history.

> **Catalog mode.** Every product is a design concept. Nothing is offered for sale, and no prices, tobacco origins, blends or manufacturers are claimed until verified. See `docs/launch-checklist.md`.

## What's here

| Path | Contents |
|---|---|
| `src/app/` | Website routes (Next.js App Router, static export) |
| `src/components/` | Header, footer, age gate, cards, gallery, search |
| `src/data/collections.json` | The twelve collections and their products (single source of truth) |
| `src/lib/` | Typed catalog access, journal articles, SEO helper, age-confirmation store |
| `src/config/` | Site details, commerce switch (off), compliance settings per market |
| `src/styles/tokens.css` | Design tokens (colour, type, spacing, motion, layers) |
| `public/brand/` | Generated brand assets: logos, favicons, emblems, cigar bands, product renders, packaging, patterns, social, stationery |
| `scripts/brand/` | Asset generator (SVG) and PNG/ICO exporter |
| `docs/brand/` | Brand guidelines, asset-library guide, tokens JSON, and the original supplied kit |
| `docs/` | Inspection notes, data model, deployment, launch checklist |
| `tests/`, `e2e/` | Unit tests (Vitest) and browser tests (Playwright, desktop + mobile) |

## Setup

Requires Node.js 20.9+ (22 LTS recommended) and Git.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Static site in `out/` |
| `npm start` | Serve `out/` on http://127.0.0.1:3000 |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm test` | Unit tests: data integrity, no unverified claims, token contrast, asset library |
| `npm run check` | After a build: every link and asset resolves, every page has title, description, canonical and OG image, no prices or cart wording |
| `npm run test:e2e` | Browser tests against `out/` (run `npm run build` first) |
| `npm run verify` | All of the above, in order |
| `npm run brand` | Regenerate all SVG brand assets from `scripts/brand` and `collections.json` |
| `npm run brand:png` | Regenerate PNG exports and `favicon.ico` (uses Chromium via Playwright) |

On Windows, if Playwright has no browser yet: `npx playwright install chromium`.

## Routes

`/` · `/collections/` · `/collections/{slug}/` (12) · `/cigars/{slug}/` (12) · `/heritage/` · `/craftsmanship/` · `/journal/` · `/journal/{slug}/` (6) · `/contact/` · `/search/` · `/brand/` · `/legal/privacy/` · `/legal/terms/` · `/legal/cookies/` · `/legal/responsible-use/` · branded 404 · `sitemap.xml` · `robots.txt` · `manifest.webmanifest`

## Deployment

Static hosting (Vercel, Netlify, Cloudflare Pages, S3). Build `npm run build`, output `out`, set `NEXT_PUBLIC_SITE_URL`. Details: `docs/deployment.md`.

## Installing on F:\Empire-Cigars (Windows)

This project was built in a cloud session that cannot reach your `F:` drive. It is delivered as `empire-cigars.bundle` (complete Git history) and `empire-cigars.zip` (working files). On your Windows machine:

```powershell
# 1. Check the drive and that the target does not already exist
Test-Path F:\                 # must be True
Test-Path F:\Empire-Cigars    # if True, inspect it first — do not overwrite existing work

# 2. Clone from the bundle (keeps the Git history)
git clone C:\path\to\empire-cigars.bundle F:\Empire-Cigars
cd F:\Empire-Cigars
git remote remove origin       # the bundle path is not a real remote

# 3. Verify
git rev-parse --show-toplevel  # F:/Empire-Cigars
git status                     # clean
git log --oneline

# 4. Install and check
npm install
npx playwright install chromium
npm run verify
```

No remote repository is configured. Add one only when you decide where the code should live.
