(function () {
  const cursor = document.getElementById('custom-cursor');
  const message = document.getElementById('cursor-message');
  if (!cursor) return;

  // only on desktop
  if (window.innerWidth < 1024) return;

  let lastTarget = null;

  function update(e) {
    requestAnimationFrame(function () {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
      cursor.classList.add('is-visible');

      var target = e.target;
      if (target === lastTarget) return;
      lastTarget = target;

      var hoverEl = target && (target.closest('a') || target.closest('[data-cursor]'));

      if (hoverEl) {
        var data  = hoverEl.dataset;
        var msg   = ('ext' in data) ? (data.message || 'View') : (data.message || '');
        var bg    = data.bg    || '';
        var color = data.color || '';

        if (msg)   { message.textContent = msg; cursor.classList.add('has-message'); }
        if (bg)    { cursor.style.backgroundColor = bg; cursor.classList.add('has-custom-bg'); }
        if (color) { cursor.style.color = color; }

        cursor.classList.add('is-hover');
      } else {
        message.textContent = '';
        cursor.style.backgroundColor = '';
        cursor.style.color = '';
        cursor.classList.remove('is-hover', 'has-message', 'has-custom-bg');
      }
    });
  }

  function hide(e) {
    if (!e.relatedTarget) cursor.classList.remove('is-visible');
  }

  document.addEventListener('mousemove', update);
  document.addEventListener('mouseover', update);
  document.addEventListener('mouseout',  hide);
})();
