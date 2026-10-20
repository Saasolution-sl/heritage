// Access rules per country. Heritage Cigars sells business-to-business only, so
// the site is presented to tobacco-trade professionals of legal age. The
// visitor's country is detected from the hosting provider's geolocation
// header (see src/proxy.ts) and can be corrected by the visitor in the gate.
//
// These values are operating defaults, not legal advice. A self-declared
// confirmation is not age or trade verification; verified checks belong in
// the trade-ordering process.

export type CountryRule = {
  /** Minimum legal age to buy tobacco in the country. */
  minimumAge: number;
  /** Optional notice shown in the footer to visitors from this country. */
  notice?: string;
};

/** Countries with a known minimum age. Unlisted countries use `defaultRule`. */
export const countryRules: Record<string, CountryRule> = {
  // Company bases
  ES: { minimumAge: 18 }, // includes Ceuta
  PY: { minimumAge: 18 },
  // Europe
  AD: { minimumAge: 18 }, AT: { minimumAge: 18 }, BE: { minimumAge: 18 }, CH: { minimumAge: 18 }, CZ: { minimumAge: 18 },
  DE: { minimumAge: 18 }, DK: { minimumAge: 18 }, FI: { minimumAge: 18 }, FR: { minimumAge: 18 }, GB: { minimumAge: 18 },
  GI: { minimumAge: 18 }, GR: { minimumAge: 18 }, IE: { minimumAge: 18 }, IT: { minimumAge: 18 }, LU: { minimumAge: 18 },
  NL: { minimumAge: 18 }, NO: { minimumAge: 18 }, PL: { minimumAge: 18 }, PT: { minimumAge: 18 }, SE: { minimumAge: 18 },
  // Latin America
  AR: { minimumAge: 18 }, BO: { minimumAge: 18 }, BR: { minimumAge: 18 }, CL: { minimumAge: 18 }, CO: { minimumAge: 18 },
  CR: { minimumAge: 18 }, DO: { minimumAge: 18 }, EC: { minimumAge: 18 }, HN: { minimumAge: 18 }, MX: { minimumAge: 18 },
  PA: { minimumAge: 18 }, PE: { minimumAge: 18 }, UY: { minimumAge: 18 },
  // Elsewhere
  AE: { minimumAge: 18 }, AU: { minimumAge: 18 }, CA: { minimumAge: 21 }, // provinces range 18–21; the strictest is applied
  CN: { minimumAge: 18 }, HK: { minimumAge: 18 }, IN: { minimumAge: 18 }, JP: { minimumAge: 20 }, KR: { minimumAge: 19 },
  MA: { minimumAge: 18 }, NZ: { minimumAge: 18 }, SA: { minimumAge: 18 }, SG: { minimumAge: 21 }, TH: { minimumAge: 20 },
  US: { minimumAge: 21 },
};

/** Applied when the country is unknown or not listed: the strictest common minimum. */
export const defaultRule: CountryRule = { minimumAge: 21 };

export const compliance = {
  audience: 'trade' as const,
  /** Cookie set by src/proxy.ts with the visitor's ISO country code. */
  countryCookie: 'hc-country',
  /** localStorage key for the visitor's confirmation. */
  storageKey: 'hc-access',
  /** How long (days) a confirmation is remembered on the device. */
  rememberDays: 30,
  generalNotice: 'Tobacco products are harmful to health. This website is intended for professionals in the tobacco trade who are of legal age.',
};

export const ruleFor = (country: string | null | undefined): CountryRule =>
  (country && countryRules[country.toUpperCase()]) || defaultRule;

export const isKnownCountry = (country: string | null | undefined) => Boolean(country && countryRules[country.toUpperCase()]);
