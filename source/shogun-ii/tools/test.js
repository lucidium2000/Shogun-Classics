// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, 'out');
const srv = http.createServer((q, r) => {
  const f = path.join(root, decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/, '/index.html'));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; }
    const t = f.endsWith('.html') ? 'text/html' : f.endsWith('.js') ? 'text/javascript' : f.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream';
    r.writeHead(200, { 'content-type': t, 'content-length': d.length }); r.end(d); });
}).listen(8765);
const steps = JSON.parse(process.argv[2] || '[]');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  p.on('console', m => console.log('console:', m.text().slice(0, 300)));
  p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto('http://localhost:8765/');
  await p.waitForSelector('#go:not([disabled])', { timeout: 60000 });
  await p.click('#go');
  let n = 0;
  for (const s of steps) {
    if (s.wait) await p.waitForTimeout(s.wait);
    if (s.key) { await p.keyboard.down(s.key); await p.waitForTimeout(s.hold || 120); await p.keyboard.up(s.key); }
    if (s.mash) { const ks=['KeyU','KeyO','KeyJ','KeyL','KeyD','KeyA']; const end=Date.now()+s.mash; let i=0;
      while (Date.now()<end) { const k=ks[(i++*7)%ks.length]; await p.keyboard.down(k); await p.waitForTimeout(70); await p.keyboard.up(k); await p.waitForTimeout(60); } }
    if (s.shot) await p.locator('#screen').screenshot({ path: `shots/${s.shot}.png` });
  }
  await b.close(); srv.close();
})();
