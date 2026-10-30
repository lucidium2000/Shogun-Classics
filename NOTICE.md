# Third-party notices

Everything in this repository is covered by the MIT license in [LICENSE](LICENSE)
except the items below, which belong to their own authors and keep their own terms.

## Shogun II Restored

- **KOF91 engine.** `shogun-ii/kof91.wasm` is compiled from the source of KOF91
  v1.2 by Moah (2001), a freeware fighting-game engine, with patches for the web
  (`source/shogun-ii/tools/patch.py`). The engine and its original HUD, font and
  effect files in the data pack (fonts, life bars, hit sparks, menu cards and the
  stock sound effects in `wav/`) are Moah's work, distributed as freeware. They are
  not relicensed under MIT. The original KOF91 source file is not included here.
- **Allegro.** `source/shogun-ii/tools/allegro.c` and `allegro.h` are a small
  web shim written for this port that imitates the Allegro game library's API;
  they contain no Allegro code. Allegro itself is giftware.

What was removed for the public release: the original Shogun II build played
"It's a Long Road" from the *Rambo: First Blood* soundtrack on the YOU LOSE screen
and the ending, and its stages shipped with MIDI files borrowed from other games.
Those are copyrighted by others, so this public build leaves the lose screen
silent and replaces the unused MIDI files with silent placeholders. The game's
music is the Shogun title song and Chris's own tracks.

## Shogun (1996)

- The text-mode font is built from an 8x16 KOI8 bitmap font from the X11 font
  collection, which keeps its own terms.

## All games

- Web fonts (VT323, Barlow Condensed, Shippori Mincho B1, IBM Plex Sans) load
  from Google Fonts under the SIL Open Font License.
