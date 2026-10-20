// Heritage Cigars sells business-to-business. Trade ordering is OFF: the site
// runs as a trade catalogue with no prices, cart or checkout. Turning on
// ordering needs confirmed products and trade prices, a verified trade-account
// process and a review of each market's rules — see docs/launch-checklist.md.
export const commerce = {
  enabled: false,
  mode: 'catalog' as 'catalog' | 'trade-portal',
  currency: null as string | null,
  provider: null as string | null,
};
