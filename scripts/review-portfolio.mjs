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
for(const route of ["/services","/projects","/projects/crescent-pearl","/projects/pms-warehousing"]) {
 for(const width of [1440,390,320,768]) {
  await call("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<700});
  await call("Page.navigate",{url:"http://localhost:3103"+route});
  await new Promise(r=>setTimeout(r,1000));
  await evaluate(`(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));})()`);
  results.push(await evaluate(`({route:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)})`));
  if(width===1440||width===390) {
   const shot=await call("Page.captureScreenshot",{format:"png"});
   await writeFile("artifacts/"+route.replaceAll("/","-")+"-"+width+".png",Buffer.from(shot.data,"base64"));
  }
  if(route==="/projects") {
   results.push(await evaluate(`(()=>{const buttons=[...document.querySelectorAll('button[aria-controls="project-results"]')];return {filters:buttons.map(b=>b.textContent),cards:document.querySelectorAll('#project-results>a').length}})()`));
   for(let index=0;index<7;index++){
    await evaluate(`document.querySelectorAll('button[aria-controls="project-results"]')[${index}].click()`);
    await new Promise(r=>setTimeout(r,80));
    results.push(await evaluate(`({filter:document.querySelector('button[aria-pressed=true]')?.textContent,cards:document.querySelectorAll('#project-results>a').length,status:document.querySelector('[role=status]')?.textContent})`));
   }
  }
 }
}
const urls=await evaluate(`fetch('/projects').then(r=>r.text()).then(t=>[...new DOMParser().parseFromString(t,'text/html').querySelectorAll('a[href^="/projects/"]')].map(a=>a.getAttribute('href')))`);
for(const url of [...new Set(urls)]) results.push({url,status:(await fetch("http://localhost:3103"+url)).status});
results.push({unknownProjectStatus:(await fetch("http://localhost:3103/projects/not-a-project")).status});
await writeFile("artifacts/portfolio-review.json",JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
await call("Browser.close");
