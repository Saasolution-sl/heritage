# Collection data model

Source of truth: `src/data/collections.json`. Types and helpers: `src/lib/catalog.ts`. The website, the sitemap, search and the brand asset generator all read this one file, so adding or changing a product never means editing page components.

## Collection

| Field | Type | Notes |
|---|---|---|
| `slug` | string | URL segment, `/collections/{slug}/` |
| `number`, `numeral` | number, string | Order in the range and Roman numeral on bands |
| `name` | string | Collection name |
| `empire`, `period` | string | Historical inspiration and dates |
| `inspiration` | string | One-line description used on cards |
| `story` | string | Editorial paragraph for the collection page |
| `accent` | `{ name, hex, on }` | Accent colour; `on` is the ink colour family (ivory → gold ink, obsidian → obsidian ink) |
| `emblem` | `{ motif, note }` | Emblem description and cultural-sensitivity note; artwork in `public/brand/emblems/{slug}.svg` |
| `feature` | boolean? | Highlighted collection (Saadian) |
| `products` | Product[] | One or more cigars |

## Product

| Field | Type | Notes |
|---|---|---|
| `slug`, `name` | string | URL `/cigars/{slug}/` |
| `status` | `concept` \| `upcoming` \| `available` | Drives badges and availability text. Only `available` products may ever show a price. |
| `summary`, `description` | string | |
| `vitola` | `{ name, shape, lengthMm, ringGauge }` | `shape`: `parejo`, `torpedo`, `belicoso`, `perfecto`. Drives the cigar render and band length. |
| `strength` | string \| null | |
| `flavorDirection` | string[] | Intended direction while a concept; real tasting notes once verified |
| `packaging` | string \| null | |
| `related` | string[] | Product slugs |
| `wrapper`, `binder`, `filler`, `countryOfOrigin`, `manufacturer` | string \| null | **Leave null until verified.** Pages print "To be confirmed by the manufacturer". |
| `price`, `currency` | number \| null, string \| null | For commerce; never set while `status` is `concept`. |
| `specStatus` | `concept` \| `verified` | Set to `verified` only when the manufacturer confirms the specification; removes the "(concept)" labels. |

`tests/catalog.test.ts` fails the build if a concept product carries a price, origin, blend or manufacturer, if slugs collide, if related links are broken, or if any artwork is missing.

## Images

Paths are derived in `assets` (`src/lib/catalog.ts`). When photography exists, add an `images` array to the product and update `Gallery` on the product page to prefer it over the generated renders.

## Moving to a CMS or commerce platform

Replace the JSON import in `src/lib/catalog.ts` with a fetch at build time from the CMS/commerce API, mapping to the same types. Pages are unaffected.
