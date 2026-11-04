(function () {
  var cfg = window.SITE_CONFIG || {};

  /* ---------- Logos: path from config.logos[key], else assets/logos/<key>.(png|svg|webp|jpg) ---------- */
  var EXT = ['png', 'svg', 'webp', 'jpg'];
  window.logoFail = function (img) {
    var n = (+img.dataset.n || 0) + 1;
    if (!img.dataset.fixed && n < EXT.length) { img.dataset.n = n; img.src = 'assets/logos/' + img.dataset.logo + '.' + EXT[n]; }
    else img.remove();   /* nothing found: the fallback icon stays */
  };
  window.logoOk = function (img) {
    var ic = img.parentNode.querySelector('.ic');
    if (ic) ic.style.display = 'none';   /* real logo loaded: drop the fallback icon so they never overlap */
  };
  document.querySelectorAll('img[data-logo]').forEach(function (img) {
    var custom = (cfg.logos || {})[img.dataset.logo];
    if (custom) img.dataset.fixed = '1';
    img.src = custom || 'assets/logos/' + img.dataset.logo + '.png';
    if (img.complete && img.naturalWidth) window.logoOk(img);
  });

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
    else if (k === 'leetcode') setLink(el, cfg.leetcodeUser ? 'https://leetcode.com/u/' + cfg.leetcodeUser + '/' : '');
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

  /* ---------- "Show more" toggles (achievements, projects) ---------- */
  function bindMore(listId, btnId, sectionId, noun, countSel) {
    var l = document.getElementById(listId), b = document.getElementById(btnId);
    if (!l || !b) return;
    var total = document.querySelectorAll(countSel).length;
    function paint() {
      var collapsed = l.classList.contains('collapsed');
      b.textContent = collapsed ? 'Show all ' + total + ' ' + noun : 'Show fewer';
      b.setAttribute('aria-expanded', String(!collapsed));
    }
    paint();
    b.addEventListener('click', function () {
      l.classList.toggle('collapsed');
      paint();
      if (l.classList.contains('collapsed')) document.getElementById(sectionId).scrollIntoView();
    });
  }
  bindMore('awardList', 'moreAwards', 'achievements', 'achievements', '#awardList > div');
  bindMore('vitList', 'moreProjects', 'projects', 'projects', '#projects article.project');

  /* ---------- Back to top ---------- */
  var top = document.getElementById('toTop');
  if (top) {
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
    var toggleTop = function () { top.hidden = window.scrollY < 500; };
    addEventListener('scroll', toggleTop, { passive: true });
    toggleTop();
  }

  /* ---------- Contact is short, so scrollspy never reaches it: highlight it at the page bottom ---------- */
  var links = document.querySelectorAll('#nav .nav-link');
  var contactLink = document.querySelector('#nav a[href="#contact"]');
  var chosen = null;   /* item just clicked: wins until the visitor scrolls by hand */
  function mark(target) { links.forEach(function (l) { l.classList.toggle('active', l === target); }); }
  function sync() {
    if (chosen) return mark(chosen);
    if (contactLink && innerHeight + scrollY >= document.documentElement.scrollHeight - 4) mark(contactLink);
  }
  links.forEach(function (l) {
    l.addEventListener('click', function () { chosen = l; mark(l); });
  });
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
    addEventListener(ev, function () { chosen = null; }, { passive: true });
  });
  addEventListener('scroll', sync, { passive: true });
  document.addEventListener('activate.bs.scrollspy', function () { requestAnimationFrame(sync); });
  sync();

  /* ---------- Footer year ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
