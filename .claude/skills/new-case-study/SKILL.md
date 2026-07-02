---
name: new-case-study
description: >
  Use this skill whenever Sapir wants to create a NEW case-study page for her
  portfolio, draft or rewrite copy for an existing case study, or check that a
  page matches her established voice and structure. Triggers include: "new case
  study", "build a project page", "write the copy for X", "make this sound like
  my other pages", "add a project". This skill encodes her writing voice, the
  exact section structure of her case-study template (cs-v1.html), and her
  non-negotiable writing rules. Always read DESIGN-SYSTEM.md alongside this when
  building the actual page so the styling matches.
---

# Writing a new case study — Sapir Levi

> Before starting: read `docs/CASE-STUDY-TEMPLATE.md` — it is the source of truth.

Sapir's portfolio case studies all descend from one master template,
**`cs-v1.html`**. Every project page reuses its CSS and structure so the whole
site stays coherent. This skill is about getting the **copy and structure**
right; pair it with `docs/DESIGN-SYSTEM.md` for the visual layer.

> The literal source of truth for markup is **`cs-v1.html`**. To build a new
> page, copy `cs-v1.html`, rename it, fill the sections below, and add it to the
> `PROJECTS` array in every page's `<script>`.

## The voice (this is the most important part)

Sapir designs clarity into complex products — FinOps, cybersecurity, enterprise
AI. Her writing must embody that same clarity. The guiding thesis from her About
page: *"Good design in complex products isn't about making things pretty. It's
about making hard things feel inevitable."*

How that voice reads on the page:

- **First person, always "I" — never "Sapir", never third person.**
- **Calm, confident, evidence-led.** No marketing gloss, no hype adjectives.
  Show the thinking, not the polish.
- **Process over outcome.** The interesting part is *which pain, which value,
  which evidence* — the questions she asked, the directions she weighed, why she
  chose one. Example of the register: *"I started where I always do — from the
  product's values and the screen as it existed — and asked where the values
  broke. I didn't invent the solutions — I built them on research."*
- **Each project ends on a sharp thesis line** — one sentence that stays with
  the reader. Real examples she's used:
  - "Autonomy is a technical output. Trust is a design output."
  - "Trust is a design problem, not a data problem. Operators didn't need more
    numbers — they needed to see the agent think."
  - "Whoever defines the system isn't replaced by it — they're the reason it works."

## Hard writing rules (never break these)

1. **"PointFive" only.** Never "PointFiveNG", never "NG".
2. **No invented metrics. Ever.** If there's no real, verifiable result, do NOT
   fabricate adoption numbers, percentages, or quotes. Instead write an honest
   **Reflection** + a **What's next** section. A case study can be "a starting
   point, not a finish line" and that's a strength, not a weakness.
3. **Every research finding is traceable to a real source** with a real link
   (e.g. NN/g, IBM, Gartner, Baymard, McKinsey, SurveyMonkey). Cite the actual
   statistic on the card (e.g. "NN/g — 63%", "Microsoft — 47%").
4. **Leave honest placeholders in [square brackets]** for anything that needs a
   real screen, a real quote, or a real number she must supply — never silently
   fill a factual gap with invention.
5. Keep visible content in **English**; Hebrew is fine in code comments only.

## Section structure (the editorial template)

Numbered sections (`01`–`0N`) with small uppercase `sec-label`, a serif `h2`,
and a big lime `sec-num`. Standard flow, adapt as the project needs:

| # | Section | What goes in it |
| --- | --- | --- |
| 01 | **Project Info / Context** | Role, Tools, Team, Timeline (`.pinfo` grid). Then the framing: often **the product's brand values as the lens** she designed against (e.g. PointFive's: Efficiency · Depth · Creativity · Bias to action · Trust). "Where did the values break?" |
| 02 | **The Problem** | The real pains, grouped meaningfully (e.g. by stage: Before / During / After). For each pain: **pain → ideas I considered → the solution + a mockup**. This is the heart of the page. |
| 03 | **Research** | The competitive scan + the studies. Real products reviewed, real studies, and a short set of **principles** distilled from them, each backed by a cited stat. |
| 04 | **Concepts / Directions** | The directions explored, with the **chosen direction** marked and justified. |
| 05 | **Final / The Solution** | The resolved design with real screens. |
| 06 | **Reflection + What's next** | Honest learnings, a `takeaway`/`thesis` line, and concrete next steps (deeper flows, validation, edge & empty states). Use instead of fake results. |

Supporting blocks available in the template: `.callout` (lime-bar pull quote),
`.impact-numbers` OR `.impact-quote` (one per page), `.img-row.c2`/`.c3`,
`.img-stack`, `.tcols`, `.stat-band`, lightbox figures, and the footer
`Previous / Next` nav.

## Checklist before a page is "done"

- [ ] Copied from `cs-v1.html`, renamed, added to the `PROJECTS` array in **every** page
- [ ] First person throughout; "PointFive" spelled correctly
- [ ] No invented metrics; gaps marked in [brackets]
- [ ] Every stat has a real source + link
- [ ] One sharp closing thesis line
- [ ] Styling matches `docs/DESIGN-SYSTEM.md`; responsive per `docs/RESPONSIVE.md`
- [ ] Intro: 2 paragraphs (context → led/problem/move) + optional thesis at same size
- [ ] Metadata card: no "1" before singular roles
- [ ] First hero: no `.rv` class, `data-reveal="false"`, `loading="eager"` `fetchpriority="high"`
- [ ] Verified against `docs/CASE-STUDY-TEMPLATE.md` (not just `cs-v1.html`)
- [ ] Update the "Current status" section in `CLAUDE.md`, then commit
