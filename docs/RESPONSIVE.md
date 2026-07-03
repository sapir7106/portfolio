# Responsive Rules & Behavior

How the site should behave across screen sizes — and where it currently
**isn't consistent**, so it can be aligned. Sapir suspected drift here; this
documents it.

## Intended behavior

**Desktop (wide):** left sidebar visible, centered content, full layouts,
lightbox enabled, scroll-reveal animations, sticky gallery effects active.

**Tablet:** content reflows to fewer columns; multi-column grids
(`.pinfo`, `.tcols`, `.stat-band`, `.img-row`) collapse toward single column;
gallery sticky positioning is neutralized.

**Mobile:** sidebar becomes a **horizontal top bar** (~44–50px tall);
`.page` margin-left → 0 with top padding for the bar; About panel goes full
width; lightbox **disabled** (≤600px); gallery becomes a single column with
sticky/negative-top removed; images constrained so nothing overflows.

## ⚠️ The inconsistency (this is the real issue)

Different pages use different breakpoint values for the *same* transitions:

| Transition | `index.html` | case-study pages | `logos-art-for-fun.html` |
| --- | --- | --- | --- |
| multi-col → fewer cols | `900px` | `900px` | `900px` |
| sidebar → top bar | `600px` | `680px` | `680px` |
| → single column | `600px` | — | `600px` |
| extra mobile fixes | — | — | `500px`, `480px` |

The gallery's sticky grid (`.work-grid`/`.work-ph`) is now aligned to the
standard `900/600` set (done — see `docs/GALLERY-SAPIR.md`). The remaining
drift is the sidebar-to-topbar switch firing at `600px` on the home page but
`680px` elsewhere, and the page's own extra `500px`/`480px` fixes (hero-shot,
impact numbers, `.img-row.c3`) which aren't part of the gallery grid itself.

> Case study intro typography rules → see `docs/CASE-STUDY-TEMPLATE.md` (source of truth).
> Summary: 17px at 768–1440px via `@media(min-width:768px) and (max-width:1440px)`.
> This is a FIFTH breakpoint tier not yet in the "recommended standard set" below —
> add it when doing the mobile responsiveness cleanup.

## Recommended standard (apply everywhere)

Pick one set and use it on every page:

- **`900px`** — desktop → tablet (grids collapse, gallery sticky off)
- **`680px`** — sidebar → horizontal top bar
- **`600px`** — → single column; **disable lightbox** below this

Then remove the stray `991px`, `767px`, `500px`, and `480px` rules (fold any
genuinely needed fix into the three breakpoints above). Keep the lightbox-off
rule tied to the same `600px` line everywhere.

## Behavior rules worth keeping

- The hero must always sit **above** the gallery (`.gallery-hero` has
  `z-index:5`) so sticky images with negative `top` never cover it.
- On mobile the gallery drops `position:sticky`, negative `top`, and all
  `margin-top`/`grid-row` offsets (`!important` overrides) so images stack cleanly.
- Images use `max-width:100%; overflow:hidden` on small screens so a wide grid
  item never causes horizontal scroll.
- Real images replace `.ph` placeholders and set their own natural aspect ratio
  (the placeholder's fixed ratio is dropped once `.ph-img` is present).

> When asked to "fix responsiveness," first align the breakpoints to the
> recommended set above, then test each page at ~1200, 900, 680, 600, and 375px.
