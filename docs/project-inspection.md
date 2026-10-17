# Project inspection (17 October 2026)

## Environment
- Claude Code ran in a **Linux cloud container**, not on the user's Windows machine. The `F:\` drive does not exist here, so `F:\Empire-Cigars` could not be created or inspected from this session.
- The project was therefore built in a staging folder in the session and delivered as a git bundle and zip (see the main README, "Installing on F:"). It was **not** placed on `F:` and must be unpacked there on the Windows machine.
- Tooling available: Node.js 22, npm, Git 2.x, Chromium (for Playwright).

## Existing work found
- **No existing Empire Cigars repository, website, database, commerce system or deployment** was present. The only repository in the session (`rsvip-online`) is an unrelated product and was left untouched.
- The user supplied `Empire_Cigars_Brand_Kit.zip` (first-pass kit): concept SVG logos using live `Georgia` text, PNG favicons/avatars, a band layout template, a short guideline and CSS/JSON tokens. Preserved unchanged in `docs/brand/reference-kit-v1/`.
- The reference images/brand board and the "reference sheet" of proposed dimensions and tasting notes mentioned in the brief were **not** supplied. Concept vitolas, strengths and flavour directions in `collections.json` are therefore proposals written for this build, labelled as concepts everywhere they appear.

## Decisions
| Area | Decision | Why |
|---|---|---|
| Framework | Next.js 16 (App Router), static export | No server needed in catalog mode; any static host works; data-driven routes via `generateStaticParams`. |
| Styling | Plain CSS with custom-property tokens | No extra dependency; tokens are the single source of truth. |
| Fonts | Cormorant Garamond + Inter via `@fontsource` (self-hosted) | Matches the supplied kit's typography; no third-party font requests. |
| Data | `src/data/collections.json` + typed accessors | Editable without touching components; swappable for a CMS later. |
| Commerce | **Catalog mode** (`src/config/commerce.ts`, `enabled: false`) | No verified products, prices, provider or legal review. |
| Images | Generated vector renders | No product photography exists; renders are to scale and clearly labelled as illustrations. |
| Tests | Vitest (unit) + Playwright (desktop & mobile) + a post-build link/metadata checker | |
| Dependencies | Runtime: next, react, react-dom, two @fontsource packages. Dev: TypeScript, ESLint, Vitest, Playwright, opentype.js (asset generator only). | |
