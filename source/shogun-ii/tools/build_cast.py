# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
"""Turn the rendered Shogun cast frames (cast/out/<id>/*.png) into KOF91
character folders: 24-bit PCX frames on magenta plus a char.ini."""
import os, sys, json, glob, re
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from pcxw import save_pcx24

SRC = '/home/claude/k91/cast/out'
DST = '/home/claude/k91/data/sprites'
OX, OY = 260, 300          # feet position in the rendered frames
H = 196                     # sprite frame height (= "height" in char.ini)
MAG = (255, 0, 255)

MOVES = ['static', 'walk', 'jump', 'crouch', 'block', 'gblock', 'hurt', 'ghurt', 'ko', 'intro', 'outwin',
         'wpunch', 'spunch', 'wkick', 'skick', 'gpunch', 'gkick', 'apunch', 'akick', 'fireb', 'firebx', 'smove']
ATTACKS = ['wpunch', 'spunch', 'wkick', 'skick', 'gpunch', 'gkick', 'apunch', 'akick']
HIT = {'wpunch': 3, 'spunch': 3, 'wkick': 3, 'skick': 3, 'gpunch': 3, 'gkick': 3, 'apunch': 3, 'akick': 3}

# per-fighter tuning: names as the select screen shows them (the 2000 font
# has no macrons), special-move inputs and damage, AI flavour
CAST = {
    'shokei':  dict(name="SHOKEI", smove_exec='L R K *', smove_dmg=5, smove_rot=1,
                    fireb_exec='D R P *', fireb=1, firebx=1, desc='Blade Dash'),
    'wanfu':   dict(name="WAN'FU", smove_exec='L R K *', smove_dmg=6, smove_rot=0,
                    fireb_exec='D R P *', fireb=1, firebx=0, desc='Mountain Stomp',
                    extra=['hard_off = 85', 'hard_def = 50', 'medium_off = 60']),
    'yamana':  dict(name="YAMANA", smove_exec='L R K *', smove_dmg=5, smove_rot=1,
                    fireb_exec='D R P *', fireb=1, firebx=0, desc='Whirling Bo'),
    'frill':   dict(name="FRILL", smove_exec='L R K *', smove_dmg=6, smove_rot=0,
                    fireb_exec='D R P *', fireb=1, firebx=1, desc='White Blast',
                    extra=['hard_off = 85', 'hard_def = 75', 'medium_off = 60', 'medium_def = 75']),
    'onikage': dict(name="LORD ONIKAGE", smove_exec='L R K *', smove_dmg=7, smove_rot=0,
                    fireb_exec='D R P *', fireb=1, firebx=1, desc='Shadow Flame',
                    extra=['easy_off = 50', 'easy_def = 70', 'medium_off = 70', 'medium_def = 75',
                           'hard_off = 90', 'hard_def = 80']),
}


def load(path):
    a = np.array(Image.open(path).convert('RGBA'))
    return a


def frames_of(cid, mv):
    fs = sorted(glob.glob(f'{SRC}/{cid}/{mv}[0-9]*.png'), key=lambda f: int(re.findall(r'(\d+)\.png$', f)[0]))
    return [load(f) for f in fs]


def to_rgb(a):
    """alpha-threshold onto magenta; keep real pixels off the mask colour"""
    rgb = a[..., :3].copy()
    sel = a[..., 3] > 110
    mag = (rgb[..., 0] > 247) & (rgb[..., 1] < 8) & (rgb[..., 2] > 247)
    rgb[mag] = (247, 8, 247)
    out = np.zeros_like(rgb)
    out[:] = MAG
    out[sel] = rgb[sel]
    return out, sel


def opaque(rgb):
    return ~((rgb[..., 0] == 255) & (rgb[..., 1] == 0) & (rgb[..., 2] == 255))


def build(cid):
    cfg = CAST[cid]
    meta = json.load(open(f'{SRC}/{cid}/meta.json'))
    d = os.path.join(DST, cid)
    os.makedirs(d, exist_ok=True)
    for f in glob.glob(d + '/*'):
        os.remove(f)

    top, bot = OY + 3 - H, OY + 3
    allf = {mv: [to_rgb(a[top:bot]) for a in frames_of(cid, mv)] for mv in MOVES}

    # one shared horizontal anchor so the fighter never jumps between moves
    # (measured on the standing moves only, and capped, so a sword or staff
    #  trailing behind doesn't make the engine think the fighter is huge)
    left = 0
    for mv in ('static', 'walk', 'wpunch', 'spunch', 'wkick'):
        for rgb, sel in allf[mv]:
            body = sel[:, OX - 90:OX + 20]
            cols = np.nonzero(body.any(0))[0]
            if len(cols):
                left = max(left, 90 - cols.min())
    left = min(left + 4, 78)
    x0 = OX - left

    widths, out = {}, {}
    for mv, fl in allf.items():
        right = 30
        for rgb, sel in fl:
            cols = np.nonzero(sel.any(0))[0]
            if len(cols):
                right = max(right, cols.max() - OX)
        w = int(max(left + right + 3, 90))
        widths[mv] = w
        out[mv] = []
        for i, (rgb, sel) in enumerate(fl):
            can = np.zeros((H, w, 3), np.uint8)
            can[:] = MAG
            seg = rgb[:, x0:x0 + w]
            can[:, :seg.shape[1]] = seg
            out[mv].append(can)
            name = f'{mv}1.pcx' if mv in ('crouch', 'block', 'gblock') else f'{mv}{i + 1}.pcx'
            save_pcx24(os.path.join(d, name), can)

    def reach(can):
        op = opaque(can)
        cols = np.nonzero(op.any(0))[0]
        x = int(cols.max())
        y = int(np.median(np.nonzero(op[:, x])[0]))
        return x, y

    def body(can):
        op = opaque(can)
        ys = np.nonzero(op.any(1))[0]
        y = int(ys.min() + (ys.max() - ys.min()) * 0.25)
        xs = np.nonzero(op[y])[0]
        return (int(xs.max()) if len(xs) else left), y

    ini = [f'[{cid}]']
    for mv in ['static', 'walk', 'jump', 'crouch'] + ATTACKS + ['hurt', 'block', 'ghurt', 'gblock', 'intro']:
        dx, dy = body(out[mv][0])
        if mv in ATTACKS:
            ox, oy = reach(out[mv][HIT[mv] - 1])
        else:
            ox, oy = 20, 20
        ini += [f'{mv}_defx = {dx}', f'{mv}_defy = {dy}', f'{mv}_offx = {ox}', f'{mv}_offy = {oy}']

    fx, fy = reach(out['fireb'][4])
    smx, smy = reach(out['smove'][3])
    ini += [
        'fball_defx = 10', 'fball_defy = 10', 'fball_offx = 60', 'fball_offy = 12',
        'fballx_defx = 10', 'fballx_defy = 10', 'fballx_offx = 100', 'fballx_offy = 45',
        'smove_defx = 10', 'smove_defy = 10', f'smove_offx = {smx}', f'smove_offy = {smy}',
        '',
        f'# {cfg["desc"]}',
        'smove = 1', f'smove_w = {widths["smove"]}', 'smove_nbf = 8', 'smove_hit = 4', 'smove_spd = 6',
        f'smove_rot = {cfg["smove_rot"]}', f'smove_dmg = {cfg["smove_dmg"]}', f'smove_exec = {cfg["smove_exec"]}',
        '',
        f'fireb = {cfg["fireb"]}', f'fireb_w = {widths["fireb"]}', 'fireb_nbf = 6', 'fireb_hit = 5', 'fireb_spd = 6',
        f'fireb_exec = {cfg["fireb_exec"]}',
        'fball_h = 24', 'fball_dmg = 4', 'fball_w = 64', 'fball_nbf = 4', 'fball_spd = 2', 'fball_pix = 4',
        f'fball_cx = {max(0, fx - 20)}', f'fball_cy = {max(0, fy - 12)}',
        '',
        f'firebx = {cfg["firebx"]}', f'firebx_w = {widths["firebx"]}', 'firebx_nbf = 7', 'firebx_hit = 5', 'firebx_spd = 8',
        'firebx_exec = L R P *',
        'fballx_h = 90', 'fballx_dmg = 9', 'fballx_w = 110', 'fballx_nbf = 4', 'fballx_spd = 5', 'fballx_pix = 3',
        f'fballx_cx = {max(0, fx - 40)}', f'fballx_cy = {max(0, fy - 45)}',
        '',
        'smovex = 0',
        '',
        f'name = {cfg["name"]}',
        f'height = {H}',
        '',
    ]
    for mv in ['static', 'spunch', 'wpunch', 'skick', 'wkick', 'apunch', 'gpunch', 'akick', 'gkick', 'intro', 'ko', 'outwin']:
        ini.append(f'{mv}_w = {widths[mv]}')
    ini += ['',
            'walk_nbf = 5', 'walk_spd = 8', 'static_nbf = 4', 'static_spd = 12',
            'hurt_nbf = 3', 'ghurt_nbf = 2', 'intro_nbf = 15', 'outwin_nbf = 11', 'outwin_spd = 8',
            'spunch_nbf = 5', 'spunch_spd = 6', 'spunch_hit = 3', 'spunch_dmg = 3',
            'wpunch_nbf = 4', 'wpunch_spd = 5', 'wpunch_hit = 3', 'wpunch_dmg = 2',
            'skick_nbf = 5', 'skick_spd = 6', 'skick_hit = 3', 'skick_dmg = 3',
            'wkick_nbf = 5', 'wkick_spd = 5', 'wkick_hit = 3', 'wkick_dmg = 2',
            'apunch_nbf = 4', 'apunch_spd = 6', 'apunch_hit = 3',
            'gpunch_nbf = 5', 'gpunch_spd = 6', 'gpunch_hit = 3',
            'akick_nbf = 5', 'akick_spd = 6', 'akick_hit = 3',
            'gkick_nbf = 8', 'gkick_spd = 5', 'gkick_hit = 3',
            ''] + cfg.get('extra', [])
    open(os.path.join(d, 'char.ini'), 'w').write('\r\n'.join(ini) + '\r\n')

    # projectiles
    for kind in ('fball', 'fballx'):
        for i in range(1, 5):
            rgb, _ = to_rgb(load(f'{SRC}/{cid}/{kind}{i}.png'))
            save_pcx24(os.path.join(d, f'{kind}{i}.pcx'), rgb)

    # portraits
    p = Image.open(f'{SRC}/{cid}/portrait.png').convert('RGB')
    save_pcx24(os.path.join(d, 'selbig.pcx'), np.array(p.resize((100, 99), Image.LANCZOS)))
    save_pcx24(os.path.join(d, 'selsmall.pcx'), np.array(p.resize((26, 26), Image.LANCZOS)))

    # voices are added by tools/install_voices.py
    print(cid, 'widths', widths)


if __name__ == '__main__':
    for cid in (sys.argv[1:] or CAST):
        build(cid)
