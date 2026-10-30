// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudasill, Chance Kornegay and Elijah Matthew Cash.
// Source patches for the "Restored" version. Each fixes a 1996 bug or finishes a path the original left open.
function patchSource(name, src, mode) {
  src = src.replace(/\r/g, '');
  if (mode !== 'restored') return src;
  const rep = (a, b) => { if (!src.includes(a)) throw new Error('patch did not apply to ' + name + ': ' + a.slice(0, 40)); src = src.split(a).join(b); };
  if (name === 'SHOGUN') {
    rep('RANDOMIZE TIMER\nGOTO NP\n', 'RANDOMIZE TIMER\n');
    rep('DECLARE SUB SHOGUNL2 (PN$)\n', 'DECLARE SUB SHOGUNL2 (PN$)\nDIM SHARED RTY\n');
  }
  if (name === 'CSHOGUN') {
    rep('LET RTY = 1\nEND\nSHOGUNL4 (PN$)', 'RUN "A:WEND"\nSHOGUNL4 (PN$)');
    rep('CLS\nPRINT "WELL, WELL, "; PN$; ", I CAN SEE YOU ARE GOOD ENOUGH FOR MY LOWER"\nPRINT "STANDARD FIGHTERS, BUT SEE HOW YOU STAND UP AGAINST FRILL."\nPLAY "O0E O0E O0E":\nRUN "A:CSHOGUN"', 'RUN "A:WEND"');
  }
  src = src.replace(/(FT\$ = "\d+) +"/g, '$1"');
  return src;
}
