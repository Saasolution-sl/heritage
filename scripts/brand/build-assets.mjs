// Generates the Empire Cigars vector asset library into public/brand from the
// marks in ./lib and the collection data in src/data/collections.json.
// Run: npm run brand   (then npm run brand:png for raster exports)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crest, compactMark, monogram, wordmark, tagline, crownMarkup } from './lib/marks.mjs';
import { emblem } from './lib/emblems.mjs';
import { band, inkOn, GOLD, ANTIQUE, OBSIDIAN, IVORY } from './lib/band.mjs';
import { cigarSvg } from './lib/cigar.mjs';
import { textPath, measure } from './lib/font.mjs';
import { lozenge, poly, rot, leaf, circle, ring, rect, r } from './lib/geometry.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = path.join(ROOT, 'public/brand');
const { collections } = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/collections.json'), 'utf8'));
const TOBACCO = '#5B321E';
const WHITE = '#FFFFFF';

const written = [];
function write(rel, svg) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg.trim() + '\n');
  written.push(rel);
}
const svgDoc = (w, h, body, title, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra} role="img" aria-label="${title}"><title>${title}</title>${body}</svg>`;

/* ------------------------------------------------------------------ logos */

// Each layout returns body markup given a palette { mark, word, rule, tag }.
const layouts = {
  primary: {
    size: [900, 680],
    title: 'Empire Cigars primary logo',
    body: (p) => {
      const c = crest();
      const w = wordmark({ size: 72, tracking: 0.16, x: 450, y: 548, anchor: 'middle' });
      const t = tagline({ size: 21, x: 450, y: 648 });
      return `<g transform="translate(247.5 0) scale(1.35)"><path fill="${p.mark}" d="${c.wreath}"/><g fill="${p.mark}">${c.mono}${c.crown}</g></g>` +
        `<path fill="${p.word}" d="${w.d}"/><path fill="${p.rule}" d="${rect(450 - 220, 584, 440, 2.5)}${lozenge(450, 585, 12, 12)}"/><path fill="${p.tag}" d="${t.d}"/>`;
    },
  },
  wordmark: {
    size: [1000, 150],
    title: 'Empire Cigars wordmark',
    body: (p) => {
      const w = wordmark({ size: 92, tracking: 0.16, x: 500, y: 108, anchor: 'middle' });
      return `<path fill="${p.word}" d="${w.d}"/>`;
    },
  },
  'wordmark-tagline': {
    size: [1000, 230],
    title: 'Empire Cigars wordmark with tagline',
    body: (p) => {
      const w = wordmark({ size: 92, tracking: 0.16, x: 500, y: 100, anchor: 'middle' });
      const t = tagline({ size: 24, x: 500, y: 200 });
      return `<path fill="${p.word}" d="${w.d}"/><path fill="${p.rule}" d="${rect(260, 141, 480, 2.5)}${lozenge(500, 142, 12, 12)}"/><path fill="${p.tag}" d="${t.d}"/>`;
    },
  },
  monogram: {
    size: [200, 200],
    title: 'Empire Cigars EC monogram',
    body: (p) => `<path fill="${p.mark}" d="${monogram().d}"/>`,
  },
  crest: {
    size: [200, 270],
    title: 'Empire Cigars compact crest',
    body: (p) => `<g fill="${p.mark}">${compactMark().body}</g>`,
  },
  laurel: {
    size: [300, 330],
    title: 'Empire Cigars laurel crest',
    body: (p) => {
      const c = crest();
      return `<path fill="${p.mark}" d="${c.wreath}"/><g fill="${p.mark}">${c.mono}${c.crown}</g>`;
    },
  },
  horizontal: {
    size: [1120, 220],
    title: 'Empire Cigars horizontal logo',
    body: (p) => {
      const w = wordmark({ size: 76, tracking: 0.16, x: 230, y: 138, anchor: 'start' });
      return `<g fill="${p.mark}" transform="translate(20 10) scale(.74)">${compactMark().body}</g><path fill="${p.rule}" d="${rect(196, 40, 2.5, 140)}"/><path fill="${p.word}" d="${w.d}"/>`;
    },
  },
  stacked: {
    size: [700, 640],
    title: 'Empire Cigars stacked logo',
    body: (p) => {
      const empire = textPath('EMPIRE', { face: 'display', size: 150, x: 350, y: 380, tracking: 0.12 });
      const cigars = textPath('CIGARS', { face: 'display', size: 64, x: 350, y: 486, tracking: 0.5 });
      const t = tagline({ size: 18, x: 350, y: 590 });
      return `<g fill="${p.mark}">${crownMarkup('translate(225 70) scale(1.25)')}</g><path fill="${p.word}" d="${empire}${cigars}"/>` +
        `<path fill="${p.rule}" d="${rect(150, 418, 400, 2.5)}${lozenge(350, 419, 12, 12)}${rect(150, 528, 400, 1.5)}"/><path fill="${p.tag}" d="${t.d}"/>`;
    },
  },
};

const palettes = {
  // Full colour for dark grounds: gold mark, antique-gold rules, ivory tagline.
  'full-color': { mark: GOLD, word: GOLD, rule: ANTIQUE, tag: IVORY },
  gold: { mark: GOLD, word: GOLD, rule: GOLD, tag: GOLD },
  white: { mark: WHITE, word: WHITE, rule: WHITE, tag: WHITE },
  black: { mark: OBSIDIAN, word: OBSIDIAN, rule: OBSIDIAN, tag: OBSIDIAN },
  ivory: { mark: IVORY, word: IVORY, rule: IVORY, tag: IVORY },
  // For light grounds: tobacco-brown text with antique gold mark.
  'on-light': { mark: ANTIQUE, word: OBSIDIAN, rule: ANTIQUE, tag: TOBACCO },
};

for (const [name, layout] of Object.entries(layouts)) {
  const [w, h] = layout.size;
  for (const [pal, colors] of Object.entries(palettes)) {
    write(`logos/empire-cigars-${name}-${pal}.svg`, svgDoc(w, h, layout.body(colors), `${layout.title} (${pal})`));
  }
  // A version with its own obsidian ground for previews and documents.
  write(
    `logos/empire-cigars-${name}-on-obsidian.svg`,
    svgDoc(w + 80, h + 80, `<rect width="${w + 80}" height="${h + 80}" fill="${OBSIDIAN}"/><g transform="translate(40 40)">${layout.body(palettes['full-color'])}</g>`, `${layout.title} on obsidian`),
  );
}

/* --------------------------------------------------------------- favicons */

const iconBg = (s, rad) => `<rect width="${s}" height="${s}" rx="${rad}" fill="${OBSIDIAN}"/>`;
// Small sizes: monogram only, heavier ring. Large sizes: crown and monogram.
write('favicons/favicon.svg', svgDoc(64, 64, `${iconBg(64, 12)}<path fill="${GOLD}" transform="translate(4 3) scale(.28)" d="${monogram().d}"/>`, 'Empire Cigars'));
write('favicons/app-icon.svg', svgDoc(512, 512, `${iconBg(512, 96)}<path fill-rule="evenodd" fill="${ANTIQUE}" d="${ring(256, 256, 226, 220)}"/><g fill="${GOLD}" transform="translate(141 96) scale(1.15)">${compactMark().body}</g>`, 'Empire Cigars app icon'));
write('favicons/maskable-icon.svg', svgDoc(512, 512, `<rect width="512" height="512" fill="${OBSIDIAN}"/><g fill="${GOLD}" transform="translate(171 130) scale(.85)">${compactMark().body}</g>`, 'Empire Cigars maskable icon'));

/* --------------------------------------------------------------- emblems */

for (const c of collections) {
  write(`emblems/${c.slug}.svg`, svgDoc(200, 200, emblem(c.slug, { color: GOLD, ground: OBSIDIAN }), `${c.name} emblem`));
  write(
    `emblems/${c.slug}-on-accent.svg`,
    svgDoc(200, 200, `<circle cx="100" cy="100" r="100" fill="${c.accent.hex}"/>${emblem(c.slug, { color: inkOn(c), ground: c.accent.hex }).replace('<g ', '<g transform="translate(15 15) scale(.85)" ')}`, `${c.name} emblem on ${c.accent.name}`),
  );
}

/* ------------------------------------------------------------ cigar bands */

for (const c of collections) {
  const rg = c.products[0].vitola.ringGauge;
  write(`cigar-bands/${c.slug}-band.svg`, band(c, rg).svg);
  write(`cigar-bands/print/${c.slug}-band-print.svg`, band(c, rg, { print: true }).svg);
}

/* -------------------------------------------------------- product renders */

for (const c of collections) {
  for (const p of c.products) {
    write(`product/${p.slug}.svg`, cigarSvg(c, p));
    write(`product/${p.slug}-band-detail.svg`, cigarSvg(c, p, { crop: true }));
  }
}

/* --------------------------------------------------------------- patterns */

{
  // Imperial lozenge lattice.
  const t = `<rect width="80" height="80" fill="${OBSIDIAN}"/><path fill="none" stroke="${ANTIQUE}" stroke-width="1" d="M0 40L40 0L80 40L40 80Z"/><path fill="${GOLD}" d="${lozenge(40, 40, 8, 8)}${lozenge(0, 0, 6, 6)}${lozenge(80, 0, 6, 6)}${lozenge(0, 80, 6, 6)}${lozenge(80, 80, 6, 6)}"/>`;
  write('patterns/imperial-lattice-tile.svg', svgDoc(80, 80, t, 'Imperial lattice pattern tile'));

  // Saadian zellige: eight-point stars on a 120 grid with interlacing bands.
  const sq = (cx, cy, s, a) => poly([[-s, -s], [s, -s], [s, s], [-s, s]].map((p) => rot(p, a)).map(([x, y]) => [x + cx, y + cy]));
  let stars = '';
  let cuts = '';
  for (const [x, y] of [[0, 0], [120, 0], [0, 120], [120, 120], [60, 60]]) {
    stars += sq(x, y, 30, 0) + sq(x, y, 30, Math.PI / 4);
    cuts += sq(x, y, 22, 0) + sq(x, y, 22, Math.PI / 4);
  }
  const z = `<rect width="120" height="120" fill="#0A6048"/><path fill="${GOLD}" d="${stars}"/><path fill="#0A6048" d="${cuts}"/><path fill="${GOLD}" d="${[[0, 0], [120, 0], [0, 120], [120, 120], [60, 60]].map(([x, y]) => circle(x, y, 6)).join('')}"/>`;
  write('patterns/saadian-zellige-tile.svg', svgDoc(120, 120, z, 'Saadian zellige pattern tile'));

  // Laurel border strip, repeatable horizontally.
  let laurel = '';
  for (let x = 0; x < 240; x += 40) laurel += leaf([x + 4, 20], -0.5, 22, 6) + leaf([x + 4, 20], 0.5, 22, 6);
  write('patterns/laurel-border.svg', svgDoc(240, 40, `<path fill="${GOLD}" d="${laurel}${rect(0, 19, 240, 2)}"/>`, 'Laurel border strip'));

  // Tobacco-leaf texture for warm surfaces.
  const tex = `<filter id="leaf"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.09" numOctaves="4" seed="11"/><feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.2  0 0 0 0 0.12  0 0 0 1.1 -0.2"/></filter><rect width="800" height="800" fill="#2a160c"/><rect width="800" height="800" filter="url(#leaf)" opacity=".9"/>`;
  write('patterns/tobacco-leaf-texture.svg', svgDoc(800, 800, tex, 'Tobacco leaf texture'));
}

/* -------------------------------------------------------------- packaging */

function boxLid(c) {
  const W = 1200;
  const H = 800;
  const p = c.products[0];
  const ink = inkOn(c);
  const name = textPath(c.name.toUpperCase(), { face: 'display', size: 74, x: W / 2, y: 610, tracking: 0.2 });
  const empire = textPath(c.empire.toUpperCase(), { face: 'displayMedium', size: 22, x: W / 2, y: 660, tracking: 0.3 });
  const brand = wordmark({ size: 30, tracking: 0.3, x: W / 2, y: 112, anchor: 'middle' });
  const vit = textPath(`${p.vitola.name.toUpperCase()} · ${p.vitola.lengthMm} MM × ${p.vitola.ringGauge}`, { face: 'displayMedium', size: 20, x: W / 2, y: 712, tracking: 0.3 });
  const num = textPath(`N° ${c.numeral}`, { face: 'displayBold', size: 34, x: W / 2, y: 520, tracking: 0.1 });
  return svgDoc(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="${OBSIDIAN}"/>` +
      `<path fill-rule="evenodd" fill="${GOLD}" d="${rect(30, 30, W - 60, H - 60)}${rect(36, 36, W - 72, H - 72)}"/>` +
      `<path fill-rule="evenodd" fill="${ANTIQUE}" d="${rect(52, 52, W - 104, H - 104)}${rect(54, 54, W - 108, H - 108)}"/>` +
      `<rect x="54" y="190" width="${W - 108}" height="240" fill="${c.accent.hex}"/>` +
      `<path fill="${GOLD}" d="${rect(54, 186, W - 108, 4)}${rect(54, 430, W - 108, 4)}"/>` +
      `<circle cx="${W / 2}" cy="310" r="150" fill="${OBSIDIAN}"/><path fill-rule="evenodd" fill="${GOLD}" d="${ring(W / 2, 310, 150, 144)}${ring(W / 2, 310, 128, 125)}"/>` +
      `<circle cx="${W / 2}" cy="310" r="122" fill="${c.accent.hex}"/>` +
      `<g transform="translate(${W / 2 - 95} 215) scale(.95)">${emblem(c.slug, { color: ink, ground: c.accent.hex })}</g>` +
      `<path fill="${GOLD}" d="${brand.d}${num}${name}"/><path fill="${IVORY}" d="${empire}${vit}"/>` +
      `<path fill="${ANTIQUE}" d="${rect(W / 2 - 160, 140, 320, 1.5)}${lozenge(W / 2, 141, 10, 10)}"/>`,
    `${c.name} presentation box lid (concept)`,
  );
}
for (const c of collections) write(`packaging/${c.slug}-box-lid.svg`, boxLid(c));

{
  // Master presentation box: the twelve emblems around the crest.
  const W = 1600;
  const H = 1000;
  let cells = '';
  collections.forEach((c, i) => {
    const a = (i / collections.length) * Math.PI * 2 - Math.PI / 2;
    const x = W / 2 + Math.cos(a) * 380;
    const y = 500 + Math.sin(a) * 340;
    cells += `<circle cx="${r(x)}" cy="${r(y)}" r="62" fill="${c.accent.hex}"/><path fill="none" stroke="${GOLD}" stroke-width="3" d="${circle(x, y, 66)}"/><g transform="translate(${r(x - 50)} ${r(y - 50)}) scale(.5)">${emblem(c.slug, { color: inkOn(c), ground: c.accent.hex })}</g>`;
  });
  const c = crest();
  const t = tagline({ size: 22, x: W / 2, y: 940 });
  const w = wordmark({ size: 46, tracking: 0.2, x: W / 2, y: 690, anchor: 'middle' });
  write(
    'packaging/collection-presentation-box.svg',
    svgDoc(
      W,
      H,
      `<rect width="${W}" height="${H}" fill="${OBSIDIAN}"/><path fill-rule="evenodd" fill="${GOLD}" d="${rect(30, 30, W - 60, H - 60)}${rect(37, 37, W - 74, H - 74)}"/>${cells}` +
        `<g transform="translate(${W / 2 - 120} 280) scale(.8)"><path fill="${GOLD}" d="${c.wreath}"/><g fill="${GOLD}">${c.mono}${c.crown}</g></g><path fill="${GOLD}" d="${w.d}"/><path fill="${IVORY}" d="${t.d}"/>`,
      'The Collection of Empires presentation box (concept)',
    ),
  );
}

/* ----------------------------------------------------------------- social */

const adultLine = (x, y, size = 18, color = IVORY) =>
  `<path fill="${color}" opacity=".75" d="${textPath('FOR ADULTS OF LEGAL SMOKING AGE ONLY', { face: 'sans', size, x, y, tracking: 0.18 })}"/>`;

write('social/avatar.svg', svgDoc(1080, 1080, `<rect width="1080" height="1080" fill="${OBSIDIAN}"/><path fill-rule="evenodd" fill="${ANTIQUE}" d="${ring(540, 540, 470, 464)}"/><g fill="${GOLD}" transform="translate(340 240) scale(2)">${compactMark().body}</g>`, 'Empire Cigars social avatar'));

{
  const c = crest();
  const w = wordmark({ size: 84, tracking: 0.18, x: 600, y: 470, anchor: 'middle' });
  const t = tagline({ size: 22, x: 600, y: 540 });
  write('social/og-default.svg', svgDoc(1200, 630, `<rect width="1200" height="630" fill="${OBSIDIAN}"/><path fill-rule="evenodd" fill="${GOLD}" d="${rect(24, 24, 1152, 582)}${rect(28, 28, 1144, 574)}"/><g transform="translate(510 70) scale(.6)"><path fill="${GOLD}" d="${c.wreath}"/><g fill="${GOLD}">${c.mono}${c.crown}</g></g><path fill="${GOLD}" d="${w.d}"/><path fill="${IVORY}" d="${t.d}"/>`, 'Empire Cigars'));

  const wb = wordmark({ size: 64, tracking: 0.2, x: 750, y: 270, anchor: 'middle' });
  let strip = '';
  collections.forEach((col, i) => {
    strip += `<rect x="${i * 125}" y="488" width="125" height="12" fill="${col.accent.hex}"/>`;
  });
  write('social/banner-1500x500.svg', svgDoc(1500, 500, `<rect width="1500" height="500" fill="${OBSIDIAN}"/><path fill="${GOLD}" d="${wb.d}"/><path fill="${ANTIQUE}" d="${rect(450, 310, 600, 2)}${lozenge(750, 311, 12, 12)}"/><path fill="${IVORY}" d="${tagline({ size: 22, x: 750, y: 370 }).d}"/>${strip}`, 'Empire Cigars social banner'));
}

function collectionPost(c, W, H, story = false) {
  const p = c.products[0];
  const cig = cigarSvg(c, p).replace(/ width="\d+" height="\d+"/, '').replace('<svg ', `<svg x="${W * 0.08}" y="${H * 0.08}" width="${W * 0.38}" height="${H * 0.8}" `);
  const tx = W * 0.56;
  const label = c.name.toUpperCase();
  const room = W - tx - 60;
  const size = Math.min(story ? 110 : 90, (90 * room) / measure(label, { face: 'display', size: 90, tracking: 0.12 }));
  const name = textPath(label, { face: 'display', size, x: tx, y: H * 0.46, anchor: 'start', tracking: 0.12 });
  const empLabel = c.empire.toUpperCase();
  const empSize = Math.min(26, (26 * room) / measure(empLabel, { face: 'displayMedium', size: 26, tracking: 0.24 }));
  const emp = textPath(empLabel, { face: 'displayMedium', size: empSize, x: tx, y: H * 0.46 + 56, anchor: 'start', tracking: 0.24 });
  const num = textPath(`N° ${c.numeral}`, { face: 'displayBold', size: 36, x: tx, y: H * 0.46 - (story ? 150 : 124), anchor: 'start', tracking: 0.1 });
  const concept = textPath('CONCEPT COLLECTION', { face: 'sans', size: 18, x: tx, y: H * 0.46 + 120, anchor: 'start', tracking: 0.3 });
  const brand = wordmark({ size: 30, tracking: 0.3, x: W / 2, y: H - 120, anchor: 'middle' });
  return svgDoc(
    W,
    H,
    `<rect width="${W}" height="${H}" fill="${OBSIDIAN}"/><rect x="0" y="0" width="${W}" height="14" fill="${c.accent.hex}"/>` +
      cig +
      `<g transform="translate(${tx} ${H * 0.46 - (story ? 380 : 330)}) scale(.75)">${emblem(c.slug, { color: GOLD, ground: OBSIDIAN })}</g>` +
      `<path fill="${GOLD}" d="${name}${num}${brand.d}"/><path fill="${IVORY}" d="${emp}"/><path fill="${c.accent.on === IVORY ? IVORY : GOLD}" opacity=".7" d="${concept}"/>` +
      `<path fill="${ANTIQUE}" d="${rect(W * 0.2, H - 170, W * 0.6, 1.5)}"/>` +
      adultLine(W / 2, H - 60),
    `${c.name} social ${story ? 'story' : 'post'} template`,
  );
}
for (const c of collections) {
  write(`social/posts/${c.slug}-post-1080x1350.svg`, collectionPost(c, 1080, 1350));
  write(`social/stories/${c.slug}-story-1080x1920.svg`, collectionPost(c, 1080, 1920, true));
}

/* ------------------------------------------------------------- stationery */

{
  // Business card, 85 x 55 mm at 10 units/mm. Placeholder fields are bracketed.
  const W = 850;
  const H = 550;
  const front = `<rect width="${W}" height="${H}" fill="${OBSIDIAN}"/><g fill="${GOLD}" transform="translate(${W / 2 - 74} 120) scale(.74)">${compactMark().body}</g><path fill="${GOLD}" d="${wordmark({ size: 34, tracking: 0.3, x: W / 2, y: 440, anchor: 'middle' }).d}"/>`;
  const field = (t, y, size = 24, face = 'sans', color = IVORY) => `<path fill="${color}" d="${textPath(t, { face, size, x: 80, y, anchor: 'start', tracking: 0.04 })}"/>`;
  const back =
    `<rect width="${W}" height="${H}" fill="${IVORY}"/><rect width="${W}" height="16" fill="${GOLD}"/>` +
    field('[Full name]', 170, 40, 'display', OBSIDIAN) +
    field('[Title]', 214, 22, 'sans', TOBACCO) +
    field('[Email address]', 380, 22, 'sans', OBSIDIAN) +
    field('[Telephone]', 418, 22, 'sans', OBSIDIAN) +
    field('[Website]', 456, 22, 'sans', OBSIDIAN) +
    `<g fill="${ANTIQUE}" transform="translate(640 330) scale(.6)"><path d="${monogram().d}"/></g>`;
  write('stationery/business-card-front.svg', svgDoc(W, H, front, 'Business card front (concept)', ` data-size-mm="85x55"`));
  write('stationery/business-card-back.svg', svgDoc(W, H, back, 'Business card back (concept)', ` data-size-mm="85x55"`));

  // Letterhead, A4 (210 x 297 mm) at 4 units/mm.
  const LW = 840;
  const LH = 1188;
  const lh =
    `<rect width="${LW}" height="${LH}" fill="#FFFDF8"/><g transform="translate(${LW / 2 - 40} 50) scale(.4)" fill="${ANTIQUE}">${compactMark().body}</g>` +
    `<path fill="${OBSIDIAN}" d="${wordmark({ size: 22, tracking: 0.3, x: LW / 2, y: 180, anchor: 'middle' }).d}"/>` +
    `<path fill="${ANTIQUE}" d="${rect(80, 210, LW - 160, 1)}${rect(80, LH - 90, LW - 160, 1)}"/>` +
    `<path fill="${TOBACCO}" d="${textPath('[Registered company name · address · registration number — to be supplied]', { face: 'sans', size: 11, x: LW / 2, y: LH - 60, tracking: 0.04 })}"/>`;
  write('stationery/letterhead-a4.svg', svgDoc(LW, LH, lh, 'Letterhead A4 (concept)'));
}

/* ------------------------------------------------------------------ index */

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ generatedBy: 'scripts/brand/build-assets.mjs', files: written.sort() }, null, 2) + '\n');
console.log(`Wrote ${written.length} SVG files to public/brand`);
