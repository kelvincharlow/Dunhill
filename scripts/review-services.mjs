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
  await call("Page.navigate",{url:"http://localhost:3000/services"});
  await new Promise(r=>setTimeout(r,1400));
  await evaluate(`(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0);await new Promise(r=>setTimeout(r,200));})()`);
  const layout=await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,active:document.querySelector('.desktop-nav [aria-current]')?.textContent,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)})`);
  results.push(layout);
  if(layout.scrollWidth>width||layout.brokenImages||layout.brokenAnchors.length||layout.active!=="Services")throw Error(JSON.stringify(layout));
  if(width===1440||width===390) {
    const {cssContentSize:s}=await call("Page.getLayoutMetrics");
    const shot=await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,clip:{x:0,y:0,width:s.width,height:s.height,scale:1}});
    await writeFile(`artifacts/services-${width}.png`,Buffer.from(shot.data,"base64"));
  }
}
const ids=["building","civil","industrial","renovation","joinery","fabrication"];
for(const serviceId of ids) {
  await call("Page.navigate",{url:`http://localhost:3000/services#${serviceId}`});
  await new Promise(r=>setTimeout(r,1000));
  const opened=await evaluate(`({id:location.hash,open:document.querySelector(location.hash).open,openCount:document.querySelectorAll('details[open]').length,top:document.querySelector(location.hash).getBoundingClientRect().top})`);
  if(!opened.open||opened.openCount!==1)throw Error(JSON.stringify(opened));
  results.push(opened);
  await evaluate("document.querySelector(location.hash+' summary').click()");
  await evaluate("document.querySelector('nav[aria-label=\"Choose a service\"] a[href=\"'+location.hash+'\"]').click()");
  if(!await evaluate("document.querySelector(location.hash).open")) throw Error("Same-hash reopen failed");
  const expected=await evaluate("document.querySelector(location.hash+' h3').textContent");
  await evaluate("document.querySelector(location.hash+' a.button').click()");
  await new Promise(r=>setTimeout(r,1200));
  const selected=await evaluate("document.querySelector('select[name=service]')?.value");
  if(selected!==expected)throw Error(`Expected ${expected}, got ${selected}`);
  results.push({serviceId,selected});
}
for(const query of ["", "?service=invalid", "?service=Building%20construction&service=Timber%20joinery"]) {
  await call("Page.navigate",{url:"http://localhost:3000/contact"+query});
  await new Promise(r=>setTimeout(r,1000));
  if(await evaluate("document.querySelector('select[name=service]').value")!=="")throw Error("Invalid/default enquiry selection");
}
await call("Page.navigate",{url:"http://localhost:3000/services"});
await new Promise(r=>setTimeout(r,1000));
const destinations=await evaluate(`(async()=>{const links=[...new Set([...document.querySelectorAll('main a[href^="/"]')].map(a=>a.getAttribute('href')))];return await Promise.all(links.map(async href=>({href,status:(await fetch(href)).status})));})()`);
if(destinations.some(link=>link.status!==200))throw Error(JSON.stringify(destinations));
results.push({destinations});
await writeFile("artifacts/services-review.json",JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
ws.close();
