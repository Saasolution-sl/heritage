# Deployment

The site is a Next.js app. All pages are pre-rendered at build time; one small piece of request-time code (`src/proxy.ts`) reads the visitor's country from the hosting provider and sets the `hc-country` cookie used by the trade-access gate. It needs no database and no secrets.

## Recommended: Vercel
1. Push the repository to GitHub (once you decide where it should live).
2. Import it in Vercel. The Next.js preset is detected; no build settings to change.
3. Set `NEXT_PUBLIC_SITE_URL=https://www.<your-domain>` for Production (canonical URLs, Open Graph, sitemap).
4. Deploy and add the custom domain. Vercel sends `x-vercel-ip-country`, so country detection works with no extra setup.

## Other hosts
| Host | Notes |
|---|---|
| Netlify | Next.js runtime is automatic; country header `x-nf-country`. |
| Cloudflare (OpenNext adapter) | Country header `cf-ipcountry`. |
| Own server / VPS | `npm ci && npm run build && npm start` (Node 20.9+), behind Cloudflare or CloudFront so a country header reaches the app. Without one, the gate applies the default minimum age (21) and lets visitors pick their country. |

## Before each deploy
```bash
npm run verify   # typecheck, lint, unit tests, build, crawl check, browser tests
```
If artwork or collection data changed: `npm run brand && npm run brand:png`, then commit the regenerated `public/brand/`.

## Not done (needs your decision)
- No remote repository, hosting project, domain, analytics, payment provider or email service has been set up, and nothing has been pushed.
