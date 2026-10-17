// Outlines text to SVG path data so logo and band artwork never depends on
// installed fonts. Fonts: Cormorant Garamond and Inter (SIL Open Font
// License), read from the @fontsource packages already used by the website.
import opentype from 'opentype.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const cache = new Map();

const FILES = {
  display: '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff',
  displayBold: '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff',
  displayMedium: '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff',
  displayItalic: '@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff',
  sans: '@fontsource/inter/files/inter-latin-500-normal.woff',
  sansSemi: '@fontsource/inter/files/inter-latin-600-normal.woff',
};

export function font(name = 'display') {
  if (!cache.has(name)) cache.set(name, opentype.loadSync(require.resolve(FILES[name])));
  return cache.get(name);
}

const r = (n) => Math.round(n * 100) / 100;

function commandsToD(commands, map = (x, y) => [x, y]) {
  let d = '';
  for (const c of commands) {
    if (c.type === 'M' || c.type === 'L') {
      const [x, y] = map(c.x, c.y);
      d += `${c.type}${r(x)} ${r(y)}`;
    } else if (c.type === 'Q') {
      const [x1, y1] = map(c.x1, c.y1);
      const [x, y] = map(c.x, c.y);
      d += `Q${r(x1)} ${r(y1)} ${r(x)} ${r(y)}`;
    } else if (c.type === 'C') {
      const [x1, y1] = map(c.x1, c.y1);
      const [x2, y2] = map(c.x2, c.y2);
      const [x, y] = map(c.x, c.y);
      d += `C${r(x1)} ${r(y1)} ${r(x2)} ${r(y2)} ${r(x)} ${r(y)}`;
    } else if (c.type === 'Z') d += 'Z';
  }
  return d;
}

/** Per-glyph layout with kerning and tracking (tracking in em). */
function layout(text, f, size, tracking) {
  const glyphs = f.stringToGlyphs(text);
  const scale = size / f.unitsPerEm;
  const items = [];
  let x = 0;
  glyphs.forEach((g, i) => {
    items.push({ glyph: g, x });
    x += g.advanceWidth * scale;
    if (i < glyphs.length - 1) {
      x += f.getKerningValue(g, glyphs[i + 1]) * scale + tracking * size;
    }
  });
  return { items, width: x };
}

export function measure(text, { face = 'display', size, tracking = 0 }) {
  return layout(text, font(face), size, tracking).width;
}

/**
 * Text as a single path. anchor: 'start' | 'middle' | 'end'. y is the baseline.
 */
export function textPath(text, { face = 'display', size, x = 0, y = 0, tracking = 0, anchor = 'middle' }) {
  const f = font(face);
  const { items, width } = layout(text, f, size, tracking);
  const ox = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  return items
    .map(({ glyph, x: gx }) => commandsToD(glyph.getPath(ox + gx, y, size).commands))
    .join('');
}

/**
 * Text set on a circular arc centred on (cx, cy). Positive radius runs over the
 * top reading left to right; `bottom: true` runs under the centre, still upright.
 */
export function arcTextPath(text, { face = 'display', size, cx, cy, radius, tracking = 0, bottom = false }) {
  const f = font(face);
  const { items, width } = layout(text, f, size, tracking);
  const scale = size / f.unitsPerEm;
  const total = width / radius; // radians
  return items
    .map(({ glyph, x: gx }) => {
      const half = (glyph.advanceWidth * scale) / 2;
      const along = (gx + half) / radius - total / 2;
      const theta = bottom ? Math.PI / 2 - along : -Math.PI / 2 + along;
      const px = cx + radius * Math.cos(theta);
      const py = cy + radius * Math.sin(theta);
      const rot = bottom ? theta - Math.PI / 2 : theta + Math.PI / 2;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      // Glyph drawn around its baseline centre, then rotated onto the arc; the
      // radius is the baseline in both directions.
      const cmds = glyph.getPath(-half, 0, size).commands;
      return commandsToD(cmds, (x, y) => [px + x * cos - y * sin, py + x * sin + y * cos]);
    })
    .join('');
}
