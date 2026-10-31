# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Keero's two non-fireball specials, redone so they read as moves.

* Fatal Kick (smove, L R K): photo 55 is his airborne kick, but the leg points
  away from the opponent and was cut off the frame.  Mirror it so the turn
  (52-54) ends in a spinning back kick toward the opponent, in the air.
* Uppercut (rush, L R P), from the 1996 move list: the 60-63 rising-fist
  photos now actually rise off the ground.

Both need headroom, so every Keero frame gets T px of empty space on top and
the ini's height and y offsets move down to match.  Runs on the finished
(softened, shrunk) sprites; run tools/fit_frames.py keero afterwards."""
import os, re, sys, tempfile
import numpy as np
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from pcxw import save_pcx24
import build_keero as bk
from soften_ink import soften
from shrink_cast import shrink_frame
from audit_frames import mask

D = 'data/sprites/keero'
T = 30                                  # headroom added on top (game pixels)
K = 0.75                                # the cast shrink
RUSH_LIFT = [0, 0, 0, 0, 0]   # v33: the rush is now a ground lunge punch (no rise)
KICK_LIFT = 16
KICK_SCALE = 0.82
KEY = np.array((255, 0, 255), np.uint8)


def load(p): return np.asarray(Image.open(p).convert('RGB')).copy()


def pad_top(a, t):
    return np.concatenate([np.tile(KEY, (t, a.shape[1], 1)), a], 0)


def lift(a, n):
    if n <= 0: return a
    out = np.tile(KEY, (a.shape[0], a.shape[1], 1))
    out[:-n] = a[n:]
    return out


def reach(a):
    m = mask_of(a); xs = np.where(m.any(0))[0]; x = xs.max()
    return int(x), int(np.median(np.where(m[:, x])[0]))


def mask_of(a): return ~((a[..., 0] == 255) & (a[..., 1] == 0) & (a[..., 2] == 255))


def main():
    ini = open(f'{D}/char.ini', newline='').read()
    if '# keero specials' in ini: print('already done'); return
    h0 = int(re.search(r'(?m)^height\s*=\s*(\d+)', ini).group(1))
    # 1. headroom on every frame
    for f in os.listdir(D):
        n = os.path.splitext(f)[0].lower()
        if not f.lower().endswith('.pcx') or n in ('selbig', 'selsmall', 'endimg') or n.startswith('fball'):
            continue
        save_pcx24(f'{D}/{f}', pad_top(load(f'{D}/{f}'), T))
    def shift(m):
        k = m.group(1)
        if k.startswith('fball'): return m.group(0) if not k.endswith('_cy') else f'{k}{m.group(2)}{int(m.group(3)) + T}'
        return f'{k}{m.group(2)}{int(m.group(3)) + T}'
    ini = re.sub(r'(?m)^(\w+_(?:offy|defy|cy))(\s*=\s*)(-?\d+)', shift, ini)
    ini = re.sub(r'(?m)^height\s*=\s*\d+', f'height = {h0 + T}', ini)
    # 2. uppercut rises
    for i, l in enumerate(RUSH_LIFT, 1):
        p = f'{D}/rush{i}.pcx'; save_pcx24(p, lift(load(p), l))
    rx, ry = reach(load(f'{D}/rush4.pcx'))
    # 3. the kick: mirrored photo 55, built at full size like the rest of him
    a, cx = bk.frame(55, flip=True)
    # the jump photo was shot closer to the camera: bring him back to his size
    img = Image.fromarray(a, 'RGBA'); s = KICK_SCALE
    img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    a = np.array(img); a[..., 3] = np.where(a[..., 3] > 140, 255, 0); cx *= s
    full_h = round((h0 + T) / K)
    w_full = max(round(int(re.search(r'(?m)^smove_w\s*=\s*(\d+)', ini).group(1)) / K), int(bk.X0 - cx + a.shape[1]) + 4)
    can = bk.place(a, cx, w_full, height=full_h, lift=round(KICK_LIFT / K))
    tmp = os.path.join(tempfile.mkdtemp(), 'k.pcx')
    save_pcx24(tmp, can); soften(tmp); shrink_frame(tmp, K)
    kick = load(tmp)
    for i in (4, 5): save_pcx24(f'{D}/smove{i}.pcx', kick)
    kx, ky = reach(kick)
    for k, v in (('rush_hit', 4), ('rush_offx', rx), ('rush_offy', ry),
                 ('smove_hit', 4), ('smove_offx', kx), ('smove_offy', ky), ('smove_w', kick.shape[1])):
        ini = re.sub(rf'(?m)^{k}\s*=\s*-?\d+', f'{k} = {v}', ini) if re.search(rf'(?m)^{k}\s*=', ini) \
            else ini.rstrip('\r\n') + f'\r\n{k} = {v}\r\n'
    ini = ini.replace('# Dragon Punch', '# Lunge Punch (back, forward + punch)')
    ini = ini.rstrip('\r\n') + '\r\n# keero specials\r\n'
    open(f'{D}/char.ini', 'w', newline='').write(ini)
    print('keero: height', h0 + T, 'kick frame', kick.shape, 'reach', (kx, ky), 'uppercut reach', (rx, ry))


if __name__ == '__main__':
    main()
