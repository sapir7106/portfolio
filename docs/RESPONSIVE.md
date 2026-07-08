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

## ⚠️ The inconsistency (partially resolved — verify before assuming stale)

The sidebar → top-bar switch has since been **unified to `1024px`** (with the
desktop side-nav rule keyed to `min-width:1025px`) on `index.html` and all six
project pages (`agents.html`, `dspm.html`, `violation-pane.html`,
`retraining-model.html`, `security-dashboard.html`, `logos-art-for-fun.html`)
— this replaced the old `600px`/`680px` split described in earlier drafts of
this doc. Don't reintroduce `600px`/`680px` for that transition. On case-study
pages this same `1024px` breakpoint also moves the hero image above the
eyebrow/intro in content flow (`.hero-shot{order:-1}`); `logos-art-for-fun.html`
has no equivalent hero-reorder rule since it isn't a case-study-template page.

`900px` (multi-col → fewer cols, grids collapse) is still consistent across
`index.html` and the case-study pages.

`logos-art-for-fun.html` still runs its **own separate breakpoint set**
inherited from the "sania-exact" gallery build, layered on top of the shared
`1024px`/`1025px` sidebar rule:

| Transition | `logos-art-for-fun.html` |
| --- | --- |
| sidebar → top bar (shared with rest of site) | `1024px` / `1025px` |
| footer padding step 1 | `1024px` |
| footer padding step 2 | `991px` |
| footer padding + copy size ("Sania's exact values") | `767px` |
| footer padding ("Sania's exact values") | `479px` |

So the gallery page's footer/layout fine-tuning still has its own `991/767/479`
tier system distinct from the `900px` grid-collapse breakpoint used elsewhere —
that's the remaining piece of drift, not the sidebar switch (which is now
unified).

> Case study intro typography rules → see `docs/CASE-STUDY-TEMPLATE.md` (source of truth).
> Summary: 17px at 768–1440px via `@media(min-width:768px) and (max-width:1440px)`.
> This is a FIFTH breakpoint tier not yet in the "recommended standard set" below —
> add it when doing the mobile responsiveness cleanup.

## Recommended standard (apply everywhere)

The site now already uses this pair consistently for the sidebar switch — keep
it that way, and use it as the target when cleaning up the gallery's remaining
tiers:

- **`900px`** — desktop → tablet (grids collapse, gallery sticky off)
- **`1024px` / `1025px`** — sidebar ↔ horizontal top bar (mobile ≤1024px,
  desktop side-nav ≥1025px) — already unified across `index.html` and all six
  project pages
- Below **`600px`**, disable the lightbox on the gallery page (verify current
  cutoff in `logos-art-for-fun.html` before changing it — don't assume `600px`
  is already wired up there).

Then fold the gallery's stray `991px`, `767px`, and `479px` footer rules into
the `900px`/`1024px` tiers above where a genuinely equivalent fix exists.

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
