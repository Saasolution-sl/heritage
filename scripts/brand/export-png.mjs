// Rasterises the vector masters with headless Chromium (already a dev
// dependency for the browser tests): transparent PNG logo exports, favicon
// PNGs and .ico, and PNG versions of the social images that platforms need.
// Run after `npm run brand`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BRAND = path.join(ROOT, 'public/brand');

const jobs = [];
const add = (src, out, width) => jobs.push({ src, out, width });

for (const name of ['primary', 'horizontal', 'stacked', 'wordmark', 'wordmark-tagline', 'monogram', 'crest', 'laurel']) {
  for (const pal of ['full-color', 'gold', 'white', 'black', 'on-light']) {
    add(`logos/heritage-cigars-${name}-${pal}.svg`, `logos/png/heritage-cigars-${name}-${pal}-1200.png`, 1200);
  }
  add(`logos/heritage-cigars-${name}-on-obsidian.svg`, `logos/png/heritage-cigars-${name}-on-obsidian-1200.png`, 1200);
}
for (const s of [16, 32, 48]) add('favicons/favicon.svg', `favicons/favicon-${s}.png`, s);
for (const s of [180, 192, 512]) add('favicons/app-icon.svg', `favicons/app-icon-${s}.png`, s);
add('favicons/maskable-icon.svg', 'favicons/maskable-icon-512.png', 512);
add('social/og-default.svg', 'social/og-default.png', 1200);
add('social/avatar.svg', 'social/avatar-1080.png', 1080);
add('social/avatar.svg', 'social/avatar-400.png', 400);
add('social/banner-1500x500.svg', 'social/banner-1500x500.png', 1500);
const { collections } = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/collections.json'), 'utf8'));
for (const c of collections) add(`social/posts/${c.slug}-post-1080x1350.svg`, `social/posts/png/${c.slug}-post-1080x1350.png`, 1080);

const browser = await chromium.launch();
const page = await browser.newPage();
for (const { src, out, width } of jobs) {
  const svg = fs.readFileSync(path.join(BRAND, src), 'utf8');
  const [, vw, vh] = svg.match(/viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/);
  const height = Math.round((width * Number(vh)) / Number(vw));
  await page.setViewportSize({ width, height });
  const sized = svg.replace(/<svg([^>]*?) width="[^"]*" height="[^"]*"/, '<svg$1').replace('<svg', `<svg width="${width}" height="${height}"`);
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${sized}</body></html>`);
  const file = path.join(BRAND, out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, omitBackground: true, clip: { x: 0, y: 0, width, height } });
}
await browser.close();

// favicon.ico with embedded PNG images (supported by all current browsers).
const pngs = [16, 32, 48].map((s) => ({ s, data: fs.readFileSync(path.join(BRAND, `favicons/favicon-${s}.png`)) }));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach(({ s, data }, i) => {
  const o = 6 + i * 16;
  header.writeUInt8(s, o);
  header.writeUInt8(s, o + 1);
  header.writeUInt16LE(1, o + 4);
  header.writeUInt16LE(32, o + 6);
  header.writeUInt32LE(data.length, o + 8);
  header.writeUInt32LE(offset, o + 12);
  offset += data.length;
});
fs.writeFileSync(path.join(BRAND, 'favicons/favicon.ico'), Buffer.concat([header, ...pngs.map((p) => p.data)]));
fs.copyFileSync(path.join(BRAND, 'favicons/favicon.ico'), path.join(ROOT, 'public/favicon.ico'));
console.log(`Exported ${jobs.length} PNG files and favicon.ico`);
