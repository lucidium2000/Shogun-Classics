// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
/* Fighter skeleton, pose library and renderer.
   Angles are in degrees. A limb at 0 hangs straight down and positive values
   swing it toward the way the fighter faces. Arms are measured from the torso,
   legs from vertical. Everything is solved in world space so ribbons, gibs and
   weapon trails can live outside the body. */
const Rig = (() => {
  const R = {};
  const D2R = Math.PI / 180;
  const FIELDS = ['lean', 'head', 'shF', 'elF', 'shB', 'elB', 'hipF', 'knF', 'hipB', 'knB', 'rot', 'wp', 'rootY', 'rootX'];
  const BASE = {}; FIELDS.forEach(k => BASE[k] = 0);
  const P = o => Object.assign({}, BASE, o);

  R.POSES = {
    idle: P({ lean: 8, head: -6, shF: 38, elF: 98, shB: 18, elB: 108, hipF: 20, knF: -16, hipB: -18, knB: -4 }),
    idle2: P({ lean: 11, head: -4, shF: 42, elF: 94, shB: 22, elB: 104, hipF: 22, knF: -24, hipB: -16, knB: -14 }),
    walk1: P({ lean: 12, head: -6, shF: 30, elF: 100, shB: 22, elB: 104, hipF: 32, knF: -10, hipB: -22, knB: -30 }),
    walk2: P({ lean: 12, head: -6, shF: 40, elF: 96, shB: 14, elB: 108, hipF: -8, knF: -34, hipB: 20, knB: -6 }),
    block: P({ lean: -4, head: 6, shF: 68, elF: 100, shB: 52, elB: 112, hipF: 16, knF: -18, hipB: -22, knB: -6 }),
    crouch: P({ lean: 26, head: -16, shF: 40, elF: 104, shB: 24, elB: 112, hipF: 80, knF: -128, hipB: 14, knB: -122 }),
    jump: P({ lean: 10, head: -6, shF: 50, elF: 90, shB: 30, elB: 100, hipF: 80, knF: -110, hipB: 30, knB: -110 }),
    jumpKick: P({ lean: -16, head: -2, shF: -10, elF: 80, shB: 60, elB: 60, hipF: 96, knF: -4, hipB: 10, knB: -100 }),
    punchS: P({ lean: 4, head: -6, shF: 20, elF: 120, shB: 30, elB: 104, hipF: 18, knF: -14, hipB: -22, knB: -6 }),
    punchH: P({ lean: 18, head: -6, shF: 92, elF: 2, shB: -10, elB: 110, hipF: 26, knF: -10, hipB: -26, knB: -4, rootX: 6 }),
    cross: P({ lean: 22, head: -6, shF: 10, elF: 110, shB: 92, elB: 4, hipF: 24, knF: -12, hipB: -30, knB: -2, rootX: 8 }),
    upperS: P({ lean: 28, head: -14, shF: -14, elF: 70, shB: 30, elB: 110, hipF: 78, knF: -124, hipB: 10, knB: -118 }),
    upperH: P({ lean: -8, head: -18, shF: 168, elF: 6, shB: 0, elB: 70, hipF: 14, knF: -6, hipB: -26, knB: -16, rootX: 6 }),
    kickS: P({ lean: -6, head: -4, shF: 40, elF: 96, shB: 14, elB: 100, hipF: 70, knF: -110, hipB: -8, knB: -4 }),
    kickH: P({ lean: -22, head: 2, shF: 50, elF: 90, shB: -30, elB: 60, hipF: 96, knF: -4, hipB: -10, knB: -4, rootX: 4 }),
    sweepS: P({ lean: 30, head: -10, shF: 30, elF: 80, shB: 40, elB: 60, hipF: 70, knF: -120, hipB: 20, knB: -120 }),
    wheel: P({ lean: 0, head: 0, shF: -170, elF: 0, shB: -150, elB: 0, hipF: 40, knF: 0, hipB: -40, knB: 0 }),
    sweepH: P({ lean: 36, head: -10, shF: 20, elF: 60, shB: 60, elB: 30, hipF: 86, knF: -6, hipB: 50, knB: -140 }),
    hitHi: P({ lean: -22, head: -26, shF: -20, elF: 60, shB: -30, elB: 70, hipF: 10, knF: -10, hipB: -14, knB: -12, rootX: -6 }),
    hitLo: P({ lean: 30, head: 18, shF: 20, elF: 50, shB: 10, elB: 60, hipF: 20, knF: -30, hipB: -20, knB: -20 }),
    launch: P({ lean: -40, head: -30, shF: -120, elF: 30, shB: -100, elB: 40, hipF: -20, knF: -30, hipB: -40, knB: -40, rot: -20 }),
    down: P({ lean: 0, head: 10, shF: 165, elF: 10, shB: 178, elB: 0, hipF: 28, knF: -34, hipB: 8, knB: -6, rot: -88 }),
    getUp: P({ lean: 40, head: -10, shF: 40, elF: 60, shB: 30, elB: 60, hipF: 90, knF: -130, hipB: 20, knB: -120 }),
    dizzy: P({ lean: -6, head: 18, shF: 6, elF: 20, shB: -6, elB: 24, hipF: 12, knF: -22, hipB: -12, knB: -18 }),
    victory: P({ lean: -2, head: -14, shF: 160, elF: 20, shB: 150, elB: 30, hipF: 16, knF: -4, hipB: -16, knB: -4 }),
    bow: P({ lean: 40, head: 20, shF: 10, elF: 10, shB: 6, elB: 10, hipF: 6, knF: -4, hipB: -6, knB: -4 }),
    chargeS: P({ lean: -10, head: -6, shF: -40, elF: 110, shB: -50, elB: 120, hipF: 30, knF: -40, hipB: -30, knB: -20 }),
    chargeH: P({ lean: 16, head: -4, shF: 96, elF: 6, shB: 86, elB: 10, hipF: 34, knF: -20, hipB: -34, knB: -6, rootX: 6 }),
    // Shōkei's sword work
    sIdle: P({ lean: 8, head: -6, shF: 46, elF: 70, shB: 30, elB: 100, hipF: 20, knF: -16, hipB: -18, knB: -4, wp: 40 }),
    sIdle2: P({ lean: 10, head: -4, shF: 48, elF: 66, shB: 32, elB: 96, hipF: 22, knF: -24, hipB: -16, knB: -14, wp: 44 }),
    slashS: P({ lean: -6, head: -6, shF: 150, elF: 40, shB: 40, elB: 100, hipF: 18, knF: -14, hipB: -22, knB: -6, wp: 30 }),
    slashH: P({ lean: 22, head: -4, shF: 70, elF: 10, shB: 20, elB: 90, hipF: 28, knF: -10, hipB: -28, knB: -4, wp: 10, rootX: 8 }),
    sUpperS: P({ lean: 30, head: -12, shF: -20, elF: 10, shB: 10, elB: 90, hipF: 80, knF: -126, hipB: 14, knB: -120, wp: 30 }),
    sUpperH: P({ lean: -10, head: -18, shF: 170, elF: 0, shB: 10, elB: 60, hipF: 14, knF: -6, hipB: -26, knB: -16, wp: 0, rootX: 6 }),
    dash: P({ lean: 34, head: -20, shF: 96, elF: 0, shB: -40, elB: 40, hipF: 60, knF: -60, hipB: -50, knB: -30, wp: 0 }),
    thrust: P({ lean: 26, head: -14, shF: 88, elF: 0, shB: 60, elB: 30, hipF: 44, knF: -40, hipB: -40, knB: -10, wp: 0, rootX: 6 }),
    cleaveS: P({ lean: -14, head: -16, shF: 190, elF: 10, shB: 170, elB: 20, hipF: 24, knF: -20, hipB: -24, knB: -10, wp: 0 }),
    cleaveH: P({ lean: 34, head: 0, shF: 60, elF: 0, shB: 50, elB: 10, hipF: 46, knF: -60, hipB: -40, knB: -20, wp: 0 }),
    sVictory: P({ lean: -2, head: -16, shF: 176, elF: 4, shB: 20, elB: 40, hipF: 16, knF: -4, hipB: -16, knB: -4, wp: 0 }),
    // Yamana's staff
    yIdle: P({ lean: 6, head: -4, shF: 40, elF: 70, shB: 50, elB: 80, hipF: 22, knF: -20, hipB: -22, knB: -6, wp: 70 }),
    yIdle2: P({ lean: 8, head: -2, shF: 44, elF: 66, shB: 54, elB: 76, hipF: 24, knF: -28, hipB: -20, knB: -14, wp: 74 }),
    staffS: P({ lean: -14, head: -6, shF: 160, elF: 10, shB: 150, elB: 30, hipF: 20, knF: -14, hipB: -24, knB: -6, wp: 70 }),
    staffH: P({ lean: 26, head: -2, shF: 80, elF: 0, shB: 70, elB: 10, hipF: 34, knF: -16, hipB: -30, knB: -4, wp: 6, rootX: 10 }),
    // Frill
    fIdle: P({ lean: 4, head: 4, shF: 24, elF: 40, shB: 10, elB: 40, hipF: 12, knF: -10, hipB: -12, knB: -4 }),
    fIdle2: P({ lean: 6, head: 8, shF: 28, elF: 46, shB: 14, elB: 46, hipF: 14, knF: -14, hipB: -10, knB: -8 }),
    parry: P({ lean: -10, head: -4, shF: 120, elF: 60, shB: 30, elB: 90, hipF: 18, knF: -18, hipB: -22, knB: -6 }),
    grab: P({ lean: 20, head: -6, shF: 120, elF: 20, shB: 110, elB: 30, hipF: 24, knF: -16, hipB: -24, knB: -6 }),
    slam: P({ lean: 50, head: 10, shF: 30, elF: 10, shB: 20, elB: 20, hipF: 50, knF: -60, hipB: -40, knB: -20 }),
    blastS: P({ lean: -12, head: -10, shF: -60, elF: 130, shB: -70, elB: 130, hipF: 20, knF: -30, hipB: -30, knB: -10 }),
    blastH: P({ lean: 14, head: 0, shF: 92, elF: 0, shB: 84, elB: 6, hipF: 30, knF: -20, hipB: -34, knB: -4, rootX: 4 }),
    carry: P({ lean: -4, head: -16, shF: 170, elF: 10, shB: 165, elB: 14, hipF: 18, knF: -10, hipB: -18, knB: -6 }),
    heldUp: P({ lean: 0, head: 0, shF: -150, elF: 0, shB: -150, elB: 0, hipF: 10, knF: 0, hipB: -10, knB: 0, rot: -90 }),
    thrown: P({ lean: 0, head: 20, shF: -160, elF: 20, shB: -140, elB: 30, hipF: 30, knF: -40, hipB: -10, knB: -20, rot: 120 }),
    impaled: P({ lean: 0, head: 40, shF: -60, elF: 20, shB: -80, elB: 30, hipF: 20, knF: -30, hipB: -20, knB: -40, rot: -84 }),
    kneel: P({ lean: 20, head: 30, shF: 10, elF: 10, shB: 4, elB: 10, hipF: 80, knF: -150, hipB: 80, knB: -150 }),
  };

  R.blank = () => Object.assign({}, R.POSES.idle);
  R.copy = p => Object.assign({}, p);
  R.lerpPose = (cur, tgt, k, skipRot) => { for (const f of FIELDS) if (f !== 'rot' || !skipRot) cur[f] += ((tgt[f] || 0) - cur[f]) * k; };
  R.mix = (a, b, k) => { const o = {}; for (const f of FIELDS) o[f] = (a[f] || 0) * (1 - k) + (b[f] || 0) * k; return o; };

  /* -------------------------------------------------------------- looks */
  const shade = (hex, k) => {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(Math.min(255, r * k)); g = Math.round(Math.min(255, g * k)); b = Math.round(Math.min(255, b * k));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };
  R.shade = shade;

  R.LOOKS = {
    keero: {
      // wandering swordsman (Chris's reference): topknot, white face cloth, red kimono over a blue under-collar,
      // grey hakama, purple wrist and shin wraps tied with white cord, blue straw sandals, katana
      name: 'KEERO', s: 1, skin: '#c48a5e', gi: '#c23a22', pants: '#6f6f6c', sleeve: 'full', fore: '#c23a22', hand: '#c48a5e',
      belt: '#4a4744', band: null, hair: '#14100e', hairStyle: 'topknot', faceCloth: '#ece7dc', lapel: '#e07a2e', inner: '#2b3c86',
      wrap: '#4b34a8', shin: '#4b34a8', feet: '#3d6fae', hakama: true, noTail: true,
      shW: 42, waist: 32, limb: 1, weapon: 'katana',
    },
    shokei: {
      // ronin samurai: indigo kimono, black lacquered dō laced in blue, kusazuri, grey hakama, topknot
      name: 'SHŌKEI', s: 1, skin: '#c08660', gi: '#1b1a1d', pants: '#4a4c55', sleeve: 'elbow', fore: '#232c48', hand: '#c08660',
      belt: '#e8e2d4', band: null, hair: '#0e0b0a', hairStyle: 'topknot', cord: '#f2eee4', sode: '#16130f',
      armor: '#6f8fcf', robe: '#2f3e66', inner: '#e8e2d4',
      shW: 42, waist: 32, limb: 1, weapon: 'katana',
    },
    wanfu: {
      // Shogun II look: horned black oni mask, lacquered dō and sode over a bare tanned frame,
      // shimenawa rope belt with paper shide, olive shorts, leather bracers, bare shins
      name: "WAN'FU", s: 1.2, skin: '#a2714f', gi: '#24241f', pants: '#3e3024', shin: '#2a231d', headS: 1.32, sleeve: 'none', fore: '#1f1a16', hand: '#a2714f',
      belt: '#ddd3b6', rope: true, band: null, hair: '#0e0d0d', hairStyle: 'masked', mask: '#1f1e21', oni: true, horn: '#b8a46c', sode: '#26261f', sodeR: 17, armor: '#5a4630', belly: true,
      shW: 66, waist: 62, limb: 1.45, weapon: null,
    },
    yamana: {
      name: 'YAMANA', s: 1.07, skin: '#b98258', gi: '#4d5838', pants: '#7d7d6e', sleeve: 'full', fore: '#4d5838', hand: '#b98258',
      belt: '#2a2a22', band: null, hair: null, hairStyle: 'bald', shW: 40, waist: 28, limb: 0.85, weapon: 'staff', wraps: '#d6cdb6',
    },
    frill: {
      name: 'FRILL', s: 1.05, skin: '#0b0e16', gi: '#0d1120', pants: '#0a0d18', sleeve: 'full', fore: '#0d1120', hand: '#1a2236',
      // a woman (Chris, 2026-10-31): long black hair streaming behind her, face in shadow, glowing eyes
      belt: '#1d2a44', band: null, hair: '#05070c', hairStyle: 'long', longHair: '#1c2850', eyes: '#d9f3ff', shadow: true,
      shW: 44, waist: 30, limb: 0.95, weapon: null, rimCol: '#9fdcff',
    },
  };
  R.SIZE = { th: 50, sh: 50, to: 66, nk: 9, hr: 16, ua: 36, fa: 34 };

  /* -------------------------------------------------------------- solve */
  // f: { x, y (feet, 0=ground, negative up), face, pose, look, grounded }
  R.solve = function (f, groundY) {
    const L = f.look, s = L.s, Z = R.SIZE, p = f.pose, face = f.face;
    const v = a => [Math.sin(a), Math.cos(a)]; // 0 = down
    const lean = p.lean * D2R, up = [Math.sin(lean), -Math.cos(lean)];
    const pts = {};
    pts.H = [0, 0];
    const to = Z.to * s * (L.belly ? 1.05 : 1);
    pts.N = [up[0] * to, up[1] * to];
    pts.S = [up[0] * (to - 6 * s), up[1] * (to - 6 * s)];
    const ha = lean + p.head * D2R;
    pts.Hd = [pts.N[0] + Math.sin(ha) * (Z.nk + Z.hr) * s, pts.N[1] - Math.cos(ha) * (Z.nk + Z.hr) * s];
    const nrm = [Math.cos(lean), Math.sin(lean)];
    const arm = (sh, el, key) => {
      const off = (key === 'F' ? 0.3 : -0.18) * L.shW * s / 2;
      const So = [pts.S[0] + nrm[0] * off, pts.S[1] + nrm[1] * off + (key === 'F' ? 2 : -1) * s];
      pts['S' + key] = So;
      const u = lean + sh * D2R, e = v(u); const E = [So[0] + e[0] * Z.ua * s, So[1] + e[1] * Z.ua * s];
      const fa = u + el * D2R, g = v(fa); const Hn = [E[0] + g[0] * Z.fa * s, E[1] + g[1] * Z.fa * s];
      pts['E' + key] = E; pts['W' + key] = Hn; pts['fa' + key] = fa;
    };
    arm(p.shF, p.elF, 'F'); arm(p.shB, p.elB, 'B');
    const leg = (hp, kn, key) => {
      const t = hp * D2R, e = v(t); const K = [e[0] * Z.th * s, e[1] * Z.th * s];
      const sa = t + kn * D2R, g = v(sa); const F = [K[0] + g[0] * Z.sh * s, K[1] + g[1] * Z.sh * s];
      pts['K' + key] = K; pts['F' + key] = F; pts['sa' + key] = sa;
    };
    leg(p.hipF, p.knF, 'F'); leg(p.hipB, p.knB, 'B');
    // whole-body rotation about the hip
    const r = p.rot * D2R, cr = Math.cos(r), sr = Math.sin(r);
    const keys = ['H', 'N', 'S', 'SF', 'SB', 'Hd', 'EF', 'WF', 'EB', 'WB', 'KF', 'FF', 'KB', 'FB'];
    for (const k of keys) { const [x, y] = pts[k]; pts[k] = [x * cr - y * sr, x * sr + y * cr]; }
    // rest on the ground: the lowest body point touches y = 0
    let maxY;
    if (f.grounded) {
      maxY = -1e9;
      if (Math.abs(p.rot) > 40) {
        // lying down: rest on the outside of the body, not its centre line, so the back touches the floor
        const lw = L.limb || 1, bw = L.shW * s * 0.4;
        maxY = Math.max(pts.H[1] + bw, pts.N[1] + bw, pts.Hd[1] + Z.hr * s * (L.headS || 1));
        for (const k of ['KF', 'KB']) maxY = Math.max(maxY, pts[k][1] + 11 * s * lw);
        for (const k of ['FF', 'FB']) maxY = Math.max(maxY, pts[k][1] + 6 * s);
        for (const k of ['WF', 'WB', 'EF', 'EB']) maxY = Math.max(maxY, pts[k][1] + 7 * s * lw);
        maxY -= 2 * s;
      } else {
        for (const k of ['FF', 'FB', 'KF', 'KB', 'H', 'N']) maxY = Math.max(maxY, pts[k][1]);
        maxY = Math.max(maxY, pts.Hd[1] + Z.hr * s * 0.9);
        maxY += 4 * s;
      }
    } else maxY = (Z.th + Z.sh) * s * 0.96;
    const ox = f.x + face * (p.rootX || 0), oy = groundY + f.y - maxY + (f.grounded ? 0 : (p.rootY || 0));
    const J = { face, s, look: L, lean: lean, headA: ha, rot: r, wp: p.wp * D2R };
    for (const k of keys) J[k] = [ox + face * pts[k][0], oy + pts[k][1]];
    J.faF = pts.faF + r; J.faB = pts.faB + r; J.saF = pts.saF + r; J.saB = pts.saB + r;
    J.torsoA = lean + r;
    return J;
  };

  /* ------------------------------------------------------------ drawing */
  function capsule(ctx, a, ra, b, rb) {
    const dx = b[0] - a[0], dy = b[1] - a[1], ang = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.arc(a[0], a[1], ra, ang + Math.PI / 2, ang + Math.PI * 1.5);
    ctx.arc(b[0], b[1], rb, ang - Math.PI / 2, ang + Math.PI / 2);
    ctx.closePath();
  }
  R.capsule = capsule;

  // A drawing pass: mode 'rim' paints everything flat in the rim colour,
  // 'ink' paints outlines, 'fill' paints the real colours.
  function part(ctx, mode, col, build, rim, inkW) {
    build();
    if (mode === 'rim') { ctx.fillStyle = rim; ctx.fill(); }
    else if (mode === 'ink') { ctx.lineWidth = inkW; ctx.strokeStyle = 'rgba(8,6,6,0.85)'; ctx.stroke(); }
    else { ctx.fillStyle = col; ctx.fill(); }
  }
  function torsoFill(ctx, J, L, n, col) {
    const s = J.s, w = L.shW * s / 2 + 6, c = [(J.S[0] + J.H[0]) / 2, (J.S[1] + J.H[1]) / 2];
    const g = ctx.createLinearGradient(c[0] - n[0] * w, c[1] - n[1] * w, c[0] + n[0] * w, c[1] + n[1] * w);
    g.addColorStop(0, shade(col, 0.62)); g.addColorStop(0.45, shade(col, 0.9)); g.addColorStop(0.8, col); g.addColorStop(1, shade(col, 1.08));
    return g;
  }

  // opts: { noHead, only: 'upper'|'lower', rim, light (+1/-1), alpha, flash }
  R.draw = function (ctx, J, opts) {
    opts = opts || {};
    const L = J.look, s = J.s, Z = R.SIZE, face = J.face, lw = L.limb;
    const rim = opts.rim || L.rimCol || '#ffd9a0';
    const lx = (opts.light || 1) * 2.4, ly = -1.6;
    const upper = opts.only !== 'lower', lower = opts.only !== 'upper';
    const dark = k => c => c && shade(c, k);
    const back = dark(0.62), mid = dark(0.86);
    const pantsC = L.pants, giC = L.gi || L.skin;
    const loose = L.gi && !L.shadow ? (L.sohei || L.armor || L.hakama ? 1.3 : 1.15) : 1;
    const thighR = 12.5 * s * lw * loose, shinR = 9.5 * s * lw * loose, uaR = 8.4 * s * lw, faR = 7 * s * lw;
    const tn = J.torsoA;
    const n = [Math.cos(tn) * face, Math.sin(tn)]; // torso "forward" normal in world space
    const segs = [];
    // back arm
    if (upper) {
      segs.push({ c: back(L.sleeve === 'none' ? L.skin : (L.robe || giC)), f: () => capsule(ctx, J.SB, uaR * 1.05, J.EB, uaR * 0.92) });
      segs.push({ c: back(L.sleeve === 'full' ? giC : L.fore), f: () => capsule(ctx, J.EB, faR, J.WB, faR * 0.85) });
      if (L.wrap) segs.push({ c: back(L.wrap), f: () => capsule(ctx, lerp2(J.EB, J.WB, 0.5), faR * 0.92, J.WB, faR * 0.85) });
      segs.push({ c: back(L.hand), f: () => { ctx.beginPath(); ctx.arc(J.WB[0], J.WB[1], faR * 1.15, 0, 7); } });
    }
    if (lower) {
      segs.push({ c: back(pantsC), f: () => capsule(ctx, J.H, thighR, J.KB, shinR * 1.1) });
      segs.push({ c: back(L.shin || pantsC), f: () => capsule(ctx, J.KB, shinR * 1.05, ankle(J.KB, J.FB, s), shinR * 0.85) });
      segs.push({ c: back(L.feet || L.skin), f: () => foot(ctx, J.FB, J.saB, face, s) });
      segs.push({ c: mid(pantsC), f: () => capsule(ctx, J.H, thighR, J.KF, shinR * 1.1) });
      segs.push({ c: mid(L.shin || pantsC), f: () => capsule(ctx, J.KF, shinR * 1.05, ankle(J.KF, J.FF, s), shinR * 0.85) });
      segs.push({ c: L.feet || L.skin, f: () => foot(ctx, J.FF, J.saF, face, s) });
    }
    if (upper) {
      segs.push({ c: giC, f: () => torso(ctx, J, L, n), torso: true });
      if (L.mawashi) segs.push({ c: L.mawashi, f: () => mawashi(ctx, J, L, n) });
      if (!opts.noHead) segs.push({ c: L.mask ? L.hair : L.skin, f: () => { ctx.beginPath(); ctx.arc(J.Hd[0], J.Hd[1], Z.hr * s * (L.headS || 1), 0, 7); }, head: true, norim: !!L.mask });
      if (L.sode) segs.push({ c: L.sode, f: () => { capsule(ctx, J.SF, (L.sodeR || 12) * s, [J.SF[0] + (J.EF[0] - J.SF[0]) * 0.5, J.SF[1] + (J.EF[1] - J.SF[1]) * 0.5], ((L.sodeR || 12) + 1) * s); } });
      segs.push({ c: L.sleeve === 'none' ? L.skin : (L.robe || giC), f: () => capsule(ctx, J.SF, uaR * 1.08, J.EF, uaR * 0.95) });
      segs.push({ c: L.sleeve === 'full' ? giC : L.fore, f: () => capsule(ctx, J.EF, faR, J.WF, faR * 0.85) });
      if (L.wrap) segs.push({ c: L.wrap, f: () => capsule(ctx, lerp2(J.EF, J.WF, 0.5), faR * 0.92, J.WF, faR * 0.85) });
      segs.push({ c: L.hand, f: () => { ctx.beginPath(); ctx.arc(J.WF[0], J.WF[1], faR * 1.2, 0, 7); } });
    }
    ctx.save();
    if (opts.alpha != null) ctx.globalAlpha = opts.alpha;
    // weapon behind body when it sits in the back hand: none do, so draw after
    const blocky = typeof Retro !== 'undefined' && Retro.active && Retro.mode === 'blocks'; // rim light turns into stray block edges
    for (const mode of blocky ? ['ink', 'fill'] : ['rim', 'ink', 'fill']) {
      if (mode === 'rim') { ctx.save(); ctx.translate(lx, ly); }
      for (const g of segs) if (!(mode === 'rim' && g.norim)) part(ctx, mode, mode === 'fill' && g.torso ? torsoFill(ctx, J, L, n, g.c) : g.c, g.f, rim, 3.2);
      if (mode === 'rim') ctx.restore();
    }
    if (upper) {
      torsoDetail(ctx, J, L, n);
      if (L.wrap) cords(ctx, J, L);
      if (!opts.noHead) head(ctx, J, L, opts);
      if (L.weapon) weapon(ctx, J, L, opts);
    }
    if (lower && L.belt && !L.gi && L.belly) beltDetail(ctx, J, L, n);
    if (opts.flash) {
      ctx.globalCompositeOperation = 'source-atop';
    }
    ctx.restore();
  };

  // the pant leg stops above the ankle so the foot shows below it and points forward
  function ankle(K, F, s) {
    const dx = K[0] - F[0], dy = K[1] - F[1], l = Math.hypot(dx, dy) || 1, k = Math.min(0.45, 11 * s / l);
    return [F[0] + dx * k, F[1] + dy * k];
  }
  function lerp2(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  // white cord tied around the wrist and shin wraps
  function cords(ctx, J, L) {
    const s = J.s; ctx.strokeStyle = '#f2efe8'; ctx.lineWidth = 2.2 * s; ctx.lineCap = 'round';
    const tie = (A, B, t, w) => { const p = lerp2(A, B, t), dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * w, ny = dx / l * w; ctx.beginPath(); ctx.moveTo(p[0] - nx, p[1] - ny); ctx.lineTo(p[0] + nx, p[1] + ny); ctx.stroke(); };
    tie(J.EF, J.WF, 0.62, 7 * s); tie(J.EF, J.WF, 0.8, 6.5 * s);
    for (const k of ['F', 'B']) { const A = ankle(J['K' + k], J['F' + k], s); tie(J['K' + k], A, 0.15, 10 * s); tie(J['K' + k], A, 0.85, 9 * s); }
  }
  function foot(ctx, F, sa, face, s) {
    ctx.beginPath();
    ctx.ellipse(F[0] + face * 8 * s, F[1] - 3 * s, 13 * s, 5.5 * s, 0, 0, 7);
    ctx.moveTo(F[0] + 5 * s, F[1] - 10 * s); ctx.ellipse(F[0], F[1] - 9 * s, 5.5 * s, 7 * s, 0, 0, 7);
  }

  function torso(ctx, J, L, n) {
    const s = J.s, sw = L.shW * s / 2, ww = L.waist * s / 2;
    const S = J.S, H = J.H;
    const u = [S[0] - H[0], S[1] - H[1]], ul = Math.hypot(u[0], u[1]); u[0] /= ul; u[1] /= ul;
    const P = (a, b) => [S[0] + n[0] * a + u[0] * b, S[1] + n[1] * a + u[1] * b];
    const Hb = [H[0] - u[0] * 6 * s, H[1] - u[1] * 6 * s];
    const top = P(0, 7 * s), fs = P(sw * 0.8, 2 * s), bs = P(-sw * 0.8, 2 * s);
    const chest = P(sw * (L.belly ? 1.1 : 1.0), -ul * 0.32), belly = [Hb[0] + n[0] * (ww + (L.belly ? 22 * s : 2 * s)) + u[0] * ul * 0.3, Hb[1] + n[1] * (ww + (L.belly ? 22 * s : 2 * s)) + u[1] * ul * 0.3];
    const backC = P(-sw * 0.95, -ul * 0.4);
    ctx.beginPath();
    ctx.moveTo(bs[0], bs[1]);
    ctx.quadraticCurveTo(top[0], top[1], fs[0], fs[1]);
    ctx.quadraticCurveTo(chest[0] + n[0] * 4 * s, chest[1] + n[1] * 4 * s, chest[0], chest[1]);
    ctx.quadraticCurveTo(belly[0], belly[1], Hb[0] + n[0] * ww, Hb[1] + n[1] * ww);
    ctx.lineTo(Hb[0] - n[0] * ww, Hb[1] - n[1] * ww);
    ctx.quadraticCurveTo(backC[0], backC[1], bs[0], bs[1]);
    ctx.closePath();
  }

  function mawashi(ctx, J, L, n) {
    const s = J.s, w = L.waist * s / 2 + 4, u = [J.S[0] - J.H[0], J.S[1] - J.H[1]], ul = Math.hypot(u[0], u[1]); u[0] /= ul; u[1] /= ul;
    const p = (a, b) => [J.H[0] + n[0] * a * s + u[0] * b * s, J.H[1] + n[1] * a * s + u[1] * b * s];
    const pts = [p(w / s, 18), p(-w / s, 16), p(-w / s * 0.7, -12), p(0, -6), p(w / s * 0.8, -14)];
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (const q of pts.slice(1)) ctx.lineTo(q[0], q[1]); ctx.closePath();
  }
  function torsoDetail(ctx, J, L, n) {
    const s = J.s, S = J.S, H = J.H, N = J.N;
    const along = (t, off) => [S[0] + (H[0] - S[0]) * t + n[0] * off * s, S[1] + (H[1] - S[1]) * t + n[1] * off * s];
    ctx.lineCap = 'round';
    if (L.gi && L.collar) { // Keero's black V collar and crest
      ctx.strokeStyle = L.collar; ctx.lineWidth = 3.4 * s;
      const a = along(0.04, 11), b = along(0.36, 7), c = along(0.04, 0);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke();
      const cr = along(0.3, 15); ctx.fillStyle = L.crest; ctx.beginPath(); ctx.arc(cr[0], cr[1], 3 * s, 0, 7); ctx.fill();
    }
    if (L.lapel) { // kimono crossing: blue under-collar in a V, edged by the lighter lapel band
      const a = along(0.0, 12), b = along(0.42, 3), c = along(0.0, -5);
      ctx.strokeStyle = L.inner; ctx.lineWidth = 6 * s; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke();
      const a2 = along(0.0, 16), b2 = along(0.5, 4), c2 = along(0.0, -9);
      ctx.strokeStyle = L.lapel; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(a2[0], a2[1]); ctx.lineTo(b2[0], b2[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke();
      const sh = along(0.2, -14), sh2 = along(0.75, -10); // a fold of shade down the back
      ctx.strokeStyle = 'rgba(80,10,5,0.45)'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.moveTo(sh[0], sh[1]); ctx.lineTo(sh2[0], sh2[1]); ctx.stroke();
    }
    if (L.sohei) { // grey shawl over the shoulders, white collar, big dark juzu beads
      const sw = L.shW / 2;
      const p1 = along(-0.08, sw * 1.25), p2 = along(0.5, sw * 1.15), p3 = along(0.58, 0), p4 = along(0.5, -sw * 1.2), p5 = along(-0.08, -sw * 1.25);
      ctx.fillStyle = L.shawl; ctx.strokeStyle = 'rgba(8,6,6,0.85)'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]); ctx.quadraticCurveTo(p4[0], p4[1], p5[0], p5[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1.2;
      for (const o of [6, -6]) { const q1 = along(0.05, o), q2 = along(0.36, o * 0.5); ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke(); }
      ctx.strokeStyle = '#ece6da'; ctx.lineWidth = 3.5 * s;
      let a = along(0.02, 9), b = along(0.2, 3), c = along(0.02, -3);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke();
      ctx.fillStyle = L.beads; ctx.strokeStyle = 'rgba(255,240,220,0.25)'; ctx.lineWidth = 1;
      for (let i = 0; i <= 8; i++) { const k = i / 8; const p = along(0.06 + Math.sin(k * Math.PI) * 0.36, sw * 0.95 - k * sw * 1.9); ctx.beginPath(); ctx.arc(p[0], p[1], 4.6 * s, 0, 7); ctx.fill(); }
      // sash knot
      ctx.fillStyle = L.belt; const kn = along(0.93, 10); ctx.beginPath(); ctx.arc(kn[0], kn[1], 3.4 * s, 0, 7); ctx.fill();
    }
    if (L.armor) { // lacquered dō: white robe collar, red lacing rows, beads
      let a = along(0.0, 12), b = along(0.3, 4), c = along(0.0, -4);
      if (L.inner || L.robe) { ctx.strokeStyle = L.inner || L.robe; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); }
      ctx.strokeStyle = L.armor; ctx.lineWidth = 3.2 * s;
      for (const k of [0.4, 0.58, 0.76]) {
        const w = (L.shW * (1 - k * 0.35)) / 2;
        a = along(k, w * 0.9); b = along(k, -w * 0.85);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        for (const i of [-1, 1]) { const p = along(k + 0.08, i * w * 0.45); ctx.beginPath(); ctx.moveTo(p[0], p[1]); const q = along(k, i * w * 0.45); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
      }
      // kusazuri skirt plates under the sash
      ctx.fillStyle = '#16110f'; ctx.strokeStyle = L.armor; ctx.lineWidth = 2.6 * s;
      for (const off of [10, -2, -14]) {
        const p1 = along(0.96, off + 6), p2 = along(0.96, off - 6), p3 = along(1.32, off - 7), p4 = along(1.32, off + 7);
        ctx.beginPath(); ctx.moveTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); ctx.lineTo(p3[0], p3[1]); ctx.lineTo(p4[0], p4[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      if (L.beads) {
      ctx.fillStyle = L.beads;
      for (let i = 0; i <= 9; i++) { const k = i / 9; const p = along(0.04 + Math.sin(k * Math.PI) * 0.3, 12 - k * 20); ctx.beginPath(); ctx.arc(p[0], p[1], 2.6 * s, 0, 7); ctx.fill(); }
      ctx.fillStyle = '#e8e0d0'; const big = along(0.34, 2); ctx.beginPath(); ctx.arc(big[0], big[1], 3.4 * s, 0, 7); ctx.fill();
      }
    }
    if (L.trim) { // Shōkei's white lapel trim
      ctx.strokeStyle = L.trim; ctx.lineWidth = 3 * s;
      const a = along(0.0, 10), b = along(0.62, 4);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    if (L.mask) { // Wan'fu: chest hair shadow, iron forearm bands
      ctx.strokeStyle = 'rgba(40,20,10,0.35)'; ctx.lineWidth = 2;
      const a = along(0.25, 4), b = along(0.55, 18);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(b[0], a[1], b[0], b[1]); ctx.stroke();
      ctx.strokeStyle = '#8a8b92'; ctx.lineWidth = 2.5;
      for (const k of ['F']) for (let i = 0.25; i < 0.9; i += 0.3) {
        const e = J['E' + k], w = J['W' + k]; const p = [e[0] + (w[0] - e[0]) * i, e[1] + (w[1] - e[1]) * i];
        const ang = Math.atan2(w[1] - e[1], w[0] - e[0]) + Math.PI / 2;
        ctx.beginPath(); ctx.moveTo(p[0] - Math.cos(ang) * 9, p[1] - Math.sin(ang) * 9); ctx.lineTo(p[0] + Math.cos(ang) * 9, p[1] + Math.sin(ang) * 9); ctx.stroke();
      }
    }
    if (L.shadow) { // Frill: cold veins of light
      ctx.strokeStyle = 'rgba(160,220,255,0.35)'; ctx.lineWidth = 1.4;
      const a = along(0.1, 2), b = along(0.6, 10), c = along(0.9, -4);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1]); ctx.stroke();
    }
    // belt across the hips
    if (L.rope) { // shimenawa: a fat twisted straw rope with zigzag paper shide hanging in front
      const w = L.waist * s / 2 + 6, a = along(0.88, w / s), b = along(0.92, -w / s);
      ctx.strokeStyle = 'rgba(8,6,6,0.85)'; ctx.lineWidth = 15 * s; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.strokeStyle = L.belt; ctx.lineWidth = 12 * s; ctx.stroke();
      ctx.strokeStyle = 'rgba(120,100,60,0.75)'; ctx.lineWidth = 1.8 * s;
      for (let k = 0.1; k < 0.95; k += 0.14) { const p = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; const q1 = along(0, 0); ctx.beginPath(); ctx.moveTo(p[0] + 3 * s, p[1] - 5 * s); ctx.lineTo(p[0] - 3 * s, p[1] + 5 * s); ctx.stroke(); }
      ctx.fillStyle = '#efe9d8'; ctx.strokeStyle = 'rgba(8,6,6,0.7)'; ctx.lineWidth = 1.4;
      for (const off of [w / s * 0.55, w / s * 0.1]) {
        const t = along(0.95, off), dn = [(H[0] - S[0]), (H[1] - S[1])], L0 = Math.hypot(dn[0], dn[1]); dn[0] /= L0; dn[1] /= L0;
        const side = [n[0], n[1]], zz = [];
        for (let z = 0; z < 4; z++) { const d0 = 6 * s + z * 9 * s, sx = (z % 2 ? 1 : -1) * 4 * s; zz.push([t[0] + dn[0] * d0 + side[0] * sx, t[1] + dn[1] * d0 + side[1] * sx]); }
        ctx.beginPath(); ctx.moveTo(t[0] - side[0] * 3 * s, t[1] - side[1] * 3 * s);
        for (const q of zz) ctx.lineTo(q[0] - side[0] * 3 * s, q[1] - side[1] * 3 * s);
        for (const q of zz.slice().reverse()) ctx.lineTo(q[0] + side[0] * 3 * s, q[1] + side[1] * 3 * s);
        ctx.lineTo(t[0] + side[0] * 3 * s, t[1] + side[1] * 3 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
    } else if (L.belt) {
      const w = L.waist * s / 2 + 2;
      const a = along(0.9, w / s), b = along(0.9, -w / s);
      ctx.strokeStyle = L.belt; ctx.lineWidth = (L.belly ? 9 : 6) * s;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
  }
  function beltDetail() { /* rope belt handled in torsoDetail */ }

  function head(ctx, J, L, opts) {
    const s = J.s, Z = R.SIZE, [hx, hy] = J.Hd, r = Z.hr * s * (L.headS || 1), face = J.face, a = J.headA + J.rot;
    const fx = Math.cos(a) * face, fy = Math.sin(a); // forward on the face
    const ux = Math.sin(a) * face, uy = -Math.cos(a); // up out of the skull
    ctx.save();
    const at = (th, rr) => [hx + (ux * Math.cos(th * D2R) + fx * Math.sin(th * D2R)) * rr, hy + (uy * Math.cos(th * D2R) + fy * Math.sin(th * D2R)) * rr];
    if (L.hairStyle === 'short' || L.hairStyle === 'topknot') {
      ctx.fillStyle = L.hair; ctx.beginPath();
      for (let th = -130; th <= 60; th += 10) { const q = at(th, r * 1.07); th === -130 ? ctx.moveTo(q[0], q[1]) : ctx.lineTo(q[0], q[1]); }
      const m = at(-20, r * 0.35); ctx.quadraticCurveTo(m[0], m[1], at(-130, r * 1.07)[0], at(-130, r * 1.07)[1]); ctx.fill();
      if (L.hairStyle === 'short') { // a few spikes
        ctx.beginPath(); for (const th of [-110, -80, -50]) { const a1 = at(th, r), a2 = at(th - 25, r * 1.35), a3 = at(th - 30, r); ctx.moveTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1]); ctx.lineTo(a3[0], a3[1]); } ctx.fill();
      }
      if (L.hairStyle === 'topknot') {
        const t0 = at(-25, r * 1.2), tx = t0[0], ty = t0[1];
        ctx.fillStyle = L.hair; ctx.beginPath(); ctx.ellipse(tx, ty, 6.5 * s, 4.5 * s, a - 0.5 * face, 0, 7); ctx.fill();
        if (L.cord) { const c1 = at(-12, r * 1.05), c2 = at(-38, r * 1.12); ctx.strokeStyle = L.cord; ctx.lineWidth = 2.4 * s; ctx.beginPath(); ctx.moveTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke(); }
      }
    }
    if (L.hairStyle === 'hood2') {
      // katō zukin: the cloth wraps the whole head and leaves an opening for the eyes
      ctx.fillStyle = L.hood; ctx.strokeStyle = 'rgba(8,6,6,0.85)'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.arc(hx - fx * 1.5, hy - 1, r * 1.16, 0, 7); ctx.stroke(); ctx.fill();
      const n0 = [hx - ux * r * 0.9 - fx * r * 0.2, hy - uy * r * 0.9 - fy * r * 0.2];
      ctx.beginPath(); ctx.ellipse(n0[0], n0[1], r * 0.95, r * 0.55, a, 0, 7); ctx.fill();
      ctx.fillStyle = L.skin; const ec = [hx + fx * r * 0.55 + ux * r * 0.12, hy + fy * r * 0.55 + uy * r * 0.12];
      ctx.beginPath(); ctx.ellipse(ec[0], ec[1], r * 0.55, r * 0.24, a, 0, 7); ctx.fill();
      ctx.strokeStyle = '#d6cfc0'; ctx.lineWidth = 3 * s; const b1 = at(40, r * 1.12), b2 = at(-40, r * 1.12); ctx.beginPath(); ctx.moveTo(b1[0], b1[1]); ctx.quadraticCurveTo(hx + ux * r * 0.5, hy + uy * r * 0.5, b2[0], b2[1]); ctx.stroke();
      ctx.strokeStyle = 'rgba(150,140,120,0.55)'; ctx.lineWidth = 1.3;
      const f1 = at(95, r * 1.05), f2 = at(-60, r * 1.05); ctx.beginPath(); ctx.moveTo(f1[0], f1[1]); ctx.quadraticCurveTo(hx - ux * r * 0.2, hy - uy * r * 0.2, f2[0], f2[1]); ctx.stroke();
    }
    if (L.hairStyle === 'bald') {
      ctx.fillStyle = 'rgba(255,240,220,0.25)'; ctx.beginPath(); ctx.arc(hx + ux * r * 0.45 - fx * r * 0.2, hy + uy * r * 0.45 - fy * r * 0.2, r * 0.35, 0, 7); ctx.fill();
    }
    if (L.mask) {
      // black oni mask from Shogun II: horns, scowling brow, glinting eyes, fanged grimace, hair plume behind
      const P = (f, u) => [hx + fx * r * f + ux * r * u, hy + fy * r * f + uy * r * u];
      ctx.fillStyle = L.hair; ctx.beginPath(); ctx.arc(hx, hy, r * 1.04, 0, 7); ctx.fill();
      // plume of hair swept back from the crown
      const c0 = P(-0.5, 0.75), c1 = P(-1.35, 1.25), c2 = P(-1.5, 0.45);
      ctx.beginPath(); ctx.moveTo(P(-0.2, 0.95)[0], P(-0.2, 0.95)[1]); ctx.quadraticCurveTo(c1[0], c1[1], c2[0], c2[1]); ctx.quadraticCurveTo(c0[0], c0[1], P(-0.7, 0.3)[0], P(-0.7, 0.3)[1]); ctx.closePath(); ctx.fill();
      const mc = P(0.22, -0.08);
      ctx.fillStyle = L.mask; ctx.strokeStyle = '#050505'; ctx.lineWidth = 2.4 * s;
      ctx.beginPath(); ctx.ellipse(mc[0], mc[1], r * 0.86, r * 1.06, a, 0, 7); ctx.fill(); ctx.stroke();
      // horns curving up and back from the brow
      ctx.fillStyle = L.horn; ctx.strokeStyle = '#050505'; ctx.lineWidth = 1.6 * s;
      for (const [f0, tf, tu] of [[-0.05, -0.35, 1.75], [0.45, 0.35, 1.85]]) {
        const b0 = P(f0 - 0.14, 0.62), b1 = P(f0 + 0.14, 0.66), tip = P(tf, tu), cp = P(f0 + 0.25, 1.35);
        ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.quadraticCurveTo(cp[0], cp[1], tip[0], tip[1]); ctx.quadraticCurveTo(P(f0 + 0.42, 1.2)[0], P(f0 + 0.42, 1.2)[1], b1[0], b1[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      // carved highlights: brow ridge and cheekbones
      ctx.strokeStyle = 'rgba(150,150,160,0.55)'; ctx.lineWidth = 2.6 * s;
      let q1 = P(-0.3, 0.42), q2 = P(0.3, 0.2), q3 = P(0.9, 0.42);
      ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.lineTo(q3[0], q3[1]); ctx.stroke();
      ctx.lineWidth = 1.8 * s; q1 = P(0.0, -0.25); q2 = P(0.62, -0.25); ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke();
      // eyes: dark sockets with a hot glint
      for (const f of [0.0, 0.62]) {
        const e = P(f, 0.08); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(e[0], e[1], r * 0.2, r * 0.1, a, 0, 7); ctx.fill();
        ctx.fillStyle = opts.eyeGlow || '#e8b23a'; ctx.beginPath(); ctx.arc(e[0] + fx * r * 0.05, e[1] + fy * r * 0.05, r * 0.06, 0, 7); ctx.fill();
      }
      // grimace with fangs
      const m0 = P(0.0, -0.6), m1 = P(0.66, -0.6);
      ctx.fillStyle = '#0a0606'; ctx.beginPath(); ctx.ellipse((m0[0] + m1[0]) / 2, (m0[1] + m1[1]) / 2, r * 0.4, r * 0.14, a, 0, 7); ctx.fill();
      ctx.fillStyle = '#e9dcb4';
      for (const f of [0.08, 0.58]) { const t0 = P(f, -0.48), t1 = P(f + 0.06, -0.72), t2 = P(f + 0.13, -0.48); ctx.beginPath(); ctx.moveTo(t0[0], t0[1]); ctx.lineTo(t1[0], t1[1]); ctx.lineTo(t2[0], t2[1]); ctx.closePath(); ctx.fill(); }
    } else if (L.hairStyle === 'long') {
      // long hair: a full mass at the back of the skull, the face set forward, bangs swept over the brow
      ctx.fillStyle = L.longHair; ctx.beginPath(); ctx.ellipse(hx - fx * r * 0.35, hy - fy * r * 0.35 + 2, r * 1.2, r * 1.25, a, 0, 7); ctx.fill();
      ctx.fillStyle = L.skin; ctx.beginPath(); ctx.ellipse(hx + fx * r * 0.28, hy + fy * r * 0.28 + 1, r * 0.72, r * 0.9, a, 0, 7); ctx.fill();
      ctx.fillStyle = L.longHair; ctx.beginPath();
      for (let th = -160; th <= 70; th += 10) { const q = at(th, r * 1.12); th === -160 ? ctx.moveTo(q[0], q[1]) : ctx.lineTo(q[0], q[1]); }
      const bg = at(55, r * 0.55), bb = at(-60, r * 0.6); ctx.quadraticCurveTo(bg[0], bg[1], bb[0], bb[1]); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(140,190,255,0.35)'; ctx.lineWidth = 1.6; ctx.beginPath();   // a cold sheen on the crown
      for (let th = -120; th <= 20; th += 10) { const q = at(th, r * 1.02); th === -120 ? ctx.moveTo(q[0], q[1]) : ctx.lineTo(q[0], q[1]); } ctx.stroke();
      ctx.shadowColor = L.eyes; ctx.shadowBlur = 14; ctx.fillStyle = L.eyes;
      for (const k of [0.45, 0.85]) { ctx.beginPath(); ctx.ellipse(hx + fx * r * k + ux * r * 0.05, hy + fy * r * k + uy * r * 0.05, 2.4, 1.3, a, 0, 7); ctx.fill(); }
      ctx.shadowBlur = 0;
    } else if (L.hairStyle === 'hood') {
      ctx.fillStyle = L.hair; ctx.beginPath(); ctx.arc(hx - fx * 2, hy - 2, r * 1.15, 0, 7); ctx.fill();
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(hx + fx * 4, hy + fy * 4, r * 0.7, 0, 7); ctx.fill();
      ctx.shadowColor = L.eyes; ctx.shadowBlur = 14; ctx.fillStyle = L.eyes;
      for (const k of [0.35, 0.8]) { ctx.beginPath(); ctx.ellipse(hx + fx * r * k + ux * 2, hy + fy * r * k + uy * 2, 2.6, 1.6, a, 0, 7); ctx.fill(); }
      ctx.shadowBlur = 0;
    } else if (L.hairStyle !== 'hood' && L.hairStyle !== 'long') {
      if (L.hairStyle === 'hood2') { ctx.fillStyle = '#120c0a'; const ex = hx + fx * r * 0.72 + ux * r * 0.12, ey = hy + fy * r * 0.72 + uy * r * 0.12; ctx.beginPath(); ctx.ellipse(ex, ey, 2.4 * s, 1.5 * s, a, 0, 7); ctx.fill(); }
      else {
      // a single eye line and brow gives the face direction
      ctx.fillStyle = '#120c0a';
      const ex = hx + fx * r * 0.62 + ux * r * 0.12, ey = hy + fy * r * 0.62 + uy * r * 0.12;
      ctx.beginPath(); ctx.ellipse(ex, ey, 2.4 * s, 1.5 * s, a, 0, 7); ctx.fill();
      }
    }
    if (L.faceCloth) { // cloth tied over nose and mouth, hanging a little below the chin
      const P = (f, u) => [hx + fx * r * f + ux * r * u, hy + fy * r * f + uy * r * u];
      const p0 = P(1.02, -0.02), p1 = P(-0.2, 0.0), p2 = P(-0.3, -0.85), p3 = P(0.35, -1.25), p4 = P(0.95, -0.7);
      ctx.fillStyle = L.faceCloth; ctx.strokeStyle = 'rgba(8,6,6,0.85)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]); ctx.quadraticCurveTo(p4[0], p4[1], p0[0], p0[1]); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(120,110,95,0.55)'; ctx.lineWidth = 1.2 * s;
      for (const u of [-0.35, -0.65]) { const q1 = P(0.0, u), q2 = P(0.85, u + 0.05); ctx.beginPath(); ctx.moveTo(q1[0], q1[1]); ctx.lineTo(q2[0], q2[1]); ctx.stroke(); }
    }
    if (L.band) {
      ctx.strokeStyle = L.band; ctx.lineWidth = 5 * s; ctx.lineCap = 'butt';
      const b1 = [hx + fx * r * 0.98 + ux * r * 0.3, hy + fy * r * 0.98 + uy * r * 0.3], b2 = [hx - fx * r * 0.98 + ux * r * 0.2, hy - fy * r * 0.98 + uy * r * 0.2];
      ctx.beginPath(); ctx.moveTo(b1[0], b1[1]); ctx.quadraticCurveTo(hx + ux * r * 0.55, hy + uy * r * 0.55, b2[0], b2[1]); ctx.stroke();
    }
    ctx.restore();
  }
  R.drawHead = function (ctx, J) {
    const r = R.SIZE.hr * J.s * (J.look.headS || 1);
    ctx.fillStyle = J.look.mask ? J.look.hair : J.look.skin; ctx.strokeStyle = 'rgba(8,6,6,0.85)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(J.Hd[0], J.Hd[1], r, 0, 7); ctx.stroke(); ctx.fill();
    head(ctx, J, J.look, {});
    ctx.fillStyle = '#5a0707'; ctx.beginPath(); ctx.arc(J.Hd[0] - Math.sin(J.headA + J.rot) * J.face * r * 0.9, J.Hd[1] + Math.cos(J.headA + J.rot) * r * 0.9, r * 0.45, 0, 7); ctx.fill();
  };
  R.headAnchor = J => { const r = R.SIZE.hr * J.s, a = J.headA + J.rot; return [J.Hd[0] - Math.cos(a) * J.face * r * 0.9 + Math.sin(a) * J.face * r * 0.2, J.Hd[1] - Math.sin(a) * r * 0.9 - Math.cos(a) * r * 0.2]; };
  R.beltAnchor = J => { const tn = J.torsoA, n = [Math.cos(tn) * J.face, Math.sin(tn)], w = J.look.waist * J.s / 2; return [J.H[0] + (J.S[0] - J.H[0]) * 0.1 + n[0] * w * 0.6, J.H[1] + (J.S[1] - J.H[1]) * 0.1 + n[1] * w * 0.6]; };

  function weapon(ctx, J, L, opts) {
    const s = J.s, W = J.WF, a = J.faF + J.wp; // blade direction: continues the forearm, plus wp
    const dir = [Math.sin(a) * J.face, Math.cos(a)];
    ctx.save(); ctx.lineCap = 'round';
    if (L.weapon === 'katana') {
      const h0 = [W[0] - dir[0] * 12 * s, W[1] - dir[1] * 12 * s], g = [W[0] + dir[0] * 10 * s, W[1] + dir[1] * 10 * s];
      const tip = [W[0] + dir[0] * 98 * s, W[1] + dir[1] * 98 * s];
      J.blade = [g, tip];
      ctx.strokeStyle = '#0d0c0c'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(h0[0], h0[1]); ctx.lineTo(g[0], g[1]); ctx.stroke();
      ctx.strokeStyle = '#c9a24b'; ctx.lineWidth = 7 * s; ctx.beginPath();
      ctx.moveTo(g[0] - dir[1] * 5 * s * J.face, g[1] + dir[0] * 5 * s * J.face); ctx.lineTo(g[0] + dir[1] * 5 * s * J.face, g[1] - dir[0] * 5 * s * J.face); ctx.stroke();
      ctx.strokeStyle = '#d8dee6'; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.moveTo(g[0], g[1]);
      const mid = [(g[0] + tip[0]) / 2 - dir[1] * 3 * J.face, (g[1] + tip[1]) / 2 + dir[0] * 3 * J.face];
      ctx.quadraticCurveTo(mid[0], mid[1], tip[0], tip[1]); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 1.4; ctx.stroke();
      if (opts.bloodBlade) { ctx.strokeStyle = 'rgba(120,10,10,0.85)'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(mid[0], mid[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke(); }
    } else if (L.weapon === 'staff') {
      const back = [W[0] - dir[0] * 80 * s, W[1] - dir[1] * 80 * s], tip = [W[0] + dir[0] * 140 * s, W[1] + dir[1] * 140 * s];
      J.blade = [back, tip];
      ctx.strokeStyle = '#140e08'; ctx.lineWidth = 8 * s; ctx.beginPath(); ctx.moveTo(back[0], back[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
      ctx.strokeStyle = '#6e4a28'; ctx.lineWidth = 5.5 * s; ctx.stroke();
      ctx.strokeStyle = '#8f949c'; ctx.lineWidth = 7.5 * s;
      for (const [p, q] of [[back, 0.06], [tip, -0.06]]) {
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + (tip[0] - back[0]) * q, p[1] + (tip[1] - back[1]) * q); ctx.stroke();
      }
      // the back hand rides the staff
      ctx.fillStyle = shade(L.hand, 0.62); ctx.beginPath(); ctx.arc(J.WB[0], J.WB[1], 6 * s, 0, 7); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------------------------------------------------- ribbons/ropes */
  R.Rope = class {
    constructor(n, seg, w0, col, g) { this.n = n; this.seg = seg; this.w0 = w0; this.col = col; this.g = g || 0.28; this.p = null; }
    update(anchor, dt, wind, face) {
      if (!this.p) { this.p = []; for (let i = 0; i < this.n; i++) this.p.push({ x: anchor[0] - face * i * this.seg, y: anchor[1] + i * 2, px: anchor[0] - face * i * this.seg, py: anchor[1] + i * 2 }); }
      const P = this.p; P[0].x = anchor[0]; P[0].y = anchor[1]; P[0].px = anchor[0]; P[0].py = anchor[1];
      const t = performance.now() / 1000;
      for (let i = 1; i < P.length; i++) {
        const q = P[i], vx = (q.x - q.px) * 0.9, vy = (q.y - q.py) * 0.9;
        q.px = q.x; q.py = q.y;
        q.x += vx + (wind + Math.sin(t * 6 + i) * 0.3) * dt * 60 * 0.35;
        q.y += vy + this.g * dt * 60;
      }
      for (let k = 0; k < 3; k++) for (let i = 1; i < P.length; i++) {
        const a = P[i - 1], b = P[i], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, e = (d - this.seg) / d;
        if (i === 1) { b.x -= dx * e; b.y -= dy * e; } else { a.x += dx * e * 0.5; a.y += dy * e * 0.5; b.x -= dx * e * 0.5; b.y -= dy * e * 0.5; }
      }
    }
    draw(ctx) {
      if (!this.p) return; const P = this.p;
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (let i = 1; i < P.length; i++) {
        ctx.strokeStyle = this.col; ctx.lineWidth = this.w0 * (1 - i / P.length * 0.6);
        ctx.beginPath(); ctx.moveTo(P[i - 1].x, P[i - 1].y); ctx.lineTo(P[i].x, P[i].y); ctx.stroke();
      }
      ctx.restore();
    }
    reset() { this.p = null; }
  };
  return R;
})();
