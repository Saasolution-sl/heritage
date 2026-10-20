// Cigar-band artwork, following the tall shield band of the Heritage Cigars
// reference sheet. One unit = 0.1 mm, so a viewBox width of 748 is a 74.8 mm
// flat band. The flat length follows the ring gauge: circumference plus a
// 10 mm glue overlap. Layers are grouped by print process so a printer can map
// them to plates: paper/ink colours, gold foil and (print file only) dieline.
//
// Anatomy (front centre at x = L/2):
//   shield  0–300   crest face: crown, wordmark, accent field, emblem
//   body   90–300   full-length strip behind the shield: rules, lozenges, numeral
//   ribbon 300–400  full-length name ribbon with the collection name at the front
import { rect, lozenge, poly, r } from './geometry.mjs';
import { textPath, measure } from './font.mjs';
import { emblem } from './emblems.mjs';
import { crownMarkup } from './marks.mjs';

export const GOLD = '#D6AD55';
export const ANTIQUE = '#9A7434';
export const OBSIDIAN = '#0B0907';
export const IVORY = '#F3E7CC';

export const BAND_HEIGHT = 400; // 40 mm overall: 30 mm shield face over a 10 mm name ribbon
const BODY_TOP = 90;
const BODY_BOTTOM = 300;
const RIBBON_TOP = 300;
const RIBBON_BOTTOM = 400;
const SHIELD_HALF = 150; // shield face is 30 mm wide
const OVERLAP_MM = 10;

/** Minimum foil cap heights in mm; band() refuses to render below them. */
export const LETTERING = { nameMinCapMm: 2.0, wordmarkMinCapMm: 1.5 };
const CAP = 0.625; // Cormorant Garamond cap height per em

export function bandLengthMm(ringGauge) {
  const diameterMm = (ringGauge / 64) * 25.4;
  return Math.round((Math.PI * diameterMm + OVERLAP_MM) * 10) / 10;
}

/** Ink colour for elements printed on the accent field. */
export const inkOn = (collection) => (collection.accent.on === IVORY ? GOLD : OBSIDIAN);

/** Shield outline: straight sides and an ogee-arched top rising to a point. */
function shieldPath(cx, half, top, bottom, inset = 0) {
  const x0 = cx - half + inset;
  const x1 = cx + half - inset;
  const t = top + inset * 1.4;
  const shoulder = t + 70;
  return (
    `M${r(x0)} ${r(bottom - inset)}V${r(shoulder)}` +
    `C${r(x0)} ${r(t + 26)} ${r(cx - half * 0.42)} ${r(t + 24)} ${r(cx - half * 0.16)} ${r(t + 12)}` +
    `Q${r(cx - 4)} ${r(t + 4)} ${r(cx)} ${r(t)}Q${r(cx + 4)} ${r(t + 4)} ${r(cx + half * 0.16)} ${r(t + 12)}` +
    `C${r(cx + half * 0.42)} ${r(t + 24)} ${r(x1)} ${r(t + 26)} ${r(x1)} ${r(shoulder)}` +
    `V${r(bottom - inset)}Z`
  );
}

function wingPattern(slug, x0, x1, y) {
  // Shared lozenge chain; the Saadian band swaps in small eight-point stars.
  let d = '';
  for (let x = x0 + 12; x < x1 - 10; x += 22) {
    if (slug === 'saadian') d += poly([[x - 5, y - 5], [x + 5, y - 5], [x + 5, y + 5], [x - 5, y + 5]]) + lozenge(x, y, 14, 14);
    else d += lozenge(x, y, 12, 9);
  }
  return d;
}

/** Text fitted to a width, never above maxSize; null when it would fall below minSize. */
function fitText(text, { face, maxSize, minSize, width, x, y, tracking }) {
  const size = Math.min(maxSize, (maxSize * width) / measure(text, { face, size: maxSize, tracking }));
  if (size < minSize) return null;
  return { d: textPath(text, { face, size, x, y, tracking }), size };
}

/**
 * Returns { svg, widthMm, heightMm, lettering } for a collection's band.
 * options.print adds bleed, a dieline and layer names for production.
 */
export function band(collection, ringGauge, { print = false } = {}) {
  const lengthMm = bandLengthMm(ringGauge);
  const L = Math.round(lengthMm * 10);
  const H = BAND_HEIGHT;
  const cx = L / 2;
  const accent = collection.accent.hex;
  const ink = inkOn(collection);
  const sx0 = cx - SHIELD_HALF;
  const sx1 = cx + SHIELD_HALF;

  // Paper / process-colour layer.
  const paper = [
    `<rect x="0" y="${BODY_TOP}" width="${L}" height="${RIBBON_BOTTOM - BODY_TOP}" fill="${OBSIDIAN}"/>`,
    `<rect x="0" y="${BODY_TOP + 66}" width="${L}" height="${BODY_BOTTOM - BODY_TOP - 132}" fill="${accent}"/>`,
    `<path d="${shieldPath(cx, SHIELD_HALF, 0, RIBBON_TOP)}" fill="${OBSIDIAN}"/>`,
    `<path d="${shieldPath(cx, SHIELD_HALF, 0, RIBBON_TOP - 10, 22)}" fill="${accent}"/>`,
  ].join('');

  // Gold foil: frames, rules, patterns, crown and lettering.
  const shieldFrame = shieldPath(cx, SHIELD_HALF, 0, RIBBON_TOP) + shieldPath(cx, SHIELD_HALF, 0, RIBBON_TOP, 7);
  const innerFrame = shieldPath(cx, SHIELD_HALF, 0, RIBBON_TOP - 10, 15) + shieldPath(cx, SHIELD_HALF, 0, RIBBON_TOP - 10, 19);
  const wing = (y, h) => rect(0, y, sx0 - 2, h) + rect(sx1 + 2, y, L - sx1 - 2, h);
  const rules =
    wing(BODY_TOP + 8, 5) + wing(BODY_TOP + 62, 3) + wing(BODY_BOTTOM - 65, 3) +
    rect(0, RIBBON_TOP, L, 6) + rect(0, RIBBON_TOP + 12, L, 2) + rect(0, RIBBON_BOTTOM - 14, L, 2) + rect(0, RIBBON_BOTTOM - 6, L, 6);
  const pattern =
    wingPattern(collection.slug, 0, sx0, BODY_TOP + 37) + wingPattern(collection.slug, sx1, L, BODY_TOP + 37) +
    wingPattern(collection.slug, 0, sx0, BODY_BOTTOM - 32) + wingPattern(collection.slug, sx1, L, BODY_BOTTOM - 32);

  // Collection name on the ribbon, front centre, never below the minimum cap height.
  const ribbonY = (RIBBON_TOP + RIBBON_BOTTOM) / 2;
  const label = collection.name.toUpperCase();
  // Long names may run past the shield and round the sides of the cigar (up to 60% of the band).
  const nameOpts = { face: 'displayBold', maxSize: 56, minSize: (LETTERING.nameMinCapMm * 10) / CAP, x: cx, y: ribbonY + 17, tracking: 0.12 };
  const name = fitText(label, { ...nameOpts, width: SHIELD_HALF * 2 - 40 }) ?? fitText(label, { ...nameOpts, width: L * 0.6 });
  if (!name) throw new Error(`${collection.name}: name cannot reach ${LETTERING.nameMinCapMm} mm cap height on the band`);
  const nameW = measure(label, { face: 'displayBold', size: name.size, tracking: 0.12 });
  const flank = lozenge(cx - nameW / 2 - 22, ribbonY, 10, 12) + lozenge(cx + nameW / 2 + 22, ribbonY, 10, 12);

  // Wordmark stacked on two lines under the crown, clear of the inner frame.
  const wmMin = (LETTERING.wordmarkMinCapMm * 10) / CAP;
  const line1 = fitText('HERITAGE', { face: 'displayBold', maxSize: 30, minSize: wmMin, width: 190, x: cx, y: 101, tracking: 0.14 });
  const line2 = fitText('CIGARS', { face: 'displayBold', maxSize: 24, minSize: wmMin, width: 150, x: cx, y: 128, tracking: 0.4 });
  if (!line1 || !line2) throw new Error('Wordmark cannot reach its minimum cap height on the band');
  const wordmarks = line1.d + line2.d + rect(cx - 40, 108, 80, 1.5);
  const wordmarkSize = Math.min(line1.size, line2.size);

  // Crown in the shield's peak; numeral on each wing's accent stripe.
  const crown = crownMarkup(`translate(${r(cx - 30)} 36) scale(.3)`);
  const numeral = `N° ${collection.numeral}`;
  const stripeY = (BODY_TOP + BODY_BOTTOM) / 2;
  let numerals = '';
  for (const [a, b] of [[OVERLAP_MM * 10 + 10, sx0 - 16], [sx1 + 16, L - 10]]) {
    const t = fitText(numeral, { face: 'displayBold', maxSize: 44, minSize: 26, width: b - a, x: (a + b) / 2, y: stripeY + 13, tracking: 0.08 });
    if (t) numerals += t.d;
  }

  const s = 0.64;
  const emblemMarkup = `<g transform="translate(${r(cx - 100 * s)} ${r(204 - 100 * s)}) scale(${s})">${emblem(collection.slug, { color: ink, ground: accent })}</g>`;

  const foilGroup =
    `<g id="foil-gold" fill="${GOLD}"><path fill-rule="evenodd" d="${shieldFrame}${innerFrame}"/>` +
    `<path d="${rules}${pattern}${name.d}${flank}"/></g>`;
  // Everything printed on the accent field uses the collection ink, so it stays legible on light accents.
  const inkGroup = `<g id="ink-collection" fill="${ink}"><path d="${numerals}${wordmarks}"/>${crown}${emblemMarkup}</g>`;
  const lettering = { nameCapMm: Math.round(name.size * CAP) / 10, wordmarkCapMm: Math.round(wordmarkSize * CAP) / 10 };

  if (!print) {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L} ${H}" width="${lengthMm}mm" height="${H / 10}mm" role="img" aria-labelledby="t"><title id="t">${collection.name} cigar band, Heritage Cigars</title><g id="paper">${paper}</g>${foilGroup}${inkGroup}</svg>`,
      widthMm: lengthMm,
      heightMm: H / 10,
      lettering,
    };
  }

  // Print file: 3 mm bleed, dieline and glue area in separate layers.
  const B = 30;
  const shieldTop = shieldPath(cx, SHIELD_HALF, 0, BODY_TOP).replace(/^M[\d. ]+V/, 'V').replace(/Z$/, '');
  const dieline = `M0 ${BODY_TOP}H${sx0}${shieldTop}H${L}V${RIBBON_BOTTOM}H0Z`;
  const bleed =
    `<rect x="${-B}" y="${BODY_TOP - B}" width="${L + 2 * B}" height="${RIBBON_BOTTOM - BODY_TOP + 2 * B}" fill="${OBSIDIAN}"/>` +
    `<path d="${shieldPath(cx, SHIELD_HALF + B, -B, RIBBON_TOP)}" fill="${OBSIDIAN}"/>`;
  const glue = `<rect x="0" y="${BODY_TOP}" width="${OVERLAP_MM * 10}" height="${RIBBON_BOTTOM - BODY_TOP}" fill="none" stroke="#00A0E3" stroke-width="2" stroke-dasharray="8 6"/>`;
  const note = `${label} BAND · RG ${ringGauge} · FLAT ${lengthMm} x ${H / 10} MM · OVERLAP ${OVERLAP_MM} MM · NAME CAP ${lettering.nameCapMm} MM · CONCEPT ARTWORK, NOT PRINT-APPROVED`;
  const notes = `<g id="notes" fill="#555"><path d="${textPath(note, { face: 'sans', size: 14, x: -B, y: H + 70, anchor: 'start' })}"/></g>`;
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-B - 20} ${-B - 20} ${L + 2 * B + 40} ${H + 2 * B + 100}" width="${(L + 2 * B + 40) / 10}mm" height="${(H + 2 * B + 100) / 10}mm"><title>${collection.name} band, print layout (concept)</title><g id="paper">${bleed}${paper}</g>${foilGroup}${inkGroup}<g id="dieline" fill="none" stroke="#EC008C" stroke-width="2"><path d="${dieline}"/></g><g id="glue-area">${glue}</g>${notes}</svg>`,
    widthMm: lengthMm,
    heightMm: H / 10,
    lettering,
  };
}

/** Band inner markup only (no <svg>), for wrapping onto product renders. */
export function bandInner(collection, ringGauge) {
  const { svg } = band(collection, ringGauge);
  const L = Math.round(bandLengthMm(ringGauge) * 10);
  return { inner: svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace(/<title[^>]*>.*?<\/title>/, ''), L, H: BAND_HEIGHT };
}
