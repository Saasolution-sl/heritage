import type { NextConfig } from 'next';

// Pages are pre-rendered at build time; src/proxy.ts runs per request to pass
// the visitor's country to the trade-access gate, so the site is deployed as
// a Next.js app (Vercel, Netlify or `next start`) rather than a static export.
const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
};

export default nextConfig;
