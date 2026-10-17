import type { NextConfig } from 'next';

// Static export: every route is pre-rendered HTML, so the site can be hosted
// on any static host (Vercel, Netlify, Cloudflare Pages, S3) with no server.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
