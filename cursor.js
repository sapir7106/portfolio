(function () {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

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

      var cardEl     = target && target.closest('[data-cursor="card"]');
      var clickable  = !cardEl && target && target.closest('a, button, [role="button"]');

      cursor.classList.remove('is-hover', 'is-card');

      if (cardEl)    cursor.classList.add('is-card');
      else if (clickable) cursor.classList.add('is-hover');
    });
  }

  function hide(e) {
    if (!e.relatedTarget) cursor.classList.remove('is-visible');
  }

  document.addEventListener('mousemove', update);
  document.addEventListener('mouseover', update);
  document.addEventListener('mouseout',  hide);
})();
