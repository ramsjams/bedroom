(() => {
  /* ================= WHICH VIDEO FILE =================
     Chrome / Firefox / Edge play transparent .webm (VP9 + alpha).
     Safari and every browser on iPhone can't, so they get the transparent .mov (HEVC + alpha).
     Test in any browser with  index.html?webm  or  index.html?mov  */
  const ua = navigator.userAgent;
  const isWebKit = (/AppleWebKit/.test(ua) && !/(Chrome|Chromium|Edg|OPR|Android|Firefox)/.test(ua)) || /(CriOS|FxiOS|EdgiOS)/.test(ua);
  const useMov = location.search.includes('mov') ? true : location.search.includes('webm') ? false : isWebKit;

  /* ================= ENDLESS LOGO WHEEL =================
     The wheel is just a list of <li class="item">. We keep ONE number, `current`,
     (the index of the centered logo). Every logo's slot is derived from it:
        slot  0 = centre,  -1 = left,  +1 = right
     with modulo math so it wraps forever. CSS animates between slots. */

  const items = [...document.querySelectorAll('#wheel .item')];
  const videos = new Map(items.map(el => [el, el.querySelector('video')]));
  const n = items.length;
  const live = document.getElementById('live');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // point each <video> at its file.
  //  Chrome/Firefox/Edge : transparent .webm
  //  Safari / iPhone     : transparent .mov if you made one (make-safari-videos.sh), otherwise the
  //                        "packed" .mp4 (colour on top, matte below) which an SVG filter turns transparent.
  const forcePacked = location.search.includes('packed');
  const unpackShift = document.getElementById('bp-unpack-shift');
  const sizeUnpack = () => { const it = items[0]; if (unpackShift && it) unpackShift.setAttribute('dy', -it.offsetHeight); };
  const usePacked = (v) => { v.closest('.item').classList.add('packed'); sizeUnpack(); v.src = v.dataset.src + '.mp4'; v.load(); };
  videos.forEach(v => {
    const base = v.dataset.src;
    if (forcePacked) return usePacked(v);
    if (useMov) { v.addEventListener('error', () => usePacked(v), { once: true }); v.src = base + '.mov'; }
    else v.src = base + '.webm';
  });
  addEventListener('resize', sizeUnpack);

  // start on the logo named in the URL (#records / #media) – that's where HOME links from other sections lead
  const hashStart = items.findIndex(el => el.dataset.nav === location.hash.slice(1));
  let current = hashStart >= 0 ? hashStart : Math.max(0, items.findIndex(el => el.hasAttribute('data-start')));
  const lastPos = new Map();               // remembers each element's previous slot

  // shortest signed distance of item i from the centre, wrapped around the circle
  const slotOf = (i) => {
    let d = ((i - current) % n + n) % n;   // 0..n-1
    if (d > n / 2) d -= n;                 // -> -floor(n/2) .. +floor(n/2)
    return d;
  };

  /* ===== BACKGROUNDS =====
     One full-screen layer per logo, built from each <li data-bg="...">
     (a colour like #000 or an image path). They use the same slot system as the logos,
     so on every switch the old background slides out and the new one slides in. */
  const backdrop = document.getElementById('backdrop');
  const bgs = items.map(el => {
    const d = document.createElement('div');
    d.className = 'bg';
    const v = el.dataset.bg || '#000';
    if (v.startsWith('#')) d.style.background = v;
    else d.style.backgroundImage = `url("${v}")`;
    backdrop.appendChild(d);
    return d;
  });

  // Moves an element to a slot. An element that wraps from one far side to the other
  // (e.g. -1 -> +1) would fly across the whole screen, so it first jumps (with
  // animation off) to just outside the screen on its new side, then slides in.
  function place(el, slot, first) {
    const prev = lastPos.get(el);
    const visible = Math.abs(slot) <= 1;
    if (!first && prev !== undefined && Math.abs(slot - prev) > 1 && visible) {
      el.classList.add('no-anim');
      el.dataset.pos = String(Math.sign(slot) * 2);
      void el.offsetWidth;                 // force reflow so the jump is applied now
      el.classList.remove('no-anim');
    }
    el.dataset.pos = visible ? String(slot) : 'hidden';
    lastPos.set(el, slot);
  }

  let render = function (first = false) {
    items.forEach((el, i) => {
      const slot = slotOf(i);
      place(bgs[i], slot, first);
      place(el, slot, first);
      el.setAttribute('aria-hidden', slot !== 0);

      // Only the centred logo plays. The rest are paused.
      const v = videos.get(el);
      if (slot === 0 && !reduceMotion) v.play().catch(() => {});
      else v.pause();
    });
    live.textContent = items[current].dataset.name;
  };

  const go = (step) => { current = ((current + step) % n + n) % n; render(); };
  const goTo = (i) => {
    // move by the shortest way around
    const d = slotOf(i);
    if (d) go(d);
  };

  document.getElementById('next').addEventListener('click', () => go(1));
  document.getElementById('prev').addEventListener('click', () => go(-1));

  // click a side logo -> bring it to the centre; click the centred logo -> open its page (data-href)
  let lastSwipe = 0;
  const open = (el) => {
    if (!el.dataset.href) return;
    if (el.hasAttribute('data-external')) window.open(el.dataset.href, '_blank', 'noopener');   // e.g. Instagram opens in a new tab
    else location.href = el.dataset.href;
  };
  items.forEach((el, i) => el.addEventListener('click', () => {
    if (Date.now() - lastSwipe < 400) return;           // a swipe isn't a click
    if (slotOf(i) === 0) open(el); else goTo(i);
  }));

  // keyboard
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft')  go(-1);
    if (e.key === 'Enter' && !e.target.closest('a, button')) open(items[current]);
  });

  // swipe (touch / pen)
  let startX = null;
  const stage = document.querySelector('.stage');
  stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') startX = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX; startX = null;
    if (Math.abs(dx) > 40) { lastSwipe = Date.now(); go(dx < 0 ? 1 : -1); }
  });

  // ---- caption under the logo: what it is, ENTER, Instagram, and dots showing which of the 3 you're on
  const capTag = document.getElementById('cap-tag'), capDesc = document.getElementById('cap-desc'), capEnter = document.getElementById('cap-enter'), capInsta = document.getElementById('cap-insta'), cap = document.getElementById('caption'), dotsEl = document.getElementById('dots');
  const dots = items.map((el, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', el.dataset.name); b.addEventListener('click', () => goTo(i)); dotsEl.appendChild(b); return b; });
  let capTimer;
  const syncCap = () => {
    const el = items[current];
    cap.classList.add('out'); clearTimeout(capTimer);
    capTimer = setTimeout(() => {
      capTag.textContent = el.dataset.name + ' \u00b7 ' + el.dataset.tag; capDesc.textContent = el.dataset.desc || '';
      capEnter.href = el.dataset.href || '#'; if (el.hasAttribute('data-external')) { capEnter.target = '_blank'; capEnter.rel = 'noopener'; } else { capEnter.removeAttribute('target'); }
      capInsta.href = el.dataset.insta || '#'; capInsta.hidden = el.hasAttribute('data-external');
      dots.forEach((d, k) => d.setAttribute('aria-current', k === current ? 'true' : 'false'));
      cap.classList.toggle('dark', el.dataset.ink === 'dark'); cap.classList.remove('out');
    }, reduceMotion ? 0 : 200);
  };
  const intro = document.getElementById('intro'); setTimeout(() => intro.classList.add('gone'), 4500);
  render(true);
  // some browsers need a nudge once the centre video is ready
  videos.get(items[current]).addEventListener('canplay', () => render(), { once: true });
  // resume if the tab was backgrounded
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });


  /* ================= NAVBAR =================
     The navbar follows the centred logo (data-nav on each <li>): HOME stays put, the other
     four labels fade out and the new ones fade in. Sets live in nav.js. */
  const navEl = document.getElementById('nav');
  let navSet = null, navTimer;
  function setNav(set, instant) {
    if (set === navSet) return;
    const first = navSet === null; navSet = set;
    clearTimeout(navTimer);
    const apply = () => { window.bpNav(navEl, set, 'home'); navEl.classList.remove('swap'); };
    if (first || instant || reduceMotion) return apply();
    navEl.classList.add('swap');
    navTimer = setTimeout(apply, 170);
  }
  const syncNav = (instant) => {
    const set = items[current].dataset.nav || 'productions';
    setNav(set, instant);
    history.replaceState(null, '', set === 'productions' ? location.pathname + location.search : '#' + set);
  };
  syncNav(true);
  const _render = render;
  render = function (first) { _render(first); syncNav(false); syncCap(); };
  syncCap();
})();
