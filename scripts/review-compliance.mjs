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
  await call("Page.navigate",{url:"http://localhost:3000/compliance"});
  await new Promise(r=>setTimeout(r,1300));
  await evaluate(`(async()=>{await document.fonts.ready;for(const img of document.images)img.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));await new Promise(r=>setTimeout(r,200));})()`);
  results.push(await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.title,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,active:document.querySelector('.desktop-nav [aria-current]')?.textContent,brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)})`));
  if(width===1440||width===390){
    const {cssContentSize:s}=await call("Page.getLayoutMetrics");
    const shot=await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,clip:{x:0,y:0,width:s.width,height:s.height,scale:1}});
    await writeFile(`artifacts/compliance-${width}.png`,Buffer.from(shot.data,"base64"));
  }
  if(width===390){
    await evaluate(`document.querySelector('.menu-button').click()`);
    results.push(await evaluate(`({menuOpen:document.querySelector('.mobile-menu').open,links:[...document.querySelectorAll('.mobile-menu nav a')].map(a=>[a.textContent,a.getAttribute('href')])})`));
    await evaluate(`document.querySelector('.close-button').click()`);
  }
}
await call("Page.navigate",{url:"http://localhost:3000/compliance"});
await new Promise(r=>setTimeout(r,1200));
results.push(await evaluate(`(async()=>{const links=[...new Set([...document.querySelectorAll('main a[href^="/"]')].map(a=>a.getAttribute('href')))];return {destinations:await Promise.all(links.map(async href=>({href,status:(await fetch(href)).status})))};})()`));
for(const result of results) {
  if(result.scrollWidth>result.width||result.brokenImages||result.brokenAnchors?.length) throw Error(JSON.stringify(result));
  if(result.active&&result.active!=="Compliance") throw Error("Incorrect active page");
  if(result.destinations?.some(link=>link.status!==200)) throw Error("Broken destination");
}
await call("Page.navigate",{url:"http://localhost:3000/compliance"});
await new Promise(r=>setTimeout(r,1000));
const selector='form[aria-label="Choose credentials to request"]';
if(await evaluate(`document.querySelectorAll('${selector} input[type=checkbox]').length`)!==7)throw Error('Expected seven documents');
await evaluate(`document.querySelector('${selector} input[type=checkbox]').focus()`);
await call("Input.dispatchKeyEvent",{type:"keyDown",key:" ",code:"Space",windowsVirtualKeyCode:32});
await call("Input.dispatchKeyEvent",{type:"keyUp",key:" ",code:"Space",windowsVirtualKeyCode:32});
if(!await evaluate(`document.querySelector('${selector} input[type=checkbox]').checked`))throw Error('Keyboard checkbox failed');
await evaluate(`document.querySelector('${selector} button[type=button]').click()`);
await new Promise(r=>setTimeout(r,100));
if(await evaluate(`document.querySelectorAll('${selector} input:checked').length`)!==7)throw Error('Select all failed');
await evaluate(`document.querySelector('${selector} button[type=button]').click()`);
await new Promise(r=>setTimeout(r,100));
if(await evaluate(`document.querySelectorAll('${selector} input:checked').length`)!==0)throw Error('Clear selection failed');
await evaluate(`document.querySelector('input[value="building-registration"]').click();document.querySelector('input[value="tax-compliance"]').click()`);
await new Promise(r=>setTimeout(r,100));
if(await evaluate(`document.querySelectorAll('${selector} input:checked').length`)!==2)throw Error('Individual selection failed');
await evaluate(`document.querySelector('${selector} button[type=submit]').click()`);
await new Promise(r=>setTimeout(r,1300));
const request=await evaluate(`({service:document.querySelector('select[name=service]').value,description:document.querySelector('textarea[name=description]').value})`);
if(request.service!=="Compliance documents"||!request.description.includes('Building Works registration')||!request.description.includes('Tax compliance certificate')||request.description.includes('Business permits'))throw Error(JSON.stringify(request));
results.push({request,keyboard:true,selectAll:true,clear:true});
for(const [query,expected] of [
  ['?service=Compliance%20documents&documents=tax-compliance&documents=tax-compliance&documents=unknown','Tax compliance certificate'],
  ['?service=Compliance%20documents&documents=unknown',''],
  ['?service=Building%20construction&documents=tax-compliance',''],
  ['','']
]) {
 await call("Page.navigate",{url:"http://localhost:3000/contact"+query});
 await new Promise(r=>setTimeout(r,1000));
 const description=await evaluate("document.querySelector('textarea[name=description]').value");
 if(expected ? description.split(expected).length!==2 : description!=='')throw Error('Invalid or repeated document handling failed');
}
await call("Page.navigate",{url:"http://localhost:3000/compliance"});
await new Promise(r=>setTimeout(r,1000));
await evaluate(`document.querySelector('${selector} button[type=submit]').click()`);
await new Promise(r=>setTimeout(r,1000));
if(await evaluate("document.querySelector('select[name=service]').value")!=='Compliance documents')throw Error('General credentials enquiry failed');
await call("Page.navigate",{url:"http://localhost:3000/compliance"});
await new Promise(r=>setTimeout(r,1000));
const facts=await evaluate(`(()=>{document.querySelectorAll('main details').forEach(d=>d.open=true);return {faq:document.querySelectorAll('main details[open]').length,publicDownloads:document.querySelectorAll('main a[download],main iframe,main object').length}})()`);
if(facts.faq!==3||facts.publicDownloads)throw Error(JSON.stringify(facts));
results.push({facts,queryValidation:true,generalRequest:true});
await writeFile("artifacts/compliance-review.json",JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
ws.close();
