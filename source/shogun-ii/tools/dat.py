# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
import struct,sys
d=open(sys.argv[1],'rb').read()
p=8; n=struct.unpack('>I',d[p:p+4])[0]; p+=4
print('objects',n)
for i in range(n):
    props={}
    while d[p:p+4]==b'prop':
        t=d[p+4:p+8]; l=struct.unpack('>I',d[p+8:p+12])[0]; props[t]=d[p+12:p+12+l]; p+=12+l
    typ=d[p:p+4]; sz,usz=struct.unpack('>II',d[p+4:p+12]); body=d[p+12:p+12+sz]; p+=12+sz
    print(typ,sz,usz,props, body[:24].hex())
