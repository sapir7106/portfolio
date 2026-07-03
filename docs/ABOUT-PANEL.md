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

## Right column layout (desktop)

`.about-grid` uses `grid-template-areas` (not just column tracks) so the
profile photo (`.about-photo`, area `photo`) and the Contact section
(`.about-contact-col`, area `contact`) share one grid column, stacked
photo-on-top on desktop (>1200px). Tablet (≤1200px) and mobile (≤767px)
redefine `grid-template-areas` per breakpoint to keep their original
layouts (Contact as its own column on tablet, photo-first single-column
stack on mobile). If you add/remove a grid child, every breakpoint's
`grid-template-areas` needs a matching update — leaving a child's
`grid-area` pointing at a name that no longer exists in the active
`grid-template-areas` collapses it into cell (1,1), overlapping other
items (a real Chromium behavior, not just a spec footnote).

## When redesigning the About page

- Edit: `about-panel.html` (markup + content)
- Edit: the relevant CSS section in `about-panel.html` or linked stylesheet
- Update: `docs/ABOUT-PANEL.md` after changes
- Do NOT create `about.html` or `about-light.html`.
