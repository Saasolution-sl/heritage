import { collections } from '@/lib/catalog';
import { CollectionCard } from '@/components/CollectionCard';
import { FormatsAtAGlance } from '@/components/FormatsAtAGlance';
import { PageHead } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'The Collections',
  description: 'Twelve Heritage Cigars collections, each inspired by a great empire, dynasty or civilisation, from Caesar to the Saadian dynasty of Morocco.',
  path: '/collections/',
});

export default function CollectionsPage() {
  return (
    <>
      <PageHead
        eyebrow="Twelve collections"
        title="The Collections"
        lede="One house, twelve identities. Every collection shares the Heritage Cigars signature and carries its own colour, emblem and band."
        crumbs={[{ label: 'Collections' }]}
      >
        <p className="claim-note">
          <strong>Trade catalogue.</strong> All twelve collections are in development. Formats, strengths and flavour profiles follow our reference specification and are confirmed blend by blend with each manufacturer. Trade orders are not yet open.
        </p>
      </PageHead>
      <section className="section">
        <div className="container collection-grid">
          {collections.map((c, i) => (
            <CollectionCard key={c.slug} collection={c} priority={i < 4} />
          ))}
        </div>
      </section>
      <FormatsAtAGlance />
    </>
  );
}
