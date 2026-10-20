import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';
import { allProducts, getProduct, relatedProducts, assets, inches, statusLabel, statusNote } from '@/lib/catalog';
import { commerce } from '@/config/commerce';
import { site } from '@/config/site';
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
    description: `${p.name}: the ${p.vitola.name.toLowerCase()} of the ${c.name} collection, inspired by the ${c.empire}. ${p.vitola.lengthMm} mm × ${p.vitola.ringGauge} ring gauge, ${p.strength?.toLowerCase() ?? ''} strength. For the tobacco trade.`,
    path: `/cigars/${p.slug}/`,
  });
}

const Pending = ({ note = 'To be confirmed by the manufacturer' }: { note?: string }) => <span className="pending">{note}</span>;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const found = getProduct((await params).slug);
  if (!found) notFound();
  const { product: p, collection: c } = found;
  const verified = p.specStatus === 'verified';
  const tag = verified ? '' : ' (reference)';

  const rows: [string, ReactNode][] = [
    [`Vitola${tag}`, p.vitola.name],
    [`Shape${tag}`, p.vitola.pressed ? 'Parejo, box-pressed (square)' : p.vitola.shape === 'parejo' ? 'Parejo (round)' : `Figurado (${p.vitola.shape === 'salomon' ? 'salomón' : p.vitola.shape})`],
    [`Length${tag}`, `${p.vitola.lengthMm} mm (${inches(p.vitola.lengthMm)})`],
    [`Ring gauge${tag}`, `${p.vitola.ringGauge} (${((p.vitola.ringGauge / 64) * 25.4).toFixed(1)} mm)`],
    [`Strength${tag}`, p.strength ?? <Pending />],
    ['Wrapper', p.wrapper ?? <Pending />],
    ['Binder', p.binder ?? <Pending />],
    ['Filler', p.filler ?? <Pending />],
    ['Tobacco origin', p.countryOfOrigin ?? <Pending note={`${site.sourcing.tobacco}; countries for this blend to be confirmed`} />],
    ['Manufacturer', p.manufacturer ?? <Pending note="Partner manufacturer to be named" />],
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
              {!commerce.enabled && (
                <span className="muted">
                  Trade pricing and minimum orders will be shared with trade partners once the blend is confirmed. <Link href="/contact/">Trade enquiries</Link>
                </span>
              )}
            </div>

            {!verified && (
              <p className="claim-note">
                <strong>Reference specifications.</strong> Format, strength and flavour profile follow the Heritage Cigars reference sheet. Each is confirmed with the manufacturer during blend development and may be adjusted.
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
              <h2 style={{ fontSize: 'var(--step-2)', marginBottom: 'var(--space-3)' }}>Flavour profile{verified ? '' : ' (target)'}</h2>
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
