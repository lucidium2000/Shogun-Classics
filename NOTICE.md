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

Third-party music: the YOU LOSE screen and the ending play "It's a Long Road"
from the *Rambo: First Blood* soundtrack, as the original Shogun II did. It is
copyright its owners, is not covered by this repository's MIT license, and is
included only because this is a free, non-commercial fan release. The stages
originally shipped with MIDI files borrowed from other games; those are replaced
with silent placeholders. The rest of the game's music is the Shogun title song
and Chris's own tracks.

Fighter images: Keero and Corbin are filmed photos of the Shogun crew. Shōkei,
Wan'fu, Yamana, Frill and Onikage are AI-generated pictures of fictional people
that Chris made with Google Gemini and turned into sprites; they are not photos of
real people.

## Shogun (1996)

- The text-mode font is built from an 8x16 KOI8 bitmap font from the X11 font
  collection, which keeps its own terms.

## All games

- Web fonts (VT323, Barlow Condensed, Shippori Mincho B1, IBM Plex Sans) load
  from Google Fonts under the SIL Open Font License.
