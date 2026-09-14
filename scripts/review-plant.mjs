import { mkdir, writeFile } from "node:fs/promises";
const targets = await fetch("http://127.0.0.1:9231/json").then(r => r.json());
const ws = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
const jobs = new Map(); let id = 0;
ws.onmessage = ({data}) => { const m = JSON.parse(data); if(jobs.has(m.id)) {const j=jobs.get(m.id); jobs.delete(m.id); if(m.error)j.reject(m.error); else j.resolve(m.result);} };
await new Promise(r => ws.addEventListener("open",r,{once:true}));
const call = (method,params={}) => new Promise((resolve,reject)=>{const key=++id;jobs.set(key,{resolve,reject});ws.send(JSON.stringify({id:key,method,params}));});
const evaluate = async expression => (await call("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true})).result.value;
await call("Page.enable");
await mkdir("artifacts",{recursive:true});
const results=[];
for(const width of [1440,1024,801,768,390,320]) {
  await call("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<700});
  await call("Page.navigate",{url:"http://localhost:3000/plant-workshops"});
  await new Promise(r=>setTimeout(r,1300));
  await evaluate(`(async()=>{await document.fonts.ready;for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await new Promise(r=>setTimeout(r,200));})()`);
  results.push(await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.title,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,active:document.querySelector('.desktop-nav [aria-current]')?.textContent,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)})`));
  if(width===1440||width===390){
    const {cssContentSize:s}=await call("Page.getLayoutMetrics");
    const shot=await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,clip:{x:0,y:0,width:s.width,height:s.height,scale:1}});
    await writeFile(`artifacts/plant-workshops-${width}.png`,Buffer.from(shot.data,"base64"));
  }
  if(width===390){
    await evaluate(`document.querySelector('.menu-button').click()`);
    results.push(await evaluate(`({menuOpen:document.querySelector('.mobile-menu').open,links:[...document.querySelectorAll('.mobile-menu nav a')].map(a=>[a.textContent,a.getAttribute('href')])})`));
    await evaluate(`document.querySelector('.close-button').click()`);
  }
}
await call("Page.navigate",{url:"http://localhost:3000/plant-workshops"});
await new Promise(r=>setTimeout(r,1200));
results.push(await evaluate(`(async()=>{const links=[...new Set([...document.querySelectorAll('main a[href^="/"]')].map(a=>a.getAttribute('href')))];return {destinations:await Promise.all(links.map(async href=>({href,status:(await fetch(href)).status})))};})()`));
for(const result of results) {
  if(result.scrollWidth>result.width||result.brokenImages||result.brokenAnchors?.length) throw Error(JSON.stringify(result));
  if(result.active&&result.active!=="Plant & Machinery") throw Error("Incorrect active page");
  if(result.destinations?.some(link=>link.status!==200)) throw Error("Broken destination");
}
for (const [id,expected] of [["equipment","Plant & machinery"],["joinery-workshop","Timber joinery"],["metal-workshop","Metal & structural fabrication"],["contact","Plant & machinery"]]) {
  await call("Page.navigate",{url:"http://localhost:3000/plant-workshops#"+id});
  await new Promise(r=>setTimeout(r,1000));
  await evaluate(`document.querySelector('#${id} a[href^="/contact?"]').click()`);
  await new Promise(r=>setTimeout(r,1000));
  const actual=await evaluate("document.querySelector('select[name=service]')?.value");
  if(actual!==expected)throw Error(`Expected ${expected}, got ${actual}`);
  results.push({id,selected:actual});
}
for(const service of ["joinery","fabrication"]) {
  await call("Page.navigate",{url:"http://localhost:3000/plant-workshops"});
  await new Promise(r=>setTimeout(r,900));
  await evaluate(`document.querySelector('a[href="/services#${service}"]').click()`);
  await new Promise(r=>setTimeout(r,1000));
  if(!await evaluate(`document.querySelector('#${service}').open`))throw Error('Related service did not open');
}
await writeFile("artifacts/plant-workshops-review.json",JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
ws.close();
