# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
"""Inline the "choose your era" strip (source/shared/eras.js plus small cover
thumbnails) into a game page, at its <!--ERAS--> marker. Running it again
replaces the copy already there.
Usage: python3 tools/eras.py PAGE.html [PAGE.html ...]"""
import base64, io, json, os, re, sys
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
thumbs = {}
for key, name in (('1996', 'shogun-1996'), ('remastered', 'shogun-remastered'), ('ii', 'shogun-ii')):
    im = Image.open(os.path.join(root, 'covers', name + '.jpg')).convert('RGB').resize((84, 112), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=72, optimize=True)
    thumbs[key] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
js = open(os.path.join(root, 'source', 'shared', 'eras.js')).read().replace('/*THUMBS*/', json.dumps(thumbs))
assert '</script' not in js
block = '<!--ERAS--><script>\n' + js + '</script><!--/ERAS-->'
for page in sys.argv[1:]:
    t = open(page).read()
    n = 0
    t, n = re.subn(r'<!--ERAS-->.*?<!--/ERAS-->', lambda m: block, t, flags=re.S)
    if not n:
        assert t.count('<!--ERAS-->') == 1, page + ': no <!--ERAS--> marker'
        t = t.replace('<!--ERAS-->', block)
    open(page, 'w').write(t)
    print('eras ->', page)
