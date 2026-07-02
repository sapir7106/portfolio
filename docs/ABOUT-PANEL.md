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

## When redesigning the About page

- Edit: `about-panel.html` (markup + content)
- Edit: the relevant CSS section in `about-panel.html` or linked stylesheet
- Update: `docs/ABOUT-PANEL.md` after changes
- Do NOT create `about.html` or `about-light.html`.
