import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { collections, allProducts } from '@/lib/catalog';
import { articles } from '@/lib/journal';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/collections/',
    '/heritage/',
    '/craftsmanship/',
    '/journal/',
    '/contact/',
    '/brand/',
    '/legal/privacy/',
    '/legal/terms/',
    '/legal/cookies/',
    '/legal/responsible-use/',
    ...collections.map((c) => `/collections/${c.slug}/`),
    ...allProducts().map(({ product }) => `/cigars/${product.slug}/`),
    ...articles.map((a) => `/journal/${a.slug}/`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
