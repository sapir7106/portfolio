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

`.about-grid` uses `grid-template-areas` (not just column tracks), and
this is what controls where Contact (`.about-contact-col`, area
`contact`) and the photo (`.about-photo`, area `photo`) render at each
breakpoint:

- **Desktop (>1200px):** Contact shares the bio column with `.about-bio-col`
  (area `bio` on top, `contact` below), rendering directly under the last
  bio paragraph. The photo occupies its own column alone.
- **Tablet (≤1200px, ≤900px):** the photo sits above `.about-exp-col`
  (Experience/Education), `position:static` (no sticky). Contact keeps its
  own narrow/wrapped column, independent of the photo.
- **Mobile (≤767px):** order is photo, bio, experience/education, contact
  — Contact stays last regardless of where it sits in the DOM, because
  named-area placement ignores source order.

If you add/remove a grid child or move one between areas, every
breakpoint's `grid-template-areas` needs a matching update — leaving a
child's `grid-area` pointing at a name that no longer exists in the
active `grid-template-areas` collapses it into cell (1,1), overlapping
other items (a real Chromium behavior, not just a spec footnote).

## Contact row: no partial wrap

`.about-contact-list` must never break into two uneven lines (e.g. 4
items + 1 orphan). It defaults to a vertical column
(`flex-direction:column`) and only switches to a single-line horizontal
row via a **container query** on `.about-contact-col`
(`container-type: inline-size`):

```css
@container (min-width: 680px) { .about-contact-list { flex-direction: row; flex-wrap: nowrap; } }
```

Because the switch is a single binary condition (column vs. one
`nowrap` row) rather than `flex-wrap:wrap`, there is no state where it
partially wraps — confirmed empirically across the desktop bio column's
full width range. The 680px threshold is tuned to the current five
contact items' natural (no-wrap) width (~658px); if the copy changes
(a longer phone number, a renamed link), re-measure and adjust. The
bio column's grid track max was bumped from 600px to 720px so the row
state is reachable at all — `.about-body` keeps its own independent
`max-width:600px`, so bio's reading width is unaffected.

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
