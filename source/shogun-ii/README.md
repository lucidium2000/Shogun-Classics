# Shogun II Restored: build notes

Shogun II (2003) was built on the KOF91 v1.2 engine by Moah. This port compiles
that engine's C source to WebAssembly and runs it with a JavaScript host.

## What is here

- `tools/patch.py` turns the original `Kof91.c` into `kof91_web.c`: it swaps the
  Win32 MP3 player and directory scanner for web calls, fixes the frame throttle,
  routes music to the Shogun songs, and adds win-quote voices.
- `tools/allegro.c`, `tools/allegro.h`: a minimal Allegro-compatible shim
  (bitmaps, palettes, sprites, keyboard, sound) on top of the JS host.
- `tools/build.sh`: compiles with `zig cc --target=wasm32-wasi` and runs
  binaryen's `wasm-opt --asyncify` so the engine's busy loops can yield.
- `tools/pack.py` packs the game folder (sprites, stages, sounds, music) into one
  gzip blob; `tools/wrap.py` splits it into `shogun2-data-*.wasm` files;
  `tools/unpak.py` unpacks them again.
- `tools/build_keero.py`, `fix_corbin.py`, `clean_pink.py`: turn the filmed
  Keero and Corbin photos into sprites. `tools/cast/` and `build_cast.py` render
  the rest of the cast; `tools/stages2/` renders the stages.

## Rebuilding

1. Get `Kof91.c` from the KOF91 v1.2 distribution and put it at
   `../data/src/Kof91.c` relative to `tools/` (it is Moah's code and is not
   included here).
2. `pip install ziglang` and `npm install binaryen` (for `wasm-opt`).
3. `sh tools/build.sh`, then copy `out/kof91.wasm` to `shogun-ii/`.
4. To change game data: `python3 tools/unpak.py shogun-ii/shogun2-data-1.wasm shogun-ii/shogun2-data-2.wasm game/`,
   edit `game/`, then `python3 tools/pack.py game data.pak` and
   `python3 tools/wrap.py data.pak shogun-ii/shogun2-data`.
