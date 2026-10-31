# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Draw Shogun II's own hit sparks over the stock KOF91 ones.
wimpact (light hit) 45x50 x6, simpact (heavy hit) 70x90 x6, bimpact (block) 65x60 x8.
The engine draws them 2/3 opaque, centred on the hit point.  python3 tools/hit_sparks.py"""
import os, sys, math, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(__file__))
from pcxw import save_pcx24

S = 4  # supersample
OUT = 'data/sprites'
BK = 'removed/impacts_stock'


def render(w, h, draw_fn):
    rgb = Image.new('RGB', (w * S, h * S), (0, 0, 0))
    a = Image.new('L', (w * S, h * S), 0)
    draw_fn(ImageDraw.Draw(rgb), ImageDraw.Draw(a), w * S / 2, h * S / 2)
    rgb = np.asarray(rgb.resize((w, h), Image.LANCZOS)).astype(np.float32)
    al = np.asarray(a.resize((w, h), Image.BOX)).astype(np.float32) / 255
    m = al > 0.32
    c = np.where(al[..., None] > 0.01, rgb / np.maximum(al[..., None], 0.01), 0)
    c = np.clip(c, 0, 255).astype(np.uint8)
    c[~m] = [255, 0, 255]
    k = m & (c[..., 0] == 255) & (c[..., 1] == 0) & (c[..., 2] == 255)
    c[k] = [254, 0, 254]
    return c


def streaks(dr, da, cx, cy, n, r0, r1, wid, col, seed, cone=None, jitter=0.35):
    rng = np.random.default_rng(seed)
    for i in range(n):
        ang = 2 * math.pi * i / n + rng.uniform(-jitter, jitter)
        if cone is not None:
            ang = rng.uniform(-cone, cone)
        ln = rng.uniform(0.6, 1.0)
        a0, a1 = r0 * ln, r1 * ln
        x0, y0 = cx + math.cos(ang) * a0, cy + math.sin(ang) * a0
        x1, y1 = cx + math.cos(ang) * a1, cy + math.sin(ang) * a1
        px, py = -math.sin(ang) * wid, math.cos(ang) * wid
        poly = [(x0 + px, y0 + py), (x1, y1), (x0 - px, y0 - py)]
        dr.polygon(poly, fill=tuple(int(v) for v in col)); da.polygon(poly, fill=255)


def blob(dr, da, cx, cy, r, col):
    if r <= 0:
        return
    box = [cx - r, cy - r, cx + r, cy + r]
    dr.ellipse(box, fill=tuple(int(v) for v in col)); da.ellipse(box, fill=255)


def ring(dr, da, cx, cy, r, wid, col):
    box = [cx - r, cy - r, cx + r, cy + r]
    dr.ellipse(box, outline=tuple(int(v) for v in col), width=int(wid)); da.ellipse(box, outline=255, width=int(wid))


def lerp(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(3))


HOT = (255, 250, 225); GOLD = (255, 205, 90); ORANGE = (255, 130, 35); RED = (200, 50, 20)


def hit(w, h, n, size, seed):
    frames = []
    for k in range(n):
        t = k / (n - 1)
        def fn(dr, da, cx, cy, t=t):
            R = min(cx, cy) * 0.95
            grow = 0.45 + 0.55 * math.sqrt(t)
            # outer streaks: orange, thinning as they fly out
            if t > 0.05:
                streaks(dr, da, cx, cy, 10 + size * 4, R * (0.15 + 0.6 * t), R * grow,
                        S * (3.6 - 2.4 * t) * (1 + size * .3), lerp(GOLD, RED, t), seed + 1)
            # inner star
            if t < 0.8:
                streaks(dr, da, cx, cy, 7 + size * 2, 0, R * (0.8 + 0.2 * t) * (1 - 0.4 * t),
                        S * (5 - 3.5 * t) * (1 + size * .4), lerp(HOT, GOLD, t * 1.2), seed)
            blob(dr, da, cx, cy, R * (0.33 if size else 0.28) * (1 - t) ** 1.4, HOT)
            if size and 0.15 < t < 0.85:
                ring(dr, da, cx, cy, R * (0.35 + 0.6 * t), S * 2.2 * (1 - t) + S, lerp(GOLD, ORANGE, t))
        frames.append(render(w, h, fn))
    return frames


STEEL = (235, 248, 255); CYAN = (130, 210, 255); BLUE = (60, 120, 230)


def block(w, h, n, seed):
    frames = []
    for k in range(n):
        t = k / (n - 1)
        def fn(dr, da, cx, cy, t=t):
            R = min(cx, cy) * 0.95
            if t < 0.75:
                streaks(dr, da, cx, cy, 8, 0, R * (0.7 + 0.3 * t), S * (4.5 - 3.5 * t), lerp(STEEL, CYAN, t / .75), seed, jitter=0.15)
            # sparks: thin needles flying out
            streaks(dr, da, cx, cy, 14, R * (0.2 + 0.7 * t), R * (0.45 + 0.55 * t), S * (2.2 - 1.2 * t), lerp(STEEL, BLUE, t), seed + 3)
            ring(dr, da, cx, cy, R * (0.25 + 0.65 * t), S * (3 * (1 - t) + 1), lerp(CYAN, BLUE, t))
            blob(dr, da, cx, cy, R * 0.22 * (1 - t / 0.6) if t < 0.6 else 0, STEEL)
        frames.append(render(w, h, fn))
    return frames


def main():
    os.makedirs(BK, exist_ok=True)
    sets = (('wimpact', hit(45, 50, 6, 0, 11)), ('simpact', hit(70, 90, 6, 1, 23)), ('bimpact', block(65, 60, 8, 31)))
    for name, frames in sets:
        for i, f in enumerate(frames, 1):
            p = '%s/%s%d.pcx' % (OUT, name, i)
            if os.path.exists(p) and not os.path.exists('%s/%s%d.pcx' % (BK, name, i)):
                shutil.copy(p, BK)
            save_pcx24(p, f)
    strip = np.concatenate([np.pad(f, ((0, 90 - f.shape[0]), (0, 4), (0, 0)), constant_values=40) for _, fr in sets for f in fr], 1)
    Image.fromarray(strip).resize((strip.shape[1] * 2, 180), Image.NEAREST).save('audit/sparks.png')


if __name__ == '__main__':
    main()
