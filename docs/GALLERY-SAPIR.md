# Gallery Page — `logos-art-for-fun.html` ("the Sapir gallery")

This is the current spec for the logos / art-for-fun gallery page.

> **Source of truth = the committed HTML file in the repo.** This doc explains
> the mechanics; the actual manifest and CSS live inside `logos-art-for-fun.html`.

## ⚠️ History note

Earlier builds of this page used a **sticky, overlapping grid** (images
"slide" over each other while scrolling), reverse-engineered from an older
version of [sania.io](https://www.sania.io/). That system caused real bugs
(images overlapping, huge dead vertical gaps, cropped images) and was
**replaced** with the normal-flow layout described below. If you find old
docs or branches referencing `.work-grid`, `.work-ph`, `position:sticky`, or
per-image classes like `.g1-1`/`.g4-3`, they describe the retired system —
don't restore it.

## Current architecture — manifest-driven, grouped composition

The gallery is rendered by JavaScript from a single array, `GALLERY_ITEMS`,
defined in the `<script>` block of `logos-art-for-fun.html` (search for
`GALLERY MANIFEST`). There is no other place that lists gallery images.

```js
const GALLERY_ITEMS = [
  { file: 'GALLERY-01.jpg', order: 10, visible: true, group: 1, row: 1, layout: 'row', align: 'center', scale: 1.15 },
  { file: 'GALLERY-02.png', order: 20, visible: true, group: 1, row: 2, layout: 'row', align: 'center', scale: 1 },
  // ...
];
```

Each entry has 7 editable fields:

- **order** — sort key. Change the number to reorder without moving lines
  around (increments of 10 leave room to slot items in between).
- **visible** — set to `false` to hide an image without deleting its entry.
- **group** — which vertical block this image belongs to. Groups stack in
  ascending numeric order and each one pushes the next down the page —
  this is the "Sania rhythm": a handful of 4–5-image groups in sequence
  (currently 5 / 4 / 1 / 3 / 2 — see below).
- **row** — which row *inside its group* the image sits in (rows stack
  top-to-bottom within a group). **Keep each row to 1–2 images** — that's
  what makes it read as an editorial composition instead of a flat grid.
- **layout** — `'row'` (default) sizes the image normally within its row.
  `'full'` makes it a deliberate wide/full-width visual break — use this
  sparingly, on its own row, for the "big single image" moments.
- **align** — `'start' | 'center' | 'end'` — vertical alignment against its
  row-mates when they have different aspect ratios (a tall image next to a
  wide one: do they line up top, middle, or bottom?).
- **scale** — relative size, `1` = default, `0.8` = smaller, `1.2` = larger.
  Applied as a `--scale` CSS custom property that changes **real layout
  width** (flex-basis/flex-grow weight, or the full-width row's max-width)
  — never `transform:scale()`, so it never causes overlap.
- **file** — must be the *exact* filename **with extension** as it exists in
  `portfolio images/logos-art-for-fun/`. Mixed `.jpg`/`.png`/`.jpeg`/`.gif`/
  `.webp` (any case) are all fine. Only list files that exist — there is no
  auto-detection and no placeholder for missing files. To add a new image:
  drop the file in that folder, then add one manifest entry.

**Current groups** (13 images per the original composition brief, plus 2
extra already-uploaded files folded into a 5th group so nothing existing
gets dropped):
- Group 1 (5 images, rows 1/2/2): GALLERY-01 → 05
- Group 2 (4 images, rows 2/2): GALLERY-06 → 09
- Group 3 (1 image, `layout:'full'`): GALLERY-10 — the wide visual break
- Group 4 (3 images, rows 1/2): GALLERY-11 → 13
- Group 5 (2 images, row 1): GALLERY-14 → 15

Rendering (`renderGallery()`, right below the manifest) sorts by `order`,
buckets items into `group → row → items`, then builds nested
`.gallery-group > .gallery-row > .gallery-item` DOM matching that structure.

## Layout mechanics

```css
.gallery-flow{display:flex;flex-direction:column;gap:56px;...}      /* groups stack */
.gallery-group{display:flex;flex-direction:column;gap:32px}          /* rows stack */
.gallery-row{display:flex;flex-wrap:wrap;gap:32px}                   /* 1–2 images side by side */
.gallery-item{flex-grow:var(--scale,1);flex-basis:360px;max-width:min(100%,720px);align-self:var(--align,center)}
.gallery-item--full{flex-basis:100%;max-width:min(100%,calc(1100px * var(--scale,1)))}
.gallery-item img{display:block;width:100%;height:auto;border-radius:3px}
```

- Normal document flow (no `position:sticky`/absolute) at every level —
  groups and rows push each other down as you scroll, exactly like standard
  block content. No scattered/absolute positioning anywhere.
- Each row is an explicit `.gallery-row` built from the manifest's
  `group`/`row` fields — composition is authored, not auto-computed, so it
  never degenerates into a flat N-across grid.
- A lone (non-`full`) image in its own row is capped at `max-width:720px`
  so it reads as an intentional "solo" moment, visually distinct from a
  `layout:'full'` break (capped wider, at `1100px`).
- Images always keep natural proportions: `width:100%;height:auto`, no
  `object-fit:cover`, no fixed-height wrappers, no cropping.
- **Mobile (`≤600px`)** keeps the "2-col rhythm": paired rows stay 2 columns
  (just narrower), solo/full images stack at 100% width — nothing is forced
  into a single column, and nothing gets tiny/cropped.
- **Gotcha:** `.gallery-item--full` must be re-asserted inside any media
  query that changes `.gallery-item`'s `flex-basis` — otherwise the later,
  equal-specificity rule wins and a full-width image silently shrinks back
  into a normal row (bit us once already, see the `900px` and `600px`
  media queries for the fix).

## Images

Files live in **`portfolio images/logos-art-for-fun/`**. Currently
`GALLERY-01` through `GALLERY-15` exist (mixed extensions, see the manifest
for the exact filename of each) plus `IMG-00.jpg` (footer "let's work
together" photo, unrelated to the gallery grid). `GALLERY-16` onward are
**not yet uploaded** — don't add manifest entries for them until the files
exist.
