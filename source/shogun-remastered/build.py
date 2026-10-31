# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Build shogun-remastered/index.html from the JS modules.
Usage: python3 build.py ../../shogun-remastered/index.html"""
import os, sys
d = os.path.dirname(os.path.abspath(__file__)) + '/'
t = open(d + 'template.html').read()
# announcer lines recorded by Chris (voice/*.mp3), inlined so the page stays one file
import base64, glob, json
clips = {os.path.basename(f)[:-4]: base64.b64encode(open(f, 'rb').read()).decode() for f in sorted(glob.glob(d + 'voice/*.mp3'))}
js = 'const VOICE_CLIPS = ' + json.dumps(clips) + ';\n' + '\n'.join(open(d + f).read() for f in ['audio.js', 'rig.js', 'stages.js', 'fx.js', 'input.js', 'fighter.js', 'game.js'])
assert '</script' not in js
open(sys.argv[1], 'w').write(t.replace('/*JS*/', js))
