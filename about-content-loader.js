/*
  about-content-loader.js
  ========================
  קורא את about-content.txt וממלא את פאנל ה-About שבעמוד.
  תומך בשני סוגי פאנלים:
    • dark  (index.html)   — מחלקות panel-*
    • light (פרויקטים)     — מחלקות about-*

  סדר טעינה:
    1. about-loader.js          (מזריק מבנה הפאנל מ-about-dark/light.html)
    2. about-content-loader.js  (ממלא טקסט מ-about-content.txt)
*/

(async function () {
  let text;
  try {
    const res = await fetch('about-content.txt');
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
  const fmt = (s) => s == null ? s :
    s.replace(/==(.+?)==/g, '<mark>$1</mark>')
     .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const waitFor = (sel, tries = 60) => new Promise(resolve => {
    const check = () => {
      const el = document.querySelector(sel);
      if (el) return resolve(el);
      if (tries-- <= 0) return resolve(null);
      setTimeout(check, 50);
    };
    check();
  });

  // חכה שהפאנל (כל סוג) יופיע
  await waitFor('.about-quote, .panel-quote');

  // ── QUOTE ──  (.about-quote / .panel-quote ; mark span: .about-hi / .panel-hi)
  const quote = get('Quote');
  if (quote) {
    document.querySelectorAll('.about-quote').forEach(el => {
      el.innerHTML = fmt(quote).replace(/<mark>(.+?)<\/mark>/, '<span class="about-hi">$1</span>');
    });
    document.querySelectorAll('.panel-quote').forEach(el => {
      el.innerHTML = fmt(quote).replace(/<mark>(.+?)<\/mark>/, '<span class="panel-hi">$1</span>');
    });
  }

  // ── BIO ──
  const bios = ['P1','P2','P3','P4'].map(get).filter(Boolean);
  if (bios.length) {
    document.querySelectorAll('.about-body, .panel-body').forEach(body => {
      const ps = body.querySelectorAll('p');
      bios.forEach((txt, i) => { if (ps[i]) ps[i].innerHTML = fmt(txt); });
    });
  }

  // ── EXPERIENCE + EDUCATION ──
  const exps = [];
  for (let i = 1; i <= 9; i++) {
    const c = get('Exp ' + i + ' company');
    if (!c) break;
    exps.push({ c, r: get('Exp ' + i + ' role'), d: get('Exp ' + i + ' date') });
  }
  const edus = [];
  for (let i = 1; i <= 5; i++) {
    const c = get('Edu ' + i + ' company');
    if (!c) break;
    edus.push({ c, r: get('Edu ' + i + ' role'), d: get('Edu ' + i + ' date') });
  }

  const fillList = (ul, items) => {
    const lis = ul.querySelectorAll('li');
    items.forEach((it, i) => {
      const li = lis[i];
      if (!li) return;
      const comp = li.querySelector('.about-company, .panel-company');
      const role = li.querySelector('.about-role, .panel-role');
      const date = li.querySelector('.about-date, .panel-date');
      if (comp) comp.textContent = it.c;
      if (role) role.textContent = it.r || '';
      if (date) date.textContent = it.d || '';
    });
  };

  const lists = document.querySelectorAll('.about-exp-list, .panel-exp-list');
  if (lists.length >= 1 && exps.length) fillList(lists[0], exps);
  if (lists.length >= 2 && edus.length) fillList(lists[1], edus);

  // ── CONTACT ──
  const email = get('Email'), phone = get('Phone');
  const linkedin = get('LinkedIn'), whatsapp = get('WhatsApp'), cv = get('CV');

  document.querySelectorAll('.about-contact-list, .panel-contact-list').forEach(ul => {
    const as = ul.querySelectorAll('a');
    if (as[0] && email) { as[0].textContent = email; as[0].href = 'mailto:' + email; }
    if (as[1] && phone) { as[1].textContent = phone; as[1].href = 'tel:' + phone.replace(/[^+\d]/g,''); }
    if (as[2] && linkedin) { as[2].href = linkedin; }
    if (as[3] && whatsapp) { as[3].href = whatsapp; }
    if (as[4] && cv) { as[4].href = cv; }
  });
})();
