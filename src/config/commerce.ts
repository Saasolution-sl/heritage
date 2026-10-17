// Commerce is OFF. The site runs in catalog mode: no prices, cart, checkout or
// payment provider. Enabling sales requires verified products, prices, a
// payment/age-verification provider and a legal review per market — see
// docs/launch-checklist.md. Do not flip this flag on its own.
export const commerce = {
  enabled: false,
  mode: 'catalog' as 'catalog' | 'shop',
  currency: null as string | null,
  provider: null as string | null,
};
