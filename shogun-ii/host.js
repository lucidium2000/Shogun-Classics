// Browser host for the KOF91 engine compiled to WebAssembly.
// Provides files, timing, video, input and audio to web/allegro.c.
'use strict';

const KOF = (() => {
  const td = new TextDecoder('latin1');
  const te = new TextEncoder();
  let ex, mem, files, canvas, ctx2d, imageData, onStatus = () => {};
  // pause: the engine's own Esc quits a fight, so Start opens a menu here instead.
  // A fight starts when the round call plays; any new song means we left it.
  let inFight = false, paused = false, pausedAt = 0, pausedFor = 0, pendingResume = false, onPause = null, onSong = null;
  const samplePaths = [];
  const EXIT = { exit: true };

  // ---------------------------------------------------------------- memory
  const u8 = () => new Uint8Array(mem.buffer);
  const i32 = () => new Int32Array(mem.buffer);
  function cstr(p) {
    const m = u8(); let e = p;
    while (m[e]) e++;
    return td.decode(m.subarray(p, e));
  }

  // ---------------------------------------------------------------- files
  // The gzip pack travels inside custom sections of tiny wasm modules, split
  // into parts (urls) because the host caps the size of each file.
  async function loadPak(urls, progress) {
    const totals = urls.map(() => 0), got = urls.map(() => 0);
    const report = () => {
      const t = totals.reduce((a, b) => a + b, 0);
      if (t) progress(got.reduce((a, b) => a + b, 0) / t);
    };
    const parts = await Promise.all(urls.map(async (url, i) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('could not load ' + url);
      totals[i] = +res.headers.get('content-length') || 0;
      const counter = new TransformStream({
        transform(chunk, ctl) { got[i] += chunk.length; report(); ctl.enqueue(chunk); }
      });
      const wrapped = await new Response(res.body.pipeThrough(counter)).arrayBuffer();
      return WebAssembly.Module.customSections(await WebAssembly.compile(wrapped), 'pak')[0];
    }));
    const stream = new Blob(parts).stream().pipeThrough(new DecompressionStream('gzip'));
    const buf = new Uint8Array(await new Response(stream).arrayBuffer());
    const n = new DataView(buf.buffer).getUint32(0, true);
    const index = JSON.parse(td.decode(buf.subarray(4, 4 + n)));
    const base = 4 + n;
    const map = new Map();
    for (const [name, [off, len]] of Object.entries(index)) {
      map.set(name.toLowerCase(), { name, data: buf.subarray(base + off, base + off + len) });
    }
    return map;
  }

  function getFile(path) {
    path = path.replace(/\\/g, '/').toLowerCase().replace(/^\.\//, '');
    return files.get(path);
  }

  // directory listing with DOS wildcards, e.g. "sprites/*" or "bkgds/*.pcx"
  function scan(pattern, dirs) {
    const slash = pattern.lastIndexOf('/');
    const dir = slash >= 0 ? pattern.slice(0, slash + 1) : '';
    const mask = pattern.slice(slash + 1);
    const re = new RegExp('^' + mask.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i');
    const out = new Map();
    for (const [key, f] of files) {
      if (!key.startsWith(dir)) continue;
      const rest = f.name.slice(dir.length);
      const parts = rest.split('/');
      if (dirs) { if (parts.length > 1 && re.test(parts[0])) out.set(parts[0].toLowerCase(), parts[0]); }
      else if (parts.length === 1 && re.test(parts[0])) out.set(parts[0].toLowerCase(), parts[0]);
    }
    return [...out.values()].sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : 1);
  }

  // ---------------------------------------------------------------- audio
  let actx = null, master = null, digiVol = 1, midiVol = 1, sfxGain = null, musicGain = null;
  const samples = [];            // AudioBuffer per id
  const sampleIds = new Map();   // path -> id
  const loud = new Set();        // ids of victory phrases
  const voices = new Map();      // id -> Set of sources

  function audio() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      actx = new AC();
      master = actx.createGain(); master.gain.value = 0.8;
      const lim = actx.createDynamicsCompressor();
      lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.1;
      master.connect(lim); lim.connect(actx.destination);
      sfxGain = actx.createGain(); sfxGain.connect(master);
      musicGain = actx.createGain(); musicGain.connect(master);
      sfxGain.gain.value = digiVol; musicGain.gain.value = midiVol * 0.25;
    }
    return actx;
  }

  function parseWav(d) {
    const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
    if (d.length < 12 || td.decode(d.subarray(0, 4)) !== 'RIFF') return null;
    let p = 12, fmt = null, data = null;
    while (p + 8 <= d.length) {
      const id = td.decode(d.subarray(p, p + 4)), size = dv.getUint32(p + 4, true);
      if (id === 'fmt ') fmt = { ch: dv.getUint16(p + 10, true), rate: dv.getUint32(p + 12, true), bits: dv.getUint16(p + 22, true), tag: dv.getUint16(p + 8, true) };
      else if (id === 'data') data = d.subarray(p + 8, Math.min(d.length, p + 8 + size));
      p += 8 + size + (size & 1);
    }
    if (!fmt || !data || fmt.tag !== 1) return null;
    const bps = fmt.bits / 8, frames = Math.floor(data.length / (bps * fmt.ch));
    if (!frames) return null;
    const ac = audio(); if (!ac) return null;
    const buf = ac.createBuffer(fmt.ch, frames, fmt.rate);
    const ddv = new DataView(data.buffer, data.byteOffset, data.byteLength);
    for (let c = 0; c < fmt.ch; c++) {
      const out = buf.getChannelData(c);
      for (let i = 0; i < frames; i++) {
        const o = (i * fmt.ch + c) * bps;
        out[i] = bps === 1 ? (data[o] - 128) / 128 : ddv.getInt16(o, true) / 32768;
      }
    }
    return buf;
  }

  function sampleLoad(path) {
    if (sampleIds.has(path)) return sampleIds.get(path);
    const f = getFile(path);
    if (!f) return -1;
    let buf = null;
    try { buf = parseWav(f.data); } catch (e) { buf = null; }
    const id = samples.length;
    samples.push(buf);
    // victory phrases play at double volume
    if (/\/win\.wav$/i.test(path)) loud.add(id);
    sampleIds.set(path, id);
    samplePaths[id] = path;
    return id;
  }

  function samplePlay(id, vol, pan, freq, loop) {
    if (/\/(rd\d|fight)\.wav$/i.test(samplePaths[id] || '')) inFight = true;
    const ac = audio(), buf = samples[id];
    if (!ac || !buf || ac.state !== 'running') return;
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = !!loop;
    src.playbackRate.value = Math.max(0.1, freq / 1000);
    const g = ac.createGain(); g.gain.value = Math.max(0, Math.min(1, vol / 255)) * (loud.has(id) ? 2 : 1);
    let node = g;
    if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = (pan - 128) / 128; g.connect(p); node = p; }
    node.connect(sfxGain);
    src.connect(g);
    src.start();
    if (!voices.has(id)) voices.set(id, new Set());
    voices.get(id).add(src);
    src.onended = () => voices.get(id).delete(src);
  }

  function sampleStop(id) {
    const v = voices.get(id);
    if (v) { for (const s of v) { try { s.stop(); } catch (e) {} } v.clear(); }
  }

  // --- MIDI: a small General MIDI-ish synth on WebAudio oscillators
  const midis = [];
  const midiIds = new Map();
  let midiPlayer = null;

  function parseMidi(d) {
    const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
    if (td.decode(d.subarray(0, 4)) !== 'MThd') return null;
    const ntracks = dv.getUint16(10), division = dv.getUint16(12);
    let p = 8 + dv.getUint32(4);
    const events = [];
    for (let t = 0; t < ntracks && p + 8 <= d.length; t++) {
      const len = dv.getUint32(p + 4);
      let q = p + 8; const end = Math.min(d.length, q + len);
      let tick = 0, running = 0;
      const vlq = () => { let v = 0, b; do { b = d[q++]; v = (v << 7) | (b & 0x7f); } while (b & 0x80 && q < end); return v; };
      while (q < end) {
        tick += vlq();
        let st = d[q];
        if (st & 0x80) q++; else st = running;
        if (st === 0xff) {
          const type = d[q++], l = vlq();
          if (type === 0x51) events.push({ tick, type: 'tempo', v: (d[q] << 16) | (d[q + 1] << 8) | d[q + 2] });
          if (type === 0x2f) { q = end; break; }
          q += l;
        } else if (st === 0xf0 || st === 0xf7) {
          q += vlq();
        } else {
          running = st;
          const hi = st & 0xf0, ch = st & 15;
          const a = d[q++], b = (hi === 0xc0 || hi === 0xd0) ? 0 : d[q++];
          events.push({ tick, type: hi, ch, a, b });
        }
      }
      p = 8 + len + p;
    }
    events.sort((x, y) => x.tick - y.tick);
    // convert ticks to seconds
    let tempo = 500000, lastTick = 0, time = 0;
    for (const e of events) {
      time += (e.tick - lastTick) * tempo / 1e6 / division;
      lastTick = e.tick;
      e.time = time;
      if (e.type === 'tempo') tempo = e.v;
    }
    return { events, length: time + 0.5 };
  }

  function midiLoad(path) {
    inFight = false;
    if (midiIds.has(path)) return midiIds.get(path);
    const f = getFile(path);
    if (!f) return -1;
    let song = null;
    try { song = parseMidi(f.data); } catch (e) { song = null; }
    if (!song) return -1;
    const id = midis.length;
    midis.push(song);
    midiIds.set(path, id);
    return id;
  }

  // waveform by GM program family
  function voiceFor(program) {
    const fam = program >> 3;
    const table = ['triangle', 'triangle', 'square', 'sawtooth', 'triangle', 'sawtooth', 'sawtooth', 'square',
                   'sawtooth', 'sawtooth', 'square', 'sawtooth', 'triangle', 'triangle', 'triangle', 'square'];
    return table[fam] || 'triangle';
  }

  let noiseBuf = null;
  function noise(ac) {
    if (!noiseBuf) {
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return noiseBuf;
  }

  function drum(ac, note, t, vel, out) {
    const g = ac.createGain();
    g.connect(out);
    if (note === 35 || note === 36) {           // kick
      const o = ac.createOscillator();
      o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
      g.gain.setValueAtTime(vel, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(g); o.start(t); o.stop(t + 0.25);
      return;
    }
    const s = ac.createBufferSource(); s.buffer = noise(ac);
    const f = ac.createBiquadFilter();
    const hat = note === 42 || note === 44 || note === 46 || note >= 49;
    f.type = hat ? 'highpass' : 'bandpass';
    f.frequency.value = hat ? 7000 : 1800;
    const dur = note === 46 || note === 49 || note === 57 ? 0.35 : hat ? 0.06 : 0.15;
    g.gain.setValueAtTime(vel * (hat ? 0.35 : 0.7), t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    s.connect(f); f.connect(g); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }

  class MidiPlayer {
    constructor(song, loop) {
      this.song = song; this.loop = loop; this.idx = 0; this.stopped = false;
      this.ac = audio();
      this.out = this.ac.createGain(); this.out.gain.value = 0.25; this.out.connect(musicGain);
      this.start = this.ac.currentTime + 0.1;
      this.prog = new Array(16).fill(0); this.vol = new Array(16).fill(100 / 127);
      this.active = new Map();
      this.timer = setInterval(() => this.pump(), 50);
      this.pump();
    }
    pump() {
      if (this.stopped) return;
      const ac = this.ac, horizon = ac.currentTime + 0.3, ev = this.song.events;
      while (true) {
        if (this.idx >= ev.length) {
          if (!this.loop) return;
          this.idx = 0; this.start += this.song.length;
          this.releaseAll(this.start);
        }
        const e = ev[this.idx], t = this.start + e.time;
        if (t > horizon) break;
        this.idx++;
        if (t < ac.currentTime - 0.5) continue;
        this.event(e, Math.max(t, ac.currentTime));
      }
    }
    event(e, t) {
      const ac = this.ac;
      if (e.type === 0xc0) this.prog[e.ch] = e.a;
      else if (e.type === 0xb0 && e.a === 7) this.vol[e.ch] = e.b / 127;
      else if (e.type === 0xb0 && (e.a === 123 || e.a === 120)) this.releaseAll(t);
      else if (e.type === 0x90 && e.b > 0) {
        const vel = (e.b / 127) * this.vol[e.ch];
        if (e.ch === 9) { drum(ac, e.a, t, vel, this.out); return; }
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = voiceFor(this.prog[e.ch]);
        o.frequency.value = 440 * Math.pow(2, (e.a - 69) / 12);
        const peak = vel * (o.type === 'triangle' ? 0.5 : 0.18);
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + 0.01);
        g.gain.setTargetAtTime(peak * 0.6, t + 0.01, 0.3);
        o.connect(g); g.connect(this.out); o.start(t);
        const k = e.ch * 128 + e.a;
        this.noteOff(k, t);
        this.active.set(k, { o, g });
      } else if (e.type === 0x80 || e.type === 0x90) {
        this.noteOff(e.ch * 128 + e.a, t);
      }
    }
    noteOff(k, t) {
      const n = this.active.get(k);
      if (!n) return;
      this.active.delete(k);
      n.g.gain.cancelScheduledValues(t);
      n.g.gain.setTargetAtTime(0, t, 0.05);
      n.o.stop(t + 0.3);
    }
    releaseAll(t) { for (const k of [...this.active.keys()]) this.noteOff(k, t); }
    stop() {
      this.stopped = true; clearInterval(this.timer);
      const t = this.ac.currentTime;
      this.releaseAll(t);
      this.out.gain.setTargetAtTime(0, t, 0.05);
      setTimeout(() => this.out.disconnect(), 500);
    }
  }

  function midiPlay(id, loop) {
    midiStop();
    const ac = audio();
    if (!ac || !midis[id]) return;
    midiPlayer = new MidiPlayer(midis[id], loop);
  }
  function midiStop() { if (midiPlayer) { midiPlayer.stop(); midiPlayer = null; } }

  // --- MP3 music (title song, Rambo song) decoded and played through WebAudio,
  // so it keeps working on phones after the first tap unlocked audio
  const mp3Cache = new Map();   // path -> Promise<AudioBuffer>
  let mp3Path = null, mp3Src = null, mp3Gain = null, mp3Token = 0;
  function mp3Decode(path) {
    if (!mp3Cache.has(path)) {
      const f = getFile(path), ac = audio();
      if (!f || !ac) return null;
      const copy = f.data.slice().buffer;
      mp3Cache.set(path, new Promise((ok, bad) => ac.decodeAudioData(copy, ok, bad)).catch(() => null));
    }
    return mp3Cache.get(path);
  }
  function mp3Open(path) {
    inFight = false;
    if (onSong) onSong(path);
    if (path === mp3Path) return 1;          // already the current song
    mp3Close();
    if (!getFile(path)) return 0;
    mp3Path = path;
    return 1;
  }
  function mp3Play() {
    if (!mp3Path || mp3Src || mp3Gain) return;
    const ac = audio(), p = mp3Decode(mp3Path), token = ++mp3Token;
    if (!ac || !p) return;
    // intro song as it was, fight songs at 25%, the rest at 50%
    mp3Gain = ac.createGain(); mp3Gain.gain.value = /shogunsong/i.test(mp3Path) ? 0.85 : /fight/i.test(mp3Path) ? 0.2125 : 0.425;
    mp3Gain.connect(master);
    const g = mp3Gain;
    p.then(buf => {
      if (!buf || token !== mp3Token) return;
      const src = ac.createBufferSource();
      src.buffer = buf; src.loop = true; src.connect(g); src.start();
      mp3Src = src;
    });
  }
  function mp3Close() {
    mp3Token++;
    if (mp3Src) { try { mp3Src.stop(); } catch (e) {} mp3Src = null; }
    if (mp3Gain) {
      const g = mp3Gain, ac = audio();
      g.gain.setTargetAtTime(0, ac.currentTime, 0.1);
      setTimeout(() => g.disconnect(), 600);
      mp3Gain = null;
    }
    mp3Path = null;
  }

  // ---------------------------------------------------------------- input
  const CODE_TO_KEY = (() => {
    const m = {};
    for (let i = 0; i < 26; i++) m['Key' + String.fromCharCode(65 + i)] = 1 + i;
    for (let i = 0; i < 10; i++) { m['Digit' + i] = 27 + i; m['Numpad' + i] = 37 + i; }
    for (let i = 1; i <= 12; i++) m['F' + i] = 46 + i;
    Object.assign(m, {
      Escape: 59, Backquote: 60, Minus: 61, Equal: 62, Backspace: 63, Tab: 64, BracketLeft: 65, BracketRight: 66,
      Enter: 67, Semicolon: 68, Quote: 69, Backslash: 70, Comma: 72, Period: 73, Slash: 74, Space: 75,
      Insert: 76, Delete: 77, Home: 78, End: 79, PageUp: 80, PageDown: 81,
      ArrowLeft: 82, ArrowRight: 83, ArrowUp: 84, ArrowDown: 85,
      NumpadDivide: 86, NumpadMultiply: 87, NumpadSubtract: 88, NumpadAdd: 89, NumpadDecimal: 90, NumpadEnter: 67,
    });
    return m;
  })();

  function setKey(code, down) {
    if (!ex || (paused && down)) return;
    const k = CODE_TO_KEY[code];
    if (k === undefined) return false;
    u8()[ex.web_key_ptr() + k] = down ? 1 : 0;
    if (down) { i32()[ex.web_keybuf_ptr() >> 2]++; u8()[ex.web_key_latch_ptr() + k] = 1; }
    return true;
  }

  // pad bits: 1 left, 2 right, 4 up, 8 down, 16 wp, 32 sp, 64 wk, 128 sk
  let touchBits = 0, gamepadBits = 0, padStart = false;
  function setPad() { if (ex) i32()[ex.web_pad_ptr() >> 2] = touchBits | gamepadBits; }
  function touchPad(bit, down) {
    if (paused && down) return;
    const before = touchBits;
    touchBits = down ? (touchBits | bit) : (touchBits & ~bit);
    if (down && !(before & bit) && ex) { i32()[ex.web_keybuf_ptr() >> 2]++; i32()[ex.web_pad_latch_ptr() >> 2] |= bit; }
    setPad();
  }
  function pollGamepads() {
    let bits = 0;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp) continue;
      const b = i => gp.buttons[i] && gp.buttons[i].pressed;
      const ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
      // stick hysteresis: a direction turns on past 0.5 and off below 0.3, so
      // a stick resting near the edge can't flicker into rapid repeat presses
      const on = bit => (gamepadBits & bit) ? 0.3 : 0.5;
      if (ax < -on(1) || b(14)) bits |= 1;
      if (ax > on(2) || b(15)) bits |= 2;
      if (ay < -on(4) || b(12)) bits |= 4;
      if (ay > on(8) || b(13)) bits |= 8;
      if (b(2)) bits |= 16;   // X / Square: light punch
      if (b(3)) bits |= 32;   // Y / Triangle: heavy punch
      if (b(0)) bits |= 64;   // A / Cross: light kick
      if (b(1)) bits |= 128;  // B / Circle: heavy kick
      // getGamepads() hands back a fresh snapshot each frame, so the Start
      // state has to live here (it used to fire Enter on every frame held)
      if (!!b(9) !== padStart) { padStart = !!b(9); if (!padStart || !startPause()) setKey('Enter', padStart); }
      break;
    }
    if (bits & ~gamepadBits && ex && !paused) { i32()[ex.web_keybuf_ptr() >> 2]++; i32()[ex.web_pad_latch_ptr() >> 2] |= bits & ~gamepadBits; }
    gamepadBits = bits;
    setPad();
    requestAnimationFrame(pollGamepads);
  }

  // ---------------------------------------------------------------- asyncify driver
  const ASYNC_SIZE = 1 << 20;
  let asyncData = 0, rewinding = false, sleepMs = 0, exited = false, exitHandler = null;
  const channel = new MessageChannel();
  channel.port1.onmessage = () => resume();

  function js_yield(ms) {
    if (rewinding) { ex.asyncify_stop_rewind(); rewinding = false; return; }
    const v = i32();
    v[asyncData >> 2] = asyncData + 8;
    v[(asyncData >> 2) + 1] = asyncData + ASYNC_SIZE;
    sleepMs = ms;
    ex.asyncify_start_unwind(asyncData);
  }

  function run() {
    try {
      ex._start();
    } catch (e) {
      if (e === EXIT) { finish(); return; }
      console.error(e);
      onStatus('crash', String(e && e.message || e));
      return;
    }
    if (ex.asyncify_get_state() === 1) {
      ex.asyncify_stop_unwind();
      if (sleepMs <= 0) channel.port2.postMessage(0);
      else setTimeout(resume, sleepMs);
    } else finish();
  }

  function resume() {
    if (paused) { pendingResume = true; return; }
    ex.asyncify_start_rewind(asyncData);
    rewinding = true;
    run();
  }

  function finish() {
    exited = true;
    midiStop(); mp3Close();
    onStatus('exit');
  }

  // ---------------------------------------------------------------- start
  async function start(opts) {
    canvas = opts.canvas;
    onStatus = opts.onStatus || onStatus;
    onPause = opts.onPause || null;
    onSong = opts.onSong || null;
    ctx2d = canvas.getContext('2d');
    files = opts.files;
    const overrides = opts.overrides || {};
    for (const [k, v] of Object.entries(overrides)) files.set(k, { name: k, data: te.encode(v) });

    const imports = {
      env: {
        js_yield,
        js_now: () => performance.now() - pausedFor,
        js_file_size: p => { const f = getFile(cstr(p)); return f ? f.data.length : -1; },
        js_file_read: (p, dst) => { const f = getFile(cstr(p)); if (f) u8().set(f.data, dst); },
        js_scan: (pat, dirs, out, max) => {
          const names = scan(cstr(pat), dirs).slice(0, max);
          const m = u8();
          names.forEach((n, i) => { const b = te.encode(n.slice(0, 29)); m.fill(0, out + i * 30, out + i * 30 + 30); m.set(b, out + i * 30); });
          return names.length;
        },
        js_present: (p, w, h) => {
          if (!imageData || imageData.width !== w || imageData.height !== h) {
            canvas.width = w; canvas.height = h;
            imageData = ctx2d.createImageData(w, h);
          }
          imageData.data.set(u8().subarray(p, p + w * h * 4));
          ctx2d.putImageData(imageData, 0, 0);
        },
        js_log: p => console.log('[kof91]', cstr(p)),
        js_title: p => { if (opts.onTitle) opts.onTitle(cstr(p)); },
        js_exit: () => { throw EXIT; },
        js_sample_load: p => sampleLoad(cstr(p)),
        js_sample_play: samplePlay,
        js_sample_stop: sampleStop,
        js_midi_load: p => midiLoad(cstr(p)),
        js_midi_play: midiPlay,
        js_midi_stop: midiStop,
        js_mp3_open: p => mp3Open(cstr(p)),
        js_mp3_play: mp3Play,
        js_mp3_close: mp3Close,
        js_set_volume: (d, m) => {
          digiVol = Math.min(1, d / 255); midiVol = Math.min(1, m / 255);
          if (sfxGain) { sfxGain.gain.value = digiVol; musicGain.gain.value = midiVol * 0.25; }
        },
      },
      wasi_snapshot_preview1: {
        random_get: (p, n) => { crypto.getRandomValues(u8().subarray(p, p + n)); return 0; },
        proc_exit: () => { throw EXIT; },
        fd_write: () => 0, fd_close: () => 0, fd_seek: () => 0,
      },
    };
    const { instance } = await WebAssembly.instantiate(opts.wasm, imports);
    ex = instance.exports;
    mem = ex.memory;
    asyncData = ex.malloc(ASYNC_SIZE);
    audio();
    if (actx && actx.state !== 'running') actx.resume();

    window.addEventListener('keydown', e => {
      if (e.repeat) { if (CODE_TO_KEY[e.code] !== undefined) e.preventDefault(); return; }
      if (e.code === 'Enter' && startPause()) { e.preventDefault(); return; }
      if (setKey(e.code, true)) e.preventDefault();
    });
    window.addEventListener('keyup', e => { if (setKey(e.code, false)) e.preventDefault(); });
    window.addEventListener('blur', () => { const m = u8(), k = ex.web_key_ptr(); m.fill(0, k, k + 128); });
    requestAnimationFrame(pollGamepads);
    run();
  }

  // Start during a fight opens the pause menu (true) instead of pressing Enter
  function startPause() {
    if (!inFight || paused || exited || !onPause) return false;
    setPaused(true); onPause();
    return true;
  }
  function setPaused(on) {
    if (on === paused) return;
    paused = on;
    if (ex) { const m = u8(), k = ex.web_key_ptr(); m.fill(0, k, k + 128); }
    touchBits = 0; setPad();
    if (on) { pausedAt = performance.now(); if (actx) actx.suspend(); }
    else {
      pausedFor += performance.now() - pausedAt;
      if (actx) actx.resume();
      if (pendingResume) { pendingResume = false; resume(); }
    }
  }

  return { loadPak, start, touchPad, setKey, audio, startPause, setPaused, isPaused: () => paused };
})();
