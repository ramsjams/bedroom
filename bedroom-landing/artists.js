/* Artists: names on the left, photos in the middle, bio + links on the right. Endless (same trick as Shows):
   the list is drawn three times and we silently jump back to the middle copy after each move. */
(() => {
  const A = window.ARTISTS, n = A.length, COPIES = 3, N = n * COPIES;
  const $ = (id) => document.getElementById(id);
  const list = $('list'), listwrap = $('listwrap'), track = $('track'), stage = $('stage'), bio = $('bio'), bioText = $('bio-text'), links = $('links');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; };

  const ICONS = {
    apple:     ['Apple Music', '<path d="M16.5 3v11.2a3.2 3.2 0 1 1-2-3V6.2l-6 1.4v8.6a3.2 3.2 0 1 1-2-3V5.6z"/>'],
    youtube:   ['YouTube',     '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/>'],
    spotify:   ['Spotify',     '<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>'],
    instagram: ['Instagram',   '<path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.4-3.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/>'],
  };
  const ORDER = ['apple', 'youtube', 'spotify', 'instagram'];

  let g = n + Math.max(0, A.findIndex(a => a.start));
  const h = parseInt(location.hash.slice(1), 10); if (h >= 1 && h <= n) g = n + h - 1;
  const cur = () => ((g % n) + n) % n;

  const rows = [], figs = [];
  for (let c = 0; c < COPIES; c++) A.forEach((a, i) => {
    const gi = c * n + i, mid = c === 1;
    const li = el('li', 'artists__item'), b = el('button', '', a.name); b.type = 'button';
    if (!mid) { b.tabIndex = -1; li.setAttribute('aria-hidden', 'true'); }
    b.addEventListener('click', () => move(gi - g)); li.appendChild(b); list.appendChild(li); rows.push(li);
    const f = el('figure', 'artists__photo'); const im = el('img'); im.src = a.photo; im.alt = mid ? a.name : ''; im.draggable = false; if (!mid) im.loading = 'lazy';
    f.appendChild(im); f.addEventListener('click', () => move(gi - g)); track.appendChild(f); figs.push(f);
  });

  function fillBio() {
    const a = A[cur()]; bioText.textContent = a.bio; links.innerHTML = '';
    ORDER.forEach(k => { if (!a[k]) return;
      const x = document.createElement('a'); x.href = a[k]; x.target = '_blank'; x.rel = 'noopener'; x.setAttribute('aria-label', `${a.name} on ${ICONS[k][0]}`);
      x.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k][1]}</svg>`; links.appendChild(x); });
    bio.classList.remove('out');
  }
  let bioTimer;
  function layout(first) {
    rows.forEach((r, i) => { const d = Math.abs(i - g); r.dataset.d = d > 4 ? 4 : d; r.firstChild.setAttribute('aria-current', i === g ? 'true' : 'false'); });
    figs.forEach((f, i) => { f.dataset.d = Math.min(Math.abs(i - g), 3); });
    const r = rows[g], f = figs[g];
    list.style.transform = `translateY(${listwrap.clientHeight / 2 - (r.offsetTop + r.offsetHeight / 2)}px)`;
    track.style.transform = `translateY(${stage.clientHeight / 2 - (f.offsetTop + f.offsetHeight / 2)}px)`;
  }
  let settle;
  function recentre() { g = n + cur(); const root = document.documentElement; root.classList.add('no-anim'); layout(); void root.offsetWidth; root.classList.remove('no-anim'); }
  function move(d) {
    if (!d) return;
    const before = cur();
    g = Math.max(0, Math.min(N - 1, g + d)); layout(); history.replaceState(null, '', '#' + (cur() + 1));
    if (cur() !== before) { bio.classList.add('out'); clearTimeout(bioTimer); reduce ? fillBio() : (bioTimer = setTimeout(fillBio, 430)); }
    clearTimeout(settle);
    if (g < 1 || g > N - 2) recentre(); else settle = setTimeout(() => { if (g < n || g >= 2 * n) recentre(); }, 800);
  }
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
  });
  let lock = 0, acc = 0;
  addEventListener('wheel', (e) => { e.preventDefault(); acc += e.deltaY; if (Date.now() - lock < 380) { acc = 0; return; } if (Math.abs(acc) > 30) { move(acc > 0 ? 1 : -1); lock = Date.now(); acc = 0; } }, { passive: false });
  let y0 = null;
  document.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') y0 = e.clientY; });
  document.addEventListener('pointerup', (e) => { if (y0 === null) return; const dy = e.clientY - y0; y0 = null; if (Math.abs(dy) > 40) move(dy < 0 ? 1 : -1); });

  document.documentElement.classList.add('no-anim'); fillBio(); layout();
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('no-anim')));
  addEventListener('resize', layout); addEventListener('load', layout);
})();
