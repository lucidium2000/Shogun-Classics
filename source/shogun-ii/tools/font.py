# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
import struct,sys
d=open(sys.argv[1],'rb').read()
p=8+4
while d[p:p+4]==b'prop': l=struct.unpack('>I',d[p+8:p+12])[0]; p+=12+l
sz=struct.unpack('>I',d[p+4:p+8])[0]; b=d[p+12:p+12+sz]
q=4; mono=b[q]; q+=1; beg,end=struct.unpack('>ii',b[q:q+8]); q+=8
glyphs=[]
for c in range(beg,end+1):
    w,h=struct.unpack('>hh',b[q:q+4]); q+=4; n=((w+7)//8)*h; glyphs.append((c,w,h,b[q:q+n])); q+=n
print('consumed',q,'of',len(b))
for c,w,h,g in glyphs[33:36]:
    print(chr(c),w,h)
    bpr=(w+7)//8
    for y in range(h): print(''.join('#' if g[y*bpr+x//8]&(0x80>>(x%8)) else '.' for x in range(w)))
