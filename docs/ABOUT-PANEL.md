# About Panel — How it works

## Real mechanism (current)

- Single file: `about-panel.html`
- Theme chosen by: `data-about` attribute on `<body>` (values: `"dark"` or `"light"`)
- Loaded by: `about-loader.js` (slides panel in as overlay)
- Content optionally injected by: `about-content-loader.js`
- NO `?mode=` URL parameter — that design is dead.

## What is stale / misleading

- `index.html` has comment "injected from about-dark.html" — wrong, file doesn't exist.
- `cs-v1.html` has comment "injected from about-light.html" — wrong, file doesn't exist.
- `README.html`, `template-guide.html`, `logos-art-for-fun-template-guide.html` all describe
  the old `?mode=` mechanism — treat them as stale until corrected.
- `CLAUDE.md` §3 describes `about.html` + `?mode=` — also wrong, needs rewriting (Session B).

## Grid layout & Contact placement

`.about-grid` has three named areas — `bio`, `exp`, `photo` — one per
top-level column div (`.about-bio-col`, `.about-exp-col`, `.about-photo`).
Contact (`.about-contact-top`) is **not** a top-level grid child anymore:
it's nested inside `.about-exp-col`, directly above the Experience/
Education timeline (`.about-exp-section`). Because it's a normal DOM
child rather than a grid-area target, it renders in that same spot at
every breakpoint — there's no separate "contact" grid area to keep in
sync.

- **Desktop (>1200px):** `bio exp photo` in one row, 3 columns. Left
  (bio) column is a **fixed** `480px` track (not `minmax(0,480px)`) —
  see "Fixed vs flexible tracks" below for why that matters. Photo has
  its own column, `position:sticky`.
- **Tablet (≤1200px, ≤900px):** grid drops to 2 columns, `bio exp`;
  photo is hidden (`display:none`).
- **Mobile (≤767px):** single column, order is `photo`, `bio`, `exp`
  (photo gets `order:-1`, `position:static`). Contact renders wherever
  `.about-exp-col` renders (after bio), since it's nested inside it —
  it is no longer forced to be the last thing on the page.

If you add/remove a top-level grid child, every breakpoint's
`grid-template-areas` needs a matching update — leaving a child's
`grid-area` pointing at a name that no longer exists in the active
`grid-template-areas` collapses it into cell (1,1), overlapping other
items (a real Chromium behavior, not just a spec footnote). The mobile
rule still has a `contact` name in its area string with nothing
assigned to it (leftover from before Contact moved into `.about-exp-col`)
— that's harmless, since an unused named area just leaves an empty
cell, but don't assign a real element `grid-area: contact` without
adding it back everywhere the name is expected.

## Fixed vs flexible tracks (why it's `480px`/`530px`, not `minmax(0,...)`)

CSS Grid distributes leftover space **equally** among tracks that
haven't hit their own cap yet, not proportionally to each track's max.
With `minmax(0,480px) ... minmax(0,1200px)` for bio/photo, the photo
column's generous 1200px cap meant it kept pulling space away from bio
at ordinary desktop widths (e.g. bio only reached ~420-450px at a
1440px viewport, well under its intended 480px) — taller wrapped text
than expected, contributing to unwanted scroll. Switching bio to a
**plain pixel value** (no `minmax`) makes it a fixed-size track that
always gets exactly that width regardless of how the other columns
compete for space. Keep this in mind before "fixing" it back to a
`minmax(0,...)` form for a future width value.

The bio column is `480px` for the `1201–1439px` desktop tier and
`530px` at `≥1440px` (its own override inside that media query) — two
different fixed values, not one shared variable, so if the width needs
to change, check both.

## Contact list: always one item per line

`.about-contact-list`, its `li`, and its `a` are all `display: block`
(not flex). There's no wrap logic to reason about — block children
always stack one per line, at any width, by construction. Earlier
iterations tried `flex-wrap` and a container-query row/column toggle;
both were removed because a flex row can still wrap unevenly (e.g. 4
items + 1 orphan) at in-between widths. Don't reintroduce flex/inline
display on these three selectors without re-verifying no partial wrap
is possible.

## Explicit `line-height: normal` on Contact/section-title text

`.about-section-title`, `.about-contact-list`, its `li`, and its `a`
all set `line-height: normal` explicitly. This isn't decorative — it's
there because `about-panel.html` is injected into every page, and
different host pages set very different `body` line-heights (e.g.
case-study pages like `agents.html` use `body{line-height:1.72}`,
while `index.html`'s `body` rule doesn't set `line-height` at all). Any
about-panel element that doesn't pin its own `line-height` inherits
whatever the *host page* happens to use, which showed up as light-mode
Contact links rendering visibly taller than the identical dark-mode
ones (measured: ~25.8px vs ~17px per link at the same 15px font-size)
and contributed a few px of otherwise-unexplained scroll on light/
case-study pages specifically. `line-height: normal` breaks that
inheritance and makes the rendered size depend only on the element's
own font, not on which page injected it — the same reasoning already
applied to `.about-body`, `.about-quote`, and `.about-exp-list li`,
which all set their own explicit line-height for the same reason. If
you add a new text element to `about-panel.html`, give it an explicit
`line-height` rather than leaving it to inherit.

## Desktop-only spacing (≥1201px), fits 100vh without forcing it

`@media (min-width: 1201px)` (everything above the ≤1200px tablet
breakpoint) tightens quote/body/contact spacing and shrinks `#about-panel`'s
top/bottom padding specifically so the panel's content fits within
`100vh` at common desktop sizes (1280×800 up to 1920×1080, verified
empirically) without a scrollbar.

`@media (min-width: 1440px)` layers more on top of that tier:
- quote 42px (vs 32px in the 1201–1439px tier)
- body text 17px, with `line-height: 1.55` (tightened from the base
  1.7 specifically to offset the larger font-size and keep the
  no-scroll fit — the 15px/1.7 base combo is otherwise untouched)
- bio column 530px (see "Fixed vs flexible tracks")
- `#about-panel` width formula gets a flat `+ 100px` on top of the
  usual `(100vw - sidebar) * 5/6`
- photo column pulled 24px left (`.about-photo { margin-left: -24px }`)
  to visually halve just the exp↔photo gap (24px instead of the
  grid's normal 48px `column-gap`) without touching the bio↔exp gap.
  This is a deliberate hack: CSS Grid's `column-gap` is a single value
  applied to every column boundary, so there's no native way to give
  one boundary a different gap. A negative margin on the item after
  the gap is the standard workaround — it eats into empty gutter
  space, not into either column's actual content box.

Neither media query touches `overflow` on `#about-panel` — it stays
`overflow-y: auto` (set in the base rule) at every breakpoint, so a
genuinely short viewport (e.g. a non-maximized ~800px-tall window at
1440px wide) still scrolls a few px instead of clipping content. Don't
reach for `overflow: hidden` here — it was tried before and explicitly
rejected because it blocks legitimate scrolling on short windows.

## Arrow glyphs

Contact links use `↗` / `→` followed by the text-presentation variation
selector (`&#xFE0E;` / U+FE0E) so mobile browsers render them as plain
text glyphs instead of colorful emoji. Keep the selector on any new
arrow glyph added to `about-panel.html`.

## When redesigning the About page

- Edit: `about-panel.html` (markup + content)
- Edit: the relevant CSS section in `about-panel.html` or linked stylesheet
- Update: `docs/ABOUT-PANEL.md` after changes
- Do NOT create `about.html` or `about-light.html`.
