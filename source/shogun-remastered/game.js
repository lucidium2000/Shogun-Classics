// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* Scenes, the round flow, FINISH HIM and the fatalities. */
const W = Stages.W, H = Stages.H, GY = Stages.GROUND;
const cv = document.getElementById('cv'), ctx = cv.getContext('2d');
const FONT = { disp: "'Shippori Mincho B1', 'Times New Roman', serif", hud: "'Barlow Condensed', 'Arial Narrow', sans-serif", dos: "'VT323', 'Courier New', monospace" };
const store = { get(k, d) { try { const v = localStorage.getItem('shogun96r.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('shogun96r.' + k, JSON.stringify(v)); } catch (e) { /* storage is optional */ } } };
Retro.mode = store.get('sprites2', 'pixel');

const ENEMIES = ['wanfu', 'yamana', 'frill'];
const NAMES = { keero: 'KEERO', shokei: 'SHŌKEI', wanfu: "WAN'FU", yamana: 'YAMANA', frill: 'FRILL' };
// Fatality codes per stage, as in the BAS files. Shōkei never reached Frill in 1996 (CCSHOGUN.BAS
// was never written), so his Run-Through is allowed there in this version.
const CODES = {
  keero: [{ '668': 'head', '246': 'pit' }, { '668': 'head', '4655': 'throw' }, { '668': 'head' }],
  shokei: [{ '6264': 'run', '468': 'pit' }, { '6264': 'run', '4655': 'throw' }, { '6264': 'run' }],
};
const FATAL_NAMES = { head: 'HEAD TAKER', pit: 'THE PIT', throw: 'SECRET PIT', run: 'RUN-THROUGH' };

const G = {
  scene: null, time: 0, mode: '1p', hero: 'keero', hero2: 'shokei', stageIdx: 0, diff: store.get('diff', 1),
  projectiles: [], fighting: false, codeEntry: null, hitstop: 0, slow: 1, cam: 110, banner: null, combo: { n: 0, t: 0 },
  found: store.get('found', {}), paused: false,
};
Audio.voice = store.get('voice', true); FX.gore = store.get('gore', true);
let soundPref = store.get('sound', true);

/* ------------------------------------------------------------ helpers */
function text(s, x, y, size, col, opts) {
  opts = opts || {};
  ctx.save();
  ctx.font = `${opts.weight || 700} ${size}px ${opts.font || FONT.hud}`; ctx.textAlign = opts.align || 'center'; ctx.textBaseline = 'middle';
  if (opts.spacing) ctx.letterSpacing = opts.spacing + 'px';
  if (opts.glow) { ctx.shadowColor = opts.glow; ctx.shadowBlur = opts.blur || 18; }
  if (opts.stroke) { ctx.lineWidth = opts.stroke; ctx.strokeStyle = opts.strokeCol || '#000'; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  ctx.fillStyle = col; ctx.fillText(s, x, y);
  ctx.restore();
}
function wrap(s, max, size, font) {
  ctx.save(); ctx.font = `${size}px ${font}`;
  const out = []; let line = '';
  for (const w of s.split(' ')) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > max && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); ctx.restore(); return out;
}
function go(scene, arg) { G.scene = scene; Input.clear(); if (scene.enter) scene.enter(arg); }
const ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const isTouch = () => Input.touch || matchMedia('(pointer: coarse)').matches;

// tap targets for menus, in game coordinates
let hits = [];
function button(label, x, y, w, h, on, sel) {
  hits.push({ x: x - w / 2, y: y - h / 2, w, h, on });
  ctx.save();
  if (sel) { ctx.fillStyle = 'rgba(163,32,29,0.85)'; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeStyle = '#ffcf7a'; ctx.lineWidth = 2; ctx.strokeRect(x - w / 2 + 1, y - h / 2 + 1, w - 2, h - 2); }
  else { ctx.fillStyle = 'rgba(10,6,6,0.6)'; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeStyle = 'rgba(201,162,75,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(x - w / 2 + 0.5, y - h / 2 + 0.5, w - 1, h - 1); }
  ctx.restore();
  text(label, x, y + 1, 24, sel ? '#fff' : '#d9cfbd', { spacing: 2 });
}
function menuNav(list, sel, evs, onPick) {
  for (const e of evs) {
    if (e.m === 'up' || e.m === 'left') { sel = (sel + list.length - 1) % list.length; Audio.sfx('ui'); }
    if (e.m === 'down' || e.m === 'right') { sel = (sel + 1) % list.length; Audio.sfx('ui'); }
    if (e.m === 'ok' && !e.touch) { Audio.sfx('confirm'); onPick(sel); }
    if (e.m === 'tap') for (const h of hits) if (e.x >= h.x && e.x <= h.x + h.w && e.y >= h.y && e.y <= h.y + h.h) { Audio.sfx('confirm'); h.on(); }
  }
  return sel;
}

/* ---------------------------------------------------- 1996 logo text */
const LOGO = [
  '██▓▓▒▒░░ ██▓▒',
  '█▓▒       █▓▒',
  '█▓▒       █▓▒                                   (R)',
  '█▓▒       █▓▒▒▒░░ ██▓▒░░ ██▓▒▒░ ██▓ ▒░░ ██▓▓▒░░',
  '██▓▓▒▒░░  █▓▒  ▒░ ██  ░░ ██  ▒░ ██▓ ▒░░ ██▓ ▒░░',
  '     █▓▒  █▓▒  ▒░ ██▓▒░░ ██▓▒▒░ ██▓▓▒▒░ ██▓ ▒░░',
  '     █▓▒                    ▓▒░',
  '     █▓▒                 ██▓▒▒░',
  '██▓▓▒▒░░',
];
function drawLogo(x, y, cell, t, alpha) {
  // each 1996 shade glyph becomes a cell of light: █ solid, ▓ ▒ ░ fading out
  const dens = { '█': 1, '▓': 0.72, '▒': 0.46, '░': 0.22 };
  ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
  const cw = cell * 0.6, ch = cell;
  for (let r = 0; r < LOGO.length; r++) for (let c = 0; c < LOGO[r].length; c++) {
    const k = dens[LOGO[r][c]]; if (!k) continue;
    const px = x + c * cw, py = y + r * ch;
    const shine = Math.max(0, 1 - Math.abs(((t * 300) % 1600) - 300 - (px - x)) / 70);
    ctx.fillStyle = `rgba(${85 + shine * 170 | 0},255,255,${k})`;
    ctx.shadowColor = 'rgba(85,255,255,0.8)'; ctx.shadowBlur = 10 * k;
    ctx.fillRect(px, py, cw - 1, ch - 1);
  }
  ctx.restore();
  text('(R)', x + 48.6 * cw, y + 2.5 * ch, cell * 0.9, '#55ffff', { font: FONT.dos, weight: 400 });
}

/* ================================================================ SCENES */
const Power = {
  enter() { this.t = 0; },
  update(dt, evs) { this.t += dt; if (evs.length) start(); },
  draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    text('SHOGUN', W / 2, 220, 64, '#55ffff', { font: FONT.dos, weight: 400, glow: '#55ffff', spacing: 14 });
    text('REMASTERED', W / 2, 272, 22, '#c9a24b', { spacing: 10 });
    if (Math.sin(this.t * 4) > -0.3) text(isTouch() ? 'TAP TO POWER ON' : 'PRESS ANY KEY OR CLICK TO POWER ON', W / 2, 360, 24, '#ebe3d3', { spacing: 3 });
    text('MYSTICAL SOFTWARE (C)1996', W / 2, 500, 18, '#5c8c8c', { font: FONT.dos, weight: 400, spacing: 2 });
  },
};
function start() {
  Audio.init(); Audio.setOn(soundPref);
  go(Intro);
}

const Intro = {
  enter() { this.t = 0; this.trail = []; this.x = 120 + Math.random() * 700; this.y = 100 + Math.random() * 300; this.dx = 1; this.dy = 1; this.c = 0; Audio.music(null); this.played = false; },
  update(dt, evs) {
    this.t += dt;
    if (evs.some(e => e.m === 'ok' || e.m === 'tap' || e.m === 'pause')) return go(Title);
    if (!this.played && this.t > 0.6) { this.played = true; Audio.sfx('gong'); }
    if (this.t > 3.6) {
      // the 1996 screen-saver: a colour-cycling circle bouncing off the walls
      for (let k = 0; k < 2; k++) {
        this.x += this.dx * 9; this.y += this.dy * 9; this.c = (this.c + 3) % 360;
        if (this.x < 20 || this.x > W - 20) this.dx *= -1; if (this.y < 20 || this.y > H - 20) this.dy *= -1;
        this.trail.push({ x: this.x, y: this.y, c: this.c }); if (this.trail.length > 26) this.trail.shift();
      }
    }
    if (this.t > 7.2) go(Title);
  },
  draw() {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    const t = this.t;
    if (t < 3.6) {
      const a = t < 0.6 ? 0 : t < 1.1 ? (t - 0.6) / 0.5 : t < 3.1 ? 1 : 1 - (t - 3.1) / 0.5;
      const bright = t > 1.3 && t < 2.7;
      ctx.globalAlpha = Math.max(0, a);
      text('█▓▒░ Mystical Software Presents ░▒▓█', W / 2, H / 2, 40, bright ? '#55ffff' : '#00aaaa', { font: FONT.dos, weight: 400, glow: bright ? '#55ffff' : null, blur: 24 });
      ctx.globalAlpha = 1;
    } else {
      this.trail.forEach((p, i) => {
        const k = i / this.trail.length;
        ctx.strokeStyle = `hsla(${p.c},100%,60%,${k})`; ctx.lineWidth = 3; ctx.shadowColor = `hsl(${p.c},100%,60%)`; ctx.shadowBlur = 12 * k;
        ctx.beginPath(); ctx.arc(p.x, p.y, 10 + k * 8, 0, 7); ctx.stroke();
      });
      ctx.shadowBlur = 0;
    }
  },
};

const Title = {
  enter() { this.t = 0; this.stage = 0; this.sel = 0; Audio.music('title'); this.stars = []; for (let i = 0; i < 70; i++) this.stars.push({ x: Math.random() * W, y: Math.random() * H, v: 6 + Math.random() * 20 }); },
  items() {
    return [['1 PLAYER', () => { G.mode = '1p'; Input.twoP = false; go(Select); }],
      ['2 PLAYERS', () => { G.mode = '2p'; Input.twoP = true; go(Select); }],
      ['HOW TO PLAY', () => go(Help, Title)],
      ['OPTIONS', () => go(Options, Title)],
      ['ALL GAMES', toMenu]];
  },
  update(dt, evs) {
    this.t += dt;
    if (this.stage === 0) {
      if (evs.some(e => e.m === 'ok' || e.m === 'tap')) { this.stage = 1; Audio.sfx('taiko'); }
      return;
    }
    for (const e of evs) if (e.m === 'char' && (e.k === '1' || e.k === '2')) return this.items()[+e.k - 1][1]();
    const it = this.items(); this.sel = menuNav(it, this.sel, evs, i => it[i][1]());
  },
  draw() {
    const t = this.t;
    const g = ctx.createRadialGradient(W / 2, 200, 40, W / 2, 260, 620); g.addColorStop(0, '#12202a'); g.addColorStop(1, '#030405');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (const s of this.stars) { const y = (s.y - t * s.v + H) % H; ctx.fillStyle = 'rgba(255,170,90,0.6)'; ctx.fillRect(s.x + Math.sin(t + s.y) * 6, y, 2, 2); }
    // the 1996 red box (DRAW "bm30,30 c4 d200 r500 u200 l500"), scaled up
    ctx.strokeStyle = '#a3201d'; ctx.lineWidth = 3; ctx.strokeRect(70, 46, W - 140, 300);
    ctx.strokeStyle = 'rgba(163,32,29,0.35)'; ctx.lineWidth = 9; ctx.strokeRect(70, 46, W - 140, 300);
    const cell = 26, lx = W / 2 - (47 * cell * 0.6) / 2;
    drawLogo(lx, 72, cell, t, ease(t / 1.2));
    text('S H O T A K A N    T A K A M A R A', W / 2, 72 + 8.6 * cell, 26, '#55ffff', { font: FONT.dos, weight: 400, glow: '#00aaaa' });
    text('REMASTERED', W / 2 + 250, 72 + 7.4 * cell, 20, '#c9a24b', { spacing: 6 });
    hits = [];
    if (this.stage === 0) {
      if (Math.sin(t * 4) > -0.2) text(isTouch() ? 'TAP PUNCH TO BEGIN' : 'PRESS (ENTER) TO BEGIN', W / 2, 410, 30, '#55ffff', { font: FONT.dos, weight: 400 });
      hits.push({ x: 0, y: 0, w: W, h: H, on: () => {} });
    } else {
      text('(1) OR (2) PLAYERS', W / 2, 372, 22, '#55ffff', { font: FONT.dos, weight: 400 });
      const it = this.items(), gap = Math.min(193, (W - 40) / it.length);
      it.forEach(([l, on], i) => button(l, W / 2 + (i - (it.length - 1) / 2) * gap, 430, gap - 15, 46, on, i === this.sel));
    }
    text('MYSTICAL SOFTWARE (C)1995-1996  ·  REMASTERED 2026', W / 2, 515, 16, '#5c8c8c', { font: FONT.dos, weight: 400, spacing: 1 });
  },
};

const Options = {
  enter(back) { this.back = back || Title; this.sel = 0; },
  list() {
    return [[`SOUND: ${soundPref ? 'ON' : 'OFF'}`, () => { soundPref = !soundPref; Audio.setOn(soundPref); store.set('sound', soundPref); }],
      [`ANNOUNCER VOICE: ${Audio.voice ? 'ON' : 'OFF'}`, () => { Audio.voice = !Audio.voice; store.set('voice', Audio.voice); Audio.say('Shogun'); }],
      [`BLOOD: ${FX.gore ? 'ON' : 'OFF'}`, () => { FX.gore = !FX.gore; store.set('gore', FX.gore); }],
      [`SPRITES: ${{ blocks: '1996 BLOCKS', pixel: 'PIXEL', smooth: 'SMOOTH' }[Retro.mode]}`, () => { Retro.mode = { blocks: 'pixel', pixel: 'smooth', smooth: 'blocks' }[Retro.mode]; store.set('sprites2', Retro.mode); }],
      [`DIFFICULTY: ${['EASY', '1996', 'HARD'][G.diff]}`, () => { G.diff = (G.diff + 1) % 3; store.set('diff', G.diff); }],
      ['BACK', () => go(this.back)]];
  },
  update(dt, evs) { if (evs.some(e => e.m === 'pause' || e.m === 'back')) return go(this.back); const l = this.list(); this.sel = menuNav(l, this.sel, evs, i => l[i][1]()); },
  draw() {
    ctx.fillStyle = '#070505'; ctx.fillRect(0, 0, W, H);
    text('OPTIONS', W / 2, 70, 44, '#ebe3d3', { font: FONT.disp, weight: 800, spacing: 8 });
    hits = []; this.list().forEach(([l, on], i) => button(l, W / 2, 140 + i * 58, 420, 46, on, i === this.sel));
    text('Difficulty 1996 matches the original enemy timing.', W / 2, 500, 18, '#8c8070');
  },
};

const Help = {
  enter(back) { this.back = back || Title; },
  update(dt, evs) { for (const e of evs) if (['ok', 'pause', 'back', 'tap'].includes(e.m)) { Audio.sfx('ui'); return this.back === 'pause' ? (G.scene = Fight, G.paused = true) : go(this.back); } },
  draw() {
    ctx.fillStyle = '#080605'; ctx.fillRect(0, 0, W, H);
    text('HOW TO PLAY', W / 2, 46, 38, '#ebe3d3', { font: FONT.disp, weight: 800, spacing: 6 });
    const rows = [
      ['PUNCH', 'Space / J (5)', 'P button', 'damage 0.5 · Shōkei uses his sword'],
      ['BLOCK', 'Hold back (4)', 'Pad back', 'blocks everything'],
      ['CROUCH', 'Hold down (2)', 'Pad down', 'ducks high attacks'],
      ['UPPERCUT', 'Crouch + punch', 'Down + P', 'damage 2'],
      ['JUMP KICK', 'Up (8), then punch', 'Up + P', 'damage 1'],
      ['FIREBALL', 'Back, forward (4 6)', 'or SP button', 'Keero · damage 1.5'],
      ['BLADE DASH', 'Back, forward (4 6)', 'or SP button', 'Shōkei · damage 1.5'],
    ];
    ctx.save(); ctx.font = `600 20px ${FONT.hud}`; ctx.textBaseline = 'middle';
    rows.forEach((r, i) => {
      const y = 104 + i * 40; ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)'; ctx.fillRect(60, y - 18, W - 120, 36);
      ctx.fillStyle = '#e8a33a'; ctx.fillText(r[0], 76, y); ctx.fillStyle = '#ebe3d3'; ctx.fillText(r[1], 230, y);
      ctx.fillStyle = '#a89c88'; ctx.fillText(r[2], 520, y); ctx.fillText(r[3], 690, y);
    });
    ctx.restore();
    text('FINISH HIM!!  Enter a 1996 fatality code on the number pad: 8 up · 2 down · 4 back · 6 forward · 5 punch', W / 2, 400, 19, '#ff6a5a');
    const f = Object.keys(G.found);
    text(f.length ? 'FATALITIES FOUND: ' + f.map(k => FATAL_NAMES[k]).join(' · ') : 'FATALITIES FOUND: none yet. The codes are in the 1996 source.', W / 2, 434, 18, '#c9a24b');
    text('2 PLAYERS (keyboard): P1 = W A S D + F punch, G special · P2 = arrows + L punch, K special', W / 2, 470, 17, '#8c8070');
    text(isTouch() ? 'TAP TO GO BACK' : 'PRESS ENTER TO GO BACK', W / 2, 512, 20, '#55ffff', { font: FONT.dos, weight: 400 });
  },
};

/* --------------------------------------------------------- select */
const Select = {
  enter() { this.t = 0; this.sel = 0; this.picker = 0; this.chosen = null; this.figs = ['keero', 'shokei'].map((k, i) => new Fighter(k, 330 + i * 300, 1, false, 0)); this.cheat = null; Audio.music('vs'); },
  pick(i, cheat) {
    const k = ['keero', 'shokei'][i];
    if (this.chosen) return;
    Audio.sfx('taiko'); Audio.say(NAMES[k] === 'SHŌKEI' ? 'Show-kay' : 'Keero');
    if (G.mode === '2p') {
      if (this.picker === 0) { G.hero = k; this.picker = 1; this.sel = 1 - i; return; }
      G.hero2 = k; this.chosen = { i, at: this.t }; return;
    }
    G.hero = k; this.chosen = { i, at: this.t, cheat };
  },
  update(dt, evs) {
    this.t += dt;
    for (const f of this.figs) { f.update(G, dt, f); }
    if (this.chosen) {
      const f = this.figs[this.chosen.i]; if (f.state !== 'victory') { f.set('victory', f.def.victory, 6); }
      if (this.t - this.chosen.at > 1.3) {
        if (G.mode === '2p') return startVersus();
        if (this.chosen.cheat) return go(Story, { kind: 'cheat' });
        G.stageIdx = 0; go(Story, { kind: 'stage', n: 0 });
      }
      return;
    }
    for (const e of evs) {
      if (e.m === 'char') {
        const k = e.k.toLowerCase();
        if (k === 'k') this.pick(0); if (k === 's') this.pick(1);
        if (e.k === '>' && G.mode === '1p') this.pick(0, true); if (e.k === '<' && G.mode === '1p') this.pick(1, true);
      }
      if (e.m === 'pause' || e.m === 'back') return go(Title);
    }
    this.sel = menuNav([0, 1], this.sel, evs, i => this.pick(i));
  },
  draw() {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a0707'); g.addColorStop(1, '#1d0d0a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const who = G.mode === '2p' ? `CHOOSE YOUR FIGHTER PLAYER ${this.picker + 1}` : 'CHOOSE YOUR FIGHTER';
    text(who, W / 2, 50, 40, '#ffff55', { font: FONT.dos, weight: 400, glow: '#aa5500', spacing: 4 });
    hits = [];
    this.figs.forEach((f, i) => {
      const x = 330 + i * 300, sel = this.sel === i;
      hits.push({ x: x - 120, y: 90, w: 240, h: 380, on: () => { if (this.sel === i || isTouch()) this.pick(i); this.sel = i; } });
      const sg = ctx.createRadialGradient(x, 330, 20, x, 330, 190); sg.addColorStop(0, sel ? 'rgba(170,85,0,0.45)' : 'rgba(170,85,0,0.12)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sg; ctx.fillRect(x - 200, 120, 400, 380);
      // 1996 selection frame, DRAW c3 (cyan)
      ctx.strokeStyle = sel ? '#55ffff' : 'rgba(85,255,255,0.15)'; ctx.lineWidth = sel ? 3 : 1; ctx.strokeRect(x - 115, 92, 230, 368);
      f.x = x; f.face = i === 0 ? 1 : -1; f.draw(ctx, { rim: '#ffb060', light: f.face, shadow: 'rgba(0,0,0,0.5)', wind: 0 }, 1 / 60);
      text(NAMES[f.key], x, 488, 34, '#ffffff', { font: FONT.disp, weight: 800, spacing: 4 });
    });
    text(isTouch() ? 'Tap a fighter to choose' : "Press 'K' for Keero, 'S' for Shōkei", W / 2, 524, 22, '#ebe3d3', { font: FONT.dos, weight: 400 });
  },
};

/* ------------------------------------------------------ story cards */
const STORY = {
  0: { lines: ['WE SHALL NOW SEE YOUR TALENT, YOU WEAK-WILLED WARRIOR....'], jingle: ['T250 O0E O0G O0E- O0E O0G- O0G', 'T250 O1E- O1E- O1E O1E O1E- O1E- O1E O1E'] },
  1: { lines: ['THINK YOUR SOMETHING, WE SHALL SEE HOW YOU FARE AGAINST YAMANA!!'], jingle: ['T250 O0E O0G O0E- O0E O0G- O0G', 'T250 O1E- O1E- O1E O1E O1E- O1E- O1E O1E'] },
  2: { lines: ['WELL, WELL, {PN}, I CAN SEE YOU ARE GOOD ENOUGH FOR MY LOWER STANDARD FIGHTERS, BUT SEE HOW YOU STAND UP AGAINST FRILL.'], jingle: ['T230 O0E O0E O0E.O1E O1G O1G O2G O3F O1E'] },
};
const Story = {
  enter(arg) {
    this.arg = arg; this.t = 0; this.done = false; Audio.music('story');
    if (arg.kind === 'cheat') { G.stageIdx = 1; this.lines = [`${NAMES[G.hero]}, YOU PRECEED WAN'FU, YOU FIGHT THE MIGHTY YAMANA`]; this.jingle = STORY[1].jingle; }
    else if (arg.kind === 'next') { this.lines = ['PRESS (RETURN) TO PLAY THE NEXT CONFRENTATION']; this.jingle = []; }
    else { const s = STORY[arg.n]; this.lines = s.lines.map(l => l.replace('{PN}', NAMES[G.hero])); this.jingle = s.jingle; }
    this.full = this.lines.join(' ');
    let d = 0.3; for (const j of this.jingle) { const jj = j; setTimeout(() => { if (G.scene === Story) Audio.play(jj, { voice: 'brass' }); }, d * 1000); d += 1.9; }
  },
  update(dt, evs) {
    this.t += dt;
    const shown = Math.floor(this.t * 34);
    const skip = evs.some(e => e.m === 'ok' || e.m === 'tap');
    if (skip && shown < this.full.length) { this.t = this.full.length / 34 + 0.01; return; }
    if (skip || evs.some(e => e.m === 'pause')) {
      Audio.sfx('confirm');
      if (this.arg.kind === 'next') return go(Story, { kind: 'stage', n: G.stageIdx });
      startStage(G.stageIdx);
    }
  },
  draw() {
    Stages.drawHall(ctx, this.t, true);
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, H);
    const shown = Math.floor(this.t * 34);
    let s = this.full.slice(0, shown);
    const lines = wrap(s, 780, 34, FONT.dos);
    lines.forEach((l, i) => text(l, 90, 200 + i * 40, 34, '#ff5555', { font: FONT.dos, weight: 400, align: 'left', glow: '#aa0000', blur: 10 }));
    if (shown >= this.full.length) text(isTouch() ? 'TAP TO CONTINUE' : 'PRESS (ENTER)', W / 2, 500, 22, '#55ffff', { font: FONT.dos, weight: 400 });
  },
};

/* ===================================================================== FIGHT */
function startStage(n) {
  G.stageIdx = n;
  setupFight(G.hero, ENEMIES[n], n, false);
}
function startVersus() {
  setupFight(G.hero, G.hero2, Math.floor(Math.random() * 3), true);
}
function setupFight(a, b, stageN, versus) {
  G.versus = versus; G.stage = Stages.make(stageN); G.stageN = stageN;
  G.p = new Fighter(a, 0, 1, true, 0); G.e = new Fighter(b, 0, -1, versus, 1);
  G.wins = [0, 0]; G.round = 1;
  go(Fight);
}

const Fight = {
  enter() { this.resetRound(); Audio.music(G.stage.music); },
  resetRound() {
    const p = G.p, e = G.e;
    for (const f of [p, e]) { f.hp = 10; f.vx = f.vy = 0; f.y = 0; f.grounded = true; f.ko = false; f.scripted = false; f.freeRot = false; f.set('idle', f.def.idle[0], 8); f.pose = Rig.copy(Rig.POSES[f.def.idle[0]]); f.dmgShow = 10; f.drawOpts = {}; f.punchCount = 0; f.ropes.forEach(r => r.r.reset()); }
    p.x = Stages.ARENA / 2 - 170; e.x = Stages.ARENA / 2 + 170; p.face = 1; e.face = -1;
    G.cam = Stages.ARENA / 2 - W / 2; G.projectiles = []; FX.reset(); G.codeEntry = null; G.fatal = null; G.pit = null;
    G.fighting = false; this.phase = 'round'; this.t = 0; G.slow = 1; G.combo = { n: 0, t: 0 }; this.result = null;
    Audio.say(['Round one', 'Round two', 'Round three', 'Round four', 'Round five'][Math.min(4, G.round - 1)]);
    Audio.sfx('gong');
  },
  update(dt, evs) {
    if (G.paused) return Pause.update(dt, evs);
    if (evs.some(e => e.m === 'pause')) { G.paused = true; Pause.sel = 0; Audio.duck(0.3, 0.3); return; }
    const realDt = dt;
    if (G.hitstop > 0) { G.hitstop -= dt; dt = 0; }
    dt *= G.slow;
    this.t += realDt; G.ftime = (G.ftime || 0) + dt;
    const p = G.p, e = G.e;
    if (G.stage.update) G.stage.update(dt);
    // round flow
    if (this.phase === 'round' && this.t > 1.3) { this.phase = 'fightcall'; this.t = 0; Audio.say(G.stageN === 2 && !G.versus ? 'Fight!' : 'Fight', 1, 0.3); Audio.sfx('taiko'); }
    if (this.phase === 'fightcall' && this.t > 0.6) { this.phase = 'fighting'; G.fighting = true; }
    // control
    p.control(G);
    if (G.versus) e.control(G); else { Input.take(1); e.brain(G, p, dt); }
    if (!G.fatal) {
      if (p.canAct() && p.grounded) p.face = e.x > p.x ? 1 : -1;
      if (e.canAct() && e.grounded) e.face = p.x > e.x ? 1 : -1;
    }
    if (dt > 0) {
      p.update(G, dt, e); e.update(G, dt, p);
      this.separate(p, e);
      for (const pr of G.projectiles) this.updateProjectile(pr, dt);
      G.projectiles = G.projectiles.filter(pr => pr.alive);
      FX.update(dt);
      if (G.fatal) G.fatal.update(dt);
    }
    if (G.combo.t > 0) { G.combo.t -= realDt; if (G.combo.t <= 0) G.combo.n = 0; }
    for (const f of [p, e]) f.dmgShow += (f.hp - f.dmgShow) * Math.min(1, realDt * (f.dmgHold > 0 ? 0 : 3)), f.dmgHold = (f.dmgHold || 0) - realDt;
    // camera
    if (!G.pit) {
      const mid = (p.x + e.x) / 2 - W / 2;
      G.cam += (Math.max(0, Math.min(Stages.ARENA - W, mid)) - G.cam) * Math.min(1, realDt * 4);
    }
    if (G.codeEntry) {
      for (const e of evs) if (e.m === 'tap' && G.codeEntry) {
        const row = G.codeRows.find(r => Math.abs(e.y - r.y) < 16 && Math.abs(e.x - W / 2) < 210);
        if (row) { const ce = G.codeEntry; G.codeEntry = null; startFatality(ce.codes[row.code], ce.who, ce.foe); break; }
      }
    }
    if (G.codeEntry) {
      G.codeEntry.t -= realDt;
      if (G.codeEntry.t <= 0) this.finishFail(true);
    }
    if (this.phase === 'ko' || this.phase === 'won') this.koFlow(realDt, evs);
  },
  separate(a, b) {
    if (G.fatal) return;
    const min = 80 * (a.s + b.s) / 2, d = b.x - a.x;
    if (Math.abs(d) < min && Math.abs(a.y - b.y) < 150 && a.state !== 'down' && b.state !== 'down') {
      const push = (min - Math.abs(d)) / 2 * Math.sign(d || 1);
      a.x -= push; b.x += push;
    }
    for (const f of [a, b]) f.x = Math.max(60, Math.min(Stages.ARENA - 60, f.x));
  },
  updateProjectile(pr, dt) {
    pr.t += dt; pr.x += pr.vx * dt;
    const tgt = pr.owner === G.p ? G.e : G.p;
    if (pr.kind === 'fire') { if (Math.random() < 0.9) FX.ember(pr.x - Math.sign(pr.vx) * 14, GY + pr.y + (Math.random() - 0.5) * 16); }
    else for (let i = 0; i < 3; i++) FX.add({ x: pr.x - Math.sign(pr.vx) * Math.random() * 60, y: GY + pr.y + (Math.random() - 0.5) * 90, vx: -pr.vx * 0.2, vy: (Math.random() - 0.5) * 60, life: 0.4, size: 3 + Math.random() * 4, col: Math.random() < 0.5 ? '#dff4ff' : '#7fc8ff', kind: 'spark', drag: 2 });
    if (pr.x < G.cam - 100 || pr.x > G.cam + W + 100) pr.alive = false;
    if (!G.fighting || tgt.state === 'down' || tgt.ko) return;
    const tx = tgt.x, hitR = pr.kind === 'blast' ? 70 : 40;
    if (Math.abs(pr.x - tx) < hitR && tgt.y > -100 + (pr.kind === 'blast' ? -60 : 0)) {
      pr.alive = false;
      this.resolve(pr.owner, tgt, { dmg: pr.dmg, type: 'mid', proj: pr.kind, sfx: pr.kind === 'fire' ? 'explode' : 'blast' }, pr.x, GY + pr.y);
    }
  },
  resolve(att, def, m, hx, hy) {
    // Frill's answers from CSHOGUN.BAS
    if (def.def.frill && !G.versus && G.fighting) {
      if (m.proj === 'fire' || m === MOVES.dash) {
        if (Math.random() < 1 / 3) { FX.ring(hx, hy, '#9fdcff', 60); Audio.sfx('parry'); frillBlast(def); return; }
      }
      if (m === MOVES.upper && Math.random() < 1 / 3) { def.set('parry', 'parry', 30); Audio.sfx('parry'); FX.spark(hx, hy, '#bfe6ff', 16); FX.pop('BLOCKED', hx - G.cam, hy - 40, '#9fdcff', 28); return; }
      if (m === MOVES.jumpKick && Math.random() < 1 / 3) { frillThrow(def, att); return; }
      if (m === att.def.punch) {
        def.punchCount++;
        if (def.punchCount % 3 === 0) {
          def.set('parry', 'parry', 30); Audio.sfx('parry'); FX.spark(hx, hy, '#bfe6ff', 14);
          const r = Math.floor(Math.random() * 4);
          setTimeout(() => { if (G.fighting && def.state === 'parry') { def.set('idle'); if (r === 1 || r === 2) def.attack('hit', true); else if (r === 0) def.attack('kick', true); } }, 160);
          return;
        }
      }
    }
    const blocked = def.state === 'block' && def.grounded;
    if (blocked) {
      Audio.sfx('block'); FX.spark(hx, hy, '#fff6d0', 10); G.hitstop = 0.05; def.vx = -def.face * 160;
      if (m.proj) FX.ring(hx, hy, '#ffd28a', 40);
      return;
    }
    def.hp = Math.max(0, def.hp - m.dmg); def.dmgHold = 0.5;
    Audio.sfx(m.sfx || 'punch');
    const pow = m.dmg / 2;
    FX.blood(hx, hy, -def.face, pow); FX.spark(hx, hy, m.proj === 'blast' ? '#bfe6ff' : '#ffe6b0', 6 + m.dmg * 4);
    if (m.proj === 'fire') FX.ring(hx, hy, '#ffb050', 70);
    G.hitstop = 0.05 + m.dmg * 0.03; FX.shake = Math.max(FX.shake, 3 + m.dmg * 3);
    if (att.human) {
      G.combo.n = G.combo.t > 0 ? G.combo.n + 1 : 1; G.combo.t = 0.9;
      const call = { 3: 'SUPER', 4: 'MASTER', 5: 'SUPERIOR!!!!', 6: 'MASSIVE!!!!!', 8: 'FULL POWER 100% COMBO' }[G.combo.n];
      if (call) { FX.pop(call, att.x < def.x ? 260 : 700, 140, '#ffdd55', 40); Audio.sfx('dizzy'); }
    }
    if (def.hp <= 0) return this.ko(att, def);
    if (!def.human) def.taken = (def.taken || 0) + 1;
    if (def.armor && def.state === 'attack') { FX.ring(hx, hy, '#ffd28a', 34); return; }
    if (m.launch || m.dmg >= 3) { def.set('launch', 'launch', 6); def.grounded = false; def.vy = -620; def.vx = -def.face * 240; }
    else { def.set('hurt', m.type === 'low' ? 'hitLo' : 'hitHi', 30); def.hurtT = 0.22 + m.dmg * 0.06; def.vx = -def.face * (150 + m.dmg * 50); def.pose.rot = 0; }
    if (def.def.acrobat && !def.human && Math.random() < 0.25) setTimeout(() => { if (def.state === 'idle' && G.fighting) { def.set('flip', 'jump', 12); def.grounded = false; def.vy = -700; def.vx = -def.face * 260; } }, 350);
  },
  ko(att, def) {
    G.fighting = false; G.projectiles = [];
    const pWon = def === G.e, wi = pWon ? 0 : 1;
    const deciding = G.wins[wi] === 1;
    // double KO: the 1996 Frill fight called a draw and replayed the round
    if (att.hp <= 0) { this.phase = 'ko'; this.t = 0; this.result = { draw: true }; def.ko = true; def.set('launch', 'launch', 6); def.grounded = false; def.vy = -500; return; }
    G.slow = 0.25; FX.flash = 0.6; FX.flashCol = '#fff';
    if (deciding && (pWon || G.versus)) {
      // FINISH HIM: the loser stays up, dazed
      def.hp = 0; def.set('dizzy', 'dizzy', 4); def.vx = -def.face * 260;
      this.phase = 'finish'; this.t = 0; G.wins[wi]++;
      setTimeout(() => { G.slow = 1; this.banner('FINISH HIM!!', '#ff3b2f', 2.4); Audio.say('Finish him!', 0.9, 0.1); Audio.sfx('dizzy');
        const codes = CODES[att.key][G.versus ? 0 : G.stageIdx];
        const secs = isTouch() ? 11 : 8;
        G.codeEntry = { who: att, foe: def, codes, d: '', t: secs, max: secs }; att.set('idle', att.def.idle[0], 8); att.vx = 0; att.digits = []; Input.take(att.pad); }, 700);
      return;
    }
    def.ko = true; def.set('launch', 'launch', 6); def.grounded = false; def.vy = -560; def.vx = -def.face * 300;
    G.wins[wi]++; this.phase = 'ko'; this.t = 0; this.result = { winner: att, loser: def, final: G.wins[wi] >= 2 };
    Audio.sfx('heavy'); FX.blood(def.x, GY - 150, -def.face, 1.5);
  },
  banner(s, col, dur, sub) { G.banner = { s, col, t: 0, dur: dur || 1.4, sub }; },
  koFlow(dt, evs) {
    const r = this.result; if (!r) return;
    if (this.t > 0.9) G.slow = 1;
    if (!r.shown && this.t > 1.1) {
      r.shown = true;
      if (r.draw) { this.banner('DRAW', '#ebe3d3', 1.6); }
      else if (r.winner === G.p && !G.versus) this.banner('YOU WIN!', '#ffdd55', 2);
      else this.banner(`${NAMES[r.winner.key]} WINS`, '#ffdd55', 2);
      if (!r.draw) { r.winner.set('victory', r.winner.def.victory, 5); Audio.say(r.winner === G.p && !G.versus ? 'You win' : NAMES[r.winner.key].replace('Ō', 'O').replace("'", '') + ' wins'); }
    }
    if (this.t > 3.2 && !r.next) {
      r.next = true;
      if (r.draw) { this.resetRound(); return; }
      if (!r.final) { G.round++; this.resetRound(); return; }
      endMatch(r.winner === G.p);
    }
  },
  finishFail(timeout) {
    const ce = G.codeEntry; if (!ce) return; G.codeEntry = null;
    const att = ce.who, def = ce.foe;
    if (timeout) { def.ko = true; def.set('launch', 'kneel', 4); def.grounded = false; def.vy = -50; def.vx = 0; Audio.sfx('fall'); }
    else {
      // a plain finishing blow
      att.move = att.def.upper; att.movePoses = att.def.upperP; att.set('attack', att.def.upperP[0], 30);
      setTimeout(() => { def.ko = true; def.set('launch', 'launch', 6); def.grounded = false; def.vy = -700; def.vx = -def.face * 340; Audio.sfx('heavy'); FX.blood(def.x, GY - 160, -def.face, 2); G.hitstop = 0.12; FX.shake = 10; }, 140);
    }
    this.phase = 'won'; this.t = 0; this.result = { winner: att, loser: def, final: true };
  },
  draw() {
    const p = G.p, e = G.e, st = G.stage;
    ctx.save();
    if (FX.shake > 0) ctx.translate((Math.random() - 0.5) * FX.shake, (Math.random() - 0.5) * FX.shake);
    if (G.pit) { this.drawPit(); }
    else {
      Retro.wrap(ctx, c => st.back(c, G.cam, G.time), true);
      ctx.save(); ctx.translate(-G.cam, 0);
      FX.drawDecals(ctx, st.bloodFloor);
      if (G.fatal && G.fatal.dim) { ctx.fillStyle = `rgba(0,0,0,${G.fatal.dim * 0.55})`; ctx.fillRect(G.cam, 0, W, H); }
      const order = G.fatal ? [G.fatal.def, G.fatal.att] : (p.state === 'attack' || p.state === 'dash' || p.state === 'jumpKick') ? [e, p] : [p, e];
      Retro.wrap(ctx, c => {
        for (const f of order) f.draw(c, st, G.frameDt || 1 / 60, f.drawOpts);
        for (const pr of G.projectiles) drawProjectile(pr, c);
        FX.draw(c);
      });
      ctx.restore();
      Retro.wrap(ctx, c => st.front(c, G.cam, G.time), true);
    }
    ctx.restore();
    if (FX.flash > 0) { ctx.fillStyle = FX.flashCol; ctx.globalAlpha = Math.min(1, FX.flash) * 0.6; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    if (!G.fatal || !G.fatal.noHud) drawHud();
    FX.drawPops(ctx);
    drawBanner();
    if (this.phase === 'round') { const k = ease(this.t / 0.4); text(`ROUND ${G.round}`, W / 2, 230, 70 * (0.6 + 0.4 * k), '#ebe3d3', { font: FONT.disp, weight: 800, stroke: 8, glow: '#a3201d', spacing: 6 }); if (!G.versus) text(`STAGE ${G.stageIdx + 1} · ${G.stage.name}`, W / 2, 290, 22, 'rgba(235,227,211,0.85)', { spacing: 4, stroke: 4 }); }
    if (this.phase === 'fightcall') { const k = ease(this.t / 0.25); text(G.stageN === 2 && !G.versus ? 'FIGHT!!!!' : 'FIGHT!', W / 2, 230, 96 * (1.4 - 0.4 * k), '#ff3b2f', { font: FONT.disp, weight: 800, stroke: 10, glow: '#ff6a00', spacing: 6 }); }
    if (G.codeEntry) drawCodeEntry();
    if (G.paused) Pause.draw();
  },
  drawPit() {
    const pit = G.pit;
    Retro.wrap(ctx, c => Stages.drawPit(c, G.time, pit.blood), true);
    ctx.save(); ctx.translate(-G.cam, 0);
    const e = G.fatal ? G.fatal.def : G.e; e.draw(ctx, { rim: '#ffb070', light: 1, shadow: 'rgba(0,0,0,0)', wind: 0 }, 1 / 60, e.drawOpts);
    ctx.restore();
    Retro.wrap(ctx, c => Stages.drawPit(c, G.time, pit.blood, true), true);
    ctx.save(); ctx.translate(-G.cam, 0); Retro.wrap(ctx, c => FX.draw(c)); ctx.restore();
  },
};
G.tryHit = function (att, def, m) {
  if (def.ko || def.state === 'down' || def.state === 'dizzy' || def.scripted) return;
  const dx = (def.x - att.x) * att.face;
  if (dx < -20 || dx > m.reach + (def.s - 1) * 80) return;
  if (m.type === 'high' && def.state === 'crouch') return;
  if (m.type === 'low' && !def.grounded && def.y < -40) return;
  if (m.type === 'air' && (att.y < -200)) return;
  att.hitDone = true;
  const hy = GY + def.y - (m.type === 'low' ? 70 : m.type === 'air' ? 130 : 150) * def.s;
  Fight.resolve(att, def, m, def.x - def.face * 18, hy);
};
G.spawnFire = function (f) {
  Audio.sfx('fireball');
  G.projectiles.push({ owner: f, kind: 'fire', x: f.x + f.face * 70, y: -150, vx: f.face * 560, dmg: 1.5, t: 0, alive: true });
};
// Codes are read leniently: a repeated direction only has to be pushed once
// (668 works as right, up), and a stray push that fits no code is ignored
// instead of failing, so the stick on a phone is forgiving. Only the timer fails.
const squash = s => s.replace(/(.)\1+/g, '$1');
G.codeDigit = function (d) {
  const ce = G.codeEntry; if (!ce) return;
  const codes = Object.keys(ce.codes), fits = s => codes.find(c => squash(c).startsWith(squash(s)));
  let next = ce.d + d;
  if (!fits(next)) { if (!fits(String(d))) return; next = String(d); }   // ignore the stray, or start again from it
  ce.d = next; Audio.sfx('code', ce.d.length);
  const hit = codes.find(c => squash(c) === squash(ce.d));
  if (hit) { const kind = ce.codes[hit]; G.codeEntry = null; startFatality(kind, ce.who, ce.foe); }
};
G.codeRows = [];   // where each code is drawn, so a tap on it does the fatality
function frillBlast(fr) {
  fr.set('blast', 'blastS', 16);
  setTimeout(() => { if (!G.fighting) return; fr.target = 'blastH'; fr.speed = 30; Audio.sfx('blast'); FX.flash = 0.4; FX.flashCol = '#bfe6ff';
    G.projectiles.push({ owner: fr, kind: 'blast', x: fr.x + fr.face * 60, y: -130, vx: fr.face * 620, dmg: 3.5, t: 0, alive: true }); }, 380);
}
function frillThrow(fr, victim) {
  // ETR in CSHOGUN.BAS: Frill plucks the jump kick out of the air and slams you (damage 3)
  Audio.sfx('catch'); fr.set('attack', 'grab', 24); fr.move = { st: 99, act: 0, rec: 0 }; fr.movePoses = ['grab', 'grab'];
  victim.set('hurt', 'heldUp', 20); victim.hurtT = 9; victim.vx = 0; victim.vy = 0; victim.grounded = true; victim.scripted = true; victim.freeRot = true;
  victim.x = fr.x + fr.face * 30; victim.y = -170;
  setTimeout(() => {
    fr.target = 'slam'; fr.speed = 20;
    victim.scripted = false; victim.freeRot = false; victim.grounded = false; victim.vy = 900; victim.vx = fr.face * 60;
    victim.hp = Math.max(0, victim.hp - 3); victim.dmgHold = 0.5;
    setTimeout(() => {
      Audio.sfx('fall'); Audio.sfx('crunch'); FX.shake = 14; FX.blood(victim.x, GY - 30, 0, 1.5); FX.dust(victim.x, GY, 16);
      if (victim.hp <= 0) Fight.ko(fr, victim); else { victim.set('down', 'down', 12); victim.pose.rot = -88; }
      fr.set('idle', fr.def.idle[0], 6);
    }, 170);
  }, 420);
}
function drawProjectile(pr, ctx) {
  const x = pr.x, y = GY + pr.y, t = pr.t;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  if (pr.kind === 'fire') {
    for (let i = 0; i < 5; i++) {
      const r = 26 - i * 4 + Math.sin(t * 40 + i) * 3, xx = x - Math.sign(pr.vx) * i * 10;
      const g = ctx.createRadialGradient(xx, y, 0, xx, y, r * 1.6); g.addColorStop(0, `rgba(255,240,190,${0.9 - i * 0.15})`); g.addColorStop(0.4, `rgba(255,140,40,${0.7 - i * 0.12})`); g.addColorStop(1, 'rgba(200,40,10,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(xx, y, r * 1.6, 0, 7); ctx.fill();
    }
  } else {
    const g = ctx.createRadialGradient(x, y, 0, x, y, 120); g.addColorStop(0, 'rgba(240,250,255,0.95)'); g.addColorStop(0.35, 'rgba(140,200,255,0.6)'); g.addColorStop(1, 'rgba(60,100,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, 120 + Math.sin(t * 30) * 8, 90, 0, 0, 7); ctx.fill();
  }
  ctx.restore();
}

/* ------------------------------------------------------------- HUD */
function drawBar(x, y, w, h, hp, show, flip) {
  ctx.save();
  ctx.fillStyle = '#0b0807'; ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.strokeStyle = '#c9a24b'; ctx.lineWidth = 2; ctx.strokeRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = '#2a0b0a'; ctx.fillRect(x, y, w, h);
  const k = hp / 10, ks = Math.max(k, show / 10);
  const fill = (kk, col) => { const ww = w * kk; if (flip) ctx.fillRect(x + w - ww, y, ww, h); else ctx.fillRect(x, y, ww, h); };
  ctx.fillStyle = '#f2e6c8'; fill(ks);
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#ff5a3c'); g.addColorStop(0.5, '#c4221a'); g.addColorStop(1, '#7a0f0b');
  ctx.fillStyle = g; fill(k);
  // the 1996 dither: ░▒▓ at the start of the bar
  const ww = w * k; ctx.fillStyle = 'rgba(0,0,0,0.45)';
  for (let i = 0; i < Math.min(ww, w * 0.3); i += 3) {
    const dens = 1 - i / (w * 0.3);
    for (let j = 0; j < h; j += 3) if (((i / 3 + j / 3) % 2 === 0) && Math.random() < 2 && dens > ((i * 7 + j * 13) % 10) / 10) ctx.fillRect(flip ? x + w - i - 2 : x + i, y + j, 2, 2);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x, y + 2, w, 3);
  ctx.restore();
}
function drawHud() {
  const p = G.p, e = G.e;
  drawBar(40, 22, 380, 22, p.hp, p.dmgShow, false);
  drawBar(W - 420, 22, 380, 22, e.hp, e.dmgShow, true);
  text(NAMES[p.key], 42, 62, 26, '#ffffff', { align: 'left', spacing: 2, stroke: 4 });
  text(NAMES[e.key], W - 42, 62, 26, '#ffffff', { align: 'right', spacing: 2, stroke: 4 });
  text(`ROUND ${G.round}`, W / 2, 33, 20, '#ff5555', { font: FONT.dos, weight: 400 });
  for (let i = 0; i < 2; i++) {
    for (const [wi, x0, dir] of [[0, 440 - 22, -1], [1, W - 440 + 22, 1]]) {
      const x = x0 + dir * i * 22, on = G.wins[wi] > i;
      ctx.fillStyle = on ? '#ffcc4d' : 'rgba(255,255,255,0.12)'; ctx.strokeStyle = '#c9a24b'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, 62, 7, 0, 7); ctx.fill(); ctx.stroke();
    }
  }
}
function drawBanner() {
  const b = G.banner; if (!b) return;
  b.t += G.frameDt || 1 / 60; if (b.t > b.dur) { G.banner = null; return; }
  const k = ease(b.t / 0.25), a = b.t > b.dur - 0.3 ? (b.dur - b.t) / 0.3 : 1;
  ctx.save(); ctx.globalAlpha = a;
  text(b.s, W / 2, 210, 84 * (1.3 - 0.3 * k), b.col, { font: FONT.disp, weight: 800, stroke: 10, glow: b.col, blur: 24, spacing: 4 });
  if (b.sub) text(b.sub, W / 2, 278, 30, '#ebe3d3', { stroke: 5, spacing: 4 });
  ctx.restore();
}
const ARROW = { 8: '↑', 2: '↓', 4: '←', 6: '→', 5: '●', 1: '↙', 3: '↘', 7: '↖', 9: '↗' };
function codeArrows(code, face) {
  return code.split('').map(d => face < 0 && (d === '4' || d === '6') ? ARROW[d === '4' ? 6 : 4] : (ARROW[d] || d)).join(' ');
}
function drawCodeEntry() {
  const ce = G.codeEntry, face = ce.who.face;
  const list = Object.entries(ce.codes);
  const top = 446 - 12 - list.length * 30;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(W / 2 - 200, top, 400, list.length * 30 + 8);
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(W / 2 - 200, 446, 400, 74);
  ctx.strokeStyle = '#a3201d'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 200, 446, 400, 74);
  ctx.fillStyle = '#a3201d'; ctx.fillRect(W / 2 - 198, 514, 396 * Math.max(0, ce.t / ce.max), 4);
  ctx.restore();
  G.codeRows = list.map(([code], i) => ({ code, y: top + 19 + i * 30 }));
  list.forEach(([code, kind], i) => {
    const y = top + 19 + i * 30, ok = squash(code).startsWith(squash(ce.d));
    const col = ok ? '#ffdd55' : '#6b5f50';
    text(FATAL_NAMES[kind], W / 2 - 20, y, 20, col, { align: 'right', spacing: 2 });
    text(codeArrows(code, face), W / 2 + 4, y, 28, col, { font: FONT.dos, weight: 400, align: 'left' });
  });
  const s = codeArrows(ce.d, face);
  text(s || '_', W / 2, 476, 36, '#ffffff', { font: FONT.dos, weight: 400 });
  text(isTouch() ? 'TAP A FATALITY, OR FOLLOW ITS CODE ON THE STICK' : 'FOLLOW A CODE WITH THE ARROWS OR NUMBER PAD · ● = PUNCH', W / 2, 505, 14, '#c9b9a0', { spacing: 1 });
}

/* ------------------------------------------------------------ pause */
const Pause = {
  sel: 0,
  list() {
    return [['RESUME', () => { G.paused = false; }], ['HOW TO PLAY', () => { go(Help, 'pause'); G.paused = false; }],
      [`SOUND: ${soundPref ? 'ON' : 'OFF'}`, () => { soundPref = !soundPref; Audio.setOn(soundPref); store.set('sound', soundPref); }],
      ['QUIT TO TITLE', () => { G.paused = false; Input.twoP = false; go(Title); }],
      ['ALL GAMES', toMenu]];
  },
  update(dt, evs) { if (evs.some(e => e.m === 'pause' || e.m === 'back')) { G.paused = false; return; } const l = this.list(); this.sel = menuNav(l, this.sel, evs, i => l[i][1]()); },
  draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, W, H);
    text('PAUSED', W / 2, 120, 54, '#ebe3d3', { font: FONT.disp, weight: 800, spacing: 8 });
    hits = []; this.list().forEach(([l, on], i) => button(l, W / 2, 210 + i * 64, 340, 50, on, i === this.sel));
  },
};

/* ------------------------------------------------------------ match end */
function endMatch(playerWon) {
  Input.take(0);
  if (G.versus) return go(VersusEnd, playerWon ? G.p : G.e);
  if (!playerWon) return go(GameOver);
  if (G.stageIdx >= 2) return go(Ending);
  G.stageIdx++;
  go(Story, { kind: 'next' });
}
const VersusEnd = {
  enter(w) { this.w = w; this.t = 0; this.sel = 0; Audio.music('title'); },
  update(dt, evs) { this.t += dt; const l = [['REMATCH', () => startVersus()], ['TITLE', () => { Input.twoP = false; go(Title); }]]; this.sel = menuNav(l, this.sel, evs, i => l[i][1]()); this.l = l; },
  draw() {
    Stages.drawHall(ctx, this.t, false); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H);
    text(`${NAMES[this.w.key]} WINS`, W / 2, 180, 72, '#ffdd55', { font: FONT.disp, weight: 800, stroke: 8, glow: '#aa5500' });
    hits = []; (this.l || []).forEach(([l, on], i) => button(l, W / 2 - 110 + i * 220, 380, 200, 50, on, i === this.sel));
  },
};
const GameOver = {
  enter() { this.t = 0; this.sel = 0; Audio.music(null); Audio.play('T250 O1E- O1E- O0E O0E O0G- O0E', { voice: 'brass' }); this.f = new Fighter(ENEMIES[G.stageIdx], 560, -1, false, 0); this.f.set('victory', this.f.def.victory, 4); Audio.say('Game over', 0.8, 0.1); },
  update(dt, evs) {
    this.t += dt; this.f.update(G, dt, this.f);
    const l = [['FIGHT AGAIN', () => startStage(G.stageIdx)], ['TITLE', () => go(Title)]]; this.l = l;
    if (this.t > 1) this.sel = menuNav(l, this.sel, evs, i => l[i][1]());
  },
  draw() {
    ctx.fillStyle = '#050303'; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(560, 380, 10, 560, 380, 300); g.addColorStop(0, 'rgba(140,20,10,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#140808'; ctx.fillRect(0, GY, W, H - GY);
    this.f.draw(ctx, { rim: '#ff7050', light: -1, shadow: 'rgba(0,0,0,0.5)', wind: 0 }, 1 / 60);
    // the fallen hero
    const hero = { x: 300, y: 0, face: 1, pose: Rig.copy(Rig.POSES.down), look: Rig.LOOKS[G.hero], grounded: true };
    Retro.wrap(ctx, c => Rig.draw(c, Rig.solve(hero, GY), { rim: '#ff7050', light: 1 }));
    text('G A M E   O V E R', W / 2, 80, 56, '#ff3b2f', { font: FONT.dos, weight: 400, glow: '#aa0000' });
    text('YOU HAVE FALLEN, WEAK-WILLED WARRIOR. THE SHOTAKAN', W / 2, 140, 26, '#ebe3d3', { font: FONT.dos, weight: 400 });
    text('TAKAMARA HAS NO PLACE FOR THOSE WHO CANNOT STAND.', W / 2, 170, 26, '#ebe3d3', { font: FONT.dos, weight: 400 });
    hits = []; if (this.t > 1) (this.l || []).forEach(([l, on], i) => button(l, W / 2 - 120 + i * 240, 500, 220, 46, on, i === this.sel));
  },
};
const Ending = {
  enter() {
    this.t = 0; Audio.music('title'); Audio.play('T250 O1E O1G O2C O2E O2G O2E O2G.', { voice: 'brass' });
    setTimeout(() => { if (G.scene === Ending) Audio.play('T200 O0E O0E O0E.O1E O1G O1G O2G O3F O1E', { voice: 'brass' }); }, 2600);
    this.f = new Fighter(G.hero, 330, 1, false, 0); this.f.set('victory', this.f.def.victory, 3); G.stage = Stages.make(2);
    Audio.say(NAMES[G.hero].replace('Ō', 'O') + ' wins. Flawless.', 0.85, 0.2);
  },
  update(dt, evs) { this.t += dt; this.f.update(G, dt, this.f); if (this.t > 4 && evs.some(e => e.m === 'ok' || e.m === 'tap')) go(Title); },
  draw() {
    Retro.wrap(ctx, c => G.stage.back(c, 110, this.t), true);
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, W, H);
    this.f.draw(ctx, G.stage, 1 / 60);
    // Frill's remains, a smear of shadow
    ctx.fillStyle = 'rgba(10,14,30,0.9)'; ctx.beginPath(); ctx.ellipse(600, GY + 2, 120, 12, 0, 0, 7); ctx.fill();
    for (let i = 0; i < 3; i++) FX.smoke(540 + Math.random() * 120, GY - 4, 'rgba(120,180,255,0.18)');
    FX.update(1 / 60); Retro.wrap(ctx, c => FX.draw(c));
    const a = k => ease((this.t - k) / 0.8);
    ctx.globalAlpha = a(0.3); text('F R I L L   H A S   F A L L E N', W / 2, 80, 44, '#ff3b2f', { font: FONT.dos, weight: 400, glow: '#aa0000' });
    ctx.globalAlpha = a(1.5); text('YOU ARE THE CHAMPION OF THE SHOTAKAN TAKAMARA.', W / 2, 150, 28, '#ffffff', { font: FONT.dos, weight: 400 });
    ctx.globalAlpha = a(2.8); text('...BUT THE MASTER STILL WAITS IN THE SHADOWS.', W / 2, 186, 28, '#ff5555', { font: FONT.dos, weight: 400 });
    ctx.globalAlpha = a(4.2); text('TO BE CONTINUED IN   S H O G U N   I I', W / 2, 250, 32, '#55ffff', { font: FONT.dos, weight: 400, glow: '#00aaaa' });
    ctx.globalAlpha = a(5); text('MYSTICAL SOFTWARE  (C)1996  ·  REMASTERED 2026', W / 2, 515, 20, '#00aaaa', { font: FONT.dos, weight: 400 });
    ctx.globalAlpha = 1;
  },
};

/* ================================================================ FATALITIES */
function startFatality(kind, att, def) {
  G.found[kind] = 1; store.set('found', G.found);
  Fight.phase = 'fatal'; G.fighting = false;
  const steps = { head: fatalHead, pit: fatalPit, throw: fatalPit, run: fatalRun }[kind];
  G.fatal = { t: 0, dim: 0, kind, done: {}, att, def, run: steps };
  att.scripted = true; def.scripted = true;
  Audio.duck(0.25, 6);
  G.fatal.update = function (dt) {
    this.t += dt; this.dim = Math.min(1, this.dim + dt * 2);
    const once = (k, at, fn) => { if (this.t >= at && !this.done[k]) { this.done[k] = 1; fn(); } };
    this.run(this, once, dt);
    once('banner', this.bannerAt || 99, () => { Fight.banner('FATALITY', '#ff2a1f', 2.6); Audio.sfx('fatality'); Audio.say('Fatality', 0.75, 0.05); FX.flash = 0.5; FX.flashCol = '#a00'; });
    once('wins', (this.bannerAt || 99) + 2.8, () => { Fight.banner(`${NAMES[att.key]} WINS`, '#ffdd55', 2.2, FATAL_NAMES[kind]); });
    once('end', (this.bannerAt || 99) + 5.2, () => { G.fatal = null; G.pit = null; endMatch(att === G.p); });
  };
}
function approach(f, x, dt, sp) { const d = x - f.x; if (Math.abs(d) > 4) { f.x += Math.sign(d) * Math.min(Math.abs(d), sp * dt); f.target = Math.sin(G.time * 9) > 0 ? 'walk1' : 'walk2'; f.speed = 10; return false; } return true; }

function fatalHead(F, once, dt) {
  const a = F.att, d = F.def, t = F.t;
  if (t < 0.7) { if (approach(a, d.x - a.face * 84, dt, 220)) { a.target = a.def.idle[0]; } }
  once('wind', 0.75, () => { a.target = 'chargeS'; a.speed = 14; Audio.sfx('whoosh'); });
  once('rip', 1.15, () => {
    a.target = 'upperH'; a.speed = 40; Audio.sfx('crunch'); Audio.sfx('blood');
    const J = d.solve(); d.drawOpts = { noHead: true };
    FX.gibs.push(new FX.Gib(J, 'head', J.Hd, a.face * 160, -1050, a.face * 9, { restOff: 14 }));
    FX.shake = 16; G.hitstop = 0.15; FX.flash = 0.35; FX.flashCol = '#900';
  });
  if (t > 1.15 && t < 3.0 && d.J) { const n = d.J.N; FX.bloodJet(n[0], n[1] - 4, -Math.PI / 2 + Math.sin(t * 8) * 0.3, 520, 2); }
  once('sag', 2.4, () => { d.target = 'kneel'; d.speed = 5; Audio.sfx('fall'); });
  once('drop', 3.1, () => { d.target = 'down'; d.speed = 7; d.freeRot = false; d.vx = -d.face * 260; Audio.sfx('fall'); FX.dust(d.x, GY, 12); });
  if (t > 3.1) d.pose.rot += (-88 - d.pose.rot) * Math.min(1, dt * 7);
  once('vict', 2.0, () => { a.target = a.def.victory; a.speed = 5; });
  F.bannerAt = 3.4;
}

function fatalPit(F, once, dt) {
  const a = F.att, d = F.def, t = F.t, thrown = F.kind === 'throw';
  if (t < 0.7) { if (approach(a, d.x - a.face * (thrown ? 40 : 80), dt, 220)) a.target = a.def.idle[0]; }
  if (thrown) {
    once('grab', 0.75, () => { a.target = 'grab'; a.speed = 16; Audio.sfx('catch'); });
    once('lift', 1.1, () => { a.target = 'carry'; a.speed = 9; d.freeRot = true; d.target = 'heldUp'; d.speed = 8; d.grounded = true; });
    if (t > 1.1 && t < 1.8) { d.x += (a.x - d.x) * Math.min(1, dt * 8); d.y += (-190 - d.y) * Math.min(1, dt * 8); d.pose.rot += (-90 - d.pose.rot) * Math.min(1, dt * 8); }
    once('toss', 1.8, () => { Audio.sfx('whoosh'); d.state = 'launch'; d.grounded = false; d.vy = -1700; d.vx = a.face * 60; });
  } else {
    once('crouch', 0.75, () => { a.target = a.def.upperP[0]; a.speed = 16; });
    once('up', 1.05, () => { a.target = a.def.upperP[1]; a.speed = 40; Audio.sfx('heavy'); FX.blood(d.x, GY - 160, a.face, 1.5); FX.shake = 12; G.hitstop = 0.1; d.state = 'launch'; d.grounded = false; d.vy = -1800; d.vx = a.face * 40; d.freeRot = true; });
  }
  if (d.state === 'launch' && !G.pit) d.pose.rot -= dt * 500;
  once('cut', thrown ? 2.35 : 1.6, () => {
    // cut to the pit below the arena floor
    G.pit = { blood: 0 }; G.cam = 0; d.x = W / 2; d.y = -900; d.vy = 300; d.vx = 0; d.grounded = true; d.state = 'pitfall'; d.target = 'impaled'; d.speed = 4; d.freeRot = true; d.pose.rot = -60;
    FX.parts.length = 0; FX.decals.length = 0;
  });
  if (G.pit && !F.done.impale) {
    d.vy += 2200 * dt; d.y += d.vy * dt; d.pose.rot += (-84 - d.pose.rot) * Math.min(1, dt * 5);
    if (d.y >= -70) {
      d.y = -70; d.vy = 0; F.done.impale = 1;
      Audio.sfx('spikes'); Audio.sfx('blood'); FX.shake = 22; FX.flash = 0.5; FX.flashCol = '#800';
      for (let i = 0; i < 4; i++) FX.bloodJet(W / 2 - 60 + i * 40, GY - 90, -Math.PI / 2 + (Math.random() - 0.5), 420, 14);
      F.impaleT = t;
    }
  }
  if (G.pit) {
    G.pit.blood = Math.min(1, G.pit.blood + (F.done.impale ? dt * 0.8 : 0));
    if (F.done.impale && Math.random() < 0.3) FX.add({ x: W / 2 - 80 + Math.random() * 160, y: GY - 60, vy: 40, g: 900, life: 0.6, size: 2 + Math.random() * 2, col: '#7a0c0a', kind: 'blood' });
  }
  F.bannerAt = thrown ? 3.4 : 2.8;
}
// the pit uses the fighter's own physics off, so keep its grounded flag false while falling
function fatalRun(F, once, dt) {
  const a = F.att, d = F.def, t = F.t;
  if (t < 0.55) { if (approach(a, d.x - a.face * 150, dt, 260)) a.target = a.def.idle[0]; }
  once('lunge', 0.6, () => { a.target = 'thrust'; a.speed = 30; Audio.sfx('dash'); });
  if (t > 0.6 && t < 0.78) a.x += a.face * 470 * dt;
  once('pierce', 0.78, () => {
    Audio.sfx('sliceHit'); Audio.sfx('blood'); d.target = 'hitLo'; d.speed = 20; G.hitstop = 0.18; FX.shake = 12;
    a.drawOpts = { bloodBlade: true };
  });
  if (t > 0.8 && t < 1.7 && d.J) FX.bloodJet(d.x + a.face * 26, GY - 140 * d.s, a.face > 0 ? -0.3 : Math.PI + 0.3, 380, 2);
  once('pull', 1.7, () => { a.target = 'sIdle'; a.speed = 8; d.target = 'hitHi'; d.speed = 8; Audio.sfx('slash'); });
  if (t > 1.7 && t < 2.1) a.x -= a.face * 220 * dt;
  once('raise', 2.15, () => { a.target = 'cleaveS'; a.speed = 14; });
  once('cleave', 2.55, () => {
    a.target = 'cleaveH'; a.speed = 40; Audio.sfx('slash'); Audio.sfx('crunch'); Audio.sfx('blood');
    const J = d.solve(); d.drawOpts = { only: 'lower' };
    FX.gibs.push(new FX.Gib(J, 'upper', J.H, a.face * 210, -620, a.face * 3.2, { restOff: 34, rim: G.stage.rim, light: G.stage.light }));
    FX.shake = 18; G.hitstop = 0.16; FX.flash = 0.4; FX.flashCol = '#900';
  });
  if (t > 2.55 && t < 4 && d.J) FX.bloodJet(d.J.H[0], d.J.H[1] - 6, -Math.PI / 2 + Math.sin(t * 9) * 0.35, 460, 2);
  once('legs', 3.2, () => { d.target = 'kneel'; d.speed = 5; Audio.sfx('fall'); });
  once('vict', 3.5, () => { a.target = 'sVictory'; a.speed = 5; });
  F.bannerAt = 3.6;
}

/* ================================================================ LOOP */
let last = performance.now(), q = 1;
function resize() {
  const r = cv.getBoundingClientRect();
  q = Math.min(2.5, Math.max(1, (window.devicePixelRatio || 1) * r.width / W));
  cv.width = Math.round(W * q); cv.height = Math.round(H * q);
}
addEventListener('resize', resize);
cv.addEventListener('pointerdown', e => {
  const r = cv.getBoundingClientRect();
  Input.menu.push({ m: 'tap', x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H });
  if (e.pointerType === 'touch') { Input.touch = true; document.body.classList.add('touch'); }
});
addEventListener('touchstart', () => { Input.touch = true; document.body.classList.add('touch'); }, { passive: true });

// phones: go full screen on the first tap (browsers only allow it from a tap)
function goFull() {
  const d = document.documentElement, fs = d.requestFullscreen || d.webkitRequestFullscreen;
  if (!matchMedia('(pointer: coarse)').matches || !fs || document.fullscreenElement || document.webkitFullscreenElement) return;
  try { const r = fs.call(d); if (r && r.catch) r.catch(() => {}); } catch (e) {}
}
addEventListener('pointerdown', goFull, { once: true, capture: true });

// back to the Shogun Classics menu (the folder above this game)
function toMenu(e) {
  if (e && e.preventDefault) e.preventDefault();
  let same = false;
  try { same = !!document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1; } catch (err) {}
  if (same) history.back(); else location.href = '../';
}
document.getElementById('btnMenu').addEventListener('click', toMenu);

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  G.time += dt; G.frameDt = dt;
  Input.pollPads();
  document.body.classList.toggle('two', Input.twoP);
  Input.fourWay = !!G.codeEntry;   // during FINISH HIM the stick reads only up, down, left and right
  document.body.classList.toggle('front', G.scene === Title || G.scene === Power);   // corner MENU link only on the title screens
  const evs = Input.takeMenu();
  try {
    G.scene.update(dt, evs);
    ctx.setTransform(q, 0, 0, q, 0, 0);
    G.scene.draw();
  } catch (err) { console.error(err); }
  requestAnimationFrame(frame);
}
Input.bindTouch(document.getElementById('touch'));
if (matchMedia('(pointer: coarse)').matches) document.body.classList.add('touch');
resize(); go(Power); requestAnimationFrame(frame);
