# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
import sys,gzip,struct,json,os
def rd(b,p):
    n=s=0
    while True:
        c=b[p];p+=1;n|=(c&0x7f)<<s;s+=7
        if c<0x80: return n,p
data=b''
for f in sys.argv[1:-1]:
    b=open(f,'rb').read();p=9;l,p=rd(b,p);nl,p=rd(b,p);p+=nl;data+=b[p:p+l-(p-p)] if False else b[p:]
raw=gzip.decompress(data);il=struct.unpack('<I',raw[:4])[0];idx=json.loads(raw[4:4+il]);base=4+il
out=sys.argv[-1]
for k,(o,l) in idx.items():
    fp=os.path.join(out,k);os.makedirs(os.path.dirname(fp),exist_ok=True);open(fp,'wb').write(raw[base+o:base+o+l])
print(len(idx))
