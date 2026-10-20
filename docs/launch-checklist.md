# Heritage Cigars — launch checklist

Status as of 20 October 2026. Heritage Cigars sells **business-to-business only**, from Ceuta (Spain) and Paraguay.

## Decided by the company
- Brand name: **Heritage Cigars** (renamed from Empire Cigars on 20 October 2026).
- Formats, strengths and flavour profiles: the company's reference sheet.
- Sourcing: tobaccos from several Latin American countries, several partner manufacturers.
- Trademark searches, legal review and cultural-sensitivity review: **not pursued** (owner decision, 17 October 2026).

## Before going live
- [ ] Company details: legal names, registered addresses in Ceuta and Paraguay, registration numbers, trade-enquiry email and telephone → `src/config/site.ts` (they then appear in the footer, contact page and legal pages).
- [ ] Domain, and `NEXT_PUBLIC_SITE_URL`.
- [ ] Choose the host (Vercel recommended) so country detection works — see `docs/deployment.md`.
- [ ] Complete the privacy policy and terms with the company details (both are drafts that describe the site's real behaviour).
- [ ] Review the per-country minimum ages in `src/config/compliance.ts` for the markets you will serve.

## Product
- [ ] Finalise each blend with its manufacturer; record wrapper, binder, filler, tobacco countries and manufacturer in `src/data/collections.json`, then set `specStatus: "verified"` and `status: "upcoming"` or `"available"`.
- [ ] Photograph finished cigars, boxes and bands; replace the illustrations (guidelines §9).
- [ ] Confirm packaging (count per box, materials) and commission box dielines.

## Print
- [ ] Band printer: confirm stock, foil, emboss and minimum foil text (names are ≥ 2.0 mm cap height, the wordmark 1.5 mm); produce print-approved files from `public/brand/cigar-bands/print/`.
- [ ] Packaging for each destination market must carry that market's mandatory health warnings and other labelling (this applies to products placed on the market, whether or not you sell B2B).

## Trade ordering (when ready)
- [ ] Decide the ordering model: trade-account portal, or orders through distributors.
- [ ] Verified trade accounts (business registration and licence checks) replace the self-declared gate for ordering.
- [ ] Trade prices, minimum orders, shipping and returns terms; then set `commerce.enabled` and build the portal.
- [ ] A trade-enquiry form, once there is a recipient and a privacy notice for it.

## Known limitations
- The access gate is a self-declaration on the visitor's device. It is not age or trade verification.
- Country detection depends on the host sending a geolocation header (Vercel, Netlify, Cloudflare and CloudFront do).
- Product images are vector illustrations.
- No screen-reader or axe accessibility audit has been run; contrast is unit-tested and keyboard focus is handled in code.
