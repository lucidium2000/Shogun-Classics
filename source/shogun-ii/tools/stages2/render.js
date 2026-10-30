// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('pageerror', e => console.log('pageerror', e.message));
  await p.goto('file://' + path.join(__dirname, 'stages2.html'));
  for (const id of ['snowpass', 'harbor', 'village', 'keep']) {
    const d = await p.evaluate(id => renderStage2(id), id);
    fs.writeFileSync(path.join(__dirname, id + '.png'), Buffer.from(d.split(',')[1], 'base64'));
  }
  await b.close();
})();
