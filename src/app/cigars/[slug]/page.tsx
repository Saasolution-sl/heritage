import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';
import { allProducts, getProduct, relatedProducts, assets, inches, statusLabel, statusNote } from '@/lib/catalog';
import { commerce } from '@/config/commerce';
import { PageHead } from '@/components/PageHead';
import { Gallery } from '@/components/Gallery';
import { CollectionCard } from '@/components/CollectionCard';
import { BreadcrumbJsonLd } from '@/components/Breadcrumbs';
import { pageMeta } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => allProducts().map(({ product }) => ({ slug: product.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const found = getProduct((await params).slug);
  if (!found) return {};
  const { product: p, collection: c } = found;
  return pageMeta({
    title: p.name,
    description: `${p.name}: a proposed ${p.vitola.name.toLowerCase()} for the ${c.name} collection, inspired by the ${c.empire}. Concept product, not offered for sale.`,
    path: `/cigars/${p.slug}/`,
  });
}

const Pending = () => <span className="pending">To be confirmed by the manufacturer</span>;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const found = getProduct((await params).slug);
  if (!found) notFound();
  const { product: p, collection: c } = found;
  const verified = p.specStatus === 'verified';
  const tag = verified ? '' : ' (concept)';

  const rows: [string, ReactNode][] = [
    [`Vitola${tag}`, p.vitola.name],
    [`Shape${tag}`, p.vitola.shape === 'parejo' ? 'Parejo (straight)' : `Figurado (${p.vitola.shape})`],
    [`Length${tag}`, `${p.vitola.lengthMm} mm (${inches(p.vitola.lengthMm)})`],
    [`Ring gauge${tag}`, `${p.vitola.ringGauge} (${((p.vitola.ringGauge / 64) * 25.4).toFixed(1)} mm)`],
    [`Strength${tag}`, p.strength ?? <Pending />],
    ['Wrapper', p.wrapper ?? <Pending />],
    ['Binder', p.binder ?? <Pending />],
    ['Filler', p.filler ?? <Pending />],
    ['Country of origin', p.countryOfOrigin ?? <Pending />],
    ['Manufacturer', p.manufacturer ?? <Pending />],
    [`Packaging${tag}`, p.packaging ?? <Pending />],
  ];

  const images = [
    { src: assets.cigar(p), alt: `${p.name}, concept illustration to scale`, kind: 'cigar' as const, caption: 'The cigar · concept illustration' },
    { src: assets.bandDetail(p), alt: `${p.name}, band close-up`, kind: 'detail' as const, caption: 'Band close-up' },
    { src: assets.band(c), alt: `${c.name} band artwork, flat`, kind: 'band' as const, caption: 'Band artwork, flat' },
    { src: assets.boxLid(c), alt: `${c.name} presentation box lid`, kind: 'box' as const, caption: 'Presentation box · concept' },
  ];

  const related = relatedProducts(p);

  return (
    <div style={{ '--accent': c.accent.hex } as CSSProperties}>
      <BreadcrumbJsonLd
        items={[
          { name: 'Collections', path: '/collections/' },
          { name: c.name, path: `/collections/${c.slug}/` },
          { name: p.name, path: `/cigars/${p.slug}/` },
        ]}
      />
      <PageHead
        eyebrow={`${c.name} · Collection N° ${c.numeral}`}
        title={p.name}
        crumbs={[
          { href: '/collections/', label: 'Collections' },
          { href: `/collections/${c.slug}/`, label: c.name },
          { label: p.name },
        ]}
        accent={c.accent.hex}
      />
      <section className="section" style={{ paddingTop: 'var(--space-8)' }}>
        <div className="container product">
          <Gallery images={images} />
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <div>
              <span className="badge">{statusLabel[p.status]}</span>
              <p className="lede" style={{ marginTop: 'var(--space-4)' }}>
                {p.summary}
              </p>
              <p>{p.description}</p>
              <p className="muted">
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Inspiration — {c.empire}.</strong> {c.inspiration}
              </p>
            </div>

            <div className="availability">
              <strong>Availability</strong>
              <span className="muted">{statusNote[p.status]}</span>
              {!commerce.enabled && <span className="muted">Pricing will be published only when the product is confirmed and sales are permitted.</span>}
            </div>

            {!verified && (
              <p className="claim-note">
                <strong>Concept specifications.</strong> Format, strength and tasting direction below are design proposals from the brand brief. They will change if the manufacturer’s blend development requires it.
              </p>
            )}

            <table className="spec-table">
              <caption>Specifications</caption>
              <tbody>
                {rows.map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              <h2 style={{ fontSize: 'var(--step-2)', marginBottom: 'var(--space-3)' }}>Intended flavour direction{verified ? '' : ' (concept)'}</h2>
              {p.flavorDirection.length ? (
                <ul className="flavor-list">
                  {p.flavorDirection.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              ) : (
                <Pending />
              )}
              {!verified && (
                <p className="muted" style={{ fontSize: 'var(--step--1)', marginTop: 'var(--space-3)' }}>
                  A target for blend development, not a tasting note from a finished cigar.
                </p>
              )}
            </div>

            <Link href={`/collections/${c.slug}/`} className="text-link">
              The {c.name} collection
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--surface" aria-labelledby="related">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Related collections</p>
              <h2 id="related" className="title">
                You may also consider
              </h2>
            </div>
            <div className="collection-grid">
              {related.map(({ collection }) => (
                <CollectionCard key={collection.slug} collection={collection} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
