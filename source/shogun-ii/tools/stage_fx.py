# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Build the living-stage layers (bkgds/fx/*) and foregrounds (bkgds/frgds/*)
for the arena, temple and forest.  Run from the repo root:  python3 tools/stage_fx.py
Coordinates are stage pixels on the 760x336 backgrounds."""
import os, sys, math
import numpy as np
from PIL import Image
from scipy import ndimage as nd
sys.path.insert(0, os.path.dirname(__file__))
from pcxw import save_pcx24

D = 'data/bkgds'
FX = D + '/fx'
os.makedirs(FX, exist_ok=True)
MAG = np.array([255, 0, 255], np.uint8)
rng = np.random.default_rng(7)


def load(name):
    return np.asarray(Image.open('%s/%s.pcx' % (D, name)).convert('RGB')).astype(np.float32)


def save(name, rgb, mask=None):
    name = name.lower()  # the game lowercases every path it opens
    rgb = np.clip(rgb, 0, 255).astype(np.uint8)
    if mask is not None:
        rgb = rgb.copy(); rgb[~mask] = MAG
    # never let a real pixel hit the transparent key by accident
    key = (rgb[..., 0] == 255) & (rgb[..., 1] == 0) & (rgb[..., 2] == 255)
    if mask is not None:
        key &= mask
    rgb[key] = [254, 0, 254]
    save_pcx24('%s/%s' % (FX, name), rgb)
    return name


def sample(bg, X, Y):
    """bilinear sample of bg at float coords"""
    return np.stack([nd.map_coordinates(bg[..., c], [Y, X], order=1, mode='nearest') for c in range(3)], -1)


def warp_anim(st, bg, name, box, n, disp, pad=6):
    """frames of a region with a displacement field disp(k, xx, yy) -> (dx, dy),
    tapered to zero at the padded edges so it blends into the still picture."""
    x0, y0, x1, y1 = box
    x0 -= pad; x1 += pad; y0 = max(0, y0 - pad // 2); y1 = min(bg.shape[0], y1 + pad // 2)
    x0 = max(0, x0); x1 = min(bg.shape[1], x1)
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    tx = np.clip(np.minimum(xx - x0, x1 - 1 - xx) / pad, 0, 1)
    files = []
    for k in range(n):
        dx, dy = disp(k / n, xx, yy)
        f = sample(bg, xx - dx * tx, yy - dy * tx)
        files.append(save('%s_%s%d.pcx' % (st, name, k), f))
    return '%d %d' % (x0, y0), files


def banner(st, bg, name, box, amp=1.6, n=12, delay=6, phase=0.0):
    x0, y0, x1, y1 = box
    h = y1 - y0
    def disp(t, xx, yy):
        d = np.clip((yy - y0) / h, 0, 1)
        return amp * d * np.sin(2 * math.pi * (t + phase) + (yy - y0) * 0.07), 0 * xx
    pos, files = warp_anim(st, bg, name, box, n, disp)
    return 'anim %s %d %s' % (pos, delay, ' '.join(files))


def tassel(st, bg, name, box, amp=1.5, n=12, delay=6, phase=0.0):
    x0, y0, x1, y1 = box
    def disp(t, xx, yy):
        d = np.clip((yy - y0) / (y1 - y0), 0, 1) ** 1.3
        return amp * d * np.sin(2 * math.pi * (t + phase)), 0 * xx
    pos, files = warp_anim(st, bg, name, box, n, disp, pad=4)
    return 'anim %s %d %s' % (pos, delay, ' '.join(files))


def crowd(st, bg, name, box, n=8, delay=9):
    x0, y0, x1, y1 = box
    ph = rng.random(64)
    def disp(t, xx, yy):
        col = ((xx - x0) / 9).astype(int) % 64
        b = np.maximum(0, np.sin(2 * math.pi * (t + ph[col]))) ** 2 * 1.2
        ty = np.clip(np.minimum(yy - y0, y1 - yy) / 4, 0, 1)
        return 0 * xx, b * ty
    pos, files = warp_anim(st, bg, name, box, n, disp, pad=3)
    return 'anim %s %d %s' % (pos, delay, ' '.join(files))


def smoke(st, bg, name, box, n=12, delay=7):
    x0, y0, x1, y1 = box
    sub = bg[y0:y1, x0:x1]
    sat = sub.max(2) - sub.min(2)
    m = nd.gaussian_filter(np.clip((60 - sat) / 30, 0, 1), 3)
    full = np.zeros(bg.shape[:2], np.float32); full[y0:y1, x0:x1] = m
    def disp(t, xx, yy):
        w = full[yy.astype(int), xx.astype(int)]
        a = 2 * math.pi * t
        dx = 2.2 * np.sin(yy * 0.11 + a) + 1.0 * np.sin(yy * 0.23 + xx * 0.05 + 2 * a)
        dy = 1.5 * np.sin(xx * 0.09 + yy * 0.04 + a)
        return dx * w, dy * w
    pos, files = warp_anim(st, bg, name, box, n, disp, pad=6)
    return 'anim %s %d %s' % (pos, delay, ' '.join(files))


def glow(st, name, spots, col, period, lo, hi):
    """spots: (cx, cy, rx, ry). additive warm light"""
    xs = [s[0] - s[2] * 3 for s in spots] + [s[0] + s[2] * 3 for s in spots]
    ys = [s[1] - s[3] * 3 for s in spots] + [s[1] + s[3] * 3 for s in spots]
    x0, y0 = max(0, int(min(xs))), max(0, int(min(ys)))
    x1, y1 = min(760, int(max(xs)) + 1), min(336, int(max(ys)) + 1)
    yy, xx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    a = np.zeros(xx.shape, np.float32)
    for cx, cy, rx, ry in spots:
        a = np.maximum(a, np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)))
    c = np.zeros(xx.shape + (3,), np.float32) + col
    al = np.stack([0 * a, a * 255, 0 * a], -1)
    save('%s_%s_c.pcx' % (st, name), c); save('%s_%s_a.pcx' % (st, name), al)
    return 'glow %d %d %d %d %d %s_%s_c.pcx %s_%s_a.pcx' % (x0, y0, period, lo, hi, st, name, st, name)


def dots(st, name, cols, sizes):
    """small soft particle sprites"""
    out = []
    for i, (c, (w, h)) in enumerate(zip(cols, sizes)):
        img = np.zeros((h, w, 3), np.float32) + c
        m = np.ones((h, w), bool)
        if w >= 3 and h >= 3:
            m[0, 0] = m[0, -1] = m[-1, 0] = m[-1, -1] = False
            img[1:-1, 1:-1] = np.minimum(255, np.array(c) * 1.12)
        out.append(save('%s_%s%d.pcx' % (st, name, i), img, m))
    return out


def leaf(st, name, cols):
    shapes = [
        [".##", "###", "##."],
        ["##..", "####", ".###"],
        [".#.", "###", "###", ".#."],
        ["###", "##."],
    ]
    out = []
    for i, c in enumerate(cols):
        s = shapes[i % len(shapes)]
        m = np.array([[ch == '#' for ch in row] for row in s])
        img = np.zeros(m.shape + (3,), np.float32) + c
        img[0] = np.minimum(255, np.array(c) * 1.2)
        out.append(save('%s_%s%d.pcx' % (st, name, i), img, m))
    return out


def mist(st, name, y0, h, col, speed, lo, hi, period, density=1.0):
    W = 760
    yy, xx = np.mgrid[0:h, 0:W].astype(np.float32)
    n = np.zeros((h, W), np.float32)
    for k, (p, amp) in enumerate(((1, .5), (2, .35), (3, .3), (5, .22), (8, .15), (13, .1))):
        for j in range(2):
            ph = rng.random() * 6.283; v = rng.uniform(-.06, .06)
            n += amp * np.sin(2 * math.pi * p * xx / W + ph + yy * v * (k + 1))
    n = (n - n.min()) / (n.max() - n.min())
    bell = np.sin(np.pi * yy / h) ** 1.5
    a = np.clip((n - 0.25) * 1.6, 0, 1) * bell * density
    c = np.zeros((h, W, 3), np.float32) + col
    save('%s_%s_c.pcx' % (st, name), c)
    save('%s_%s_a.pcx' % (st, name), np.stack([0 * a, a * 255, 0 * a], -1))
    return 'mist 0 %d %d %d %d %d %s_%s_c.pcx %s_%s_a.pcx' % (y0, speed, lo, hi, period, st, name, st, name)


def rays(st, bg, box, period, lo, hi):
    x0, y0, x1, y1 = box
    sub = bg[y0:y1, x0:x1]
    lum = sub.mean(2)
    loc = nd.gaussian_filter(lum, 12)
    a = np.clip((lum - 140) / 80, 0, 1) * np.clip((lum - loc + 40) / 60, 0, 1)
    a = nd.gaussian_filter(a, 2)
    yy = np.arange(y1 - y0)[:, None]
    a *= np.clip((y1 - y0 - yy) / 60.0, 0, 1)
    c = np.zeros(sub.shape, np.float32) + (255, 248, 215)
    save('%s_rays_c.pcx' % st, c)
    save('%s_rays_a.pcx' % st, np.stack([0 * a, a * 255, 0 * a], -1))
    return 'glow %d %d %d %d %d %s_rays_c.pcx %s_rays_a.pcx' % (x0, y0, period, lo, hi, st, st)


def foreground(st, bg, boxes, test):
    """full-size masked picture of the things that should stand in front of the fighters"""
    out = np.zeros(bg.shape, np.float32) + MAG
    for box in boxes:
        x0, y0, x1, y1 = box
        sub = bg[y0:y1, x0:x1]
        m = test(sub)
        m = nd.binary_opening(m, iterations=1)
        lab, n = nd.label(m)
        if n:
            sizes = nd.sum(m, lab, range(1, n + 1))
            keep = np.isin(lab, 1 + np.flatnonzero(sizes >= max(40, sizes.max() * 0.25)))
            keep = nd.binary_fill_holes(nd.binary_closing(keep, iterations=2))
            o = out[y0:y1, x0:x1]; o[keep] = sub[keep]
    rgb = np.clip(out, 0, 255).astype(np.uint8)
    save_pcx24('%s/frgds/%s.pcx' % (D, st), rgb)


def write(st, lines):
    open('%s/%s.txt' % (FX, st), 'w').write('# living stage layers for %s.pcx, made by tools/stage_fx.py\n' % st + '\n'.join(lines).lower() + '\n')


# ---------------------------------------------------------------- arena
bg = load('arena')
L = []
L.append(banner('arena', bg, 'bnA', (24, 14, 47, 118), phase=0.0))
L.append(banner('arena', bg, 'bnB', (72, 36, 106, 150), phase=0.3))
L.append(banner('arena', bg, 'bnC', (504, 70, 517, 126), amp=1.0, phase=0.55))
L.append(banner('arena', bg, 'bnD', (685, 28, 706, 122), phase=0.15))
L.append(banner('arena', bg, 'bnE', (718, 68, 735, 127), amp=1.2, phase=0.7))
L.append(banner('arena', bg, 'bnF', (739, 8, 758, 116), phase=0.45))
for i, (b, ph) in enumerate((((329, 78, 346, 112), 0), ((374, 76, 389, 112), .2), ((418, 76, 434, 112), .4),
                             ((344, 104, 354, 126), .1), ((379, 106, 389, 126), .3), ((410, 106, 420, 126), .5))):
    L.append(tassel('arena', bg, 'ts%d' % i, b, amp=1.3, phase=ph))
L.append(crowd('arena', bg, 'crA', (308, 128, 362, 154)))
L.append(crowd('arena', bg, 'crB', (468, 132, 495, 154)))
L.append(crowd('arena', bg, 'crC', (515, 138, 572, 176)))
L.append(glow('arena', 'lant', [(62, 103, 6, 8), (116, 112, 6, 8), (152, 108, 5, 7), (176, 104, 5, 6),
                                 (218, 107, 5, 6), (241, 109, 5, 6), (676, 110, 6, 8), (719, 96, 6, 8), (606, 122, 6, 7)],
              (255, 170, 80), 140, 50, 110))
d = dots('arena', 'dust', [(196, 170, 130), (176, 150, 112), (214, 192, 150), (160, 136, 100)], [(2, 1), (3, 2), (2, 2), (1, 1)])
L.append('front parts 14 0 215 760 336 7 0 4 ' + ' '.join(d))
write('arena', L)
foreground('arena', bg, [(14, 300, 62, 336), (705, 302, 752, 336)],
           lambda s: ((s.max(2) - s.min(2)) < 40) & (s.mean(2) < 150) & (s.mean(2) > 20))

# ---------------------------------------------------------------- temple
bg = load('temple')
L = []
L.append(smoke('temple', bg, 'smA', (205, 0, 290, 70)))
L.append(smoke('temple', bg, 'smB', (385, 8, 510, 150)))
L.append(banner('temple', bg, 'bnA', (522, 118, 545, 180), amp=1.2, phase=0.1))
L.append(banner('temple', bg, 'bnB', (623, 113, 638, 160), amp=1.0, phase=0.5))
L.append(banner('temple', bg, 'bnC', (720, 92, 752, 206), amp=1.0, phase=0.3))
L.append(glow('temple', 'lant', [(116, 212, 5, 5), (335, 212, 5, 5), (20, 262, 5, 5), (737, 272, 5, 5)],
              (255, 150, 60), 110, 60, 140))
p = leaf('temple', 'pet', [(242, 160, 190), (250, 190, 210), (226, 140, 170), (255, 205, 220)])
L.append('front parts 16 0 40 760 336 6 9 10 ' + ' '.join(p))
write('temple', L)

# ---------------------------------------------------------------- forest
bg = load('forest')
L = []
L.append(rays('forest', bg, (300, 0, 620, 260), 260, 10, 80))
L.append(mist('forest', 'mist', 150, 120, (220, 230, 220), 3, 70, 120, 400))
m = dots('forest', 'mote', [(255, 250, 210), (250, 240, 190), (255, 255, 230)], [(1, 1), (2, 1), (1, 1)])
L.append('parts 14 330 20 600 250 1 -3 8 ' + ' '.join(m))
lf = leaf('forest', 'leaf', [(120, 140, 50), (150, 120, 50), (95, 120, 40), (170, 140, 70)])
L.append('front parts 9 0 0 760 336 4 8 14 ' + ' '.join(lf))
write('forest', L)
foreground('forest', bg, [(0, 296, 70, 336), (690, 300, 760, 336)],
           lambda s: (s[..., 1] > s[..., 0] * 1.08) & (s[..., 1] > s[..., 2] * 1.25) & (s[..., 1] > 60))

print('ok', len(os.listdir(FX)), 'files')
