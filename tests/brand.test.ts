import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '..');
const tokensCss = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');

// WCAG relative luminance and contrast ratio.
const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const token = (name: string) => tokensCss.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))![1];

describe('design tokens', () => {
  it('keeps the master palette exactly as specified', () => {
    expect(token('hc-obsidian').toUpperCase()).toBe('#0B0907');
    expect(token('hc-imperial-gold').toUpperCase()).toBe('#D6AD55');
    expect(token('hc-antique-gold').toUpperCase()).toBe('#9A7434');
    expect(token('hc-tobacco').toUpperCase()).toBe('#5B321E');
    expect(token('hc-ivory').toUpperCase()).toBe('#F3E7CC');
  });

  it('meets WCAG AA contrast for text roles on obsidian', () => {
    const bg = token('hc-obsidian');
    expect(contrast(token('hc-ivory'), bg)).toBeGreaterThanOrEqual(7);
    expect(contrast(token('hc-ivory-muted'), bg)).toBeGreaterThanOrEqual(7);
    expect(contrast(token('hc-ivory-faint'), bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token('hc-imperial-gold'), bg)).toBeGreaterThanOrEqual(4.5);
    // Primary button: obsidian text on gold.
    expect(contrast(bg, token('hc-imperial-gold'))).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the CSS accent tokens in sync with the collection data', () => {
    const { collections } = JSON.parse(fs.readFileSync(path.join(root, 'src/data/collections.json'), 'utf8'));
    for (const c of collections) expect(token(`hc-accent-${c.slug}`).toLowerCase(), c.slug).toBe(c.accent.hex.toLowerCase());
  });

  it('chooses band ink with enough contrast on every collection accent', async () => {
    const { collections } = JSON.parse(fs.readFileSync(path.join(root, 'src/data/collections.json'), 'utf8'));
    for (const c of collections) {
      const ink = c.accent.on === '#F3E7CC' ? token('hc-imperial-gold') : token('hc-obsidian');
      expect(contrast(ink, c.accent.hex), c.slug).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('brand asset library', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/brand/manifest.json'), 'utf8'));

  it('lists only files that exist, each an SVG with a viewBox and no live text', () => {
    for (const file of manifest.files as string[]) {
      const svg = fs.readFileSync(path.join(root, 'public/brand', file), 'utf8');
      expect(svg.startsWith('<svg'), file).toBe(true);
      expect(svg, file).toMatch(/viewBox="/);
      // Logos and bands are outlined: no <text> elements that depend on installed fonts.
      expect(svg.includes('<text'), file).toBe(false);
    }
  });

  it('includes the required logo variations and favicons', () => {
    for (const f of [
      'logos/heritage-cigars-primary-full-color.svg',
      'logos/heritage-cigars-wordmark-gold.svg',
      'logos/heritage-cigars-monogram-gold.svg',
      'logos/heritage-cigars-crest-gold.svg',
      'logos/heritage-cigars-horizontal-gold.svg',
      'logos/heritage-cigars-stacked-gold.svg',
      'logos/heritage-cigars-primary-white.svg',
      'logos/heritage-cigars-primary-black.svg',
      'favicons/favicon.svg',
    ]) {
      expect(manifest.files).toContain(f);
    }
    expect(fs.existsSync(path.join(root, 'public/favicon.ico'))).toBe(true);
    expect(fs.existsSync(path.join(root, 'public/brand/logos/png/heritage-cigars-primary-gold-1200.png'))).toBe(true);
  });
});
