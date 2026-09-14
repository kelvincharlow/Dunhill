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
async function go(path) {
  await call("Page.navigate",{url:"http://localhost:3000"+path});
  await new Promise(r=>setTimeout(r,1200));
}
async function settled() { await new Promise(r=>setTimeout(r,900)); }
for(const route of ["/projects","/projects/crescent-pearl","/projects/pms-warehousing"]) {
  for(const width of [1440,1024,801,768,390,320]) {
    await call("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<700});
    await go(route);
    await evaluate(`(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));window.scrollTo(0,0);await new Promise(r=>setTimeout(r,200));})()`);
    const layout=await evaluate(`({route:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.naturalWidth).length,h1:document.querySelectorAll('h1').length,active:document.querySelector('.desktop-nav [aria-current]')?.textContent})`);
    if(layout.scrollWidth>width||layout.brokenImages||layout.h1!==1||layout.active!=="Projects")throw Error(JSON.stringify(layout));
    results.push(layout);
    if(width===1440||width===390) {
      const {cssContentSize:s}=await call("Page.getLayoutMetrics");
      const shot=await call("Page.captureScreenshot",{format:"png",captureBeyondViewport:true,clip:{x:0,y:0,width:s.width,height:s.height,scale:1}});
      await writeFile(`artifacts/portfolio${route.replaceAll('/', '-')}-${width}.png`,Buffer.from(shot.data,"base64"));
    }
  }
}
await go('/projects');
for(const [category,count] of [["All projects",2],["Residential",1],["Villas & townhouses",1],["Commercial",0],["Industrial",0],["Hospitality",0],["Civil & infrastructure",0]]) {
  await evaluate(`(()=>{const nav=document.querySelector('nav[aria-label="Filter projects by category"]');[...nav.querySelectorAll('a')].find(a=>a.firstChild.textContent===${JSON.stringify(category)}).click();})()`);
  await settled();
  const actual=await evaluate("document.querySelectorAll('#project-results a[href^=\"/projects/\"]').length");
  if(actual!==count)throw Error(`${category}: expected ${count}, got ${actual}`);
  results.push({category,count:actual});
}
await go('/projects?category=Residential');
const resultUrl=await evaluate("location.pathname+location.search");
if(await evaluate("!!document.querySelector('input[type=search],#archive-title')"))throw Error('Removed search/archive remains');
await evaluate("document.querySelector('#project-results a').click()");
await settled();
if(!await evaluate("location.pathname.endsWith('/crescent-pearl')"))throw Error('Project did not open');
await evaluate("[...document.querySelectorAll('main a')].find(a=>a.textContent.includes('Back to results')).click()");
await settled();
if(await evaluate("location.pathname+location.search")!==resultUrl)throw Error('Return context lost');
results.push({returnedTo:resultUrl});
await go('/projects?category=Industrial');
if(!await evaluate("document.querySelector('#project-results').textContent.includes('More projects to come')"))throw Error('Empty category state missing');
await evaluate("document.querySelector('#project-results a').click()");
await settled();
if(await evaluate("document.querySelectorAll('#project-results a').length")!==2)throw Error('Clear filter failed');
await go('/projects?category=invalid&q=obsolete');
if(await evaluate("document.querySelectorAll('#project-results a').length")!==2)throw Error('Invalid category or obsolete search affected grid');
await go('/projects/crescent-pearl');
await evaluate("[...document.querySelectorAll('nav[aria-label=\"Browse projects\"] a')].find(a=>a.textContent.includes('NEXT PROJECT')).click()");
await settled();
if(!await evaluate("location.pathname.endsWith('/national-park-villas')"))throw Error('Next visual project failed');
await evaluate("document.querySelector('#contact a').click()");
await settled();
if(await evaluate("document.querySelector('select[name=service]')?.value")!=="Building construction")throw Error('Project enquiry selection failed');
results.push({filterPreservation:true,searchRemoved:true,emptyState:true,nextVisualProject:true,enquirySelection:true});
await go('/projects');
const hrefs=await evaluate("[...document.querySelectorAll('#project-results a')].map(a=>a.getAttribute('href'))");
for(const href of hrefs) {
  await go(href);
  const links=await evaluate(`(async()=>{return await Promise.all([...document.querySelectorAll('main a[href^="/"]')].map(async a=>({href:a.getAttribute('href'),status:(await fetch(a.href)).status})));})()`);
  if(links.some(link=>link.status!==200))throw Error(JSON.stringify(links));
}
await writeFile('artifacts/portfolio-review.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
ws.close();
