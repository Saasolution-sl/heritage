// Cigar-band artwork. One unit = 0.1 mm, so a viewBox width of 748 is a 74.8 mm
// flat band. The flat length follows the ring gauge: circumference plus a
// 10 mm glue overlap. Layers are grouped by print process so a printer can map
// them to plates: paper/ink colours, gold foil and (print file only) dieline.
import { circle, ring, rect, lozenge, poly, r } from './geometry.mjs';
import { arcTextPath, textPath, measure } from './font.mjs';
import { emblem } from './emblems.mjs';

export const GOLD = '#D6AD55';
export const ANTIQUE = '#9A7434';
export const OBSIDIAN = '#0B0907';
export const IVORY = '#F3E7CC';

export const BAND_HEIGHT = 260; // 26 mm medallion; wings are 16 mm
const WING_TOP = 50;
const WING_BOTTOM = 210;
const OVERLAP_MM = 10;

export function bandLengthMm(ringGauge) {
  const diameterMm = (ringGauge / 64) * 25.4;
  return Math.round((Math.PI * diameterMm + OVERLAP_MM) * 10) / 10;
}

/** Ink colour for elements printed on the accent field. */
export const inkOn = (collection) => (collection.accent.on === IVORY ? GOLD : OBSIDIAN);

function wingPattern(slug, x0, x1, y) {
  // Shared lozenge chain; the Saadian band swaps in small eight-point stars.
  let d = '';
  for (let x = x0 + 12; x < x1 - 10; x += 22) {
    if (slug === 'saadian') {
      d += poly([[x - 5, y - 5], [x + 5, y - 5], [x + 5, y + 5], [x - 5, y + 5]]);
      d += lozenge(x, y, 14, 14);
    } else {
      d += lozenge(x, y, 12, 9);
    }
  }
  return d;
}

/**
 * Returns { svg, widthMm, heightMm } for a collection's band.
 * options.print adds bleed, a dieline and layer names for production.
 */
export function band(collection, ringGauge, { print = false } = {}) {
  const lengthMm = bandLengthMm(ringGauge);
  const L = Math.round(lengthMm * 10);
  const H = BAND_HEIGHT;
  const cx = L / 2;
  const cy = H / 2;
  const accent = collection.accent.hex;
  const ink = inkOn(collection);
  const R = 130;

  // Paper / process-colour layer.
  const paper = [
    `<rect x="0" y="${WING_TOP}" width="${L}" height="${WING_BOTTOM - WING_TOP}" fill="${OBSIDIAN}"/>`,
    `<rect x="0" y="${WING_TOP + 50}" width="${L}" height="${WING_BOTTOM - WING_TOP - 100}" fill="${accent}"/>`,
    `<path d="${circle(cx, cy, R)}" fill="${OBSIDIAN}"/>`,
    `<path d="${circle(cx, cy, 86)}" fill="${accent}"/>`,
  ].join('');

  // Gold foil layer: rules, patterns, rings, lettering, emblem (where gold).
  // Wing elements stop where they meet the medallion at their own height.
  const edge = (y) => Math.sqrt(Math.max(0, R * R - (y - cy) ** 2));
  const rule = (y, h) => rect(0, y, cx - edge(y + h / 2) - 4, h) + rect(cx + edge(y + h / 2) + 4, y, L - cx - edge(y + h / 2) - 4, h);
  const rules = rule(WING_TOP + 8, 5) + rule(WING_BOTTOM - 13, 5) + rule(WING_TOP + 48, 3) + rule(WING_BOTTOM - 51, 3);
  const patternRow = (y) => wingPattern(collection.slug, 0, cx - edge(y), y) + wingPattern(collection.slug, cx + edge(y), L, y);
  const rings = ring(cx, cy, R, R - 5) + ring(cx, cy, 92, 88);
  const top = arcTextPath('EMPIRE CIGARS', { face: 'displayBold', size: 21, cx, cy, radius: 101, tracking: 0.1 });
  const name = collection.name.toUpperCase();
  const nameSize = name.length > 8 ? 19 : 22;
  const bottom = arcTextPath(name, { face: 'displayBold', size: nameSize, cx, cy, radius: 117, tracking: 0.1, bottom: true });
  const dividers = lozenge(cx - 109, cy, 10, 14) + lozenge(cx + 109, cy, 10, 14);
  const foil = rules + rings + top + bottom + dividers;
  const pattern = patternRow(WING_TOP + 30) + patternRow(WING_BOTTOM - 30);

  // Numeral on both wings, on the accent stripe, in the collection's ink colour.
  const numeral = `N° ${collection.numeral}`;
  // Centre each numeral in the wing's visible stretch (left wing starts after the
  // glue overlap) and shrink it to fit; very slim vitolas omit it.
  const wingStart = OVERLAP_MM * 10;
  const wingEnd = cx - edge(cy) - 14;
  const available = wingEnd - wingStart - 20;
  const fit = Math.min(40, (40 * available) / measure(numeral, { face: 'displayBold', size: 40, tracking: 0.08 }));
  const numSize = Math.max(fit, 0);
  const wingMid = (wingStart + wingEnd) / 2;
  const numerals =
    numSize >= 22
      ? textPath(numeral, { face: 'displayBold', size: numSize, x: wingMid, y: cy + numSize * 0.33, tracking: 0.08 }) +
        textPath(numeral, { face: 'displayBold', size: numSize, x: (cx + edge(cy) + 14 + L) / 2, y: cy + numSize * 0.33, tracking: 0.08 })
      : '';

  const s = 0.8;
  const emblemMarkup = `<g transform="translate(${r(cx - 100 * s)} ${r(cy - 100 * s)}) scale(${s})">${emblem(collection.slug, { color: ink, ground: accent })}</g>`;

  const foilGroup = `<g id="foil-gold" fill="${GOLD}"><path fill-rule="evenodd" d="${foil}"/><path d="${pattern}"/></g>`;
  const inkGroup = `<g id="ink-collection" fill="${ink}"><path d="${numerals}"/>${emblemMarkup}</g>`;

  if (!print) {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${H}" width="${lengthMm}mm" height="${H / 10}mm" role="img" aria-labelledby="t"><title id="t">${collection.name} cigar band, Empire Cigars</title><g id="paper">${paper}</g>${foilGroup}${inkGroup}</svg>`,
      widthMm: lengthMm,
      heightMm: H / 10,
    };
  }

  // Print file: 3 mm bleed on the wings, dieline in a separate layer.
  const B = 30;
  const die =
    `M0 ${WING_TOP}H${r(cx - Math.sqrt(R * R - (cy - WING_TOP) ** 2))}` +
    `A${R} ${R} 0 0 1 ${r(cx + Math.sqrt(R * R - (cy - WING_TOP) ** 2))} ${WING_TOP}` +
    `H${L}V${WING_BOTTOM}H${r(cx + Math.sqrt(R * R - (WING_BOTTOM - cy) ** 2))}` +
    `A${R} ${R} 0 0 1 ${r(cx - Math.sqrt(R * R - (WING_BOTTOM - cy) ** 2))} ${WING_BOTTOM}H0Z`;
  const bleedPaper = paper
    .replace(`<rect x="0" y="${WING_TOP}" width="${L}" height="${WING_BOTTOM - WING_TOP}"`, `<rect x="${-B}" y="${WING_TOP - B}" width="${L + 2 * B}" height="${WING_BOTTOM - WING_TOP + 2 * B}"`)
    .replace(`<path d="${circle(cx, cy, R)}"`, `<path d="${circle(cx, cy, R + B)}"`);
  const glue = `<rect x="0" y="${WING_TOP}" width="${OVERLAP_MM * 10}" height="${WING_BOTTOM - WING_TOP}" fill="none" stroke="#00A0E3" stroke-width="2" stroke-dasharray="8 6"/>`;
  const notes = `<g id="notes" fill="#555">${`<path d="${textPath(`${collection.name.toUpperCase()} BAND · RG ${ringGauge} · FLAT ${lengthMm} x ${H / 10} MM · OVERLAP ${OVERLAP_MM} MM · CONCEPT ARTWORK, NOT PRINT-APPROVED`, { face: 'sans', size: 14, x: 0, y: H + 70, anchor: 'start' })}"/>`}</g>`;
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-B - 20} ${-B - 20} ${L + 2 * B + 40} ${H + 2 * B + 100}" width="${(L + 2 * B + 40) / 10}mm" height="${(H + 2 * B + 100) / 10}mm"><title>${collection.name} band, print layout (concept)</title><g id="paper">${bleedPaper}</g>${foilGroup}${inkGroup}<g id="dieline" fill="none" stroke="#EC008C" stroke-width="2"><path d="${die}"/></g><g id="glue-area">${glue}</g>${notes}</svg>`,
    widthMm: lengthMm,
    heightMm: H / 10,
  };
}

/** Band inner markup only (no <svg>), for wrapping onto product renders. */
export function bandInner(collection, ringGauge) {
  const { svg } = band(collection, ringGauge);
  const L = Math.round(bandLengthMm(ringGauge) * 10);
  return { inner: svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/<title[^>]*>.*?<\/title>/, ''), L, H: BAND_HEIGHT };
}
