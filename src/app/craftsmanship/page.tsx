/* eslint-disable @next/next/no-img-element -- static export serves pre-optimised SVG artwork */
import Link from 'next/link';
import { collections, assets } from '@/lib/catalog';
import { PageHead } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Craftsmanship',
  description: 'How Heritage Cigars approaches format, leaf, blending, banding and packaging — and what is confirmed today versus what is still in development.',
  path: '/craftsmanship/',
});

const status = [
  { area: 'Brand identity, bands and packaging design', state: 'Designed', note: 'Artwork complete; print production not yet approved.' },
  { area: 'Formats (vitolas), strength and flavour profile', state: 'Specified', note: 'Reference specification for all twelve; confirmed blend by blend.' },
  { area: 'Tobacco sourcing', state: 'Confirmed', note: 'Blends of tobaccos from several Latin American countries.' },
  { area: 'Manufacturing', state: 'Confirmed approach', note: 'Several partner manufacturers, each matched to a blend; names to follow.' },
  { area: 'Wrapper, binder and filler per blend', state: 'In development', note: 'Published once each blend is final.' },
  { area: 'Construction method (e.g. hand-made, long filler)', state: 'Not confirmed', note: 'We make no construction claims until confirmed.' },
  { area: 'Ageing and resting periods', state: 'Not confirmed', note: 'No ageing claims are made.' },
];

export default function CraftsmanshipPage() {
  const caesar = collections[0].products[0];
  return (
    <>
      <PageHead
        eyebrow="Craftsmanship"
        title="The craft we are building toward."
        lede="A premium cigar rewards close attention: the evenness of the wrapper, the draw, the burn, the band. This page sets out our standards — and separates what is confirmed from what is still ahead of us."
        crumbs={[{ label: 'Craftsmanship' }]}
      />
      <section className="section">
        <div className="container split">
          <div className="prose" data-reveal>
            <p className="eyebrow">Our standards</p>
            <h2>What we will ask of every cigar</h2>
            <ul>
              <li>A format chosen for the character of the collection, not for novelty.</li>
              <li>Tobaccos from several Latin American countries, each blend made by the partner manufacturer best suited to it.</li>
              <li>Consistent construction, draw and burn, checked before banding and boxing.</li>
              <li>A band and box made to the same standard as the cigar inside.</li>
              <li>Specifications published only when they are true.</li>
            </ul>
            <p className="claim-note">
              <strong>These are our standards, not product claims.</strong> They are the brief we give each manufacturing partner. We will report what has been achieved once production begins.
            </p>
          </div>
          <figure className="panel-figure" style={{ aspectRatio: '1' }} data-reveal>
            <img src={assets.bandDetail(caesar)} alt="Caesar band on a concept cigar illustration" width={400} height={400} loading="lazy" />
            <figcaption>Caesar band · concept illustration</figcaption>
          </figure>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="status">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Transparency</p>
            <h2 id="status" className="title">
              Confirmed and not yet confirmed
            </h2>
          </div>
          <table className="spec-table" style={{ maxWidth: '60rem' }}>
            <caption className="visually-hidden">Status of each element of production</caption>
            <thead>
              <tr>
                <th scope="col">Area</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {status.map((s) => (
                <tr key={s.area}>
                  <th scope="row" style={{ color: 'var(--text)' }}>
                    {s.area}
                  </th>
                  <td>
                    <span className="badge">{s.state}</span>
                  </td>
                  <td className="muted">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="bands">
        <div className="container split split--reverse">
          <div className="prose" data-reveal>
            <p className="eyebrow">The band</p>
            <h2 id="bands">Designed for foil and emboss</h2>
            <p>
              Each band is drawn as production-minded artwork: a gold-foil layer for rules, lettering and the medallion rings; a printed layer for the collection colour; and a separate layer for the collection emblem. The flat length of every band is calculated from its cigar’s ring gauge, with a 10 mm glue overlap.
            </p>
            <p>
              The band follows the tall shield form of our reference sheet: a crowned shield carrying the collection emblem, over a ribbon with the collection name at a cap height of at least 2 mm. Final print approval, paper stock and foil choice will be made with the printer.
            </p>
            <Link href="/brand/" className="text-link">
              See the brand assets
            </Link>
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }} data-reveal>
            {collections.slice(0, 4).map((c) => (
              <img key={c.slug} src={assets.band(c)} alt={`${c.name} band artwork`} width={748} height={260} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <p className="lede">
            Read more in the journal: <Link href="/journal/how-a-premium-cigar-is-made/">how a premium cigar is made</Link> and <Link href="/journal/wrapper-binder-filler/">wrapper, binder and filler</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
