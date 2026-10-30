// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
/* Stages. Each one pre-renders its static parallax layers once and then
   animates only the cheap things (sway, flicker, mist) every frame. */
const Stages = (() => {
  const W = 960, H = 540, GROUND = 468, ARENA = 1180;
  const S = { W, H, GROUND, ARENA };
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function layer(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; }
  function ridge(ctx, w, base, amp, step, col, r, jag) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, H);
    let y = base;
    for (let x = 0; x <= w + step; x += step) { y = base - amp * (0.5 + 0.5 * Math.sin(x * 0.004 + r() * 0.6)) - r() * jag; ctx.lineTo(x, y); }
    ctx.lineTo(w, H); ctx.closePath(); ctx.fill();
  }
  const pw = f => Math.ceil(W + (ARENA - W) * f) + 4; // width a layer needs at parallax f

  function stoneFloor(ctx, top, cols) {
    const g = ctx.createLinearGradient(0, top, 0, H);
    g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]);
    ctx.fillStyle = g; ctx.fillRect(0, top, ARENA, H - top);
    ctx.strokeStyle = cols[2]; ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) { const y = top + Math.pow(i / 6, 1.6) * (H - top); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA, y); ctx.stroke(); }
    for (let x = -600; x < ARENA + 600; x += 70) { ctx.beginPath(); ctx.moveTo(ARENA / 2 + (x - ARENA / 2) * 0.55, top); ctx.lineTo(x, H); ctx.stroke(); }
  }

  /* ---------------------------------------------- 1: temple courtyard, dusk */
  function courtyard() {
    const r = rng(11);
    const sky = layer(W, H, (c) => {
      const g = c.createLinearGradient(0, 0, 0, H * 0.8);
      g.addColorStop(0, '#1d0f2a'); g.addColorStop(0.45, '#6b2440'); g.addColorStop(0.75, '#d0582c'); g.addColorStop(1, '#f6b45a');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      const sg = c.createRadialGradient(700, 330, 10, 700, 330, 260);
      sg.addColorStop(0, 'rgba(255,230,160,0.95)'); sg.addColorStop(0.18, 'rgba(255,190,110,0.6)'); sg.addColorStop(1, 'rgba(255,120,60,0)');
      c.fillStyle = sg; c.fillRect(0, 0, W, H);
      c.fillStyle = '#ffe7a8'; c.beginPath(); c.arc(700, 330, 58, 0, 7); c.fill();
      c.globalAlpha = 0.25; c.fillStyle = '#7a2b3c';
      for (let i = 0; i < 6; i++) { c.fillRect(0, 300 + i * 9 + r() * 6, W, 2); }
      c.globalAlpha = 1;
    });
    const far = layer(pw(0.12), H, (c, w) => { ridge(c, w, 360, 90, 40, '#5a2340', r, 18); });
    const mid = layer(pw(0.25), H, (c, w) => {
      ridge(c, w, 400, 60, 30, '#3f1832', r, 10);
      // pagoda silhouette
      c.fillStyle = '#26101f'; const px = 300;
      c.fillRect(px - 6, 170, 12, 240);
      for (let i = 0; i < 5; i++) {
        const y = 210 + i * 42, wd = 60 + i * 16;
        c.beginPath(); c.moveTo(px - wd, y + 6); c.quadraticCurveTo(px - wd * 0.5, y - 2, px, y - 16); c.quadraticCurveTo(px + wd * 0.5, y - 2, px + wd, y + 6); c.lineTo(px + wd * 0.7, y + 12); c.lineTo(px - wd * 0.7, y + 12); c.fill();
        c.fillRect(px - wd * 0.55, y + 12, wd * 1.1, 26);
      }
    });
    const wall = layer(pw(0.6), H, (c, w) => {
      // torii gate
      c.fillStyle = '#3a0e12'; const tx = 760;
      c.fillRect(tx - 120, 250, 18, 200); c.fillRect(tx + 102, 250, 18, 200);
      c.beginPath(); c.moveTo(tx - 170, 240); c.quadraticCurveTo(tx, 222, tx + 170, 240); c.lineTo(tx + 165, 256); c.quadraticCurveTo(tx, 240, tx - 165, 256); c.fill();
      c.fillRect(tx - 135, 280, 270, 12);
      // low temple wall with tiled roof
      c.fillStyle = '#2a1018'; c.fillRect(0, 372, w, 70);
      c.fillStyle = '#1a0a10'; c.beginPath(); c.moveTo(-10, 378); for (let x = 0; x < w; x += 24) { c.lineTo(x, 360); c.lineTo(x + 12, 364); } c.lineTo(w + 10, 378); c.fill();
      c.fillStyle = 'rgba(255,170,90,0.08)'; for (let x = 20; x < w; x += 90) c.fillRect(x, 392, 50, 36);
    });
    const floor = layer(ARENA, H, (c) => { stoneFloor(c, 438, ['#5b3328', '#24120f', 'rgba(20,8,6,0.45)']); });
    const lanterns = [];
    for (let i = 0; i < 5; i++) lanterns.push({ x: 120 + i * 240 + r() * 40, y: 120 + r() * 50, ph: r() * 6 });
    return {
      name: 'TEMPLE COURTYARD', light: 1, rim: '#ffc887', ambient: 'rgba(255,140,80,0.10)', music: 'fight1', wind: 0.5,
      shadow: 'rgba(30,10,8,0.55)', bloodFloor: '#5a0d0b',
      back(ctx, cam, t) {
        ctx.drawImage(sky, 0, 0);
        ctx.drawImage(far, -cam * 0.12, 0); ctx.drawImage(mid, -cam * 0.25, 0);
        ctx.drawImage(wall, -cam * 0.6, 0);
        ctx.drawImage(floor, -cam, 0);
        for (const L of lanterns) {
          const x = L.x - cam * 0.85, y = L.y + Math.sin(t * 1.3 + L.ph) * 3, fl = 0.8 + 0.2 * Math.sin(t * 9 + L.ph * 3) * Math.sin(t * 5.3 + L.ph);
          ctx.strokeStyle = '#140808'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, y - 18); ctx.stroke();
          const g = ctx.createRadialGradient(x, y, 2, x, y, 70); g.addColorStop(0, `rgba(255,170,80,${0.45 * fl})`); g.addColorStop(1, 'rgba(255,120,40,0)');
          ctx.fillStyle = g; ctx.fillRect(x - 70, y - 70, 140, 140);
          ctx.fillStyle = `rgb(${200 + 40 * fl | 0},${70 + 30 * fl | 0},40)`; ctx.beginPath(); ctx.ellipse(x, y, 13, 18, 0, 0, 7); ctx.fill();
          ctx.fillStyle = '#1a0a08'; ctx.fillRect(x - 9, y - 21, 18, 4); ctx.fillRect(x - 9, y + 17, 18, 4);
        }
      },
      front(ctx, cam, t) {
        const g = ctx.createLinearGradient(0, H - 80, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(10,3,3,0.55)');
        ctx.fillStyle = g; ctx.fillRect(0, H - 80, W, 80);
      },
    };
  }

  /* -------------------------------------------- 2: bamboo grove, moonlight */
  function bamboo() {
    const r = rng(23);
    const sky = layer(W, H, (c) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#04070f'); g.addColorStop(0.6, '#10233a'); g.addColorStop(1, '#1d3a4a');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(220,235,255,${0.2 + r() * 0.6})`; c.fillRect(r() * W, r() * 280, 1.4, 1.4); }
      const mg = c.createRadialGradient(230, 140, 20, 230, 140, 220); mg.addColorStop(0, 'rgba(220,235,255,0.5)'); mg.addColorStop(1, 'rgba(120,160,220,0)');
      c.fillStyle = mg; c.fillRect(0, 0, W, H);
      c.fillStyle = '#eef3ff'; c.beginPath(); c.arc(230, 140, 64, 0, 7); c.fill();
      c.fillStyle = 'rgba(160,180,210,0.35)'; c.beginPath(); c.arc(212, 128, 14, 0, 7); c.arc(255, 160, 9, 0, 7); c.arc(240, 112, 6, 0, 7); c.fill();
    });
    const hills = layer(pw(0.15), H, (c, w) => { ridge(c, w, 380, 70, 50, '#0e2030', r, 8); });
    const stalks = (n, f, col, wmin, wmax, seed) => { const rr = rng(seed), a = []; for (let i = 0; i < n; i++) a.push({ x: rr() * pw(f), w: wmin + rr() * (wmax - wmin), ph: rr() * 6, col, lean: (rr() - 0.5) * 0.08 }); return a; };
    const L1 = stalks(46, 0.3, '#16334a', 4, 8, 3), L2 = stalks(26, 0.55, '#0d2233', 8, 14, 5), L3 = stalks(5, 1.25, '#050b10', 12, 20, 9);
    const floor = layer(ARENA, H, (c) => {
      const g = c.createLinearGradient(0, 436, 0, H); g.addColorStop(0, '#1f3a32'); g.addColorStop(1, '#08130f');
      c.fillStyle = g; c.fillRect(0, 436, ARENA, H - 436);
      for (let i = 0; i < 500; i++) { const x = r() * ARENA, y = 440 + Math.pow(r(), 0.7) * 100; c.strokeStyle = `rgba(${60 + r() * 50 | 0},${110 + r() * 60 | 0},${80 + r() * 30 | 0},0.5)`; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - 0.5) * 6, y - 4 - r() * 8); c.stroke(); }
    });
    const flies = []; for (let i = 0; i < 26; i++) flies.push({ x: r() * W, y: 200 + r() * 250, ph: r() * 6, sp: 0.3 + r() * 0.6 });
    function drawStalks(ctx, list, f, cam, t, top) {
      for (const b of list) {
        const x = b.x - cam * f, sway = Math.sin(t * 0.7 + b.ph) * 6;
        if (x < -40 || x > W + 40) continue;
        ctx.strokeStyle = b.col; ctx.lineWidth = b.w; ctx.lineCap = 'butt';
        ctx.beginPath(); ctx.moveTo(x, H); ctx.quadraticCurveTo(x + b.lean * 200, 250, x + sway + b.lean * 400, top); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = b.w + 1;
        for (let y = H - 70; y > top + 30; y -= 64) { const k = (H - y) / (H - top); const xx = x + (b.lean * 400 + sway) * k * k; ctx.beginPath(); ctx.moveTo(xx - b.w / 2 - 1, y); ctx.lineTo(xx + b.w / 2 + 1, y); ctx.stroke(); }
        // leaves
        ctx.fillStyle = b.col;
        for (let y = H - 120; y > top + 40; y -= 110) {
          const k = (H - y) / (H - top), xx = x + (b.lean * 400 + sway) * k * k;
          for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(xx + d * (b.w + 14), y - 8, 18 + b.w * 0.6, 3.5 + b.w * 0.12, d * 0.4 + Math.sin(t + b.ph) * 0.1, 0, 7); ctx.fill(); }
        }
      }
    }
    return {
      name: 'BAMBOO GROVE', light: -1, rim: '#c6dcff', ambient: 'rgba(80,120,200,0.10)', music: 'fight2', wind: -0.3,
      shadow: 'rgba(0,8,12,0.6)', bloodFloor: '#3d0a0a',
      back(ctx, cam, t) {
        ctx.drawImage(sky, 0, 0); ctx.drawImage(hills, -cam * 0.15, 0);
        // low mist
        const mg = ctx.createLinearGradient(0, 330, 0, 450); mg.addColorStop(0, 'rgba(140,180,210,0)'); mg.addColorStop(1, 'rgba(140,180,210,0.18)'); ctx.fillStyle = mg; ctx.fillRect(0, 330, W, 120);
        drawStalks(ctx, L1, 0.3, cam, t, -20); drawStalks(ctx, L2, 0.55, cam, t, -40);
        ctx.drawImage(floor, -cam, 0);
        for (const f of flies) {
          const x = (f.x + Math.sin(t * f.sp + f.ph) * 40 - cam * 0.7 + W * 3) % W, y = f.y + Math.cos(t * f.sp * 1.3 + f.ph) * 20, a = 0.4 + 0.6 * Math.max(0, Math.sin(t * 2 + f.ph * 2));
          ctx.fillStyle = `rgba(210,255,150,${a})`; ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
          ctx.fillStyle = `rgba(210,255,150,${a * 0.15})`; ctx.beginPath(); ctx.arc(x, y, 8, 0, 7); ctx.fill();
        }
      },
      front(ctx, cam, t) { ctx.globalAlpha = 0.82; drawStalks(ctx, L3, 1.25, cam, t, -60); ctx.globalAlpha = 1; },
    };
  }

  /* ----------------------------------------------- 3: Frill's shadow shrine */
  function shadow() {
    const r = rng(77);
    const sky = layer(W, H, (c) => {
      const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#020208'); g.addColorStop(0.55, '#0c0b22'); g.addColorStop(1, '#141634');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      const vg = c.createRadialGradient(W / 2, 250, 30, W / 2, 250, 420); vg.addColorStop(0, 'rgba(120,170,255,0.18)'); vg.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = vg; c.fillRect(0, 0, W, H);
    });
    const ruins = layer(pw(0.4), H, (c, w) => {
      c.fillStyle = '#07071a';
      for (let x = 60; x < w; x += 210 + r() * 80) {
        const h = 160 + r() * 160, ww = 34 + r() * 16;
        c.fillRect(x, 440 - h, ww, h);
        c.beginPath(); c.moveTo(x - 6, 440 - h); c.lineTo(x + ww * 0.4, 440 - h - 20 - r() * 30); c.lineTo(x + ww + 6, 440 - h + 8); c.fill();
        if (r() < 0.5) c.fillRect(x - 30, 440 - h + 12, ww + 60, 12);
      }
      c.fillStyle = '#0a0a20'; c.fillRect(0, 410, w, 40);
    });
    const floor = layer(ARENA, H, (c) => {
      const g = c.createLinearGradient(0, 440, 0, H); g.addColorStop(0, '#1a1d3c'); g.addColorStop(1, '#05060f');
      c.fillStyle = g; c.fillRect(0, 440, ARENA, H - 440);
      c.strokeStyle = 'rgba(140,190,255,0.08)';
      for (let i = 0; i < 6; i++) { const y = 440 + Math.pow(i / 6, 1.6) * 100; c.beginPath(); c.moveTo(0, y); c.lineTo(ARENA, y); c.stroke(); }
    });
    const ash = []; for (let i = 0; i < 60; i++) ash.push({ x: r() * W, y: r() * H, s: 0.5 + r() * 2, v: 8 + r() * 26, ph: r() * 6 });
    let flash = 0, nextBolt = 4;
    return {
      name: 'SHADOW SHRINE', light: 1, rim: '#9fdcff', ambient: 'rgba(80,120,255,0.12)', music: 'fight3', wind: 0.2,
      shadow: 'rgba(0,0,10,0.7)', bloodFloor: '#2a0610',
      update(dt) {
        nextBolt -= dt; flash = Math.max(0, flash - dt * 3);
        if (nextBolt < 0) { flash = 1; nextBolt = 5 + Math.random() * 7; if (typeof Audio !== 'undefined') Audio.sfx('thunder'); }
      },
      back(ctx, cam, t) {
        ctx.drawImage(sky, 0, 0);
        if (flash > 0) { ctx.fillStyle = `rgba(190,220,255,${flash * 0.35})`; ctx.fillRect(0, 0, W, H); }
        ctx.drawImage(ruins, -cam * 0.4, 0);
        for (let i = 0; i < 3; i++) {
          const y = 330 + i * 40, x = ((t * (12 + i * 8)) % (W * 2)) - W;
          const g = ctx.createLinearGradient(0, y - 30, 0, y + 30); g.addColorStop(0, 'rgba(120,170,255,0)'); g.addColorStop(0.5, 'rgba(120,170,255,0.07)'); g.addColorStop(1, 'rgba(120,170,255,0)');
          ctx.fillStyle = g; ctx.fillRect(0, y - 30, W, 60);
          ctx.fillStyle = 'rgba(170,210,255,0.035)'; ctx.beginPath(); ctx.ellipse(x + W / 2, y, 400, 22, 0, 0, 7); ctx.fill();
        }
        ctx.drawImage(floor, -cam, 0);
        for (const a of ash) {
          const y = ((a.y - t * a.v) % H + H) % H, x = a.x + Math.sin(t + a.ph) * 14;
          ctx.fillStyle = `rgba(190,220,255,${0.25 + 0.25 * Math.sin(t * 2 + a.ph)})`; ctx.fillRect(x, y, a.s, a.s);
        }
      },
      front(ctx, cam, t) {
        const g = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 620); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,8,0.7)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      },
      flash: () => flash,
    };
  }

  /* --------------------------------------- the spike pit, for fatalities */
  S.drawPit = function (ctx, t, blood, front) {
    if (front) return spikes(ctx, blood, [1, 2]);
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#000'); g.addColorStop(0.5, '#120808'); g.addColorStop(1, '#1e0c0a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // walls converging
    ctx.fillStyle = '#0a0505'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(150, 0); ctx.lineTo(240, 420); ctx.lineTo(0, H); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W - 150, 0); ctx.lineTo(W - 240, 420); ctx.lineTo(W, H); ctx.fill();
    ctx.strokeStyle = 'rgba(120,60,40,0.25)'; for (let y = 20; y < 420; y += 34) { ctx.beginPath(); ctx.moveTo(150 + y * 0.214, y); ctx.lineTo(0, y + y * 0.3); ctx.stroke(); ctx.beginPath(); ctx.moveTo(W - 150 - y * 0.214, y); ctx.lineTo(W, y + y * 0.3); ctx.stroke(); }
    // light from the trapdoor above
    const lg = ctx.createLinearGradient(0, 0, 0, 420); lg.addColorStop(0, 'rgba(255,190,120,0.25)'); lg.addColorStop(1, 'rgba(255,190,120,0)');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(330, 0); ctx.lineTo(630, 0); ctx.lineTo(720, 430); ctx.lineTo(240, 430); ctx.fill();
    ctx.fillStyle = '#160a08'; ctx.fillRect(0, 420, W, 120);
    spikes(ctx, blood, [0]);
    // skulls of the earlier fallen
    ctx.fillStyle = '#b5ab96';
    for (const [x, y] of [[270, 488], [700, 500], [600, 520]]) { ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill(); ctx.fillStyle = '#000'; ctx.fillRect(x - 5, y - 2, 3, 3); ctx.fillRect(x + 2, y - 2, 3, 3); ctx.fillStyle = '#b5ab96'; }
  };
  function spikes(ctx, blood, rows) {
    for (const row of rows) {
      const y = 430 + row * 34, h = 92 - row * 10, sp = 40 - row * 4;
      for (let x = 160 - row * 60; x < W - 160 + row * 60; x += sp) {
        const xx = x + (row % 2) * sp / 2;
        const gg = ctx.createLinearGradient(xx - 8, 0, xx + 8, 0); gg.addColorStop(0, '#3b3a3e'); gg.addColorStop(0.5, '#a9a7ad'); gg.addColorStop(1, '#2a292c');
        ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(xx - 9 + row, y); ctx.lineTo(xx, y - h); ctx.lineTo(xx + 9 - row, y); ctx.fill();
        if (blood && Math.abs(xx - W / 2) < 170) { ctx.fillStyle = `rgba(110,8,8,${Math.min(1, blood)})`; ctx.beginPath(); ctx.moveTo(xx - 3, y - h * 0.45); ctx.lineTo(xx, y - h); ctx.lineTo(xx + 3, y - h * 0.45); ctx.fill(); }
      }
    }
  }

  /* --------------------------------------- story backdrop: the master */
  S.drawHall = function (ctx, t, eyes) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#070304'); g.addColorStop(1, '#1a0806');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // pillars
    ctx.fillStyle = '#0d0505';
    for (const x of [80, 230, 730, 880]) ctx.fillRect(x - 22, 0, 44, H);
    // braziers
    for (const x of [310, 650]) {
      const fl = 0.75 + 0.25 * Math.sin(t * 11 + x) * Math.sin(t * 7.1 + x * 0.3);
      const bg = ctx.createRadialGradient(x, 380, 4, x, 380, 190); bg.addColorStop(0, `rgba(255,140,50,${0.55 * fl})`); bg.addColorStop(1, 'rgba(255,90,20,0)');
      ctx.fillStyle = bg; ctx.fillRect(x - 190, 190, 380, 380);
      ctx.fillStyle = '#1b0f0b'; ctx.fillRect(x - 6, 400, 12, 110); ctx.beginPath(); ctx.moveTo(x - 30, 390); ctx.lineTo(x + 30, 390); ctx.lineTo(x + 18, 410); ctx.lineTo(x - 18, 410); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const h = 30 + 18 * Math.sin(t * 9 + i * 2 + x), w = 10 - i;
        ctx.fillStyle = i % 2 ? `rgba(255,200,90,${0.8 * fl})` : `rgba(255,110,30,${0.8 * fl})`;
        ctx.beginPath(); ctx.moveTo(x - 18 + i * 9 - w, 390); ctx.quadraticCurveTo(x - 18 + i * 9, 390 - h * 1.2, x - 18 + i * 9 + Math.sin(t * 6 + i) * 4, 390 - h); ctx.quadraticCurveTo(x - 18 + i * 9 + w * 0.5, 380 - h * 0.4, x - 18 + i * 9 + w, 390); ctx.fill();
      }
    }
    // dais and seated master
    ctx.fillStyle = '#120706'; ctx.fillRect(330, 420, 300, 30); ctx.fillRect(360, 400, 240, 24);
    ctx.fillStyle = '#050202';
    ctx.beginPath(); ctx.moveTo(400, 402); ctx.quadraticCurveTo(410, 300, 450, 270); ctx.lineTo(510, 270); ctx.quadraticCurveTo(550, 300, 560, 402); ctx.fill();
    ctx.beginPath(); ctx.arc(480, 248, 30, 0, 7); ctx.fill();
    // kabuto horns
    ctx.beginPath(); ctx.moveTo(452, 236); ctx.quadraticCurveTo(420, 200, 430, 168); ctx.quadraticCurveTo(445, 205, 466, 226); ctx.fill();
    ctx.beginPath(); ctx.moveTo(508, 236); ctx.quadraticCurveTo(540, 200, 530, 168); ctx.quadraticCurveTo(515, 205, 494, 226); ctx.fill();
    ctx.fillRect(420, 300, 120, 18);
    if (eyes) {
      const a = 0.6 + 0.4 * Math.sin(t * 3);
      ctx.shadowColor = '#ff2010'; ctx.shadowBlur = 16; ctx.fillStyle = `rgba(255,50,30,${a})`;
      ctx.fillRect(464, 246, 11, 3); ctx.fillRect(486, 246, 11, 3); ctx.shadowBlur = 0;
    }
  };

  S.make = function (n) { return [courtyard, bamboo, shadow][n](); };
  return S;
})();
