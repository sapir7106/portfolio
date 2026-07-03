# Gallery Page Backup — `logos-art-for-fun.html` ("the Sapir gallery")

This is the preservation record for the logos / art-for-fun gallery page. The
scattered, overlapping **sticky** grid (images "slide" over each other as you
scroll) was originally reverse-engineered **1:1 from the live CSS of
[sania.io](https://www.sania.io/)** — but it's now **your own layout: the
"Sapir gallery."** Extracting the exact composition took real effort; this file
is the backup so it's never lost, and so you can one day grow it back to the full
42 images without redoing the research.

> **Source of truth = the committed HTML file in the repo.** This doc captures
> the spec, the rationale, and the mechanics. The exact per-image pixel positions
> live inside the built `logos-art-for-fun.html`. Keep that file in git and this
> work is safe.

## ⚠️ Two versions exist — reconcile before working

There are two different builds of this page. Confirm which one is current before
editing:

- **A — full build (42 images):** 9-column grid, **16 sets / 42 image slots**,
  exact pixel positions (e.g. `top:-640px`, `-432px`), with a **hide/show
  mechanism** (`hidden-item` / `hidden-grid`) so only the first 10 show and 11–42
  stay reserved. Responsive: `991px` → 6 cols, `767px` → 1 col.
- **B — simplified build (the file currently in this repo):** 9-column grid but
  only **8 sets / 20 placeholders** (GALLERY-01…20), `rem`-based positions
  (`top:-6rem` etc.), **no** hide/show mechanism, no `<img>` tags yet.
  Responsive: `900/680/600/500/480`.

If you ever want the rich 42-image gallery with reserved slots, build A is the
one to restore. (See `RESPONSIVE.md` for the breakpoint cleanup either way.)

## The grid spec (exact)

```css
.s-work{ position:relative; width:100%; z-index:1 }
.gallery-hero{ position:relative; z-index:5; background:var(--bg) } /* stays above */
.work-grid{
  display:grid;
  grid-template-columns:repeat(9,1fr);
  gap:12px;
  max-width:1984px;
  margin:0 auto;
  padding:0 12px 120px;
}
.work-img,.work-ph{ width:100%; display:block; position:sticky; top:0; border-radius:3px }
.work-img{ height:auto; object-fit:cover }
.work-ph{ aspect-ratio:4/3; /* placeholder box, monospace ID label */ }
```

Each image gets its own rule with `grid-column`, `grid-row`, a (often negative)
`top` in px for the sticky offset, and sometimes `margin-top`/`margin-bottom`/
`align-self`. Some items deliberately **bleed** past the right edge using
implicit columns (e.g. `grid-column:8/12` on a 9-col grid) — that overflow is
intentional.

**Set sizes (build A), 16 sets totaling 42 images:**
`[5, 4, 1, 3, 3, 2, 2, 3, 3, 3, 2, 3, 2, 1, 3, 2]`

Example position rules (format: column, row, top, margin-top, margin-bottom,
padding-bottom, align-self) — illustrative fragment of the real table:
```
set: 1 image  → grid-column 4/8, grid-row 1/2, top 0
set: 3 images → (span9, span1, top -384px, mb 64px) · (1/5, 3/4) · (3/10, 2/3)
set: 2 images → (span7, span1, top -96px, mb 320px) · (4/10, 2/3)
```
The full table lives in the built file; restore positions from there, not from memory.

## Hide / show mechanism (build A)

- Hide a single image by adding class **`hidden-item`** (CSS:
  `.work-ph.hidden-item,.work-img.hidden-item{display:none}`).
- If **every** image in a set is hidden, its wrapping `.work-grid` also gets
  **`hidden-grid`** so it doesn't leave an empty gap.
- To **show** a reserved image (e.g. GALLERY-15): remove `hidden-item` from it,
  and if its set was fully hidden, also remove `hidden-grid` from that set's
  `.work-grid`. (Just say "show me GALLERY-15" and Claude handles both.)
- To **hide** a shown image: reverse — add `hidden-item`, plus `hidden-grid` if
  the whole set becomes hidden.

## Images & content

- Files live in **`portfolio images/logos-art-for-fun/`**, named
  `GALLERY-01.png` … `GALLERY-42.png`.
- Replacing an image = save a new file with the same name (auto-replaces).
- **Two content layers** per item (from `logos-art-for-fun-content-draft.txt`):
  1. **SHORT** — a short caption shown in the grid.
  2. **DETAIL** — a title + paragraph shown in the lightbox on click.
- Some items group several images (e.g. 2–3 versions of one logo) under one caption.
- Known items: Shenkar Student Union emblem (eagle/wings), a custom Hebrew
  logotype, a chocolate-store logo + seal, "La Petite Mort" wordmark, a nuts/seeds
  line-icon set, plus illustrations (windy day, butterfly, rabbit, Wix). The
  illustration captions are your real text — keep them; some logo captions were
  professional best-guesses to verify.

## Responsive (build A — exact)

```css
@media(max-width:991px){ /* tablet */
  .work-grid{ grid-template-columns:repeat(6,1fr); padding:0 12px 64px }
  /* every item: span 6, grid-row auto, top 0, position relative, margins 0, align-self auto !important */
}
@media(max-width:767px){ /* mobile */
  .work-grid{ grid-template-columns:1fr; gap:8px; padding:0 0 48px }
  /* every item: grid-column 1/-1 !important */
}
```
(Per `RESPONSIVE.md`, consider aligning these to the site standard `900/600`.)
