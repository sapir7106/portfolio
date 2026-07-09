# 404 Tetris Page

## 1. Overview

- `404.html` is the site's custom 404 (page not found) page: a full-screen,
  playable Tetris game rendered behind the "Page not found" message.
- Lives at the **project root**, next to `index.html` — `/404.html`.
- It is fully **standalone**: all HTML, CSS (`<style>` in `<head>`), and JS
  (single `<script>` before `</body>`) live in this one file, matching the
  site's "no build step, no shared CSS/JS" convention (see root `CLAUDE.md`).
  The only external dependency is the Google Fonts stylesheet link (Playfair
  Display + Montserrat).
- Experience: on load, the "SAPIR'S PROTFOLIO" wordmark and "Page not found"
  title animate in letter-by-letter, a Tetris board fills the background and
  starts falling automatically, and a HUD (score/level/timer/pause) tracks
  the game. The board never truly "game overs" — it silently auto-resets when
  a new piece can't spawn.
- Used as Cloudflare Pages' static 404 page — served automatically for any
  unmatched route since it sits at the project root.

## 2. Main structure

| Piece | Element | Notes |
| --- | --- | --- |
| Page wrapper | `<main class="page">` | Full-viewport flex column, clips overflow |
| Wordmark | `.wordmark` div, `"SAPIR'S PROTFOLIO"` | `aria-hidden`, non-interactive, sized by `fitWordmark()` |
| Tetris canvas | `<canvas class="tetris-canvas" id="tetrisCanvas">` | Fixed, full-viewport, `z-index: 0` (bottom layer) |
| Board boundary layer | `.board-boundaries` div | Fixed vertical guide lines marking board left/right edges, `z-index: 1` |
| Content article | `<article class="content">` | Centered column, `z-index: 2`, holds title + button |
| "Page not found" title | `<h1 class="page-title">` | Letter-animated on load |
| Back to home button | `<a class="btn">` | See §3 |
| HUD | `<div class="hud" role="status">` | `z-index: 4` (topmost), top-right desktop / top-center mobile |
| Score / level / timer | `#hudScore`, `#hudLevel`, `#hudTimer` spans | Plain text, updated by `updateHUD()` |
| Pause / resume button | `<button class="hud-pause" id="pauseToggle">` | Toggles `isPaused`, changes label + icon |

## 3. Back to home link

- The button is:
  ```html
  <a class="btn" href="https://sapirlevi.pages.dev/">
    <span class="btn-label">Back to home →</span>
  </a>
  ```
- **`https://sapirlevi.pages.dev/` is the intended destination.** If the live
  domain ever changes, update this `href` — it is the single place to edit.
- Do not replace it with a relative `"/"` unless you are intentionally
  changing the navigation behavior (e.g. reverting to relative in-site
  navigation instead of the fixed production URL).

## 4. Visual system

- **Background:** `--bg: #F7F1E9` (warm off-white / cream).
- **Text colors:**
  - Title/wordmark/button ink: `--ink: #0B080D` (near-black).
  - Page title specifically: `#3c3427` (warm dark brown, hard-coded on
    `.page-title`, not tied to `--ink`).
- **HUD colors:**
  - Score/level/timer text: `--hud-ink: #7e756a` (muted warm gray).
  - Pause/resume button default: `#0B080D` (black).
- **Pause hover color:** `#8067f2` (purple) — text color and underline
  (`.hud-pause::after`) both switch to this on hover/focus.
- **Tetris palette** (`PALETTE` in JS, 7 colors, weighted selection via
  `COLOR_WEIGHTS`): `#0B080D, #333333, #555555, #777777, #999999, #C4B8A5, #A89F8F`
  — `#0B080D` (black) is weighted lowest (`1` vs `2`–`3`) so it appears sparingly.
- **Block opacity:** Tetris blocks render at `globalAlpha = 0.6` (60%) inside
  `render()`, reset to `1` immediately after so nothing else on the page is
  affected.
- **Board boundary color:** `#E1D8CD` (light warm gray), 1px left/right
  borders on `.board-boundaries`.
- **Fonts:**
  - Wordmark: `'Playfair Display', Georgia, serif`, weight 700.
  - Page title: `'Avenir', 'Montserrat', sans-serif`, weight 400 (comment
    references "Canela Light" as the original design intent, but the CSS
    rule uses Avenir/Montserrat).
  - Button: `'Avenir', 'Montserrat', sans-serif`, weight 400.
  - HUD (score/level/timer): `Avenir, "Avenir Next", "Helvetica Neue", Arial, sans-serif`, weight 400.
  - Pause/resume button: `'Avenir', 'Montserrat', sans-serif`, weight 500.

## 5. Tetris behavior

- **Board geometry:** fixed `COLS = 12`, `ROWS = 20`. `CELL_SIZE` is computed
  on every resize (see `resizeBoard()`), driven primarily by viewport height
  (`floor(H / ROWS)`), capped by viewport width so the board never overflows
  horizontally.
- **Responsive sizing:** `SIDE_PADDING = 16px` keeps breathing room on narrow
  viewports; `GAP` (the cream gap between cells) scales with cell size
  (`8%` of cell, min 2px).
- **Tetromino shapes:** standard 7 pieces (I, O, T, S, Z, J, L) in `SHAPES`.
  Colors are chosen independently of shape via weighted `randomColor()`.
- **Opacity:** all blocks (locked grid + active piece) draw at 60% opacity.
- **Movement controls:** `ArrowLeft` / `ArrowRight` shift one column.
- **Rotation controls:** `ArrowUp` or `Space` rotate clockwise (`rotateCW`,
  no wall-kicks). Space and ArrowUp behave identically.
- **Soft drop:** `ArrowDown` moves the active piece down exactly one row per
  keypress (not continuous); if it can't move down, it locks immediately.
- **No hard drop:** there is no key bound to instantly drop a piece to the
  floor — this is intentional per the in-code comment block.
- **Line-clear flash:** a completed row enters a flash phase
  (`isClearing`/`clearingRows`) before being removed — see `CLEAR_FLASH_DURATION`
  (300ms) and `FLASH_COLOR` (`#D4C8B8`). Gravity pauses during the flash.
- **Score behavior:** `+100` per cleared row, applied in `finishLineClear()`.
  Level never changes (`hudLevel` is hard-coded to `"[ Lvl 1 ]"`).
- **Timer behavior:** counts up in `MM:SS` (`elapsed` seconds), never resets
  except on auto-reset; does not affect gravity speed.
- **Game-over/top-out auto-reset:** when a newly spawned piece immediately
  collides, `resetGame()` runs silently — no overlay, no "Game Over" text,
  no message. Score, timer, and grid all reset and a new piece spawns.

## 6. Pause / Resume behavior

- Clicking `#pauseToggle` toggles `isPaused`.
- **Paused:** the render loop keeps drawing the current frame (`render()`
  still runs every `requestAnimationFrame`), but gravity, timer, and
  line-clear flash all stop advancing — the loop returns early in `loop()`
  before touching any game state.
- **Resumed:** `lastTS` is reset to `null` on resume so the next frame's
  delta-time (`dt`) doesn't spike from the paused duration.
- **Keyboard while paused:** the `keydown` handler still calls
  `preventDefault()` for game keys (so the page never scrolls), but all
  gameplay actions are skipped (`if (!active || isPaused || ...) return;`).
- **Button label/icon:** toggles between `"⏸ Pause"` (`aria-label="Pause game"`)
  and `"▶ Resume"` (`aria-label="Resume game"`).

## 7. Responsive behavior

- **Desktop (≥1200px):** HUD sits top-right (`--hud-top` / `--hud-right`);
  `updateHudPlacement()` always removes the `hud-below-wordmark` class and
  clears `--wordmark-bottom` at this width, regardless of prior state.
- **1200px breakpoint:** this is the hard cutoff in JS (`updateHudPlacement`)
  for HUD placement, separate from the CSS `@media (max-width: 1199px)` rule
  that zeroes the HUD's top padding and applies the stacked/centered layout
  when the `hud-below-wordmark` class is present.
- **Mobile (<768px):** `.page-title` font-size switches from
  `--title-size-desk` (5vw) to `--title-size-mob` (12vw) via
  `@media (max-width: 767px)`.
- **HUD placement rules:** below 1200px, JS adds `body.hud-below-wordmark`,
  which the CSS rule uses to move the HUD to `left: 50%`, centered, positioned
  `52px` below the wordmark's measured bottom edge (`--wordmark-bottom`, set
  live by `updateHudPlacement()`).
- **Wordmark no-overlap rules:** `fitWordmark()` targets ~90% of viewport
  width (`TARGET_VW = 0.90`), but at ≥1200px it measures the HUD's actual
  bounding rect and shrinks the wordmark's target width so it can never grow
  underneath the HUD (32px safe gap). Hard-capped at `MAX_WORDMARK_PX = 130`px
  regardless of viewport.
- **Board boundary behavior:** `.board-boundaries` left/width are pure CSS
  custom properties (`--board-x`, `--board-width`) written by `resizeBoard()`
  on every resize, so the guide lines always track the actual board edges.
- **Mobile-safe Tetris board sizing:** `resizeBoard()`'s `maxCellByWidth`
  calculation (width minus `SIDE_PADDING * 2`, divided by `COLS`) is what
  keeps the 12-column board from overflowing narrow/portrait viewports; the
  smaller of the height-driven and width-driven cell size always wins.

## 8. Key CSS variables / tuning points

All under `:root` in the `<style>` block — safe to edit directly:

- `--wordmark-size`, `--wordmark-spacing` — wordmark sizing (note: actual
  rendered size is overridden live by `fitWordmark()` JS; these are fallback/
  initial values only).
- `--title-size-desk`, `--title-size-mob`, `--title-weight` — title typography.
- `--btn-size`, `.btn` padding (`10px 16px`) — button sizing/padding.
- `--hud-top`, `--hud-right`, `--hud-gap` — HUD spacing/placement (desktop).
- `.hud-pause:hover` color (`#8067f2`) and `.hud-pause::after` — pause button
  hover styling.
- `.board-boundaries` `border-left`/`border-right` color (`#E1D8CD`) — board
  boundary color.
- `ctx.globalAlpha = 0.6` in `render()` (JS, not a CSS var) — Tetris opacity.
- `DROP_INTERVAL` (JS, 750ms) — drop interval / gravity speed.
- `CLEAR_FLASH_DURATION` (JS, 300ms) — line-clear flash duration.
- `COLOR_WEIGHTS` / `COLOR_TOTAL` (JS) — color weights for the palette.

Note: `--gravity-ms` and `--soft-drop-ms` exist in `:root` but are **not
read anywhere in the JS** — the actual gravity timing is controlled by the
JS constant `DROP_INTERVAL`. Treat the CSS variables as stale/decorative
unless you wire them up.

## 9. Key JS functions

- `resizeBoard()` — recomputes `CELL_SIZE`, `GAP`, `boardX`/`boardY` from the
  current viewport, resizes the canvas (with DPR scaling), and pushes
  `--board-x`/`--board-width` to CSS for the boundary lines.
- `fitWordmark()` — measures the wordmark text with an offscreen ghost span
  and sets its font-size so it fills ~90% of viewport width, capped to avoid
  colliding with the HUD at ≥1200px and hard-capped at 130px.
- `updateHudPlacement()` — decides HUD position: always top-right at
  ≥1200px; below the wordmark (centered) at narrower widths, publishing
  `--wordmark-bottom` for the CSS to consume.
- `resetGame()` — silent full reset (grid, score, timer, clear state), then
  spawns the next piece. Called on top-out and by `resizeBoard()` if cell
  geometry changes mid-game.
- `spawn()` — creates a new random piece via `randomPiece()`; if it
  immediately collides, calls `resetGame()`.
- `render()` — clears the canvas and draws locked grid cells + the active
  piece at 60% opacity, including the line-clear flash blink.
- `loop(ts)` — the `requestAnimationFrame` game loop: advances the timer,
  handles the line-clear flash phase, advances gravity, calls `render()`,
  and re-queues itself. Returns early (post-render) when paused.
- `startLineClear()` — scans for full rows; if any exist, starts the flash
  phase (`isClearing = true`) instead of clearing immediately.
- `finishLineClear()` — runs after the flash duration: removes cleared rows,
  adds score, resets flash state, and spawns the next piece.
- Pause/resume handler — the `elPause` click listener toggling `isPaused`
  and updating the button label/icon/aria-label.
- Keyboard handler — the `keydown` listener implementing move/rotate/soft-drop,
  always calling `preventDefault()` for game keys, and no-opping during pause
  or when no piece is active.

## 10. Safe edit guide

- **Wordmark text:** edit the text inside `.wordmark` in the HTML (`SAPIR'S
  PROTFOLIO`, intentionally spelled this way) — also update the matching
  string literal in `fitWordmark()`'s ghost measurement (`ghost.textContent`)
  so sizing stays accurate.
- **Fonts:** change the `font-family` values in the relevant CSS rule (see §4
  for which rule maps to which element); update the Google Fonts `<link>` in
  `<head>` if introducing a new typeface.
- **Colors:** edit the `:root` CSS variables (`--bg`, `--ink`, `--hud-ink`)
  for global colors, or the specific hard-coded values noted in §4 (e.g.
  `.page-title` color, pause hover color, `PALETTE` array) for their scoped
  elements.
- **Button text:** edit the text inside `.btn-label`.
- **Back to home href:** edit the `href` on `.btn` — see §3.
- **Pause button styling:** edit `.hud-pause`, `.hud-pause:hover`, and
  `.hud-pause::after` rules.
- **Tetris speed:** change `DROP_INTERVAL` (ms) in the JS tuning block.
- **Tetris opacity:** change the `0.6` literal passed to `ctx.globalAlpha` in
  `render()`.
- **Board boundary lines:** change the `border-left`/`border-right` color on
  `.board-boundaries`, or `SIDE_PADDING` in `resizeBoard()` for spacing.
- **HUD placement:** adjust `--hud-top`/`--hud-right` (desktop) or the `52px`
  offset literal inside `updateHudPlacement()` / the `hud-below-wordmark`
  CSS rule (mobile/tablet).

## 11. Do-not-break notes

- **Canvas DPR scaling** in `resizeBoard()` — the `ctx.scale(dpr, dpr)` call
  must run every time `canvas.width`/`height` are reassigned (resetting those
  properties clears the transform); removing it will blur or misalign the
  board on high-DPI screens.
- **Board geometry calculations** — `CELL_SIZE`, `boardX`, `boardWidth` are
  derived together; changing one formula without the others will desync the
  canvas board from the `.board-boundaries` guide lines.
- **Keyboard `preventDefault()` behavior** — game keys must stay prevented by
  default even while paused/inactive, or arrow keys/space will scroll the
  page instead of doing nothing.
- **Pause state handling** — `isPaused` gates gravity/timer/line-clear in
  `loop()` but must still allow `render()` to run every frame; breaking this
  either freezes the visible canvas oddly or lets the game continue while
  "paused."
- **Resize recalculation** — `resizeBoard()` calls `resetGame()` if cell
  geometry changes mid-game (to avoid an invalid grid/board mismatch); don't
  remove this guard without handling stale grid dimensions some other way.
- **Line-clear state** — `isClearing`/`clearingRows`/`clearAcc` must all be
  reset together (in `finishLineClear()` and `resetGame()`); partial resets
  can leave the board stuck mid-flash.
- **Board boundary CSS variables** (`--board-x`, `--board-width`) — these are
  written only by JS; don't hard-code them in CSS or the guide lines will
  drift from the actual board on resize.
- **Timer/game loop relationship** — the timer accumulates via the same `dt`
  used for gravity inside `loop()`; don't move timer updates outside the loop
  or it will desync from pause state.
- **Back to home href** — don't change away from
  `https://sapirlevi.pages.dev/` unless intentionally changing the
  destination (see §3).

## 12. QA checklist

- [ ] `404.html` opens standalone (no console errors, no missing assets).
- [ ] Tetris starts automatically on load.
- [ ] `Space` / `ArrowUp` rotate the active piece.
- [ ] `ArrowDown` soft-drops one row per keypress.
- [ ] Pause freezes timer and gameplay (canvas still renders the frozen frame).
- [ ] Resume continues gameplay and timer without a time jump.
- [ ] HUD does not overlap the wordmark at any viewport width.
- [ ] HUD behaves correctly above/below the 1200px breakpoint (top-right vs.
      centered below wordmark).
- [ ] Mobile layout does not break (title wraps to 12vw, board still fits
      within the viewport width).
- [ ] Line clear flashes before the row(s) disappear.
- [ ] Board boundary lines align with the visible Tetris board edges.
- [ ] Back to home link points to `https://sapirlevi.pages.dev/`.
- [ ] Back to home link navigates correctly when clicked.
