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

  // construction tapes (shown only while Media is centred)
  const tapeField = document.getElementById('tape-field'), lampEl = document.getElementById('lamp');
  [[46,-11,.8,-1,0,0,7,0,1.08],[54,9,.8,1,.25,0,8,0,.78]].forEach(([y,r,sc,dir,d,sw0,sw,ig,lit]) => {
    const t = document.createElement('div'); t.className = 'tape';
    t.style.cssText = `--y:${y}%;--r:${r}deg;--s:${sc};--d:${d}s;--sw:${sw}s;--from:${dir * 120}%;--sk:${dir * 1.6}deg;--lit:${lit};--st:${Math.round(sw * 14)}`;
    const st = document.createElement('div'); st.className = 'tape__strip';
    for (let i = 0; i < 14; i++) { const x = document.createElement('span'); x.textContent = ig ? 'FIND MORE ON OUR INSTAGRAM  @BEDROOMMEDIA_' : 'UNDER CONSTRUCTION'; st.appendChild(x); }
    t.appendChild(st); tapeField.appendChild(t);
  });
  const items = [...document.querySelectorAll('#wheel .item')];
  const videos = new Map(items.map(el => [el, el.querySelector('video')]));
  const n = items.length;
  const live = document.getElementById('live');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  
  { let lastLamp = 0; const PERIOD = 13, SWING = 11, BOB = 9;
    if (!reduceMotion) { const tick = (ms) => {
      if (ms - lastLamp < 70) { requestAnimationFrame(tick); return; } lastLamp = ms;
      if (lampEl.classList.contains('on') && !document.hidden) {
        const ph = ms / 1000 * 2 * Math.PI / PERIOD;
        lampEl.style.setProperty('--th', (SWING * Math.sin(ph)).toFixed(2) + 'deg');
        lampEl.style.setProperty('--dy', (BOB * Math.cos(ph)).toFixed(2) + 'px');
      }
      requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
  }

  // point each <video> at its file.
  //  Chrome/Firefox/Edge : transparent .webm
  //  Safari / iPhone     : transparent .mov if you made one (make-safari-videos.sh), otherwise the
  //                        "packed" .mp4 (colour on top, matte below) which an SVG filter turns transparent.
  const forcePacked = location.search.includes('packed') || (isWebKit && !location.search.includes('mov'));
  /* Safari / iPhone: the .mp4 holds colour (top half) and a black/white matte (bottom half).
     A canvas redraws each frame with the matte used as transparency. (SVG filters on <video> are unreliable on iOS.) */
  const usePacked = (v) => {
    const item = v.closest('.item'); if (item.classList.contains('packed')) return;
    item.classList.add('packed');
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d', { willReadFrequently: true });
    item.appendChild(cv);
    let W = 0, H = 0, off, octx, busy = false;
    let dead = false;
    const draw = () => {
      if (!v.videoWidth || dead) return;
      if (!W) { W = Math.min(720, v.videoWidth); H = Math.round(W * (v.videoHeight / 2) / v.videoWidth); cv.width = W; cv.height = H;
        off = document.createElement('canvas'); off.width = W; off.height = H * 2; octx = off.getContext('2d', { willReadFrequently: true }); }
      octx.drawImage(v, 0, 0, W, H * 2);
      let px; try { px = octx.getImageData(0, 0, W, H * 2).data; } catch (e) {          // file:// blocks canvas reads -> SVG-filter route
        dead = true; cv.remove(); item.classList.add('packed-svg'); const sh = document.getElementById('bp-unpack-shift'); if (sh) sh.setAttribute('dy', -item.offsetHeight); return; }
      const out = ctx.createImageData(W, H), o = out.data, half = W * H * 4;
      for (let i = 0; i < half; i += 4) {
        const al = (px[half + i] * .2126 + px[half + i + 1] * .7152 + px[half + i + 2] * .0722);
        o[i] = px[i]; o[i + 1] = px[i + 1]; o[i + 2] = px[i + 2]; o[i + 3] = al;
      }
      ctx.putImageData(out, 0, 0);
    };
    const loop = () => {
      const pos = Math.abs(+item.dataset.pos || 0);
      if (!document.hidden && pos <= 1 && !v.paused) draw();
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(loop); else requestAnimationFrame(loop);
    };
    v.addEventListener('loadeddata', () => { draw(); loop(); }, { once: true });
    v.src = v.dataset.src + '.mp4'; v.load();
  };
  const SPEED = 0.6;   // logo playback speed (1 = original; lower = slower)
  // Load the centred logo first; the other two start once it is ready (or after 2.5 s), so nothing competes for bandwidth.
  const loaders = new Map();
  videos.forEach(v => {
    const base = v.dataset.src;
    const slow = () => { v.defaultPlaybackRate = SPEED; v.playbackRate = SPEED; };
    slow(); ['loadedmetadata', 'play'].forEach(ev => v.addEventListener(ev, slow));
    v.preload = 'none'; v.poster = base + '-poster.webp';
    loaders.set(v, () => {
      v.preload = 'auto';
      if (forcePacked) return usePacked(v);
      if (useMov) { v.addEventListener('error', () => usePacked(v), { once: true }); v.src = base + '.mov'; }
      else v.src = base + '.webm';
    });
  });

  // start on the logo named in the URL (#records / #media) – that's where HOME links from other sections lead
  const hashStart = items.findIndex(el => el.dataset.nav === location.hash.slice(1));
  let current = hashStart >= 0 ? hashStart : Math.max(0, items.findIndex(el => el.hasAttribute('data-start')));
  { const first = videos.get(items[current]); let started = false;
    const rest = () => { if (started) return; started = true; videos.forEach(v => { if (v !== first) loaders.get(v)(); }); };
    first.addEventListener('loadeddata', rest, { once: true }); setTimeout(rest, 2500);
    loaders.get(first)(); }
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
      capEnter.firstChild.textContent = (el.dataset.cta || 'ENTER') + ' '; capEnter.href = el.dataset.href || '#'; if (el.hasAttribute('data-external')) { capEnter.target = '_blank'; capEnter.rel = 'noopener'; } else { capEnter.removeAttribute('target'); }
      capInsta.href = el.dataset.insta || '#'; capInsta.hidden = el.hasAttribute('data-external');
      dots.forEach((d, k) => d.setAttribute('aria-current', k === current ? 'true' : 'false'));
      cap.classList.toggle('dark', el.dataset.ink === 'dark'); cap.classList.toggle('hazard', el.dataset.nav === 'media'); cap.classList.remove('out');
    }, reduceMotion ? 0 : 200);
  };
  // first visit only: nudge the arrows once the intro line has faded
  { let seen = false; try { seen = localStorage.getItem('bp-nudged'); } catch (e) {}
    if (!seen) setTimeout(() => { const a = document.getElementById('next'), b = document.getElementById('prev'); a.classList.add('nudge--next'); b.classList.add('nudge--prev');
      try { localStorage.setItem('bp-nudged', '1'); } catch (e) {} }, 5200); }
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
  render = function (first) { _render(first); syncNav(false); syncCap(); tapeField.classList.toggle('on', items[current].dataset.nav === 'media'); lampEl.classList.toggle('on', items[current].dataset.nav === 'productions'); };
  syncCap(); tapeField.classList.toggle('on', items[current].dataset.nav === 'media'); lampEl.classList.toggle('on', items[current].dataset.nav === 'productions');
})();
