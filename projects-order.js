/* ============================================================
   PROJECT ORDER  —  THE ONLY FILE YOU EDIT TO REORDER
   ============================================================
   This single list controls EVERYTHING about project order:

     1. The order of the cards on the home page (index.html)
     2. The order of the  Previous / Next  buttons inside
        every case-study page
     3. Which project is "Card 1" — the first card, top-left —
        which NEVER shows a "Previous work" button
        (it's the start of the flow; visitors only move forward)

   ── HOW TO REORDER ──────────────────────────────────────────
   Just rearrange the lines below. Save. Done.
   You do NOT touch index.html or any project page.

     - The FIRST line  = Card 1 (top-left, no "Previous" button)
     - The order here  = left-to-right, top-to-bottom on the grid

   Example — to make DSPM the first card:
   move 'dspm.html' to the top of the list. Everything else
   shifts automatically, and DSPM loses its "Previous" button
   while agents (now second) gains one.

   ── HOW TO ADD A NEW PROJECT (e.g. in 2 years) ──────────────
   1. Duplicate cs-v1.html, rename it (e.g. 'new-project.html'),
      and fill in its content.
   2. In index.html, copy one existing <a class="card"> block,
      paste it inside the grid, and update its:
         href="new-project.html"
         data-name="new-project"      <- must match the filename
         card-title / card-sub text
   3. In index.html <style>, add one image line:
         .card[data-name="new-project"] .card-img
            { background-image: url('portfolio%20images/Main-images/YOUR-IMAGE.png'); }
   4. Add 'new-project.html' to THIS list, in the position you want.
      Want it to be Card 1? Put it at the very top — every other
      card shifts right, and the new project becomes the start of
      the flow automatically (no "Previous" button).

   ── HOW TO REMOVE A PROJECT ─────────────────────────────────
   Delete its line here, and delete its <a class="card"> block
   from index.html.

   ── IMPORTANT ───────────────────────────────────────────────
   - Each entry is the project's HTML filename, in quotes,
     followed by a comma.
   - The LAST entry has no comma after it.
   - Keep the square brackets [ ] and the word window.PROJECTS.
   ============================================================ */

window.PROJECTS = [
  'agents.html',             // Card 1  - start of flow (no "Previous work")
  'dspm.html',               // Card 2
  'violation-pane.html',     // Card 3
  'retraining-model.html',   // Card 4
  'security-dashboard.html', // Card 5
  'logos-art-for-fun.html'   // Card 6  (last entry - no comma)
];
