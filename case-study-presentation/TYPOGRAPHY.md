# Deck Typography System
## agents-deck.html — Standing Rules

---

## Body Text — Two Sizes

### Medium (default — most slides)
```css
.text-md { font-size: clamp(17px, 1.16cqw, 22px); line-height: 1.55; }
```
- 17px at regular desktop (stage ~1465px)
- Scales to 22px on large screens (stage >1900px)
- Applied to: global p, .lede, ul.clean li, and most running text

### Small (dense/compact slides)
```css
.text-sm { font-size: clamp(15px, 1.3cqw, 18px); line-height: 1.5; }
```
- Applied to specific elements on:
  - "From problem to system" — all running text
  - "PointFive was going AI-native" — inside .values only
  - "From agent management to agent oversight" — inside .two-panels only

---

## How cqw works in this deck
The .stage container = 100vw × 100vh (fullscreen).
At 1465px viewport: 1cqw = 14.65px
At 597px viewport:  1cqw = 5.97px
Formula: target_px / stage_px * 100 = cqw value
Example: 17px at 1465px → 17/14.65 = 1.16cqw

---

## Exclusions — Never change these
- h1, h2 (slide titles)
- .eyebrow, .sec-label, .col-label, .confirmed-label (section labels)
- .tag (monospace source labels — always var(--mono), always small)
- .note (footnote text — intentionally muted/small)
- .cryt, .emph (quote styles — styled separately)
- .pnum, .ptension (Design tensions slide — scoped rules)
- Any element using font-family: var(--serif)
- Navigation, buttons, rail

---

## Scoped overrides (intentionally different)
- .pr p → clamp(13px, 1.05cqw, 15px) — Five Principles card body (smaller by design)
- .pr h4 → clamp(14px, 1.2cqw, 17px) — Five Principles card titles
- .partner p → clamp(17px, 1.75cqw, 22px) — Who I worked with (LAYOUT-A right col)
- .val .w → clamp(18px, 1.8cqw, 20px) — Brand values card titles
- .val .s → clamp(14px, .95cqw, 16px) — Brand values sub-labels

---

## Stage width reference
Measured values:
- Regular desktop: 1465px
- Small screen: 597px

To remeasure: open deck in Chrome DevTools Console and run:
```js
document.querySelector('.stage').getBoundingClientRect().width
```

---

## Layout patterns
- LAYOUT-A: h2 left column, content right column (grid 1fr 1fr, align-items:center)
- LAYOUT-B: eyebrow + h2 top, content below in flex-mid (flex-direction:column, justify:center)
- LAYOUT-C: full-bleed image (.shot-full, flex:1, object-fit:contain)

---

## Key CSS variables
- --serif: Playfair Display — titles and quotes only
- --sans: Montserrat — all body text and UI
- --mono: monospace — tags, labels, eyebrows
- --hi: #BADA55 — green accent (borders, highlights)
- --accent: #8067F2 — purple accent (tags, icons, mark)
- --ink: #17160F — true black (body text)
- --ink-soft: #3A382E — soft black (secondary body)
- --muted: #8C897C — muted text (captions, labels)
- --line: #E3E0D6 — borders and dividers
- --panel: #FBFAF7 — card backgrounds
