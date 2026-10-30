// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
'use strict';
// A small QBasic 1.1 interpreter: just enough of the language to run the 1996 Shogun sources unmodified.

class BasicError extends Error {}

const U2C = new Map();
for (let i = 255; i >= 0; i--) U2C.set(CP437[i], i);
const toCode = ch => { const c = U2C.get(ch); return c === undefined ? 63 : c; };

// ---------- palettes ----------
const EGA = [[0,0,0],[0,0,170],[0,170,0],[0,170,170],[170,0,0],[170,0,170],[170,85,0],[170,170,170],
  [85,85,85],[85,85,255],[85,255,85],[85,255,255],[255,85,85],[255,85,255],[255,255,85],[255,255,255]];
function vga256() {
  const p = EGA.slice();
  const grays = [0,5,8,11,14,17,20,24,28,32,36,40,45,50,56,63];
  grays.forEach(g => p.push([g*4.05|0, g*4.05|0, g*4.05|0]));
  for (const [hi, los] of [[63,[0,31,45]],[28,[0,14,20]],[16,[0,8,11]]]) {
    for (const lo of los) {
      const lv = [0,1,2,3,4].map(k => Math.round(lo + (hi - lo) * k / 4));
      let r = 0, g = 0, b = 4;
      const steps = [['r',1],['b',-1],['g',1],['r',-1],['b',1],['g',-1]];
      const st = { r: 0, g: 0, b: 4 };
      for (const [ch, d] of steps) for (let k = 0; k < 4; k++) {
        p.push([lv[st.r]*4.05|0, lv[st.g]*4.05|0, lv[st.b]*4.05|0]);
        st[ch] += d;
      }
    }
  }
  while (p.length < 256) p.push([0,0,0]);
  return p;
}
const PAL16 = EGA, PAL256 = vga256();

// ---------- screen ----------
const MODES = {
  0:  { w: 640, h: 400, cols: 80, rows: 25, ch: 16 },
  12: { w: 640, h: 480, cols: 80, rows: 30, ch: 16 },
  13: { w: 320, h: 200, cols: 40, rows: 25, ch: 8 },
};
class Screen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.onMode = null;
    this.setMode(0);
  }
  setMode(m) {
    const M = MODES[m];
    if (!M) throw new BasicError('Illegal function call');
    this.mode = m; Object.assign(this, M);
    this.pix = new Uint8Array(this.w * this.h);
    this.chars = new Uint8Array(this.cols * this.rows).fill(32);
    this.pal = m === 13 ? PAL256 : PAL16;
    this.fg = m === 0 ? 7 : 15; this.bg = 0; this.dcolor = null;
    this.row = 1; this.col = 1; this.wrap = false;
    this.gx = this.w >> 1; this.gy = this.h >> 1;
    if (this.canvas) {
      this.canvas.width = this.w; this.canvas.height = this.h;
      this.img = this.ctx.createImageData(this.w, this.h);
    }
    this.dirty = true;
    if (this.onMode) this.onMode(m);
  }
  cls() {
    this.pix.fill(this.mode === 0 ? this.bg : 0);
    this.chars.fill(32);
    this.row = 1; this.col = 1; this.wrap = false;
    this.gx = this.w >> 1; this.gy = this.h >> 1;
    this.dirty = true;
  }
  glyph(code, row, col) {
    const x0 = (col - 1) * 8, y0 = (row - 1) * this.ch, w = this.w;
    const fg = this.fg, bg = this.mode === 0 ? this.bg : 0, base = code * 16;
    this.chars[(row - 1) * this.cols + col - 1] = fg === bg ? 32 : code;
    for (let y = 0; y < this.ch; y++) {
      const bits = this.ch === 16 ? FONT[base + y] : (FONT[base + 2*y] | FONT[base + 2*y + 1]);
      let o = (y0 + y) * w + x0;
      for (let x = 0; x < 8; x++) this.pix[o + x] = (bits & (0x80 >> x)) ? fg : bg;
    }
    this.dirty = true;
  }
  newline() {
    this.wrap = false; this.col = 1; this.row++;
    if (this.row > this.rows) {
      const n = this.ch * this.w;
      this.pix.copyWithin(0, n);
      this.chars.copyWithin(0, this.cols); this.chars.fill(32, this.chars.length - this.cols);
      this.pix.fill(this.mode === 0 ? this.bg : 0, this.pix.length - n);
      this.row = this.rows; this.dirty = true;
    }
  }
  putCode(code) {
    if (this.wrap) this.newline();
    this.glyph(code, this.row, this.col);
    if (this.col >= this.cols) this.wrap = true; else this.col++;
  }
  print(s) { for (const ch of s) this.putCode(toCode(ch)); }
  curCol() { return this.wrap ? this.cols + 1 : this.col; }
  tab(n) {
    n = Math.max(1, Math.min(this.cols, Math.floor(n)));
    if (this.curCol() > n) this.newline();
    while (this.col < n) this.putCode(32);
  }
  zone() {
    const c = this.curCol();
    const target = (Math.floor((c - 1) / 14) + 1) * 14 + 1;
    if (target > this.cols - 13) { this.newline(); return; }
    while (this.col < target) this.putCode(32);
  }
  backspace() {
    if (this.wrap) { this.wrap = false; this.glyph(32, this.row, this.col); return; }
    if (this.col > 1) { this.col--; this.glyph(32, this.row, this.col); }
  }
  locate(r, c) {
    if (r != null) { if (r < 1 || r > this.rows) throw new BasicError('Illegal function call'); this.row = r | 0; }
    if (c != null) { if (c < 1 || c > this.cols) throw new BasicError('Illegal function call'); this.col = c | 0; }
    this.wrap = false;
  }
  color(f, b) {
    if (f != null) this.fg = this.mode === 13 ? (f & 255) : (f & 15);
    if (b != null && this.mode === 0) this.bg = b & 7;
    this.dcolor = null;
  }
  pset(x, y, c) {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.pix[y * this.w + x] = c; this.dirty = true;
  }
  line(x0, y0, x1, y1, c) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let e = dx + dy;
    for (;;) {
      this.pset(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  }
  circle(cx, cy, r, c) {
    const aspect = (4 / 3) * (this.h / this.w);
    const steps = Math.max(16, Math.ceil(r * 8));
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      this.pset(cx + Math.cos(a) * r, cy - Math.sin(a) * r * aspect, c);
    }
  }
  draw(s) {
    s = s.toUpperCase();
    let i = 0, noDraw = false, noMove = false, scale = 4;
    const skip = () => { while (i < s.length && (s[i] === ' ' || s[i] === ';')) i++; };
    const num = () => {
      skip(); let j = i;
      if (s[i] === '+' || s[i] === '-') i++;
      while (i < s.length && s[i] >= '0' && s[i] <= '9') i++;
      return i > j && !(i === j + 1 && (s[j] === '+' || s[j] === '-')) ? parseInt(s.slice(j, i), 10) : null;
    };
    const moveTo = (tx, ty) => {
      if (!noDraw) this.line(this.gx, this.gy, tx, ty, this.dcolor ?? this.fg);
      if (!noMove) { this.gx = tx; this.gy = ty; }
      noDraw = noMove = false;
    };
    const DIRS = { U: [0,-1], D: [0,1], L: [-1,0], R: [1,0], E: [1,-1], F: [1,1], G: [-1,1], H: [-1,-1] };
    while (i < s.length) {
      const c = s[i++];
      if (c === ' ' || c === ';') continue;
      if (c === 'B') { noDraw = true; continue; }
      if (c === 'N') { noMove = true; continue; }
      if (DIRS[c]) { const n = num() ?? 1, [dx, dy] = DIRS[c], k = n * scale / 4; moveTo(this.gx + dx * k, this.gy + dy * k); continue; }
      if (c === 'M') {
        skip(); const rel = s[i] === '+' || s[i] === '-';
        const x = num(); skip(); if (s[i] === ',') i++; const y = num();
        if (x == null || y == null) throw new BasicError('Illegal function call');
        moveTo(rel ? this.gx + x * scale / 4 : x, rel ? this.gy + y * scale / 4 : y); continue;
      }
      if (c === 'C') { this.dcolor = num() ?? this.fg; continue; }
      if (c === 'S') { scale = num() ?? 4; continue; }
      if (c === 'A' || c === 'T') { if (s[i] === 'A') i++; num(); continue; }
      if (c === 'P') { num(); skip(); if (s[i] === ',') i++; num(); continue; }
      throw new BasicError('Illegal function call');
    }
  }
  render() {
    if (!this.dirty || !this.ctx) return;
    const d = this.img.data, pal = this.pal, px = this.pix;
    for (let i = 0, j = 0; i < px.length; i++, j += 4) {
      const c = pal[px[i]]; d[j] = c[0]; d[j+1] = c[1]; d[j+2] = c[2]; d[j+3] = 255;
    }
    this.ctx.putImageData(this.img, 0, 0);
    this.dirty = false;
  }
  rowText(r) {
    // Visible text of one row (characters drawn in the background color count as blank).
    let out = '';
    for (let c = 0; c < this.cols; c++) out += CP437[this.chars[(r - 1) * this.cols + c]];
    return out.replace(/\s+$/, '');
  }
}

// ---------- PC speaker ----------
class Speaker {
  constructor() { this.ac = null; this.t = 0; this.on = true; this.oscs = []; }
  unlock() {
    try {
      if (!this.ac) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        this.ac = new AC();
        this.out = this.ac.createGain(); this.out.gain.value = 0.07; this.out.connect(this.ac.destination);
      }
      if (this.ac.state === 'suspended') this.ac.resume();
    } catch (e) { /* no audio */ }
  }
  reset() {
    for (const o of this.oscs) { try { o.stop(); } catch (e) {} }
    this.oscs = []; this.t = 0;
  }
  tone(freq, dur, art) {
    if (!this.ac) return;
    const now = this.ac.currentTime;
    if (this.t < now) this.t = now;
    if (this.on && freq >= 20 && freq <= 18000 && dur > 0) {
      const o = this.ac.createOscillator();
      o.type = 'square'; o.frequency.value = freq; o.connect(this.out);
      o.start(this.t); o.stop(this.t + Math.max(0.01, dur * art));
      o.onended = () => { const k = this.oscs.indexOf(o); if (k >= 0) this.oscs.splice(k, 1); };
      this.oscs.push(o);
    }
    this.t += dur;
  }
}

// ---------- tokenizer ----------
function tokenize(line) {
  const t = []; let i = 0; const n = line.length;
  while (i < n) {
    const c = line[i];
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c === '"') { let j = line.indexOf('"', i + 1); if (j < 0) j = n; t.push({ k: 'str', v: line.slice(i + 1, j) }); i = j + 1; continue; }
    if (c === "'") break;
    if ((c >= '0' && c <= '9') || (c === '.' && /[0-9]/.test(line[i + 1] || ''))) {
      let j = i; while (j < n && /[0-9.]/.test(line[j])) j++;
      if (/[eEdD]/.test(line[j] || '') && /[-+0-9]/.test(line[j + 1] || '')) { j += 2; while (j < n && /[0-9]/.test(line[j])) j++; }
      const v = parseFloat(line.slice(i, j).replace(/[dD]/, 'e'));
      if ('!#%&'.includes(line[j] || '@')) j++;
      t.push({ k: 'num', v }); i = j; continue;
    }
    if (/[A-Za-z]/.test(c)) {
      let j = i; while (j < n && /[A-Za-z0-9]/.test(line[j])) j++;
      const name = line.slice(i, j).toUpperCase(); let s = '';
      if ('$%!#&'.includes(line[j] || '@')) { s = line[j]; j++; }
      if (name === 'REM' && !s) break;
      t.push({ k: 'id', v: name, s }); i = j; continue;
    }
    const two = line.slice(i, i + 2);
    if (two === '<>' || two === '<=' || two === '>=' || two === '=<' || two === '=>' || two === '><') {
      t.push({ k: 'op', v: two === '=<' ? '<=' : two === '=>' ? '>=' : two === '><' ? '<>' : two }); i += 2; continue;
    }
    t.push({ k: 'op', v: c }); i++;
  }
  return t;
}

const KEYWORDS = new Set(('PRINT LET IF THEN ELSE ELSEIF END FOR TO STEP NEXT GOTO GOSUB RETURN CLS COLOR LOCATE ' +
  'SCREEN PLAY SOUND INPUT DRAW CIRCLE RANDOMIZE DIM SHARED CALL SUB DECLARE RUN AND OR NOT MOD XOR STATIC SLEEP ' +
  'BEEP WIDTH KEY AS STOP SYSTEM').split(' '));
const varKey = tok => tok.v + (tok.s && tok.s !== '!' ? tok.s : '!');
const isStrKey = k => k.endsWith('$');

class Toks {
  constructor(t, line) { this.t = t; this.i = 0; this.line = line; }
  peek(o = 0) { return this.t[this.i + o]; }
  next() { return this.t[this.i++]; }
  eof() { return this.i >= this.t.length; }
  isOp(v) { const t = this.t[this.i]; return t && t.k === 'op' && t.v === v; }
  isId(v) { const t = this.t[this.i]; return t && t.k === 'id' && t.v === v && !t.s; }
  atEnd() { return this.eof() || this.isOp(':'); }
  expectOp(v) { if (!this.isOp(v)) throw this.err(); this.i++; }
  expectId(v) { if (!this.isId(v)) throw this.err(); this.i++; }
  err(msg = 'Syntax error') { return new BasicError(msg + ' in line ' + this.line); }
}

// ---------- expressions (compiled to closures) ----------
const bool = b => (b ? -1 : 0);
function numArg(v) { if (typeof v !== 'number') throw new BasicError('Type mismatch'); return v; }
function strArg(v) { if (typeof v !== 'string') throw new BasicError('Type mismatch'); return v; }
function fmtNum(n) {
  let s;
  if (Number.isInteger(n) && Math.abs(n) < 1e16) s = String(Math.abs(n));
  else {
    s = Math.abs(n).toPrecision(7);
    if (s.includes('e')) s = s.replace(/\.?0+e/, 'E').replace('E+', 'E+');
    else if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (s.startsWith('0.')) s = s.slice(1);
  }
  return (n < 0 ? '-' : ' ') + s;
}
const FUNCS = {
  'INT': [1, v => Math.floor(numArg(v))],
  'FIX': [1, v => Math.trunc(numArg(v))],
  'ABS': [1, v => Math.abs(numArg(v))],
  'SGN': [1, v => Math.sign(numArg(v))],
  'SQR': [1, v => Math.sqrt(numArg(v))],
  'SIN': [1, v => Math.sin(numArg(v))], 'COS': [1, v => Math.cos(numArg(v))],
  'ATN': [1, v => Math.atan(numArg(v))], 'EXP': [1, v => Math.exp(numArg(v))], 'LOG': [1, v => Math.log(numArg(v))],
  'CINT': [1, v => roundEven(numArg(v))],
  'CHR$': [1, v => { v = numArg(v) | 0; if (v < 0 || v > 255) throw new BasicError('Illegal function call'); return CP437[v]; }],
  'ASC': [1, v => { v = strArg(v); if (!v) throw new BasicError('Illegal function call'); return toCode(v[0]); }],
  'LEN': [1, v => strArg(v).length],
  'STR$': [1, v => fmtNum(numArg(v)).replace(/^ /, ' ')],
  'VAL': [1, v => parseVal(strArg(v))],
  'UCASE$': [1, v => strArg(v).toUpperCase()], 'LCASE$': [1, v => strArg(v).toLowerCase()],
  'LTRIM$': [1, v => strArg(v).replace(/^ +/, '')], 'RTRIM$': [1, v => strArg(v).replace(/ +$/, '')],
  'SPACE$': [1, v => ' '.repeat(Math.max(0, numArg(v) | 0))],
  'LEFT$': [2, (s, n) => strArg(s).slice(0, Math.max(0, numArg(n) | 0))],
  'RIGHT$': [2, (s, n) => { s = strArg(s); n = Math.max(0, numArg(n) | 0); return n ? s.slice(-n) : ''; }],
  'MID$': [-1, (s, a, n) => { s = strArg(s); a = numArg(a) | 0; return n === undefined ? s.slice(a - 1) : s.substr(a - 1, Math.max(0, numArg(n) | 0)); }],
  'STRING$': [2, (n, c) => (typeof c === 'string' ? c[0] : CP437[c | 0]).repeat(Math.max(0, n | 0))],
  'INSTR': [-1, (a, b, c) => c === undefined ? strArg(a).indexOf(strArg(b)) + 1 : strArg(b).indexOf(strArg(c), Math.max(0, a - 1)) + 1],
};
function roundEven(v) { const f = Math.floor(v), d = v - f; return d > 0.5 ? f + 1 : d < 0.5 ? f : (f % 2 === 0 ? f : f + 1); }
function parseVal(s) { const m = /^\s*[-+]?(\d+\.?\d*|\.\d+)([eEdD][-+]?\d+)?/.exec(s); return m ? parseFloat(m[0].replace(/[dD]/, 'e')) : 0; }

function parseExpr(p) { return parseOr(p); }
function parseOr(p) {
  let a = parseAnd(p);
  for (;;) {
    if (p.isId('OR')) { p.next(); const l = a, r = parseAnd(p); a = vm => numArg(l(vm)) | numArg(r(vm)); }
    else if (p.isId('XOR')) { p.next(); const l = a, r = parseAnd(p); a = vm => numArg(l(vm)) ^ numArg(r(vm)); }
    else return a;
  }
}
function parseAnd(p) {
  let a = parseNot(p);
  while (p.isId('AND')) { p.next(); const l = a, r = parseNot(p); a = vm => numArg(l(vm)) & numArg(r(vm)); }
  return a;
}
function parseNot(p) {
  if (p.isId('NOT')) { p.next(); const e = parseNot(p); return vm => ~numArg(e(vm)); }
  return parseRel(p);
}
function parseRel(p) {
  let a = parseAdd(p);
  for (;;) {
    const t = p.peek();
    if (!t || t.k !== 'op' || !['=', '<>', '<', '>', '<=', '>='].includes(t.v)) return a;
    p.next(); const l = a, r = parseAdd(p), op = t.v;
    a = vm => {
      const x = l(vm), y = r(vm);
      if (typeof x !== typeof y) throw new BasicError('Type mismatch');
      switch (op) { case '=': return bool(x === y); case '<>': return bool(x !== y); case '<': return bool(x < y);
        case '>': return bool(x > y); case '<=': return bool(x <= y); default: return bool(x >= y); }
    };
  }
}
function parseAdd(p) {
  let a = parseMod(p);
  for (;;) {
    if (p.isOp('+')) { p.next(); const l = a, r = parseMod(p); a = vm => { const x = l(vm), y = r(vm); if (typeof x !== typeof y) throw new BasicError('Type mismatch'); return x + y; }; }
    else if (p.isOp('-')) { p.next(); const l = a, r = parseMod(p); a = vm => numArg(l(vm)) - numArg(r(vm)); }
    else return a;
  }
}
function parseMod(p) {
  let a = parseIDiv(p);
  while (p.isId('MOD')) { p.next(); const l = a, r = parseIDiv(p); a = vm => { const y = roundEven(numArg(r(vm))); if (!y) throw new BasicError('Division by zero'); return roundEven(numArg(l(vm))) % y; }; }
  return a;
}
function parseIDiv(p) {
  let a = parseMul(p);
  while (p.isOp('\\')) { p.next(); const l = a, r = parseMul(p); a = vm => { const y = roundEven(numArg(r(vm))); if (!y) throw new BasicError('Division by zero'); return Math.trunc(roundEven(numArg(l(vm))) / y); }; }
  return a;
}
function parseMul(p) {
  let a = parseUnary(p);
  for (;;) {
    if (p.isOp('*')) { p.next(); const l = a, r = parseUnary(p); a = vm => numArg(l(vm)) * numArg(r(vm)); }
    else if (p.isOp('/')) { p.next(); const l = a, r = parseUnary(p); a = vm => { const y = numArg(r(vm)); if (!y) throw new BasicError('Division by zero'); return numArg(l(vm)) / y; }; }
    else return a;
  }
}
function parseUnary(p) {
  if (p.isOp('-')) { p.next(); const e = parseUnary(p); return vm => -numArg(e(vm)); }
  if (p.isOp('+')) { p.next(); return parseUnary(p); }
  return parsePow(p);
}
function parsePow(p) {
  let a = parsePrimary(p);
  while (p.isOp('^')) { p.next(); const l = a, r = parsePrimary(p); a = vm => Math.pow(numArg(l(vm)), numArg(r(vm))); }
  return a;
}
function parseArgs(p) {
  p.expectOp('('); const args = [];
  if (!p.isOp(')')) { args.push(parseExpr(p)); while (p.isOp(',')) { p.next(); args.push(parseExpr(p)); } }
  p.expectOp(')'); return args;
}
function parsePrimary(p) {
  const t = p.next();
  if (!t) throw p.err();
  if (t.k === 'num') { const v = t.v; return () => v; }
  if (t.k === 'str') { const v = t.v; return () => v; }
  if (t.k === 'op' && t.v === '(') { const e = parseExpr(p); p.expectOp(')'); return e; }
  if (t.k !== 'id') throw p.err();
  const fname = t.v + (t.s === '$' ? '$' : '');
  if (fname === 'INKEY$') return vm => vm.inkey();
  if (fname === 'TIMER' && !t.s) return vm => vm.timer();
  if (fname === 'RND' && !t.s) {
    if (p.isOp('(')) { const a = parseArgs(p)[0]; return vm => vm.rnd(numArg(a(vm))); }
    return vm => vm.rnd();
  }
  const f = FUNCS[fname];
  if (f && p.isOp('(')) {
    const args = parseArgs(p), fn = f[1];
    if (f[0] >= 0 && args.length !== f[0]) throw p.err('Argument-count mismatch');
    return vm => fn(...args.map(a => a(vm)));
  }
  if (KEYWORDS.has(t.v) && !t.s) throw p.err();
  const key = varKey(t);
  if (p.isOp('(')) { const idx = parseArgs(p); return vm => vm.getArr(key, idx.map(a => a(vm))); }
  return vm => vm.getVar(key);
}

// ---------- statements ----------
function newProc(name, params = [], isStatic = false) {
  return { name, params, isStatic, code: [], labels: Object.create(null), ifs: [], fors: [] };
}

function compileProgram(name, text, onWarn) {
  const lines = text.replace(/\r/g, '').split('\n');
  const subNames = new Set();
  for (const l of lines) { const m = /^\s*(?:DECLARE\s+)?SUB\s+([A-Za-z][A-Za-z0-9]*)/i.exec(l); if (m) subNames.add(m[1].toUpperCase()); }
  const main = newProc('(main)');
  const subs = new Map();
  let cur = main;
  const emit = op => { cur.code.push(op); return op; };
  const here = () => cur.code.length;

  function closeProc(proc, lineNo) {
    if (proc.ifs.length) throw new BasicError('Block IF without END IF in ' + proc.name + ' (line ' + lineNo + ')');
    if (proc.fors.length) throw new BasicError('FOR without NEXT in ' + proc.name + ' (line ' + lineNo + ')');
  }

  function parseTarget(p) {
    const t = p.next();
    if (!t || t.k !== 'id') throw p.err();
    const key = varKey(t);
    if (p.isOp('(')) return { key, idx: parseArgs(p) };
    return { key, idx: null };
  }

  function parseStatements(p, stopAtElse) {
    for (;;) {
      if (p.eof()) return;
      if (p.isOp(':')) { p.next(); continue; }
      if (stopAtElse && p.isId('ELSE')) return;
      parseStatement(p, stopAtElse);
      if (p.eof()) return;
      if (stopAtElse && p.isId('ELSE')) return;
      if (!p.isOp(':')) throw p.err('Expected end of statement');
    }
  }

  function parseStatement(p, inlineIf) {
    const t = p.peek();
    if (t.k === 'op' && t.v === '?') { p.next(); return parsePrint(p); }
    if (t.k === 'num') { p.next(); return emit({ t: 'goto', label: String(t.v) }); }
    if (t.k !== 'id') throw p.err();
    if (t.s) return parseAssign(p);
    switch (t.v) {
      case 'LET': p.next(); return parseAssign(p);
      case 'PRINT': p.next(); return parsePrint(p);
      case 'IF': p.next(); return parseIf(p);
      case 'ELSE': {
        p.next(); const b = cur.ifs[cur.ifs.length - 1];
        if (!b) throw p.err('ELSE without IF');
        b.ends.push(emit({ t: 'jmp', target: null }));
        if (b.jf) { b.jf.target = here(); b.jf = null; }
        return parseStatements(p, false);
      }
      case 'ELSEIF': {
        p.next(); const b = cur.ifs[cur.ifs.length - 1];
        if (!b) throw p.err('ELSEIF without IF');
        b.ends.push(emit({ t: 'jmp', target: null }));
        if (b.jf) b.jf.target = here();
        const cond = parseExpr(p); p.expectId('THEN');
        b.jf = emit({ t: 'jf', cond, target: null });
        return;
      }
      case 'END': {
        p.next();
        if (p.isId('IF')) {
          p.next(); const b = cur.ifs.pop(); if (!b) throw p.err('END IF without block IF');
          if (b.jf) b.jf.target = here(); for (const j of b.ends) j.target = here(); return;
        }
        if (p.isId('SUB')) {
          p.next(); emit({ t: 'ret' }); closeProc(cur, p.line); cur = main; return;
        }
        return emit({ t: 'end' });
      }
      case 'STOP': case 'SYSTEM': p.next(); return emit({ t: 'end' });
      case 'FOR': {
        p.next(); const v = p.next(); if (!v || v.k !== 'id') throw p.err();
        p.expectOp('='); const start = parseExpr(p); p.expectId('TO'); const limit = parseExpr(p);
        let step = null; if (p.isId('STEP')) { p.next(); step = parseExpr(p); }
        const op = emit({ t: 'for', key: varKey(v), start, limit, step, pc: here(), nextPc: null });
        cur.fors.push(op); return;
      }
      case 'NEXT': {
        p.next();
        const names = [];
        if (!p.atEnd() && !(inlineIf && p.isId('ELSE'))) {
          names.push(varKey(p.next())); while (p.isOp(',')) { p.next(); names.push(varKey(p.next())); }
        } else names.push(null);
        for (const nm of names) {
          const f = cur.fors.pop(); if (!f) throw p.err('NEXT without FOR');
          if (nm && nm !== f.key) throw p.err('NEXT without FOR');
          f.nextPc = here(); emit({ t: 'next', forPc: f.pc, key: f.key });
        }
        return;
      }
      case 'GOTO': { p.next(); const l = p.next(); return emit({ t: 'goto', label: l.k === 'num' ? String(l.v) : l.v }); }
      case 'GOSUB': { p.next(); const l = p.next(); return emit({ t: 'gosub', label: l.k === 'num' ? String(l.v) : l.v }); }
      case 'RETURN': p.next(); return emit({ t: 'return' });
      case 'CLS': p.next(); if (!p.atEnd()) parseExpr(p); return emit({ t: 'cls' });
      case 'COLOR': {
        p.next(); let f = null, b = null;
        if (!p.atEnd() && !p.isOp(',')) f = parseExpr(p);
        if (p.isOp(',')) { p.next(); if (!p.atEnd() && !p.isOp(',')) b = parseExpr(p); while (p.isOp(',')) { p.next(); parseExpr(p); } }
        return emit({ t: 'color', f, b });
      }
      case 'LOCATE': {
        p.next(); let r = null, c = null;
        if (!p.atEnd() && !p.isOp(',')) r = parseExpr(p);
        if (p.isOp(',')) { p.next(); if (!p.atEnd() && !p.isOp(',')) c = parseExpr(p); while (p.isOp(',')) { p.next(); if (!p.atEnd() && !p.isOp(',')) parseExpr(p); } }
        return emit({ t: 'locate', r, c });
      }
      case 'SCREEN': { p.next(); const m = parseExpr(p); while (p.isOp(',')) { p.next(); if (!p.atEnd() && !p.isOp(',')) parseExpr(p); } return emit({ t: 'screen', m }); }
      case 'WIDTH': case 'KEY': p.next(); while (!p.atEnd()) p.next(); return;
      case 'PLAY': { p.next(); const e = parseExpr(p); return emit({ t: 'play', e }); }
      case 'SOUND': { p.next(); const f = parseExpr(p); p.expectOp(','); const d = parseExpr(p); return emit({ t: 'sound', f, d }); }
      case 'BEEP': p.next(); return emit({ t: 'beep' });
      case 'SLEEP': { p.next(); const e = p.atEnd() ? null : parseExpr(p); return emit({ t: 'sleep', e }); }
      case 'DRAW': { p.next(); const e = parseExpr(p); return emit({ t: 'draw', e }); }
      case 'CIRCLE': {
        p.next(); let rel = false; if (p.isId('STEP')) { p.next(); rel = true; }
        p.expectOp('('); const x = parseExpr(p); p.expectOp(','); const y = parseExpr(p); p.expectOp(')');
        p.expectOp(','); const r = parseExpr(p); let c = null;
        if (p.isOp(',')) { p.next(); if (!p.atEnd() && !p.isOp(',')) c = parseExpr(p); while (p.isOp(',')) { p.next(); if (!p.atEnd() && !p.isOp(',')) parseExpr(p); } }
        return emit({ t: 'circle', x, y, r, c, rel });
      }
      case 'RANDOMIZE': { p.next(); const e = p.atEnd() ? null : parseExpr(p); return emit({ t: 'randomize', e }); }
      case 'DIM': {
        p.next(); let shared = false; if (p.isId('SHARED')) { p.next(); shared = true; }
        const items = [];
        for (;;) {
          const v = p.next(); if (!v || v.k !== 'id') throw p.err();
          let dims = null;
          if (p.isOp('(')) {
            p.next(); dims = [];
            for (;;) { let lo = null, hi = parseExpr(p); if (p.isId('TO')) { p.next(); lo = hi; hi = parseExpr(p); } dims.push([lo, hi]); if (p.isOp(',')) { p.next(); continue; } break; }
            p.expectOp(')');
          }
          let key = varKey(v);
          if (p.isId('AS')) { p.next(); const ty = p.next().v; if (ty === 'STRING') key = v.v + '$'; else if (ty === 'INTEGER') key = v.v + '%'; else if (ty === 'LONG') key = v.v + '&'; else if (ty === 'DOUBLE') key = v.v + '#'; }
          items.push({ key, dims });
          if (p.isOp(',')) { p.next(); continue; }
          break;
        }
        return emit({ t: 'dim', shared, items });
      }
      case 'CALL': {
        p.next(); const n = p.next(); if (!n || n.k !== 'id') throw p.err();
        const args = p.isOp('(') ? parseArgs(p) : [];
        return emit({ t: 'call', name: n.v, args });
      }
      case 'RUN': { p.next(); const e = p.atEnd() ? null : parseExpr(p); return emit({ t: 'run', e }); }
      case 'INPUT': return parseInput(p);
      case 'DECLARE': while (!p.eof()) p.next(); return;
      default:
        if (subNames.has(t.v)) {
          p.next(); const args = [];
          if (!p.atEnd() && !(inlineIf && p.isId('ELSE'))) { args.push(parseExpr(p)); while (p.isOp(',')) { p.next(); args.push(parseExpr(p)); } }
          return emit({ t: 'call', name: t.v, args });
        }
        return parseAssign(p);
    }
  }

  function parseAssign(p) {
    const tg = parseTarget(p);
    p.expectOp('=');
    const e = parseExpr(p);
    return emit({ t: 'let', key: tg.key, idx: tg.idx, e });
  }

  function parsePrint(p) {
    const items = []; let nl = true;
    while (!p.atEnd() && !p.isId('ELSE')) {
      if (p.isOp(';')) { p.next(); items.push({ k: ';' }); nl = false; continue; }
      if (p.isOp(',')) { p.next(); items.push({ k: ',' }); nl = false; continue; }
      if ((p.isId('TAB') || p.isId('SPC')) && p.peek(1) && p.peek(1).k === 'op' && p.peek(1).v === '(') {
        const k = p.next().v === 'TAB' ? 'tab' : 'spc'; const a = parseArgs(p)[0]; items.push({ k, f: a }); nl = true; continue;
      }
      items.push({ k: 'e', f: parseExpr(p) }); nl = true;
    }
    return emit({ t: 'print', items, nl });
  }

  function parseInput(p) {
    p.next();
    let noNl = false, prompt = '', qmark = true;
    if (p.isOp(';')) { p.next(); noNl = true; }
    if (p.peek() && p.peek().k === 'str') {
      prompt = p.next().v;
      if (p.isOp(';')) { p.next(); } else if (p.isOp(',')) { p.next(); qmark = false; } else throw p.err();
    }
    const targets = [parseTarget(p)];
    while (p.isOp(',')) { p.next(); targets.push(parseTarget(p)); }
    return emit({ t: 'input', prompt, qmark, noNl, targets });
  }

  function parseIf(p) {
    const cond = parseExpr(p);
    if (p.isId('GOTO')) {
      p.next(); const l = p.next();
      const jf = emit({ t: 'jf', cond, target: null });
      emit({ t: 'goto', label: l.k === 'num' ? String(l.v) : l.v });
      jf.target = here(); return;
    }
    p.expectId('THEN');
    if (p.eof()) { cur.ifs.push({ jf: emit({ t: 'jf', cond, target: null }), ends: [] }); return; }
    const jf = emit({ t: 'jf', cond, target: null });
    if (p.peek().k === 'num') { const n = p.next(); emit({ t: 'goto', label: String(n.v) }); }
    else parseStatements(p, true);
    if (p.isId('ELSE')) {
      p.next(); const j = emit({ t: 'jmp', target: null }); jf.target = here();
      if (p.peek() && p.peek().k === 'num') { const n = p.next(); emit({ t: 'goto', label: String(n.v) }); }
      else parseStatements(p, true);
      j.target = here();
    } else jf.target = here();
  }

  lines.forEach((line, n) => {
    const lineNo = n + 1;
    let toks = tokenize(line);
    if (!toks.length) return;
    if (toks[0].k === 'num' && Number.isInteger(toks[0].v)) { cur.labels[String(toks[0].v)] = here(); toks = toks.slice(1); }
    else if (toks[0].k === 'id' && !toks[0].s && toks[1] && toks[1].k === 'op' && toks[1].v === ':' && !KEYWORDS.has(toks[0].v)) {
      cur.labels[toks[0].v] = here(); toks = toks.slice(2);
    }
    if (!toks.length) return;
    const p = new Toks(toks, lineNo);
    if (p.isId('SUB')) {
      p.next(); const nm = p.next().v; const params = [];
      if (p.isOp('(')) { p.next(); while (!p.isOp(')')) { const v = p.next(); if (v.k === 'id') params.push(varKey(v)); if (p.isOp(',')) p.next(); } p.next(); }
      const isStatic = p.isId('STATIC');
      if (cur !== main) throw p.err('SUB without END SUB');
      cur = newProc(nm, params, isStatic); subs.set(nm, cur); return;
    }
    if (p.isId('DECLARE')) return;
    parseStatements(p, false);
  });
  if (cur !== main) throw new BasicError('SUB without END SUB');
  main.code.push({ t: 'end' });
  closeProc(main, lines.length);
  // Static label check, the way QBasic refuses to run a program with a missing label.
  for (const proc of [main, ...subs.values()]) {
    for (const op of proc.code) {
      if ((op.t === 'goto' || op.t === 'gosub') && !(op.label in proc.labels)) {
        if (onWarn) onWarn(`${name}: label ${op.label} not defined in ${proc.name}`);
      }
      if (op.t === 'call' && !subs.has(op.name) && onWarn) onWarn(`${name}: SUB ${op.name} not defined`);
    }
  }
  return { name, main, subs };
}

// ---------- virtual machine ----------
class VM {
  constructor(screen, speaker, getSource) {
    this.screen = screen; this.speaker = speaker; this.getSource = getSource;
    this.rate = 30000;           // interpreted statements per second (the "CPU speed")
    this.keys = [];              // BIOS keyboard buffer
    this.cache = new Map();
    this.state = 'off';
    this.credit = 0;
    this.onState = null;
    this.warnings = [];
  }
  pushKey(ch) {
    if (this.state === 'ended' || this.state === 'error') { this.restart(); return; }
    if (this.keys.length < 15) this.keys.push(ch);
    if (this.sleepForKey && this.state === 'sleep') { this.sleepForKey = false; this.wakeAt = 0; }
  }
  inkey() { return this.keys.length ? this.keys.shift() : ''; }
  timer() {
    const d = new Date(), mid = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const ticks = Math.floor(((d - mid) / 1000) * 18.2065);
    return Math.fround(ticks / 18.2065);
  }
  rnd(arg) {
    if (arg !== undefined) {
      if (arg === 0) return this.lastRnd;
      if (arg < 0) this.seed = this.seedFrom(arg);
    }
    this.seed = (this.seed * 16598013 + 12820163) % 16777216;
    this.lastRnd = this.seed / 16777216;
    return this.lastRnd;
  }
  seedFrom(n) {
    const dv = new DataView(new ArrayBuffer(8)); dv.setFloat64(0, n);
    const m = (dv.getUint32(0) ^ dv.getUint32(4)) >>> 0;
    return (((m ^ (m >>> 16)) & 0xffff) << 8) | (m >>> 24);
  }
  module(name) {
    if (!this.cache.has(name)) {
      const src = this.getSource(name);
      if (src == null) return null;
      this.cache.set(name, compileProgram(name, src, w => this.warnings.push(w)));
    }
    return this.cache.get(name);
  }
  boot(name) {
    this.keys.length = 0;
    this.speaker.reset();
    this.screen.setMode(0); this.screen.cls();
    this.load(name);
  }
  restart() { this.boot('SHOGUN'); }
  load(name) {
    const mod = this.module(name);
    if (!mod) {
      this.fail(new BasicError('File not found: ' + name + '.BAS'));
      return;
    }
    this.mod = mod; this.progName = name;
    for (const s of mod.subs.values()) { s.sv = null; s.sa = null; }
    this.shared = new Set();
    this.mainFrame = { proc: mod.main, pc: 0, vars: new Map(), arrays: new Map(), fors: Object.create(null), gosubs: [] };
    this.frames = [this.mainFrame];
    this.play = { T: 120, O: 4, L: 4, M: 7 / 8 };
    this.seed = 327680; this.lastRnd = 0;
    this.setState('run');
  }
  setState(s) { this.state = s; this.credit = 0; if (this.onState) this.onState(s); }
  get frame() { return this.frames[this.frames.length - 1]; }
  scope(key) { return this.shared.has(key) ? this.mainFrame : this.frame; }
  getVar(key) {
    const v = this.scope(key).vars.get(key);
    return v === undefined ? (isStrKey(key) ? '' : 0) : v;
  }
  coerce(key, v) {
    if (isStrKey(key)) { if (typeof v !== 'string') throw new BasicError('Type mismatch'); return v; }
    if (typeof v !== 'number') throw new BasicError('Type mismatch');
    if (key.endsWith('%') || key.endsWith('&')) { v = roundEven(v); if (key.endsWith('%') && (v < -32768 || v > 32767)) throw new BasicError('Overflow'); }
    else if (key.endsWith('!')) v = Math.fround(v);
    return v;
  }
  setVar(key, v) { this.scope(key).vars.set(key, this.coerce(key, v)); }
  arr(key, create) {
    const sc = this.scope(key);
    let a = sc.arrays.get(key);
    if (!a && create) { a = this.makeArr(key, [[0, 10]]); sc.arrays.set(key, a); }
    return a;
  }
  makeArr(key, dims) {
    const lo = dims.map(d => d[0]), size = dims.map(d => d[1] - d[0] + 1);
    const n = size.reduce((x, y) => x * y, 1);
    return { lo, size, data: new Array(n).fill(isStrKey(key) ? '' : 0) };
  }
  index(a, idx) {
    if (idx.length !== a.size.length) throw new BasicError('Wrong number of dimensions');
    let o = 0;
    for (let i = 0; i < idx.length; i++) {
      const k = roundEven(idx[i]) - a.lo[i];
      if (k < 0 || k >= a.size[i]) throw new BasicError('Subscript out of range');
      o = o * a.size[i] + k;
    }
    return o;
  }
  getArr(key, idx) { const a = this.arr(key, true); return a.data[this.index(a, idx)]; }
  setArr(key, idx, v) { const a = this.arr(key, true); a.data[this.index(a, idx)] = this.coerce(key, v); }

  fail(e) {
    const msg = e instanceof BasicError ? e.message : ('Internal error: ' + e.message);
    if (!(e instanceof BasicError)) console.error(e);
    this.errorMsg = msg;
    try {
      const s = this.screen; s.fg = s.mode === 13 ? 15 : 15;
      s.newline(); s.print(msg); s.newline(); s.print('Press any key to restart');
    } catch (_) {}
    this.setState('error');
  }
  end() {
    const s = this.screen;
    s.color(s.mode === 0 ? 7 : 15, null);
    s.locate(s.rows, 1); s.print('Press any key to continue');
    this.keys.length = 0;
    this.setState('ended');
  }
  wait(ms) { this.wakeAt = performance.now() + ms; this.setState('sleep'); }

  tick(dtSec) {
    if (this.state === 'sleep' && performance.now() >= this.wakeAt) this.setState('run');
    if (this.state === 'input') this.pumpInput();
    if (this.state === 'run') {
      this.credit = Math.min(this.credit + this.rate * dtSec, this.rate * 0.1);
      let n = Math.floor(this.credit); this.credit -= n;
      this.exec(n);
    }
  }
  exec(budget) {
    try {
      while (budget-- > 0 && this.state === 'run') {
        const f = this.frames[this.frames.length - 1];
        const op = f.proc.code[f.pc];
        if (!op) { this.ret(); continue; }
        this.step(op, f);
      }
    } catch (e) { this.fail(e); }
  }
  jump(f, label) {
    const pc = f.proc.labels[label];
    if (pc === undefined) throw new BasicError('Label not defined: ' + label);
    f.pc = pc;
  }
  ret() {
    if (this.frames.length === 1) { this.end(); return; }
    this.frames.pop();
  }
  step(op, f) {
    const s = this.screen;
    switch (op.t) {
      case 'let': { const v = op.e(this); if (op.idx) this.setArr(op.key, op.idx.map(a => a(this)), v); else this.setVar(op.key, v); f.pc++; return; }
      case 'print': this.doPrint(op); f.pc++; return;
      case 'goto': this.jump(f, op.label); return;
      case 'jf': f.pc = op.cond(this) !== 0 ? f.pc + 1 : op.target; return;
      case 'jmp': f.pc = op.target; return;
      case 'for': {
        const v = this.coerce(op.key, numArg(op.start(this)));
        this.setVar(op.key, v);
        const lim = numArg(op.limit(this)), st = op.step ? numArg(op.step(this)) : 1;
        f.fors[op.pc] = { lim, st };
        f.pc = (st >= 0 ? v > lim : v < lim) ? op.nextPc + 1 : f.pc + 1;
        return;
      }
      case 'next': {
        const l = f.fors[op.forPc];
        if (!l) throw new BasicError('NEXT without FOR');
        const v = this.coerce(op.key, this.getVar(op.key) + l.st);
        this.setVar(op.key, v);
        f.pc = (l.st >= 0 ? v <= l.lim : v >= l.lim) ? op.forPc + 1 : f.pc + 1;
        return;
      }
      case 'call': {
        const proc = this.mod.subs.get(op.name);
        if (!proc) throw new BasicError('Subprogram not defined: ' + op.name);
        if (op.args.length !== proc.params.length) throw new BasicError('Argument-count mismatch');
        const args = op.args.map(a => a(this));
        f.pc++;
        if (this.frames.length > 400) throw new BasicError('Out of stack space');
        let vars, arrays;
        if (proc.isStatic) { vars = proc.sv || (proc.sv = new Map()); arrays = proc.sa || (proc.sa = new Map()); }
        else { vars = new Map(); arrays = new Map(); }
        const nf = { proc, pc: 0, vars, arrays, fors: Object.create(null), gosubs: [] };
        proc.params.forEach((k, i) => vars.set(k, this.coerce(k, args[i])));
        this.frames.push(nf);
        return;
      }
      case 'ret': this.ret(); return;
      case 'end': this.end(); return;
      case 'gosub': f.gosubs.push(f.pc + 1); this.jump(f, op.label); return;
      case 'return': { if (!f.gosubs.length) throw new BasicError('RETURN without GOSUB'); f.pc = f.gosubs.pop(); return; }
      case 'cls': s.cls(); f.pc++; return;
      case 'color': s.color(op.f ? numArg(op.f(this)) : null, op.b ? numArg(op.b(this)) : null); f.pc++; return;
      case 'locate': s.locate(op.r ? numArg(op.r(this)) : null, op.c ? numArg(op.c(this)) : null); f.pc++; return;
      case 'screen': { const m = numArg(op.m(this)); if (m !== s.mode) s.setMode(m); f.pc++; return; }
      case 'draw': s.draw(strArg(op.e(this))); f.pc++; return;
      case 'circle': {
        let x = numArg(op.x(this)), y = numArg(op.y(this));
        if (op.rel) { x += s.gx; y += s.gy; }
        s.circle(x, y, numArg(op.r(this)), op.c ? numArg(op.c(this)) & 255 : s.fg);
        s.gx = x; s.gy = y; f.pc++; return;
      }
      case 'randomize': this.seed = this.seedFrom(op.e ? numArg(op.e(this)) : this.timer()); f.pc++; return;
      case 'dim':
        for (const it of op.items) {
          if (op.shared) this.shared.add(it.key);
          if (it.dims) {
            const sc = this.scope(it.key);
            if (sc.arrays.has(it.key)) throw new BasicError('Array already dimensioned');
            sc.arrays.set(it.key, this.makeArr(it.key, it.dims.map(([lo, hi]) => [lo ? numArg(lo(this)) : 0, numArg(hi(this))])));
          }
        }
        f.pc++; return;
      case 'play': f.pc++; this.doPlay(strArg(op.e(this))); return;
      case 'sound': {
        const fr = numArg(op.f(this)), d = numArg(op.d(this));
        if (fr < 37 || fr > 32767 || d < 0 || d > 65535) throw new BasicError('Illegal function call');
        f.pc++;
        const sec = d / 18.2065;
        this.speaker.tone(fr, sec, 1);
        if (sec > 0) this.wait(sec * 1000);
        return;
      }
      case 'beep': f.pc++; this.speaker.tone(800, 0.25, 1); this.wait(250); return;
      case 'sleep': {
        f.pc++; const n = op.e ? numArg(op.e(this)) : 0;
        if (n > 0) this.wait(n * 1000); else if (!this.keys.length) { this.sleepForKey = true; this.wait(1e9); }
        return;
      }
      case 'run': {
        const file = op.e ? strArg(op.e(this)) : this.progName;
        const name = file.replace(/^.*[:\\\/]/, '').replace(/\.BAS$/i, '').toUpperCase();
        this.load(name); return;
      }
      case 'input': {
        f.pc++;
        this.inputOp = op; this.inputBuf = '';
        s.print(op.prompt + (op.qmark ? '? ' : ''));
        this.setState('input');
        return;
      }
      default: throw new BasicError('Unknown op ' + op.t);
    }
  }
  doPrint(op) {
    const s = this.screen;
    for (const it of op.items) {
      if (it.k === ';') continue;
      if (it.k === ',') { s.zone(); continue; }
      if (it.k === 'tab') { s.tab(numArg(it.f(this))); continue; }
      if (it.k === 'spc') { const n = numArg(it.f(this)) | 0; for (let i = 0; i < n; i++) s.putCode(32); continue; }
      const v = it.f(this);
      s.print(typeof v === 'number' ? fmtNum(v) + ' ' : v);
    }
    if (op.nl) s.newline();
  }
  doPlay(str) {
    const P = this.play, s = str.toUpperCase();
    let i = 0, total = 0;
    const skip = () => { while (i < s.length && s[i] === ' ') i++; };
    const num = () => { skip(); const j = i; while (i < s.length && s[i] >= '0' && s[i] <= '9') i++; return i > j ? parseInt(s.slice(j, i), 10) : null; };
    const dots = () => { let d = 1; while (s[i] === '.') { d *= 1.5; i++; } return d; };
    const note = (n, len, d) => {
      const sec = (240 / P.T) / len * d;
      const freq = n > 0 ? 440 * Math.pow(2, (n - 46) / 12) : 0;
      this.speaker.tone(freq, sec, P.M); total += sec;
    };
    while (i < s.length) {
      const c = s[i++];
      if (c === ' ' || c === ';') continue;
      if ('CDEFGAB'.includes(c)) {
        let semi = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[c];
        if (s[i] === '#' || s[i] === '+') { semi++; i++; } else if (s[i] === '-') { semi--; i++; }
        const len = num() ?? P.L, d = dots();
        if (len < 1 || len > 64) throw new BasicError('Illegal function call');
        note(P.O * 12 + semi + 1, len, d);
      } else if (c === 'N') { const n = num() ?? 0; note(n, P.L, dots()); }
      else if (c === 'O') { const o = num(); if (o != null) P.O = Math.max(0, Math.min(6, o)); }
      else if (c === '<') P.O = Math.max(0, P.O - 1);
      else if (c === '>') P.O = Math.min(6, P.O + 1);
      else if (c === 'T') { const t = num(); if (t != null) P.T = Math.max(32, Math.min(255, t)); }
      else if (c === 'L') { const l = num(); if (l != null && l >= 1 && l <= 64) P.L = l; }
      else if (c === 'P' || c === 'R') { const l = num() ?? P.L; note(0, l, dots()); }
      else if (c === 'M') { const k = s[i++]; if (k === 'N') P.M = 7 / 8; else if (k === 'L') P.M = 1; else if (k === 'S') P.M = 3 / 4; }
      // QBasic would stop on anything else (TPLAY has a stray "O03"); this port lets it slide.
    }
    if (total > 0) this.wait(total * 1000);
  }
  pumpInput() {
    const s = this.screen;
    while (this.keys.length && this.state === 'input') {
      const k = this.keys.shift();
      if (k === '\r') { this.finishInput(); return; }
      if (k === '\b') { if (this.inputBuf.length) { this.inputBuf = this.inputBuf.slice(0, -1); s.backspace(); } continue; }
      if (k.length === 1 && k >= ' ' && this.inputBuf.length < 255) { this.inputBuf += k; s.print(k); }
    }
  }
  finishInput() {
    const op = this.inputOp, s = this.screen;
    if (!op.noNl) s.newline();
    const parts = []; let cur = '', q = false;
    for (const ch of this.inputBuf) {
      if (ch === '"') { q = !q; cur += ch; continue; }
      if (ch === ',' && !q) { parts.push(cur); cur = ''; continue; }
      cur += ch;
    }
    parts.push(cur);
    let ok = parts.length === op.targets.length || (op.targets.length === 1 && parts.length === 1);
    const vals = [];
    if (ok) op.targets.forEach((tg, i) => {
      let raw = (parts[i] ?? '').trim();
      if (isStrKey(tg.key)) { const m = /^"(.*)"?$/.exec(raw); vals.push(m ? m[1].replace(/"$/, '') : raw); }
      else if (raw === '') vals.push(0);
      else if (/^[-+]?(\d+\.?\d*|\.\d+)([eEdD][-+]?\d+)?[!#%&]?$/.test(raw)) vals.push(parseVal(raw));
      else ok = false;
    });
    if (!ok) {
      s.print('Redo from start'); s.newline();
      this.inputBuf = ''; s.print(op.prompt + (op.qmark ? '? ' : ''));
      return;
    }
    try {
      op.targets.forEach((tg, i) => { if (tg.idx) this.setArr(tg.key, tg.idx.map(a => a(this)), vals[i]); else this.setVar(tg.key, vals[i]); });
    } catch (e) { this.fail(e); return; }
    this.setState('run');
  }
}
