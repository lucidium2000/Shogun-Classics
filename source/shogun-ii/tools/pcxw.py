# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Write 24-bit (3-plane) PCX files the way KOF91 sprites are stored."""
import struct
import numpy as np

def _rle(row):
    out = bytearray(); i = 0; n = len(row)
    while i < n:
        v = row[i]; j = i
        while j < n and row[j] == v and j - i < 63: j += 1
        c = j - i
        if c > 1 or v >= 0xC0: out += bytes([0xC0 | c, v])
        else: out.append(v)
        i = j
    return out

def save_pcx24(path, rgb):
    rgb = np.asarray(rgb, np.uint8)
    h, w = rgb.shape[:2]
    bpl = w + (w & 1)
    hdr = struct.pack('<BBBBHHHHHH', 10, 5, 1, 8, 0, 0, w - 1, h - 1, 72, 72)
    hdr += bytes(48) + bytes([0, 3]) + struct.pack('<HH', bpl, 1) + bytes(58)
    body = bytearray()
    for y in range(h):
        for c in range(3):
            row = bytes(rgb[y, :, c]) + (b'\0' if bpl != w else b'')
            body += _rle(row)
    open(path, 'wb').write(hdr + body)
