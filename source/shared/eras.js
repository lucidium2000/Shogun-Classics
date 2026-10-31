// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* "Other Shogun games": a quiet corner label on each game's title and game-over
   screens that opens to the other two Shogun games. Same look in all three games.
   tools/eras.py inlines this file (and the cover thumbnails) into each page.
   A game calls ShogunEras.init('1996' | 'remastered' | 'ii', { beside, below }) once
   (beside: its menu button, or a function returning it; below: sit under it, not to its right), then
   ShogunEras.show('title' | 'over' | 'won' | 'end' | null) whenever its screen changes. */
window.ShogunEras = (() => {
  const THUMBS = /*THUMBS*/;
  const GAMES = {
    '1996': { year: '1996', name: 'Shogun', dir: 'shogun-1996', c: '#52eeee' },
    ii: { year: '2003', name: 'Shogun II', dir: 'shogun-ii', c: '#e2392c' },
    remastered: { year: '2026', name: 'Remastered', dir: 'shogun-remastered', c: '#e0a94a' },
  };
  const ORDER = ['1996', 'ii', 'remastered'];
  const LABEL = 'Other Shogun games';
  const DELAY = { title: 2500, over: 3000, won: 5000, end: 3000 };   // let the screen land first
  // a quiet label in the top-left corner, beside the game's own menu button;
  // it opens to the two games on hover or tap, and never pops them up on its own
  const CSS = `
#eras { position: fixed; z-index: 2147483000; top: max(10px, env(safe-area-inset-top, 0px)); left: max(10px, env(safe-area-inset-left, 0px));
  width: 210px; opacity: 0; pointer-events: none; transition: opacity .8s ease;
  font-family: "Barlow Condensed", "Arial Narrow", system-ui, sans-serif; color: #f1e6cf; line-height: normal; text-align: left; -webkit-tap-highlight-color: transparent; }
#eras.on { opacity: 1; pointer-events: auto; }
#eras .pill { display: inline-flex; align-items: center; gap: 7px; height: 28px; padding: 0 10px; border: 1px solid rgba(160,143,120,.35); border-radius: 6px;
  background: rgba(12,9,8,.55); color: #a08f78; font: 17px/1 "VT323", ui-monospace, monospace; letter-spacing: .1em; text-transform: uppercase; cursor: pointer;
  transition: color .2s ease, border-color .2s ease, background .2s ease; }
#eras .pill i { font-style: normal; font-size: 13px; transition: transform .2s ease; }
#eras .pill:hover, #eras .pill:focus-visible, #eras.open .pill { color: #f1e6cf; border-color: #6b4a2c; background: rgba(12,9,8,.85); outline: none; }
#eras.open .pill i { transform: rotate(90deg); }
#eras .row { display: grid; gap: 5px; margin-top: 6px; padding: 6px; border: 1px solid #4a3626; border-radius: 8px;
  background: linear-gradient(180deg, rgba(28,21,17,.95), rgba(12,9,8,.95)); box-shadow: 0 12px 32px rgba(0,0,0,.6);
  opacity: 0; transform: translateY(-4px); visibility: hidden; transition: opacity .18s ease, transform .18s ease, visibility 0s .18s; }
#eras.open .row { opacity: 1; transform: none; visibility: visible; transition: opacity .18s ease, transform .18s ease; }
#eras a { --c: #f1e6cf; display: flex; align-items: center; gap: 9px; min-width: 0; padding: 4px 9px 4px 4px;
  color: inherit; text-decoration: none; background: #171210; border: 1px solid #34261e; border-left: 3px solid var(--c); border-radius: 5px;
  transition: border-color .15s ease, box-shadow .15s ease; }
#eras a:hover, #eras a:focus-visible { border-color: var(--c); box-shadow: 0 0 14px color-mix(in srgb, var(--c) 30%, transparent); outline: none; }
#eras img { flex: none; width: 27px; height: 36px; object-fit: cover; border-radius: 2px; box-shadow: 0 0 0 1px rgba(255,255,255,.08); }
#eras .t { display: flex; flex-direction: column; min-width: 0; line-height: 1.02; }
#eras .y { font-family: "VT323", ui-monospace, monospace; font-size: 16px; letter-spacing: .1em; color: var(--c); }
#eras .n { font-weight: 700; font-size: 18px; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#eras .go { margin-left: auto; flex: none; font-family: "VT323", ui-monospace, monospace; font-size: 18px; color: var(--c); }
@media (max-height: 460px) {   /* phone held sideways: a little smaller */
  #eras { width: 186px; top: max(6px, env(safe-area-inset-top, 0px)); left: max(6px, env(safe-area-inset-left, 0px)); }
  #eras .pill { height: 26px; font-size: 15px; padding: 0 8px; }
  #eras .row { gap: 4px; padding: 5px; }
  #eras a { padding: 2px 8px 2px 3px; gap: 7px; }
  #eras img { width: 20px; height: 27px; }
  #eras .n { font-size: 16px; }
  #eras .y { font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) { #eras, #eras .row, #eras .pill i { transition: none; } }`;

  let self = null, el = null, kind = null, timer = 0, beside = null, below = false;
  // sit just right of (or under) the game's menu button when it is showing
  function placeIt() {
    if (!el) return;
    const b = typeof beside === 'function' ? beside() : beside, r = b && b.getClientRects().length ? b.getBoundingClientRect() : null;
    el.style.position = r && below ? 'absolute' : '';
    el.style.left = r ? Math.round(below ? r.left + scrollX : r.right + 8) + 'px' : '';
    el.style.top = r ? Math.round(below ? r.bottom + scrollY + 8 : r.top) + 'px' : '';
  }
  addEventListener('resize', placeIt);
  const inMenu = () => { try { return parent !== window && parent.location.origin === location.origin; } catch (e) { return false; } };
  function go(id, e) {
    if (inMenu()) { e.preventDefault(); parent.postMessage('shogun:play:' + id, location.origin); }
    // otherwise the link's own href (the sibling game's folder) does the work
  }
  function build() {
    if (el) return;
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    if (!document.querySelector('link[href*="Barlow+Condensed"]')) {
      const f = document.createElement('link'); f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=VT323&display=swap';
      document.head.appendChild(f);
    }
    el = document.createElement('nav'); el.id = 'eras'; el.setAttribute('aria-label', 'Other Shogun games');
    const box = document.createElement('div'); box.className = 'box';
    box.innerHTML = '<button type="button" class="pill" aria-expanded="false">' + LABEL + ' <i aria-hidden="true">&#9656;</i></button><div class="row"></div>';
    const row = box.querySelector('.row'), pill = box.querySelector('.pill');
    for (const id of ORDER) {
      if (id === self) continue;
      const g = GAMES[id], a = document.createElement('a');
      a.dataset.g = id; a.href = '../' + g.dir + '/index.html'; a.target = '_top'; a.style.setProperty('--c', g.c);
      a.innerHTML = '<img alt="" src="' + THUMBS[id] + '"><span class="t"><span class="y">' + g.year + '</span><span class="n">' + g.name + '</span></span><span class="go">&#9654;</span>';
      a.setAttribute('aria-label', 'Play ' + g.name + ' (' + g.year + ')');
      a.addEventListener('click', e => go(id, e));
      row.appendChild(a);
    }
    const open = on => { el.classList.toggle('open', on); pill.setAttribute('aria-expanded', String(on)); };
    pill.addEventListener('click', e => { e.stopPropagation(); open(!el.classList.contains('open')); });
    // a mouse opens it by hovering; a tap anywhere else closes it
    if (matchMedia('(hover: hover)').matches) { el.addEventListener('mouseenter', () => open(true)); el.addEventListener('mouseleave', () => open(false)); }
    const away = e => { if (el.classList.contains('open') && !el.contains(e.target)) open(false); };
    addEventListener('pointerdown', away, true); addEventListener('touchstart', away, true);
    // keep taps and keys on it from reaching the game underneath
    for (const t of ['pointerdown', 'touchstart', 'mousedown', 'keydown']) el.addEventListener(t, e => e.stopPropagation());
    el.appendChild(box);
    document.body.appendChild(el);
  }
  function render() {
    // after the 1996 ending ("TO BE CONTINUED IN SHOGUN II"), the sequel goes first
    const row = el.querySelector('.row'), order = kind === 'won' && self === '1996' ? ['ii', 'remastered'] : ORDER;
    for (const id of order) { const a = row.querySelector('a[data-g="' + id + '"]'); if (a) row.appendChild(a); }
  }
  return {
    init(id, opts) { self = id; beside = opts && opts.beside || null; below = !!(opts && opts.below); },
    show(k) {
      k = k || null;
      if (k === kind) return;
      kind = k; clearTimeout(timer);
      if (!k) { if (el) el.classList.remove('on', 'open'); return; }
      timer = setTimeout(() => {
        if (kind !== k || !document.body) return;
        build(); render(); placeIt(); el.classList.add('on');
      }, DELAY[k] || 1500);
    },
    get kind() { return kind; },
  };
})();
