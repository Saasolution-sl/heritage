import { collections } from '@/lib/catalog';
import { CollectionCard } from '@/components/CollectionCard';
import { PageHead } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'The Collections',
  description: 'Twelve Empire Cigars collections, each inspired by a great empire, dynasty or civilisation, from Caesar to the Saadian dynasty of Morocco.',
  path: '/collections/',
});

export default function CollectionsPage() {
  return (
    <>
      <PageHead
        eyebrow="Twelve collections"
        title="The Collections"
        lede="One house, twelve identities. Every collection shares the Empire Cigars signature and carries its own colour, emblem and band."
        crumbs={[{ label: 'Collections' }]}
      >
        <p className="claim-note">
          <strong>Catalog mode.</strong> All twelve collections are concepts in development. Formats, strengths and tasting directions shown are proposals until confirmed by our manufacturer, and nothing is offered for sale.
        </p>
      </PageHead>
      <section className="section">
        <div className="container collection-grid">
          {collections.map((c, i) => (
            <CollectionCard key={c.slug} collection={c} priority={i < 4} />
          ))}
        </div>
      </section>
    </>
  );
}
