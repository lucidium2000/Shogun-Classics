# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
import sys, os
sys.path.insert(0,'tools')
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from audit_frames import frames, mask
import build_keero as bk
src = {k:list(v) for k,v in bk.MOVES.items()}
src['smove'][3]='55 flip'; src['smove'][4]='55 flip'
src['smovex']=src['smove']
names = {'static':'Stance','walk':'Walk','jump':'Jump','crouch':'Crouch','block':'Block','gblock':'Crouch block','hurt':'Hurt','ghurt':'Crouch hurt','ko':'Knocked out','intro':'Intro','outwin':'Victory',
 'wpunch':'Light punch','spunch':'Strong punch','wkick':'Light kick','skick':'Strong kick','gpunch':'Crouch punch','gkick':'Crouch kick','apunch':'Jump punch','akick':'Jump kick',
 'fireb':'FIREBALL\n(down, fwd, P)','rush':'UPPERCUT\n(back, fwd, P)','smove':'FATAL KICK\n(back, fwd, K)','smovex':'SUPER\n(dn,fwd,dn,fwd,K)'}
order=['fireb','rush','smove','smovex','static','walk','jump','crouch','block','gblock','hurt','ghurt','ko','wpunch','spunch','wkick','skick','gpunch','gkick','apunch','akick','intro','outwin']
S=0.6; TW=int(100*S)+8; TH=int(150*S)+20; LW=150
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',13); fs=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',10)
rows=[(m,frames('keero',m)) for m in order if frames('keero',m)]
import re as _re, json
used=set(int(n) for v in bk.MOVES.values() for x in v for n in _re.findall(r'\d+',str(x)))
spare=[i for i in range(1,64) if i not in used]
SPC=ncol_guess=None
ncol=max(len(r[1]) for r in rows)
nsp_rows=(len(spare)+ncol-1)//ncol
W=LW+ncol*TW+10; H=44+len(rows)*TH+30+nsp_rows*TH
num=0; key={}
img=Image.new('RGB',(W,H),(245,240,232)); d=ImageDraw.Draw(img)
d.text((10,8),'KEERO: every image has its own number. Tell me a move and the numbers in the order you want, e.g. "Fatal Kick: 13, 14, 124, 124, 20".',font=f,fill=(120,20,10))
d.text((10,26),'Grey # = original 2004 photo. Spare photos that no move uses yet are at the bottom.',font=fs,fill=(90,90,90))
for r,(mv,fl) in enumerate(rows):
    y=44+r*TH
    special = mv in ('fireb','rush','smove','smovex')
    if special: d.rectangle((0,y-3,W,y+TH-5),fill=(250,222,210))
    d.multiline_text((8,y+TH//2-20),names[mv],font=f,fill=(150,20,10) if special else (30,30,30))
    for c,p in enumerate(fl):
        arr=np.asarray(Image.open(p).convert('RGB')).copy(); m=mask(p)
        arr[~m]=(228,222,212)
        t=Image.fromarray(arr); t=t.resize((max(1,int(t.width*S)),int(t.height*S)))
        if t.width>TW-2: t=t.crop((0,0,TW-2,t.height))
        x=LW+c*TW
        img.paste(t,(x,y))
        num+=1; key[num]={'move':mv,'frame':c+1,'file':os.path.basename(p)}
        d.rectangle((x,y,x+len(str(num))*9+4,y+15),fill=(255,255,255)); d.text((x+2,y),str(num),font=f,fill=(210,0,0))
        ph=src.get(mv,[]); lab=ph[c] if c<len(ph) else ''
        d.text((x+2,y+TH-30),f'#{lab}',font=fs,fill=(100,100,100))
y0=44+len(rows)*TH+6
d.rectangle((0,y0-4,W,H),fill=(222,232,245)); d.text((8,y0),'SPARE PHOTOS (not used by any move yet)',font=f,fill=(20,50,120))
for k,n in enumerate(spare):
    y=y0+24+(k//ncol)*TH; x=LW+(k%ncol)*TW
    try:
        a,_=bk.frame(n); t=Image.fromarray(a,'RGBA'); bgc=Image.new('RGBA',t.size,(228,222,212,255)); bgc.alpha_composite(t); t=bgc.convert('RGB')
        t.thumbnail((TW-2,int(150*S)))
    except Exception as e:
        t=Image.open(bk.photo(n)).convert('RGB'); t.thumbnail((TW-2,int(150*S)))
    img.paste(t,(x,y))
    num+=1; key[num]={'spare_photo':n}
    d.rectangle((x,y,x+len(str(num))*9+4,y+15),fill=(255,255,255)); d.text((x+2,y),str(num),font=f,fill=(210,0,0))
    d.text((x+2,y+TH-30),f'#{n}',font=fs,fill=(100,100,100))
img.save('/mnt/project-files/shogun2-port/keero-frame-key.png'); print(img.size, num)
json.dump(key,open('/mnt/project-files/shogun2-port/keero-frame-key.json','w'),indent=0)
