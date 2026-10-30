import struct,sys
def load(path):
    d=open(path,'rb').read()
    bpp=d[3]; xmin,ymin,xmax,ymax=struct.unpack('<4H',d[4:12]); planes=d[65]; bpl=struct.unpack('<H',d[66:68])[0]
    w=xmax-xmin+1;h=ymax-ymin+1
    out=bytearray(); i=128; total=bpl*planes*h
    while len(out)<total and i<len(d):
        c=d[i];i+=1
        if c>=0xC0: n=c&0x3f; v=d[i];i+=1; out+=bytes([v])*n
        else: out.append(c)
    pal=None
    if bpp==8 and planes==1 and d[-769]==12: pal=[tuple(d[-768+3*k:-768+3*k+3]) for k in range(256)]
    return w,h,bpp,planes,bpl,out,pal
if __name__=='__main__':
    for p in sys.argv[1:]:
        w,h,bpp,pl,bpl,px,pal=load(p)
        from collections import Counter
        c=Counter(px[y*bpl+x] for y in range(h) for x in range(w)) if pl==1 else None
        print(p,w,h,bpp,pl,'pal0',pal and pal[0], 'top', c and [(k,v,pal and pal[k]) for k,v in c.most_common(3)])
