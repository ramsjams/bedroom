/* Merch + cart. The cart lives in the browser (localStorage) so it survives page changes. */
(() => {
  const ITEMS = window.MERCH, byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  let mem = {};
  const load = () => { try { return JSON.parse(localStorage.getItem('bp-cart')) || {}; } catch (e) { return mem; } };
  const save = (c) => { mem = c; try { localStorage.setItem('bp-cart', JSON.stringify(c)); } catch (e) {} badge(); };
  const clean = (c) => { Object.keys(c).forEach(k => { if (!byId[k] || c[k] < 1) delete c[k]; }); return c; };
  const count = () => Object.values(clean(load())).reduce((a, b) => a + b, 0);
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  function badge() { const b = document.getElementById('cart-badge'); if (!b) return; const n = count(); b.textContent = n; b.hidden = !n; }
  badge();

  /* ---- merch page ---- */
  const grid = document.getElementById('grid');
  if (grid) ITEMS.forEach(it => {
    const li = el('li', 'prod' + (it.soldOut ? ' is-out' : ''));
    const pic = el('div', 'prod__pic'); const im = el('img'); im.src = it.img; im.alt = it.title; im.loading = 'lazy'; im.draggable = false; pic.appendChild(im);
    if (it.soldOut) pic.appendChild(el('span', 'prod__sold', 'SOLD OUT'));
    const b = el('button', 'prod__btn', 'ADD TO CART'); b.type = 'button';
    if (it.soldOut) { b.disabled = true; b.setAttribute('aria-label', it.title + ' - sold out'); }
    else b.addEventListener('click', () => {
      const c = clean(load()); c[it.id] = (c[it.id] || 0) + 1; save(c);
      b.textContent = 'ADDED'; b.classList.add('ok'); clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = 'ADD TO CART'; b.classList.remove('ok'); }, 1100);
    });
    const href = 'product.html?id=' + encodeURIComponent(it.id);
    const pa = el('a', 'prod__link'); pa.href = href; pa.setAttribute('aria-label', it.title + ' - view details'); pa.appendChild(pic);
    const ta = el('a', 'prod__link'); ta.href = href; ta.appendChild(el('h2', 'prod__title', it.title));
    li.append(pa, ta, el('p', 'prod__price', it.price + ' TND'), b);
    grid.appendChild(li);
  });

  /* ---- product page ---- */
  const pr = document.getElementById('product');
  if (pr) {
    const it = byId[new URLSearchParams(location.search).get('id')];
    if (!it) { pr.append(el('p', 'cart__empty', 'ITEM NOT FOUND')); const a = el('a', 'prod__btn cart__go', 'BACK TO MERCH'); a.href = 'merch.html'; pr.appendChild(a); }
    else {
      document.title = it.title + ' · Bedroom';
      const back = el('a', 'pp__back', '< BACK TO MERCH'); back.href = 'merch.html';
      const pic = el('div', 'pp__pic'); const im = el('img'); im.src = it.img; im.alt = it.title; im.draggable = false; pic.appendChild(im);
      if (it.soldOut) pic.appendChild(el('span', 'prod__sold', 'SOLD OUT'));
      const info = el('div', 'pp__info');
      info.append(el('h1', 'pp__title', it.title), el('p', 'pp__price', it.price + ' TND'));
      if (it.desc) info.appendChild(el('p', 'pp__desc', it.desc));
      if (it.details && it.details.length) { const ul = el('ul', 'pp__list'); it.details.forEach(t => ul.appendChild(el('li', '', t))); info.appendChild(ul); }
      const b = el('button', 'prod__btn pp__add', it.soldOut ? 'SOLD OUT' : 'ADD TO CART'); b.type = 'button';
      if (it.soldOut) b.disabled = true;
      else b.addEventListener('click', () => {
        const c = clean(load()); c[it.id] = (c[it.id] || 0) + 1; save(c);
        b.textContent = 'ADDED'; b.classList.add('ok'); clearTimeout(b._t); b._t = setTimeout(() => { b.textContent = 'ADD TO CART'; b.classList.remove('ok'); }, 1100);
      });
      info.appendChild(b);
      const wrap = el('div', 'pp'); wrap.append(pic, info); pr.append(back, wrap);
    }
  }

  /* ---- cart page ---- */
  const root = document.getElementById('cart');
  if (root) {
    const render = () => {
      const c = clean(load()), ids = Object.keys(c); root.textContent = '';
      if (!ids.length) {
        root.append(el('p', 'cart__empty', 'YOUR CART IS EMPTY'));
        const a = el('a', 'prod__btn cart__go', 'GO TO MERCH'); a.href = 'merch.html'; root.appendChild(a); return;
      }
      const ul = el('ul', 'cart__list'); let total = 0;
      ids.forEach(id => {
        const it = byId[id], q = c[id]; total += it.price * q;
        const li = el('li', 'cart__row');
        const im = el('img'); im.src = it.img; im.alt = ''; 
        const info = el('div', 'cart__info'); info.append(el('h2', '', it.title), el('p', '', it.price + ' TND'));
        const qty = el('div', 'cart__qty');
        const mk = (t, d, lab) => { const b = el('button', '', t); b.type = 'button'; b.setAttribute('aria-label', lab); b.addEventListener('click', () => { const n = clean(load()); n[id] = (n[id] || 0) + d; save(clean(n)); render(); }); return b; };
        qty.append(mk('−', -1, 'Remove one'), el('span', '', q), mk('+', 1, 'Add one'));
        const sum = el('p', 'cart__sum', (it.price * q) + ' TND');
        const rm = el('button', 'cart__rm', 'REMOVE'); rm.type = 'button'; rm.addEventListener('click', () => { const n = clean(load()); delete n[id]; save(n); render(); });
        li.append(im, info, qty, sum, rm); ul.appendChild(li);
      });
      const foot = el('div', 'cart__foot');
      foot.append(el('p', 'cart__total', 'TOTAL  ' + total + ' TND'));
      const go = el('button', 'prod__btn cart__go', 'PLACE ORDER'); go.type = 'button';
      const note = el('p', 'cart__note', 'Delivery and payment are arranged with us directly after you place the order.'); note.setAttribute('aria-live', 'polite');
      go.addEventListener('click', () => {
        const lines = ids.map(id => `${c[id]} x ${byId[id].title} (${byId[id].price * c[id]} TND)`);
        const text = 'BEDROOM ORDER\n' + lines.join('\n') + '\nTOTAL: ' + total + ' TND';
        try { navigator.clipboard.writeText(text); } catch (e) {}
        window.open(window.ORDER_LINK || 'https://www.instagram.com/bedroom.recordings/', '_blank', 'noopener');
        note.textContent = 'Your order is copied - paste it in the message we just opened.';
      });
      foot.append(go, note); root.append(ul, foot);
    };
    render();
  }
})();
