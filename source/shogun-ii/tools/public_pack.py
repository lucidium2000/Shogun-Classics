# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Make the public data pack from a full Shogun II build: swap every MIDI for a
silent stub (borrowed from other games and unused), then repack. The Rambo song
stays in at Chris's call (2026-10-30, non-commercial fan release); pass
--no-rambo to drop it, e.g. before anything is sold.
Usage: python3 public_pack.py FULL-1.wasm FULL-2.wasm WORKDIR OUT-PREFIX [--no-rambo]"""
import glob, os, shutil, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
a, b, work, out = sys.argv[1:5]
no_rambo = '--no-rambo' in sys.argv[5:]
shutil.rmtree(work, ignore_errors=True); os.makedirs(work)
game = os.path.join(work, 'game')
subprocess.check_call([sys.executable, '-I', os.path.join(here, 'unpak.py'), a, b, game])
if no_rambo:
    for f in glob.glob(os.path.join(game, 'music', 'rambo*.mp3')): os.remove(f)
STUB = b'MThd\x00\x00\x00\x06\x00\x00\x00\x01\x00\x60MTrk\x00\x00\x00\x04\x00\xff\x2f\x00'
for f in glob.glob(os.path.join(game, 'midi', '*')): open(f, 'wb').write(STUB)
pak = os.path.join(work, 'public.pak')
subprocess.check_call([sys.executable, '-I', os.path.join(here, 'pack.py'), game, pak])
for f in glob.glob(out + '-*.wasm'): os.remove(f)
subprocess.check_call([sys.executable, '-I', os.path.join(here, 'wrap.py'), pak, out])
