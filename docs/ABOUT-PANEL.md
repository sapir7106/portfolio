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
`contact`) renders at each breakpoint:

- **Desktop (>1200px):** Contact shares the bio column with `.about-bio-col`
  (area `bio` on top, `contact` below), rendering directly under the last
  bio paragraph as a horizontal row (`.about-contact-list` is `flex` there).
  The photo (`.about-photo`, area `photo`) occupies its own column alone.
- **Tablet (≤1200px, ≤900px):** Contact reverts to its own narrow column
  (vertical list, `display:block` override), unrelated to the photo (which
  is already hidden by then).
- **Mobile (≤767px):** order is photo, bio, experience/education, contact
  — Contact stays last regardless of where it sits in the DOM, because
  named-area placement ignores source order.

If you add/remove a grid child or move one between areas, every
breakpoint's `grid-template-areas` needs a matching update — leaving a
child's `grid-area` pointing at a name that no longer exists in the
active `grid-template-areas` collapses it into cell (1,1), overlapping
other items (a real Chromium behavior, not just a spec footnote).

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
