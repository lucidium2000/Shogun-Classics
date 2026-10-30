#!/bin/sh
# Rebuild the playable pages from source/. Shogun II's engine and data pack are
# prebuilt (see source/shogun-ii/README.md); this script does not touch them.
set -e
cd "$(dirname "$0")"
python3 source/shogun-1996/build.py shogun-1996/index.html
python3 tools/standalone.py shogun-1996/index.html
python3 source/shogun-remastered/build.py shogun-remastered/index.html
python3 tools/standalone.py shogun-remastered/index.html
python3 tools/standalone.py source/launcher/index.html index.html
