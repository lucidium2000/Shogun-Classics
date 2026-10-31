// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* SHOGUN Remastered: procedural audio.
   Nothing is sampled. The 1996 PLAY strings are parsed and re-voiced with
   taiko, koto and shakuhachi patches, and the fight loops are generated from
   a fixed seed so each stage always has the same theme. */
const Audio = (() => {
  const A = { ctx: null, on: true, voice: true, musicVol: 0.32, sfxVol: 0.8, track: null };
  let master, musicBus, sfxBus, verb, noiseBuf;
  const clipBufs = {};

  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    const ctx = A.ctx = new C();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12; comp.ratio.value = 5; comp.attack.value = 0.003; comp.release.value = 0.2;
    master = ctx.createGain(); master.gain.value = A.on ? 0.9 : 0;
    comp.connect(master); master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = A.musicVol; musicBus.connect(comp);
    sfxBus = ctx.createGain(); sfxBus.gain.value = A.sfxVol; sfxBus.connect(comp);
    // small hall: generated impulse response
    verb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    verb.buffer = ir;
    const vg = ctx.createGain(); vg.gain.value = 0.35; verb.connect(vg); vg.connect(comp);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    // the recorded announcer: decode each clip once
    if (typeof VOICE_CLIPS !== 'undefined') for (const [k, b64] of Object.entries(VOICE_CLIPS)) {
      const bin = atob(b64), u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      ctx.decodeAudioData(u.buffer, buf => { clipBufs[k] = buf; }, () => {});
    }
  };

  A.setOn = function (on) {
    A.on = on;
    if (master) master.gain.setTargetAtTime(on ? 0.9 : 0, A.ctx.currentTime, 0.05);
    if (!on && window.speechSynthesis) speechSynthesis.cancel();
  };

  const now = () => A.ctx.currentTime;
  function noise(t, dur, dest, type, f0, f1, q, g0, attack) {
    const ctx = A.ctx, s = ctx.createBufferSource(); s.buffer = noiseBuf;
    s.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q || 1;
    f.frequency.setValueAtTime(f0, t);
    if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(g0, t + (attack || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest);
    s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
    return g;
  }
  function osc(t, type, f0, f1, dur, dest, g0, attack, glide) {
    const ctx = A.ctx, o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + (glide || dur));
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(g0, t + (attack || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
    return { o, g };
  }
  function send(node, amt) { const g = A.ctx.createGain(); g.gain.value = amt; node.connect(g); g.connect(verb); }

  /* ------------------------------------------------------------ voices */
  const V = {};
  V.taiko = (t, g, dest, hz) => {
    hz = hz || 70;
    osc(t, 'sine', hz * 2.2, hz, 0.55, dest, g, 0.003, 0.09);
    const n = noise(t, 0.12, dest, 'lowpass', 900, 200, 1, g * 0.5);
    send(n, 0.4);
  };
  V.rim = (t, g, dest) => { noise(t, 0.05, dest, 'bandpass', 2600, 0, 4, g); osc(t, 'square', 820, 0, 0.03, dest, g * 0.15); };
  V.shaker = (t, g, dest) => noise(t, 0.05, dest, 'highpass', 7000, 0, 1, g);
  V.koto = (t, f, dur, g, dest) => {
    const ctx = A.ctx;
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    o1.type = 'triangle'; o2.type = 'sawtooth'; o1.frequency.value = f; o2.frequency.value = f * 1.003;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2;
    lp.frequency.setValueAtTime(f * 9, t); lp.frequency.exponentialRampToValueAtTime(f * 1.4, t + 0.35);
    const gg = ctx.createGain();
    gg.gain.setValueAtTime(0.0001, t); gg.gain.exponentialRampToValueAtTime(g, t + 0.004);
    gg.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.4, dur * 1.6));
    const m2 = ctx.createGain(); m2.gain.value = 0.35;
    o1.connect(lp); o2.connect(m2); m2.connect(lp); lp.connect(gg); gg.connect(dest); send(gg, 0.5);
    o1.start(t); o2.start(t); o1.stop(t + dur * 1.6 + 0.5); o2.stop(t + dur * 1.6 + 0.5);
  };
  V.flute = (t, f, dur, g, dest) => {
    const ctx = A.ctx, o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 5.2; lg.gain.value = f * 0.012;
    lfo.connect(lg); lg.connect(o.frequency);
    const o3 = ctx.createOscillator(); o3.type = 'triangle'; o3.frequency.value = f * 2; const g3 = ctx.createGain(); g3.gain.value = 0.12;
    o3.connect(g3);
    const gg = ctx.createGain();
    gg.gain.setValueAtTime(0.0001, t); gg.gain.exponentialRampToValueAtTime(g, t + 0.06);
    gg.gain.setValueAtTime(g * 0.85, t + Math.max(0.07, dur - 0.08)); gg.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.12);
    o.connect(gg); g3.connect(gg); gg.connect(dest); send(gg, 0.9);
    const b = noise(t, dur + 0.1, dest, 'bandpass', f * 2, 0, 3, g * 0.18, 0.05);
    [o, lfo, o3].forEach(x => { x.start(t); x.stop(t + dur + 0.2); });
    return b;
  };
  V.bass = (t, f, dur, g, dest) => {
    const ctx = A.ctx, o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(f * 6, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + dur);
    const s = ctx.createOscillator(); s.type = 'sine'; s.frequency.value = f / 2;
    const gs = ctx.createGain(); gs.gain.value = 0.7;
    const gg = ctx.createGain(); gg.gain.setValueAtTime(0.0001, t); gg.gain.exponentialRampToValueAtTime(g, t + 0.01); gg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(lp); s.connect(gs); gs.connect(lp); lp.connect(gg); gg.connect(dest);
    o.start(t); s.start(t); o.stop(t + dur + 0.05); s.stop(t + dur + 0.05);
  };
  V.drone = (t, f, dur, g, dest) => {
    const ctx = A.ctx, gg = ctx.createGain();
    gg.gain.setValueAtTime(0.0001, t); gg.gain.exponentialRampToValueAtTime(g, t + dur * 0.3); gg.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    [1, 1.5, 2.004].forEach((m, i) => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f * m * (1 + (i - 1) * 0.002); o.connect(lp); o.start(t); o.stop(t + dur + 0.05); });
    lp.connect(gg); gg.connect(dest); send(gg, 0.8);
  };
  V.brass = (t, f, dur, g, dest) => {
    const ctx = A.ctx, lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(f * 1.5, t); lp.frequency.exponentialRampToValueAtTime(f * 6, t + 0.08); lp.frequency.exponentialRampToValueAtTime(f * 2.5, t + dur);
    const gg = ctx.createGain(); gg.gain.setValueAtTime(0.0001, t); gg.gain.exponentialRampToValueAtTime(g, t + 0.03);
    gg.gain.setValueAtTime(g * 0.8, t + Math.max(0.04, dur - 0.05)); gg.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.15);
    [0.997, 1.003, 0.5].forEach(m => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f * m; o.connect(lp); o.start(t); o.stop(t + dur + 0.2); });
    lp.connect(gg); gg.connect(dest); send(gg, 0.6);
  };
  V.gong = (t, g, dest) => {
    [1, 1.41, 2.27, 2.98, 4.1].forEach((m, i) => { const x = osc(t, 'sine', 88 * m, 0, 3.5 - i * 0.5, dest, g / (i + 1.5), 0.01); send(x.g, 0.7); });
    noise(t, 0.6, dest, 'bandpass', 500, 300, 1, g * 0.3);
  };

  /* ------------------------------------------------- QBasic PLAY parser */
  // O3 C is middle C, as in QBasic. Returns [{f, dur, oct}] with f = 0 for rests.
  A.parsePlay = function (s, state) {
    const st = state || { T: 120, O: 4, L: 4 };
    const out = []; s = s.toUpperCase(); let i = 0;
    const num = () => { let m = ''; while (i < s.length && /[0-9]/.test(s[i])) m += s[i++]; return m ? +m : null; };
    const semi = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    while (i < s.length) {
      const c = s[i++];
      if (c === 'T') { const n = num(); if (n) st.T = n; }
      else if (c === 'O') { const n = num(); if (n !== null) st.O = n; }
      else if (c === 'L') { const n = num(); if (n) st.L = n; }
      else if (c === '<') st.O = Math.max(0, st.O - 1);
      else if (c === '>') st.O = Math.min(6, st.O + 1);
      else if (c === 'M') i++;
      else if (c === 'P') { const n = num() || st.L; out.push({ f: 0, dur: 240 / st.T / n }); }
      else if (semi[c] !== undefined) {
        let n = semi[c];
        if (s[i] === '#' || s[i] === '+') { n++; i++; } else if (s[i] === '-') { n--; i++; }
        const len = num() || st.L; let dur = 240 / st.T / len, d = 1;
        while (s[i] === '.') { d *= 0.5; dur += 240 / st.T / len * d; i++; }
        const midi = 12 * (st.O + 1) + 12 + n; // O3 C = 60
        out.push({ f: 440 * Math.pow(2, (midi - 69) / 12), dur, oct: st.O, midi });
      }
    }
    return out;
  };

  // Re-voice a 1996 PLAY string. Octave 0/1 thumps become taiko; the rest is
  // lifted into koto or brass range so the motif reads as music.
  A.play = function (s, opt) {
    if (!A.ctx) return 0;
    opt = opt || {};
    const notes = A.parsePlay(s, { T: opt.T || 120, O: 4, L: 4 });
    let t = now() + 0.03; const dest = sfxBus; const voice = opt.voice || 'koto';
    for (const n of notes) {
      if (n.f) {
        if (n.oct <= 1 && voice !== 'pure') {
          V.taiko(t, 0.75, dest, 55 + n.midi * 0.6);
          V[voice === 'brass' ? 'brass' : 'koto'](t, n.f * (n.oct === 0 ? 8 : 4), n.dur * 0.9, 0.16, dest);
        } else V[voice === 'brass' ? 'brass' : voice === 'flute' ? 'flute' : 'koto'](t, n.f, n.dur * 0.9, 0.22, dest);
      }
      t += n.dur;
    }
    return t - now();
  };

  /* --------------------------------------------------------------- SFX */
  const S = {};
  S.punch = () => { const t = now(); noise(t, 0.09, sfxBus, 'bandpass', 1400, 400, 1.2, 0.7); osc(t, 'sine', 160, 60, 0.12, sfxBus, 0.9); };
  S.heavy = () => { const t = now(); noise(t, 0.16, sfxBus, 'lowpass', 2400, 300, 1, 0.9); osc(t, 'sine', 120, 40, 0.22, sfxBus, 1); V.taiko(t, 0.5, sfxBus, 60); };
  S.block = () => { const t = now(); osc(t, 'square', 1800, 1200, 0.07, sfxBus, 0.18); noise(t, 0.06, sfxBus, 'highpass', 3000, 0, 1, 0.4); };
  S.whoosh = (hi) => { const t = now(); noise(t, 0.16, sfxBus, 'bandpass', hi ? 1800 : 900, hi ? 4000 : 2400, 2.5, 0.35, 0.05); };
  S.slash = () => { const t = now(); noise(t, 0.2, sfxBus, 'highpass', 2500, 7000, 1.5, 0.5, 0.01); const x = osc(t + 0.02, 'sine', 3520, 3300, 0.6, sfxBus, 0.06); send(x.g, 0.6); };
  S.sliceHit = () => { const t = now(); S.slash(); noise(t, 0.2, sfxBus, 'lowpass', 1200, 200, 1, 0.8); };
  S.jump = () => { const t = now(); noise(t, 0.12, sfxBus, 'bandpass', 600, 1500, 2, 0.25, 0.03); };
  S.land = () => { const t = now(); osc(t, 'sine', 90, 40, 0.15, sfxBus, 0.6); noise(t, 0.1, sfxBus, 'lowpass', 500, 0, 1, 0.3); };
  S.fall = () => { const t = now(); osc(t, 'sine', 80, 30, 0.35, sfxBus, 1); noise(t, 0.3, sfxBus, 'lowpass', 800, 100, 1, 0.8); V.taiko(t, 0.6, sfxBus, 50); };
  S.fireball = () => {
    const t = now(); noise(t, 0.5, sfxBus, 'bandpass', 400, 2400, 1.5, 0.6, 0.06);
    osc(t, 'sawtooth', 110, 330, 0.4, sfxBus, 0.18, 0.02); osc(t, 'square', 880, 1320, 0.15, sfxBus, 0.05);
  };
  S.dash = () => { const t = now(); noise(t, 0.35, sfxBus, 'highpass', 1500, 6000, 1, 0.5, 0.02); osc(t, 'sawtooth', 220, 880, 0.3, sfxBus, 0.08); };
  S.blast = () => {
    const t = now(); noise(t, 1.1, sfxBus, 'lowpass', 300, 4000, 2, 0.9, 0.2);
    osc(t, 'sawtooth', 55, 220, 1, sfxBus, 0.3, 0.2); osc(t, 'sine', 1760, 440, 0.9, sfxBus, 0.08, 0.1);
  };
  S.explode = () => { const t = now(); noise(t, 0.9, sfxBus, 'lowpass', 3000, 80, 0.7, 1); osc(t, 'sine', 90, 30, 0.6, sfxBus, 1); };
  S.blood = () => { const t = now(); noise(t, 0.25, sfxBus, 'lowpass', 900, 150, 3, 0.6); noise(t + 0.05, 0.2, sfxBus, 'bandpass', 500, 200, 4, 0.4); };
  S.crunch = () => { const t = now(); for (let i = 0; i < 4; i++) noise(t + i * 0.035, 0.05, sfxBus, 'bandpass', 1800 - i * 200, 0, 2, 0.6); osc(t, 'sine', 140, 50, 0.2, sfxBus, 0.8); };
  S.spikes = () => { const t = now(); S.crunch(); noise(t, 0.6, sfxBus, 'lowpass', 1200, 100, 2, 0.9); osc(t, 'square', 300, 40, 0.3, sfxBus, 0.2); };
  S.parry = () => { const t = now(); [2400, 3600].forEach(f => { const x = osc(t, 'sine', f, f * 0.98, 0.5, sfxBus, 0.12); send(x.g, 0.7); }); noise(t, 0.05, sfxBus, 'highpass', 5000, 0, 1, 0.5); };
  S.catch = () => { const t = now(); osc(t, 'sine', 200, 80, 0.2, sfxBus, 0.8); noise(t, 0.1, sfxBus, 'bandpass', 800, 0, 2, 0.5); };
  S.ui = () => { const t = now(); osc(t, 'square', 660, 0, 0.06, sfxBus, 0.08); };
  S.confirm = () => { const t = now(); V.koto(t, 659, 0.2, 0.3, sfxBus); V.koto(t + 0.07, 988, 0.3, 0.3, sfxBus); };
  S.gong = () => V.gong(now(), 0.5, sfxBus);
  S.taiko = () => V.taiko(now(), 1, sfxBus, 62);
  S.thunder = () => { const t = now(); noise(t, 2.2, sfxBus, 'lowpass', 600, 60, 0.7, 0.9, 0.02); noise(t + 0.15, 1.6, sfxBus, 'lowpass', 300, 50, 0.7, 0.7, 0.3); };
  S.dizzy = () => { const t = now(); for (let i = 0; i < 3; i++) V.koto(t + i * 0.09, 1320 + i * 200, 0.1, 0.06, sfxBus); };
  S.code = (i) => { const t = now(); V.koto(t, 440 * Math.pow(2, (i * 2) / 12), 0.15, 0.25, sfxBus); };
  S.fatality = () => { const t = now(); V.gong(t, 0.6, sfxBus); V.taiko(t, 1, sfxBus, 45); V.brass(t + 0.1, 82.4, 1.6, 0.25, sfxBus); V.brass(t + 0.1, 123.5, 1.6, 0.2, sfxBus); };
  A.sfx = function (name, arg) { if (!A.ctx || !A.on || !S[name]) return; try { S[name](arg); } catch (e) { /* audio is best effort */ } };

  /* ------------------------------------------------------------- music */
  // Japanese "in" scale on E: E F A B C (semitones 0 1 5 7 8)
  const IN = [0, 1, 5, 7, 8];
  const deg = (root, d) => { const o = Math.floor(d / 5), k = ((d % 5) + 5) % 5; return root + IN[k] + 12 * o; };
  const mf = m => 440 * Math.pow(2, (m - 69) / 12);
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  function makeTrack(name) {
    if (name === 'title') {
      // the title tune the kids left commented out in SHOGUN.BAS
      const mel = A.parsePlay('T125 O4E O4F O4G O4A.O4G O4E O4G O4G.O4E O4E P4 P4', { T: 125, O: 4, L: 4 });
      return { name, bpm: 125, root: 40, mel, drums: 'title' };
    }
    const cfg = {
      fight1: { bpm: 112, root: 40, seed: 7, drums: 'march' },
      fight2: { bpm: 128, root: 42, seed: 31, drums: 'drive' },
      fight3: { bpm: 96, root: 38, seed: 99, drums: 'doom' },
      story: { bpm: 70, root: 40, seed: 3, drums: 'sparse' },
      vs: { bpm: 140, root: 40, seed: 5, drums: 'roll' },
    }[name];
    if (!cfg) return null;
    const r = rng(cfg.seed); const bars = [];
    for (let b = 0; b < 8; b++) {
      const notes = []; let d = 5 + Math.floor(r() * 4);
      for (let s = 0; s < 16; s++) {
        const play = (s % 4 === 0) ? r() < 0.75 : r() < 0.28;
        if (play) { d += Math.floor(r() * 5) - 2; d = Math.max(3, Math.min(11, d)); notes.push({ s, d, len: (r() < 0.3 ? 4 : 2) }); }
      }
      bars.push(notes);
    }
    return Object.assign({ name, bars }, cfg);
  }

  let timer = null, nextT = 0, step = 0;
  function schedule(tr, st, t) {
    const sp = 60 / tr.bpm / 4, bar = Math.floor(st / 16) % 8, s = st % 16, dest = musicBus;
    if (tr.name === 'title') {
      if (s % 16 === 0) V.drone(t, mf(tr.root), sp * 16, 0.07, dest);
      if (s === 0 || s === 10) V.taiko(t, 0.8, dest, 58);
      if (s === 6 || s === 14) V.taiko(t, 0.35, dest, 80);
      if (bar % 2 === 1 && s === 12) V.rim(t, 0.25, dest);
      // melody: 9-note phrase spread over two bars
      if (!tr._mt || st === 0) { tr._mt = []; let acc = 0; tr.mel.forEach(n => { tr._mt.push({ at: acc, n }); acc += n.dur; }); tr._len = acc; }
      const barDur = sp * 16, phraseBars = Math.ceil(tr._len / barDur);
      const pb = bar % phraseBars, start = pb * barDur + s * sp;
      if (bar >= 2) for (const m of tr._mt) if (m.n.f && m.at >= start - 1e-6 && m.at < start + sp - 1e-6) V.flute(t + (m.at - start), m.n.f, m.n.dur * 0.95, 0.1, dest);
      if (s % 4 === 2) V.koto(t, mf(tr.root + 24 + [0, 7, 12, 7][(s >> 2)]), sp * 2, 0.06, dest);
      return;
    }
    const D = tr.drums;
    if (D === 'march') {
      if (s === 0 || s === 8) V.taiko(t, 0.9, dest, 55);
      if (s === 4 || s === 12) V.taiko(t, 0.5, dest, 85);
      if (s === 14 && bar % 2) V.taiko(t, 0.5, dest, 75);
      if (s % 2 === 1) V.shaker(t, 0.06, dest);
    } else if (D === 'drive') {
      if (s % 4 === 0) V.taiko(t, 0.8, dest, 60);
      if (s === 6 || s === 10 || s === 14) V.taiko(t, 0.45, dest, 95);
      if (s % 4 === 2) V.rim(t, 0.18, dest);
      V.shaker(t, s % 2 ? 0.04 : 0.07, dest);
    } else if (D === 'doom') {
      if (s === 0) V.taiko(t, 1, dest, 45);
      if (s === 7 || s === 10) V.taiko(t, 0.6, dest, 50);
      if (s === 12 && bar % 4 === 3) V.gong(t, 0.15, dest);
      if (s % 4 === 2) V.rim(t, 0.08, dest);
    } else if (D === 'sparse') {
      if (s === 0 && bar % 2 === 0) V.taiko(t, 0.7, dest, 48);
      if (s === 0 && bar % 4 === 0) V.drone(t, mf(tr.root), sp * 32, 0.06, dest);
    } else if (D === 'roll') {
      V.taiko(t, 0.25 + (s / 16) * 0.6, dest, 70 + s * 2);
    }
    if (D !== 'sparse' && D !== 'roll') {
      if (s === 0 || s === 8 || (s === 11 && bar % 2)) V.bass(t, mf(tr.root + (bar % 4 === 3 ? 5 : bar % 4 === 2 ? 1 : 0)), sp * 3, 0.22, dest);
      if (s === 0 && bar % 4 === 0) V.drone(t, mf(tr.root + 12), sp * 64, 0.035, dest);
    }
    if (bar >= 2 || D === 'sparse') for (const n of tr.bars[bar]) if (n.s === s) {
      const m = deg(tr.root + 24, n.d);
      if (D === 'sparse' || (bar >= 4 && n.len === 4)) V.flute(t, mf(m), sp * n.len * 1.4, D === 'sparse' ? 0.07 : 0.08, dest);
      else V.koto(t, mf(m), sp * n.len, 0.12, dest);
    }
  }
  function tick() {
    if (!A.ctx || !A.track) return;
    const sp = 60 / A.track.bpm / 4;
    while (nextT < A.ctx.currentTime + 0.15) { if (A.on) schedule(A.track, step, nextT); nextT += sp; step++; }
  }
  A.music = function (name) {
    if (!A.ctx) return;
    if (A.track && A.track.name === name) return;
    A.stopMusic();
    if (!name) return;
    A.track = makeTrack(name); if (!A.track) return;
    musicBus.gain.cancelScheduledValues(now()); musicBus.gain.setValueAtTime(A.musicVol, now());
    step = 0; nextT = now() + 0.08; timer = setInterval(tick, 30); tick();
  };
  A.stopMusic = function () {
    if (timer) clearInterval(timer); timer = null; A.track = null;
  };
  A.duck = function (amt, dur) {
    if (!A.ctx) return; const t = now();
    musicBus.gain.cancelScheduledValues(t); musicBus.gain.setTargetAtTime(A.musicVol * amt, t, 0.05);
    musicBus.gain.setTargetAtTime(A.musicVol, t + dur, 0.3);
  };

  /* ---------------------------------------------------------- announcer */
  let vox = null;
  function pickVoice() {
    if (!window.speechSynthesis) return null;
    const vs = speechSynthesis.getVoices(); if (!vs.length) return null;
    const en = vs.filter(v => /^en/i.test(v.lang));
    return en.find(v => /male|daniel|fred|alex|george|david|guy|ryan/i.test(v.name) && !/female/i.test(v.name)) || en[0] || vs[0];
  }
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => { vox = pickVoice(); };
  // a recorded announcer line, or the speech voice saying the fallback text until it has loaded
  let clipSrc = null;
  A.clip = function (name, text, rate, pitch) {
    if (!A.on || !A.voice) return;
    const buf = clipBufs[name];
    if (!buf || !A.ctx) { if (text) A.say(text, rate, pitch); return; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    try { if (clipSrc) clipSrc.stop(); } catch (e) {}
    const src = A.ctx.createBufferSource(), g = A.ctx.createGain();
    src.buffer = buf; g.gain.value = 1.4; src.connect(g); g.connect(sfxBus); src.start();
    clipSrc = src; src.onended = () => { if (clipSrc === src) clipSrc = null; };
  };
  A.say = function (text, rate, pitch) {
    if (!A.on || !A.voice || !window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      vox = vox || pickVoice(); if (vox) u.voice = vox;
      u.rate = rate || 0.82; u.pitch = pitch == null ? 0.2 : pitch; u.volume = 1;
      speechSynthesis.speak(u);
    } catch (e) { /* speech is optional */ }
  };
  return A;
})();
