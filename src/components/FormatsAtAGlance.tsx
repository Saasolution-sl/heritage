/* eslint-disable @next/next/no-img-element -- static SVG renders */
import Link from 'next/link';
import { allProducts, assets, inches } from '@/lib/catalog';

/** All twelve formats side by side. The renders share one scale, so lengths and gauges compare truthfully. */
export function FormatsAtAGlance() {
  return (
    <section className="section section--surface" aria-labelledby="formats-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">The formats at a glance</p>
          <h2 id="formats-title" className="title">
            Twelve vitolas, to scale.
          </h2>
        </div>
        <ol className="formats">
          {allProducts().map(({ product: p, collection: c }) => (
            <li key={p.slug}>
              <Link href={`/cigars/${p.slug}/`} className="formats__item">
                <img src={assets.cigar(p)} alt="" width={600} height={1400} loading="lazy" />
                <strong>{c.name}</strong>
                <span>{p.vitola.name}</span>
                <span className="formats__size">
                  {inches(p.vitola.lengthMm)} × {p.vitola.ringGauge}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
