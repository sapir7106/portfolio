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

## How to open it (entry + gate)

- **Entry point (easter egg):** in `agents.html`, the words **"autonomous
  agents"** are a hidden clickable link (styled as a normal `<mark>`, no hover
  change) that opens the deck.
- **Password gate:** the deck opens on a password screen. Password is **`2849`**.
  Once entered it's stored in `sessionStorage` so it won't re-prompt that session.
  - The placeholder text is `55555`; typing `55555` triggers a cheeky
    "You wish ;)" message.
  - Gate title: *"Well, well, well… looks like you found my secret corner of the
    internet"* (with a line break after the "…").
  - Input + button: radius **4px**, no arrow inside the button, Montserrat font.

> 🔒 **Security note:** this is a *client-side* password — it lives in the deck's
> JavaScript, which is readable by anyone who views source. Because the GitHub
> repo is **public**, the password is effectively already visible there. Treat
> the gate as light obscurity, not real security. If you ever need it truly
> private, make the repo private or move the deck out of the public repo.

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
