// Vector product renders: a cigar drawn to scale from its concept vitola, with
// the collection band wrapped around it. All renders share one scale and one
// canvas, so the formats compare truthfully side by side. These are
// illustrations for the catalog until real product photography exists.
import { bandInner } from './band.mjs';
import { r } from './geometry.mjs';

export const CANVAS = { width: 600, height: 1400 };
const S = 6; // canvas units per millimetre

function outline(shape, cx, top, len, D, pressed = false) {
  const x0 = cx - D / 2;
  const x1 = cx + D / 2;
  const bottom = top + len;
  if (shape === 'torpedo') {
    const t = len * 0.3;
    return `M${r(cx - D * 0.07)} ${r(top + 4)}Q${r(cx)} ${r(top - 2)} ${r(cx + D * 0.07)} ${r(top + 4)}C${r(x1 - D * 0.08)} ${r(top + t * 0.45)} ${r(x1)} ${r(top + t * 0.8)} ${r(x1)} ${r(top + t)}L${r(x1)} ${r(bottom)}L${r(x0)} ${r(bottom)}L${r(x0)} ${r(top + t)}C${r(x0)} ${r(top + t * 0.8)} ${r(x0 + D * 0.08)} ${r(top + t * 0.45)} ${r(cx - D * 0.07)} ${r(top + 4)}Z`;
  }
  if (shape === 'belicoso') {
    const t = len * 0.15;
    return `M${r(cx - D * 0.18)} ${r(top + 6)}Q${r(cx)} ${r(top - 4)} ${r(cx + D * 0.18)} ${r(top + 6)}C${r(x1 - D * 0.04)} ${r(top + t * 0.4)} ${r(x1)} ${r(top + t * 0.75)} ${r(x1)} ${r(top + t)}L${r(x1)} ${r(bottom)}L${r(x0)} ${r(bottom)}L${r(x0)} ${r(top + t)}C${r(x0)} ${r(top + t * 0.75)} ${r(x0 + D * 0.04)} ${r(top + t * 0.4)} ${r(cx - D * 0.18)} ${r(top + 6)}Z`;
  }
  if (shape === 'perfecto') {
    const h = len * 0.2;
    const f = len * 0.22;
    const nip = D * 0.2;
    return `M${r(cx - D * 0.16)} ${r(top + 6)}Q${r(cx)} ${r(top - 4)} ${r(cx + D * 0.16)} ${r(top + 6)}C${r(x1)} ${r(top + h * 0.5)} ${r(x1 + D * 0.04)} ${r(top + h)} ${r(x1 + D * 0.04)} ${r(top + len * 0.5)}C${r(x1 + D * 0.04)} ${r(bottom - f)} ${r(cx + nip * 1.6)} ${r(bottom - f * 0.25)} ${r(cx + nip)} ${r(bottom)}L${r(cx - nip)} ${r(bottom)}C${r(cx - nip * 1.6)} ${r(bottom - f * 0.25)} ${r(x0 - D * 0.04)} ${r(bottom - f)} ${r(x0 - D * 0.04)} ${r(top + len * 0.5)}C${r(x0 - D * 0.04)} ${r(top + h)} ${r(x0)} ${r(top + h * 0.5)} ${r(cx - D * 0.16)} ${r(top + 6)}Z`;
  }
  if (shape === 'salomon') {
    // Tapered head, long body, a bulb above a closed, pointed foot.
    const h = len * 0.2;
    const tip = D * 0.13;
    const bulb = top + len * 0.84;
    const nip = D * 0.17;
    return `M${r(cx - tip)} ${r(top + 6)}Q${r(cx)} ${r(top - 3)} ${r(cx + tip)} ${r(top + 6)}C${r(x1 - D * 0.06)} ${r(top + h * 0.45)} ${r(x1)} ${r(top + h * 0.8)} ${r(x1)} ${r(top + h)}L${r(x1)} ${r(top + len * 0.7)}C${r(x1)} ${r(top + len * 0.76)} ${r(x1 + D * 0.08)} ${r(bulb - len * 0.04)} ${r(x1 + D * 0.08)} ${r(bulb)}C${r(x1 + D * 0.08)} ${r(bulb + len * 0.06)} ${r(cx + nip * 1.8)} ${r(bottom - len * 0.03)} ${r(cx + nip)} ${r(bottom)}L${r(cx - nip)} ${r(bottom)}C${r(cx - nip * 1.8)} ${r(bottom - len * 0.03)} ${r(x0 - D * 0.08)} ${r(bulb + len * 0.06)} ${r(x0 - D * 0.08)} ${r(bulb)}C${r(x0 - D * 0.08)} ${r(bulb - len * 0.04)} ${r(x0)} ${r(top + len * 0.76)} ${r(x0)} ${r(top + len * 0.7)}L${r(x0)} ${r(top + h)}C${r(x0)} ${r(top + h * 0.8)} ${r(x0 + D * 0.06)} ${r(top + h * 0.45)} ${r(cx - tip)} ${r(top + 6)}Z`;
  }
  // Parejo: straight body, rounded cap, cut foot. Box-pressed (`pressed`) has a flatter, squarer cap.
  const cap = pressed ? D * 0.26 : D * 0.42;
  return `M${r(x0)} ${r(top + cap)}C${r(x0)} ${r(top + cap * 0.2)} ${r(cx - D * 0.3)} ${r(top)} ${r(cx)} ${r(top)}C${r(cx + D * 0.3)} ${r(top)} ${r(x1)} ${r(top + cap * 0.2)} ${r(x1)} ${r(top + cap)}L${r(x1)} ${r(bottom)}L${r(x0)} ${r(bottom)}Z`;
}

/**
 * Returns the SVG for a product render. `crop` returns a band close-up instead
 * of the full cigar (same drawing, different viewBox).
 */
export function cigarSvg(collection, product, { crop = false } = {}) {
  const { shape, lengthMm, ringGauge, pressed = false } = product.vitola;
  const id = product.slug;
  const len = lengthMm * S;
  // A box-pressed cigar of the same ring gauge shows a slightly narrower flat face.
  const D = (ringGauge / 64) * 25.4 * S * (pressed ? 0.9 : 1);
  const cx = CANVAS.width / 2;
  const top = (CANVAS.height - len) / 2;
  const bottom = top + len;
  const d = outline(shape, cx, top, len, D, pressed);

  // The band starts just below the head, or just below a tapered head.
  const taper = { torpedo: 0.3, belicoso: 0.15, perfecto: 0.2, salomon: 0.2 }[shape] ?? 0;
  const bandTop = top + Math.max(10 * S, len * taper + 3 * S);
  const { inner, L, H } = bandInner(collection, ringGauge);
  const k = S / 10; // band units are 0.1 mm
  // Round: the visible half-circumference projects onto the diameter. Pressed: one flat face shows, less foreshortened.
  // On a pressed cigar the 30 mm shield is fitted to the flat face.
  const squeeze = pressed ? Math.min(0.78, (0.94 * D) / (30 * S)) : 2 / Math.PI;
  const a = k * squeeze;
  const e = cx - a * (L / 2);
  const bandH = k * H;

  const foot =
    shape === 'perfecto' || shape === 'salomon'
      ? ''
      : `<ellipse cx="${cx}" cy="${r(bottom)}" rx="${r(D / 2)}" ry="${r(D * 0.1)}" fill="url(#${id}-filler)"/><ellipse cx="${cx}" cy="${r(bottom)}" rx="${r(D / 2)}" ry="${r(D * 0.1)}" fill="#120a05" filter="url(#${id}-grain)" opacity=".55"/>`;

  // Faint wrapper seam spiralling down the body, and a few veins.
  let seams = '';
  for (let y = top + D * 0.9; y < bottom - D * 0.4; y += D * 1.55) {
    seams += `M${r(cx - D / 2)} ${r(y)}C${r(cx - D * 0.1)} ${r(y + D * 0.18)} ${r(cx + D * 0.2)} ${r(y + D * 0.42)} ${r(cx + D / 2)} ${r(y + D * 0.62)}`;
  }
  const veins = [0.18, 0.43, 0.67, 0.84]
    .map((t, i) => {
      const y = top + len * t;
      const dx = (i % 2 ? 1 : -1) * D * 0.18;
      return `M${r(cx + dx)} ${r(y)}C${r(cx + dx * 1.6)} ${r(y + D * 0.5)} ${r(cx + dx * 0.4)} ${r(y + D * 1.1)} ${r(cx + dx * 1.2)} ${r(y + D * 1.8)}`;
    })
    .join('');

  const box = crop ? [cx - D * 1.6, bandTop - D * 0.9, D * 3.2, bandH + D * 1.8].map(r) : [0, 0, CANVAS.width, CANVAS.height];
  const vb = box.join(' ');
  const label = crop ? `${product.name}: band detail (illustration)` : `${product.name}: ${product.vitola.name}, ${lengthMm} mm × ${ringGauge} ring gauge (concept illustration)`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${Math.round(box[2])}" height="${Math.round(box[3])}" role="img" aria-labelledby="${id}-t"><title id="${id}-t">${label}</title>
<defs>
${pressed ? `<linearGradient id="${id}-wrap" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#2a1509"/><stop offset=".07" stop-color="#6e4126"/><stop offset=".14" stop-color="#9c6741"/><stop offset=".5" stop-color="#a87149"/><stop offset=".86" stop-color="#7e4c2c"/><stop offset=".93" stop-color="#4a2a17"/><stop offset="1" stop-color="#1e0f07"/></linearGradient>` : `<linearGradient id="${id}-wrap" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#22120a"/><stop offset=".14" stop-color="#5e3520"/><stop offset=".32" stop-color="#9a6440"/><stop offset=".42" stop-color="#b47e55"/><stop offset=".52" stop-color="#9e6844"/><stop offset=".68" stop-color="#6e4126"/><stop offset=".87" stop-color="#3e2213"/><stop offset="1" stop-color="#190c05"/></linearGradient>`}
<linearGradient id="${id}-shade" x1="0" x2="1">${pressed ? `<stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".1" stop-color="#000" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset=".9" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/>` : `<stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".2"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/>`}</linearGradient>
<radialGradient id="${id}-filler"><stop offset="0" stop-color="#6b4527"/><stop offset=".7" stop-color="#3d2312"/><stop offset="1" stop-color="#1d0f07"/></radialGradient>
<filter id="${id}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.55 0.018" numOctaves="3" seed="${collection.number * 7}"/><feColorMatrix values="0 0 0 0 0.08  0 0 0 0 0.04  0 0 0 0 0.01  0 0 0 1.4 -0.45"/><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="${id}-shadow" x="-50%" y="-10%" width="200%" height="120%"><feGaussianBlur stdDeviation="14"/></filter>
<clipPath id="${id}-clip"><path d="${d}"/></clipPath>
</defs>
<path d="${d}" transform="translate(18 22)" fill="#000" opacity=".55" filter="url(#${id}-shadow)"/>
<path d="${d}" fill="url(#${id}-wrap)"/>
<g clip-path="url(#${id}-clip)">
<rect x="0" y="0" width="${CANVAS.width}" height="${CANVAS.height}" fill="#2a160b" filter="url(#${id}-grain)" opacity=".55"/>
<path d="${seams}" fill="none" stroke="#1a0d06" stroke-opacity=".45" stroke-width="1.6"/>
<path d="${veins}" fill="none" stroke="#d9a878" stroke-opacity=".28" stroke-width="1.4"/>
<g transform="matrix(${r(a * 1000) / 1000} 0 0 ${k} ${r(e)} ${r(bandTop)})">${inner}</g>
<rect x="${r(cx - D / 2)}" y="${r(bandTop)}" width="${r(D)}" height="${r(bandH)}" fill="url(#${id}-shade)"/>
<rect x="${r(cx - D / 2)}" y="${r(top)}" width="${r(D)}" height="${r(bandTop - top)}" fill="url(#${id}-shade)" opacity=".8"/>
<rect x="${r(cx - D / 2)}" y="${r(bandTop + bandH)}" width="${r(D)}" height="${r(bottom - bandTop - bandH)}" fill="url(#${id}-shade)" opacity=".8"/>
</g>
${foot}
</svg>`;
}
