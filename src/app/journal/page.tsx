import Link from 'next/link';
import { articles } from '@/lib/journal';
import { PageHead } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Journal',
  description: 'Notes on cigar craftsmanship, vitolas, tobacco, storage and the inspirations behind the Heritage Cigars collections.',
  path: '/journal/',
});

export default function JournalPage() {
  return (
    <>
      <PageHead
        eyebrow="Journal"
        title="Notes on the leaf."
        lede="Craftsmanship, vitolas, tobacco, storage and the stories behind the collections. Entries marked Draft are awaiting editorial review."
        crumbs={[{ label: 'Journal' }]}
      />
      <section className="section">
        <div className="container journal-grid">
          {articles.map((a) => (
            <Link key={a.slug} href={`/journal/${a.slug}/`} className="journal-card" data-reveal>
              <div className="journal-card__meta">
                <span className="eyebrow">{a.category}</span>
                {a.status === 'draft' && <span className="badge">Draft</span>}
              </div>
              <h2 style={{ fontSize: 'var(--step-2)' }}>{a.title}</h2>
              <p>{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
