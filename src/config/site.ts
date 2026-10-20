// Site-wide settings. Contact details and social accounts stay empty until the
// company supplies them: the site renders nothing rather than inventing them.
export const site = {
  name: 'Heritage Cigars',
  tagline: 'A Collection of Empires. A Legacy in Every Puff.',
  description:
    'Heritage Cigars is a luxury cigar house supplying the tobacco trade: twelve collections inspired by the craftsmanship, character and legacy of the world’s great empires, blended from Latin American tobaccos.',
  /** Business model: trade only (importers, distributors, retailers, lounges). */
  audience: 'trade' as const,
  /** Where the company is based. Addresses follow once registered. */
  locations: ['Ceuta, Spain', 'Paraguay'],
  /** Brand-level sourcing statement, confirmed by the company (17 October 2026). */
  sourcing: {
    tobacco: 'Blends of tobaccos from several Latin American countries',
    manufacturing: 'Several partner manufacturers, matched to each blend',
  },
  // Set NEXT_PUBLIC_SITE_URL once the domain is live; on Vercel the project's
  // production address is used until then.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
  ).replace(/\/$/, ''),
  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
  },
  social: [] as { label: string; href: string }[],
};

export const nav = [
  { href: '/collections/', label: 'Collections' },
  { href: '/heritage/', label: 'Our Heritage' },
  { href: '/craftsmanship/', label: 'Craftsmanship' },
  { href: '/journal/', label: 'Journal' },
  { href: '/contact/', label: 'Contact' },
] as const;
