const {chromium}=require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const out=path.join(__dirname,'qa');fs.mkdirSync(out,{recursive:true});
const url=name=>'file:///'+path.join(__dirname,name).replaceAll('\\','/');
function lum(hex){const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
function ratio(a,b){return +((Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05)).toFixed(2);}
(async()=>{
const b=await chromium.launch({headless:true,executablePath:'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'});
const report=[];
for(const theme of ['dark','light'])for(const [width,height] of [[1440,900],[1280,800],[1024,768],[768,1024],[390,844],[320,740],[1536,960]]){
const p=await b.newPage({viewport:{width,height},javaScriptEnabled:false,reducedMotion:'reduce'});
await p.goto(url(theme==='dark'?'iteration2-dark.html':'iteration2-light.html'));await p.evaluate(()=>document.fonts.ready);
const normal=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,font:document.fonts.check('400 18px "Instrument Sans"'),theme:document.documentElement.dataset.theme,accent:getComputedStyle(document.documentElement).getPropertyValue('--accent'),animations:document.getAnimations().length,whatsapp:document.querySelector('.whatsapp a').getAttribute('href'),ctaBottom:document.querySelector('.hero .cta').getBoundingClientRect().bottom}));
await p.screenshot({path:path.join(out,`${theme}-${width}-full.png`),fullPage:true});
if([1440,390,768,1280].includes(width)){
await p.screenshot({path:path.join(out,`${theme}-${width}-hero.png`)});
for(const section of ['servicios','ramiro','contacto']){await p.locator('#'+section).scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,`${theme}-${width}-${section}.png`)});}
}
await p.locator('.hero .cta').click();const anchor=await p.evaluate(()=>document.querySelector('#contacto').getBoundingClientRect().top>=document.querySelector('.site-header').getBoundingClientRect().bottom);
if(width===390||width===1440){await p.evaluate(()=>scrollTo(0,0));if(width===390)await p.locator('.mobile-menu>summary').click();await p.locator(width===390?'.mobile-panel .appearance>summary':'.desktop-appearance summary').click();await p.screenshot({path:path.join(out,`${theme}-${width}-appearance.png`)});}
await p.reload();await p.evaluate(()=>{for(const el of document.querySelectorAll('h1,h2,h3,.cta,.desktop-nav>a,.mobile-panel>a'))el.textContent+=' — texto expandido';});
const expanded=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
await p.reload();await p.evaluate(()=>document.documentElement.style.fontSize='200%');
const large=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
report.push({theme,width,height,...normal,anchorClear:anchor,expandedOverflow:expanded,text200Overflow:large});await p.close();
}
for(const width of [1440,390,320]){const p=await b.newPage({viewport:{width,height:900},javaScriptEnabled:false});await p.goto(url('accents.html'));await p.evaluate(()=>document.fonts.ready);report.push({specimen:width,rows:await p.locator('.palette-row').count(),overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await p.screenshot({path:path.join(out,`accents-${width}.png`),fullPage:true});await p.close();}
const contrasts={dark:['#ff9b58','#78cffc','#f58acd','#c4e773','#f1f0ec'].map(c=>({color:c,onBackground:ratio(c,'#171816'),onSurface:ratio(c,'#232522')})),light:['#1c57be','#176844','#b23b35','#6d42aa','#202421'].map(c=>({color:c,onBackground:ratio(c,'#f5f4f0'),onSurface:ratio(c,'#edeee9')}))};
const prior=JSON.parse(fs.readFileSync(path.join(__dirname,'prior-hashes.json'),'utf8').replace(/^\uFEFF/,''));
const preserved=prior.every(x=>crypto.createHash('sha256').update(fs.readFileSync(x.Path)).digest('hex').toUpperCase()===x.Hash);
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({report,contrasts,priorPrototypesPreserved:preserved},null,2));console.log(JSON.stringify({report,contrasts,priorPrototypesPreserved:preserved}));await b.close();
})();
