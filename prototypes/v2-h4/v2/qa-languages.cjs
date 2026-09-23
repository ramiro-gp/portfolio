const {chromium}=require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('node:path'),fs=require('node:fs');
const base=__dirname;
const file=name=>'file:///'+path.join(base,name).replaceAll('\\','/');
const out=path.join(base,'qa');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'});
  const results=[];
  for(const lang of ['en','pt','fr','ja'])for(const [width,height] of [[1440,900],[390,844],[320,740]]){
    const page=await browser.newPage({viewport:{width,height},javaScriptEnabled:false,reducedMotion:'reduce'});
    await page.goto(file(`language-review/${lang}.html`));
    await page.evaluate(()=>document.fonts.ready);
    const result=await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth>innerWidth,
      documentWidth:document.documentElement.scrollWidth,
      clipped:[...document.querySelectorAll('h1,h2,h3,p,a,button')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.right>innerWidth+1&&s.position!=='fixed'}).map(e=>e.textContent.trim().slice(0,35)),
      hero:getComputedStyle(document.querySelector('.hero h1')).lineHeight,
      japaneseFontFace:[...document.fonts].filter(f=>f.family==='Noto Sans JP Review').map(f=>f.status),
      controls:[...document.querySelectorAll('.copy-icon')].map(e=>({name:e.getAttribute('aria-label'),size:e.getBoundingClientRect().width,cursor:getComputedStyle(e).cursor})),
      motion:document.getAnimations().length,
      disclosure:document.querySelectorAll('.language-disclosure').length
    }));
    if(width===390||width===1440){await page.screenshot({path:path.join(out,`locale-${lang}-${width}.png`),fullPage:true});}
    let mobileMenuOverflow=false;
    if(width<900){
      await page.locator('.mobile-menu > summary').click();
      mobileMenuOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
      if(width===390)await page.screenshot({path:path.join(out,`locale-${lang}-${width}-menu.png`)});
      await page.locator('.mobile-menu > summary').click();
    }
    await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    const text200Overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    results.push({lang,width,...result,mobileMenuOverflow,text200Overflow});
    await page.close();
  }
  fs.writeFileSync(path.join(out,'language-results.json'),JSON.stringify(results,null,2));
  console.log(JSON.stringify(results));
  await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
