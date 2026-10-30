# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
"""Build shogun-remastered/index.html from the JS modules.
Usage: python3 build.py ../../shogun-remastered/index.html"""
import os, sys
d = os.path.dirname(os.path.abspath(__file__)) + '/'
t = open(d + 'template.html').read()
js = '\n'.join(open(d + f).read() for f in ['audio.js', 'rig.js', 'stages.js', 'fx.js', 'input.js', 'fighter.js', 'game.js'])
assert '</script' not in js
open(sys.argv[1], 'w').write(t.replace('/*JS*/', js))
