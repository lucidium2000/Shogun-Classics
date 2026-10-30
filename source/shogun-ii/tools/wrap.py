"""Wrap the gzip data pack in custom sections of empty wasm modules (artifact
hosting only serves known file types, max 15MB each). The pack is split into
parts named <out>-1.wasm, <out>-2.wasm ... that the page joins back together."""
import sys
d = open(sys.argv[1], 'rb').read()
PART = 12_000_000
def leb(n):
    o = bytearray()
    while True:
        b = n & 0x7f; n >>= 7
        if n: o.append(b | 0x80)
        else: o.append(b); return bytes(o)
parts = [d[i:i + PART] for i in range(0, len(d), PART)]
for i, p in enumerate(parts, 1):
    payload = leb(3) + b'pak' + p
    open(f'{sys.argv[2]}-{i}.wasm', 'wb').write(b'\0asm\x01\0\0\0' + b'\x00' + leb(len(payload)) + payload)
print(len(parts), 'parts')
