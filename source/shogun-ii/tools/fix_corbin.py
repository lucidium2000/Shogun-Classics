# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Rebuild Corbin (the 2003 filmed test character) for the restored game:
  - frames that were borrowed Guile art (light punch, air punch, one crouch
    punch, the super fireball wind-up, the 29-frame super) are replaced with
    Corbin's own frames, and the Guile super is switched off
  - a pink-tinted walk frame is swapped for a clean one
  - he is scaled up to the same size as the rest of the cast and stands on
    the same ground line, and gets the same dark outline as Keero
  - char.ini geometry is recomputed to match."""
import os, sys, re, glob
import numpy as np
from PIL import Image
from scipy import ndimage

sys.path.insert(0, os.path.dirname(__file__))
import pcx
from pcxw import save_pcx24

SRC = '/home/claude/k91/corbin_src'
DST = '/home/claude/k91/data/sprites/corbin'
H = 196            # frame height, like the rest of the cast
FEET = 193         # ground row inside the frame
STAND = 135        # standing height in pixels (10% under the first cut)


def find(name):
    for f in os.listdir(SRC):
        if f.lower() in (name.lower(), name.lower() + '.pcx'):
            return os.path.join(SRC, f)
    raise FileNotFoundError(name)


def load(name):
    w, h, bpp, pl, bpl, px, pal = pcx.load(find(name))
    a = np.frombuffer(bytes(px[:bpl * 3 * h]), np.uint8).reshape(h, 3, bpl)[:, :, :w].transpose(0, 2, 1).copy()
    m = ~((a[..., 0] >= 248) & (a[..., 1] < 4) & (a[..., 2] >= 248))
    f = a.astype(np.float32)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]

    # 1. floating pink/red bits that aren't attached to him (old dither and
    #    leftover splashes) go; his blast effects (cyan/white) stay
    lab, n = ndimage.label(m)
    if n > 1:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        big = sizes.max()
        for i, z in enumerate(sizes):
            if z < 0.03 * big:
                sel = lab == i + 1
                mr, mg, mb = r[sel].mean(), g[sel].mean(), b[sel].mean()
                bluish_or_white = mb > mr or min(mr, mg, mb) > 200   # his blast effects
                if z < 6 or not bluish_or_white:
                    m &= ~sel

    # 2. magenta mixed into the red shirt, skin and edges: un-mix it.
    #    A pixel is p = k*orig + (1-k)*magenta; take the original colour's blue
    #    from the nearest clean pixel to estimate k, then solve for orig.
    pink = m & (b > g + 20) & (r >= 0.9 * b)              # magenta mixed in (his blasts are bluer)
    pure = m & (r > 230) & (b > 200) & (g < 60)          # almost pure magenta
    clean = m & ~pink
    if pink.any() and clean.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~clean, return_indices=True)
        est = f[iy, ix]
        k = np.clip((255 - b) / np.maximum(255 - est[..., 2], 1), 0.15, 1)[..., None]
        mag = np.array([255, 0, 255], np.float32)
        un = np.clip((f - (1 - k) * mag) / k, 0, 255)
        # any tint left over is clamped to the neighbouring true colour's blue
        un[..., 2] = np.minimum(un[..., 2], est[..., 2] + 8)
        f[pink] = un[pink]
        f[pure] = est[pure]
    # 2b. little green and yellow flecks on his hands and shirt (not part of
    #     his blasts, which are cyan/white) take the surrounding colour
    fleck = m & (((g > r + 40) & (g > b + 20)) | ((r > 190) & (g > 170) & (b < 120)))
    lab, n = ndimage.label(fleck)
    if n:
        sizes = ndimage.sum(fleck, lab, range(1, n + 1))
        fleck = np.isin(lab, [i + 1 for i, z in enumerate(sizes) if z <= 40])
        good = m & ~fleck
        if fleck.any() and good.any():
            _, (iy, ix) = ndimage.distance_transform_edt(~good, return_indices=True)
            f[fleck] = f[iy[fleck], ix[fleck]]
    # 3. dither specks anywhere on him: a pixel far from its neighbourhood
    #    median takes the neighbourhood's colour
    lum = f.sum(2)
    lm = np.where(m, lum, np.nan)
    pad = np.pad(lm, 2, constant_values=np.nan)
    win = np.lib.stride_tricks.sliding_window_view(pad, (5, 5))
    med = np.nanmedian(win.reshape(*lm.shape, 25), axis=2)
    spk = m & (np.abs(lum - med) > 150)
    keep = m & ~spk
    if spk.any() and keep.any():
        _, (iy, ix) = ndimage.distance_transform_edt(~keep, return_indices=True)
        f[spk] = f[iy[spk], ix[spk]]
    # 3b. frames shot with heavy dither (the walk) get a full 3x3 median
    noisy = np.zeros_like(m)
    med3 = np.empty_like(f)
    for c in range(3):
        ch = np.where(m, f[..., c], np.nan)
        pc = np.pad(ch, 1, constant_values=np.nan)
        wc = np.lib.stride_tricks.sliding_window_view(pc, (3, 3)).reshape(*ch.shape, 9)
        med3[..., c] = np.nanmedian(wc, axis=2)
    dev = np.abs(f - med3).sum(2)
    if m.any() and np.mean(dev[m] > 90) > 0.04:
        print('  heavy dither, smoothed:', name)
        f[m] = med3[m]
    # 4. pinholes inside him
    holes = ndimage.binary_fill_holes(m) & ~m
    lab, n = ndimage.label(holes)
    if n:
        sizes = ndimage.sum(holes, lab, range(1, n + 1))
        small = np.isin(lab, [i + 1 for i, z in enumerate(sizes) if z <= 300])
        if small.any():
            _, (iy, ix) = ndimage.distance_transform_edt(~m, return_indices=True)
            f[small] = f[iy[small], ix[small]]
            m = m | small
    return np.clip(f, 0, 255).astype(np.uint8), m


def ink(rgb, m):
    """1px dark outline around the figure, like a drawn fighting-game sprite"""
    ring = ndimage.binary_dilation(m) & ~m
    rgb = rgb.copy()
    rgb[ring] = (22, 14, 12)
    return rgb, m | ring


# move -> list of source frames (Corbin's own art only)
SEQ = {
    'static': ['static1', 'static2', 'static3', 'static4'],
    # his filmed walk frames are full of dither noise and lose his face when
    # cleaned, so he steps with his guard bob instead
    'walk': ['static1', 'static2', 'static3', 'static4', 'static1'],
    'jump': ['jump1', 'jump2', 'jump3', 'jump4', 'jump5'],
    'crouch': ['crouch1'], 'block': ['block1'], 'gblock': ['gblock1'],
    'hurt': ['hurt1', 'hurt2', 'hurt3'], 'ghurt': ['ghurt1', 'ghurt2'],
    'ko': ['ko1', 'ko2', 'ko3', 'ko4', 'ko5'],
    'intro': [f'intro{i}' for i in range(1, 16)],
    'outwin': [f'outwin{i}' for i in range(1, 12)],
    'wpunch': ['spunch1', 'spunch2', 'spunch3', 'spunch1'],
    'spunch': [f'spunch{i}' for i in range(1, 6)],
    'wkick': [f'wkick{i}' for i in range(1, 6)],
    'skick': [f'skick{i}' for i in range(1, 6)],
    'gpunch': ['gpunch1', 'gpunch2', 'gpunch3', 'gpunch4', 'gpunch1'],
    'gkick': [f'gkick{i}' for i in range(1, 9)],
    'apunch': ['jump3', 'spunch2', 'spunch3', 'jump3'],
    'akick': [f'akick{i}' for i in range(1, 6)],
    'fireb': [f'fireb{i}' for i in range(1, 7)],
    'firebx': ['fireb1', 'fireb2', 'fireb3', 'firebx4', 'fireb4', 'fireb5', 'fireb6'],
    'smove': [f'smove{i}' for i in range(1, 9)],
}
SINGLE = {'crouch', 'block', 'gblock'}
ATTACKS = ['wpunch', 'spunch', 'wkick', 'skick', 'gpunch', 'gkick', 'apunch', 'akick']
HIT = {'wpunch': 3, 'spunch': 4, 'wkick': 3, 'skick': 3, 'gpunch': 3, 'gkick': 5, 'apunch': 3, 'akick': 3}

# Corbin's frames share one canvas layout: work out the scale from his stance
a0, m0 = load('static1')
ys = np.nonzero(m0.any(1))[0]
FEET0 = int(ys.max())
K = STAND / float(ys.max() - ys.min())
PAD = FEET - FEET0 * K         # vertical shift after scaling


def scaled(name, k=K, pad=PAD, height=H):
    a, m = load(name)
    h, w = m.shape
    nw, nh = round(w * k), round(h * k)
    img = Image.fromarray(np.dstack([a, (m * 255).astype(np.uint8)]), 'RGBA').resize((nw, nh), Image.LANCZOS)
    s = np.array(img)
    # smooth the jagged 2003 cut-out edge before thresholding
    mm = ndimage.gaussian_filter(s[..., 3].astype(np.float32), 1.0) > 140
    can = np.zeros((height, nw, 3), np.uint8)
    can[:] = (255, 0, 255)
    cm = np.zeros((height, nw), bool)
    dy = int(round(pad))
    y0, y1 = max(0, dy), min(height, dy + nh)
    sy0 = y0 - dy
    rgb = s[..., :3].copy()
    mag = (rgb[..., 0] > 247) & (rgb[..., 1] < 8) & (rgb[..., 2] > 247)
    rgb[mag] = (247, 8, 247)
    sel = mm[sy0:sy0 + (y1 - y0)]
    can[y0:y1][sel] = rgb[sy0:sy0 + (y1 - y0)][sel]
    cm[y0:y1] = sel
    return ink(can, cm)


def opaque(c):
    return ~((c[..., 0] == 255) & (c[..., 1] == 0) & (c[..., 2] == 255))


def reach(c):
    op = opaque(c)
    x = int(np.nonzero(op.any(0))[0].max())
    return x, int(np.median(np.nonzero(op[:, x])[0]))


def body(c):
    op = opaque(c)
    ys = np.nonzero(op.any(1))[0]
    y = int(ys.min() + (ys.max() - ys.min()) * 0.25)
    xs = np.nonzero(op[y])[0]
    return int(xs.max()), y


def main():
    os.makedirs(DST, exist_ok=True)
    for f in glob.glob(DST + '/*'):
        os.remove(f)
    out, widths = {}, {}
    for mv, names in SEQ.items():
        frames = []
        for i, n in enumerate(names):
            c, m = scaled(n)
            c[~m] = (255, 0, 255)
            frames.append(c)
            fn = f'{mv}1.pcx' if mv in SINGLE else f'{mv}{i + 1}.pcx'
            save_pcx24(os.path.join(DST, fn), c)
        out[mv] = frames
        widths[mv] = max(f.shape[1] for f in frames)

    # projectiles scale with him (no ground shift)
    fb = {}
    for kind, n in (('fball', 4), ('fballx', 4)):
        for i in range(1, n + 1):
            a, m = load(f'{kind}{i}')
            h, w = m.shape
            img = Image.fromarray(np.dstack([a, (m * 255).astype(np.uint8)]), 'RGBA').resize((round(w * K), round(h * K)), Image.LANCZOS)
            s = np.array(img)
            c = s[..., :3].copy()
            c[s[..., 3] <= 128] = (255, 0, 255)
            save_pcx24(os.path.join(DST, f'{kind}{i}.pcx'), c)
            fb[kind] = c.shape

    for snd in os.listdir(SRC):
        if snd.lower().endswith('.wav'):
            open(os.path.join(DST, snd.lower()), 'wb').write(open(os.path.join(SRC, snd), 'rb').read())

    # select-screen portraits are Corbin's own photo; the 2003 ending
    # picture was Guile, so make a new one from his stance
    for fn in os.listdir(SRC):
        if fn.lower() in ('selbig.pcx', 'selsmall.pcx'):
            open(os.path.join(DST, fn.lower()), 'wb').write(open(os.path.join(SRC, fn), 'rb').read())
    from PIL import ImageDraw, ImageFont
    end = Image.new('RGB', (320, 200))
    px = end.load()
    for y in range(200):
        for x in range(320):
            px[x, y] = (int(40 + 60 * y / 200), 8, 6)
    d = ImageDraw.Draw(end)
    d.ellipse((170, 10, 300, 140), fill=(170, 30, 20))
    c, m = scaled('static1')
    fig = Image.fromarray(np.dstack([c, (m * 255).astype(np.uint8)]), 'RGBA')
    bb = fig.getbbox()
    fig = fig.crop(bb)
    fig = fig.resize((int(fig.width * 175 / fig.height), 175), Image.LANCZOS)
    end.paste(fig, (235 - fig.width // 2, 5), fig)
    try:
        f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
        f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 11)
    except OSError:
        f1 = f2 = ImageFont.load_default()
    d.rectangle((0, 160, 320, 200), fill=(0, 0, 0))
    d.text((160, 168), 'CORBIN TAKES THE TITLE', font=f1, fill=(240, 220, 180), anchor='mt')
    d.text((160, 188), 'the test character was never a test', font=f2, fill=(200, 40, 30), anchor='mt')
    save_pcx24(os.path.join(DST, 'endimg.pcx'), np.array(end))

    S = lambda v: int(round(v * K))
    ini = ['[corbin]']
    for mv in ['static', 'walk', 'jump', 'crouch'] + ATTACKS + ['hurt', 'block', 'ghurt', 'gblock', 'intro']:
        dx, dy = body(out[mv][0])
        ox, oy = reach(out[mv][HIT[mv] - 1]) if mv in ATTACKS else (20, 20)
        ini += [f'{mv}_defx = {dx}', f'{mv}_defy = {dy}', f'{mv}_offx = {ox}', f'{mv}_offy = {oy}']
    fx, fy = reach(out['fireb'][4])
    smx, smy = reach(out['smove'][5])
    ini += [
        'fball_defx = 10', 'fball_defy = 10', f'fball_offx = {fb["fball"][1] - 2}', f'fball_offy = {fb["fball"][0] // 2}',
        'fballx_defx = 10', 'fballx_defy = 10', f'fballx_offx = {fb["fballx"][1] - 2}', f'fballx_offy = {fb["fballx"][0] // 2}',
        'smove_defx = 10', 'smove_defy = 10', f'smove_offx = {smx}', f'smove_offy = {smy}',
        '',
        'smove = 1', f'smove_w = {widths["smove"]}', 'smove_nbf = 8', 'smove_hit = 6', 'smove_spd = 6',
        'smove_rot = 1', 'smove_dmg = 4', 'smove_exec = L R K *',
        '',
        'fireb = 1', f'fireb_w = {widths["fireb"]}', 'fireb_nbf = 6', 'fireb_hit = 5', 'fireb_spd = 7',
        'fireb_exec = D R P *',
        f'fball_h = {fb["fball"][0]}', 'fball_dmg = 4', f'fball_w = {fb["fball"][1]}', 'fball_nbf = 4',
        'fball_spd = 2', 'fball_pix = 4', f'fball_cx = {fx - 30}', f'fball_cy = {fy - fb["fball"][0] // 2}',
        '',
        'firebx = 1', f'firebx_w = {widths["firebx"]}', 'firebx_nbf = 7', 'firebx_hit = 5', 'firebx_spd = 9',
        'firebx_exec = L R P *',
        f'fballx_h = {fb["fballx"][0]}', 'fballx_dmg = 8', f'fballx_w = {fb["fballx"][1]}', 'fballx_nbf = 4',
        'fballx_spd = 5', 'fballx_pix = 3', f'fballx_cx = {fx - 60}', f'fballx_cy = {fy - fb["fballx"][0] // 2}',
        '',
        '# the 2003 super move was borrowed Guile art, so it is switched off',
        'smovex = 0',
        '',
        'name = TEST CHARACTER(CORBIN)',
        f'height = {H}',
        '',
    ]
    for mv in ['static', 'spunch', 'wpunch', 'skick', 'wkick', 'apunch', 'gpunch', 'akick', 'gkick', 'intro', 'ko', 'outwin']:
        ini.append(f'{mv}_w = {widths[mv]}')
    ini += ['',
            'walk_nbf = 5', 'walk_spd = 8', 'static_nbf = 4', 'static_spd = 10',
            'hurt_nbf = 3', 'ghurt_nbf = 2', 'intro_nbf = 15', 'outwin_nbf = 11', 'outwin_spd = 8',
            'spunch_nbf = 5', 'spunch_spd = 7', 'spunch_hit = 4', 'spunch_dmg = 3',
            'wpunch_nbf = 4', 'wpunch_spd = 6', 'wpunch_hit = 3', 'wpunch_dmg = 2',
            'skick_nbf = 5', 'skick_spd = 7', 'skick_hit = 3', 'skick_dmg = 3',
            'wkick_nbf = 5', 'wkick_spd = 7', 'wkick_hit = 3', 'wkick_dmg = 2',
            'apunch_nbf = 4', 'apunch_spd = 6', 'apunch_hit = 3',
            'gpunch_nbf = 5', 'gpunch_spd = 7', 'gpunch_hit = 3',
            'akick_nbf = 5', 'akick_spd = 7', 'akick_hit = 3',
            'gkick_nbf = 8', 'gkick_spd = 6', 'gkick_hit = 5', '']
    open(os.path.join(DST, 'char.ini'), 'w').write('\r\n'.join(ini))
    print('corbin rebuilt: scale %.2f, pad %.1f, widths %s' % (K, PAD, widths))


if __name__ == '__main__':
    main()
