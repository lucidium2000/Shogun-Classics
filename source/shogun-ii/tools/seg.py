# Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
# Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
# Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
import sys, glob, os
from rembg import remove, new_session
from PIL import Image
model=sys.argv[1]; out=sys.argv[2]; files=sys.argv[3:]
os.makedirs(out,exist_ok=True)
s=new_session(model)
for f in files:
    im=Image.open(f).convert('RGB')
    m=remove(im,session=s,only_mask=True)
    m.save(os.path.join(out,os.path.basename(f).replace('.JPG','.png')))
    print(f,flush=True)
