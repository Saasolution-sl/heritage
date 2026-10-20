// Post-build check: starts the production server, crawls every page reachable
// from the home page and the sitemap, and fails on any broken internal link or
// asset, any page without a title, description, canonical URL or OG image, and
// any price or cart wording while trade ordering is off.
import { spawn } from 'node:child_process';

const PORT = 4322;
const BASE = `http://127.0.0.1:${PORT}`;
const server = spawn('npx', ['next', 'start', '-H', '127.0.0.1', '-p', String(PORT)], { stdio: 'ignore' });
const stop = () => server.kill();

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(BASE + '/')).ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('Server did not start');
}

const problems = [];
const pages = new Set();
const assets = new Set();

try {
  await waitForServer();
  const sitemap = await (await fetch(BASE + '/sitemap.xml')).text();
  const queue = ['/', ...[...sitemap.matchAll(/<loc>[^<]*?(\/[^<]*)<\/loc>/g)].map((m) => new URL(m[1], BASE).pathname)];
  while (queue.length) {
    const path = queue.shift();
    if (pages.has(path)) continue;
    pages.add(path);
    const res = await fetch(BASE + path);
    if (res.status !== 200) {
      problems.push(`${path}: HTTP ${res.status}`);
      continue;
    }
    const html = await res.text();
    if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${path}: missing <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push(`${path}: missing meta description`);
    if (!/<link rel="canonical"/.test(html)) problems.push(`${path}: missing canonical`);
    if (!/property="og:image"/.test(html)) problems.push(`${path}: missing og:image`);
    if (/add to (cart|bag)|buy now|[$€£]\s?\d/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) problems.push(`${path}: price or cart wording while ordering is off`);
    for (const [, url] of html.matchAll(/href="(\/[^"#?]*)/g)) {
      if (url.startsWith('//')) continue;
      if (/\.[a-z0-9]+$/i.test(url) && !url.endsWith('/')) assets.add(url);
      else if (!pages.has(url)) queue.push(url);
    }
    for (const [, url] of html.matchAll(/src="(\/[^"]*)"/g)) assets.add(url);
    for (const [, url] of html.matchAll(/url\((\/[^)]+)\)/g)) assets.add(url);
  }
  for (const url of assets) {
    const res = await fetch(BASE + url, { method: 'HEAD' });
    if (res.status !== 200) problems.push(`asset ${url}: HTTP ${res.status}`);
  }
  // CSS background images.
  const home = await (await fetch(BASE + '/')).text();
  for (const [, css] of home.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)) {
    const text = await (await fetch(BASE + css)).text();
    for (const [, url] of text.matchAll(/url\((\/brand\/[^)]+)\)/g)) {
      if ((await fetch(BASE + url, { method: 'HEAD' })).status !== 200) problems.push(`${css}: broken url ${url}`);
    }
  }
  const missing = await fetch(BASE + '/no-such-page/');
  if (missing.status !== 404) problems.push(`unknown route returned ${missing.status}, expected 404`);
  for (const f of ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest', '/favicon.ico']) {
    if ((await fetch(BASE + f)).status !== 200) problems.push(`missing ${f}`);
  }
} finally {
  stop();
}

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} problem(s) across ${pages.size} pages`);
  process.exit(1);
}
console.log(`Checked ${pages.size} pages and ${assets.size} assets: links, assets and metadata OK`);
