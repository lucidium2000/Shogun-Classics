"""Give a body-only page the document skeleton it needs when served on its own
(GitHub Pages). The game builds produce body-only pages for claude.ai Artifacts,
which add this skeleton at publish time.
Usage: python3 tools/standalone.py SRC [DST]   (DST defaults to SRC, wrapped in place)"""
import sys
HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
'''
src = sys.argv[1]
dst = sys.argv[2] if len(sys.argv) > 2 else src
t = open(src).read()
if not t.lstrip().lower().startswith('<!doctype'):
    t = HEAD + '</head>\n<body>\n' + t + '\n</body>\n</html>\n'
open(dst, 'w').write(t)
print('wrote', dst)
