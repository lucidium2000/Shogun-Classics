# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Build shogun-1996/index.html: the QBasic sources + interpreter in one page.
Usage: python3 build.py ../../shogun-1996/index.html"""
import os, sys
d = os.path.dirname(os.path.abspath(__file__)) + '/'
t = open(d + 'template.html').read()
srcs = ''
for n in ['SHOGUN', 'CSHOGUN', 'LEND', 'WEND']:
    s = open(d + 'basic/' + n + '.BAS', encoding='utf8').read().replace('\r', '')
    assert '</script' not in s.lower()
    srcs += f'<script type="text/x-qbasic" data-name="{n}">\n{s}</script>\n'
t = t.replace('<!--SOURCES-->', srcs)
t = t.replace('/*CP437*/', open(d + 'cp437.json').read())
t = t.replace('/*FONT*/', open(d + 'font.b64').read().strip())
t = t.replace('/*ENGINE*/', open(d + 'engine.js').read())
t = t.replace('/*PATCHES*/', open(d + 'patches.js').read())
open(sys.argv[1], 'w').write(t)
print(len(t))
