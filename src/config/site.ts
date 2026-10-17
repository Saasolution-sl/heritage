// Site-wide settings. Contact details and social accounts stay empty until the
// company supplies them: the site renders nothing rather than inventing them.
export const site = {
  name: 'Empire Cigars',
  tagline: 'A Collection of Empires. A Legacy in Every Puff.',
  description:
    'Empire Cigars is a contemporary luxury cigar house in development: twelve cigar concepts inspired by the craftsmanship, character and legacy of the world’s great empires.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
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
