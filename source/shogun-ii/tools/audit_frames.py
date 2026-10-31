# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Check every fighter's frames against how the engine draws them: player 1
frames are drawn from their top-left corner, player 2 frames are mirrored and
lined up on their right edge using the move's _w from char.ini.  Reports frames
whose width doesn't match the ini and frames whose torso jumps sideways
compared with the stance."""
import glob, os, re, sys
import numpy as np
from PIL import Image

ROOT = os.environ.get('ROOT', 'data/sprites')
# move -> ini width key ('' = uses static_w, the fighter's base width)
WKEY = {'static': '', 'walk': '', 'jump': '', 'crouch': '', 'block': '', 'gblock': '',
        'hurt': '', 'ghurt': '', 'ko': 'ko_w', 'intro': 'intro_w', 'outwin': 'outwin_w',
        'wpunch': 'wpunch_w', 'spunch': 'spunch_w', 'wkick': 'wkick_w', 'skick': 'skick_w',
        'gpunch': 'gpunch_w', 'gkick': 'gkick_w', 'apunch': 'apunch_w', 'akick': 'akick_w',
        'fireb': 'fireb_w', 'firebx': 'firebx_w', 'smove': 'smove_w', 'smovex': 'smovex_w',
        'rush': 'rush_w', 'rushx': 'rushx_w'}


def ini_of(cid):
    d = {}
    for line in open(f'{ROOT}/{cid}/char.ini', errors='replace'):
        m = re.match(r'\s*(\w+)\s*=\s*(-?\d+)', line)
        if m: d[m.group(1).lower()] = int(m.group(2))
    return d


def mask(p):
    a = np.asarray(Image.open(p).convert('RGB'))
    return ~((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255))


def torso_x(m):
    ys, xs = np.where(m)
    if not len(ys): return None
    top, bot = ys.min(), ys.max()
    band = (ys > top + .25 * (bot - top)) & (ys < top + .55 * (bot - top))
    return float(np.median(xs[band])) if band.any() else float(np.median(xs))


def frames(cid, mv):
    out = []
    for i in range(1, 40):
        p = f'{ROOT}/{cid}/{mv}{i}.pcx'
        if not os.path.exists(p): break
        out.append(p)
    return out


def audit(cid):
    ini = ini_of(cid)
    base = ini.get('static_w')
    st = torso_x(mask(f'{ROOT}/{cid}/static1.pcx'))
    rows = []
    for mv, key in WKEY.items():
        fs = frames(cid, mv)
        if not fs: continue
        want = ini.get(key, base) if key else base
        for p in fs:
            m = mask(p)
            w = m.shape[1]
            tx = torso_x(m)
            # player 2 sees this frame mirrored with its right edge at base width
            tx2 = (want - 1 - tx) - (want - base) if tx is not None else None
            st2 = base - 1 - st
            flags = []
            if want and w != want: flags.append(f'width {w} != ini {want}')
            if tx is not None and abs(tx - st) > 14: flags.append(f'torso {tx - st:+.0f}px vs stance')
            if tx2 is not None and abs(tx2 - st2) > 14 and w == want: pass
            rows.append((os.path.basename(p), w, round(tx - st) if tx is not None else None, flags))
    return rows


if __name__ == '__main__':
    for cid in sys.argv[1:] or sorted(d for d in os.listdir(ROOT) if os.path.isfile(f'{ROOT}/{d}/char.ini')):
        bad = [r for r in audit(cid) if r[3]]
        print(f'== {cid}: {len(bad)} flagged')
        for r in bad: print('  ', r[0], '; '.join(r[3]))
