# Responsive Rules & Behavior

How the site should behave across screen sizes — and where it currently
**isn't consistent**, so it can be aligned. Sapir suspected drift here; this
documents it.

## Intended behavior

**Desktop (wide):** left sidebar visible, centered content, full layouts,
lightbox enabled, scroll-reveal animations, gallery renders its art-directed
scene compositions with a sticky-cover scroll effect (role-based placement,
each scene sticks and the next covers it — see `docs/GALLERY-SAPIR.md`).

**Tablet:** content reflows to fewer columns; multi-column grids
(`.pinfo`, `.tcols`, `.stat-band`, `.img-row`) collapse toward single column;
the gallery drops both role-based placement and the sticky-cover effect for
simple per-item spans in normal flow.

**Mobile:** sidebar becomes a **horizontal top bar** (~44–50px tall);
`.page` margin-left → 0 with top padding for the bar; About panel goes full
width; lightbox **disabled** (≤600px); the gallery's scenes stack one after
another (2-column or full-width per item via `mobileLayout`); images
constrained so nothing overflows.

## ⚠️ The inconsistency (this is the real issue)

Different pages use different breakpoint values for the *same* transitions:

| Transition | `index.html` | case-study pages | `logos-art-for-fun.html` |
| --- | --- | --- | --- |
| multi-col → fewer cols | `900px` | `900px` | `900px` |
| sidebar → top bar | `600px` | `680px` | `680px` |
| → single column | `600px` | — | `600px` |
| extra mobile fixes | — | — | `500px`, `480px` |

The gallery's scene grids (`.gallery-scene`/`.work-ph`) are aligned to the
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

- **`900px`** — desktop → tablet (grids collapse, gallery role-placement off)
- **`680px`** — sidebar → horizontal top bar
- **`600px`** — → single column; **disable lightbox** below this

Then remove the stray `991px`, `767px`, `500px`, and `480px` rules (fold any
genuinely needed fix into the three breakpoints above). Keep the lightbox-off
rule tied to the same `600px` line everywhere.

## Behavior rules worth keeping

- The hero must always sit **above** the gallery (`.gallery-hero` has
  `z-index:5`) — it never scrolls under a sticky scene.
- On desktop, each gallery scene is `position:sticky` with its own
  increasing `--scene-z`, so scene N+1 deliberately slides over and covers
  scene N as you scroll (sania's own effect). That covering is strictly
  scene-vs-scene — never `position:fixed`, never a negative margin, never a
  manually-authored one-off z-index — and item-level overlap (the one
  layered pair) only ever competes with siblings *inside* the same scene
  (see `docs/GALLERY-SAPIR.md` → Scene flow).
- On tablet/mobile the gallery drops both role-based placement and the
  sticky-cover effect (`position:relative;z-index:auto`) plus `grid-row`/
  `margin` offsets (`!important` overrides) so images stack cleanly with no
  gap and no overlap between scenes.
- Images use `max-width:100%; overflow:hidden` on small screens so a wide grid
  item never causes horizontal scroll.
- Real images replace `.ph` placeholders and set their own natural aspect ratio
  (the placeholder's fixed ratio is dropped once `.ph-img` is present).

> When asked to "fix responsiveness," first align the breakpoints to the
> recommended set above, then test each page at ~1200, 900, 680, 600, and 375px.
