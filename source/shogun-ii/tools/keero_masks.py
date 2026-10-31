# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Clean cut-outs for Keero's 63 photos -> keero/mask_c/P10100NN.png (8-bit).

The 2004 photos were shot in a hallway: white wall, tan floor, a red rug,
cables and a doorway.  The rembg masks grab the rug and cables when he is low.
Here each mask is refined with GrabCut, seeded from the rembg masks and from
colour rules for the rug and floor, then cleaned up: one body, no holes, no
specks, and an edge that sits one pixel inside the real contour so no wall or
rug colour is carried into the sprite.

    python3 tools/keero_masks.py [photo numbers]      (default: all 63)
"""
import os, sys
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage as nd

SRC = '/home/claude/k91/keero'
OUT = f'{SRC}/mask_c'
os.makedirs(OUT, exist_ok=True)


def load_mask(kind, n):
    p = f'{SRC}/{kind}/P10100{n:02d}.png'
    return np.array(Image.open(p).convert('L')) if os.path.exists(p) else None


def rug_floor(im, base):
    """pixels that look like the red rug (any brightness: its shadow is a dark
    reddish brown, his shoes are a neutral black) or the dim tan floor (much
    darker than his gi, low in colour)"""
    r, g, b = [im[..., i].astype(int) for i in range(3)]
    bright = (r + g + b) // 3
    rug = (r > 15) & (g < 70) & (b < 70) & (r > 2.0 * g) & (r > 1.5 * b)
    gi = np.percentile(bright[base], 80) if base.any() else 200
    sat = np.maximum(np.maximum(r, g), b) - np.minimum(np.minimum(r, g), b)
    tan = (bright > 40) & (bright < 0.55 * gi) & (sat < 45)
    tan |= (r > 130) & (g > 95) & (b > 60) & (r - b > 45) & (r - g > 15) & (g - b > 10)
    return rug, tan


def fill_small_holes(m, frac=0.015):
    """fill holes, except big ones (floor seen between the limbs)"""
    holes = nd.binary_fill_holes(m) & ~m
    lab, nl = nd.label(holes)
    if nl:
        sizes = nd.sum(holes, lab, range(1, nl + 1))
        small = np.isin(lab, 1 + np.flatnonzero(sizes <= frac * m.sum()))
        m = m | small
    return m


def refine(n):
    im = np.array(Image.open(f'{SRC}/P10100{n:02d}.JPG').convert('RGB'))
    h = load_mask('mask_h', n)
    i = load_mask('mask_i', n)
    # two cut-out models: the human one (mask_h) grabs the rug and the floor
    # between his limbs when he is low, the general one (mask_i) sometimes
    # grabs furniture; where both exist, trust only what they agree on
    base = (h > 128) if h is not None else (i > 128)
    if h is not None and i is not None:
        both = (h > 128) & (i > 128)
        if both.sum() > 0.6 * min((h > 128).sum(), (i > 128).sum()):
            base = both
    rug, tan = rug_floor(im, base)
    ys, xs = np.nonzero(base)
    top, bot = ys.min(), ys.max()
    hgt = bot - top + 1

    sure_fg = nd.binary_erosion(base, iterations=9)
    # inside the body, the rug and floor colours are never his (the belt is
    # thin and sits at mid-height, the rug is at the feet)
    low = np.zeros_like(base); low[top + int(hgt * 0.55):] = True
    # rug and dim floor inside the cut-out: only blobs low in the figure that
    # reach its outside (his belt, badge and shadowed folds are enclosed)
    bad = np.zeros_like(base)
    cand = (rug | tan) & low & base
    lab, nl = nd.label(cand)
    if nl:
        edge = nd.binary_dilation(~base, iterations=2)
        for k in range(1, nl + 1):
            blob = lab == k
            if blob.sum() > 200 and (blob & edge).any() and np.nonzero(blob)[0].mean() > top + 0.6 * hgt:
                bad |= blob
    bad = nd.binary_opening(bad, iterations=1)
    sure_fg &= ~nd.binary_dilation(bad, iterations=3)
    prob_fg = base & ~bad
    far = ~nd.binary_dilation(base, iterations=30)

    gc = np.full(base.shape, cv2.GC_PR_BGD, np.uint8)
    gc[prob_fg] = cv2.GC_PR_FGD
    gc[sure_fg] = cv2.GC_FGD
    gc[far] = cv2.GC_BGD
    gc[bad & nd.binary_dilation(base, iterations=2)] = cv2.GC_PR_BGD
    bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
    bgr = np.ascontiguousarray(im[..., ::-1])
    try:
        cv2.grabCut(bgr, gc, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
        m = (gc == cv2.GC_FGD) | (gc == cv2.GC_PR_FGD)
    except cv2.error:
        m = prob_fg
    # never grow far past the rembg contour (grabcut can leak into the wall)
    m &= nd.binary_dilation(base, iterations=4)
    # the rug under him: drop any rug/floor-coloured blob in the low zone
    lab, nl = nd.label(m & bad)
    if nl:
        sizes = nd.sum(m & bad, lab, range(1, nl + 1))
        for k, s in enumerate(sizes):
            if s > 120:
                m &= lab != k + 1
    # cables lying by his feet: dark, low, reaching the outside and further
    # than a shoe's width from any gi pixel
    bright = im.astype(int).sum(2) // 3
    dark = (bright < 70) & m & low
    gi_px = m & (bright > 110)
    far_dark = dark & ~nd.binary_dilation(gi_px, iterations=14)
    lab, nl = nd.label(far_dark)
    if nl:
        edge = nd.binary_dilation(~m, iterations=2)
        for k in range(1, nl + 1):
            blob = lab == k
            if blob.sum() > 60 and (blob & edge).any():
                m &= ~blob
    m = nd.binary_opening(m, iterations=2)
    m = nd.binary_closing(m, iterations=2)
    m = fill_small_holes(m)
    # one body, plus small pieces touching it (a shoe split from the hem)
    lab, nl = nd.label(m)
    if nl > 1:
        sizes = nd.sum(m, lab, range(1, nl + 1))
        main = int(np.argmax(sizes)) + 1
        body = lab == main
        near = nd.binary_dilation(body, iterations=5)
        keep = body.copy()
        for k, s in enumerate(sizes):
            if k + 1 != main and s >= 80 and (near & (lab == k + 1)).any():
                keep |= lab == k + 1
        m = fill_small_holes(keep)
    # smooth the contour and pull it in one pixel
    sm = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.6) > 0.5
    sm = nd.binary_erosion(sm, iterations=1)
    return (sm * 255).astype(np.uint8)


if __name__ == '__main__':
    ns = [int(a) for a in sys.argv[1:]] or range(1, 64)
    for n in ns:
        Image.fromarray(refine(n)).save(f'{OUT}/P10100{n:02d}.png')
        print(n, end=' ', flush=True)
    print('done')
