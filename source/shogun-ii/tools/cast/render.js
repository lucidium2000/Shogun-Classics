const {chromium}=require('playwright');const fs=require('fs');const srv=require('./serve.js')(8772);
const save=(f,d)=>fs.writeFileSync(f,Buffer.from(d.split(',')[1],'base64'));
(async()=>{const b=await chromium.launch();const p=await b.newPage();
p.on('pageerror',e=>console.log('err',e.message));
await p.goto('http://localhost:8772/render.html');await p.waitForFunction('window.ready');
for(const id of ['shokei','wanfu','yamana','frill','onikage']){
  const r=await p.evaluate(id=>renderChar(id),id);
  const d=`out/${id}`;fs.mkdirSync(d,{recursive:true});
  for(const [k,l] of Object.entries(r.frames)) l.forEach((u,i)=>save(`${d}/${k}${i+1}.png`,u));
  r.fball.forEach((u,i)=>save(`${d}/fball${i+1}.png`,u));r.fballx.forEach((u,i)=>save(`${d}/fballx${i+1}.png`,u));
  save(`${d}/portrait.png`,r.portrait);
  fs.writeFileSync(`${d}/meta.json`,JSON.stringify({name:r.name,ui:r.ui,height:r.height}));
  console.log(id,Object.keys(r.frames).length);
}
fs.mkdirSync('out/stages',{recursive:true});
for(const s of ['temple','bamboo','shrine','keep']){save(`out/stages/${s}.png`,await p.evaluate(s=>renderStage(s,760,280),s));}
await b.close();srv.close();})();
