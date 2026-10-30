"""Remove the pink (magenta-blended) halo around cut-out sprites: any pixel
near the transparent area whose colour is mostly magenta becomes transparent."""
import sys, os, glob
import numpy as np
from scipy import ndimage
sys.path.insert(0, os.path.dirname(__file__))
import pcx
from pcxw import save_pcx24

def clean(path):
    w, h, bpp, pl, bpl, px, pal = pcx.load(path)
    if pl != 3: return 0
    a = np.frombuffer(bytes(px[:bpl * 3 * h]), np.uint8).reshape(h, 3, bpl)[:, :, :w].transpose(0, 2, 1).astype(int)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # anything that turns into the 16-bit mask colour is see-through in game
    mask = (r >= 248) & (g < 4) & (b >= 248)
    if not mask.any(): return 0
    tinted = (np.minimum(r, b) - g > 45) & (np.abs(r - b) < 70) & (g < 120)
    removed = 0
    near = mask.copy()
    for _ in range(10):          # peel up to 10 pixels of halo
        ring = ndimage.binary_dilation(near) & ~near
        kill = ring & tinted
        if not kill.any(): break
        near |= kill
        removed += kill.sum()
    # isolated pink specks anywhere
    specks = tinted & ~near & (np.minimum(r, b) > 100) & (g < 70)
    near |= specks
    removed += specks.sum()
    a[near] = [255, 0, 255]
    # small see-through holes inside the body (cut-out mistakes): fill them
    # with the nearest real colour
    trans = near
    lab, n = ndimage.label(trans)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    sizes = ndimage.sum(trans, lab, range(1, n + 1))
    holes = np.zeros_like(trans)
    for i, sz in enumerate(sizes, 1):
        if i not in border and sz <= 150:
            holes |= lab == i
    # dithered pin-holes: see-through pixels mostly surrounded by body
    for _ in range(2):
        opaque_n = ndimage.convolve((~(trans | holes)).astype(int), np.ones((3, 3), int), mode='constant')
        holes |= trans & (opaque_n >= 5)
    if holes.any():
        src_bad = trans | holes | tinted
        idx = ndimage.distance_transform_edt(src_bad, return_distances=False, return_indices=True)
        a[holes] = a[idx[0][holes], idx[1][holes]]
        removed += holes.sum()
    if removed:
        save_pcx24(path, a.astype(np.uint8))
    return removed

if __name__ == '__main__':
    tot = 0
    for p in sys.argv[1:]:
        for f in glob.glob(p):
            tot += clean(f)
    print('pixels cleaned', tot)
