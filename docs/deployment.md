# Deployment

The site is a static export: `npm run build` writes plain HTML, CSS, JS and assets to `out/`. No server, database or secrets are required.

## Build settings (any host)

| Setting | Value |
|---|---|
| Node.js | 20.9 or later (22 LTS recommended) |
| Install | `npm ci` |
| Build | `npm run build` |
| Output directory | `out` |
| Environment variable | `NEXT_PUBLIC_SITE_URL=https://www.<your-domain>` (canonical URLs, Open Graph, sitemap). Without it, URLs default to `http://localhost:3000`. |

## Vercel
1. Push the repository to GitHub (once a remote is authorised).
2. Import it in Vercel; the Next.js preset is detected. Set `NEXT_PUBLIC_SITE_URL` for Production.
3. Deploy. Add the custom domain and redirect the apex to `www` (or the reverse) so canonical URLs match.

## Netlify / Cloudflare Pages / static hosting
Build command `npm run build`, publish directory `out`. Configure the host to serve `404.html` for unknown paths (Netlify and Cloudflare Pages do this automatically).

## Before each deploy
```bash
npm run verify   # typecheck, lint, unit tests, build, link/metadata check, browser tests
```
If artwork changed: `npm run brand && npm run brand:png` and commit the regenerated `public/brand/`.

## Not included (requires authorisation)
- No remote repository is configured and nothing has been pushed.
- No hosting project, domain, analytics, payment provider or email service has been created.
