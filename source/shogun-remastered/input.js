// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* Keyboard, touch and gamepad, folded into two virtual pads.
   Each pad has held buttons (l r u d p sp) and an event queue. Number keys
   still work the 1996 way: 8 up, 2 down, 4 back, 6 forward, space punches. */
const Input = (() => {
  const I = { pads: [mk(), mk()], menu: [], twoP: false, touch: false, lastDevice: 'keys' };
  function mk() { return { l: 0, r: 0, u: 0, d: 0, p: 0, sp: 0, ev: [], src: {} }; }
  const MAP1 = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd',
    Space: 'p', KeyJ: 'p', KeyF: 'p', KeyZ: 'p', KeyK: 'sp', KeyX: 'sp', ShiftLeft: 'sp',
    Numpad4: 'l', Numpad6: 'r', Numpad8: 'u', Numpad2: 'd', Numpad5: 'p', Numpad0: 'p', Digit4: 'l', Digit6: 'r', Digit8: 'u', Digit2: 'd', Digit5: 'p', Digit0: 'p' };
  const MAP2_P1 = { KeyA: 'l', KeyD: 'r', KeyW: 'u', KeyS: 'd', KeyF: 'p', KeyG: 'sp', Space: 'p', Digit4: 'l', Digit6: 'r', Digit8: 'u', Digit2: 'd', Digit5: 'p' };
  const MAP2_P2 = { ArrowLeft: 'l', ArrowRight: 'r', ArrowUp: 'u', ArrowDown: 'd', KeyL: 'p', Semicolon: 'sp', KeyK: 'sp', Enter: 'p',
    Numpad4: 'l', Numpad6: 'r', Numpad8: 'u', Numpad2: 'd', Numpad5: 'p', Numpad0: 'p', NumpadEnter: 'sp' };
  const DIGIT = { Digit1: 1, Digit3: 3, Digit7: 7, Digit9: 9, Numpad1: 1, Numpad3: 3, Numpad7: 7, Numpad9: 9 };

  function press(pi, b, src) {
    const P = I.pads[pi]; P.src[b] = (P.src[b] || 0) | src;
    if (!P[b]) { P[b] = 1; P.ev.push({ b, t: performance.now() }); }
  }
  function release(pi, b, src) {
    const P = I.pads[pi]; P.src[b] = (P.src[b] || 0) & ~src;
    if (!P.src[b]) P[b] = 0;
  }
  I.press = press; I.release = release;

  addEventListener('keydown', e => {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    I.lastDevice = 'keys';
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    if (e.repeat) return;
    const m = menuKey(e); if (m) I.menu.push(m);
    if (I.twoP) {
      if (MAP2_P1[e.code]) press(0, MAP2_P1[e.code], 1);
      if (MAP2_P2[e.code]) press(1, MAP2_P2[e.code], 1);
    } else {
      if (MAP1[e.code]) press(0, MAP1[e.code], 1);
      if (DIGIT[e.code]) I.pads[0].ev.push({ b: 'digit', d: DIGIT[e.code], t: performance.now() });
    }
  });
  addEventListener('keyup', e => {
    if (I.twoP) {
      if (MAP2_P1[e.code]) release(0, MAP2_P1[e.code], 1);
      if (MAP2_P2[e.code]) release(1, MAP2_P2[e.code], 1);
    } else if (MAP1[e.code]) release(0, MAP1[e.code], 1);
  });
  addEventListener('blur', () => { for (const P of I.pads) { for (const b of ['l', 'r', 'u', 'd', 'p', 'sp']) { P[b] = 0; P.src[b] = 0; } } });

  function menuKey(e) {
    const c = e.code;
    if (c === 'Escape' || c === 'KeyP') return { m: 'pause' };
    if (c === 'Enter' || c === 'NumpadEnter' || c === 'Space') return { m: 'ok' };
    if (c === 'ArrowUp' || c === 'KeyW' || c === 'Numpad8') return { m: 'up' };
    if (c === 'ArrowDown' || c === 'KeyS' || c === 'Numpad2') return { m: 'down' };
    if (c === 'ArrowLeft' || c === 'KeyA' || c === 'Numpad4') return { m: 'left' };
    if (c === 'ArrowRight' || c === 'KeyD' || c === 'Numpad6') return { m: 'right' };
    if (c === 'Backspace') return { m: 'back' };
    if (e.key && e.key.length === 1) return { m: 'char', k: e.key };
    return null;
  }

  I.take = function (pi) { const P = I.pads[pi]; const e = P.ev; P.ev = []; return e; };
  I.takeMenu = function () { const m = I.menu; I.menu = []; return m; };
  I.clear = function () { I.menu = []; for (const P of I.pads) P.ev = []; };

  /* ----------------------------------------------------------- gamepad */
  const gpPrev = {};
  I.pollPads = function () {
    if (!navigator.getGamepads) return;
    const gps = navigator.getGamepads(); let slot = 0;
    for (const gp of gps) {
      if (!gp) continue;
      const pi = I.twoP ? Math.min(1, slot) : 0; slot++;
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0, B = i => gp.buttons[i] && gp.buttons[i].pressed;
      const st = { l: B(14) || ax < -0.5, r: B(15) || ax > 0.5, u: B(12) || ay < -0.5, d: B(13) || ay > 0.5, p: B(0) || B(2), sp: B(1) || B(3) };
      const prev = gpPrev[gp.index] || {};
      for (const b in st) { if (st[b] && !prev[b]) { press(pi, b, 4); I.lastDevice = 'pad'; } if (!st[b] && prev[b]) release(pi, b, 4); }
      const menu = { up: st.u, down: st.d, left: st.l, right: st.r, ok: B(0) || B(9), back: B(1), pause: B(9) };
      const pm = prev.menu || {};
      for (const k in menu) if (menu[k] && !pm[k]) I.menu.push({ m: k === 'ok' && B(9) && !B(0) ? 'pause' : k });
      st.menu = menu; gpPrev[gp.index] = st;
    }
  };

  /* -------------------------------------------------------------- touch */
  I.bindTouch = function (root) {
    bindSet(root, 0, '#dpad', '#knob', '#btnP', '#btnSP');
    bindSet(root, 1, '#dpad2', '#knob2', '#btnP2', '#btnSP2');
    root.querySelector('#btnPause').addEventListener('pointerdown', e => { e.preventDefault(); I.menu.push({ m: 'pause' }); });
  };
  function bindSet(root, pi, padSel, knobSel, pSel, spSel) {
    const pad = root.querySelector(padSel), knob = root.querySelector(knobSel);
    let pid = null, cur = '';
    const setDir = (dir) => {
      for (const b of ['l', 'r', 'u', 'd']) if (dir.includes(b) && !cur.includes(b)) press(pi, b, 2);
      for (const b of ['l', 'r', 'u', 'd']) if (!dir.includes(b) && cur.includes(b)) release(pi, b, 2);
      cur = dir;
    };
    const move = (e) => {
      const r = pad.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy), rad = r.width / 2;
      const k = Math.min(1, d / rad); knob.style.transform = `translate(${dx / d * k * rad * 0.45 || 0}px,${dy / d * k * rad * 0.45 || 0}px)`;
      if (d < rad * 0.22) return setDir('');
      const a = Math.atan2(dy, dx) * 180 / Math.PI; let dir = '';
      if (a > -67.5 && a < 67.5) dir += 'r'; if (a > 112.5 || a < -112.5) dir += 'l';
      if (a < -22.5 && a > -157.5) dir += 'u'; if (a > 22.5 && a < 157.5) dir += 'd';
      setDir(dir);
    };
    pad.addEventListener('pointerdown', e => { e.preventDefault(); I.touch = true; pid = e.pointerId; pad.setPointerCapture(pid); move(e); padMenu(e); });
    pad.addEventListener('pointermove', e => { if (e.pointerId === pid) move(e); });
    const end = e => { if (e.pointerId !== pid) return; pid = null; setDir(''); knob.style.transform = ''; };
    pad.addEventListener('pointerup', end); pad.addEventListener('pointercancel', end);
    function padMenu(e) {
      const r = pad.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < r.width * 0.11) return;
      I.menu.push({ m: Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up') });
    }
    for (const [sel, b] of [[pSel, 'p'], [spSel, 'sp']]) {
      const el = root.querySelector(sel);
      el.addEventListener('pointerdown', e => { e.preventDefault(); I.touch = true; el.classList.add('on'); press(pi, b, 2); if (b === 'p') I.menu.push({ m: 'ok', touch: true }); });
      const up = () => { el.classList.remove('on'); release(pi, b, 2); };
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('pointerleave', up);
    }
  }
  return I;
})();
