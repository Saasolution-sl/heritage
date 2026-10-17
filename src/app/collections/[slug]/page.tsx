/* eslint-disable @next/next/no-img-element -- static export serves pre-optimised SVG artwork */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { collections, getCollection, assets, statusLabel, statusNote } from '@/lib/catalog';
import { PageHead, Rule } from '@/components/PageHead';
import { BreadcrumbJsonLd } from '@/components/Breadcrumbs';
import { pageMeta } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => collections.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCollection((await params).slug);
  if (!c) return {};
  return pageMeta({
    title: `${c.name} Collection`,
    description: `${c.name}, inspired by the ${c.empire}. ${c.inspiration} A concept collection by Empire Cigars.`,
    path: `/collections/${c.slug}/`,
  });
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCollection((await params).slug);
  if (!c) notFound();
  const i = collections.indexOf(c);
  const prev = collections[(i + collections.length - 1) % collections.length];
  const next = collections[(i + 1) % collections.length];
  const accent = { '--accent': c.accent.hex } as CSSProperties;

  return (
    <div style={accent}>
      <BreadcrumbJsonLd items={[{ name: 'Collections', path: '/collections/' }, { name: c.name, path: `/collections/${c.slug}/` }]} />
      <PageHead
        eyebrow={`Collection N° ${c.numeral} · ${c.empire}`}
        title={c.name}
        lede={c.inspiration}
        crumbs={[{ href: '/collections/', label: 'Collections' }, { label: c.name }]}
        accent={c.accent.hex}
      >
        <div className="collection-hero">
          <img className="collection-hero__band" src={assets.band(c)} alt={`The ${c.name} cigar band: ${c.emblem.motif.toLowerCase()} on ${c.accent.name.toLowerCase()}`} width={748} height={260} />
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <span className="accent-chip">
              <i aria-hidden="true" /> Accent: {c.accent.name} <code>{c.accent.hex}</code>
            </span>
            <span className="accent-chip">Period: {c.period}</span>
          </div>
        </div>
      </PageHead>

      <section className="section">
        <div className="container split">
          <div className="prose" data-reveal>
            <p className="eyebrow">The inspiration</p>
            <h2 className="title" style={{ margin: 'var(--space-4) 0 var(--space-5)' }}>
              {c.empire}
            </h2>
            <p>{c.story}</p>
            <Rule />
            <h3 style={{ fontSize: 'var(--step-1)', margin: 'var(--space-6) 0 var(--space-2)' }}>The emblem</h3>
            <p className="muted">
              {c.emblem.motif}. {c.emblem.note}
            </p>
          </div>
          <figure className="panel-figure" data-reveal style={{ aspectRatio: '3 / 2' }}>
            <img src={assets.boxLid(c)} alt={`${c.name} presentation box lid, concept artwork`} width={1200} height={800} loading="lazy" />
            <figcaption>Presentation box · concept artwork</figcaption>
          </figure>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="formats">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">In the collection</p>
            <h2 id="formats" className="title">
              The {c.name} cigar
            </h2>
          </div>
          {c.products.map((p) => (
            <article key={p.slug} className="split" style={{ alignItems: 'center' }}>
              <figure className="panel-figure" style={{ aspectRatio: '1' }}>
                <img src={assets.bandDetail(p)} alt={`${p.name}: band detail, concept illustration`} width={400} height={400} loading="lazy" />
              </figure>
              <div>
                <span className="badge">{statusLabel[p.status]}</span>
                <h3 className="title" style={{ margin: 'var(--space-4) 0 var(--space-3)' }}>
                  {p.name}
                </h3>
                <p className="muted">{p.summary}</p>
                <p>
                  {p.vitola.name} · {p.vitola.lengthMm} mm × {p.vitola.ringGauge} ring gauge <span className="muted">(proposed)</span>
                </p>
                <p className="muted" style={{ fontSize: 'var(--step--1)' }}>
                  {statusNote[p.status]}
                </p>
                <Link href={`/cigars/${p.slug}/`} className="btn btn--primary">
                  View the {p.vitola.name}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <nav className="section" aria-label="More collections">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <Link href={`/collections/${prev.slug}/`} className="text-link text-link--back">
            {prev.name}
          </Link>
          <Link href="/collections/" className="text-link">
            All collections
          </Link>
          <Link href={`/collections/${next.slug}/`} className="text-link">
            {next.name}
          </Link>
        </div>
      </nav>
    </div>
  );
}
