# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Build every move for the five AI-photo fighters from just two photos each
(fighting stance + kick), by re-posing cut-out body regions: arm/leg
stretches, leans, crouch squashes, falls.  Writes cast/ai/<cid>/<move><n>.png
in the same 560x320 feet-at-(260,300) layout as cast/out, so build_cast.py
can turn them into KOF91 folders (run it with SRC=cast/ai)."""
import os, sys, glob, json, shutil
import numpy as np
from PIL import Image
from scipy import ndimage

CUT = '/mnt/project-files/shogun2-port/ai-cast-cutouts'
OLD = '/home/claude/k91/cast/out'
OUT = '/home/claude/k91/cast/ai'
W, HH, OX, OY = 560, 320, 260, 300

FILES = {'shokei': ('01', '06'), 'wanfu': ('02', '07'), 'yamana': ('03', '08'),
         'frill': ('04', '09'), 'onikage': ('05', '10')}
# standing height of each fighter in game pixels (Keero is 140)
HEIGHT = {'shokei': 138, 'wanfu': 146, 'yamana': 136, 'frill': 138, 'onikage': 143}


def cutout(path):
    return np.asarray(Image.open(path).convert('RGBA')).astype(np.float32)


def torso_x(a):
    """mean x of the body between 20% and 50% of its height"""
    op = a[..., 3] > 128
    ys = np.nonzero(op.any(1))[0]
    y0, y1 = ys.min(), ys.max()
    band = op[int(y0 + .2 * (y1 - y0)):int(y0 + .5 * (y1 - y0))]
    return float(np.nonzero(band)[1].mean())


def place(img, k, tx):
    """scale a cutout by k and put it on the canvas with feet on the floor and
    torso at tx"""
    im = Image.fromarray(img.astype(np.uint8))
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    can = np.zeros((HH, W, 4), np.float32)
    x = int(round(tx - torso_x(a)))
    y = OY + 1 - a.shape[0]
    can[y:y + a.shape[0], x:x + a.shape[1]] = a
    return can


def remap(can, sy, sx):
    out = np.zeros_like(can)
    for c in range(4):
        out[..., c] = ndimage.map_coordinates(can[..., c], [sy, sx], order=1, mode='constant')
    return out


def grid():
    return np.mgrid[0:HH, 0:W].astype(np.float32)


def bbox(can):
    op = can[..., 3] > 128
    ys, xs = np.nonzero(op.any(1))[0], np.nonzero(op.any(0))[0]
    return xs.min(), ys.min(), xs.max(), ys.max()


def floor(can):
    """drop the figure so its lowest pixel stands on the floor"""
    _, _, _, y1 = bbox(can)
    return np.roll(can, OY + 1 - y1, axis=0) if y1 != OY + 1 else can


def stretch(can, yc, half, xa, xb, d):
    """push everything right of xb (inside a soft horizontal band around yc)
    out by d pixels, stretching xa..xb to fill: an arm or leg extending"""
    gy, gx = grid()
    t = np.clip((half - np.abs(gy - yc)) / (half * .45), 0, 1)
    w = t * t * (3 - 2 * t)
    dd = d * w
    nb = xb + dd
    sx = np.where(gx < xa, gx,
                  np.where(gx < nb, xa + (gx - xa) * (xb - xa) / np.maximum(nb - xa, 1), gx - dd))
    return remap(can, gy, sx)


def lean(can, deg, px=None):
    """rotate about the feet (positive = lean forward/right)"""
    px = OX if px is None else px
    gy, gx = grid()
    r = -np.radians(deg)
    dx, dy = gx - px, gy - OY
    sx = px + dx * np.cos(r) - dy * np.sin(r)
    sy = OY + dx * np.sin(r) + dy * np.cos(r)
    return remap(can, sy, sx)


def squash(can, k):
    """scale height about the floor"""
    gy, gx = grid()
    return remap(can, OY - (OY - gy) / k, gx)


def legs(can, k, widen=1.0, shear=0.0):
    """compress the legs (below the hip) by k, widen them, and optionally
    shear them for a walking step; the body above rides down on top"""
    x0, y0, x1, y1 = bbox(can)
    hip = y0 + .5 * (y1 - y0)
    L = OY - hip
    nhip = OY - L * k
    gy, gx = grid()
    cx = (x0 + x1) / 2
    below = gy >= nhip
    sy = np.where(below, hip + (gy - nhip) / k, gy - (nhip - hip))
    f = np.clip((gy - nhip) / max(L * k, 1), 0, 1)
    sx = np.where(below, cx + (gx - cx) / (1 + (widen - 1) * f) - shear * f * L, gx)
    return remap(can, sy, sx)


def front(can, lo=.0, hi=.55):
    """frontmost (rightmost) point of the figure between two height fractions"""
    x0, y0, x1, y1 = bbox(can)
    op = can[..., 3] > 128
    a, b = int(y0 + lo * (y1 - y0)), int(y0 + hi * (y1 - y0))
    cols = np.nonzero(op[a:b].any(0))[0]
    x = cols.max()
    ys = np.nonzero(op[a:b, x - 3:x + 1].any(1))[0] + a
    return int(x), int(np.median(ys))


STAFF = False


def thrust(can, d):
    """staff fighters: lunge the whole body and staff forward instead"""
    a = lean(can, d * .18)
    return np.roll(a, int(d * .35), axis=1)


def punch(can, d, half=8):
    if STAFF:
        return thrust(can, d)
    # stretch only the forearm just behind the front fist, so the body, the
    # rear hand and any weapon stay as they are
    fx, fy = front(can, 0, .5)
    x0, y0, x1, y1 = bbox(can)
    xa = fx - .13 * (y1 - y0)
    return stretch(can, fy, half, xa, fx - 7, d)


def push(can, d):
    """both hands forward (projectile throw)"""
    x0, y0, x1, y1 = bbox(can)
    fx, fy = front(can, 0, .5)
    xa = fx - .16 * (y1 - y0)
    return stretch(can, fy, 16, xa, fx - 7, d)


def kick_leg(can, d):
    fx, fy = front(can, .25, 1)
    tx = torso_x(can)
    return stretch(can, fy, 13, tx + 6, max(tx + 10, fx - 9), d)


def sweep(can, d):
    fx, fy = front(can, .82, 1.0)
    tx = torso_x(can)
    return stretch(can, OY - 4, 10, tx, max(tx + 4, fx - 6), d)


def raise_fist(can, d):
    """front fist up (victory): the same stretch done on the transposed image"""
    fx, fy = front(can, 0, .5)
    t = np.ascontiguousarray(can[::-1].transpose(1, 0, 2))      # x -> rows, up -> right
    # in t: row = x, col = HH-1-y
    gyx = t
    pad = np.zeros((W, W, 4), np.float32)
    pad[:, :HH] = gyx
    out = _stretch_any(pad, fx, 12, HH - 1 - (fy + 14), HH - 1 - (fy - 4), d)
    back = out[:, :HH].transpose(1, 0, 2)[::-1]
    return np.ascontiguousarray(back)


def _stretch_any(a, yc, half, xa, xb, d):
    h, w = a.shape[:2]
    gy, gx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = np.clip((half - np.abs(gy - yc)) / (half * .45), 0, 1)
    wt = t * t * (3 - 2 * t)
    dd = d * wt
    nb = xb + dd
    sx = np.where(gx < xa, gx, np.where(gx < nb, xa + (gx - xa) * (xb - xa) / np.maximum(nb - xa, 1), gx - dd))
    out = np.zeros_like(a)
    for c in range(4):
        out[..., c] = ndimage.map_coordinates(a[..., c], [gy, sx], order=1, mode='constant')
    return out


def raise_leg(can, deg):
    """cut the front leg off at the hip and swing it forward and up"""
    x0, y0, x1, y1 = bbox(can)
    hx, hy = torso_x(can) + 2, y0 + .52 * (y1 - y0)
    gy, gx = grid()
    leg = (gy > hy) & (gx > hx)
    body = can.copy()
    body[leg] = 0
    r = np.radians(deg)
    dx, dy = gx - hx, gy - hy                         # rotate the leg layer about the hip
    sx = hx + dx * np.cos(r) - dy * np.sin(r)
    sy = hy + dx * np.sin(r) + dy * np.cos(r)
    src = can.copy()
    src[~leg] = 0
    lg = remap(src, sy, sx)
    a = lg[..., 3:4] / 255
    out = body * (1 - a) + lg * a
    out[..., 3] = np.maximum(body[..., 3], lg[..., 3])
    return out


def spin(can, deg, cy):
    """turn the whole figure about its middle (cartwheels)"""
    x0, y0, x1, y1 = bbox(can)
    cx = (x0 + x1) / 2
    gy, gx = grid()
    r = np.radians(deg)
    dx, dy = gx - cx, gy - cy
    sx = cx + dx * np.cos(r) - dy * np.sin(r)
    sy = cy + dx * np.sin(r) + dy * np.cos(r)
    return remap(can, sy, sx)


def fall(can, deg):
    x0, y0, x1, y1 = bbox(can)
    return floor(lean(can, -deg, px=x0 + 6))  # backwards, about the rear foot


def tint(can, rgb, amt):
    out = can.copy()
    out[..., :3] = out[..., :3] * (1 - amt) + np.array(rgb, np.float32) * amt
    return out


def build(cid):
    global STAFF
    STAFF = cid == 'yamana'
    s_id, k_id = FILES[cid]
    S0 = cutout(glob.glob(f'{CUT}/{s_id}_*.png')[0])
    K0 = cutout(glob.glob(f'{CUT}/{k_id}_*.png')[0])
    NEW = f'{CUT}/{cid}-set-new'                 # a redesigned fighter brings its own base poses
    if os.path.exists(f'{NEW}/stance.png'):
        S0 = cutout(f'{NEW}/stance.png')
        kf = [f for f in (f'{NEW}/kick.png', f'{NEW}/jump_kick.png') if os.path.exists(f)]
        K0 = cutout(kf[0]) if kf else None           # no kick photo: one is built from the stance
    op = S0[..., 3] > 128
    ys = np.nonzero(op.any(1))[0]
    k = HEIGHT[cid] / (ys.max() - ys.min() + 1)
    if cid == 'frill' and os.path.exists(f'{NEW}/walk.png'):
        # the spirit Frill's stance is a low guard, so size her by the upright
        # walking photo (all of that set was shot at one scale)
        wo = cutout(f'{NEW}/walk.png')[..., 3] > 128
        wy = np.nonzero(wo.any(1))[0]
        k = HEIGHT[cid] / (wy.max() - wy.min() + 1)
    S = place(S0, k, OX - 8)
    if K0 is not None:
        K = place(K0, k, OX - 14)
    else:
        K = floor(lean(raise_leg(S, 72), -8))        # swing the front leg up from the hip
    H = HEIGHT[cid]

    C = floor(legs(S, .52, 1.3))                 # crouch
    T = floor(legs(S, .62, 1.12))                # jump tuck
    chamber = floor(kick_leg(K, -0.35 * (front(K, .25, 1)[0] - torso_x(K))))
    Kx = kick_leg(K, 10)
    Khi = floor(lean(K, -7))
    u = H / 138                                   # scale reach with size

    M = {}
    M['static'] = [S, squash(S, .992), squash(S, .984), squash(S, .992)]
    M['walk'] = [floor(legs(S, .99, 1, sh)) for sh in (0.12, 0.05, -0.08, 0.02, 0.1)]
    M['jump'] = [S, T, T, T, S]
    M['crouch'] = [C]
    M['block'] = [lean(punch(S, -6 * u), -5)]
    M['gblock'] = [lean(C, -5)]
    M['hurt'] = [lean(S, -6), lean(tint(S, (200, 40, 30), .12), -12), lean(S, -6)]
    M['ghurt'] = [lean(C, -8), lean(tint(C, (200, 40, 30), .12), -14)]
    M['ko'] = [lean(S, -10), fall(S, 30), fall(S, 55), fall(S, 80), fall(S, 90)]
    M['intro'] = [lean(S, -3)] * 3 + [S] * 3 + [squash(S, .984)] * 3 + [S] * 3 + [squash(S, .992)] * 3
    up = lean(raise_fist(S, 18 * u), -3)
    M['outwin'] = [S, squash(S, 1.01), raise_fist(S, 12 * u), up, up, squash(up, 1.01), up,
                   squash(up, 1.01), up, raise_fist(S, 12 * u), S]
    M['wpunch'] = [S, punch(S, 16 * u), punch(S, 32 * u), punch(S, 14 * u)]
    M['spunch'] = [punch(S, -6 * u), lean(punch(S, 20 * u), 3), lean(punch(S, 46 * u), 5),
                   lean(punch(S, 46 * u), 5), punch(S, 16 * u)]
    M['wkick'] = [chamber, K, Kx, K, chamber]
    M['skick'] = [chamber, Khi, kick_leg(Khi, 14), Khi, chamber]
    M['gpunch'] = [C, punch(C, 18 * u), punch(C, 36 * u), punch(C, 36 * u), punch(C, 12 * u)]
    G = floor(lean(floor(legs(K, .58, 1.1)), 8, px=torso_x(K)))   # low crouching kick
    Gc = floor(legs(chamber, .58, 1.1))
    M['gkick'] = [C, Gc, G, kick_leg(G, 8), kick_leg(G, 8), G, Gc, C]
    M['apunch'] = [T, punch(T, 20 * u), punch(T, 38 * u), punch(T, 20 * u)]
    M['akick'] = [T, chamber, K, Kx, T]
    M['fireb'] = [lean(S, -3), lean(push(S, -10 * u), -5), push(S, 10 * u), lean(push(S, 34 * u), 4),
                  lean(push(S, 34 * u), 4), push(S, 14 * u)]
    M['firebx'] = [lean(S, -4), lean(push(S, -12 * u), -7), lean(push(S, -12 * u), -7), push(S, 16 * u),
                   lean(push(S, 40 * u), 6), lean(push(S, 40 * u), 6), push(S, 14 * u)]
    M['smove'] = [chamber, lean(chamber, 4), lean(K, 4), lean(Kx, 6), lean(Kx, 6), lean(K, 3), chamber, S]

    # real photographed poses (Chris's sets) replace the re-posed guesses
    R = {}
    sets = [f'{CUT}/{cid}-set-new'] if os.path.exists(f'{CUT}/{cid}-set-new') else [f'{CUT}/{cid}-set']
    for f in [g for d_ in sets for g in glob.glob(d_ + '/*.png') if not g.endswith('portrait_src.png')]:
        name = os.path.basename(f)[:-4].replace(cid + '_', '')
        R[name] = place(cutout(f), k, OX - 8)
    if cid == 'frill' and 'crouch' not in R and 'crouch_punch' in R:
        R['crouch'] = floor(legs(S, .55, 1.2))      # her guard, lowered
    if 'jab' in R:
        M['wpunch'] = [S, punch(S, 10 * u), R['jab'], punch(S, 12 * u)]
    if 'crouch_punch' in R:
        CP = R['crouch_punch']
        fx, fy = front(CP, 0, .5)                     # same low stance, fist pulled back
        x0, y0, x1, y1 = bbox(CP)
        Cr = stretch(CP, fy, 9, fx - .42 * (y1 - y0), fx - 6, -34 * u)
        M['crouch'] = [Cr]
        M['gblock'] = [lean(Cr, -5)]
        M['ghurt'] = [lean(Cr, -8), lean(tint(Cr, (200, 40, 30), .12), -14)]
        if 'crouch' in R:
            Cr = R['crouch']
            M['crouch'] = [Cr]
            M['gblock'] = [lean(Cr, -5)]
            M['ghurt'] = [lean(Cr, -8), lean(tint(Cr, (200, 40, 30), .12), -14)]
        M['gpunch'] = [Cr, punch(CP, -20 * u), CP, CP, punch(CP, -20 * u)]
    if 'sweep' in R:
        SW = R['sweep']
        Cr = M['crouch'][0]
        M['gkick'] = [Cr, sweep(SW, -30 * u), SW, SW, SW, sweep(SW, -18 * u), sweep(SW, -30 * u), Cr]
    if 'jump' in R:
        J = R['jump']
        M['jump'] = [S, J, J, J, S]
        M['apunch'] = [J, punch(J, 18 * u), punch(J, 34 * u), punch(J, 18 * u)]
        if 'jump_kick' in R:
            M['akick'] = [J, J, R['jump_kick'], R['jump_kick'], J]
    if 'walk' in R:
        Wk = R['walk']
        M['walk'] = [S, Wk, Wk, S, floor(legs(S, .99, 1, 0.08))]
    if 'block' in R:
        M['block'] = [R['block']]
    if 'down' in R and cid in ('wanfu',):
        # his lying photo has the head toward the opponent: mirror it so he
        # lands on his back, head away, like the fall frames before it
        d = np.ascontiguousarray(R['down'][:, ::-1])
        R['down'] = np.roll(d, bbox(R['down'])[0] - bbox(d)[0], axis=1)
    if 'hit' in R:
        Hh = R['hit']
        M['hurt'] = [Hh, tint(Hh, (200, 40, 30), .12), Hh]
        M['ko'] = [Hh, fall(Hh, 30), fall(Hh, 60), R.get('down', fall(S, 90)), R.get('down', fall(S, 90))]
    elif 'down' in R:
        M['ko'] = M['ko'][:3] + [R['down'], R['down']]
    if 'victory' in R:
        V = R['victory']
        M['outwin'] = [S, S, V, V, V, squash(V, 1.008), V, squash(V, 1.008), V, V, V]
    if 'push' in R:
        Pu = R['push']
        M['fireb'] = [lean(S, -3), lean(S, -6), Pu, Pu, Pu, S]
        M['firebx'] = [lean(S, -4), lean(S, -7), lean(S, -7), lean(Pu, 2), Pu, Pu, S]
    if 'punch' in R:                                  # a real straight punch
        Pn = R['punch']
        M['spunch'] = [punch(S, -6 * u), lean(S, 3), Pn, Pn, punch(S, 16 * u)]

    # second special on back-forward-punch, in the engine's "rush" slot
    # (the fighter travels forward while it plays)
    if cid == 'shokei' and 'slash' in R:              # Blade Dash, from the 1996 game
        Sl = R['slash']
        M['rush'] = [S, lean(S, 5), lean(Sl, 6), Sl, Sl, lean(Sl, -2)]
    elif cid == 'wanfu' and 'charge' in R:            # Shoulder Charge
        Ch = R['charge']
        M['rush'] = [lean(S, -5), lean(Ch, -3), Ch, Ch, Ch, S]
    elif cid == 'yamana':                             # cartwheel, as in the remake
        x0, y0, x1, y1 = bbox(S)
        cy = (y0 + y1) / 2
        M['rush'] = [floor(spin(S, a, cy)) for a in (0, -60, -120, -180, -240, -300)]
    elif cid == 'frill' and 'ribbon' in R:            # Ribbon Lash
        Rb = R['ribbon']
        M['rush'] = [lean(S, -4), lean(Rb, -6), Rb, Rb, lean(Rb, 3), S]
    elif cid == 'onikage':                            # Demon Uppercut
        Cc = floor(legs(S, .6, 1.15))
        M['rush'] = [Cc, raise_fist(Cc, 10 * u), lean(raise_fist(S, 30 * u), 4), lean(raise_fist(S, 38 * u), 6),
                     raise_fist(S, 38 * u), S]

    d = os.path.join(OUT, cid)
    os.makedirs(d, exist_ok=True)
    for f in glob.glob(d + '/*'):
        os.remove(f)
    lim = max(bbox(S)[0], OX - 70)
    for mv, fl in M.items():
        for i, a in enumerate(fl):
            # the engine draws every frame from one left anchor, so nothing
            # may poke out behind it (falls and back-leans slide forward)
            bx0 = bbox(a)[0]
            if bx0 < lim:
                a = np.roll(a, lim - bx0, axis=1)
            Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f'{d}/{mv}{i + 1}.png')
    # projectiles and meta come from the old render; portrait from the photo
    for f in glob.glob(f'{OLD}/{cid}/fball*.png') + [f'{OLD}/{cid}/meta.json']:
        shutil.copy(f, d)
    if os.path.exists(f'{NEW}/portrait_src.png'):      # a sharper full-size photo for the face
        S0 = cutout(f'{NEW}/portrait_src.png')
        op = S0[..., 3] > 128
    x0, y0, x1, y1 = (lambda o: (np.nonzero(o.any(0))[0].min(), np.nonzero(o.any(1))[0].min(),
                                 np.nonzero(o.any(0))[0].max(), np.nonzero(o.any(1))[0].max()))(op)
    side = int(.30 * (y1 - y0))
    # find the head with thin things (staff, ribbons) opened away
    body = ndimage.binary_opening(op, np.ones((31, 31), bool))
    y0 = np.nonzero(body.any(1))[0].min()
    hx = int(np.nonzero(body[y0:y0 + side // 3])[1].mean())
    head = Image.fromarray(S0.astype(np.uint8)).crop((hx - side // 2, y0 - side // 10, hx + side // 2, y0 + side * 9 // 10))
    bg = Image.new('RGBA', head.size, (0, 0, 0, 255))
    g = np.linspace(70, 12, head.size[1]).astype(np.uint8)
    bga = np.zeros((head.size[1], head.size[0], 4), np.uint8)
    bga[..., 0] = g[:, None]
    bga[..., 1] = (g // 5)[:, None]
    bga[..., 2] = (g // 4)[:, None]
    bga[..., 3] = 255
    bg = Image.fromarray(bga)
    bg.alpha_composite(head)
    bg.convert('RGB').save(f'{d}/portrait.png')
    print(cid, 'done')


if __name__ == '__main__':
    for cid in (sys.argv[1:] or FILES):
        build(cid)
