#!/bin/sh
set -e
cd "$(dirname "$0")"
mkdir -p out
python3 patch.py ../data/src/Kof91.c out/kof91_web.c
python3 -m ziglang cc --target=wasm32-wasi -O2 -I. -w \
  -fno-strict-aliasing \
  out/kof91_web.c allegro.c -o out/kof91.raw.wasm \
  -Wl,-z,stack-size=2097152 -Wl,--export=web_key_ptr -Wl,--export=web_keybuf_ptr -Wl,--export=web_pad_ptr -Wl,--export=web_pad_latch_ptr -Wl,--export=web_key_latch_ptr \
  -Wl,--export=malloc
~/tools/node_modules/.bin/wasm-opt out/kof91.raw.wasm -O2 --asyncify \
  --pass-arg=asyncify-imports@env.js_yield -o out/kof91.wasm
ls -la out/*.wasm
