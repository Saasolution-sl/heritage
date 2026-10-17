import type { Metadata } from 'next';
import { site } from '@/config/site';

/** Per-page metadata with canonical URL and Open Graph defaults. */
export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: `${title} · ${site.name}`,
      description,
      url: path,
      images: [{ url: image ?? '/brand/social/og-default.png', width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: 'summary_large_image', title: `${title} · ${site.name}`, description },
  };
}
