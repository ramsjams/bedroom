/* Visual team: three photos that behave like sheets of paper.
   Click one -> it slides over the others (which stay stacked as slim edges on the left)
   and its white page slides in from the right. Click an edge to swap. The URL hash
   (#hedi, #slim, #sayfallah) tracks which one is open, so Back / refresh work. */
(() => {
  const TEAM = window.VISUAL_TEAM;
  const root = document.getElementById('visual');
  const papersEl = document.getElementById('papers');
  const dossiersEl = document.getElementById('dossiers');
  const back = document.querySelector('.back');
  const mobile = matchMedia('(max-width: 760px)');
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  const host = (u) => /youtu/.test(u) ? 'YouTube' : /instagram/.test(u) ? 'Instagram' : 'Link';

  /* ---------- build ---------- */
  const papers = TEAM.map((m, i) => {
    const a = el('a', 'paper'); a.href = '#' + m.slug; a.style.setProperty('--i', i); a.style.setProperty('--pos', m.pos);
    a.setAttribute('aria-label', m.label);
    const img = el('img'); img.src = m.photo; img.alt = ''; img.draggable = false;
    a.append(img, el('span', 'paper__name', m.label));
    papersEl.appendChild(a); return a;
  });

  const tileFill = (container, tiles) => {
    container.textContent = '';
    const cols = [el('div', 'work__col'), el('div', 'work__col')], h = [0, 0];
    tiles.forEach(t => {
      const a = el(t.href ? 'a' : 'div', 'tile' + (t.video ? ' tile--video' : ''));
      if (t.href) { a.href = t.href; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', `${t.title} (opens ${host(t.href)})`); }
      const box = el('span', 'tile__img'); box.style.aspectRatio = `${t.w} / ${t.h}`;
      const img = el('img'); img.src = t.img; img.alt = ''; img.loading = 'lazy'; img.width = t.w; img.height = t.h;
      box.appendChild(img);
      const cap = el('span', 'tile__cap'); cap.append(el('span', '', t.title), el('span', '', t.kind));
      a.append(box, cap);
      const k = mobile.matches ? 0 : (h[0] <= h[1] ? 0 : 1);
      cols[k].appendChild(a); h[k] += t.h / t.w + 0.14;
    });
    container.append(...cols);
  };

  const dossiers = TEAM.map(m => {
    const d = el('section', 'dossier'); d.setAttribute('aria-label', m.label); d.setAttribute('aria-hidden', 'true'); d.inert = true;
    const hero = el('img', 'dossier__hero'); hero.src = m.photo; hero.alt = ''; hero.style.objectPosition = m.pos;   // phones only
    const h = el('h2', 'display person dossier__name' + (m.name.length > 8 ? ' dossier__name--long' : ''), m.name);
    d.append(hero, h);
    if (m.bio) d.appendChild(el('p', 'bio', m.bio));
    if (m.links.length) {
      const p = el('p', 'dossier__links');
      m.links.forEach(l => { const a = el('a', '', l.text + ' ↗'); a.href = l.href; a.target = '_blank'; a.rel = 'noopener'; p.appendChild(a); });
      d.appendChild(p);
    }
    const wrap = el('div', 'dossier__work');
    m.sections.forEach(s => {
      if (s.heading) wrap.appendChild(el('h3', 'display dossier__sub', s.heading));
      const grid = el('div', 'work'); tileFill(grid, s.tiles); wrap.appendChild(grid);
    });
    d.appendChild(wrap);
    dossiersEl.appendChild(d); return d;
  });
  // re-flow the tile columns when crossing the phone breakpoint
  mobile.addEventListener('change', () => dossiers.forEach((d, i) => d.querySelectorAll('.work').forEach((g, k) => tileFill(g, TEAM[i].sections[k].tiles))));

  /* ---------- state ---------- */
  let cur = -1;
  const timers = new Map();
  function render() {
    const slug = location.hash.slice(1);
    const sel = TEAM.findIndex(m => m.slug === slug);
    const prev = cur; cur = sel;
    root.classList.toggle('is-open', sel >= 0);
    document.documentElement.classList.toggle('lock', sel >= 0 && mobile.matches);

    let rank = 0;
    papers.forEach((p, i) => {
      if (sel < 0) { p.dataset.state = 'idle'; p.removeAttribute('tabindex'); }
      else if (i === sel) { p.dataset.state = 'selected'; p.setAttribute('aria-current', 'true'); }
      else { p.dataset.state = 'stack'; p.style.setProperty('--r', rank++); p.removeAttribute('aria-current'); }
      if (i !== sel) p.removeAttribute('aria-current');
    });

    dossiers.forEach((d, i) => {
      clearTimeout(timers.get(d));
      if (i === sel) {
        d.scrollTop = 0; d.classList.remove('leaving'); d.classList.add('on'); d.inert = false; d.setAttribute('aria-hidden', 'false');
      } else if (d.classList.contains('on')) {
        d.classList.remove('on'); d.inert = true; d.setAttribute('aria-hidden', 'true');
        if (sel >= 0) {                                  // swapping: stay put underneath until the new sheet has covered it
          d.classList.add('leaving');
          timers.set(d, setTimeout(() => d.classList.remove('leaving'), 900));
        }
      }
    });

    back.href = sel >= 0 ? '#' : 'productions.html';
    back.setAttribute('aria-label', sel >= 0 ? 'Back to the team' : 'Back');
  }
  addEventListener('hashchange', render);
  addEventListener('keydown', e => { if (e.key === 'Escape' && cur >= 0) location.hash = ''; });
  mobile.addEventListener('change', render);
  render();
})();
