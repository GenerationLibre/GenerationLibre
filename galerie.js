/* Galerie : plusieurs photos visibles à la fois, défilement automatique, flèches, balayage au doigt. */
(function () {
  var root = document.getElementById('carousel');
  if (!root) return;
  var track = root.querySelector('.slides');
  if (!track) return;
  var prev = root.querySelector('.prev');
  var next = root.querySelector('.next');
  var toggle = document.querySelector('.car-toggle');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var behavior = reduce ? 'auto' : 'smooth';
  var timer = null, paused = false;

  function scrollable() { return track.scrollWidth > track.clientWidth + 4; }

  function stepSize() {
    var first = track.children[0];
    if (!first) return track.clientWidth;
    var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  }

  function nextSlide() {
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (atEnd) { track.scrollTo({ left: 0, behavior: behavior }); }
    else { track.scrollBy({ left: stepSize(), behavior: behavior }); }
  }

  function prevSlide() {
    var atStart = track.scrollLeft <= 4;
    if (atStart) { track.scrollTo({ left: track.scrollWidth, behavior: behavior }); }
    else { track.scrollBy({ left: -stepSize(), behavior: behavior }); }
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function start() {
    stop();
    if (reduce || paused || !scrollable()) return;
    timer = setInterval(nextSlide, 4000);
  }

  /* Cache les flèches et le bouton pause quand toutes les photos tiennent à l'écran */
  function refresh() {
    var show = scrollable();
    if (prev) prev.style.display = show ? '' : 'none';
    if (next) next.style.display = show ? '' : 'none';
    if (toggle) toggle.style.display = show ? '' : 'none';
    if (show) { start(); } else { stop(); }
  }

  if (prev) prev.addEventListener('click', function () { stop(); prevSlide(); });
  if (next) next.addEventListener('click', function () { stop(); nextSlide(); });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { prevSlide(); }
    if (e.key === 'ArrowRight') { nextSlide(); }
  });

  /* Pause quand on survole, qu'on touche ou qu'on utilise le clavier */
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);
  root.addEventListener('touchstart', stop, { passive: true });
  root.addEventListener('touchend', start);

  if (toggle) {
    if (reduce) { paused = true; toggle.textContent = '▶ Lecture'; toggle.setAttribute('aria-pressed', 'true'); }
    toggle.addEventListener('click', function () {
      paused = !paused;
      toggle.textContent = paused ? '▶ Lecture' : '⏸ Pause';
      toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
      if (paused) { stop(); } else { start(); }
    });
  }

  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  refresh();
})();
