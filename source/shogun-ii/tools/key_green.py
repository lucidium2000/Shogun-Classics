# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Cut a fighter photo off a green screen: alpha from how much greener than
red/blue each pixel is, green spill pulled out of the edges and the wisps.
python3 tools/key_green.py in.png out.png"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage as nd


def key(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    spill = g - np.maximum(r, b)
    # backdrop green is ~ +100..+150 over red/blue; the figure is grey/white
    alpha = np.clip(1 - (spill - 18) / 50, 0, 1)
    # keep only the figure: the biggest solid blob and what touches it
    solid = alpha > 0.5
    lab, n = nd.label(nd.binary_closing(solid, iterations=2))
    if n:
        sizes = nd.sum(solid, lab, range(1, n + 1))
        keep = np.isin(lab, 1 + np.flatnonzero(sizes >= sizes.max() * 0.02))
        keep = nd.binary_dilation(keep, iterations=6)
        alpha *= keep
    out = a.copy()
    lim = np.maximum(r, b) + 6
    out[..., 1] = np.minimum(g, lim)                 # despill
    return np.dstack([np.clip(out, 0, 255), alpha * 255]).astype(np.uint8)


if __name__ == '__main__':
    Image.fromarray(key(sys.argv[1])).save(sys.argv[2])
