// The Empire Cigars master marks: crown, EC monogram, laurel crest and wordmark.
// Every function returns path data in its own coordinate box so the logo
// variants can be composed without re-drawing anything.
import { poly, circle, lozenge, laurelWreath, r } from './geometry.mjs';
import { textPath, measure } from './font.mjs';

/**
 * Five-point crown, refined from the supplied kit's crown outline into a solid
 * form that survives foil stamping and 16px favicons. Box: 0 0 200 120.
 */
export function crown() {
  const body = poly([
    [28, 90], [10, 40], [42, 64], [56, 26], [80, 58], [100, 14],
    [120, 58], [144, 26], [158, 64], [190, 40], [172, 90],
  ]);
  const orbs = circle(10, 33, 6.5) + circle(56, 19, 6.5) + circle(100, 6, 7.5) + circle(144, 19, 6.5) + circle(190, 33, 6.5);
  // Jewel cut-outs in the body (even-odd) and a separate band below.
  const jewels = lozenge(100, 64, 12, 18) + circle(64, 74, 4) + circle(136, 74, 4);
  const band = poly([[24, 97], [176, 97], [172, 113], [28, 113]]);
  const bandJewels = lozenge(100, 105, 14, 9) + circle(60, 105, 3) + circle(140, 105, 3);
  return { body: body + jewels, orbs, band: band + bandJewels, width: 200, height: 120 };
}

/** Crown as SVG markup; jewels are even-odd cut-outs, orbs are drawn separately so they never punch holes. */
export function crownMarkup(transform = '') {
  const c = crown();
  const t = transform ? ` transform="${transform}"` : '';
  return `<g${t}><path fill-rule="evenodd" d="${c.body}"/><path d="${c.orbs}"/><path fill-rule="evenodd" d="${c.band}"/></g>`;
}

/**
 * EC monogram: a bold E set tight against a lighter C, so the pair reads left
 * to right as one unit without the letters fusing. Box: 0 0 200 200, caps centred.
 */
export function monogram() {
  const e = textPath('E', { face: 'displayBold', size: 146, x: 58, y: 146, anchor: 'middle' });
  const c = textPath('C', { face: 'display', size: 152, x: 143, y: 147, anchor: 'middle' });
  return { d: c + e, width: 200, height: 200 };
}

/** Wordmark "EMPIRE CIGARS", outlined. Returns path and its width at the given cap size. */
export function wordmark({ size = 80, tracking = 0.16, x = 0, y = 0, anchor = 'start', face = 'display' } = {}) {
  const text = 'EMPIRE CIGARS';
  return {
    d: textPath(text, { face, size, tracking, x, y, anchor }),
    width: measure(text, { face, size, tracking }),
  };
}

export function tagline({ size = 22, x = 0, y = 0, anchor = 'middle', tracking = 0.22 } = {}) {
  const text = 'A COLLECTION OF EMPIRES. A LEGACY IN EVERY PUFF.';
  return { d: textPath(text, { face: 'displayMedium', size, tracking, x, y, anchor }), width: measure(text, { face: 'displayMedium', size, tracking }) };
}

/**
 * Crest: crown above a laurel wreath enclosing the monogram. Box 0 0 300 330.
 * Returns separate layers so full-colour versions can tint the laurel.
 */
export function crest() {
  const cx = 150;
  const cy = 196;
  const wreath = laurelWreath({ cx, cy, radius: 112, gap: 0.62, leaves: 10, len: 30, width: 8.5, stem: 3.4 });
  const m = monogram();
  const s = 0.78;
  const mono = `<path transform="translate(${r(cx - 100 * s)} ${r(cy - 108 * s)}) scale(${s})" d="${m.d}"/>`;
  const cs = 0.62;
  const crownEl = crownMarkup(`translate(${r(cx - 100 * cs)} 6) scale(${cs})`);
  return { wreath, mono, crown: crownEl, width: 300, height: 330 };
}

/** Compact crest for small sizes: crown over the monogram, no wreath. Box 0 0 200 250. */
export function compactMark() {
  const m = monogram();
  return {
    body: `${crownMarkup('translate(30 6) scale(.7)')}<path transform="translate(0 70)" d="${m.d}"/>`,
    width: 200,
    height: 270,
  };
}
