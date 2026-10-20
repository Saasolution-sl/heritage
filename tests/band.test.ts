import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
// @ts-expect-error -- plain ESM module from the asset generator
import { band, bandLengthMm, LETTERING } from '../scripts/brand/lib/band.mjs';

const { collections } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/collections.json'), 'utf8'));

describe('band sizing', () => {
  it('derives the flat band length from the ring gauge plus a 10 mm overlap', () => {
    // RG 52: diameter 20.64 mm, circumference 64.84 mm, + 10 mm overlap.
    expect(bandLengthMm(52)).toBeCloseTo(74.8, 1);
    expect(bandLengthMm(38)).toBeCloseTo(57.4, 1);
    expect(bandLengthMm(60)).toBeLessThan(90);
  });

  it('keeps band lettering at or above the minimum cap heights on every collection', () => {
    for (const c of collections) {
      const { lettering } = band(c, c.products[0].vitola.ringGauge);
      expect(lettering.nameCapMm, c.slug).toBeGreaterThanOrEqual(LETTERING.nameMinCapMm);
      expect(lettering.wordmarkCapMm, c.slug).toBeGreaterThanOrEqual(LETTERING.wordmarkMinCapMm);
    }
  });
});
