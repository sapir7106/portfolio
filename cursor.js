(function () {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  if (window.innerWidth < 1024) return;

  let lastTarget = null;
  let activated = false;

  function update(e) {
    // Confirm the cursor is actually receiving real pointer events before
    // hiding the native cursor — never hide it speculatively.
    if (!activated) {
      activated = true;
      document.documentElement.classList.add('custom-cursor-active');
    }
    requestAnimationFrame(function () {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
      cursor.classList.add('is-visible');

      var target = e.target;
      if (target === lastTarget) return;
      lastTarget = target;

      var clickable = target && target.closest('a, button, [role="button"], .img-mt figure, .img-row figure, .img-stack figure, .img-mt .ph, .img-row .ph, .img-stack .ph');
      if (clickable) cursor.classList.add('is-hover');
      else           cursor.classList.remove('is-hover');
    });
  }

  function hide(e) {
    if (!e.relatedTarget) cursor.classList.remove('is-visible');
  }

  document.addEventListener('mousemove', update);
  document.addEventListener('mouseover', update);
  document.addEventListener('mouseout',  hide);
})();
