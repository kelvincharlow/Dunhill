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
for(const width of [1440,390,320,768]){
 await call("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<700});
 await call("Page.navigate",{url:"http://localhost:3107/contact"});
 await new Promise(r=>setTimeout(r,1000));
 await evaluate("document.fonts.ready");
 results.push(await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.title,missingAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).length,emptyFormValid:document.querySelector('form').checkValidity()})`));
 if(width===1440||width===390){
  const {cssContentSize:s}=await call("Page.getLayoutMetrics");
  const shot=await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,clip:{x:0,y:0,width:s.width,height:s.height,scale:1}});
  await writeFile("artifacts/contact-"+width+".png",Buffer.from(shot.data,"base64"));
 }
 await evaluate(`(()=>{const f=document.querySelector('form');f.elements.name.value='Local test';f.elements.email.value='test@example.com';f.elements.service.value='General enquiry';f.elements.description.value='Local verification only. Do not send.';f.elements.consent.checked=true;f.requestSubmit()})()`);
 await new Promise(r=>setTimeout(r,100));
 results.push(await evaluate(`({status:document.querySelector('[role=status]').textContent,draftPrepared:[...document.querySelectorAll('form a')].some(a=>a.href.startsWith('mailto:')&&decodeURIComponent(a.href).includes('Local verification only')),inputRetained:document.querySelector('[name=name]').value==='Local test'})`));
 if(width===390){
  await evaluate("document.querySelector('.menu-button').click()");
  results.push(await evaluate(`({menuOpen:document.querySelector('.mobile-menu').open,contactCTA:document.querySelector('.mobile-menu>a').getAttribute('href')})`));
  await evaluate("document.querySelector('.close-button').click()");
 }
}
const valid={name:"Local test",company:"",email:"test@example.com",phone:"",service:"General enquiry",location:"",value:"Not specified",description:"Local test only. No delivery configured.",consent:true,website:""};
for(const [label,data,origin,expected] of [["invalid",{}, "http://localhost:3107",400],["unconfigured",valid,"http://localhost:3107",503],["foreign-origin",valid,"https://example.com",403],["honeypot",{...valid,website:"spam"},"http://localhost:3107",400],["oversized",{...valid,description:"a".repeat(17000)},"http://localhost:3107",413]]){
 const response=await fetch("http://localhost:3107/api/enquiry",{method:"POST",headers:{"Content-Type":"application/json",Origin:origin},body:JSON.stringify(data)});
 results.push({test:label,status:response.status,expected,pass:response.status===expected});
}
await writeFile("artifacts/contact-review.json",JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
await call("Browser.close");
