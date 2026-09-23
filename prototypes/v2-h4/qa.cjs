// Read-only browser checks of the prototype; outputs stay inside this folder.
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 fs.mkdirSync(path.join(__dirname,'qa'),{recursive:true});
 const results=[];
 for(const [width,height] of [[1440,900],[1280,800],[1024,768],[768,1024],[390,844],[320,740],[1536,960]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto('file:///'+path.join(__dirname,'index.html').replaceAll('\\','/'));
  await page.evaluate(()=>document.fonts.ready);
  const base=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,font:document.fonts.check('400 18px "Instrument Sans"'),ctaBottom:document.querySelector('.hero .cta').getBoundingClientRect().bottom,animations:document.getAnimations().length}));
  await page.screenshot({path:path.join(__dirname,'qa',`${width}-home.png`),fullPage:true});
  await page.locator('.hero .cta').click();
  const anchor=await page.evaluate(()=>({contactTop:document.querySelector('#contacto').getBoundingClientRect().top,headerBottom:document.querySelector('.site-header').getBoundingClientRect().bottom}));
  await page.evaluate(()=>{for(const el of document.querySelectorAll('h1,h2,h3,.cta,.desktop-nav>a,.mobile-panel>a'))el.textContent+=' — texto expandido';});
  const expandedOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await page.reload();await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  // Independent 200% text stress for fixed-pixel prototype styles.
  
  const textStressOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  results.push({width,height,...base,...anchor,expandedOverflow,textStressOverflow});await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});
 await page.goto('file:///'+path.join(__dirname,'index.html').replaceAll('\\','/'));
 await page.locator('summary').click();await page.screenshot({path:path.join(__dirname,'qa','390-menu.png'),fullPage:false});
 await page.goto('file:///'+path.join(__dirname,'states.html').replaceAll('\\','/'));
 await page.screenshot({path:path.join(__dirname,'qa','390-states.png'),fullPage:true});
 fs.writeFileSync(path.join(__dirname,'qa','results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
 await browser.close();
})();
