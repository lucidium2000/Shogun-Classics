# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Scale every fighter down so they sit smaller in the stages: all move and
projectile frames are resized (magenta stays a hard transparent key) and every
pixel measure in char.ini (hit boxes, widths, height) is scaled to match.
Portraits (selbig, selsmall, endimg) keep their size.  Run once on fresh
sprites: a marker line in char.ini stops it from scaling twice.

usage: python3 tools/shrink_cast.py SCALE [cid ...]"""
import glob, os, re, sys
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from pcxw import save_pcx24

ROOT = 'data/sprites'
KEEP = {'selbig', 'endimg'}
PIXEL = re.compile(r'^(\w+_(offx|offy|defx|defy|w|h|cx|cy)|height)$')


def shrink_frame(path, k):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    key = (a[..., 0] > 250) & (a[..., 1] < 5) & (a[..., 2] > 250)
    alpha = (~key).astype(np.float32)
    h, w = key.shape
    size = (max(1, round(w * k)), max(1, round(h * k)))
    def rs(ch):
        return np.asarray(Image.fromarray(ch).resize(size, Image.LANCZOS))
    al = np.clip(rs(alpha), 0, 1)
    rgb = np.stack([rs(a[..., c] * alpha) for c in range(3)], -1) / np.maximum(al, 1e-3)[..., None]
    out = np.clip(rgb, 0, 255).astype(np.uint8)
    out[al < .5] = (255, 0, 255)
    # a solid pixel that lands exactly on the key colour would vanish
    hit = (al >= .5) & (out[..., 0] == 255) & (out[..., 1] == 0) & (out[..., 2] == 255)
    out[hit] = (254, 0, 254)
    save_pcx24(path, out)


def shrink(cid, k):
    d = os.path.join(ROOT, cid)
    ini = open(os.path.join(d, 'char.ini'), newline='').read()
    if '# shrunk' in ini and not AGAIN:
        print(cid, 'already shrunk, skipped'); return
    for p in glob.glob(os.path.join(d, '*.pcx')):
        n = os.path.splitext(os.path.basename(p))[0].lower()
        if n in KEEP or n.startswith('selsmall'): continue
        shrink_frame(p, k)
    def fix(m):
        key, val = m.group(1), m.group(3)
        return f'{key}{m.group(2)}{round(int(val) * k)}' if PIXEL.match(key.strip()) else m.group(0)
    ini = re.sub(r'(?m)^(\w+)(\s*=\s*)(-?\d+)', fix, ini)
    ini = ini.rstrip('\r\n') + (f'\r\n# rescaled by {k}\r\n' if AGAIN else f'\r\n# shrunk to {k}\r\n')
    open(os.path.join(d, 'char.ini'), 'w', newline='').write(ini)
    print(cid, 'shrunk to', k)


AGAIN = False

if __name__ == '__main__':
    if sys.argv[1] == '--again':          # resize sprites that were already shrunk
        AGAIN = True; sys.argv.pop(1)
    k = float(sys.argv[1])
    for cid in sys.argv[2:] or sorted(os.listdir(ROOT)):
        if os.path.isfile(os.path.join(ROOT, cid, 'char.ini')): shrink(cid, k)
