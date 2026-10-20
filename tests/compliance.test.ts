import { describe, expect, it } from 'vitest';
import { countryRules, defaultRule, ruleFor } from '@/config/compliance';
import { isValid, parseAccess } from '@/lib/ageStore';

describe('country rules', () => {
  it('applies each country’s minimum age and the strict default elsewhere', () => {
    expect(ruleFor('ES').minimumAge).toBe(18);
    expect(ruleFor('py').minimumAge).toBe(18);
    expect(ruleFor('US').minimumAge).toBe(21);
    expect(ruleFor('JP').minimumAge).toBe(20);
    expect(ruleFor('ZZ')).toBe(defaultRule);
    expect(ruleFor(null)).toBe(defaultRule);
  });

  it('never sets a default lower than any listed country', () => {
    for (const rule of Object.values(countryRules)) expect(defaultRule.minimumAge).toBeGreaterThanOrEqual(rule.minimumAge);
  });

  it('uses ISO 3166 alpha-2 codes', () => {
    for (const code of Object.keys(countryRules)) expect(code).toMatch(/^[A-Z]{2}$/);
  });
});

describe('stored access', () => {
  it('is valid only for the same country and within the remembered period', () => {
    const now = { at: Date.now(), country: 'ES' };
    expect(isValid(now, 'ES')).toBe(true);
    expect(isValid(now, 'US')).toBe(false);
    expect(isValid({ at: Date.now() - 40 * 86_400_000, country: 'ES' }, 'ES')).toBe(false);
    expect(isValid(null, 'ES')).toBe(false);
  });

  it('ignores malformed storage', () => {
    expect(parseAccess('not json')).toBeNull();
    expect(parseAccess('{"country":"ES"}')).toBeNull();
    expect(parseAccess(null)).toBeNull();
  });
});
