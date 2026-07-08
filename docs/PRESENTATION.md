# The Hidden Interview Presentation

A separate, password-gated slide deck hidden inside the portfolio. Sapir uses it
**live in job interviews** to walk through the Agents case study out loud. It is
deliberately not linked from the public navigation.

## Why this is its own doc (Sapir asked)

Keeping it separate from the general portfolio docs is the right call because:
1. It's a **distinct artifact with its own mechanics** (entry point, password
   gate, embedded concept files, image-loading quirks) that shouldn't be buried
   in page docs.
2. It serves a **different medium** — a *spoken* interview, not a *read* page —
   so its content is paced and phrased differently from the case-study page,
   even though the substance overlaps.
3. It will be **iterated on separately** ("I'll want to improve the deck"), so a
   focused doc keeps that work clean.

## Where it lives

Folder **`case-study-presentation/`** containing:
- `agents-deck.html` — the deck itself (navigable HTML slides, 16:10)
- `agents-deck-script.txt` — the speaking script
- `Concept-01.html`, `Concept-02.html`, `Concept-03.html` — the 3 concept
  screens, **embedded into the deck via iframes**
- `presentation-images/IMG-03.png` — the user-flow diagram drop-in

## How to open it (entry + gate) — current server-side mechanism

The old client-side/sessionStorage password gate, including the old easter-egg
link, is **gone**. Both the deck and the Agents case study are now protected
server-side by Cloudflare Pages Functions, with real secrets (not readable via
view-source).

- In `agents.html`, the words **"autonomous agents"** in the H1 remain a
  hidden clickable link (styled as a normal `<mark>`, no hover change) to the
  deck route, but there is **no public nav link** to it — it's an
  interview-only tool.
- **Route protection (`functions/_middleware.js`):** requests to
  `/agents`, `/agents/`, `/agents.html` (and `/portfolio%20images/agents/*`)
  require a valid `agents_auth` cookie or get redirected to `/agents-locked`.
  Requests to `/case-study-presentation/agents-deck` (and its trailing-slash /
  `.html` variants, plus everything under
  `/case-study-presentation/agents-deck/`) require a valid `pres_auth` cookie
  or get redirected to `/presentation-locked`. Visiting `/agents-locked` or
  `/presentation-locked` while already authenticated redirects forward to the
  real page.
- **Login endpoints:**
  - `functions/api/agents-login.js` checks the submitted password against the
    `AGENTS_CASE_PASSWORD` secret, then issues an HMAC-signed (SHA-256,
    `AGENTS_COOKIE_SECRET`) `agents_auth` cookie — `HttpOnly`, `Secure`,
    `SameSite=Lax`, `Max-Age=604800` (~7 days).
  - `functions/api/presentation-login.js` does the same against
    `PRESENTATION_PASSWORD` / `PRESENTATION_COOKIE_SECRET`, issuing a
    `pres_auth` cookie with `Max-Age=43200` (~12 hours). Completely separate
    password/secret/cookie pair from the Agents flow.
  - The cookie payload is `{ area, iat }`, base64url-encoded and HMAC-signed;
    `_middleware.js` re-verifies the signature and checks `iat` against the
    same max-age on every protected request.
- **Lock screens:** `agents-locked.html` (title "Sapir Levi | Agents Case
  Study Access") and `presentation-locked.html` (title "Sapir Levi | Private
  Presentation Access") are the public-facing login forms, both
  `noindex, noarchive`. Each has a password-visibility eye toggle that swaps
  the eye/eye-slash icon without shifting layout or clearing the input —
  Agents' eye is black by default, purple (`#8067F2`) on hover; the
  presentation's eye is white by default, green on hover. The `55555`
  placeholder is a tease only: submitting it (on either screen) shows
  "You wish ;)" instead of logging in — it must never be prefilled as a real
  working value.
- The deck's own page (`case-study-presentation/agents-deck.html`, title
  "Sapir Levi | Agents Presentation") is `noindex, noarchive` too.

> 🔒 **Secrets:** required env vars are `AGENTS_CASE_PASSWORD`,
> `AGENTS_COOKIE_SECRET`, `PRESENTATION_PASSWORD`, `PRESENTATION_COOKIE_SECRET`.
> Configure all four in **both** the Cloudflare Pages Preview and Production
> environments — Production secrets must exist before merging any auth change
> to `main`, or the live site will 500 on login. Cookie secrets are random
> strings (don't need to be memorized/typed by Sapir); access passwords are
> stored safely by Sapir, never committed. `.env`, `.env.*`, and `.dev.vars`
> are gitignored — never put secrets in HTML/JS/comments/screenshots/git.

## Image-loading caveat

`<img src>` images (like `IMG-03.png`) **do not load when the file is opened
directly via `file://` in Chrome** — they only appear over `http`
(Cloudflare or a localhost server). After deploying to Cloudflare the image
shows. If it still doesn't: confirm the filename is exactly `IMG-03.png`
(capitals) and that `presentation-images/` sits inside `case-study-presentation/`.

## Structure & content

The deck **mirrors the structure of the older DSPM case-study deck** (the
3-year-old original), repopulated with the current **Agents** content. On-slide
text is in **English** (her case-study voice); speaker notes are in **Hebrew**.
Same warm-paper theme (`--accent:#8067F2`, `--hi:#BADA55`, Playfair + Montserrat
+ Space Mono); mockup status colors `--ok:#3F9D5A --pend:#C9772B --run:#2F6BD8
--err:#C2453B`.

Slide flow (≈15–20 min interview pacing):
01 Cover · 02 The starting point (PointFive going AI-native; the brand-values
lens) · Research (FinOps competitors: Vantage, Finout, ProsperOps, nOps,
CloudZero + the key gap) · The 4 pains (buried decisions, blast radius, doesn't
scale, someone else's agent) · Challenges/goals · The 5 trust principles (each
with a real cited stat) · Concepts → **Direction 03** (decisions at list-level,
goal-first descriptions, variable autonomy; elements: overview strip, decisions
banner, filter bar, scope badge, status pill, decision badge, Decisions Hub,
chat-as-sidebar) · Solution detail (snooze, hand off, email, share) ·
Reflection + What's next (incl. FinOps X 2026 validation).

The five brand values used as the lens: **Efficiency · Depth · Creativity ·
Bias to action · Trust.**

## Standing CSS conventions — agents-deck.html only

These rules apply **to the presentation deck (`agents-deck.html`) only**.
Do NOT assume them for the portfolio site pages (`index.html`, `agents.html`, etc.).

1. **Running text size** — `p`, `.lede`, and `ul.clean li` use `clamp(17px, <cqw>, 24px)`.
   Never below 17px (readable at any stage size), never above 24px (no runaway large-screen growth).
2. **h2 bottom margin** — always `margin-bottom:24px`, including inside `.slide.concept h2`.
3. **Running text color** — `p`, `.lede`, `ul.clean li` use `color:var(--ink)` (`#17160F`, true black).
   Muted / secondary text (eyebrows, captions, `.desc`, `.note`, `.step .d`, etc.) keeps `var(--muted)` or `var(--ink-soft)` — do not change those.
4. **Quotes (`.pcell .cryt`, `.emph`)** — sans-serif (`var(--sans)`), not serif; not italic; weight 500;
   `font-size:clamp(17px, <cqw>, 24px)`; `line-height:1.4`; `color:var(--ink)`;
   left accent bar `border-left:3px solid #BADA55`; `padding-left:14px`; `border-radius:0`.
5. **Concept "click to open ↗" hint (`.chint`)** — hidden by default (`display:none`).
   Shown only when the user presses **L** (which adds `body.labels`), consistent with dev image
   labels (`.shot-id`). The click-to-open *behaviour* (iframe / zoom) is unaffected.

## When improving the deck

- Keep the writing rules from the `new-case-study` skill (first person,
  "PointFive", no invented metrics, real sources).
- If realigning to the *exact* DSPM flow, the DSPM source is a Figma file
  (`fileKey PSCU0ha9a2AT9jcXmdGYkD`) that needs edit access or screenshots to map.
- After renaming any deck file, check `agents-deck-script.txt` and the easter-egg
  link in `agents.html` for stale references.
