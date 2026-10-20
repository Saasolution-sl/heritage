/* eslint-disable @next/next/no-img-element -- static export serves pre-optimised SVG artwork */
import Link from 'next/link';
import { collections, assets } from '@/lib/catalog';
import { PageHead, Rule } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Our Heritage',
  description: 'Heritage Cigars is a contemporary cigar house inspired by the great empires of history. Our heritage is borrowed with respect; our own story starts now.',
  path: '/heritage/',
});

export default function HeritagePage() {
  return (
    <>
      <PageHead
        eyebrow="Our heritage"
        title="A legacy in every puff."
        lede="Heritage Cigars is a new house with an old subject. We take our inspiration from the empires that shaped the world — and we are honest that our own history is only beginning."
        crumbs={[{ label: 'Our Heritage' }]}
      />
      <section className="section">
        <div className="container split">
          <div className="prose" data-reveal>
            <h2>A contemporary house</h2>
            <p>
              Heritage Cigars is a new cigar house, based in Ceuta and Paraguay, supplying the tobacco trade. We have no founding legend and no decades of family tradition to point to — and we will not invent them. What we have is a clear idea: a range of cigars in which each collection takes its character from one of history’s great empires, dynasties or civilisations, blended from tobaccos grown across Latin America.
            </p>
            <h2>Why empires</h2>
            <p>
              Empires were, among other things, enormous projects of craft: roads and aqueducts, tilework and textiles, goldsmithing, manuscripts and monumental architecture. They also left visual languages — the laurel, the tulip, the zellige star — that are still recognised centuries later. A premium cigar, with its band, its box and its ritual, is a natural place for that kind of ornament.
            </p>
            <h2>With respect</h2>
            <p>
              The names are tributes, not claims of provenance or endorsement. Our emblems are original drawings based on architectural and decorative motifs.
            </p>
            <Rule />
            <p style={{ marginTop: 'var(--space-5)' }}>
              <Link href="/journal/why-twelve-empires/" className="text-link">
                Why twelve empires
              </Link>
            </p>
          </div>
          <figure className="panel-figure" style={{ aspectRatio: '8 / 5' }} data-reveal>
            <img src="/brand/packaging/collection-presentation-box.svg" alt="The Collection of Empires presentation box, concept artwork with all twelve emblems" width={1600} height={1000} loading="lazy" />
            <figcaption>The Collection of Empires · concept presentation box</figcaption>
          </figure>
        </div>
      </section>
      <section className="section section--surface" aria-labelledby="twelve">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Twelve inspirations</p>
            <h2 id="twelve" className="title">
              The empires behind the collections
            </h2>
          </div>
          <div className="journal-grid">
            {collections.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}/`} className="journal-card" data-reveal>
                <img src={assets.emblemOnAccent(c)} alt="" width={64} height={64} style={{ width: 64 }} loading="lazy" />
                <span className="eyebrow">
                  N° {c.numeral} · {c.period}
                </span>
                <h3>{c.empire}</h3>
                <p>{c.inspiration}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
