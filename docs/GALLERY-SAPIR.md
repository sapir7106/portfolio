# Gallery — `logos-art-for-fun.html` ("the Sapir gallery")

The logos / art-for-fun gallery is built on **sania's real image-grouping
pattern** (5-image row / 4-image row / a lone wide moment / 3-image row /
3 / 2 / 2 / ...), used as a *pattern bank* for row shapes — not literally
rendered at 42 images. It is **manifest-driven** — built at runtime by JS
from a data array (`GALLERY_ITEMS`), not from hand-placed HTML per image, and
the page never requires more real images than actually exist.

> **Source of truth = `GALLERY_ITEMS` inside `logos-art-for-fun.html`**
> (in the page's own `<script>`, near the top). To tune the gallery, edit
> `group` / `groupPosition` / `layout` / `align` / `order` / `visible` /
> `mobileLayout` there — never the DOM, never a CSS class, never a filename.

## The manifest

```js
const GALLERY_ITEMS = [
  {
    id: 'gallery-01',
    src: '/portfolio images/logos-art-for-fun/GALLERY-01.jpg',
    alt: 'Logo and icon design — 01',
    visible: true,
    order: 1,
    group: 1,            // which row/section this image belongs to
    groupPosition: 1,     // 1-based slot within that row
    layout: 'group-5',    // the row's shape (see presets below)
    align: 'left',        // where in the row this slot sits
    mobileLayout: 'half', // 'full' (both mobile cols) or 'half' (one of two)
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
  groups — keep a group's items contiguous in `order` (e.g. group 1 = orders
  1–5, group 2 = orders 6–9) so they read as one row, not interleaved ones.
- **`group`** — which row/section an image belongs to. All items sharing a
  `group` value render together as one CSS Grid row.
- **`groupPosition`** — 1-based slot within the group (left to right). If
  omitted, items fall back to `order` for their position in the row.
- **`layout`** — the row's shape (see presets below): `group-5`, `group-4`,
  `group-3`, `group-2` for compact multi-image rows, or `single-wide` for a
  lone big moment. All items in the same group should share the same
  `layout`.
- **`align`** — `left` / `center-left` / `center` / `center-right` / `right`.
  For a `single-wide` (the only item in its group) this places it in the
  leftover desktop columns. For a multi-item group it's descriptive of the
  tiled slot — the actual position comes from `groupPosition`/`order`, since
  those rows tile edge-to-edge with no gaps.
- **`mobileLayout`** *(optional)* — `full` (spans both mobile columns) or
  `half` (spans one of two). Falls back to a per-preset default if omitted.

None of these ever crop or stretch an image — every image renders at
`width:100%; height:auto`, natural aspect ratio, no `object-fit:cover`, no
forced-square wrapper. The manifest only ever changes how much *space* an
image is given, never its own proportions.

### Layout presets (`GALLERY_GROUP_PRESETS` in the script)

| Preset | Desktop tiling (of 12 cols) | Tablet | Mobile default | Reads as |
| --- | --- | --- | --- | --- |
| `group-5` | `[3, 2, 2, 2, 3]` | span 4 (2-up) | half (2-up) | sania's compact 5-image opening row |
| `group-4` | `[3, 3, 3, 3]` | span 4 (2-up) | half (2-up) | compact 4-image row |
| `group-3` | `[4, 4, 4]` | span 4 (2-up + 1) | full (stacked) | grouped 3-image row |
| `group-2` | `[6, 6]` | span 4 (2-up) | half (2-up) | grouped 2-image row |
| `single-wide` | `[10]`, centered via `align` | span 8 (full) | full | the big visual break |

Desktop spans in a preset **sum to 12** (`single-wide` sums to 10, leaving 2
columns of intentional margin) — that's what makes a group tile edge-to-edge
into one real row/section instead of independent masonry. If a group's
visible item count doesn't match its preset's designed count (e.g. you hide
one image out of a `group-5`), the render function falls back to dividing 12
columns evenly across however many are actually visible, so a row never
breaks — it just gets slightly different proportions.

**Rule of thumb, per sania's own rhythm:** open with `group-5`, then
`group-4`, then a `single-wide` break, then back to compact rows
(`group-3`/`group-2`). The current 13-image build is exactly that:
groups 1–4 = orders 1–5 / 6–9 / 10 / 11–13.

### Align (desktop only)

- **Lone item in a group (`single-wide`)** — `align` genuinely moves it:
  `left` starts at column 1, `right` ends at column 12, `center` splits the
  leftover columns evenly, `center-left`/`center-right` split unevenly toward
  one side.
- **Multi-item group** — the row already tiles edge-to-edge (no leftover
  space to move into), so `align` is a descriptive label matching the natural
  left-to-right slot order (`left` = first slot, `right` = last slot,
  `center-left`/`center`/`center-right` = the slots in between). The actual
  position is driven by `groupPosition`/`order`.

Tablet and mobile ignore `align` entirely (span-only, auto-placed by the
browser) so nothing lands off-balance on a narrower grid.

### Extending the gallery (13 → 20 images)

The manifest has the next groups already sketched out as commented-out rows,
following the same sania pattern bank:

- Group 5 (orders 14–16): `group-3`, a 3-image row.
- Group 6 (orders 17–18): `group-2`, a 2-image row.
- Group 7 (orders 19–20): `group-2`, a 2-image row.

**To add a new image:** drop the file into
`portfolio images/logos-art-for-fun/`, uncomment (or add) its row with the
exact `src`, and make sure its `order`/`group`/`groupPosition` line up with
its neighbors. Nothing else in the file needs to change.

**Missing/renamed file:** the `<img onerror>` handler removes just that one
slot — a bad path never renders a broken-image icon or reserves an empty gap.

## Render behavior (`renderGallery()` in the page's script)

- Filters to `visible:true`, sorts by `order`, then buckets items into groups
  (preserving each group's first appearance in `order`).
- For each group, tiles its items' desktop spans left-to-right (or, for a
  lone item, places it via `align`), and sets each item's
  `--desktop-col` / `--tablet-col` / `--mobile-col` CSS custom properties —
  the CSS itself never hard-codes which image goes where or how many appear
  per row.
- Each item also gets a `work-ph--<layout>` class (e.g. `work-ph--group-5`)
  as a stable semantic hook for the row shape — sizing itself stays in the
  custom properties, not duplicated into per-class CSS.
- Because groups compute their own tiling from however many *visible* items
  they actually contain, the layout doesn't break as the image count changes
  between 13, 15, or 20 — it just re-tiles.

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
- **> 900px** — 12-column sticky grid, groups tile into real rows, `align`
  places lone `single-wide` moments.
- **≤ 900px (tablet)** — 8 columns, sticky/offset effect turned off
  (`.work-ph` resets to `position:relative;top:0`), spans only (no `align`) —
  compact groups reduce to a 2-up auto-flow, `single-wide` stays full width.
- **≤ 600px (mobile)** — 2 columns; `mobileLayout` (or its preset default)
  decides `full` (both columns) vs `half` (one of two, a gentle 2-up).

At no width are images cropped or force-stretched — the responsive rules only
touch grid placement/position, never the image's own sizing.

## Superseded

Earlier builds have been replaced by the manifest system above:
1. The original hand-placed 42-slot HTML (`GALLERY-01`…`GALLERY-42` divs with
   `hidden-item`/`hidden-grid` classes and per-image `.g1-1`…`.g16-2` CSS
   position classes).
2. A manifest pass with a `size` field (`sm`/`md`/`lg`/`xl`) and an automatic
   "first 7 expressive / rest capped" rule.
3. A manifest pass with independent `layout`/`align` per image
   (`fullscreen`/`wide`/`featured`/`large`/`medium`/`small`/`pair`/`tiny`,
   each positioned on its own via `align`) — this gave direct per-image
   control but didn't track sania's actual row groupings, so it's been
   replaced by the `group`/`groupPosition` system above, which mirrors
   sania's real 5/4/1/3/3/2/2 rhythm instead of ad-hoc independent sizing.

If you ever want to reference sania's *exact* 42-image pixel positions again,
they're preserved in git history on this file (pre-manifest revision) —
restore from there, not from memory.
