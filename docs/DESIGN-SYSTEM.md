# Design System — Sapir Levi Portfolio

The visual language shared across every page. When building or editing anything,
reuse these tokens and components — never introduce ad-hoc colors, fonts, or
spacing. (Pair this with `RESPONSIVE.md` for breakpoints and `new-case-study`
skill for copy.)

Aesthetic in one line: **warm-paper editorial** — calm, serif-led, generous
whitespace, a faint paper-grain texture, used sparingly with two accent colors.

## Fonts

- **Display / headings:** `Playfair Display` (serif). Use italic (`<em>`) for
  emphasis inside headlines.
- **Body / UI:** `Montserrat` (fallback `Avenir`), weight **300** by default.
- **Mono (presentation deck only):** `Space Mono`.

Google Fonts link used site-wide:
`Playfair+Display:ital,wght@0,400;0,700;1,400` + `Montserrat:wght@300;400;500;600`.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#F7F6F1` | warm paper background |
| `--bg2` | `#FBFAF7` | lighter panel background |
| `--ink` | `#17160F` | primary text |
| `--soft` / `--ink-soft` | `#3A382E` | secondary text |
| `--muted` | `#8C897C` | labels, captions, de-emphasized text |
| `--line` | `#E3E0D6` | borders, dividers |
| `--hi` (lime) | `#BADA55` | numbers, bullets, highlight `mark`, callout bars |
| purple accent | `#8067F2` | links, hover states |
| sidebar | `#242323` | dark sidebar |

Highlight pattern: `<mark>` and `.highlight-lime` use the lime at low opacity
behind text (`rgba(186,218,85,.42)`), with a 2px radius.

## Layout

- Fixed **left sidebar** with vertical "About" button (opens a slide-in panel)
  and a "Back to my projects" link at the bottom. Collapses to a horizontal top
  bar on mobile.
- Centered content. Reading column `--col: 720px`; wide content `--wide: 1080px`.
- Faint SVG fractal-noise texture over the whole background (`body::before`).

## Core components (class names)

`.sidebar` · `.about-panel` + `.about-overlay` (slide-in, light mode) ·
`.hero` / `.gallery-hero` (eyebrow + serif `h1` + `.lede`) · `.pinfo`/`.pi`
(project-info grid) · numbered sections (`.sec-label`, `.sec-head`, `.num`,
`h2`) · `.body` text blocks · image blocks (`.img-mt`, `.img-row.c2`/`.c3`,
`.img-stack`, `.ph` placeholder → `.ph-img` real image) · `.callout` (lime-bar
quote) · `.impact-numbers` OR `.impact-quote` (one per page) · `.stat-band` ·
`.tcols` · `.lightbox` (desktop click-to-zoom, off below 600px) · sticky gallery
grid (`.s-work`/`.work-grid`, see `GALLERY-SAPIR.md`) · footer `Previous/Next`
nav driven by the `PROJECTS` array · `.rv → .in` scroll-reveal.

Keyboard: **`L`** toggles placeholder ID labels; **`Esc`** closes panel/lightbox.

## Home (index.html) signature copy

Hero: *"Hey, I'm Sapir Levi."* +
*"Lead Product Designer based in Tel Aviv 〰〰 Creative and tech-obsessed in
equal measure. I love taking messy, complex products (FinOps, security, AI) and
**making them feel simple**. I build from the ground up: the design systems
underneath the screens, and the AI agents people actually trust."*
(The 〰 wave chars are animated; "making them feel simple" is lime-highlighted.)

## ⚠️ Known inconsistencies to align (clean these up)

These crept in across versions. Pick ONE value for each and apply site-wide:

1. **Sidebar width** — `index.html` uses `68px`/`70px`; `logos-art-for-fun.html`
   uses `71px` (`--sw:71px`). **Pick one** (suggest `71px`) everywhere.
2. **Purple accent** — appears as `#8067F2` (links/hover, About) AND `#C4B5F5`
   (`--lavender` on the home cards). Decide whether these are intentionally two
   shades or should be unified.
3. **Breakpoints** — differ between pages; see `RESPONSIVE.md` for the full list
   and the recommended standard set.
4. **About page** — the real mechanism is **one** `about-panel.html` (dark + light
   via the `data-about` attribute on `<body>`, loaded by `about-loader.js`). There
   is no `about.html` and no `?mode=` parameter — that design is dead. See
   `docs/ABOUT-PANEL.md` for the full mechanism and which files still describe the
   old, stale version.

## Typography scale

- **Display / H1:** Playfair Display, 700, used for page titles and hero headings.
- **Section H2:** Playfair Display, 700, `clamp(28px, 3.6vw, 44px)`.
- **Body / running text:** Montserrat, 300–400, 17px at ≤1440px.
- **Labels / eyebrows:** Montserrat, 500–600, 11px, letter-spacing `.2em`, uppercase.
- **Monospace / tags:** system monospace, 11–13px.

## Custom cursor

- Files: `cursor.js`, `cursor.css`, element `#custom-cursor`.
- Active on: all case study pages + `index.html`.
- Disabled below: 1024px viewport width.
- Hover states on: links, buttons, figures.
- Do NOT remove without updating all pages simultaneously.

## Content-loader system

- Files: `content-loader.js`, `about-content-loader.js`.
- Purpose: injects copy from `*-content.txt` files into HTML placeholders.
- Markup syntax in `.txt` files:
  - `**text**` → `<strong>`
  - `==text==` → `<mark>`
  - `[[label|url|class]]` → `<a>`
- Used by: case study pages that have a matching `*-content.txt` file.
- Note: writers editing `*-content.txt` must use this syntax, not raw HTML.

## `projects-order.js` — important clarification

- Controls: home page card **ORDER only**.
- Does NOT control: Previous/Next nav inside case study pages.
- Previous/Next nav: each page has its own inline `const PROJECTS = [...]` array.
- To reorder Previous/Next: edit each case study page's inline array manually.
- The file's own comment "THE ONLY FILE YOU EDIT" is misleading — flag it.
