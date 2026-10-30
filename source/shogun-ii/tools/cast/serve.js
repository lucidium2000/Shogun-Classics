// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
// static server: /js -> shogun3-mockup/js, everything else -> cast dir
const http=require('http'),fs=require('fs'),path=require('path');
module.exports=(port)=>http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split(/[?#]/)[0]);
 const f=u.startsWith('/js/')?path.join('/mnt/project-files/shogun3-mockup',u):path.join(__dirname,u);
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':f.endsWith('.html')?'text/html':'text/javascript'});r.end(d)})}).listen(port);
