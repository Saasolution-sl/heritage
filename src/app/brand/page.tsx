/* eslint-disable @next/next/no-img-element -- static export serves pre-optimised SVG artwork */
import type { CSSProperties } from 'react';
import { collections, assets } from '@/lib/catalog';
import { PageHead } from '@/components/PageHead';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Brand Assets',
  description: 'The Empire Cigars logo family, palette, collection accents, cigar bands and packaging artwork.',
  path: '/brand/',
});

const master = [
  { name: 'Obsidian Black', hex: '#0B0907', use: 'Backgrounds, navigation, luxury surfaces' },
  { name: 'Imperial Gold', hex: '#D6AD55', use: 'Primary highlights, buttons, key branding' },
  { name: 'Antique Gold', hex: '#9A7434', use: 'Borders, ornament, secondary details' },
  { name: 'Tobacco Brown', hex: '#5B321E', use: 'Textures, warm surfaces, photography' },
  { name: 'Warm Ivory', hex: '#F3E7CC', use: 'Text on dark, editorial details' },
];

const logos = [
  { file: 'empire-cigars-primary-full-color', label: 'Primary logo' },
  { file: 'empire-cigars-horizontal-gold', label: 'Horizontal (header)' },
  { file: 'empire-cigars-stacked-full-color', label: 'Stacked' },
  { file: 'empire-cigars-wordmark-tagline-full-color', label: 'Secondary wordmark' },
  { file: 'empire-cigars-monogram-gold', label: 'EC monogram' },
  { file: 'empire-cigars-crest-gold', label: 'Compact crest' },
  { file: 'empire-cigars-laurel-white', label: 'Laurel crest, white' },
  { file: 'empire-cigars-primary-on-light', label: 'Primary, light grounds', light: true },
  { file: 'empire-cigars-horizontal-black', label: 'Horizontal, black', light: true },
];

const Download = ({ href }: { href: string }) => (
  <a href={href} download className="text-link">
    SVG
  </a>
);

export default function BrandPage() {
  return (
    <>
      <PageHead
        eyebrow="Brand assets"
        title="The brand system"
        lede="The master identity and the twelve collection identities, as working vector files. The full guidelines live in docs/brand in the project repository."
        crumbs={[{ label: 'Brand assets' }]}
      >
        <p className="claim-note">
          <strong>Concept masters.</strong> Logos are outlined vectors suitable for screen and proofing. Band and box files are concept artwork; final print files must be approved with the printer.
        </p>
      </PageHead>

      <section className="section" aria-labelledby="logos">
        <div className="container">
          <div className="section-head">
            <h2 id="logos" className="title">
              Logo family
            </h2>
          </div>
          <div className="asset-grid">
            {logos.map((l) => (
              <figure key={l.file} className="asset" style={{ margin: 0 }}>
                <div className={`asset__preview${l.light ? ' asset__preview--light' : ''}`}>
                  <img src={`/brand/logos/${l.file}.svg`} alt={l.label} loading="lazy" />
                </div>
                <figcaption className="asset__body">
                  <span>{l.label}</span>
                  <Download href={`/brand/logos/${l.file}.svg`} />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="palette">
        <div className="container">
          <div className="section-head">
            <h2 id="palette" className="title">
              Master palette
            </h2>
          </div>
          <div className="swatches">
            {master.map((c) => (
              <div key={c.hex} className="swatch" style={{ '--chip': c.hex } as CSSProperties}>
                <div className="swatch__chip" />
                <div className="swatch__body">
                  <strong>{c.name}</strong>
                  <code>{c.hex}</code>
                  <p className="muted" style={{ margin: 'var(--space-1) 0 0' }}>
                    {c.use}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="section-head" style={{ marginTop: 'var(--space-9)' }}>
            <h2 className="title">Collection accents</h2>
            <p className="lede">Accents identify a collection on its band, box, emblem and page details. They never replace the master palette in site-wide navigation, buttons or backgrounds.</p>
          </div>
          <div className="swatches">
            {collections.map((c) => (
              <div key={c.slug} className="swatch" style={{ '--chip': c.accent.hex } as CSSProperties}>
                <div className="swatch__chip" style={{ display: 'grid', placeItems: 'center' }}>
                  <img src={assets.emblemOnAccent(c)} alt="" width={72} height={72} style={{ width: 72 }} loading="lazy" />
                </div>
                <div className="swatch__body">
                  <strong>
                    {c.numeral}. {c.name}
                  </strong>
                  <code>{c.accent.hex}</code>
                  <p className="muted" style={{ margin: 'var(--space-1) 0 0' }}>
                    {c.accent.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="bands">
        <div className="container">
          <div className="section-head">
            <h2 id="bands" className="title">
              Cigar bands
            </h2>
            <p className="lede">Flat artwork, to scale for each ring gauge. Print layouts with dielines are in /brand/cigar-bands/print/.</p>
          </div>
          <div className="asset-grid">
            {collections.map((c) => (
              <figure key={c.slug} className="asset" style={{ margin: 0 }}>
                <div className="asset__preview">
                  <img src={assets.band(c)} alt={`${c.name} band`} loading="lazy" />
                </div>
                <figcaption className="asset__body">
                  <span>{c.name}</span>
                  <Download href={assets.band(c)} />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface" aria-labelledby="packaging">
        <div className="container">
          <div className="section-head">
            <h2 id="packaging" className="title">
              Packaging
            </h2>
          </div>
          <div className="asset-grid">
            <figure className="asset" style={{ margin: 0 }}>
              <div className="asset__preview">
                <img src="/brand/packaging/collection-presentation-box.svg" alt="Collection presentation box" loading="lazy" />
              </div>
              <figcaption className="asset__body">
                <span>The Collection of Empires box</span>
                <Download href="/brand/packaging/collection-presentation-box.svg" />
              </figcaption>
            </figure>
            {collections.map((c) => (
              <figure key={c.slug} className="asset" style={{ margin: 0 }}>
                <div className="asset__preview">
                  <img src={assets.boxLid(c)} alt={`${c.name} box lid`} loading="lazy" />
                </div>
                <figcaption className="asset__body">
                  <span>{c.name} box lid</span>
                  <Download href={assets.boxLid(c)} />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
