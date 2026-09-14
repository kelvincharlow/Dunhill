import { mkdir, writeFile } from "node:fs/promises";

const targets = await fetch("http://127.0.0.1:9231/json").then(r => r.json());
const ws = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
const jobs = new Map(); let id = 0;
ws.onmessage = ({data}) => { const m = JSON.parse(data); if (jobs.has(m.id)) { const j = jobs.get(m.id); jobs.delete(m.id); if (m.error) j.reject(m.error); else j.resolve(m.result); } };
await new Promise(r => ws.addEventListener("open", r, {once:true}));
const call = (method, params = {}) => new Promise((resolve,reject) => { const key = ++id; jobs.set(key,{resolve,reject}); ws.send(JSON.stringify({id:key,method,params})); });
const evaluate = async expression => (await call("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true})).result.value;
await mkdir("artifacts",{recursive:true});
await call("Page.enable");
const pause=()=>new Promise(r=>setTimeout(r,1100));
const results=[];
for(const width of [1440,390]) {
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
 await call('Page.navigate',{url:'http://localhost:3000/'});await pause();
 for(const route of ['/about','/services','/projects','/plant-workshops','/compliance','/contact','/']) {
  await evaluate("window.scrollTo({top:document.body.scrollHeight,behavior:'instant'})");
  await evaluate(`document.querySelector('footer nav a[href="${route}"]').click()`);await pause();
  const result=await evaluate('({path:location.pathname,y:scrollY})');
  if(result.path!==route||result.y!==0)throw Error(JSON.stringify({width,...result}));
  results.push({width,...result});
 }
 if(width===390){
  await evaluate("window.scrollTo({top:document.body.scrollHeight,behavior:'instant'});document.querySelector('.menu-button').click();document.querySelector('.mobile-menu nav a[href=\"/projects\"]').click()");await pause();
  if(!await evaluate("location.pathname==='/projects'&&scrollY===0&&!document.querySelector('.mobile-menu').open"))throw Error('Mobile menu navigation failed');
 }
}
await evaluate("document.querySelector('footer a[href=\"/contact#enquiry\"]').click()");await pause();
const enquiry=await evaluate("({hash:location.hash,top:document.querySelector('#enquiry').getBoundingClientRect().top})");
if(enquiry.hash!=='#enquiry'||enquiry.top<70||enquiry.top>150)throw Error(JSON.stringify(enquiry));
await call('Page.navigate',{url:'http://localhost:3000/'});await pause();
await evaluate("document.querySelector('main a[href=\"/services#civil\"]').click()");await pause();
if(!await evaluate("location.hash==='#civil'&&document.querySelector('#civil').open&&Math.abs(document.querySelector('#civil').getBoundingClientRect().top-90)<5"))throw Error('Service anchor failed');
await call('Page.navigate',{url:'http://localhost:3000/projects'});await pause();
await evaluate("window.scrollTo({top:200,behavior:'instant'})");
const before=await evaluate('scrollY');
await evaluate("document.querySelector('nav[aria-label=\"Filter projects by category\"] a[href*=Residential]').click()");await pause();
if(await evaluate('scrollY')!==before)throw Error('Category filter unexpectedly reset scroll');
console.log(JSON.stringify({routes:results,menu:true,enquiryAnchor:true,serviceAnchor:true,filterPosition:true},null,2));
await writeFile('artifacts/scroll-navigation-review.json',JSON.stringify(results,null,2));ws.close();
