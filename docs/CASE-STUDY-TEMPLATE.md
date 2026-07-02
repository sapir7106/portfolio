# Case Study Template — Source of Truth

> Governs new pages built from `cs-v1.html`.
> Do NOT retrofit existing pages (`agents.html`, `dspm.html`, `violation-pane.html`,
> `retraining-model.html`, `security-dashboard.html`) onto cs-v1 without explicit instruction.
> Any migration must happen in a separate refactor branch after QA.

## Intro structure

- Paragraph 1: company/product context only.
- Paragraph 2: what I led, the core problem, the key design move.
- Optional thesis line after — same font-size as body, not a second headline.
- No "Case Snapshot" block. Keep opening minimal and editorial.

## Intro layout

- Intro container: `max-width:700px; width:100%`
- Do NOT use fixed `width:700px`.
- Left-aligned.

## Intro typography

- Intro paragraphs: 17px at ≤1440px (via `@media (min-width:768px) and (max-width:1440px)`).
- Thesis quote: same size as intro paragraphs. Subtle styling (italic/color/weight) OK.
- Do not force 700px on small screens. Do not change mobile unless asked.

## Metadata card rules

- MY ROLE / TOOLS / TEAM is metadata only. No long strategic sentences.
- Remove "1" before singular roles. Keep numbers only when >1 person.
  - ✓ Product Manager / 4 Engineers / CPO
  - ✗ 1 Product Manager / 4 Engineers / 1 CPO

## First hero image

- No `.rv` class or scroll-reveal on first hero image wrapper.
- Add `data-reveal="false"` to the wrapper div.
- Real `<img>` must have `loading="eager"` `fetchpriority="high"`.
- Later images keep `.rv` and `loading="lazy"`.

## Lightbox

- Desktop only. Disabled at ≤600px.
- Per-container gallery grouping (each section/row = its own gallery).
- First hero image may open in lightbox.

## Accessibility

- Meaningful alt text. Use `figure` + `figcaption`.
- No content requiring animation to become visible.

## Performance

- Static output only. No heavy runtime JS.

## cs-v1.html vs. real pages — known drift (as of this audit)

- `cs-v1.html` is currently BEHIND production. Use `agents.html` as reference until
  cs-v1 is patched (tracked in Session B).
- Missing in cs-v1: cursor component, 768–1440px breakpoint, `max-width:700px` intro.
