# Gallery — `logos-art-for-fun.html` ("the Sapir gallery")

The logos / art-for-fun gallery is a scattered, overlapping **sticky** grid
(images gently overlap as you scroll) inspired by the live layout of
[sania.io](https://www.sania.io/). It is **manifest-driven**: the gallery is
built at runtime by JS from a small data array (`GALLERY_ITEMS`), not from
hand-placed HTML per image. Sania's original 42-image, 16-set composition is
kept only as a *pattern reference* (documented below) — it is not rendered
1:1, and the page never requires 42 real images to work.

> **Source of truth = `GALLERY_ITEMS` inside `logos-art-for-fun.html`**
> (in the page's own `<script>`, near the top). Everything about what's on
> the page — which images, in what order, how big, visible or not — lives in
> that one array.

## The manifest

```js
const GALLERY_ITEMS = [
  { id:'GALLERY-01', file:'GALLERY-01.jpg', alt:'…', visible:true, order:1, size:'xl' },
  // ...
];
```

- **`file`** — the exact filename **including extension**, case-sensitive
  (Cloudflare Pages serves a case-sensitive filesystem). This is the *only*
  place an extension is written — swapping `.png` → `.jpg`/`.gif`/`.webp` is a
  one-line change here, nothing else in the page needs to know.
- **`visible`** — `true`/`false`. Hide an image by flipping this to `false`;
  show it by flipping back to `true`. Don't delete the file.
- **`order`** — plain integer, sets render order. Reorder by editing numbers,
  never by renaming files or moving HTML.
- **`size`** — `sm` / `md` / `lg` / `xl` (2/3/4/5 of 9 grid columns). Controls
  how much horizontal space an image gets — it never crops or stretches the
  image itself (images always render at `width:100%;height:auto`, natural
  aspect ratio, no `object-fit:cover`).

**To add a new image:** drop the file into
`portfolio images/logos-art-for-fun/`, add one row to `GALLERY_ITEMS` with its
exact filename. Nothing else in the file needs to change. The gallery already
works with 13 images and is built to grow to ~20 the same way.

**Missing/renamed file:** the `<img onerror>` handler removes just that one
slot — a bad filename never renders a broken-image icon or reserves an empty
gap.

## Render behavior (`renderGallery()` in the page's script)

- Filters to `visible:true`, sorts by `order`, builds one `.work-grid` (CSS
  Grid, 9 columns desktop) and appends one `.work-ph > img.work-img-real` per
  item — no pre-built/reserved slots for images that don't exist.
- **First 7 visible images ("expressive zone")** get varied `align-self`
  (start/end/center) for editorial rhythm/whitespace, on top of their `size`
  span — this is the part of the sania reference that reads best, so it's
  applied first.
- **From the 8th visible image on ("calm zone")** — `size` is capped at `lg`
  (span 4) even if the manifest says `xl`/`full`, so nothing goes
  fullscreen-ish in the middle of the page the way parts of the 42-image
  sania reference do. Alignment stays default (`start`), rhythm comes from
  natural image proportions only.
- CSS Grid's own auto-placement wraps rows — there's no manual row/set
  bookkeeping, so the layout doesn't break as the image count changes between
  13, 15, or 20.

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
- **> 900px** — 9-column sticky grid, full editorial layout.
- **≤ 900px** — 2 columns, sticky/offset effect turned off (`.work-ph` resets
  to `position:relative;top:0`), natural stacking.
- **≤ 600px** — single column.

At no width are images cropped or force-stretched — the reset rules only
touch grid placement/position, never the image's own sizing.

## Superseded

The old hand-placed 42-slot HTML (`GALLERY-01`…`GALLERY-42` divs with
`hidden-item`/`hidden-grid` classes and per-image `.g1-1`…`.g16-2` CSS
position classes) has been replaced by the manifest system above. If you ever
want to reference sania's *exact* 42-image pixel positions again, they're
preserved in git history on this file (pre-manifest revision) and in the
project's commit log — restore from there, not from memory.
