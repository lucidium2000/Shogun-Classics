# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Make Keero hit harder and look it (Chris, v35: "his moves seem lame and weak").

Runs once on the finished sprites (after shrink/fit/fireballs), marked in
char.ini with "# keero power":
* stronger, quicker normals and specials (damage and speed in char.ini)
* a blue-white ki aura on his fireball, lunge punch and Fatal Kick frames
* speed streaks trailing the lunge punch
* motion smears on the striking limb of his normal attacks
* a bigger ki blast fireball (72x30, 4 frames) that flies faster
* power_hits = 1: his special hits shake the screen (patch.py)
Originals are saved to removed/keero_v34.
    python3 tools/keero_power.py"""
import os, re, sys, math, shutil
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
from pcxw import save_pcx24

D = 'data/sprites/keero'
BK = 'removed/keero_v34'
KEYC = np.array((255, 0, 255), np.uint8)


def load(p): return np.asarray(Image.open(p).convert('RGB')).copy()


def body(a): return ~((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255))


def save(p, a):
    m = body(a)
    a = a.copy(); a[~m] = KEYC
    hit = m & (a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255)
    a[hit] = (254, 0, 254)
    save_pcx24(p, a)


def aura(a, strength=1.0):
    """white rim, 2px blue ki glow and a flickering outer edge, plus a cool tint"""
    m = body(a)
    o = a.astype(np.float32)
    o[m] = o[m] * (1 - .15 * strength) + np.array((150, 210, 255)) * .15 * strength
    r1 = ndimage.binary_dilation(m, iterations=1) & ~m
    r2 = ndimage.binary_dilation(m, iterations=3) & ~m & ~r1
    r3 = ndimage.binary_dilation(m, iterations=5) & ~m & ~r1 & ~r2
    rng = np.random.default_rng(int(a.sum()) % 99991)
    flick = rng.random(m.shape) < .45 * strength
    o[r1] = (235, 250, 255)
    o[r2] = (110, 185, 255)
    o[r3 & flick] = (50, 110, 230)
    out = np.clip(o, 0, 255).astype(np.uint8)
    out[~(m | r1 | r2 | (r3 & flick))] = KEYC
    return out


def streaks(a, n_len=26, seed=0):
    """horizontal speed lines trailing to the left of the body"""
    m = body(a); out = a.copy()
    rng = np.random.default_rng(seed)
    ys = np.where(m.any(1))[0]
    if not len(ys): return out
    for y in range(ys.min() + 6, ys.max() - 4, 7):
        xs = np.where(m[y])[0]
        if not len(xs): continue
        x0 = xs.min() - 2; ln = int(n_len * rng.uniform(.5, 1.0))
        for k in range(ln):
            x = x0 - k
            if x < 0: break
            if (k // 3) % 3 == 2: continue           # dashed
            t = k / ln
            c = np.array((235, 245, 255)) * (1 - t) + np.array((80, 150, 255)) * t
            if not m[y, x]: out[y, x] = c.astype(np.uint8)
    return out


def smear(a, hx, hy, r=15):
    """a white swoosh arc behind the strike point (hx, hy), drawn around him"""
    m = body(a); S = 4
    al = Image.new('L', (a.shape[1] * S, a.shape[0] * S))
    d = ImageDraw.Draw(al)
    cx, cy = (hx - r * .55) * S, hy * S
    for k, (rr, w) in enumerate(((r, 3), (r - 4, 2))):
        box = [cx - rr * S, cy - rr * S, cx + rr * S, cy + rr * S]
        d.arc(box, -70, 70, fill=255 - 90 * k, width=w * S)
    sw = np.asarray(al.resize((a.shape[1], a.shape[0]), Image.BOX)).astype(np.float32) / 255
    out = a.copy()
    put = (sw > .3) & ~m
    t = np.clip(sw, 0, 1)[..., None]
    col = np.array((235, 247, 255)) * t + np.array((90, 160, 255)) * (1 - t)
    out[put] = col[put].astype(np.uint8)
    return out


def ki_blast(w=72, h=30, n=4):
    S = 4; frames = []
    for f in range(n):
        rgb = Image.new('RGB', (w * S, h * S)); al = Image.new('L', (w * S, h * S))
        dr, da = ImageDraw.Draw(rgb), ImageDraw.Draw(al)
        cx, cy = (w - 15) * S, h * S / 2
        rng = np.random.default_rng(7 + f)
        # trailing tail: tapered streaks
        for i in range(9):
            yo = (i - 4) * S * 2.2 + rng.uniform(-2, 2) * S
            ln = rng.uniform(.55, 1.0) * (w - 18) * S
            wid = S * (2.6 - abs(i - 4) * .45)
            poly = [(cx, cy + yo * .6 - wid), (cx - ln, cy + yo), (cx, cy + yo * .6 + wid)]
            c = (110, 180, 255) if abs(i - 4) > 1 else (200, 235, 255)
            dr.polygon(poly, fill=c); da.polygon(poly, fill=255)
        # crackle
        for i in range(5):
            ang = rng.uniform(0, 2 * math.pi); r0 = 9 * S; r1 = rng.uniform(13, 15) * S
            pts = [(cx + math.cos(ang) * r0, cy + math.sin(ang) * r0 * .9)]
            for k in range(3):
                rr = r0 + (r1 - r0) * (k + 1) / 3; aa = ang + rng.uniform(-.35, .35)
                pts.append((cx + math.cos(aa) * rr, cy + math.sin(aa) * rr * .9))
            dr.line(pts, fill=(170, 220, 255), width=S); da.line(pts, fill=255, width=S)
        # core
        R = (12.5 + (f % 2)) * S
        for r, c in ((R, (60, 130, 255)), (R * .8, (140, 200, 255)), (R * .58, (215, 240, 255)), (R * .34, (255, 255, 255))):
            box = [cx - r, cy - r * .9, cx + r, cy + r * .9]
            dr.ellipse(box, fill=c); da.ellipse(box, fill=255)
        c = np.asarray(rgb.resize((w, h), Image.LANCZOS)).copy()
        m = np.asarray(al.resize((w, h), Image.BOX)) > 100
        c[~m] = KEYC
        frames.append(c)
    return frames


def setk(ini, k, v):
    if re.search(rf'(?m)^{k}\s*=', ini): return re.sub(rf'(?m)^{k}\s*=\s*-?\d+', f'{k} = {v}', ini)
    return ini.rstrip('\r\n') + f'\r\n{k} = {v}\r\n'


def geti(ini, k): return int(re.search(rf'(?m)^{k}\s*=\s*(-?\d+)', ini).group(1))


def main():
    ini = open(f'{D}/char.ini', newline='').read()
    if '# keero power' in ini: print('already done'); return
    os.makedirs(BK, exist_ok=True)
    for f in os.listdir(D):
        if not os.path.exists(f'{BK}/{f}'): shutil.copy(f'{D}/{f}', BK)
    n = lambda mv: geti(ini, f'{mv}_nbf')
    # specials: ki aura from the wind-up on
    for i in range(1, n('fireb') + 1):
        save(f'{D}/fireb{i}.pcx', aura(load(f'{D}/fireb{i}.pcx'), .6 if i < 3 else 1))
    for i in range(1, n('rush') + 1):
        a = aura(load(f'{D}/rush{i}.pcx'))
        if i >= 2: a = streaks(a, 18 + 6 * i, seed=i)
        save(f'{D}/rush{i}.pcx', a)
    for i in range(1, n('smove') + 1):
        save(f'{D}/smove{i}.pcx', aura(load(f'{D}/smove{i}.pcx'), .8))
    # normals: smear the striking limb on the hit frame and the one before
    for mv in ('wpunch', 'spunch', 'wkick', 'skick', 'akick', 'apunch', 'gkick', 'gpunch'):
        h = geti(ini, f'{mv}_hit'); hx, hy = geti(ini, f'{mv}_offx'), geti(ini, f'{mv}_offy')
        for i in {max(1, h - 1), h}:
            p = f'{D}/{mv}{i}.pcx'
            if os.path.exists(p): save(p, smear(load(p), hx, hy))
    # bigger, faster ki blast
    for i, fr in enumerate(ki_blast(), 1): save(f'{D}/fball{i}.pcx', fr)
    cy = geti(ini, 'fball_cy') - 5
    for k, v in (('fball_w', 72), ('fball_h', 30), ('fball_nbf', 4), ('fball_cy', cy), ('fball_pix', 6),
                 ('fball_offx', 66), ('fball_offy', 15), ('fireb_dmg', 6),
                 # damage: a notch above the rest of the cast
                 ('wpunch_dmg', 3), ('spunch_dmg', 4), ('wkick_dmg', 3), ('skick_dmg', 4),
                 ('apunch_dmg', 2), ('gpunch_dmg', 2), ('akick_dmg', 3), ('gkick_dmg', 3),
                 ('rush_dmg', 7), ('smove_dmg', 7), ('smovex_dmg', 13), ('rush_pix', 6),
                 # quicker
                 ('wpunch_spd', 4), ('spunch_spd', 5), ('skick_spd', 5), ('fireb_spd', 5), ('rush_spd', 4),
                 ('smove_spd', 5), ('power_hits', 1)):
        ini = setk(ini, k, v)
    ini = ini.rstrip('\r\n') + '\r\n# keero power\r\n'
    open(f'{D}/char.ini', 'w', newline='').write(ini)
    print('keero power done')


if __name__ == '__main__':
    main()
