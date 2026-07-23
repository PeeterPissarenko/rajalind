(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal on scroll */
  var items = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* sticky header state + trail progress */
  var bar = document.getElementById('topbar');
  var fill = document.getElementById('spineFill');
  var bird = document.getElementById('spineBird');
  var prog = document.getElementById('prog');
  var spine = document.getElementById('spine');
  var ticking = false;

  function frame() {
    var y = window.scrollY || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    bar.classList.toggle('stuck', y > 24);
    prog.style.width = (p * 100) + '%';
    if (spine) {
      var h = spine.clientHeight;
      fill.style.height = (p * h) + 'px';
      bird.style.top = (p * h) + 'px';
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  window.addEventListener('resize', frame);
  frame();

  /* active stop on the trail */
  var stops = document.querySelectorAll('#stops a');
  if ('IntersectionObserver' in window && stops.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        stops.forEach(function (a) {
          a.classList.toggle('on', a.dataset.target === e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['evelinist','teraapiast','tagasiside','hinnakiri','kontakt','blogi'].forEach(function (id) {
      var el = document.getElementById(id); if (el) so.observe(el);
    });
  }

  /* mobile menu */
  var btn = document.getElementById('menuBtn');
  var drawer = document.getElementById('drawer');
  var close = document.getElementById('menuClose');
  function setMenu(open) {
    drawer.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { drawer.querySelector('a').focus(); } else { btn.focus(); }
  }
  btn.addEventListener('click', function () { setMenu(true); });
  close.addEventListener('click', function () { setMenu(false); });
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) setMenu(false);
  });
})();
