/*
  about-loader.js — מזריק את מבנה פאנל ה-About מהמאסטר
  =====================================================
  טוען קובץ פאנל-מאסטר ומזריק אותו לעמוד.
  בוחר איזה מאסטר לפי data-about על <body>:
    <body data-about="dark">   → טוען about-dark.html   (index)
    <body data-about="light">  → טוען about-light.html  (פרויקטים)
  ברירת מחדל אם לא צוין: light.

  אחריו יש לטעון about-content-loader.js שממלא את הטקסט.
*/

(async function () {
  /* CONSOLE DIAGNOSTIC */
  console.log('[about-loader] v2 starting, data-about =', document.body.dataset.about);
  const which = document.body.dataset.about || 'light';
  const file = which === 'dark' ? 'about-dark.html' : 'about-light.html';

  try {
    const res = await fetch(file);
    if (!res.ok) { console.error('[about-loader] failed to fetch', file, res.status); return; }
    const html = await res.text();
    console.log('[about-loader] loaded', file, '— length', html.length);

    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    // העבר <style> ל-head (הסר ישן אם קיים)
    tmp.querySelectorAll('style').forEach(s => {
      if (s.id) {
        const ex = document.getElementById(s.id);
        if (ex) ex.remove();
      }
      document.head.appendChild(s);
    });

    // הסר פאנל ישן אם קיים
    const oldOv = document.getElementById('about-overlay');
    const oldPn = document.getElementById('about-panel');
    if (oldOv) oldOv.remove();
    if (oldPn) oldPn.remove();

    [...tmp.children].forEach(node => {
      if (node.tagName === 'STYLE') return;
      document.body.appendChild(node);
    });
  } catch (e) { /* fail silently */ }
})();
