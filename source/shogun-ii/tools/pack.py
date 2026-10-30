# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
"""Pack the game folder into one gzip blob: [u32 json_len][json index][file bytes...]"""
import os, sys, json, gzip, struct
root, out = sys.argv[1], sys.argv[2]
keep = {'.pcx', '.ini', '.flc', '.wav', '.mid', '.mp3', '.dat', '.stp'}
skip_dirs = {'src', 'tools'}
skip_files = {'introbak.flc', 'untitled.wav', 'title.mp3'}
files, blobs, off = {}, [], 0
for dp, dns, fns in os.walk(root):
    dns[:] = sorted(d for d in dns if d.lower() not in skip_dirs)
    for fn in sorted(fns):
        rel = os.path.relpath(os.path.join(dp, fn), root).replace(os.sep, '/')
        if os.path.splitext(fn)[1].lower() not in keep or fn.lower() in skip_files: continue
        b = open(os.path.join(dp, fn), 'rb').read()
        files[rel] = [off, len(b)]; blobs.append(b); off += len(b)
idx = json.dumps(files).encode()
raw = struct.pack('<I', len(idx)) + idx + b''.join(blobs)
open(out, 'wb').write(gzip.compress(raw, 9))
print(len(files), 'files', len(raw), 'raw ->', os.path.getsize(out), 'gz')
