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
async function screenshot(name, full = false) {
  const {cssContentSize} = await call("Page.getLayoutMetrics");
  const options = full ? {captureBeyondViewport:true,clip:{x:0,y:0,width:cssContentSize.width,height:cssContentSize.height,scale:1}} : {};
  const result = await call("Page.captureScreenshot",{format:"png",...options});
  await writeFile("artifacts/" + name + ".png",Buffer.from(result.data,"base64"));
}
const results = [];
for (const width of [1440, 1024, 801, 768, 390, 320]) {
  await call("Emulation.setDeviceMetricsOverride", {width,height:1000,deviceScaleFactor:1,mobile:width<700});
  await call("Page.navigate", {url:process.env.REVIEW_URL || "http://localhost:3000"});
  await new Promise(r=>setTimeout(r,1500));
  await evaluate(`(async()=>{await document.fonts.ready; document.documentElement.style.scrollBehavior='auto'; for(const img of document.images) img.loading='eager'; await Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))); window.scrollTo(0,0);})()`);
  const layout = await evaluate(String.raw`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),h1:document.querySelectorAll('h1').length,words:document.querySelector('main').innerText.trim().split(/\s+/).length,sections:[...document.querySelectorAll('main>section')].map(s=>s.id||s.getAttribute('aria-label')||s.getAttribute('aria-labelledby'))})`);
  results.push(layout);
  if(layout.scrollWidth>width||layout.brokenImages.length||layout.h1!==1) throw Error(JSON.stringify(layout));
  if(width===1440||width===390) await screenshot("home-upgrade-"+width,true);
  if(width===390) {
    await evaluate("document.querySelector('.menu-button').click()");
    await screenshot("home-upgrade-menu");
    const menuOpen=await evaluate("document.querySelector('.mobile-menu').open");
    await evaluate("document.querySelector('.mobile-menu nav a[href=\"/services\"]').click()");
    await new Promise(r=>setTimeout(r,1500));
    const navigation=await evaluate("({path:location.pathname,menuClosed:!document.querySelector('.mobile-menu').open,active:document.querySelector('.mobile-menu nav [aria-current=page]')?.textContent})");
    results.push({menuOpen,...navigation});
    if(!menuOpen||navigation.path!=="/services"||!navigation.menuClosed) throw Error("Mobile navigation failed");
  }
}
await call("Page.navigate", {url:process.env.REVIEW_URL || "http://localhost:3000"});
await new Promise(r=>setTimeout(r,1200));
results.push(await evaluate(`(async()=>{const links=[...new Set([...document.querySelectorAll('main a[href^="/"]')].map(a=>a.getAttribute('href')))];return {destinations:await Promise.all(links.map(async href=>{const response=await fetch(href);const html=await response.text();const anchor=href.split('#')[1];return {href,status:response.status,anchorExists:!anchor||new DOMParser().parseFromString(html,'text/html').getElementById(anchor)!==null};}))};})()`));
await evaluate("document.getElementById('projects').scrollIntoView()");
results.push(await evaluate("({activeOnHome:document.querySelector('.mobile-menu nav [aria-current=page]')?.getAttribute('href')})"));
for (const result of results) {
  if (result.destinations?.some(link=>link.status!==200||!link.anchorExists)) throw Error("Invalid homepage destination");
  if (result.activeOnHome && result.activeOnHome!=="#home") throw Error("Incorrect active homepage navigation");
}
console.log(JSON.stringify(results,null,2));
await writeFile("artifacts/review.json",JSON.stringify(results,null,2));
ws.close();
