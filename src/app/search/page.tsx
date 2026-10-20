import { collections } from '@/lib/catalog';
import { articles } from '@/lib/journal';
import { PageHead } from '@/components/PageHead';
import { SearchClient, type SearchEntry } from '@/components/SearchClient';
import { pageMeta } from '@/lib/seo';

export const metadata = { ...pageMeta({ title: 'Search', description: 'Search the Heritage Cigars collections and journal.', path: '/search/' }), robots: { index: false } };

// The index is built at compile time and shipped with the page; no server needed.
const index: SearchEntry[] = [
  ...collections.map((c) => ({ href: `/collections/${c.slug}/`, title: `${c.name} collection`, kind: c.empire, text: `${c.inspiration} ${c.story} ${c.emblem.motif} ${c.accent.name}` })),
  ...collections.flatMap((c) =>
    c.products.map((p) => ({ href: `/cigars/${p.slug}/`, title: p.name, kind: `Cigar · ${p.vitola.name}`, text: `${c.name} ${c.empire} ${p.summary} ${p.vitola.name} ${p.vitola.shape} ${p.strength ?? ''} ${p.flavorDirection.join(' ')}` })),
  ),
  ...articles.map((a) => ({ href: `/journal/${a.slug}/`, title: a.title, kind: `Journal · ${a.category}`, text: `${a.excerpt} ${a.body.map((b) => ('text' in b ? b.text : b.items.join(' '))).join(' ')}` })),
  { href: '/heritage/', title: 'Our Heritage', kind: 'Page', text: 'heritage history empires brand story' },
  { href: '/craftsmanship/', title: 'Craftsmanship', kind: 'Page', text: 'craftsmanship construction band foil blend manufacturer' },
  { href: '/brand/', title: 'Brand assets', kind: 'Page', text: 'logo brand kit colours palette typography band packaging download' },
];

export default function SearchPage() {
  return (
    <>
      <PageHead eyebrow="Search" title="Search" crumbs={[{ label: 'Search' }]} />
      <section className="section" style={{ paddingTop: 'var(--space-7)' }}>
        <div className="container">
          <SearchClient index={index} />
        </div>
      </section>
    </>
  );
}
