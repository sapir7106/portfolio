# Gallery — `logos-art-for-fun.html` ("the Sapir gallery")

The logos / art-for-fun gallery is built as **art-directed compositions**,
modeled on how sania's own gallery actually *reads* — 1-2 dominant images,
one layered/overlapping pair, a small accent, real whitespace — not a flat
row of equal-width thumbnails. It is **manifest-driven** — built at runtime
by JS from a data array (`GALLERY_ITEMS`), not from hand-placed HTML per
image, and the page never requires more real images than actually exist.

> **Source of truth = `GALLERY_ITEMS` inside `logos-art-for-fun.html`**
> (in the page's own `<script>`, near the top). To tune the gallery, edit
> `scene` / `role` / `layout` / `align` / `mobileLayout` / `order` /
> `visible` / `zIndex` there — never the DOM, never a CSS class, never a
> filename.

## The manifest

```js
const GALLERY_ITEMS = [
  {
    id: 'gallery-01',
    src: '/portfolio images/logos-art-for-fun/GALLERY-01.jpg',
    alt: 'Logo and icon design — 01',
    visible: true,
    order: 1,
    scene: 1,               // which composition this image belongs to
    role: 'dominant-left',  // its part in that composition
    layout: 'large',        // used on tablet/mobile only (see below)
    align: 'left',          // descriptive — matches the role's natural side
    mobileLayout: 'full',   // 'full' (both mobile cols) or 'half' (one of two)
  },
  // ...
];
```

- **`src`** — the exact path **including extension**, case-sensitive
  (Cloudflare Pages serves a case-sensitive filesystem). This is the *only*
  place an extension is written — a `.png` becoming a `.jpg`/`.gif`/`.webp` is
  a one-line change here, nothing else in the page needs to know.
- **`visible`** — `true`/`false`. Hide an image by flipping this to `false`;
  show it by flipping back to `true`. Don't delete the file.
- **`order`** — plain integer. Sets render order **and** clusters images into
  scenes — keep a scene's items contiguous in `order` (e.g. scene 1 = orders
  1–5, scene 2 = orders 6–9).
- **`scene`** — which composition an image belongs to. All items sharing a
  `scene` value render together inside one `.gallery-scene` grid.
- **`role`** — where the image sits in that composition on desktop (see
  presets below). This is what replaced "5 images in a row": each role is a
  column band, and the browser's own CSS Grid auto-placement stacks bands
  into rows/whitespace as they collide — there's no hard-coded row count.
- **`layout`** — `large` / `medium` / `small` / `tiny` / `wide`. Used **only**
  on tablet/mobile, where desktop's role-based placement is dropped for
  simple stacking (see Responsive).
- **`align`** — kept for authoring readability (it matches the role's
  natural side — `dominant-left` is `'left'`, `dominant-right` is `'right'`,
  etc.) but desktop placement itself comes from `role`, not from `align`.
- **`mobileLayout`** *(optional)* — `full` (spans both mobile columns) or
  `half` (spans one of two).
- **`zIndex`** *(optional)* — only matters for the deliberately overlapping
  `center-back`/`center-front` pair; controls which one reads as "in front."

None of these ever crop or stretch an image — every image renders at
`width:100%; height:auto`, natural aspect ratio, no `object-fit:cover`, no
forced-square wrapper. The manifest only ever changes how much *space* an
image is given (and, for the layered pair, how it overlaps), never its own
proportions.

### Role presets (`GALLERY_ROLE_PRESETS` in the script, desktop only)

| Role | Desktop column band | Notes |
| --- | --- | --- |
| `dominant-left` | `1 / 6` | a strong anchor, left side |
| `dominant-right` | `7 / 13` | a strong anchor, right side |
| `center-back` | `6 / 10` | pinned to row 1 — half of the layered pair |
| `center-front` | `7 / 10` | pinned to row 1, `z-index:2`, nudged down ~30% to peek out from `center-back` — the other half of the layered pair |
| `accent-top` | `10 / 12` | a small, isolated detail near the top |
| `accent-small` | `10 / 12` | a small supporting detail |
| `wide-center` | `2 / 12` | a single wide/near-fullscreen visual break |
| `pair-left` / `pair-right` | `1 / 7` / `7 / 13` | two images meant to share one row evenly |
| `supporting-left` / `supporting-right` | `1 / 7` / `7 / 13` | smaller images backing up a dominant/focal image |

**Why this reads as a composition, not a row:** every role is *only* a
column band — no role has an explicit row number (except the layered pair,
which pins to row 1 on purpose so the two can overlap; CSS Grid's own
auto-placement never lets two auto-placed items share a column range on its
own). Everything else just asks for its column band, and the grid places it
in the earliest row where that band is free. In scene 1, `dominant-left` +
the layered pair + `accent-top` all fit in row 1 together; `dominant-right`'s
band collides with the layered pair there, so it's pushed to row 2 —
producing a rich top cluster, a strong second anchor stepped below it, and a
real empty gap under `dominant-left` in row 2. That gap is intentional
whitespace, not a bug.

**Composing a new scene:** pick 1-2 dominant/focal roles and 1-2
supporting/accent roles — never assign the same "equal" role to every item in
a scene. A calmer scene (like scene 2) skips the layered pair entirely: one
`dominant-left`, two `supporting-left`/`supporting-right`, one `accent-top`.
An ending scene (like scene 4) can pair a dominant with one supporting image
in row 1 and drop the last supporting image alone into row 2, so it never
reads as a flat 3-column grid.

### Scene flow (why one scene can never cover another)

Overlap is only ever a *within-scene* trick (the `center-back`/`center-front`
pair). Across scenes, the scroll must feel like sania's: one composition
exits upward, the next enters below it — never stacked on top. That's
guaranteed structurally, not just by convention:

- Every `.gallery-scene` is a normal block-level grid in normal document
  flow (`position:relative`, no `absolute`/`fixed`). Nothing takes a scene
  out of flow, so the next scene can't help but start after it.
- `.work-ph` (every image wrapper) is also plain `position:relative` — never
  `sticky`. There's no scroll-linked mechanism anywhere that could make an
  earlier image visually persist over a later scene.
- `z-index` is only ever set on items *within* the same scene (the layered
  pair). Nothing sets a cross-scene z-index, so stacking order never needs
  to be reasoned about between compositions.
- The `center-front` overlap uses a real `margin-top` (not `position:
  absolute`/negative margins), which CSS Grid's row-sizing counts as part of
  the item's box — so `.gallery-scene`'s own height always includes the full
  visual extent of the overlap. A scene's rendered height already reserves
  the composition's true "exit point"; the next scene can't start early.

This was verified empirically (headless-browser scroll + `getBoundingClientRect`):
every scene's bottom edge exactly matches its tallest item's bottom edge, and
each next scene starts strictly after that with a consistent gap — at
desktop, tablet, and mobile widths.

### Current composition plan (13 images)

- **Scene 1** (orders 1–5) — sania's opening feel: `dominant-left` +
  `center-back`/`center-front` (layered) + `accent-top` + `dominant-right`.
- **Scene 2** (orders 6–9) — calmer: `dominant-left` + `accent-top` +
  `supporting-left` + `supporting-right`, no overlap.
- **Scene 3** (order 10) — `wide-center`, the first strong pause.
- **Scene 4** (orders 11–13) — `dominant-left` + `supporting-right` sharing
  row 1, `supporting-left` alone in row 2.

Scenes 5–7 (orders 14–20, one focal + 1-2 supporting each) are sketched as
commented-out rows in the manifest — uncomment and fill in `src` as real
files land. **To add a new image:** drop the file into
`portfolio images/logos-art-for-fun/`, add (or uncomment) its row with the
exact `src`, and pick a role that fits its place in that scene.

**Missing/renamed file:** the `<img onerror>` handler removes just that one
slot — a bad path never renders a broken-image icon or reserves an empty gap.

## Render behavior (`renderGallery()` in the page's script)

- Filters to `visible:true`, sorts by `order`, then buckets items into
  scenes (preserving each scene's first appearance in `order`).
- Each scene becomes its own `.gallery-scene` (a fresh 12-column CSS Grid) —
  compositions never bleed into each other, and each gets breathing room via
  `.gallery-scene + .gallery-scene { margin-top: ... }`.
- Each item gets `--desktop-col` / `--desktop-row` / `--item-z` / `--item-mt`
  / `--item-align` CSS custom properties from its role (plus `--tablet-col`
  / `--mobile-col` from its `layout`/`mobileLayout`) — the CSS itself never
  hard-codes which image goes where.
- Each item also gets a `work-ph--<role>` class as a stable semantic hook —
  actual placement stays in the custom properties, not duplicated into
  per-class CSS.

## Images

- Files live in **`portfolio images/logos-art-for-fun/`**. Current real
  assets: `GALLERY-01.jpg` … `GALLERY-13.jpg` (mixed extensions — `.jpg`,
  `.png`, `.GIF` — by design; see manifest above). `IMG-00.jpg` is separate,
  used only in the footer ("let's work together"), not part of the gallery
  loop.
- Captions/detail copy: `logos-art-for-fun-content.txt` has placeholder rows
  per `GALLERY-XX` id — not yet wired into a lightbox for this page (the
  gallery items don't currently open a lightbox on click; only the case-study
  `.img-mt`/`.img-row`/`.img-stack` figures do).

## Responsive

Aligned to the site's standard breakpoints (see `docs/RESPONSIVE.md`):
- **> 900px** — 12-column grid per scene, `role`-based composition (column
  bands, the one deliberate overlap, real negative space).
- **≤ 900px (tablet)** — 8 columns. Role-based placement is dropped entirely
  (overlap/z-index/absolute bands would get awkward on a narrower grid);
  items fall back to a simple `layout`-driven span and the grid auto-flows.
- **≤ 600px (mobile)** — 2 columns; `mobileLayout` decides `full` (both
  columns) vs `half` (one of two, a gentle 2-up). Each scene stacks cleanly,
  one after another.

At no width are images cropped or force-stretched — the responsive rules only
touch grid placement/position, never the image's own sizing.

## Superseded

Earlier builds have been replaced by the manifest system above:
1. The original hand-placed 42-slot HTML (`GALLERY-01`…`GALLERY-42` divs with
   `hidden-item`/`hidden-grid` classes and per-image `.g1-1`…`.g16-2` CSS
   position classes).
2. A manifest pass with a `size` field (`sm`/`md`/`lg`/`xl`) and an automatic
   "first 7 expressive / rest capped" rule.
3. A manifest pass with independent `layout`/`align` per image, each
   positioned on its own via `align` (no grouping concept).
4. A `group`/`groupPosition` pass that tiled sania's row *counts* (5/4/1/3)
   as literal equal-ish-width rows — visually correct rhythm, but each row
   still read as flat thumbnails rather than an art-directed composition.
   Replaced by the `scene`/`role` system above, which models sania's actual
   composition (dominant anchors, a layered pair, an accent, real negative
   space) instead of just its image counts per row.

If you ever want to reference sania's *exact* 42-image pixel positions again,
they're preserved in git history on this file (pre-manifest revision) —
restore from there, not from memory.
