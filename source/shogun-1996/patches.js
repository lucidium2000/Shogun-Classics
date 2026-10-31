// Shogun Classics - https://github.com/lucidium2000/Shogun-Classics
// Copyright (c) 1996-2026 Chris (lucidium2000) and Mystical Software. MIT License, see LICENSE.
// Created with Corbin Hildreth, Jason Rudisill, Chance Kornegay and Elijah Matthew Cash.
// Source patches for the "Restored" version. Each fixes a 1996 bug or finishes a path the original left open.
function patchSource(name, src, mode) {
  src = src.replace(/\r/g, '');
  if (mode !== 'restored') return src;
  const rep = (a, b) => { if (!src.includes(a)) throw new Error('patch did not apply to ' + name + ': ' + a.slice(0, 40)); src = src.split(a).join(b); };
  // Fair fights. In 1996 every mashed key waited in the keyboard buffer, and the fight loop
  // read your key before the enemy's roll, so mashing Space won every exchange (see the
  // "PLEASE FIND A KEYBOARD BUFFER CLEAR STATEMENT" note in SHOGUN.BAS). Now, after each
  // exchange: keys pressed during the animation are thrown away, a punch thrown within 0.15 s
  // (a mash, not a read) is countered, and the enemy attacks at a random moment 0.7-1.7 s in.
  const fair = (skip, flushLabel, poll, pollNew, roll, rollNew) => {
    rep(skip, skip + flushLabel + ': IF INKEY$ <> "" THEN GOTO ' + flushLabel + '\nLET NH = TIMER + .15: LET ET = TIMER + .7 + RND\n');
    rep(poll, pollNew); rep(roll, rollNew);
  };
  if (name === 'SHOGUN') {
    fair('SKIP: COLOR 15: COLOR 0:\n', 'FAIR1',
      'INPUG: LET G$ = "I": G$ = INKEY$: IF G$ = " " THEN GOTO HIT\n', 'INPUG: LET G$ = "I": G$ = INKEY$: IF (G$ = " ") AND (TIMER < NH) THEN GOTO EHIT\nIF G$ = " " THEN GOTO HIT\n',
      'IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG\nRANDOMIZE TIMER', 'IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG\nIF TIMER < ET THEN GOTO INPUG\nRANDOMIZE TIMER');
    fair('SKIP2: COLOR 15: COLOR 0:\n', 'FAIR2',
      'IF G$ = " " THEN GOTO HIT2\nIF G$ = "6" THEN GOTO POWER2\n', 'IF (G$ = " ") AND (TIMER < NH) THEN GOTO EHIT2\nIF G$ = " " THEN GOTO HIT2\nIF G$ = "6" THEN GOTO POWER2\n',
      'IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG2\nRANDOMIZE TIMER', 'IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG2\nIF TIMER < ET THEN GOTO IMPUG2\nRANDOMIZE TIMER');
    fair('SKIP3: COLOR 15: COLOR 0:\n', 'FAIR3',
      'IMPUG3: LET G$ = "": G$ = INKEY$: IF G$ = " " THEN GOTO HIT3\n', 'IMPUG3: LET G$ = "": G$ = INKEY$: IF (G$ = " ") AND (TIMER < NH) THEN GOTO EHIT3\nIF G$ = " " THEN GOTO HIT3\n',
      'IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG3\nRANDOMIZE TIMER', 'IF (TWO < 1) AND (RD = 1) THEN GOTO IMPUG3\nIF TIMER < ET THEN GOTO IMPUG3\nRANDOMIZE TIMER');
    fair('SKIP4: COLOR 15: COLOR 0:\n', 'FAIR4',
      'IMPUG4: G$ = INKEY$: IF G$ = " " THEN GOTO HIT4\n', 'IMPUG4: G$ = INKEY$: IF (G$ = " ") AND (TIMER < NH) THEN GOTO EHIT4\nIF G$ = " " THEN GOTO HIT4\n',
      'IF (HKL = 1) AND (G$ = "4") THEN LET HKL = 0: GOTO BLOCK4\nRANDOMIZE TIMER', 'IF (HKL = 1) AND (G$ = "4") THEN LET HKL = 0: GOTO BLOCK4\nIF TIMER < ET THEN GOTO IMPUG4\nRANDOMIZE TIMER');
  }
  if (name === 'CSHOGUN') {
    fair('SKIP3: COLOR 15: COLOR 0:\n', 'FAIR5',
      'IMPUG3: G$ = INKEY$:\nIF G$ = " " THEN GOTO HIT3\n', 'IMPUG3: G$ = INKEY$:\nIF (G$ = " ") AND (TIMER < NH) THEN GOTO EHIT3\nIF G$ = " " THEN GOTO HIT3\n',
      '\nRT: RANDOMIZE TIMER: X% = INT(RND * 4)', '\nIF TIMER < ET THEN GOTO IMPUG3\nRT: RANDOMIZE TIMER: X% = INT(RND * 4)');
  }
  if (name === 'SHOGUN') {
    rep('RANDOMIZE TIMER\nGOTO NP\n', 'RANDOMIZE TIMER\n');
    rep('DECLARE SUB SHOGUNL2 (PN$)\n', 'DECLARE SUB SHOGUNL2 (PN$)\nDIM SHARED RTY\n');
  }
  // Uppercutting Yamana: the second frame cleared the screen and then played its note, so the
  // screen sat black for the length of the note. Play the note first, then redraw.
  if (name === 'SHOGUN') rep('CLS : COLOR 4: PLAY "O0E": PRINT TAB(15)', 'PLAY "O0E": CLS : COLOR 4: PRINT TAB(15)');
  // Frill was near unbeatable: he attacked on 3 rolls in 4 and countered every third punch.
  // Now he attacks half the time and counters every fifth punch. His hits still hurt more than Wan'fu's.
  if (name === 'CSHOGUN') {
    rep('RT: RANDOMIZE TIMER: X% = INT(RND * 4)', 'RT: RANDOMIZE TIMER: X% = INT(RND * 6)');
    rep('IF H = 3 THEN LET H = 0: GOTO RT', 'IF H = 5 THEN LET H = 0: GOTO RT');
  }
  if (name === 'CSHOGUN') {
    rep('LET RTY = 1\nEND\nSHOGUNL4 (PN$)', 'RUN "A:WEND"\nSHOGUNL4 (PN$)');
    rep('CLS\nPRINT "WELL, WELL, "; PN$; ", I CAN SEE YOU ARE GOOD ENOUGH FOR MY LOWER"\nPRINT "STANDARD FIGHTERS, BUT SEE HOW YOU STAND UP AGAINST FRILL."\nPLAY "O0E O0E O0E":\nRUN "A:CSHOGUN"', 'RUN "A:WEND"');
  }
  src = src.replace(/(FT\$ = "\d+) +"/g, '$1"');
  return src;
}
