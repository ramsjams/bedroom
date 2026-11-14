/* Shows page: a list on the left and a column of photos in the middle that move together.
   Endless: mouse wheel, arrow keys, swipe, or a click on a title / neighbouring photo. */
(() => {
  const SHOWS = window.SHOWS, n = SHOWS.length;
  const $ = (id) => document.getElementById(id);
  const list = $('list'), listwrap = $('listwrap'), track = $('track'), stage = $('stage'), live = $('live');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; };

  // ENDLESS: the list and the photos are drawn three times in a row. `g` is the position in that long strip;
  // after each move we silently jump back to the middle copy, so you can keep going in either direction forever.
  const COPIES = 3, N = n * COPIES;
  let g = n + Math.min(n - 1, Math.max(0, parseInt(location.hash.slice(1), 10) - 1 || 0));
  const cur = () => ((g % n) + n) % n;
  const shown = SHOWS.map(() => 0);                 // which photo of each show is showing

  const rows = [], figs = [];
  for (let c = 0; c < COPIES; c++) SHOWS.forEach((s, i) => {
    const gi = c * n + i, mid = c === 1;
    const li = el('li', 'shows__item'); const b = el('button', '', s.title); b.type = 'button';
    if (!mid) { b.tabIndex = -1; li.setAttribute('aria-hidden', 'true'); }
    b.addEventListener('click', () => move(gi - g)); li.appendChild(b); list.appendChild(li); rows.push(li);

    const f = el('figure', 'shows__photo'); f.setAttribute('aria-label', s.title);
    s.photos.forEach((src, k) => { const im = el('img'); im.src = src; im.alt = k && mid ? '' : s.title; im.draggable = false; if (!mid || i > 2) im.loading = 'lazy'; if (!k) im.className = 'on'; f.appendChild(im); });
    if (s.photos.length > 1) f.appendChild(el('span', 'shows__count', `1/${s.photos.length}`));
    f.addEventListener('click', () => {
      if (gi !== g) return move(gi - g);
      if (s.photos.length < 2) return;
      shown[i] = (shown[i] + 1) % s.photos.length;                 // flip the photo in every copy
      for (let cc = 0; cc < COPIES; cc++) {
        const ff = figs[cc * n + i], ims = ff.querySelectorAll('img');
        ims.forEach((m, k) => m.classList.toggle('on', k === shown[i]));
        ff.querySelector('.shows__count').textContent = `${shown[i] + 1}/${ims.length}`;
      }
    });
    track.appendChild(f); figs.push(f);
  });

  function layout() {
    rows.forEach((r, i) => {
      const d = Math.abs(i - g);
      r.dataset.d = d > 4 ? 4 : d;
      r.firstChild.setAttribute('aria-current', i === g ? 'true' : 'false');
    });
    figs.forEach((f, i) => { f.dataset.d = Math.min(Math.abs(i - g), 3); });
    const r = rows[g], f = figs[g];
    list.style.transform = `translateY(${listwrap.clientHeight / 2 - (r.offsetTop + r.offsetHeight / 2)}px)`;
    track.style.transform = `translateY(${stage.clientHeight / 2 - (f.offsetTop + f.offsetHeight / 2)}px)`;
    live.textContent = SHOWS[cur()].title;
  }
  let settle;
  function recentre() {                                  // jump to the same show in the middle copy, without animating
    g = n + cur();
    const root = document.documentElement; root.classList.add('no-anim'); layout(); void root.offsetWidth; root.classList.remove('no-anim');
  }
  function move(d) {
    if (!d) return;
    g = Math.max(0, Math.min(N - 1, g + d)); layout(); history.replaceState(null, '', '#' + (cur() + 1));
    clearTimeout(settle);
    if (g < 1 || g > N - 2) recentre(); else settle = setTimeout(() => { if (g < n || g >= 2 * n) recentre(); }, 800);
  }
  const step = (d) => move(d);
  const go = (i) => move(i - cur());

  // mouse wheel / trackpad: one show per gesture
  let lock = 0, acc = 0;
  addEventListener('wheel', (e) => {
    e.preventDefault(); acc += e.deltaY;
    if (Date.now() - lock < 380) { acc = 0; return; }
    if (Math.abs(acc) > 30) { step(acc > 0 ? 1 : -1); lock = Date.now(); acc = 0; }
  }, { passive: false });
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
    
  });
  // swipe
  let y0 = null;
  document.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') y0 = e.clientY; });
  document.addEventListener('pointerup', (e) => { if (y0 === null) return; const dy = e.clientY - y0; y0 = null; if (Math.abs(dy) > 40) step(dy < 0 ? 1 : -1); });

  document.documentElement.classList.add('no-anim');          // no slide on first paint
  layout();
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('no-anim')));
  addEventListener('resize', layout);
  addEventListener('load', layout);
})();
