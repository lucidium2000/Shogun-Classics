/* Particles, blood, projectiles' glow, gibs and screen effects. */
const FX = (() => {
  const F = { parts: [], decals: [], gibs: [], pops: [], shake: 0, flash: 0, flashCol: '#fff', gore: true };
  const G = () => Stages.GROUND;
  F.reset = function () { F.parts.length = 0; F.decals.length = 0; F.gibs.length = 0; F.pops.length = 0; F.shake = 0; F.flash = 0; };
  F.add = function (p) { F.parts.push(Object.assign({ life: 0.5, t: 0, vx: 0, vy: 0, g: 0, size: 3, col: '#fff', kind: 'dot', drag: 0 }, p)); };

  F.blood = function (x, y, dir, power) {
    if (!F.gore) return;
    const n = Math.round(10 + power * 14);
    for (let i = 0; i < n; i++) {
      const sp = 120 + Math.random() * 380 * (0.6 + power * 0.6);
      const base = dir === 0 ? -Math.PI / 2 : (dir > 0 ? -0.55 : -Math.PI + 0.55), a = base + (Math.random() - 0.5) * 1.3;
      F.add({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 1500, life: 0.5 + Math.random() * 0.6, size: 2 + Math.random() * 4, col: Math.random() < 0.5 ? '#8e1412' : '#5e0a0a', kind: 'blood' });
    }
  };
  F.bloodJet = function (x, y, ang, sp, n) {
    if (!F.gore) return;
    for (let i = 0; i < n; i++) {
      const a = ang + (Math.random() - 0.5) * 0.5, s = sp * (0.6 + Math.random() * 0.6);
      F.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 1400, life: 0.7 + Math.random() * 0.5, size: 2.5 + Math.random() * 4, col: Math.random() < 0.5 ? '#9a1614' : '#650b0b', kind: 'blood' });
    }
  };
  F.spark = function (x, y, col, n) {
    for (let i = 0; i < (n || 12); i++) {
      const a = Math.random() * Math.PI * 2, s = 150 + Math.random() * 380;
      F.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.18 + Math.random() * 0.2, size: 2 + Math.random() * 2, col: col || '#fff2c0', kind: 'spark', drag: 4 });
    }
  };
  F.ring = function (x, y, col, r) { F.add({ x, y, life: 0.3, size: r || 40, col: col || '#fff', kind: 'ring' }); };
  F.dust = function (x, y, n) {
    for (let i = 0; i < (n || 8); i++) F.add({ x: x + (Math.random() - 0.5) * 40, y: y - 4, vx: (Math.random() - 0.5) * 160, vy: -20 - Math.random() * 60, life: 0.5 + Math.random() * 0.4, size: 8 + Math.random() * 12, col: 'rgba(170,150,130,0.35)', kind: 'smoke', drag: 2 });
  };
  F.smoke = function (x, y, col) { F.add({ x, y, vx: (Math.random() - 0.5) * 30, vy: -30 - Math.random() * 40, life: 0.8 + Math.random() * 0.6, size: 10 + Math.random() * 14, col, kind: 'smoke', drag: 1 }); };
  F.ember = function (x, y, col) { F.add({ x, y, vx: (Math.random() - 0.5) * 80, vy: -40 - Math.random() * 120, life: 0.4 + Math.random() * 0.5, size: 1.5 + Math.random() * 2.5, col: col || '#ffb050', kind: 'spark', drag: 1 }); };
  F.pop = function (text, x, y, col, size) { F.pops.push({ text, x, y, col: col || '#fff', size: size || 34, t: 0, life: 1.1 }); };

  F.update = function (dt) {
    F.shake = Math.max(0, F.shake - dt * 30);
    F.flash = Math.max(0, F.flash - dt * 3);
    for (const p of F.parts) {
      p.t += dt; p.vy += p.g * dt;
      if (p.drag) { p.vx *= Math.max(0, 1 - p.drag * dt); p.vy *= Math.max(0, 1 - p.drag * dt); }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.kind === 'blood' && p.y > G() + 6 && p.vy > 0) {
        p.t = p.life; if (F.decals.length < 220) F.decals.push({ x: p.x, y: G() + 4 + Math.random() * 30, r: p.size * (1.2 + Math.random() * 1.6) });
      }
    }
    F.parts = F.parts.filter(p => p.t < p.life);
    for (const g of F.gibs) g.update(dt);
    for (const p of F.pops) { p.t += dt; p.y -= 30 * dt; }
    F.pops = F.pops.filter(p => p.t < p.life);
  };
  F.drawDecals = function (ctx, col) {
    ctx.fillStyle = col || '#5a0d0b';
    for (const d of F.decals) { ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r * 1.8, d.r * 0.5, 0, 0, 7); ctx.fill(); }
  };
  F.draw = function (ctx) {
    for (const p of F.parts) {
      const k = 1 - p.t / p.life;
      if (p.kind === 'blood') { ctx.fillStyle = p.col; ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size, p.size * 0.8, Math.atan2(p.vy, p.vx), 0, 7); ctx.fill(); }
      else if (p.kind === 'spark') { ctx.strokeStyle = p.col; ctx.globalAlpha = k; ctx.lineWidth = p.size; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); ctx.stroke(); ctx.globalAlpha = 1; }
      else if (p.kind === 'smoke') { ctx.fillStyle = p.col; ctx.globalAlpha = k; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1.5 - k * 0.5), 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
      else if (p.kind === 'ring') { ctx.strokeStyle = p.col; ctx.globalAlpha = k; ctx.lineWidth = 4 * k + 1; ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1.4 - k), 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
      else { ctx.fillStyle = p.col; ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size); }
    }
    for (const g of F.gibs) g.draw(ctx);
  };
  F.drawPops = function (ctx) {
    for (const p of F.pops) {
      const k = p.t / p.life, sc = k < 0.15 ? 0.6 + k / 0.15 * 0.5 : 1.1 - Math.min(0.1, (k - 0.15));
      ctx.save(); ctx.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1; ctx.translate(p.x, p.y); ctx.scale(sc, sc);
      ctx.font = `700 ${p.size}px 'Barlow Condensed', Impact, sans-serif`; ctx.textAlign = 'center';
      ctx.lineWidth = 6; ctx.strokeStyle = '#000'; ctx.strokeText(p.text, 0, 0); ctx.fillStyle = p.col; ctx.fillText(p.text, 0, 0);
      ctx.restore();
    }
  };

  /* A severed piece of a fighter: a frozen skeleton snapshot drawn with its
     own transform, falling and bouncing on the floor. */
  F.Gib = class {
    constructor(J, part, pivot, vx, vy, vr, opts) {
      this.J = J; this.part = part; this.px = pivot[0]; this.py = pivot[1]; this.x = pivot[0]; this.y = pivot[1];
      this.vx = vx; this.vy = vy; this.vr = vr; this.r = 0; this.rest = false; this.opts = opts || {}; this.floor = this.opts.floor || G(); this.bleed = 1.2;
    }
    update(dt) {
      if (this.rest) return;
      this.vy += 1700 * dt; this.x += this.vx * dt; this.y += this.vy * dt; this.r += this.vr * dt;
      if (this.bleed > 0) { this.bleed -= dt; if (Math.random() < 0.6) F.add({ x: this.x, y: this.y, vx: (Math.random() - 0.5) * 60, vy: -30, g: 1200, life: 0.6, size: 2 + Math.random() * 3, col: '#7a0e0c', kind: 'blood' }); }
      const lim = this.floor - (this.opts.restOff || 14);
      if (this.y > lim) {
        this.y = lim; this.vy *= -0.35; this.vx *= 0.6; this.vr *= 0.5;
        if (Math.abs(this.vy) < 60) { this.rest = true; if (this.opts.restRot != null) this.r = this.opts.restRot; }
        Audio.sfx('blood'); F.blood(this.x, this.y, 0, 0.4);
      }
    }
    draw(ctx) {
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.r); ctx.translate(-this.px, -this.py);
      if (this.part === 'head') Rig.drawHead(ctx, this.J);
      else Rig.draw(ctx, this.J, { only: this.part, rim: this.opts.rim, light: this.opts.light });
      // the cut, a dark wound cap
      if (this.part === 'upper') { ctx.fillStyle = '#4a0606'; ctx.beginPath(); ctx.ellipse(this.J.H[0], this.J.H[1] - 6, 16 * this.J.s, 6, this.J.torsoA, 0, 7); ctx.fill(); }
      ctx.restore();
    }
  };
  return F;
})();

/* Retro sprite layer. 'blocks' (default) turns sprites into 1996-style text-mode art: each
   CW x CH cell becomes one of █▓▒░▀▄ in one of the 16 DOS colours. 'pixel' renders at 1/PX
   resolution with a dithered colour snap. 'smooth' draws the vector art untouched. */
const Retro = (() => {
  const R = { mode: 'pixel', PX: 4, levels: 8, amp: 0.35, CW: 9, CH: 14, active: false };
  const B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  const EGA = ['000000', '0000aa', '00aa00', '00aaaa', 'aa0000', 'aa00aa', 'aa5500', 'aaaaaa', '555555', '5555ff', '55ff55', '55ffff', 'ff5555', 'ff55ff', 'ffff55', 'ffffff']
    .map(h => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4), 16)]);
  // pick a DOS colour by hue and lightness (like choosing COLOR n in QBasic), then a shade glyph
  // for how far the pixel falls below that colour's own lightness
  // lightness each colour stands for in the vector art (the dark DOS colours cover the midtones)
  const LP = [0.1, 0.5, 0.5, 0.5, 0.48, 0.5, 0.5, 0.55, 0.3, 0.8, 0.8, 0.8, 0.75, 0.8, 0.78, 0.88];
  const HUES = [[15, 4, 12], [38, 6, 6], [70, 6, 14], [160, 2, 10], [200, 3, 11], [265, 1, 9], [345, 5, 13], [361, 4, 12]];
  function classify(r, g, b) {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 510, dd = (mx - mn) / 255;
    if (l < 0.09) return [0, 0];
    const sat = dd / (1 - Math.abs(2 * l - 1) || 1);
    let ci;
    if (sat < 0.15 || dd < 0.08) ci = l < 0.3 ? 8 : l < 0.62 ? 7 : 15;
    else {
      let h = mx === r ? ((g - b) / (mx - mn)) * 60 : mx === g ? ((b - r) / (mx - mn)) * 60 + 120 : ((r - g) / (mx - mn)) * 60 + 240;
      if (h < 0) h += 360;
      const row = HUES.find(e => h < e[0]);
      ci = l > 0.56 ? row[2] : row[1];
      if (ci === 6 && l > 0.42 && h > 36) ci = 14;
    }
    const k = l / LP[ci];
    return [ci, k >= 0.86 ? 0 : k >= 0.7 ? 1 : k >= 0.52 ? 2 : 3];
  }
  let cv = null, o = null, atlas = null, atlasKey = '';
  function canvas() { if (!cv) { cv = document.createElement('canvas'); o = cv.getContext('2d', { willReadFrequently: true }); } }
  // glyph g: 0 █, 1 ▓, 2 ▒, 3 ░, 4 ▀, 5 ▄; drawn on a 4 x 7 dot grid like the CP437 shades
  function buildAtlas(q) {
    const cw = Math.round(R.CW * q), ch = Math.round(R.CH * q), key = cw + 'x' + ch;
    if (atlasKey === key) return; atlasKey = key;
    atlas = document.createElement('canvas'); atlas.width = cw * 6; atlas.height = ch * 16;
    const a = atlas.getContext('2d'), nx = 4, ny = 7;
    EGA.forEach((c, ci) => {
      a.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
      for (let g = 0; g < 6; g++) {
        const ox = g * cw, oy = ci * ch;
        if (g === 0) a.fillRect(ox, oy, cw, ch);
        else if (g === 4) a.fillRect(ox, oy, cw, Math.round(ch / 2));
        else if (g === 5) a.fillRect(ox, oy + Math.round(ch / 2), cw, ch - Math.round(ch / 2));
        else for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
          const on = g === 2 ? (x + y) % 2 === 0 : g === 3 ? (x % 2 === 0 && (y % 2 === 0) === (x % 4 === 0)) || false : !(x % 2 === 1 && (y % 2 === 1) === (x % 4 === 1));
          if (!on) continue;
          const x0 = ox + Math.round(x * cw / nx), x1 = ox + Math.round((x + 1) * cw / nx), y0 = oy + Math.round(y * ch / ny), y1 = oy + Math.round((y + 1) * ch / ny);
          a.fillRect(x0, y0, x1 - x0, y1 - y0);
        }
      }
    });
  }
  function render(ctx, fn, sx, sy) {
    const W = Stages.W, H = Stages.H, w = Math.ceil(W / sx), h = Math.ceil(H / sy);
    canvas();
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const q = ctx.canvas.width / W, m = ctx.getTransform();
    o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, w, h);
    o.setTransform(m.a / (q * sx), m.b / (q * sy), m.c / (q * sx), m.d / (q * sy), m.e / (q * sx), m.f / (q * sy));
    R.active = true;
    try { fn(o); } finally { R.active = false; }
    return { q, w, h, img: o.getImageData(0, 0, w, h) };
  }
  function blocks(ctx, fn) {
    // two samples per cell (top and bottom halves) so ▀ and ▄ can shape heads and feet
    const { q, w, h, img } = render(ctx, fn, R.CW, R.CH / 2), d = img.data;
    buildAtlas(q);
    const cw = Math.round(R.CW * q), ch = Math.round(R.CH * q);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = false;
    for (let cy = 0; cy * 2 < h; cy++) for (let cx = 0; cx < w; cx++) {
      const i = (cy * 2 * w + cx) * 4, j = i + w * 4;
      const at = d[i + 3] / 255, ab = cy * 2 + 1 < h ? d[j + 3] / 255 : 0;
      if (at < 0.22 && ab < 0.22) continue;
      let ci, g, solid = false;
      if (at >= 0.5 && ab < 0.22) { [ci, g] = classify(d[i], d[i + 1], d[i + 2]); if (!g) g = 4; }
      else if (ab >= 0.5 && at < 0.22) { [ci, g] = classify(d[j], d[j + 1], d[j + 2]); if (!g) g = 5; }
      else {
        const ws = at + ab;
        [ci, g] = classify((d[i] * at + d[j] * ab) / ws, (d[i + 1] * at + d[j + 1] * ab) / ws, (d[i + 2] * at + d[j + 2] * ab) / ws);
        solid = ws > 1.5;
        if (!solid && !g) g = 1;
      }
      const X = Math.round(cx * R.CW * q), Y = Math.round(cy * R.CH * q);
      if (solid && g) { ctx.fillStyle = '#000'; ctx.fillRect(X, Y, cw, ch); }
      ctx.drawImage(atlas, g * cw, ci * ch, cw, ch, X, Y, cw, ch);
    }
    ctx.restore();
  }
  function pixel(ctx, fn) {
    const PX = R.PX, { q, w, h, img } = render(ctx, fn, PX, PX), d = img.data, L = R.levels - 1;
    for (let y = 0, i = 0; y < h; y++) for (let x = 0; x < w; x++, i += 4) {
      if (!d[i + 3]) continue;
      const t0 = B[(y & 3) * 4 + (x & 3)], t = 0.5 + (t0 - 0.5) * R.amp;
      if (d[i + 3] / 255 < t0 * 0.6 + 0.3) { d[i + 3] = 0; continue; }
      d[i + 3] = 255;
      for (let c = 0; c < 3; c++) {
        const v = d[i + c] / 255 * L, f = Math.floor(v);
        d[i + c] = Math.min(L, f + (v - f > t ? 1 : 0)) * 255 / L;
      }
    }
    o.putImageData(img, 0, 0);
    ctx.save(); ctx.setTransform(q, 0, 0, q, 0, 0); ctx.imageSmoothingEnabled = false;
    ctx.drawImage(cv, 0, 0, w * PX, h * PX); ctx.restore();
  }
  // bg: stage art, which always uses the pixel look (whole-screen text cells would bury the fighters)
  R.wrap = function (ctx, fn, bg) {
    if (R.mode === 'smooth' || R.active) return fn(ctx);
    (R.mode === 'pixel' || bg ? pixel : blocks)(ctx, fn);
  };
  return R;
})();
