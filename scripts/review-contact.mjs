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
let intercepted=0;
ws.addEventListener('message', async ({data})=>{
  const event=JSON.parse(data);
  if(event.method==='Fetch.requestPaused') {
    intercepted++;
    await call('Fetch.fulfillRequest',{requestId:event.params.requestId,responseCode:502,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify({error:'Local review: delivery unavailable.'})).toString('base64')});
  }
});
await call('Fetch.enable',{patterns:[{urlPattern:'*/api/enquiry*',requestStage:'Request'}]});
const results=[];
async function go(query='') { await call('Page.navigate',{url:'http://localhost:3000/contact'+query});await new Promise(r=>setTimeout(r,1200)); }
for(const width of [1440,1024,801,768,390,320]) {
 await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<700});
 await go();
 await evaluate(`(async()=>{await document.fonts.ready;for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0);await new Promise(r=>setTimeout(r,200));})()`);
 const layout=await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,missingAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).length,emptyFormValid:document.querySelector('form').checkValidity(),brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,optionalOpen:document.querySelector('form details').open})`);
 if(layout.scrollWidth>width||layout.missingAnchors||layout.emptyFormValid||layout.brokenImages||layout.optionalOpen)throw Error(JSON.stringify(layout));
 results.push(layout);
 if(width===1440||width===390) {
  const {cssContentSize:s}=await call('Page.getLayoutMetrics');
  const shot=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:s.width,height:s.height,scale:1}});
  await writeFile(`artifacts/contact-${width}.png`,Buffer.from(shot.data,'base64'));
 }
}
await go('?service=Compliance%20documents&documents=tax-compliance&documents=incorporation');
const prefilled=await evaluate(`({service:document.querySelector('[name=service]').value,message:document.querySelector('textarea[name=description]').value})`);
if(prefilled.service!=='Compliance documents'||!prefilled.message.includes('Tax compliance certificate')||!prefilled.message.includes('Certificate of incorporation'))throw Error('Document prefill failed');
results.push({prefilled});
await go('?service=Timber%20joinery');
if(await evaluate("document.querySelector('[name=service]').value")!=='Timber joinery')throw Error('Service prefill failed');
await evaluate(`(()=>{const f=document.querySelector('form');f.elements.name.value='Local review';f.elements.email.value='test@example.com';f.elements.description.value='Local verification only. Do not send.';})()`);
if(await evaluate("document.querySelector('form').checkValidity()"))throw Error('Missing consent accepted');
await evaluate("document.querySelector('[name=consent]').click();document.querySelector('form details summary').click()");
if(!await evaluate("document.querySelector('form details').open"))throw Error('Optional details failed');
await evaluate(`(()=>{const f=document.querySelector('form');f.elements.company.value='Review company';f.elements.phone.value='+254700000000';f.elements.location.value='Nairobi';f.elements.value.value='Prefer to discuss';f.requestSubmit();})()`);
await new Promise(r=>setTimeout(r,600));
const draft=await evaluate(`({status:document.querySelector('[role=status]').textContent,href:document.querySelector('form a[href^="mailto:"]')?.getAttribute('href'),retained:document.querySelector('[name=name]').value})`);
if(!draft.href||!decodeURIComponent(draft.href).includes('Review company')||!decodeURIComponent(draft.href).includes('Prefer to discuss')||draft.retained!=='Local review')throw Error(JSON.stringify(draft));
results.push({draftPrepared:true,optionalIncluded:true,inputsRetained:true,status:draft.status});
await evaluate(`(()=>{const input=document.querySelector('textarea[name=description]');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(input,'Updated local review. Do not send.');input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
await new Promise(r=>setTimeout(r,100));
if(await evaluate("Boolean(document.querySelector('form a[href^=\"mailto:\"]'))"))throw Error('Stale draft was not cleared');
await evaluate("document.querySelector('form').requestSubmit()");
await new Promise(r=>setTimeout(r,400));
if(!await evaluate("decodeURIComponent(document.querySelector('form a[href^=\"mailto:\"]').href).includes('Updated local review')"))throw Error('Updated draft missing');
await go();
await evaluate(`(()=>{const f=document.querySelector('form');f.elements.name.value='Local review';f.elements.email.value='test@example.com';f.elements.service.value='General enquiry';f.elements.description.value='Local verification only. Do not send.';f.elements.consent.checked=true;f.requestSubmit();})()`);
await new Promise(r=>setTimeout(r,400));
if(!await evaluate("Boolean(document.querySelector('form a[href^=\"mailto:\"]'))"))throw Error('Minimal form failed with optional details closed');
await go('?service=invalid');
if(await evaluate("document.querySelector('[name=service]').value")!=='')throw Error('Invalid service accepted');
const contacts=await evaluate(`({phones:[...document.querySelectorAll('main a[href^="tel:"]')].map(a=>a.getAttribute('href')),directions:document.querySelector('a[href^="https://www.google.com/maps"]').getAttribute('rel')})`);
if(!contacts.phones.includes('tel:+254717229495')||!contacts.phones.includes('tel:+254722513547')||!contacts.directions.includes('noopener'))throw Error('Contact links failed');
results.push({staleDraftCleared:true,minimalForm:true,contacts,interceptedDeliveryRequests:intercepted});
await writeFile('artifacts/contact-review.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
await call('Fetch.disable');
ws.close();
