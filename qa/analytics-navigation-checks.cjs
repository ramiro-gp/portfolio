// Isolated app test: local build + simulated tag/destination. No Google or contact requests.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {chromium} = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname,'..');
const output = path.join(root,'qa/seo/analytics-navigation-2026-11-02.json');
if(fs.existsSync(output)) throw Error('Preserve existing evidence.');
const report = {at:new Date().toISOString(),simulated:true,cases:[],errors:[]};
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe'});
  try {
    for(const mode of ['rejected','callback','blocked-tag','modified-click']) {
      const context=await browser.newContext({reducedMotion:'reduce'});
      let exits=0;
      await context.route('**/*',async route=>{
        const url=new URL(route.request().url());
        if(url.hostname==='www.googletagmanager.com')return route.fulfill({contentType:'text/javascript',body:mode==='callback'?`window.gtag=(...args)=>{window.dataLayer.push(args);if(args[0]==='event'&&args[2]?.event_callback)setTimeout(args[2].event_callback,40);};`:'/* intentionally blocked tag */'});
        if(url.hostname!=='ramita.dev'){exits++;return route.fulfill({contentType:'text/html',body:'<!doctype html><title>Simulated destination</title>'});}
        const relative=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
        const file=path.join(root,'dist',relative);
        const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
        return route.fulfill({body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'});
      });
      const page=await context.newPage();
      await page.goto('https://ramita.dev/');
      await page.locator(mode==='rejected'?'[data-consent-reject]':'[data-consent-accept]').click();
      if(mode!=='rejected')await page.waitForFunction(()=>!!window.gtag);
      if(mode==='modified-click') {
        const preserved=await page.locator('#contacto a.phone').evaluate(link=>link.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,ctrlKey:true,button:0})));
        assert.equal(preserved,true);assert.equal(page.url(),'https://ramita.dev/');
        report.cases.push({mode,nativeBehaviorPreserved:true});
      } else {
        const started=Date.now();
        await Promise.all([page.waitForURL('https://wa.me/5491151354489'),page.locator('#contacto a.phone').click()]);
        const elapsed=Date.now()-started;
        assert.equal(exits,1);assert.ok(elapsed<1500,'Blocked analytics must never trap navigation.');
        report.cases.push({mode,simulatedNavigations:exits,elapsedMs:elapsed});
      }
      await context.close();
    }
  } finally {await browser.close();}
})().catch(e=>{report.errors.push(e.stack);process.exitCode=1;}).finally(()=>{fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));});
