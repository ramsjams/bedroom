/* Navigation sets. The navbar changes with the section you're in:
   productions (default) / records / media. HOME is always the centre item.
   Each entry: key (also the PNG name in assets/nav/), label (alt text), href.
   Pages that don't exist yet point to "#name" – change them when you add the page. */
window.BP_NAV = {
  productions: [
    { key: 'contact',  label: 'Contact',  href: 'contact.html' },
    { key: 'merch',    label: 'Merch',    href: 'merch.html' },
    { key: 'home',     label: 'Home',     href: 'index.html' },
    { key: 'about',    label: 'About',    href: 'about.html' },
    { key: 'team',     label: 'Team',     href: 'productions.html' },
  ],
  records: [
    { key: 'merch',    label: 'Merch',    href: 'merch.html' },
    { key: 'shows',    label: 'Shows',    href: 'shows.html' },
    { key: 'home',     label: 'Home',     href: 'index.html#records' },
    { key: 'releases', label: 'Releases', href: 'releases.html' },
    { key: 'artists',  label: 'Artists',  href: 'artists.html' },
  ],
  shop: [
    { key: 'home',     label: 'Home',     href: 'index.html' },
    { key: 'merch',    label: 'Merch',    href: 'merch.html' },
    { key: 'cart',     label: 'Cart',     href: 'cart.html' },
  ],
  media: [
    { key: 'blogs',    label: 'Blogs',    href: '#blogs' },
    { key: 'merch',    label: 'Merch',    href: 'merch.html' },
    { key: 'home',     label: 'Home',     href: 'index.html#media' },
    { key: 'team',     label: 'Team',     href: '#media-team' },
    { key: 'contact',  label: 'Contact',  href: 'contact.html' },
  ],
};

/* fills <nav> with a set; `current` = key of the page you're on (gets the underline) */
window.bpNav = function (nav, set, current) {
  nav.textContent = ''; nav.dataset.n = window.BP_NAV[set].length;
  window.BP_NAV[set].forEach(it => {
    const a = document.createElement('a');
    a.className = 'nav__link'; a.href = it.href; a.dataset.key = it.key;
    if (it.key === current) a.setAttribute('aria-current', 'page');
    const img = document.createElement('img'); img.src = `assets/nav/${it.key}.png`; img.alt = it.label;
    a.appendChild(img); nav.appendChild(a);
    if (it.key === 'cart') { const b = document.createElement('span'); b.className = 'nav__badge'; b.id = 'cart-badge'; b.hidden = true; a.appendChild(b); }
  });
};
