import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { collections, allProducts, getProduct, relatedProducts, assets, inches } from '@/lib/catalog';

const publicDir = path.resolve(__dirname, '../public');

describe('collection data', () => {
  it('has the twelve collections in order', () => {
    expect(collections.map((c) => c.name)).toEqual(['Caesar', 'Pharaoh', 'Tsar', 'Suleiman', 'Akbar', 'Napoleon', 'Cyrus', 'Genghis', 'Charlemagne', 'Saadian', 'Inca', 'Imperator']);
    collections.forEach((c, i) => expect(c.number).toBe(i + 1));
  });

  it('gives every collection a distinct, valid accent colour', () => {
    const hexes = collections.map((c) => c.accent.hex.toLowerCase());
    hexes.forEach((h) => expect(h).toMatch(/^#[0-9a-f]{6}$/));
    expect(new Set(hexes).size).toBe(12);
  });

  it('uses unique slugs for collections and products', () => {
    const slugs = [...collections.map((c) => c.slug), ...allProducts().map(({ product }) => product.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('only links related products that exist', () => {
    for (const { product } of allProducts()) {
      expect(relatedProducts(product)).toHaveLength(product.related.length);
      expect(product.related).not.toContain(product.slug);
    }
  });

  it('never presents unconfirmed facts: no prices, origins or blends while products are concepts', () => {
    for (const { product } of allProducts()) {
      if (product.status !== 'concept') continue;
      for (const key of ['price', 'wrapper', 'binder', 'filler', 'countryOfOrigin', 'manufacturer'] as const) {
        expect(product[key] ?? null, `${product.slug}.${key}`).toBeNull();
      }
      expect(product.specStatus ?? 'concept').toBe('concept');
    }
  });

  it('has generated artwork for every collection and product', () => {
    for (const c of collections) {
      for (const file of [assets.emblem(c), assets.emblemOnAccent(c), assets.band(c), assets.boxLid(c)]) {
        expect(fs.existsSync(path.join(publicDir, file)), file).toBe(true);
      }
      for (const p of c.products) {
        expect(fs.existsSync(path.join(publicDir, assets.cigar(p)))).toBe(true);
        expect(fs.existsSync(path.join(publicDir, assets.bandDetail(p)))).toBe(true);
      }
    }
  });

  it('finds products by slug', () => {
    expect(getProduct('saadian-robusto')?.collection.name).toBe('Saadian');
    expect(getProduct('nope')).toBeUndefined();
  });
});

describe('inches', () => {
  it('formats millimetres as fractional inches', () => {
    expect(inches(152.4)).toBe('6″');
    expect(inches(140)).toBe('5 1/2″');
    expect(inches(178)).toBe('7″');
    expect(inches(143)).toBe('5 5/8″');
  });
});
