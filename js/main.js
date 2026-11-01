(function () {
  var cfg = window.SITE_CONFIG || {};

  /* ---------- Configurable links ---------- */
  function setLink(el, href) {
    if (!href) { el.hidden = true; return; }
    el.href = href;
    el.hidden = false;
  }
  var gh = cfg.githubUser ? 'https://github.com/' + cfg.githubUser : '';
  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var k = el.getAttribute('data-cfg');
    if (k === 'github') setLink(el, gh);
    else if (k === 'email') setLink(el, cfg.email ? 'mailto:' + cfg.email : '');
    else if (k === 'linkedin') setLink(el, cfg.linkedin);
    else if (k === 'resume') setLink(el, cfg.resume);
  });
  document.querySelectorAll('[data-repo]').forEach(function (el) {
    var v = (cfg.repos || {})[el.getAttribute('data-repo')];
    if (!v) return setLink(el, '');
    setLink(el, /^https?:\/\//.test(v) ? v : (gh ? gh + '/' + v : ''));
  });
  document.querySelectorAll('[data-pub]').forEach(function (el) {
    setLink(el, (cfg.publications || {})[el.getAttribute('data-pub')]);
  });

  /* ---------- Theme (light / dark) ---------- */
  var root = document.documentElement;
  function setTheme(t, save) {
    root.setAttribute('data-bs-theme', t);
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  setTheme(root.getAttribute('data-bs-theme') || 'light', false);
  document.querySelectorAll('.theme-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      setTheme(root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark', true);
    });
  });

  /* ---------- Close mobile menu after choosing a section ---------- */
  var side = document.getElementById('side');
  document.querySelectorAll('#nav .nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < 992 && window.bootstrap) {
        var inst = bootstrap.Offcanvas.getInstance(side);
        if (inst) inst.hide();
      }
    });
  });

  /* ---------- Photo: click to enlarge in the middle, then glide back ---------- */
  var avatar = document.getElementById('avatarBtn');
  var busy = false;
  var HOLD_MS = 3500;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (avatar) avatar.addEventListener('click', function () {
    if (busy) return;
    busy = true;

    var from = avatar.getBoundingClientRect();
    var size = Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.62);
    size = Math.max(180, Math.min(size, 440));

    var backdrop = document.createElement('div');
    backdrop.className = 'zoom-backdrop';
    var clone = avatar.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    clone.classList.add('avatar-zoom');
    var baseFont = parseFloat(getComputedStyle(avatar).fontSize) || 28;

    function place(r, font) {
      clone.style.left = r.left + 'px';
      clone.style.top = r.top + 'px';
      clone.style.width = r.width + 'px';
      clone.style.height = r.height + 'px';
      clone.style.fontSize = font + 'px';
    }
    place(from, baseFont);
    document.body.appendChild(backdrop);
    document.body.appendChild(clone);
    avatar.style.visibility = 'hidden';

    var closed = false;
    function finish() {
      clone.remove(); backdrop.remove();
      avatar.style.visibility = '';
      busy = false;
    }
    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey);
      var back = avatar.getBoundingClientRect();
      backdrop.classList.remove('show');
      if (reduce) return finish();
      place(back, baseFont);
      var done = false;
      clone.addEventListener('transitionend', function () { if (!done) { done = true; finish(); } });
      setTimeout(function () { if (!done) { done = true; finish(); } }, 900);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('click', close);
    clone.addEventListener('click', close);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        backdrop.classList.add('show');
        place({
          left: (window.innerWidth - size) / 2,
          top: (window.innerHeight - size) / 2,
          width: size, height: size
        }, size * 0.34);
      });
    });
    setTimeout(close, HOLD_MS);
  });

  /* ---------- Achievements: flip the order ---------- */
  var list = document.getElementById('awardList');
  var sortBtn = document.getElementById('sortAwards');
  var sortLabel = document.getElementById('sortLabel');
  if (list && sortBtn) sortBtn.addEventListener('click', function () {
    var items = Array.prototype.slice.call(list.children).reverse();
    items.forEach(function (n) { list.appendChild(n); });
    var oldestFirst = sortBtn.getAttribute('aria-pressed') !== 'true';
    sortBtn.setAttribute('aria-pressed', String(oldestFirst));
    sortLabel.textContent = oldestFirst ? 'Oldest first' : 'Newest first';
  });

  /* ---------- Footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
