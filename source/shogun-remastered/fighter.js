// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* Fighters: move data, the state machine, hit resolution and the enemy AI.
   Damage numbers, the 10-point life bar and every enemy rule are taken from
   SHOGUN.BAS / CSHOGUN.BAS. */
const MOVES = {
  punch: { dmg: 0.5, st: 0.06, act: 0.09, rec: 0.13, reach: 140, type: 'high', sfx: 'punch' },
  slash: { dmg: 0.5, st: 0.07, act: 0.09, rec: 0.14, reach: 158, type: 'high', sfx: 'slash' },
  upper: { dmg: 2, st: 0.1, act: 0.1, rec: 0.32, reach: 135, type: 'high', launch: true, sfx: 'heavy' },
  sUpper: { dmg: 2, st: 0.1, act: 0.1, rec: 0.32, reach: 150, type: 'high', launch: true, sfx: 'sliceHit' },
  jumpKick: { dmg: 1, reach: 140, type: 'air', sfx: 'heavy' },
  dash: { dmg: 1.5, reach: 90, type: 'high', sfx: 'sliceHit' },
};

const DEFS = {
  keero: { hero: true, walk: 175, idle: ['idle', 'idle2'], block: 'block', crouch: 'crouch', jump: 'jump', kick: 'jumpKick', victory: 'victory',
    punches: [['punchS', 'punchH'], ['punchS', 'cross']], punch: MOVES.punch, upper: MOVES.upper, upperP: ['upperS', 'upperH'],
    special: 'fireball', seq: [4, 6] },
  shokei: { hero: true, walk: 175, idle: ['sIdle', 'sIdle2'], block: 'block', crouch: 'crouch', jump: 'jump', kick: 'jumpKick', victory: 'sVictory',
    punches: [['slashS', 'slashH']], punch: MOVES.slash, upper: MOVES.sUpper, upperP: ['sUpperS', 'sUpperH'],
    special: 'dash', seq: [4, 6] },
  wanfu: { walk: 85, idle: ['idle', 'idle2'], victory: 'victory', think: 0.5, aggro: 0.5, armorAt: 3,
    moves: { hit: { dmg: 0.5, st: 0.34, act: 0.1, rec: 0.38, reach: 112, type: 'high', p: ['punchS', 'punchH'], sfx: 'heavy' },
      kick: { dmg: 1, st: 0.42, act: 0.12, rec: 0.42, reach: 124, type: 'low', p: ['kickS', 'kickH'], sfx: 'heavy' } } },
  yamana: { walk: 140, idle: ['yIdle', 'yIdle2'], victory: 'yIdle', think: 0.42, aggro: 0.5, armorAt: 3, acrobat: true,
    moves: { hit: { dmg: 2, st: 0.32, act: 0.12, rec: 0.42, reach: 190, type: 'high', p: ['staffS', 'staffH'], sfx: 'heavy', whoosh: true },
      kick: { dmg: 1, st: 0.3, act: 0.12, rec: 0.36, reach: 128, type: 'low', p: ['sweepS', 'sweepH'], sfx: 'punch' },
      // EHIT3 in SHOGUN.BAS: Yamana cartwheels across the screen into you (damage 2)
      wheel: { dmg: 2, reach: 96, type: 'high', sfx: 'heavy' } } },
  frill: { walk: 125, idle: ['fIdle', 'fIdle2'], victory: 'fIdle', think: 0.32, aggro: 0.75, armorAt: 2, frill: true,
    moves: { hit: { dmg: 1.5, st: 0.24, act: 0.1, rec: 0.3, reach: 114, type: 'high', p: ['punchS', 'punchH'], sfx: 'heavy' },
      kick: { dmg: 2, st: 0.28, act: 0.12, rec: 0.34, reach: 126, type: 'low', p: ['kickS', 'kickH'], sfx: 'heavy' } } },
};

class Fighter {
  constructor(key, x, face, human, pad) {
    this.key = key; this.def = DEFS[key]; this.look = Rig.LOOKS[key];
    this.human = human; this.pad = pad; this.x = x; this.y = 0; this.vx = 0; this.vy = 0; this.face = face;
    this.hp = 10; this.state = 'idle'; this.t = 0; this.grounded = true;
    this.pose = Rig.copy(Rig.POSES[this.def.idle[0]]); this.target = this.def.idle[0]; this.speed = 10;
    this.digits = []; this.punchAlt = 0; this.buffer = null; this.think = 0.6; this.punchCount = 0;
    this.ropes = [];
    if (this.look.hoodTail) this.ropes.push({ r: new Rig.Rope(4, 7, 11, this.look.hoodTail), at: 'head' });
    if (this.look.band) this.ropes.push({ r: new Rig.Rope(7, 9, 5, this.look.band), at: 'head' });
    if (this.look.belt && this.look.gi && !this.look.rope) this.ropes.push({ r: new Rig.Rope(4, 8, 4, this.look.belt), at: 'belt' }, { r: new Rig.Rope(4, 9, 4, this.look.belt), at: 'belt' });
    if (this.look.shadow) for (let i = 0; i < 4; i++) this.ropes.push({ r: new Rig.Rope(6, 12, 9 - i, 'rgba(10,14,26,0.9)'), at: 'belt' });
    this.trail = [];
  }
  get s() { return this.look.s; }
  set(state, target, speed) { if (this.state === 'wheel' && state !== 'wheel') this.pose.rot = 0; this.armor = false; this.state = state; this.t = 0; if (target) this.target = target; if (speed) this.speed = speed; this.hitDone = false; }
  idlePose() { return this.def.idle[(Math.floor(performance.now() / 700 + this.x) % 2 + 2) % 2]; }
  canAct() { return ['idle', 'walk', 'block', 'crouch'].includes(this.state); }

  /* ------------------------------------------------ human control */
  control(G) {
    const P = Input.pads[this.pad], evs = Input.take(this.pad), now = performance.now();
    const fwd = this.face > 0 ? 'r' : 'l', bk = this.face > 0 ? 'l' : 'r';
    for (const e of evs) {
      let d = null;
      if (e.b === 'digit') d = e.d;
      else if (e.b === fwd) d = 6; else if (e.b === bk) d = 4; else if (e.b === 'u') d = 8; else if (e.b === 'd') d = 2; else if (e.b === 'p') d = 5;
      if (d != null) { this.digits.push({ d, t: now }); if (this.digits.length > 8) this.digits.shift(); }
      if (G.codeEntry && G.codeEntry.who === this) { if (d != null) G.codeDigit(d); continue; }
      if (e.b === 'sp') { this.trySpecial(G, true); continue; }
      if (d != null && d !== 5 && this.checkSeq()) { if (this.trySpecial(G)) continue; }
      if (e.b === 'p') {
        if (this.state === 'jump') this.doJumpKick();
        else if (this.state === 'crouch') this.doUpper();
        else if (this.canAct()) this.doPunch();
        else this.buffer = { b: 'p', t: now };
      }
      if (e.b === 'u' && this.canAct() && this.state !== 'crouch') this.doJump(P[fwd] ? 1 : P[bk] ? -1 : 0);
    }
    if (G.codeEntry || !G.fighting) { if (this.canAct()) this.set('idle', this.idlePose(), 8); this.vx = 0; return; }
    if (this.buffer && now - this.buffer.t < 160 && this.canAct()) { this.buffer = null; this.doPunch(); }
    if (!this.canAct()) return;
    if (P.d) { if (this.state !== 'crouch') this.set('crouch', this.def.crouch, 22); this.vx = 0; }
    else if (P[bk]) { if (this.state !== 'block') this.set('block', this.def.block, 22); this.vx = -this.face * 70; }
    else if (P[fwd]) { if (this.state !== 'walk') this.set('walk', null, 10); this.vx = this.face * this.def.walk; }
    else { if (this.state !== 'idle') this.set('idle', this.idlePose(), 10); this.vx = 0; }
  }
  checkSeq() {
    const seq = this.def.seq; if (!seq) return false;
    const ds = this.digits.filter(x => x.d !== 5); if (ds.length < seq.length) return false;
    const tail = ds.slice(-seq.length);
    if (performance.now() - tail[0].t > 380) return false;
    return tail.every((x, i) => x.d === seq[i]);
  }
  trySpecial(G, button) {
    if (!(this.canAct() || this.state === 'attack' && this.t > 0.08)) return false;
    if (this.def.special === 'fireball' && G.projectiles.some(p => p.owner === this)) return false;
    this.digits = [];
    if (this.def.special === 'fireball') { this.set('fireball', 'chargeS', 20); this.vx = 0; Audio.sfx('whoosh'); }
    else { this.set('dash', 'sUpperS', 24); this.vx = 0; Audio.sfx('dash'); }
    return true;
  }
  doPunch() {
    const pp = this.def.punches[this.punchAlt++ % this.def.punches.length];
    this.move = this.def.punch; this.movePoses = pp; this.set('attack', pp[0], 30); this.vx = this.face * 260;
    Audio.sfx(this.key === 'shokei' ? 'whoosh' : 'whoosh', this.key === 'shokei');
  }
  doUpper() { this.move = this.def.upper; this.movePoses = this.def.upperP; this.set('attack', this.def.upperP[0], 30); this.vx = this.face * 300; Audio.sfx('whoosh'); }
  doJump(dir) { this.set('jump', this.def.jump, 14); this.grounded = false; this.vy = -780; this.vx = dir * 230; Audio.sfx('jump'); }
  doJumpKick() { this.state = 'jumpKick'; this.target = this.def.kick; this.speed = 26; this.hitDone = false; this.move = MOVES.jumpKick; Audio.sfx('whoosh'); }

  /* ----------------------------------------------------- enemy AI */
  brain(G, foe, dt) {
    if (!G.fighting || G.codeEntry) { if (this.canAct()) { this.set('idle', this.idlePose(), 8); this.vx = 0; } return; }
    if (!this.canAct()) return;
    const D = this.def, dist = Math.abs(foe.x - this.x);
    this.think -= dt;
    const want = this.plan || 'hit', reach = D.moves[want].reach;
    if (dist > reach - 6) { if (this.state !== 'walk') this.set('walk', null, 9); this.vx = this.face * D.walk; }
    else if (dist < 76 && Math.random() < dt * 2) { this.set('walk', null, 9); this.vx = -this.face * D.walk * 0.6; }
    else if (this.state === 'walk' && dist <= reach - 6) { this.set('idle', this.idlePose(), 8); this.vx = 0; }
    if (this.think > 0) return;
    this.think = D.think * (0.7 + Math.random() * 0.6) * (G.diff === 0 ? 1.5 : G.diff === 2 ? 0.7 : 1);
    // the 1996 roll: x% = INT(RND * 6), 1 or 2 = hit, 0 = kick (Frill: RND * 4)
    const roll = Math.floor(Math.random() * (D.frill ? 4 : 6));
    const pick = roll === 1 || roll === 2 ? 'hit' : roll === 0 ? 'kick' : null;
    if (Math.random() < 0.5) this.plan = Math.random() < 2 / 3 ? 'hit' : 'kick';
    if (D.moves.wheel && pick === 'hit' && dist > 150 && dist < 420 && Math.random() < 0.6) return this.cartwheel(dist);
    if (!pick || dist > D.moves[pick].reach + 4) return;
    if (D.frill && foe.state === 'crouch' && Math.random() < 0.6) return this.attack('kick');
    this.attack(pick);
  }
  cartwheel(dist) {
    this.set('wheel', 'wheel', 16); this.taken = 0;
    this.vx = this.face * Math.max(240, (dist - 50) / 0.62);   // lands right in front of you
    setTimeout(() => Audio.sfx('whoosh'), 120);
  }
  attack(name, fast) {
    const m = this.def.moves[name]; this.taken = 0;
    this.move = fast ? Object.assign({}, m, { st: 0.12 }) : m; this.movePoses = m.p; this.set('attack', m.p[0], 14); this.vx = 0;
    if (m.whoosh) setTimeout(() => Audio.sfx('whoosh'), m.st * 600);
  }

  /* -------------------------------------------------------- update */
  update(G, dt, foe) {
    this.t += dt;
    const P = Rig.POSES;
    if (!this.scripted) switch (this.state) {
      case 'jumpKick': if (!this.hitDone) G.tryHit(this, foe, MOVES.jumpKick); break;
      case 'blast': if (this.t > 0.95) this.set('idle', this.def.idle[0], 8); break;
      case 'idle': if (this.t > 0.7) { this.t = 0; this.target = this.def.idle[(this.def.idle.indexOf(this.target) + 1) % this.def.idle.length] || this.def.idle[0]; this.speed = 3; } break;
      case 'walk': { const ph = Math.sin(G.time * (this.def.walk / 22)); this.target = ph > 0 ? 'walk1' : 'walk2'; this.speed = 9; break; }
      case 'attack': {
        const m = this.move;
        if (this.t >= m.st && this.target === this.movePoses[0]) { this.target = this.movePoses[1]; this.speed = 34; if (m.sfx === 'slash') Audio.sfx('slash'); }
        if (this.t >= m.st && this.t < m.st + m.act && !this.hitDone) G.tryHit(this, foe, m);
        if (this.t >= m.st + m.act) this.speed = 9;
        if (this.t >= m.st + m.act + m.rec) this.set('idle', this.def.idle[0], 10);
        break;
      }
      case 'fireball':
        if (this.t > 0.2 && this.target === 'chargeS') { this.target = 'chargeH'; this.speed = 30; G.spawnFire(this); }
        if (this.t > 0.55) this.set('idle', this.def.idle[0], 8);
        break;
      case 'dash':
        if (this.t > 0.1 && this.t < 0.42) {
          this.target = 'dash'; this.speed = 30; this.vx = this.face * 980;
          if (Math.random() < 0.8) FX.add({ x: this.x - this.face * 20, y: Stages.GROUND - 120 + Math.random() * 60, vx: -this.face * 200, life: 0.25, size: 3, col: '#e8f0ff', kind: 'spark' });
          if (!this.hitDone && Math.abs(foe.x - this.x) < 112) { G.tryHit(this, foe, MOVES.dash); this.hitDone = true; this.vx = 0; this.t = Math.max(this.t, 0.42); }
        }
        if (this.t >= 0.42) { this.vx *= 0.8; this.target = 'sIdle'; this.speed = 10; }
        if (this.t > 0.62) this.set('idle', this.def.idle[0], 8);
        break;
      case 'hurt':
        if (this.t > this.hurtT) {
          // after a run of hits the enemy shrugs off the next ones and swings back
          const at = this.def.armorAt + (G.diff === 0 ? 2 : G.diff === 2 ? -1 : 0);
          if (!this.human && this.def.moves && G.fighting && this.taken >= at) { this.taken = 0; this.attack(Math.random() < 0.6 ? 'hit' : 'kick', true); this.armor = true; }
          else this.set('idle', this.def.idle[0], 8);
        }
        break;
      case 'parry': if (this.t > 0.22) this.set('idle', this.def.idle[0], 8); break;
      case 'launch': this.pose.rot += dt * -260 * (this.ko ? 1.2 : 1); this.target = 'launch'; this.speed = 6; break;
      case 'down': if (!this.ko && this.t > 0.55) this.set('getup', 'getUp', 6); break;
      case 'getup': if (this.t > 0.35) this.set('idle', this.def.idle[0], 6); break;
      case 'dizzy': { const w = Math.sin(G.time * 3); this.target = 'dizzy'; this.speed = 4; this.pose.lean += w * 0.25; this.pose.head += w * 0.5; break; }
      case 'wheel': {
        const k = Math.min(1, this.t / 0.62);
        this.pose.rot = 360 * k; this.target = 'wheel'; this.speed = 16;
        if (k > 0.45 && !this.hitDone) G.tryHit(this, foe, this.def.moves.wheel);
        if (k >= 1) { this.pose.rot = 0; this.vx = 0; this.set('idle', this.def.idle[0], 10); }
        break;
      }
      case 'flip': this.pose.rot -= dt * 900; if (this.grounded) { this.pose.rot = 0; this.set('idle', this.def.idle[0], 10); } break;
    }
    // physics
    if (!this.grounded) {
      this.vy += 2200 * dt; this.y += this.vy * dt; this.x += this.vx * dt;
      if (this.y >= 0) {
        this.y = 0; this.vy = 0; this.grounded = true;
        if (this.state === 'launch') { this.set('down', 'down', 12); this.pose.rot = -88; this.vx *= 0.3; Audio.sfx('fall'); FX.dust(this.x, Stages.GROUND, 14); FX.shake = Math.max(FX.shake, 8); }
        else if (this.state === 'jump' || this.state === 'jumpKick') { this.set('idle', this.def.idle[0], 12); this.vx = 0; Audio.sfx('land'); FX.dust(this.x, Stages.GROUND, 5); }
        else if (this.state === 'thrown') { this.set('down', 'down', 12); }
      }
    } else {
      this.x += this.vx * dt;
      if (!['walk', 'block', 'dash', 'wheel'].includes(this.state) || (this.state === 'dash' && this.t >= 0.42)) this.vx *= Math.exp(-9 * dt);
    }
    if (this.state === 'down' && !this.scripted) this.pose.rot += (-88 - this.pose.rot) * Math.min(1, dt * 12);
    const tgt = P[this.target] || P.idle;
    Rig.lerpPose(this.pose, tgt, Math.min(1, dt * this.speed), this.state === 'launch' || this.state === 'flip' || this.state === 'wheel' || this.state === 'down' || this.freeRot);
  }

  /* -------------------------------------------------------- render */
  solve() { this.J = Rig.solve(this, Stages.GROUND); return this.J; }
  draw(ctx, stage, dt, opts) { Retro.wrap(ctx, c => this.drawRaw(c, stage, dt, opts)); }
  drawRaw(ctx, stage, dt, opts) {
    const J = this.solve();
    opts = Object.assign({ rim: stage.rim, light: stage.light }, opts || {});
    // ground shadow
    const sh = Math.max(0.3, 1 + this.y / 300);
    if (!(Retro.active && Retro.mode === 'blocks')) { ctx.fillStyle = stage.shadow; ctx.beginPath(); ctx.ellipse(this.x, Stages.GROUND + 3, 62 * this.s * sh, 9 * sh, 0, 0, 7); ctx.fill(); }
    for (const R of this.ropes) {
      const a = R.at === 'head' ? Rig.headAnchor(J) : Rig.beltAnchor(J);
      R.r.update(a, dt, -this.face * 0.9 + (stage.wind || 0) - this.vx / 400, this.face);
    }
    if (opts.noHead) for (const R of this.ropes) if (R.at === 'head') R.r.reset();
    for (const R of this.ropes) if (R.at !== 'head' || !opts.noHead) if (R.at === 'belt' && !this.look.shadow) {} else R.r.draw(ctx);
    if (this.look.shadow) {
      ctx.save(); ctx.shadowColor = 'rgba(130,200,255,0.9)'; ctx.shadowBlur = 22 + 8 * Math.sin(performance.now() / 200);
      Rig.draw(ctx, J, opts); ctx.restore();
      if (Math.random() < 0.5) FX.smoke(J.H[0] + (Math.random() - 0.5) * 50, J.H[1] + Math.random() * 60, 'rgba(20,26,50,0.5)');
    } else Rig.draw(ctx, J, opts);
    for (const R of this.ropes) if (R.at === 'belt' && !this.look.shadow) R.r.draw(ctx);
    // steel smear behind a swinging blade
    if (J.blade && this.look.weapon === 'katana') {
      this.trail.push(J.blade[1]); if (this.trail.length > 6) this.trail.shift();
      const swinging = ['attack', 'dash', 'script'].includes(this.state);
      if (swinging && this.trail.length > 2) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath(); ctx.moveTo(J.blade[0][0], J.blade[0][1]);
        for (const p of this.trail) ctx.lineTo(p[0], p[1]);
        ctx.closePath(); ctx.fillStyle = 'rgba(190,215,255,0.28)'; ctx.fill(); ctx.restore();
      }
    } else if (J.blade && this.look.weapon === 'staff' && this.state === 'attack' && this.t > this.move.st - 0.05 && this.t < this.move.st + this.move.act + 0.05) {
      this.trail.push(J.blade[1]); if (this.trail.length > 5) this.trail.shift();
      ctx.save(); ctx.strokeStyle = 'rgba(255,240,210,0.35)'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath();
      this.trail.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.restore();
    } else this.trail.length = 0;
  }
}
