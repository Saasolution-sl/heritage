// Post-build checks on ./out: every internal link and asset reference
// resolves to a file, every page has a title, description and canonical URL,
// and no page ships a price or an add-to-cart control while commerce is off.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('out');
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(OUT);

const exists = (url) => {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  const file = path.join(OUT, clean);
  return fs.existsSync(file) && (fs.statSync(file).isFile() || fs.existsSync(path.join(file, 'index.html')));
};

const problems = [];
for (const page of pages) {
  const rel = '/' + path.relative(OUT, page).split(path.sep).join('/');
  const html = fs.readFileSync(page, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith('//')) continue;
    if (!exists(url)) problems.push(`${rel}: broken link ${url}`);
  }
  for (const [, url] of html.matchAll(/url\((\/[^)]+)\)/g)) if (!exists(url)) problems.push(`${rel}: broken CSS url ${url}`);
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${rel}: missing <title>`);
  if (rel === '/404.html' || rel === '/404/index.html' || rel.startsWith('/_not-found')) continue;
  if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push(`${rel}: missing meta description`);
  if (!/<link rel="canonical"/.test(html)) problems.push(`${rel}: missing canonical`);
  if (!/property="og:image"/.test(html)) problems.push(`${rel}: missing og:image`);
  if (/add to (cart|bag)|buy now|[$€£]\s?\d/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) problems.push(`${rel}: commerce wording or a price while commerce is disabled`);
}

// CSS files: referenced url() assets must exist.
const cssDir = path.join(OUT, '_next/static');
(function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.css')) {
      for (const [, url] of fs.readFileSync(p, 'utf8').matchAll(/url\((\/(?:brand)[^)]+)\)/g)) if (!exists(url)) problems.push(`${e.name}: broken url ${url}`);
    }
  }
})(cssDir);

for (const f of ['404.html', 'robots.txt', 'sitemap.xml', 'manifest.webmanifest', 'favicon.ico']) if (!fs.existsSync(path.join(OUT, f))) problems.push(`missing ${f}`);

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) in ${pages.length} pages`);
  process.exit(1);
}
console.log(`Checked ${pages.length} pages: links, assets and metadata OK`);
