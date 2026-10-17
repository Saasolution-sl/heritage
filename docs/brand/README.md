# Brand asset library

Everything under `public/brand/` is **generated**: edit the generator or the data, then rebuild. Never hand-edit the output files.

```bash
npm run brand       # SVG masters  (scripts/brand/build-assets.mjs)
npm run brand:png   # PNG exports, favicons, favicon.ico (scripts/brand/export-png.mjs, needs Chromium)
```

Sources: `scripts/brand/lib/` (font outlining, geometry, marks, emblems, bands, cigar renders) and `src/data/collections.json`. `public/brand/manifest.json` lists every generated SVG.

## Production-ready vs concept

| Folder | Status | Contents |
|---|---|---|
| `logos/` | **Master artwork** (outlined vectors) | 8 layouts × 6 colourways + on-obsidian versions: primary, wordmark, wordmark-tagline, monogram, crest, laurel, horizontal, stacked |
| `logos/png/` | Raster exports | 1200 px transparent PNGs of each layout in full-color, gold, white, black, on-light, on-obsidian |
| `favicons/` | **Ready** | `favicon.svg`, `favicon-16/32/48.png`, `favicon.ico` (also at `/favicon.ico`), `app-icon.svg` + 180/192/512 PNG, `maskable-icon` |
| `emblems/` | Master artwork | 12 collection emblems in gold, and `-on-accent` roundels |
| `patterns/` | Ready | imperial lattice, Saadian zellige, laurel border, tobacco-leaf texture |
| `cigar-bands/` | **Concept** | 12 flat bands, to scale for each concept ring gauge |
| `cigar-bands/print/` | **Concept print layout** | Same bands with 3 mm bleed, dieline (magenta), glue area (cyan), notes. Not print-approved. |
| `product/` | Illustration | 12 to-scale cigar renders + 12 band close-ups. Placeholders until photography exists. |
| `packaging/` | **Concept** | 12 box lids + the twelve-collection presentation box |
| `social/` | Templates | avatar, OG image, banner, 12 post and 12 story templates (+ PNGs) |
| `stationery/` | Concept | business card front/back, A4 letterhead (placeholder fields in brackets) |

The first-pass kit you supplied is preserved unchanged in `docs/brand/reference-kit-v1/`.

## Fonts

Logo and band lettering is outlined from Cormorant Garamond and Inter (SIL OFL 1.1) at build time, so the SVGs do not depend on installed fonts.
