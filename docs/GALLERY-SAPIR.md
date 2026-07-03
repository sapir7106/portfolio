# Gallery — `logos-art-for-fun.html` ("the Sapir gallery")

The logos / art-for-fun gallery is an **art-directed, sania-inspired editorial
grid**: mixed image sizes, intentional whitespace, a few fullscreen/near-
fullscreen moments, varied rows. It is **manifest-driven** — built at runtime
by JS from a data array (`GALLERY_ITEMS`), not from hand-placed HTML per
image. Sania's original 42-image composition is kept only as a *pattern
reference* — it is not rendered 1:1, and the page never requires 42 real
images to work.

> **Source of truth = `GALLERY_ITEMS` inside `logos-art-for-fun.html`**
> (in the page's own `<script>`, near the top). To tune the gallery, edit
> `layout` / `align` / `order` / `visible` / `mobileLayout` there — never the
> DOM, never a CSS class, never a filename.

## The manifest

```js
const GALLERY_ITEMS = [
  {
    id: 'gallery-01',
    src: '/portfolio images/logos-art-for-fun/GALLERY-01.jpg',
    alt: 'Logo and icon design — 01',
    visible: true,
    order: 1,
    layout: 'fullscreen',
    align: 'center',
    mobileLayout: 'full',
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
- **`order`** — plain integer, sets render order. Reorder by editing numbers,
  never by renaming files or moving HTML.
- **`layout`** — how much width the image gets, desktop/tablet/mobile. One of
  the 8 presets below.
- **`align`** — `left` / `center` / `right`. Where the image's span sits
  inside the 12-column desktop row (desktop only — see Responsive).
- **`mobileLayout`** *(optional)* — `full` (spans both mobile columns) or
  `half` (spans one of two). If omitted, falls back to a sensible default
  derived from `layout`.

None of these ever crop or stretch an image — every image renders at
`width:100%; height:auto`, natural aspect ratio, no `object-fit:cover`, no
forced-square wrapper. `layout`/`align` only ever change how much *space* an
image is given, never its own proportions.

### Layout presets (column span, out of 12 desktop / 8 tablet / 2 mobile)

| Preset | Desktop | Tablet | Mobile | Use for |
| --- | --- | --- | --- | --- |
| `fullscreen` | 12 | 8 | 2 | Strongest moment, full-bleed. Use sparingly. |
| `wide` | 10 | 8 | 2 | Wide, just short of fullscreen. |
| `featured` | 8 | 6 | 2 | Large editorial moment. |
| `large` | 6 | 5 | 2 | Strong image, smaller than `featured`. |
| `medium` | 4 | 4 | 2 | Default supporting size. |
| `small` | 3 | 3 | 1 | Smaller supporting image. |
| `pair` | 6 | 4 | 1 | Designed to sit next to another `pair` (see below). |
| `tiny` | 2 | 2 | 1 | Logos/icons/small details. |

**Rule of thumb:** 2–3 `fullscreen`/`wide`/`featured` moments across the whole
gallery reads as intentional; more and nothing stands out. The current
13-image build uses exactly 3 (order 1, 7, 13).

**`pair` recipe:** give one item `align:'left'` and the very next `align:
'right'` — two `pair`s (span 6 each) then interlock into a single full-width
row. `GALLERY-10`/`GALLERY-11` are set up this way.

### Align (desktop only)

`align` sets *where within its row* an item's span lands on the 12-column
desktop grid — `left` starts at column 1, `right` ends at column 12,
`center` splits the leftover columns evenly. This is deliberately not a tight
masonry pack: leftover columns beside an image are the "intentional
whitespace" sania is known for. Tablet and mobile ignore `align` (span-only,
auto-placed) so nothing lands off-balance on a narrower grid.

**To add a new image:** drop the file into
`portfolio images/logos-art-for-fun/`, add one row to `GALLERY_ITEMS` with its
exact `src`. Nothing else in the file needs to change. The gallery works with
13 images today and is built to grow to ~20 the same way — add rows, don't
touch layout code.

**Missing/renamed file:** the `<img onerror>` handler removes just that one
slot — a bad path never renders a broken-image icon or reserves an empty gap.

## Render behavior (`renderGallery()` in the page's script)

- Filters to `visible:true`, sorts by `order`, builds one `.work-grid` (CSS
  Grid) and appends one `.work-ph > img.work-img-real` per item — no
  pre-built/reserved slots for images that don't exist.
- Each item's `--desktop-col` / `--tablet-col` / `--mobile-col` CSS custom
  properties are computed from its `layout`/`align`/`mobileLayout` and set
  inline; the CSS itself never hard-codes which image goes where or how many
  appear per row.
- CSS Grid's own auto-placement wraps rows from those spans — there's no
  manual row/set bookkeeping, so the layout doesn't break as the image count
  changes between 13, 15, or 20.

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
- **> 900px** — 12-column sticky grid, `align`-based placement, full
  editorial layout.
- **≤ 900px (tablet)** — 8 columns, sticky/offset effect turned off
  (`.work-ph` resets to `position:relative;top:0`), spans only (no `align`).
- **≤ 600px (mobile)** — 2 columns; `mobileLayout` (or its `layout`-derived
  default) decides `full` (both columns) vs `half` (one of two).

At no width are images cropped or force-stretched — the responsive rules only
touch grid placement/position, never the image's own sizing.

## Superseded

Two earlier builds have been replaced by the manifest system above:
1. The original hand-placed 42-slot HTML (`GALLERY-01`…`GALLERY-42` divs with
   `hidden-item`/`hidden-grid` classes and per-image `.g1-1`…`.g16-2` CSS
   position classes).
2. A first manifest pass with a `size` field (`sm`/`md`/`lg`/`xl`) on a
   9-column grid and an automatic "first 7 expressive / rest capped" rule —
   superseded by the `layout`/`align` preset system above, which gives direct
   per-image control instead of an algorithmic zone rule.

If you ever want to reference sania's *exact* 42-image pixel positions again,
they're preserved in git history on this file (pre-manifest revision) —
restore from there, not from memory.
