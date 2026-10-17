// Age and warning settings, configurable per market. These values are
// defaults for a catalog-only site, NOT legal advice: each market must be
// reviewed by qualified counsel before advertising, selling or shipping.
// A self-declared age confirmation is not age verification.

export type Market = {
  code: string;
  name: string;
  minimumAge: number;
  /** Health warning shown in the footer; must be confirmed by counsel per market. */
  warning: string;
  salesPermitted: false; // stays false until a legal review sets otherwise
};

export const markets: Market[] = [
  {
    code: 'US',
    name: 'United States',
    minimumAge: 21, // federal minimum age for tobacco sales since December 2019
    warning: 'Cigar smoking can cause cancers of the mouth and throat, even if you do not inhale.',
    salesPermitted: false,
  },
  {
    code: 'EU',
    name: 'European Union',
    minimumAge: 18,
    warning: 'Smoking kills.',
    salesPermitted: false,
  },
  {
    code: 'MA',
    name: 'Morocco',
    minimumAge: 18,
    warning: 'Tobacco is harmful to health.',
    salesPermitted: false,
  },
];

export const compliance = {
  /** Market whose rules the site applies by default (strictest age used for the gate). */
  defaultMarket: 'US',
  /** The gate uses the highest minimum age of all configured markets. */
  gateMinimumAge: Math.max(...markets.map((m) => m.minimumAge)),
  /** How long (days) a visitor's age confirmation is remembered on their device. */
  rememberDays: 30,
  storageKey: 'ec-age-confirmed',
  generalNotice: 'Tobacco products are harmful to health. This website is intended only for adults of legal smoking age.',
};

export const defaultMarket = markets.find((m) => m.code === compliance.defaultMarket)!;
