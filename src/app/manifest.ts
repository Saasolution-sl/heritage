import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Heritage Cigars',
    short_name: 'Heritage Cigars',
    start_url: '/',
    display: 'browser',
    background_color: '#0b0907',
    theme_color: '#0b0907',
    icons: [
      { src: '/brand/favicons/app-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/favicons/app-icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/favicons/maskable-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
