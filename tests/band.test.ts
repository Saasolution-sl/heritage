import { describe, expect, it } from 'vitest';
// @ts-expect-error -- plain ESM module from the asset generator
import { bandLengthMm } from '../scripts/brand/lib/band.mjs';

describe('band sizing', () => {
  it('derives the flat band length from the ring gauge plus a 10 mm overlap', () => {
    // RG 52: diameter 20.64 mm, circumference 64.84 mm, + 10 mm overlap.
    expect(bandLengthMm(52)).toBeCloseTo(74.8, 1);
    expect(bandLengthMm(38)).toBeCloseTo(57.4, 1);
    expect(bandLengthMm(60)).toBeLessThan(90);
  });
});
