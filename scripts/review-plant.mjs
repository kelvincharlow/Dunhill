import { writeFile } from "node:fs/promises";
const targets = await fetch("http://127.0.0.1:9231/json").then(r => r.json());
const ws = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
const jobs = new Map(); let id = 0;
ws.onmessage = ({data}) => { const m = JSON.parse(data); if(jobs.has(m.id)) {const j=jobs.get(m.id); jobs.delete(m.id); if(m.error)j.reject(m.error); else j.resolve(m.result);} };
await new Promise(r => ws.addEventListener("open",r,{once:true}));
const call = (method,params={}) => new Promise((resolve,reject)=>{const key=++id;jobs.set(key,{resolve,reject});ws.send(JSON.stringify({id:key,method,params}));});
const evaluate = async expression => (await call("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true})).result.value;
await call("Page.enable");
const results=[];
for(const width of [1440,390,320,768]) {
  await call("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<700});
  await call("Page.navigate",{url:"http://localhost:3105/plant-workshops"});
  await new Promise(r=>setTimeout(r,1300));
  await evaluate(`(async()=>{for(const i of document.images)i.loading='eager';await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,15000))]);})()`);
  results.push(await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.title,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,active:document.querySelector('.desktop-nav [aria-current]')?.textContent,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)})`));
  if(width===1440||width===390){
    const {cssContentSize:s}=await call("Page.getLayoutMetrics");
    const shot=await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,clip:{x:0,y:0,width:s.width,height:s.height,scale:1}});
    await writeFile(`artifacts/plant-workshops-${width}.png`,Buffer.from(shot.data,"base64"));
  }
  results.push(await evaluate(`(()=>{const d=document.querySelectorAll('main details');d.forEach(e=>e.open=true);return {equipmentSections:d.length,expanded:[...d].every(e=>e.open)}})()`));
  if(width===390){
    await evaluate(`document.querySelector('.menu-button').click()`);
    results.push(await evaluate(`({menuOpen:document.querySelector('.mobile-menu').open,links:[...document.querySelectorAll('.mobile-menu nav a')].map(a=>[a.textContent,a.getAttribute('href')])})`));
    await evaluate(`document.querySelector('.close-button').click()`);
  }
}
await call("Page.navigate",{url:"http://localhost:3105"});
await new Promise(r=>setTimeout(r,1200));
results.push(await evaluate(`({homeAboutLinks:[...document.querySelectorAll('a')].filter(a=>a.textContent.trim()==='About').map(a=>a.getAttribute('href'))})`));
await writeFile("artifacts/plant-workshops-review.json",JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
await call("Browser.close");
