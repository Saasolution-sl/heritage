# From concept to commercial launch — prioritised checklist

## P0 — blockers before any public launch
- [ ] **Legal entity details**: company name, registered address, registration number, contact email → `src/config/site.ts`, legal pages, stationery.
- [ ] **Trademark clearance** for "Empire Cigars", the crest and monogram, and each collection name (Caesar, Napoleon, Charlemagne, etc.) in every launch market; file applications.
- [ ] **Legal review of the website** per market: age-gate approach, health warnings (`src/config/compliance.ts`), tobacco advertising rules for websites and social media, privacy and cookie notices.
- [ ] **Finalise privacy policy and terms** (currently drafts that describe the site's real behaviour).
- [ ] **Domain** and `NEXT_PUBLIC_SITE_URL`.
- [ ] **Cultural-sensitivity review** of names and emblems for each collection's markets.

## P1 — product reality
- [ ] Select the manufacturer; sign NDA and development agreement.
- [ ] Develop and approve blends; confirm vitola, ring gauge, length, strength and tasting notes per product.
- [ ] Record wrapper, binder, filler, country of origin and manufacturer in `collections.json`; set `specStatus: "verified"` and `status: "upcoming"`.
- [ ] Confirm packaging (count per box, materials), then commission box dielines.
- [ ] Commission product photography (see guidelines §9); add `images` to products.

## P2 — production artwork
- [ ] Designer refinement of the logo family (optical kerning of the monogram, crown detail at small sizes).
- [ ] Band printer: confirm minimum foil line and text sizes (medallion lettering is ~1.2–1.4 mm cap height), stock, foil colour, emboss; produce print-approved band files from `cigar-bands/print/`.
- [ ] Box printer: dielines, regulatory panels (health warnings, tax stamps, barcodes, origin) per market.
- [ ] Pantone/CMYK matching for accents; proof all twelve.

## P3 — commerce (only where legally permitted)
- [ ] Decide markets and channels (own e-commerce vs. retailers/distributors).
- [ ] Research and implement each market's rules on online tobacco sales, delivery, **verified** age checks at purchase and delivery, taxes and excise.
- [ ] Choose a commerce/payment provider that permits tobacco and supports age verification; many mainstream processors do not.
- [ ] Add prices, stock and shipping/returns policies only once real; then set `commerce.enabled` and build cart/checkout.

## P4 — marketing
- [ ] Contact form or enquiry channel (with privacy notice and data-processing agreement).
- [ ] Social accounts (respecting platform tobacco policies); add to `site.social`.
- [ ] Editorial review of journal drafts; mark `status: "published"`.
- [ ] Analytics only with a consent mechanism, if required.

## Known limitations of this build
- The age gate is a self-declaration and client-side only; it is not age verification.
- Product images are vector illustrations, not photographs.
- Accessibility was reviewed in code (landmarks, labels, focus styles, dialog focus, reduced motion) and colour contrast is unit-tested; no screen-reader or axe audit has been run.
- Health warning texts in `compliance.ts` are placeholders pending legal review.
