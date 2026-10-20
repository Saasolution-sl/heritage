/* eslint-disable @next/next/no-img-element -- static export serves pre-optimised SVG artwork */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { collections, getCollection, assets } from '@/lib/catalog';
import { articles } from '@/lib/journal';
import { CollectionCard } from '@/components/CollectionCard';
import { Rule } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';
import { site } from '@/config/site';

export const metadata = {
  ...pageMeta({
    title: 'A Collection of Empires',
    description: site.description,
    path: '/',
  }),
  title: { absolute: 'Heritage Cigars — A Collection of Empires' },
};

export default function Home() {
  const saadian = getCollection('saadian')!;
  const saadianProduct = saadian.products[0];
  const heroCigars = ['charlemagne', 'imperator', 'saadian'].map((s) => getCollection(s)!.products[0]);

  return (
    <>
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Heritage Cigars · Twelve collections</p>
            <h1 id="hero-title" className="hero__title">
              A Collection of <em>Empires.</em>
            </h1>
            <p className="lede">Distinctive cigar concepts inspired by the craftsmanship, character and legacy of the world&rsquo;s great empires.</p>
            <div className="btn-row">
              <Link href="/collections/" className="btn btn--primary">
                Explore the Collection
              </Link>
              <Link href="/heritage/" className="btn btn--ghost">
                Discover Our Heritage
              </Link>
            </div>
          </div>
          <div className="hero__media" aria-hidden="true">
            <div className="hero__frame" />
            {heroCigars.map((p, i) => (
              <img key={p.slug} className={`hero__cigar hero__cigar--${i + 1}`} src={assets.cigar(p)} alt="" width={600} height={1400} fetchPriority={i === 1 ? 'high' : 'auto'} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured collections */}
      <section className="section" aria-labelledby="collections-title" id="collections">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The collections</p>
            <h2 id="collections-title" className="title">
              Twelve empires, one house.
            </h2>
            <Rule />
            <p className="lede">Each collection carries its own colour, emblem and band, and the same Heritage Cigars signature. All twelve are in development for the trade.</p>
          </div>
          <div className="collection-grid">
            {collections.map((c, i) => (
              <CollectionCard key={c.slug} collection={c} priority={i < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* Imperial showcase */}
      <section className="section section--surface" aria-labelledby="showcase-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The inspirations</p>
            <h2 id="showcase-title" className="title">
              From the Nile to the Andes.
            </h2>
            <p className="lede">Four thousand years of empire, read through architecture, ornament and craft — and drawn as twelve original emblems.</p>
          </div>
          <div className="showcase">
            {collections.map((c) => (
              <Link key={c.slug} href={`/collections/${c.slug}/`} className="showcase__item" style={{ '--accent': c.accent.hex } as CSSProperties} data-reveal>
                <span className="showcase__numeral" aria-hidden="true">
                  {c.numeral}
                </span>
                <img className="showcase__emblem" src={assets.emblemOnAccent(c)} alt="" width={200} height={200} loading="lazy" />
                <span className="showcase__name">{c.name}</span>
                <span className="showcase__empire">
                  {c.empire}
                  <br />
                  {c.period}
                </span>
                <p className="showcase__text">{c.inspiration}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="section" aria-labelledby="craft-title">
        <div className="container split">
          <div data-reveal>
            <p className="eyebrow">Craftsmanship</p>
            <h2 id="craft-title" className="title" style={{ margin: 'var(--space-4) 0 var(--space-5)' }}>
              Built to be examined closely.
            </h2>
            <p className="lede">A premium cigar is judged by its construction, its leaf and its band. We are designing every element of ours to stand up to that scrutiny.</p>
            <ul className="facts">
              <li>
                <span className="facts__n">I</span>
                <div>
                  <h3>Format</h3>
                  <p>A distinct vitola for every collection, from a 38-ring lancero to a 60-ring gordo, a box-pressed robusto and a grand salomón.</p>
                </div>
              </li>
              <li>
                <span className="facts__n">II</span>
                <div>
                  <h3>Leaf and blend</h3>
                  <p>Blends of tobaccos from several Latin American countries, each made with the partner manufacturer best suited to it.</p>
                </div>
              </li>
              <li>
                <span className="facts__n">III</span>
                <div>
                  <h3>Band and box</h3>
                  <p>Twelve bands designed for foil stamping, sized to each ring gauge, and a presentation box for every collection.</p>
                </div>
              </li>
            </ul>
            <p className="claim-note">
              <strong>Confirmed today:</strong> the brand, bands, packaging and formats, and our sourcing approach — Latin American tobaccos, several partner manufacturers. The countries and manufacturer behind each blend will be named once agreed.
            </p>
            <p style={{ marginTop: 'var(--space-5)' }}>
              <Link href="/craftsmanship/" className="text-link">
                Our approach to craft
              </Link>
            </p>
          </div>
          <figure className="panel-figure" data-reveal>
            <img src={assets.bandDetail(getCollection('caesar')!.products[0])} alt="Close-up of the Caesar band on a concept cigar illustration" width={400} height={400} loading="lazy" />
            <figcaption>Caesar band · concept illustration</figcaption>
          </figure>
        </div>
      </section>

      {/* Saadian feature */}
      <section className="section saadian" aria-labelledby="saadian-title">
        <div className="container split split--reverse">
          <div data-reveal>
            <p className="eyebrow">Collection N° X · The Saadian dynasty of Morocco</p>
            <h2 id="saadian-title" className="title" style={{ margin: 'var(--space-4) 0 var(--space-5)' }}>
              Emerald, gold and the geometry of Marrakesh.
            </h2>
            <p className="lede">{saadian.inspiration}</p>
            <p className="muted">{saadian.story}</p>
            <div className="btn-row" style={{ marginTop: 'var(--space-6)' }}>
              <Link href="/collections/saadian/" className="btn btn--primary">
                Discover Saadian
              </Link>
              <Link href={`/cigars/${saadianProduct.slug}/`} className="btn btn--ghost">
                The {saadianProduct.vitola.name}
              </Link>
            </div>
          </div>
          <div className="saadian__media" data-reveal>
            <img className="saadian__box" src={assets.boxLid(saadian)} alt="Saadian presentation box lid, concept artwork: emerald band and eight-point zellige star" width={1200} height={800} loading="lazy" />
            <img className="saadian__detail" src={assets.bandDetail(saadianProduct)} alt="Saadian band on the box-pressed robusto, concept illustration" width={400} height={400} loading="lazy" />
            <img className="saadian__emblem" src={assets.emblem(saadian)} alt="Saadian eight-point zellige star emblem" width={200} height={200} loading="lazy" />
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="section" aria-labelledby="story-title">
        <div className="container section-head--center" style={{ display: 'grid', gap: 'var(--space-6)', justifyItems: 'center' }}>
          <p className="eyebrow" id="story-title">
            The house
          </p>
          <blockquote className="quote" data-reveal>
            Every empire left something behind — a road, a pattern, a way of making things well. Heritage Cigars is a contemporary house built on that idea.
          </blockquote>
          <Rule />
          <p className="lede" style={{ textAlign: 'center' }}>
            We are a new house, based in Ceuta and Paraguay, and we say so. Our heritage is borrowed with respect from history; our own record begins with the first cigar we make.
          </p>
          <Link href="/heritage/" className="text-link">
            Our heritage
          </Link>
        </div>
      </section>

      {/* Journal */}
      <section className="section section--surface" aria-labelledby="journal-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Journal</p>
            <h2 id="journal-title" className="title">
              Notes on the leaf.
            </h2>
          </div>
          <div className="journal-grid">
            {articles.slice(0, 3).map((a) => (
              <Link key={a.slug} href={`/journal/${a.slug}/`} className="journal-card" data-reveal>
                <div className="journal-card__meta">
                  <span className="eyebrow">{a.category}</span>
                  {a.status === 'draft' && <span className="badge">Draft</span>}
                </div>
                <h3>{a.title}</h3>
                <p>{a.excerpt}</p>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 'var(--space-6)' }}>
            <Link href="/journal/" className="text-link">
              All journal entries
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
