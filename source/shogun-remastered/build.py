"""Build shogun-remastered/index.html from the JS modules.
Usage: python3 build.py ../../shogun-remastered/index.html"""
import os, sys
d = os.path.dirname(os.path.abspath(__file__)) + '/'
t = open(d + 'template.html').read()
js = '\n'.join(open(d + f).read() for f in ['audio.js', 'rig.js', 'stages.js', 'fx.js', 'input.js', 'fighter.js', 'game.js'])
assert '</script' not in js
open(sys.argv[1], 'w').write(t.replace('/*JS*/', js))
