import Link from 'next/link';
import type { CSSProperties } from 'react';
import { assets, statusLabel, type Collection } from '@/lib/catalog';

export function CollectionCard({ collection, priority = false }: { collection: Collection; priority?: boolean }) {
  const product = collection.products[0];
  return (
    <Link href={`/collections/${collection.slug}/`} className="card" style={{ '--accent': collection.accent.hex } as CSSProperties} data-reveal>
      <div className="card__media">
        <span className="card__number" aria-hidden="true">
          {collection.numeral}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="card__emblem" src={assets.emblemOnAccent(collection)} alt="" width={200} height={200} loading={priority ? 'eager' : 'lazy'} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="card__cigar"
          src={assets.cigar(product)}
          alt={`${product.name} concept illustration with the ${collection.name} band`}
          width={600}
          height={1400}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
      <div className="card__body">
        <h3 className="card__title">{collection.name}</h3>
        <p className="card__empire">{collection.empire}</p>
        <p className="card__text">{collection.inspiration}</p>
        <div className="card__meta">
          <span style={{ whiteSpace: 'nowrap' }}>
            {product.vitola.name} · {product.vitola.lengthMm} × {product.vitola.ringGauge}
          </span>
          <span className="badge">{statusLabel[product.status]}</span>
        </div>
      </div>
    </Link>
  );
}
