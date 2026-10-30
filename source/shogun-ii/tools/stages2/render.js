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
