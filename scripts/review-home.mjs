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
for (const width of [1440,390,320,768]) {
  await call("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<700});
  await call("Page.navigate",{url:process.env.REVIEW_URL || "http://localhost:3100"});
  await new Promise(r => setTimeout(r,1200));
  await evaluate(`(async()=>{await document.fonts.ready; document.documentElement.style.scrollBehavior='auto'; for(const img of document.images)img.loading='eager'; await Promise.all([...document.images].map(img=>img.decode().catch(()=>{}))); window.scrollTo(0,0); await new Promise(r=>setTimeout(r,150));})()`);
  results.push(await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,fonts:document.fonts.status,brokenImages:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),overflow:[...document.querySelectorAll('main *')].filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,8).map(el=>el.className)})`));
  if(width===1440||width===390) {
    await screenshot("home-"+width);
    await screenshot("home-"+width+"-full",true);
    await evaluate("document.getElementById('projects').scrollIntoView()");
    await screenshot("projects-"+width);
    await evaluate("document.querySelectorAll('.project-selector>button')[1].click()");
    const selected = await evaluate("document.querySelectorAll('.project-selector>button')[1].getAttribute('aria-pressed')");
    await evaluate("document.querySelector('.project-open').click()");
    const dialog = await evaluate("document.querySelector('.project-dialog').open && document.getElementById('project-title').textContent");
    await call("Input.dispatchKeyEvent",{type:"keyDown",key:"Escape",code:"Escape",windowsVirtualKeyCode:27});
    await call("Input.dispatchKeyEvent",{type:"keyUp",key:"Escape",code:"Escape",windowsVirtualKeyCode:27});
    await evaluate("document.querySelector('.services summary').click()");
    results.push({width,selected,dialog,capabilityOpen:await evaluate("document.querySelector('.services details').open")});
    if(width===390) {
      await evaluate("window.scrollTo(0,0);document.querySelector('.menu-button').click()");
      await screenshot("mobile-menu");
      results.push({menuOpen:await evaluate("document.querySelector('.mobile-menu').open")});
      await evaluate("document.querySelector('.mobile-menu nav a[href=\"#projects\"]').click()");
      results.push({menuClosedOnNavigation:await evaluate("!document.querySelector('.mobile-menu').open")});
    }
  }
}
console.log(JSON.stringify(results,null,2));
await writeFile("artifacts/review.json",JSON.stringify(results,null,2));
await call("Browser.close");
ws.close();
