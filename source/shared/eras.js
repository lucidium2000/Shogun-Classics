// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* "Choose your era": the strip on each game's title and game-over screens that
   jumps straight to the other two Shogun games. Same look in all three games.
   tools/eras.py inlines this file (and the cover thumbnails) into each page.
   A game calls ShogunEras.init('1996' | 'remastered' | 'ii', { place, slim }) once
   (place: an element to dock the strip inside, instead of the window; slim: the one-row size), then
   ShogunEras.show('title' | 'over' | 'won' | null) whenever its screen changes. */
window.ShogunEras = (() => {
  const THUMBS = /*THUMBS*/;
  const GAMES = {
    '1996': { year: '1996', name: 'Shogun', dir: 'shogun-1996', c: '#52eeee' },
    ii: { year: '2003', name: 'Shogun II', dir: 'shogun-ii', c: '#e2392c' },
    remastered: { year: '2026', name: 'Remastered', dir: 'shogun-remastered', c: '#e0a94a' },
  };
  const ORDER = ['1996', 'ii', 'remastered'];
  const HEAD = {
    // [heading, subline, short heading for the one-row size]
    title: ['Choose your era', 'Same tournament, three decades of pixels', 'Choose your era'],
    over: ['Defeated? Try another era', 'The tournament runs in three timelines', 'Defeated? Switch eras'],
    won: ['Champion. Now conquer another era', 'Your legend continues elsewhere', 'Conquer another era'],
    end: ['Fight on in another era', 'The tournament runs in three timelines', 'Fight on elsewhere'],
  };
  const DELAY = { title: 1400, over: 2200, won: 5000, end: 2200 };   // let the screen land first
  // one row: the heading stacks on the left, then the two games (big = desktop size)
  const slim = (r, big) => `
  ${r} .box { display: flex; align-items: center; gap: ${big ? 10 : 8}px; padding: ${big ? '7px 6px 7px 10px' : '5px 4px 5px 8px'}; }
  ${r} .kick { flex: none; width: ${big ? 116 : 92}px; margin: 0; font-size: ${big ? 20 : 16}px; line-height: .95; letter-spacing: .06em; white-space: normal; text-align: center; }
  ${r} .kick::before, ${r} .kick::after { display: none; }
  ${r} .kick .l { display: none; } ${r} .kick .s { display: inline; }
  ${r} .sub { display: none; }
  ${r} .row { flex: 1; min-width: 0; gap: ${big ? 8 : 6}px; }
  ${r} .x { position: static; flex: none; width: 22px; }
  ${r} a { padding: ${big ? '5px 10px 5px 5px' : '3px 8px 3px 4px'}; gap: ${big ? 10 : 8}px; }
  ${r} img { width: ${big ? 30 : 22}px; height: ${big ? 40 : 30}px; }
  ${r} .n { font-size: ${big ? 20 : 16}px; letter-spacing: ${big ? '.05em' : '.02em'}; }
  ${r} .y { font-size: ${big ? 18 : 16}px; }`;
  const CSS = `
#eras { position: fixed; z-index: 2147483000; left: 50%; bottom: max(14px, env(safe-area-inset-bottom, 0px));
  width: min(560px, calc(100% - 32px)); transform: translate(-50%, 18px); opacity: 0; pointer-events: none;
  transition: opacity .45s ease, transform .45s cubic-bezier(.2,.9,.3,1.2);
  font-family: "Barlow Condensed", "Arial Narrow", system-ui, sans-serif; color: #f1e6cf; line-height: normal; text-align: left; -webkit-tap-highlight-color: transparent; }
#eras.on { opacity: 1; transform: translate(-50%, 0); pointer-events: auto; }
#eras .box { position: relative; padding: 9px 10px 10px; border: 1px solid #4a3626; border-radius: 8px;
  background: linear-gradient(180deg, rgba(28,21,17,.94), rgba(12,9,8,.94)); box-shadow: 0 14px 40px rgba(0,0,0,.6), 0 0 0 1px rgba(0,0,0,.6);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
#eras .kick { display: flex; align-items: center; gap: 10px; margin: 0 26px 8px; font-family: "VT323", ui-monospace, monospace;
  font-size: 21px; line-height: 1; letter-spacing: .14em; text-transform: uppercase; color: #e0a94a; white-space: nowrap; }
#eras .kick::before, #eras .kick::after { content: ""; flex: 1; height: 1px; background: linear-gradient(90deg, transparent, #6b4a2c); }
#eras .kick::after { background: linear-gradient(90deg, #6b4a2c, transparent); }
#eras .kick span { overflow: hidden; text-overflow: ellipsis; }
#eras .kick .s { display: none; }
#eras .sub { display: block; margin: -4px 0 8px; text-align: center; font-size: 14px; letter-spacing: .08em; color: #a08f78; text-transform: uppercase; }
#eras .row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
#eras a { --c: #f1e6cf; position: relative; display: flex; align-items: center; gap: 10px; min-width: 0; padding: 6px 10px 6px 6px;
  color: inherit; text-decoration: none; background: #171210; border: 1px solid #34261e; border-left: 3px solid var(--c); border-radius: 5px;
  overflow: hidden; transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease; }
#eras a:hover, #eras a:focus-visible { transform: translateY(-2px); border-color: var(--c); box-shadow: 0 0 18px color-mix(in srgb, var(--c) 35%, transparent); outline: none; }
#eras a::after { content: ""; position: absolute; inset: 0; background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.16) 50%, transparent 70%);
  transform: translateX(-120%); pointer-events: none; }
#eras.on a::after { animation: erasGlint 1.1s ease .5s 1 both; }
#eras.on a + a::after { animation-delay: .7s; }
#eras img { flex: none; width: 36px; height: 48px; object-fit: cover; border-radius: 2px; box-shadow: 0 0 0 1px rgba(255,255,255,.08); }
#eras .t { display: flex; flex-direction: column; min-width: 0; line-height: 1.05; }
#eras .y { font-family: "VT323", ui-monospace, monospace; font-size: 18px; letter-spacing: .1em; color: var(--c); }
#eras .n { font-weight: 700; font-size: 20px; letter-spacing: .05em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#eras .go { margin-left: auto; flex: none; font-family: "VT323", ui-monospace, monospace; font-size: 20px; color: var(--c); }
#eras .x { position: absolute; top: 3px; right: 4px; width: 26px; height: 26px; padding: 0; border: 0; background: none; color: #a08f78;
  font: 20px/1 "VT323", ui-monospace, monospace; cursor: pointer; }
#eras .x:hover, #eras .x:focus-visible { color: #f1e6cf; outline: none; }
@keyframes erasGlint { to { transform: translateX(120%); } }
/* placed inside a game screen (the 1996 monitor): one row, docked to its bottom edge */
#eras.inset { position: absolute; bottom: 12px; width: min(600px, calc(100% - 24px)); }
${slim('#eras.inset', true)}
/* one row on the window too, for a game whose own menu sits low on the screen */
#eras.slim { width: min(600px, calc(100% - 32px)); }
${slim('#eras.slim', true)}
@media (max-height: 460px) {   /* phone held sideways: a small row between the on-screen sticks and buttons */
  #eras, #eras.slim { width: min(480px, calc(100% - 380px)); min-width: 330px; bottom: max(6px, env(safe-area-inset-bottom, 0px)); }
${slim('#eras')}${slim('#eras.slim')}${slim('#eras.inset')}
}
@media (prefers-reduced-motion: reduce) { #eras, #eras a { transition: none; } #eras.on a::after { animation: none; } }`;

  let self = null, el = null, kind = null, timer = 0, dismissed = null, place = null, slimOpt = false;
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
    box.innerHTML = '<div class="kick"><span class="l"></span><span class="s"></span></div><span class="sub"></span><div class="row"></div>' +
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
    if (place) el.classList.add('inset');
    if (slimOpt) el.classList.add('slim');
    (place || document.body).appendChild(el);
  }
  function render() {
    const h = HEAD[kind]; if (!h) return;
    el.querySelector('.kick .l').textContent = h[0];
    el.querySelector('.kick .s').textContent = h[2];
    el.querySelector('.sub').textContent = h[1];
    // after the 1996 ending ("TO BE CONTINUED IN SHOGUN II"), the sequel goes first
    const row = el.querySelector('.row'), order = kind === 'won' && self === '1996' ? ['ii', 'remastered'] : ORDER;
    for (const id of order) { const a = row.querySelector('a[data-g="' + id + '"]'); if (a) row.appendChild(a); }
  }
  return {
    init(id, opts) { self = id; place = opts && opts.place || null; slimOpt = !!(opts && opts.slim); },
    show(k) {
      k = k || null;
      if (k === kind) return;
      kind = k; clearTimeout(timer);
      if (dismissed && dismissed !== k) dismissed = null;   // a hidden strip comes back on the next screen
      if (!k) { if (el) el.classList.remove('on'); return; }
      timer = setTimeout(() => {
        if (kind !== k || dismissed === k || !document.body) return;
        build(); render(); el.classList.add('on');
      }, DELAY[k] || 1500);
    },
    get kind() { return kind; },
  };
})();
