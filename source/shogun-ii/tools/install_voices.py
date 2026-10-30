# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Install the ElevenLabs voice lines (voices/out/<fighter>/line1, line2, win)
as the fighters' move and win sounds. Corbin keeps his own 2003 sounds."""
import os, shutil, glob

SRC = '/home/claude/k91/voices/out'
DST = '/home/claude/k91/data/sprites'
# engine sound file -> voice line
SOUNDS = {
    'keero':   {'fireb.wav': 'line1', 'smove.wav': 'line1', 'rush.wav': 'line2', 'win.wav': 'win'},
    # Corbin keeps his own fireball/blast/kick sounds; his super blast had a
    # leftover 0.8s stock sound from the Guile folder he was built from
    'corbin':  {'firebx.wav': 'double', 'win.wav': 'win'},
    'default': {'fireb.wav': 'line1', 'smove.wav': 'line2', 'firebx.wav': 'line2', 'win.wav': 'win'},
}

for cid in sorted(os.listdir(SRC)):
    d = os.path.join(DST, cid)
    # drop any borrowed sounds first (Corbin's own 2003 sounds stay)
    for f in [] if cid == 'corbin' else glob.glob(d + '/*.wav') + glob.glob(d + '/*.WAV'):
        os.remove(f)
    for snd, line in SOUNDS.get(cid, SOUNDS['default']).items():
        shutil.copy(os.path.join(SRC, cid, line + '.wav'), os.path.join(d, snd))
    print(cid, sorted(f for f in os.listdir(d) if f.endswith('.wav')))
