# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Build the Keero character folder for KOF91 from the 2004 Keerofixed photos.

Photos are cut out with masks from rembg (u2net_human_seg), cleaned, scaled so
a standing Keero matches Classic Ken's size, and written as 24-bit PCX frames
with magenta (255,0,255) as the transparent colour, like the other fighters.
"""
import os, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageFont
from scipy import ndimage

sys.path.insert(0, os.path.dirname(__file__))
from pcxw import save_pcx24
import pcx

SRC = '/home/claude/k91/keero'
OUT = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/k91/data/sprites/keero'
MAG = np.array([255, 0, 255], np.uint8)

H = 160          # frame height (feet on the bottom row) = "height" in char.ini
X0 = 52          # where the chest centre sits horizontally in every frame
STAND_H = 140    # Keero standing: 10% smaller than the first cut, same height as the cast


def photo(n):
    return f'{SRC}/P10100{n:02d}.JPG'


def cutout(n):
    from PIL import ImageEnhance
    pim = Image.open(photo(n)).convert('RGB')
    # the 2004 indoor photos are dim; lift them to sit with the other fighters
    pim = ImageEnhance.Contrast(ImageEnhance.Brightness(pim).enhance(1.15)).enhance(1.22)
    pim = ImageEnhance.Color(pim).enhance(1.12)
    im = np.array(pim)
    m = np.array(Image.open(f'{SRC}/mask_h/P10100{n:02d}.png').convert('L')) > 128
    ys, xs = np.nonzero(m)
    top, bot = ys.min(), ys.max()
    # red carpet sometimes gets included under a kneeling Keero: drop
    # carpet-coloured blobs in the lower part of the figure
    r, g, b = [im[..., i].astype(int) for i in range(3)]
    carpet = (r > 25) & (r < 140) & (g < 45) & (b < 60) & (r > 1.9 * g) & (r > 1.6 * b) & m
    carpet[: top + int((bot - top) * 0.62)] = False
    lab, nl = ndimage.label(carpet)
    for i in range(1, nl + 1):
        if (lab == i).sum() > 250:
            m &= lab != i
    # around the feet the cut-out also grabbed floor (the tan carpet edge,
    # the red rug, cables and shadows), which made the feet look like big
    # socks. Learn the floor colours from just outside the cut-out and the
    # gi colours from his shins, then give each foot-zone pixel to whichever
    # it is closer to. Black shoes are kept as shoes.
    from scipy.spatial import cKDTree
    h = bot - top
    low = top + int(h * 0.84)
    shin0 = top + int(h * 0.62)
    lab = im.astype(np.float32)
    near = ndimage.binary_dilation(m, iterations=25) & ~ndimage.binary_dilation(m, iterations=3)
    zone = np.zeros_like(m); zone[low:] = True
    bg = lab[near & zone]
    fgm = m.copy(); fgm[:shin0] = False; fgm[low:] = False
    fg = lab[fgm]
    if len(bg) > 50 and len(fg) > 50:
        rs = np.random.RandomState(1)
        bg = bg[rs.choice(len(bg), min(4000, len(bg)), replace=False)]
        fg = fg[rs.choice(len(fg), min(4000, len(fg)), replace=False)]
        tb, tf = cKDTree(bg), cKDTree(fg)
        cand = m & zone
        px = lab[cand]
        db = tb.query(px, k=5)[0].mean(1)
        df = tf.query(px, k=5)[0].mean(1)
        f = px / 255
        mx, mn = f.max(1), f.min(1)
        shoe = (mx < 0.25) & (f[:, 1] < 0.08)          # his black shoes (rug is redder)
        keep = (df <= db * 1.1) | shoe
        drop = np.zeros_like(m); drop[cand] = ~keep
        m &= ~drop
        m = ndimage.binary_opening(m, iterations=1)
        m = ndimage.binary_fill_holes(m)
    # keep the main body plus any big attached parts, drop specks
    m = ndimage.binary_opening(m, iterations=1)
    lab, nl = ndimage.label(m)
    if nl > 1:
        sizes = ndimage.sum(m, lab, range(1, nl + 1))
        keep = [i + 1 for i, s in enumerate(sizes) if s >= 0.04 * sizes.max()]
        body = np.isin(lab, keep)
        # a shoe can end up split from the trouser hem: keep small pieces
        # that sit right next to the body
        near_body = ndimage.binary_dilation(body, iterations=6)
        for i, s in enumerate(sizes):
            if i + 1 not in keep and s >= 60 and (near_body & (lab == i + 1)).any():
                keep.append(i + 1)
        m = np.isin(lab, keep)
    m = ndimage.binary_fill_holes(m)
    # pull the edge in by a pixel so no wall colour fringes remain
    m = ndimage.binary_erosion(m, iterations=1)
    return im, m


def chest_x(m):
    ys, xs = np.nonzero(m)
    top, bot = ys.min(), ys.max()
    band = m[top + int((bot - top) * 0.22): top + int((bot - top) * 0.45)]
    cols = np.nonzero(band.any(0))[0]
    # median of the band's filled pixels approximates the torso centre
    yy, xx = np.nonzero(band)
    return float(np.median(xx))


_scale_cache = {}


def scale_for(n):
    """photos 1-22 and 23-63 were shot at different zooms; normalise each set
    by Keero's standing height in that set"""
    group = 0 if n <= 22 else 1
    if group not in _scale_cache:
        ref = [1, 4, 6] if group == 0 else [23, 24, 25, 26, 32]
        hs = []
        for k in ref:
            _, m = cutout(k)
            ys = np.nonzero(m.any(1))[0]
            hs.append(ys.max() - ys.min())
        _scale_cache[group] = STAND_H / float(np.median(hs))
    return _scale_cache[group]


def frame(n, flip=False):
    """returns an RGBA numpy image of Keero scaled, plus the chest x and feet y"""
    im, m = cutout(n)
    ys, xs = np.nonzero(m)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    cx = chest_x(m) - x0
    rgba = np.dstack([im, (m * 255).astype(np.uint8)])[y0:y1, x0:x1]
    s = scale_for(n)
    img = Image.fromarray(rgba, 'RGBA')
    w, h = max(1, round(img.width * s)), max(1, round(img.height * s))
    img = img.resize((w, h), Image.LANCZOS)
    a = np.array(img)
    a[..., 3] = np.where(a[..., 3] > 140, 255, 0)
    cx *= s
    if flip:
        a = a[:, ::-1]
        cx = w - cx
    return a, cx


def place(a, cx, width, height=H, lift=0, x_anchor=X0):
    """paste a cut-out onto a magenta canvas with the chest at x_anchor and
    the lowest pixel on the bottom row (minus lift)"""
    can = np.zeros((height, width, 3), np.uint8)
    can[:] = MAG
    h, w = a.shape[:2]
    dx = int(round(x_anchor - cx))
    dy = height - h - lift
    sx0, sy0 = max(0, -dx), max(0, -dy)
    tx0, ty0 = max(0, dx), max(0, dy)
    ww, hh = min(w - sx0, width - tx0), min(h - sy0, height - ty0)
    if ww > 0 and hh > 0:
        src = a[sy0:sy0 + hh, sx0:sx0 + ww]
        sel = src[..., 3] > 0
        rgb = src[..., :3].copy()
        # a real pixel must never be exactly the transparent colour
        mag = (rgb[..., 0] > 247) & (rgb[..., 1] < 8) & (rgb[..., 2] > 247)
        rgb[mag] = [247, 8, 247]
        dst = can[ty0:ty0 + hh, tx0:tx0 + ww]
        dst[sel] = rgb[sel]
    # 1px dark ink outline, like a drawn fighting-game sprite
    op = opaque(can)
    ring = ndimage.binary_dilation(op) & ~op
    can[ring] = (22, 14, 12)
    return can


def opaque(can):
    return ~((can[..., 0] == 255) & (can[..., 1] == 0) & (can[..., 2] == 255))


# ---------------------------------------------------------------- move table
# photo numbers per move, chosen from the 2004 moves list
# (low kick/jump kick, crouch kick, crouch/jump punch, hurt, fall, intro, win,
#  fireball, punch, kick, fatal kick)
# 2026-10-31: re-grouped by shooting order (Chris: the photos were taken in
# series, so each move's photos sit together): 1-3 jump kick, 4-7 low kick,
# 8-11 crouch kick, 12-14 crouch/jump punch, 15-16 hurt, 17-22 fall,
# 23-33 intro (34-35, bent over a box, left out), 36-42 win, 43-45 fireball, 46-47 punch,
# 48-51 strong kick, 52-55 Fatal Kick, 59-63 uppercut
MOVES = {
    # fighting stance is the side-on guard (45); the "b"/"c" variants are the
    # same photo squashed a pixel or two so the stance breathes
    'static': ['45', '45b', '45c', '45b'],
    'walk':   ['45', 47, 4, 47, '45'],
    'jump':   ['36', '49', '49', '49', '36'],
    'crouch': [12],
    'block':  [38],
    'gblock': [13],
    'hurt':   [15, 16, 15],
    'ghurt':  [13, 14],
    'ko':     [17, 18, 19, 21, 22],
    # walks in, squares up, drops into the side-on guard
    'intro':  [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 33, '45', '45', '45'],
    # the front-facing poses are his victory celebration
    'outwin': [36, 37, 38, 39, 40, 41, 42, 41, 42, 41, 42],
    'wpunch': [47, 46, 46, 47],
    'spunch': ['45', 47, 46, 46, 47],
    'wkick':  [4, 5, 5, 6, 7],
    'skick':  [48, 49, 50, 51, 49],
    'gpunch': [12, 13, 14, 13, 12],
    'gkick':  [8, 9, 10, 11, 11, 10, 9, 8],
    'apunch': [12, 13, 14, 13],
    'akick':  [1, 2, 3, 3, 2],
    # plain fireball: hands gather at the hip, then push out
    'fireb':  [43, 44, 44, 45, 45, 43],
    'smove':  [52, 53, 54, 55, 55, 54, 53, 52],
    # dragon punch (engine "rush" slot): dip low, then the 60-63 uppercut
    'rush':   [59, 60, 61, 62, 63, 63],
}
FILE = {'static': 'static', 'walk': 'walk', 'jump': 'jump', 'crouch': 'crouch', 'block': 'block',
        'gblock': 'gblock', 'hurt': 'hurt', 'ghurt': 'ghurt', 'ko': 'ko', 'intro': 'intro',
        'outwin': 'outwin', 'wpunch': 'wpunch', 'spunch': 'spunch', 'wkick': 'wkick', 'skick': 'skick',
        'gpunch': 'gpunch', 'gkick': 'gkick', 'apunch': 'apunch', 'akick': 'akick', 'fireb': 'fireb',
        'smove': 'smove', 'rush': 'rush'}
# moves drawn in the air get lifted so they don't look like they're standing
LIFT = {'jump': 0, 'apunch': 0, 'akick': 0}

ATTACKS = ['wpunch', 'spunch', 'wkick', 'skick', 'gpunch', 'gkick', 'apunch', 'akick']
HIT = {'wpunch': 2, 'spunch': 3, 'wkick': 3, 'skick': 3, 'gpunch': 3, 'gkick': 4,
       'apunch': 3, 'akick': 3, 'fireb': 4, 'smove': 3, 'rush': 3}


def build():
    os.makedirs(OUT, exist_ok=True)
    cache = {}

    def get(n):
        if n not in cache:
            if isinstance(n, str):
                num, var = int(n.rstrip('bc')), n[-1]
                a, cx = get(num)
                squash = {'b': 0.985, 'c': 0.972}.get(var, 1.0)
                img = Image.fromarray(a, 'RGBA')
                img = img.resize((img.width, round(img.height * squash)), Image.LANCZOS)
                a = np.array(img)
                a[..., 3] = np.where(a[..., 3] > 140, 255, 0)
                cache[n] = (a, cx)
            else:
                cache[n] = frame(n)
        return cache[n]

    widths, info = {}, {}
    for mv, nums in MOVES.items():
        need = 115
        for n in nums:
            a, cx = get(n)
            need = max(need, int(X0 - cx + a.shape[1]) + 4)
        width = min(need, 260)
        if mv == 'ko':
            width = max(width, 200)
        widths[mv] = width
        frames = []
        for i, n in enumerate(nums):
            a, cx = get(n)
            anchor = X0
            if mv == 'ko' and i == len(nums) - 1:
                anchor = X0 + 20       # lying down: centre the body
            can = place(a, cx, width, lift=LIFT.get(mv, 0), x_anchor=anchor)
            frames.append(can)
            if mv in ('crouch', 'block', 'gblock'):
                name = f'{FILE[mv]}1.pcx'
            else:
                name = f'{FILE[mv]}{i + 1}.pcx'
            save_pcx24(os.path.join(OUT, name), can)
        info[mv] = frames

    # ghurt in the engine is numbered ghurt1/ghurt2
    # hit points: furthest-forward opaque pixel on the hit frame
    def reach(can):
        op = opaque(can)
        cols = np.nonzero(op.any(0))[0]
        x = cols.max()
        y = int(np.median(np.nonzero(op[:, x])[0]))
        return int(x), y

    def body(can):
        op = opaque(can)
        ys = np.nonzero(op.any(1))[0]
        top, bot = ys.min(), ys.max()
        y = top + int((bot - top) * 0.25)
        xs = np.nonzero(op[y])[0]
        return int(xs.max()) if len(xs) else X0, int(y)

    ini = ['[keero]']
    for mv in ['static', 'walk', 'jump', 'crouch'] + ATTACKS + ['hurt', 'block', 'ghurt', 'gblock', 'intro']:
        f = info[mv][0]
        dx, dy = body(f)
        if mv in ATTACKS:
            hf = info[mv][min(HIT[mv], len(info[mv])) - 1]
            ox, oy = reach(hf)
        else:
            ox, oy = 20, 20
        ini += [f'{mv}_defx = {dx}', f'{mv}_defy = {dy}', f'{mv}_offx = {ox}', f'{mv}_offy = {oy}']

    fx, fy = reach(info['fireb'][3])
    smx, smy = reach(info['smove'][2])
    ux, uy = reach(info['rush'][3])
    ini += [
        'fball_defx = 10', 'fball_defy = 10', 'fball_offx = 60', 'fball_offy = 12',
        f'smove_defx = 10', f'smove_defy = 10', f'smove_offx = {smx}', f'smove_offy = {smy}',
        f'rush_defx = 10', f'rush_defy = 10', f'rush_offx = {ux}', f'rush_offy = {uy}',
        '',
        '# Fatal Kick',
        'smove = 1', f'smove_w = {widths["smove"]}', 'smove_nbf = 8', 'smove_hit = 3', 'smove_spd = 6',
        'smove_rot = 1', 'smove_dmg = 5', 'smove_exec = L R K *',
        '',
        '# Fireball',
        'fireb = 1', f'fireb_w = {widths["fireb"]}', 'fireb_nbf = 6', 'fireb_hit = 4', 'fireb_spd = 6',
        'fireb_exec = D R P *',
        'fball_h = 24', 'fball_dmg = 4', 'fball_w = 64', 'fball_nbf = 4', 'fball_spd = 2', 'fball_pix = 4',
        f'fball_cx = {fx - 14}', f'fball_cy = {fy - 12}',
        '',
        '# Dragon Punch',
        'rush = 1', f'rush_w = {widths["rush"]}', 'rush_nbf = 6', 'rush_hit = 2', 'rush_spd = 5',
        'rush_rot = 1', 'rush_pix = 4', 'rush_dmg = 5', 'rush_exec = L R P *',
        '',
        'firebx = 0',
        'smovex = 0',
        '',
        'name = KEERO',
        f'height = {H}',
        '',
    ]
    for mv in ['static', 'spunch', 'wpunch', 'skick', 'wkick', 'apunch', 'gpunch', 'akick', 'gkick', 'intro', 'ko', 'outwin']:
        ini.append(f'{mv}_w = {widths[mv]}')
    ini += ['',
            'walk_nbf = 5', 'walk_spd = 8', 'static_nbf = 4', 'static_spd = 12',
            'hurt_nbf = 3', 'ghurt_nbf = 2', 'intro_nbf = 15', 'outwin_nbf = 11', 'outwin_spd = 8',
            'spunch_nbf = 5', 'spunch_spd = 6', 'spunch_hit = 3', 'spunch_dmg = 3',
            'wpunch_nbf = 4', 'wpunch_spd = 5', 'wpunch_hit = 2', 'wpunch_dmg = 2',
            'skick_nbf = 5', 'skick_spd = 6', 'skick_hit = 3', 'skick_dmg = 3',
            'wkick_nbf = 5', 'wkick_spd = 5', 'wkick_hit = 3', 'wkick_dmg = 2',
            'apunch_nbf = 4', 'apunch_spd = 6', 'apunch_hit = 3',
            'gpunch_nbf = 5', 'gpunch_spd = 6', 'gpunch_hit = 3',
            'akick_nbf = 5', 'akick_spd = 6', 'akick_hit = 3',
            'gkick_nbf = 8', 'gkick_spd = 5', 'gkick_hit = 4',
            '']
    open(os.path.join(OUT, 'char.ini'), 'w').write('\r\n'.join(ini))

    # Keero's own fireball: an orange-red flame ball with a short tail
    for i in range(4):
        im = Image.new('RGBA', (64, 24), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        cx, cy, r = 44, 12, 10 + (i % 2)
        for k in range(6):                      # flickering tail
            t = k / 6.0
            x = cx - 8 - k * 6
            rr = r * (1 - t) * 0.9
            yy = cy + ((i + k) % 3 - 1) * 1.5
            d.ellipse((x - rr, yy - rr, x + rr, yy + rr), fill=(200, 40 + int(40 * t), 10, 255))
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(225, 60, 15, 255))
        d.ellipse((cx - r * 0.7, cy - r * 0.7, cx + r * 0.75, cy + r * 0.7), fill=(255, 150, 30, 255))
        d.ellipse((cx - r * 0.35, cy - r * 0.35, cx + r * 0.45, cy + r * 0.35), fill=(255, 240, 170, 255))
        a = np.array(im)
        rgb = a[..., :3].copy()
        rgb[a[..., 3] < 128] = MAG
        save_pcx24(os.path.join(OUT, f'fball{i + 1}.pcx'), rgb)
    # voice lines are added by tools/install_voices.py (the 2003 sounds are Corbin's)

    # portraits: the glaring head shot (26) cut out onto a dark background
    # with a red sun, like the rest of the cast
    im, m = cutout(26)
    ys, xs = np.nonzero(m)
    top = ys.min()
    hh = int((ys.max() - top) * 0.30)
    row = np.nonzero(m[top + hh // 3])[0]
    cxp = int(row.mean())
    box = (cxp - hh // 2, top - hh // 12, cxp + hh // 2, top - hh // 12 + hh)
    face = Image.fromarray(np.dstack([im, (m * 255).astype(np.uint8)]), 'RGBA').crop(box).resize((200, 200), Image.LANCZOS)
    from PIL import ImageEnhance
    rgb = ImageEnhance.Contrast(face.convert('RGB')).enhance(1.15)
    face = Image.merge('RGBA', (*rgb.split(), face.split()[3]))
    bg = Image.new('RGB', (200, 200))
    px = bg.load()
    for y in range(200):
        for x in range(200):
            px[x, y] = (int(18 + 50 * y / 200), 8, 6)
    ImageDraw.Draw(bg).ellipse((90, 10, 230, 150), fill=(160, 28, 18))
    bg.paste(face, (0, 0), face)
    for name, sz in (('selbig.pcx', (100, 99)), ('selsmall.pcx', (26, 26))):
        save_pcx24(os.path.join(OUT, name), np.array(bg.resize(sz, Image.LANCZOS)))

    # story-mode ending picture: the victory photo with a caption
    end = Image.open(photo(42)).convert('RGB').resize((320, 240), Image.LANCZOS).crop((0, 20, 320, 220))
    d = ImageDraw.Draw(end)
    try:
        fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
        small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 11)
    except OSError:
        fnt = small = ImageFont.load_default()
    d.rectangle((0, 160, 320, 200), fill=(0, 0, 0))
    d.text((160, 168), 'KEERO IS THE SHOGUN', font=fnt, fill=(240, 220, 180), anchor='mt')
    d.text((160, 188), 'Shotakan Takamara champion', font=small, fill=(200, 40, 30), anchor='mt')
    save_pcx24(os.path.join(OUT, 'endimg.pcx'), np.array(end))
    print('keero built:', len(os.listdir(OUT)), 'files; widths', widths)


if __name__ == '__main__':
    build()
