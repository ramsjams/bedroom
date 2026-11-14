/* Releases: an endless wheel of covers (same idea as the logo wheel on the landing page).
   One number, `current`, says which cover is centred; every cover's slot is worked out from it
   with modulo maths, so it loops forever in both directions.
   Click the centred cover -> a card with the listening links slides out from under it. */
(() => {
  const DATA = window.RELEASES, n = DATA.length;
  const $ = (id) => document.getElementById(id);
  const row = $('row'), head = $('head'), titleEl = $('title'), live = $('live'), card = $('card'), cardTitle = $('card-title'), links = $('links');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICONS = {
    spotify: ['Spotify',     '<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>'],
    apple:   ['Apple Music',  '<path d="M16.5 3v11.2a3.2 3.2 0 1 1-2-3V6.2l-6 1.4v8.6a3.2 3.2 0 1 1-2-3V5.6z"/>'],
    deezer:  ['Deezer',       '<path d="M2 18h4v2H2zM7.5 18h4v2h-4zM13 18h4v2h-4zM18.5 18h3.5v2h-3.5zM7.5 14.5h4v2h-4zM13 14.5h4v2h-4zM18.5 14.5h3.5v2h-3.5zM13 11h4v2h-4zM18.5 11h3.5v2h-3.5zM18.5 7.5h3.5v2h-3.5zM18.5 4h3.5v2h-3.5z"/>'],
    youtube: ['YouTube',      '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/>'],
    pushfm:  ['Listen',       '<path d="M8 5v14l11-7z"/>'],
  };
  const ORDER = ['pushfm', 'spotify', 'apple', 'deezer', 'youtube'];

  let current = Math.max(0, DATA.findIndex(d => d.start));
  const h = parseInt(location.hash.slice(1), 10); if (h >= 1 && h <= n) current = h - 1;

  const slotOf = (i) => { let d = ((i - current) % n + n) % n; if (d > n / 2) d -= n; return d; };
  let lastSwipe = 0, open = false;
  const items = DATA.map((d, i) => {
    const li = document.createElement('li'); li.className = 'rel';
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `${d.artist} - ${d.title}`);
    const im = document.createElement('img'); im.src = d.img; im.alt = ''; im.draggable = false; im.decoding = 'async';
    b.appendChild(im); li.appendChild(b); row.appendChild(li);
    b.addEventListener('click', () => {
      if (Date.now() - lastSwipe < 400) return;
      const s = slotOf(i);
      if (s) go(s); else toggle();
    });
    return li;
  });

  // ---- title: one line, scaled so it fills the space between the two arrows
  function fit() {
    const avail = titleEl.clientWidth * .96, t = titleEl.firstChild; if (!avail || !t) return;
    head.style.setProperty('--fs', '100px');
    const w = t.getBoundingClientRect().width || 1;
    const max = Math.min(innerWidth * .115, innerHeight * .16);
    const fs = Math.max(14, Math.min(max, 100 * avail / w * .995));
    head.style.setProperty('--fs', fs + 'px');
  }

  // ---- links card
  function fillCard() {
    const d = DATA[current];
    cardTitle.textContent = ''; cardTitle.append(d.title); const a = document.createElement('i'); a.textContent = d.artist; cardTitle.appendChild(a);
    links.innerHTML = '';
    ORDER.forEach(k => { const url = d.links && d.links[k]; if (!url) return;
      const x = document.createElement('a'); x.href = url; x.target = '_blank'; x.rel = 'noopener'; x.setAttribute('aria-label', `${d.title} on ${ICONS[k][0]}`);
      x.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k][1]}</svg><span>${ICONS[k][0]}</span>`; links.appendChild(x); });
  }
  let cardTimer;
  function setOpen(v, then) {
    open = v; clearTimeout(cardTimer);
    if (v) { fillCard(); card.inert = false; card.classList.add('open'); }
    else { card.classList.remove('open'); card.inert = true; }
    if (then) cardTimer = setTimeout(then, reduce ? 0 : 520);
  }
  function toggle() { if (!DATA[current].links || !Object.keys(DATA[current].links).length) return; setOpen(!open); }

  const prev = new Map(), REACH = 4;
  function render(first) {
    items.forEach((li, i) => {
      const s = slotOf(i), was = prev.get(li);
      if (!first && was !== undefined && Math.abs(s - was) > 1) li.classList.add('no-anim');   // wrapping round the back: jump invisibly
      li.dataset.pos = Math.abs(s) <= REACH ? s : (s < 0 ? -REACH : REACH);
      li.firstChild.tabIndex = Math.abs(s) <= 1 ? 0 : -1;
      li.setAttribute('aria-hidden', s !== 0);
      if (li.classList.contains('no-anim')) { void li.offsetWidth; li.classList.remove('no-anim'); }
      prev.set(li, s);
    });
    const d = DATA[current];
    const swap = () => {
      titleEl.innerHTML = ''; const w = document.createElement('span'); w.style.display = 'inline-block'; const a = document.createElement('i'); a.textContent = d.artist;
      const t = document.createElement('b'); t.textContent = d.title; w.append(a, ' - ', t); titleEl.appendChild(w); fit(); titleEl.classList.remove('out');
    };
    if (first || reduce) swap(); else { titleEl.classList.add('out'); setTimeout(swap, 140); }
    live.textContent = `${d.artist} - ${d.title}`;
    history.replaceState(null, '', '#' + (current + 1));
  }
  function go(step) {
    const run = () => { current = ((current + step) % n + n) % n; render(false); };
    if (open) { setOpen(false); run(); } else run();     // card tucks back under the cover as we move on
  }

  $('prev').addEventListener('click', () => go(-1));
  $('next').addEventListener('click', () => go(1));
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(-1);
    if (e.key === 'Escape' && open) setOpen(false);
    if (e.key === 'Enter' && !e.target.closest('a, button')) toggle();
  });
  let lock = 0, acc = 0;
  addEventListener('wheel', (e) => {
    e.preventDefault(); acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Date.now() - lock < 320) { acc = 0; return; }
    if (Math.abs(acc) > 30) { go(acc > 0 ? 1 : -1); lock = Date.now(); acc = 0; }
  }, { passive: false });
  let x0 = null;
  document.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  document.addEventListener('pointerup', (e) => {
    if (x0 === null) return; const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) { lastSwipe = Date.now(); go(dx < 0 ? 1 : -1); }
  });

  render(true);
  addEventListener('resize', fit); addEventListener('load', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
