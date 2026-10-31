#!/bin/sh
# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
# Rebuild the playable pages from source/. Shogun II's engine and data pack are
# prebuilt (see source/shogun-ii/README.md); this script does not touch them.
set -e
cd "$(dirname "$0")"
python3 source/shogun-1996/build.py shogun-1996/index.html
python3 tools/standalone.py shogun-1996/index.html
python3 source/shogun-remastered/build.py shogun-remastered/index.html
python3 tools/standalone.py shogun-remastered/index.html
python3 tools/eras.py shogun-1996/index.html shogun-remastered/index.html shogun-ii/index.html
python3 tools/standalone.py source/launcher/index.html index.html
