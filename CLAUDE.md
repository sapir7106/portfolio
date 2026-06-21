# CLAUDE.md — Sapir Levi Portfolio

> Read automatically by Claude Code at the start of every session (locally and
> in cloud sessions at claude.ai/code). This is the project's memory and index.
> Keep it accurate; when something important changes, update it and commit.

---

## 1. What this is

Personal **portfolio website** for **Sapir Levi**, Senior Product Designer
(FinOps / cybersecurity / enterprise AI), based in Tel Aviv. Static site — plain
HTML + CSS + a little vanilla JS. **No build step, no framework, no dependencies.**
Each page is one self-contained `.html` file (its CSS in a `<style>` block, JS in
a `<script>` at the bottom). No shared CSS/JS file — every page carries its own
copy so it can be reasoned about in isolation.

## 2. Companion docs (read the relevant one before working)

| Topic | File |
| --- | --- |
| **Start here / setup / daily workflow / migration** | `START-HERE.md` |
| Writing / building a new case study (voice + structure + rules) | `.claude/skills/new-case-study/SKILL.md` |
| Building tasks on the site + self-documentation protocol | `.claude/skills/site-ops/SKILL.md` |
| Colors, fonts, tokens, components | `docs/DESIGN-SYSTEM.md` |
| Breakpoints & responsive behavior (+ known drift) | `docs/RESPONSIVE.md` |
| The logos/art gallery ("Sapir gallery") — backup | `docs/GALLERY-SAPIR.md` |
| The hidden interview presentation | `docs/PRESENTATION.md` |

**Maintaining these files:** when Sapir says "document this" / "remember this" /
"add to the guide", follow the self-documentation protocol + maintenance map in
the `site-ops` skill — pick the one right file, add a concise entry, and commit.

## 3. File structure

Pages: `index.html` (home / project cards), `about.html` (single entity —
dark + light via a `?mode=` parameter; a separate `about-light.html` is redundant
and should be deleted if present), and six project pages:
`agents.html` (AI agents, PointFive), `dspm.html` (data security, Laminar),
`violation-pane.html`, `retraining-model.html`, `security-dashboard.html`,
`logos-art-for-fun.html` (gallery).

Master template: **`cs-v1.html`** — every case-study page descends from it.

Content (text) files used to populate pages: `main-content.txt`,
`about-content.txt`, `agents-content.txt`, `dspm-content.txt`,
`violation-pane-content.txt`, `logos-art-for-fun-content-draft.txt`.

Folders: `portfolio images/` (a subfolder per project, e.g.
`portfolio images/logos-art-for-fun/GALLERY-01.png`) and
`case-study-presentation/` (the hidden deck — see `docs/PRESENTATION.md`).

Project order is hard-coded in a `PROJECTS` array in every page's `<script>`:
`agents → dspm → violation-pane → retraining-model → security-dashboard →
logos-art-for-fun`. **Adding/removing/reordering a page means updating that array
in every page** (and `projects-order.js` if present). Navigation and Previous/Next
are keyed to the project **name**, not its position.

## 4. CRITICAL working rules (prevents the "I fixed X and broke Y" problem)

1. **Surgical edits only.** Change just the lines that need changing. Never
   rewrite or regenerate a whole HTML file for a small change — the files are
   large (~30KB) with many interdependent pieces.
2. **One focused task per request.** Finish, confirm, then move on. Add
   "don't change anything else" to scoped requests.
3. **Commit after every working change** (each commit = a restore point).
   Review the diff before merging.
4. **Preserve the design system** — reuse existing tokens and component classes;
   no ad-hoc colors/fonts/spacing.
5. When a change risks breaking something else, **warn first**.

## 5. Deployment

- **GitHub:** repo `sapir7106/portfolio` (public), production branch `main`.
- **Cloudflare Pages:** account `Sapir7106@gmail.com`, project `sapirlevi`,
  connected to the GitHub repo. Framework preset **None**, build command **empty**,
  build output directory **empty** (it's a static site).
- Every push/merge to `main` auto-deploys. Recommended: let Claude work on a
  branch → open a PR → review diff → merge → Cloudflare deploys.

## 6. Voice & writing (summary — full version in the skill)

First person "I" (never "Sapir"); "PointFive" only (never "PointFiveNG"/"NG");
**no invented metrics** — honest Reflection + What's next instead; every research
finding cites a real source/stat; gaps left in [square brackets]; each project
ends on one sharp thesis line. Visible content in English; Hebrew only in code
comments. Guiding thesis: *"Good design in complex products isn't about making
things pretty. It's about making hard things feel inevitable."*

## 7. Current status

<!-- KEEP THIS UPDATED — it's how a fresh Claude knows where things stand.
     Ask Claude at the end of a session: "update the Current status section and commit." -->

- **Done:** site structure + all page shells; `cs-v1.html` master template;
  Agents case study content; the hidden Agents interview deck; logos/art gallery
  layout (see version note in `docs/GALLERY-SAPIR.md`).
- **In progress / to verify:**
  - Reconcile the two gallery versions (20-image simplified vs 42-image sania build).
  - Align responsive breakpoints to the standard set (`docs/RESPONSIVE.md`).
  - Confirm `about.html` is a single entity and remove any `about-light.html`.
  - Align sidebar width + purple accent across pages (`docs/DESIGN-SYSTEM.md`).
  - Swap remaining image placeholders for real images.
  - Finish GitHub → Cloudflare connection if not already auto-deploying.
- **Decisions made:** static single-file pages; warm-paper design system; one
  About entity via `?mode=`; nav keyed to project name; no invented metrics.

## 8. Working preferences

Be concise. Show the diff for anything non-trivial before applying. Don't touch
files I didn't ask about. Warn me before risky changes. Hebrew is fine for talking
to me; site content stays English.
