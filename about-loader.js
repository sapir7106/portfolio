/*
  about-loader.js — טוען את about-panel.html (קובץ יחיד) ומגדיר נושא
  =====================================================================
  קורא data-about מ-<body> כדי לקבוע את הנושא של הפאנל:
    <body data-about="dark">   → data-theme="dark"  (דף הבית - מצב כהה)
    כל ערך אחר / לא מוגדר     → data-theme="light" (דפי פרויקטים)

  הפאנל עצמו מגיע מ-about-panel.html (מאסטר יחיד לשני המצבים).
*/

(async function () {
  console.log('[about-loader] v3 starting, data-about =', document.body.dataset.about);

  try {
    const res = await fetch('about-panel.html');
    if (!res.ok) { console.error('[about-loader] failed to fetch about-panel.html', res.status); return; }
    const html = await res.text();
    console.log('[about-loader] loaded about-panel.html — length', html.length);

    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    /* העבר <style> ל-head */
    tmp.querySelectorAll('style').forEach(s => {
      if (s.id) {
        const ex = document.getElementById(s.id);
        if (ex) ex.remove();
      }
      document.head.appendChild(s);
    });

    /* הסר פאנל ישן אם קיים */
    const oldOv = document.getElementById('about-overlay');
    const oldPn = document.getElementById('about-panel');
    if (oldOv) oldOv.remove();
    if (oldPn) oldPn.remove();

    [...tmp.children].forEach(node => {
      if (node.tagName === 'STYLE') return;
      document.body.appendChild(node);
    });

    /* קבע נושא: dark לדף הבית, light לכל דף אחר */
    const theme = document.body.dataset.about === 'dark' ? 'dark' : 'light';
    const panel = document.getElementById('about-panel');
    if (panel) panel.dataset.theme = theme;

  } catch (e) { console.error('[about-loader] error', e); }
})();
