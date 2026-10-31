// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* "Choose your era": a corner card on each game's title and game-over screens that
   jumps straight to the other two Shogun games. Same look in all three games.
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
  const HEAD = {
    title: 'Choose your era',
    over: 'Lost? Switch eras',
    won: 'Conquer another era',
    end: 'Fight on elsewhere',
  };
  const DELAY = { title: 1400, over: 2200, won: 5000, end: 2200 };   // let the screen land first
  // a small card in the top-left corner, beside the game's own menu button
  const CSS = `
#eras { position: fixed; z-index: 2147483000; top: max(10px, env(safe-area-inset-top, 0px)); left: max(10px, env(safe-area-inset-left, 0px));
  width: 222px; transform: translateX(-24px); opacity: 0; pointer-events: none;
  transition: opacity .45s ease, transform .45s cubic-bezier(.2,.9,.3,1.2);
  font-family: "Barlow Condensed", "Arial Narrow", system-ui, sans-serif; color: #f1e6cf; line-height: normal; text-align: left; -webkit-tap-highlight-color: transparent; }
#eras.on { opacity: 1; transform: none; pointer-events: auto; }
#eras .box { position: relative; padding: 7px 7px 8px; border: 1px solid #4a3626; border-radius: 8px;
  background: linear-gradient(180deg, rgba(28,21,17,.94), rgba(12,9,8,.94)); box-shadow: 0 12px 32px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.6);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
#eras .kick { margin: 0 24px 6px 3px; font-family: "VT323", ui-monospace, monospace; font-size: 19px; line-height: 1; letter-spacing: .1em;
  text-transform: uppercase; color: #e0a94a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#eras .row { display: grid; gap: 5px; }
#eras a { --c: #f1e6cf; position: relative; display: flex; align-items: center; gap: 9px; min-width: 0; padding: 4px 9px 4px 4px;
  color: inherit; text-decoration: none; background: #171210; border: 1px solid #34261e; border-left: 3px solid var(--c); border-radius: 5px;
  overflow: hidden; transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease; }
#eras a:hover, #eras a:focus-visible { transform: translateX(2px); border-color: var(--c); box-shadow: 0 0 16px color-mix(in srgb, var(--c) 35%, transparent); outline: none; }
#eras a::after { content: ""; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.16) 50%, transparent 70%);
  transform: translateX(-120%); pointer-events: none; }
#eras.on a::after { animation: erasGlint 1.1s ease .5s 1 both; }
#eras.on a + a::after { animation-delay: .7s; }
#eras img { flex: none; width: 27px; height: 36px; object-fit: cover; border-radius: 2px; box-shadow: 0 0 0 1px rgba(255,255,255,.08); }
#eras .t { display: flex; flex-direction: column; min-width: 0; line-height: 1.02; }
#eras .y { font-family: "VT323", ui-monospace, monospace; font-size: 16px; letter-spacing: .1em; color: var(--c); }
#eras .n { font-weight: 700; font-size: 18px; letter-spacing: .04em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#eras .go { margin-left: auto; flex: none; font-family: "VT323", ui-monospace, monospace; font-size: 18px; color: var(--c); }
#eras .x { position: absolute; top: 2px; right: 3px; width: 24px; height: 24px; padding: 0; border: 0; background: none; color: #a08f78;
  font: 19px/1 "VT323", ui-monospace, monospace; cursor: pointer; }
#eras .x:hover, #eras .x:focus-visible { color: #f1e6cf; outline: none; }
@keyframes erasGlint { to { transform: translateX(120%); } }
@media (max-height: 460px) {   /* phone held sideways: a little smaller */
  #eras { width: 190px; top: max(6px, env(safe-area-inset-top, 0px)); left: max(6px, env(safe-area-inset-left, 0px)); }
  #eras .box { padding: 5px 5px 6px; }
  #eras .kick { font-size: 16px; margin-bottom: 4px; }
  #eras .row { gap: 4px; }
  #eras a { padding: 2px 8px 2px 3px; gap: 7px; }
  #eras img { width: 20px; height: 27px; }
  #eras .n { font-size: 16px; }
  #eras .y { font-size: 14px; }
}
@media (prefers-reduced-motion: reduce) { #eras, #eras a { transition: none; } #eras.on a::after { animation: none; } }`;

  let self = null, el = null, kind = null, timer = 0, dismissed = null, beside = null, below = false;
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
    box.innerHTML = '<div class="kick"></div><div class="row"></div>' +
      '<button type="button" class="x" aria-label="Hide">&#10005;</button>';
    const row = box.querySelector('.row');
    for (const id of ORDER) {
      if (id === self) continue;
      const g = GAMES[id], a = document.createElement('a');
      a.dataset.g = id; a.href = '../' + g.dir + '/index.html'; a.target = '_top'; a.style.setProperty('--c', g.c);
      a.innerHTML = '<img alt="" src="' + THUMBS[id] + '"><span class="t"><span class="y">' + g.year + '</span><span class="n">' + g.name + '</span></span><span class="go">&#9654;</span>';
      a.setAttribute('aria-label', 'Play ' + g.name + ' (' + g.year + ')');
      a.addEventListener('click', e => go(id, e));
      // keep taps and keys on the strip from reaching the game underneath
      for (const t of ['pointerdown', 'touchstart', 'mousedown', 'keydown']) a.addEventListener(t, e => e.stopPropagation());
      row.appendChild(a);
    }
    const x = box.querySelector('.x');
    x.addEventListener('click', e => { e.stopPropagation(); dismissed = kind; el.classList.remove('on'); });
    for (const t of ['pointerdown', 'touchstart', 'mousedown']) x.addEventListener(t, e => e.stopPropagation());
    el.appendChild(box);
    document.body.appendChild(el);
  }
  function render() {
    const h = HEAD[kind]; if (!h) return;
    el.querySelector('.kick').textContent = h;
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
      if (dismissed && dismissed !== k) dismissed = null;   // a hidden strip comes back on the next screen
      if (!k) { if (el) el.classList.remove('on'); return; }
      timer = setTimeout(() => {
        if (kind !== k || dismissed === k || !document.body) return;
        build(); render(); placeIt(); el.classList.add('on');
      }, DELAY[k] || 1500);
    },
    get kind() { return kind; },
  };
})();
