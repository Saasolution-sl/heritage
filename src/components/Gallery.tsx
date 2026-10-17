'use client';

import { useState } from 'react';

export type GalleryImage = { src: string; alt: string; kind: 'cigar' | 'band' | 'detail' | 'box'; caption: string };

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  return (
    <div className="gallery">
      <div className="gallery__stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.src} alt={current.alt} data-kind={current.kind} />
      </div>
      <p className="gallery__caption" aria-live="polite">
        {current.caption}
      </p>
      <ul className="gallery__thumbs" aria-label="Product images">
        {images.map((img, i) => (
          <li key={img.src}>
            <button type="button" className="gallery__thumb" aria-pressed={i === index} aria-label={`Show ${img.caption.toLowerCase()}`} onClick={() => setIndex(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
