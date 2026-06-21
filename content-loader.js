/*
  content-loader.js  — SAFE TEXT SYNC
  ====================================
  Reads <name>-content.txt and updates ONLY text content on the page.
  Preserves all emphasis structure: <strong>, <mark>, and the
  secret-deck easter-egg link, by re-applying them from explicit
  markers in the txt file.

  Setup: <body data-content="agents-content.txt"> + this script before </body>.

  Emphasis markers understood inside Lede / Paragraph values:
    **bold text**              → <strong>bold text</strong>
    ==highlight==              → <mark>highlight</mark>
    [[link text|URL|class]]    → <a href="URL" class="class">link text</a>
                                 (if the link text also needs a mark,
                                  write [[==autonomous agents==|URL|secret-deck]])
*/

(async function () {
  const file = document.body.dataset.content;
  if (!file) return;

  let text;
  try {
    const res = await fetch(file);
    if (!res.ok) return;
    text = await res.text();
  } catch (e) { return; }

  const lines = text.split('\n');

  const get = (key) => {
    for (const l of lines) {
      const t = l.replace(/^\s+/, '');
      if (t.startsWith(key + ':')) return t.slice(key.length + 1).trim();
    }
    return null;
  };
  const getAll = (key) => lines
    .map(l => l.replace(/^\s+/, ''))
    .filter(l => l.startsWith(key + ':'))
    .map(l => l.slice(key.length + 1).trim());

  // convert inline emphasis markers to HTML
  const fmt = (s) => {
    if (s == null) return s;
    let out = s;
    // links with optional inner mark: [[text|url|class]]
    out = out.replace(/\[\[(.+?)\|(.+?)(?:\|(.+?))?\]\]/g, (m, txt, url, cls) => {
      let inner = txt;
      inner = inner.replace(/==(.+?)==/g, '<mark>$1</mark>');
      inner = inner.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      const c = cls ? ` class="${cls}"` : '';
      return `<a href="${url}"${c}>${inner}</a>`;
    });
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/==(.+?)==/g, '<mark>$1</mark>');
    return out;
  };

  const setText = (sel, val) => {
    if (val == null) return;
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  };
  const setHTML = (sel, val) => {
    if (val == null) return;
    const el = document.querySelector(sel);
    if (el) el.innerHTML = fmt(val);
  };

  // ── HERO ──────────────────────────────────────────
  setText('.eyebrow', get('Eyebrow'));

  const title = get('Title');
  const titleItalic = get('Title italic');
  if (title) {
    const h1 = document.querySelector('.hero h1');
    if (h1) {
      h1.innerHTML = titleItalic
        ? fmt(title) + ' <em>' + titleItalic + '</em>'
        : fmt(title);
    }
  }

  setHTML('.lede', get('Lede'));

  // ── IMPACT QUOTE ──────────────────────────────────
  const quote = get('Quote');
  if (quote) {
    const el = document.querySelector('.impact-quote .inner p, .impact-quote p');
    if (el) el.textContent = quote;
  }

  // ── IMPACT NUMBERS ────────────────────────────────
  let statVals = getAll('Stat value');
  let statLabels = getAll('Stat label');
  if (statVals.length === 0) {
    for (let i = 1; i <= 8; i++) {
      const v = get('Stat ' + i + ' value');
      const l = get('Stat ' + i + ' label');
      if (v) { statVals.push(v); statLabels.push(l || ''); }
    }
  }
  if (statVals.length) {
    const vEls = document.querySelectorAll('.impact-stat .val, .impact-numbers .val');
    const lEls = document.querySelectorAll('.impact-stat .lbl, .impact-numbers .lbl');
    statVals.forEach((v, i) => { if (vEls[i]) vEls[i].textContent = v; });
    statLabels.forEach((l, i) => { if (l && lEls[i]) lEls[i].textContent = l; });
  }

  // ── PROJECT INFO ──────────────────────────────────
  setText('.pi-role', get('Role title'));

  // ── IMG CAPTIONS ──────────────────────────────────
  for (const l of lines) {
    const m = l.match(/^(IMG-\d+) caption:\s*(.+)/);
    if (m) {
      const [, id, cap] = m;
      if (cap.includes('[ריק') || cap.includes('[caption')) continue;
      const ph = document.querySelector('[data-img-id="' + id + '"]');
      if (ph) {
        const fig = ph.closest('figure');
        if (fig) {
          const fc = fig.querySelector('figcaption');
          if (fc) fc.textContent = cap;
        }
      }
    }
  }

  // ── SECTIONS ──────────────────────────────────────
  const blocks = {};
  let cur = null;
  for (const raw of lines) {
    const sm = raw.match(/^SECTION (\d+)/);
    if (sm) { cur = parseInt(sm[1], 10); blocks[cur] = []; continue; }
    if (cur !== null) blocks[cur].push(raw);
  }
  const findSec = (num) =>
    [...document.querySelectorAll('section.col')].find(s => {
      const n = s.querySelector('.num');
      return n && parseInt(n.textContent, 10) === num;
    });

  for (const numStr in blocks) {
    const num = parseInt(numStr, 10);
    const secEl = findSec(num);
    if (!secEl) continue;
    const block = blocks[num].map(x => x.replace(/^\s+/, ''));
    const body = secEl.querySelector('.body');

    // paragraphs
    const paras = [];
    block.forEach(l => {
      const pm = l.match(/^Paragraph(?: \d+)?:\s*(.+)/);
      if (pm) paras.push(pm[1]);
    });
    if (body && paras.length) {
      const ps = body.querySelectorAll('p');
      paras.forEach((txt, i) => { if (ps[i]) ps[i].innerHTML = fmt(txt); });
    }

    // bullets
    const bullets = [];
    block.forEach(l => {
      const bm = l.match(/^Bullet(?: \d+)?:\s*(.+)/);
      if (bm) bullets.push(bm[1]);
    });
    if (bullets.length) {
      const lis = secEl.querySelectorAll('.body ul li');
      bullets.forEach((b, i) => { if (lis[i]) lis[i].innerHTML = fmt(b); });
    }

    // callout
    const cl = block.find(x => x.startsWith('Callout:'));
    if (cl) {
      const cval = cl.slice('Callout:'.length).trim();
      const cEl = secEl.querySelector('.callout p, .callout');
      if (cEl) cEl.textContent = cval;
    }

    // stat band  "Stat 1: 62% · Label"
    const sbStats = [];
    block.forEach(l => {
      const sm = l.match(/^Stat \d+:\s*(.+)/);
      if (sm && !l.match(/^Stat \d+ (value|label):/)) sbStats.push(sm[1]);
    });
    if (sbStats.length) {
      const sbs = secEl.querySelectorAll('.stat-band .sb');
      sbStats.forEach((s, i) => {
        const parts = s.split(' · ');
        if (sbs[i]) {
          const v = sbs[i].querySelector('.v');
          const lb = sbs[i].querySelector('.l');
          if (v && parts[0]) v.textContent = parts[0].trim();
          if (lb && parts[1]) lb.textContent = parts[1].trim();
        }
      });
    }
  }
})();
