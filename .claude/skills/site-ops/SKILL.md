---
name: site-ops
description: >
  Use this skill for ANY hands-on work on Sapir's portfolio site that isn't
  writing case-study copy: adding or reordering a project page, swapping or
  hiding/showing images, editing the gallery, fixing layout or responsiveness,
  touching the About panel or the hidden presentation, or general "how do I do X
  on my site" questions. ALSO use it whenever Sapir asks to record or maintain
  knowledge — phrases like "document this", "add this to the guide", "remember
  this", "update the memory/notes", "make a guide from this", or "keep this for
  next time". This skill is the operations playbook AND the self-documentation
  protocol. (For writing case-study text, use the `new-case-study` skill instead.)
---

# Working on the site — operations & self-documentation

This skill has two jobs: **(1)** show how to do the common build tasks on Sapir's
portfolio, and **(2)** keep the project's memory files up to date automatically
when she asks. Always honor the CRITICAL working rules in `CLAUDE.md` (surgical
edits, one task at a time, commit after each working change, preserve the design
system, warn before risky changes).

---

## PART 1 — How to build things (task playbook)

Before any task, read the relevant doc(s): `docs/DESIGN-SYSTEM.md` for visuals,
`docs/RESPONSIVE.md` for breakpoints, `docs/GALLERY-SAPIR.md` for the gallery,
`docs/PRESENTATION.md` for the deck, and the `new-case-study` skill for copy.

**Add a new project page**

⚠️ SCOPE RULE: Do NOT connect existing pages to cs-v1.html without explicit instruction.
cs-v1.html is currently BEHIND production — use agents.html as reference instead.
Any full migration must be a separate branch + QA pass.

1. Copy `cs-v1.html` → rename it (e.g. `new-project.html`).
2. Fill the content using the `new-case-study` skill (voice + structure + rules).
3. Add the new filename to the `PROJECTS` array **in every page's `<script>`**
   (and `projects-order.js` if present) — this is what wires Previous/Next.
4. Put images in `portfolio images/<project-name>/`.
5. Update `CLAUDE.md` → file structure + Current status. Commit.

**Reorder or remove a project** → edit the `PROJECTS` array in every page. Nav is
keyed to the project **name**, not its position, so moving a card never breaks
links. Update `CLAUDE.md` if a page is added/removed.

> `projects-order.js` controls home page card order ONLY.
> Previous/Next nav = edit each page's own inline `PROJECTS` array.

**Swap a real image in (case-study pages)** → find the `.ph` placeholder by
its ID (e.g. `id="IMG-01"`), replace the `<div class="ph">` with an `<img>`
(or add `.ph-img` inside a content `.ph`).

**The logos/art gallery (`logos-art-for-fun.html`) is different** — it's
manifest-driven, not hand-placed HTML. See `docs/GALLERY-SAPIR.md`. To
add/reorder/resize/hide/show an image, edit the `GALLERY_ITEMS` array in that
page's own `<script>` (fields: `file`, `order`, `size`, `visible`) — don't
touch the DOM or add position classes. "Hide GALLERY-12" = set its `visible`
to `false` in that array; "show GALLERY-15" = set it back to `true`.

**Edit page copy** → make a targeted `str_replace` on the exact text. Don't
rewrite the whole file. Keep the voice rules from `new-case-study`.

**Fix layout / responsiveness** → align breakpoints to the standard set in
`docs/RESPONSIVE.md` (`900 / 680 / 600`), then test at ~1200, 900, 680, 600, 375px.

**About panel / hidden deck** → see `docs/DESIGN-SYSTEM.md` and
`docs/PRESENTATION.md` respectively before touching them.

---

## PART 2 — Self-documentation protocol (how the docs feed themselves)

When Sapir says any of: **"document this" · "add this to the guide" · "remember
this" · "update the memory" · "make a guide from this" · "keep this for next
time"** — do this:

1. Identify what kind of knowledge it is.
2. Use the **maintenance map** below to pick the ONE right file.
3. Add it concisely in that file's existing style (a short entry, not a wall of
   text). If it's a decision, also note it in `CLAUDE.md` → "Decisions made".
4. If it changes project state (done / in-progress / a new page), also update
   `CLAUDE.md` → "Current status".
5. Commit with a clear message (e.g. `docs: note new accent color rule`).
6. Tell Sapir in one line which file you updated and what you added.

### The maintenance map — when to update which file

| When the change is about… | Update this file |
| --- | --- |
| Colors, fonts, spacing, tokens, a component's look | `docs/DESIGN-SYSTEM.md` |
| Breakpoints / how things behave on tablet & mobile | `docs/RESPONSIVE.md` |
| The gallery layout, hide/show, or the 42-image build | `docs/GALLERY-SAPIR.md` |
| The hidden presentation (slides, password, easter egg) | `docs/PRESENTATION.md` |
| Writing voice, rules, or case-study section structure | `.claude/skills/new-case-study/SKILL.md` |
| How to do a build task, or this doc-update process itself | `.claude/skills/site-ops/SKILL.md` (this file) |
| The setup or working steps Sapir follows | `START-HERE.md` |
| Project state, file list, deploy settings, a decision | `CLAUDE.md` |
| Case study template rules (when they change) | `docs/CASE-STUDY-TEMPLATE.md` |
| The About panel (after any redesign) | `docs/ABOUT-PANEL.md` |

> Sapir does NOT need to memorize this map. She just says "document this" and you
> pick the right file. The map exists so the choice is consistent and explainable.

### When she says "create a guide from this"
Make a new short `.md` in `docs/`, give it a clear name, add a one-line pointer to
it in `CLAUDE.md` → "Companion docs", and commit. Don't duplicate content that
already lives in another doc — link to it instead.
