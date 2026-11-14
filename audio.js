/* Builds the portfolio on the audio page from data/audio.js */
(() => {
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  const host = (url) => /spotify/.test(url) ? 'Spotify' : /youtu/.test(url) ? 'YouTube' : /instagram/.test(url) ? 'Instagram' : 'Link';

  /* ---- tiles: two columns, each tile goes to whichever column is currently shorter ---- */
  const work = document.getElementById('work');
  const mobile = matchMedia('(max-width: 760px)');
  function buildTiles() {
    work.textContent = '';
    const cols = [el('div', 'work__col'), el('div', 'work__col')];
    const heights = [0, 0];
    window.AUDIO_TILES.forEach(t => {
      const a = el(t.href ? 'a' : 'div', 'tile');
      if (t.href) { a.href = t.href; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', `${t.title} (opens ${host(t.href)})`); }
      const box = el('span', 'tile__img'); box.style.aspectRatio = `${t.w} / ${t.h}`;
      const img = el('img'); img.src = t.img; img.alt = ''; img.loading = 'lazy'; img.width = t.w; img.height = t.h;
      box.appendChild(img);
      const cap = el('span', 'tile__cap'); cap.append(el('span', '', t.title), el('span', '', t.cat));
      a.append(box, cap);
      const i = mobile.matches ? 0 : (heights[0] <= heights[1] ? 0 : 1);
      cols[i].appendChild(a);
      heights[i] += t.h / t.w + 0.14;                // image + caption
    });
    work.append(...cols);
  }
  buildTiles();
  mobile.addEventListener('change', buildTiles);

  /* ---- lists ---- */
  const lists = document.getElementById('lists');
  window.AUDIO_LISTS.forEach(L => {
    const sec = el('section', 'list');
    sec.appendChild(el('h2', 'display list__title', L.heading));
    L.groups.forEach(g => {
      const grp = el('div', 'group');
      grp.appendChild(el('h3', 'group__artist', g.artist));
      const ul = el('ul');
      g.items.forEach(it => {
        const li = el('li');
        const row = el(it.href ? 'a' : 'span', 'row');
        if (it.href) { row.href = it.href; row.target = '_blank'; row.rel = 'noopener'; }
        row.appendChild(el('span', '', it.t));
        const tag = [it.type, it.href ? host(it.href) + ' ↗︎' : ''].filter(Boolean).join(' · ');
        if (tag) row.appendChild(el('small', '', tag));
        li.appendChild(row); ul.appendChild(li);
      });
      grp.appendChild(ul); sec.appendChild(grp);
    });
    lists.appendChild(sec);
  });
})();
