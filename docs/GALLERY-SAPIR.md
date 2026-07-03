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

## Current architecture — manifest-driven, normal flow

The gallery is rendered by JavaScript from a single array, `GALLERY_ITEMS`,
defined in the `<script>` block of `logos-art-for-fun.html` (search for
`GALLERY MANIFEST`). There is no other place that lists gallery images.

```js
const GALLERY_ITEMS = [
  { file: 'GALLERY-01.jpg', visible: true, scale: 1 },
  { file: 'GALLERY-02.png', visible: true, scale: 1 },
  // ...
];
```

- **order** — display order = array order. Reorder by moving entries.
- **visible** — set to `false` to hide an image without deleting its entry.
- **scale** — relative size, `1` = default, `0.8` = smaller, `1.2` = larger.
  Applied as a `--scale` CSS custom property; on a normal row it acts as a
  flex-grow weight (bigger scale = wider relative to its row-mates), on a
  full-width row it scales the row's max-width.
- **file** — must be the *exact* filename **with extension** as it exists in
  `portfolio images/logos-art-for-fun/`. Mixed `.jpg`/`.png`/`.jpeg`/`.gif`/
  `.webp` (any case) are all fine. Only list files that exist — there is no
  auto-detection and no placeholder for missing files. To add a new image:
  drop the file in that folder, then add one `{ file: '...', scale: 1 }`
  entry to the array.

Rendering (`renderGallery()`, right below the manifest) builds one
`<div class="gallery-item"><img></div>` per visible entry and appends it to
`#galleryFlow`. Every 5th visible item (`GALLERY_FULL_WIDTH_EVERY`) gets the
`gallery-item--full` class for an occasional full-width row — this is
automatic, not a manifest field.

## Layout mechanics

```css
.gallery-flow{display:flex;flex-wrap:wrap;gap:32px;...}
.gallery-item{flex-grow:var(--scale,1);flex-shrink:1;flex-basis:360px}
.gallery-item--full{flex-basis:100%;max-width:min(100%,calc(1100px * var(--scale,1)))}
.gallery-item img{display:block;width:100%;height:auto;border-radius:3px}
```

- Normal document flow (no `position:sticky`/absolute) — rows push each
  other down as you scroll, exactly like standard block content.
- `flex-wrap` naturally reflows: ~3 images per row on desktop, ~2 on tablet
  (`≤900px`), 1 per row on mobile (`≤600px`) — no separate "grid" is
  authored per breakpoint, it emerges from `flex-basis`.
- Images always keep natural proportions: `width:100%;height:auto`, no
  `object-fit:cover`, no fixed-height wrappers, no cropping.
- **Gotcha:** `.gallery-item--full` must be re-asserted (`flex-basis:100%`)
  inside any media query that changes `.gallery-item`'s `flex-basis` —
  otherwise the later, equal-specificity rule wins and a full-width image
  silently shrinks back into a normal row.

## Images

Files live in **`portfolio images/logos-art-for-fun/`**. Currently
`GALLERY-01` through `GALLERY-15` exist (mixed extensions, see the manifest
for the exact filename of each) plus `IMG-00.jpg` (footer "let's work
together" photo, unrelated to the gallery grid). `GALLERY-16` onward are
**not yet uploaded** — don't add manifest entries for them until the files
exist.
