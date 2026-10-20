# Heritage Cigars

*A Collection of Empires. A Legacy in Every Puff.*

Brand system, asset library and trade website for **Heritage Cigars** (formerly Empire Cigars), a luxury cigar house supplying the tobacco trade from Ceuta (Spain) and Paraguay. Its twelve collections are inspired by the great empires of history and blended from tobaccos grown in several Latin American countries.

> **Trade catalogue.** Heritage Cigars sells business-to-business only. The site has no prices, cart or checkout; visitors confirm they are tobacco-trade professionals of legal age in their country. Wrapper, binder, filler and manufacturer are published per blend once final. See `docs/launch-checklist.md`.

## What's here

| Path | Contents |
|---|---|
| `src/app/` | Website routes (Next.js App Router, pre-rendered) |
| `src/proxy.ts` | Reads the visitor's country from the host and sets the `hc-country` cookie |
| `src/components/` | Header, footer, trade-access gate, cards, gallery, formats row, search |
| `src/data/collections.json` | The twelve collections and their products (single source of truth) |
| `src/config/` | Site and company details, trade ordering switch (off), per-country minimum ages |
| `src/lib/` | Typed catalog access, journal, SEO helper, access store |
| `src/styles/tokens.css` | Design tokens (`--hc-*`) |
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
| `npm run build` / `npm start` | Production build / serve it |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm test` | Unit tests: data integrity, no unconfirmed product claims, contrast, band lettering, country rules |
| `npm run check` | After a build: starts the server, crawls every page, checks links, assets, metadata and the 404 |
| `npm run test:e2e` | Browser tests against the production build (run `npm run build` first) |
| `npm run verify` | All of the above, in order |
| `npm run brand` | Regenerate the SVG brand assets from `scripts/brand` and `collections.json` |
| `npm run brand:png` | Regenerate PNG exports and `favicon.ico` (uses Chromium via Playwright) |

On Windows, if Playwright has no browser yet: `npx playwright install chromium`.

## Routes

`/` · `/collections/` · `/collections/{slug}/` (12) · `/cigars/{slug}/` (12) · `/heritage/` · `/craftsmanship/` · `/journal/` · `/journal/{slug}/` (6) · `/contact/` · `/search/` · `/brand/` · `/legal/privacy/` · `/legal/terms/` · `/legal/cookies/` · `/legal/responsible-use/` · branded 404 · `sitemap.xml` · `robots.txt` · `manifest.webmanifest`

## Deployment

Vercel recommended (country detection works out of the box). Set `NEXT_PUBLIC_SITE_URL`. Details: `docs/deployment.md`.

## Installing on your Windows machine

This project was built in a cloud session that cannot reach your `F:` drive. It is delivered as `heritage-cigars.bundle` (complete Git history) and `heritage-cigars.zip` (working files). The steps below use `F:\Empire-Cigars`, the folder you originally specified; use `F:\Heritage-Cigars` instead if you prefer the new name.

```powershell
# 1. Check the drive and that the target does not already exist
Test-Path F:\                 # must be True
Test-Path F:\Empire-Cigars    # if True, inspect it first — do not overwrite existing work

# 2. Clone from the bundle (keeps the Git history)
git clone C:\path\to\heritage-cigars.bundle F:\Empire-Cigars
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
