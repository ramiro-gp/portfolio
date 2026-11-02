// Isolated app integration test. Uses no owner's browser profile or Google
// account credentials. Only the owned site's tag may contact Google; external
// contact/project navigation is prevented. Test events use debug_mode.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const output=path.join(__dirname,'seo',`ga4-reception-${process.env.QA_LABEL||'2026-11-02'}.json`);
if(fs.existsSync(output))throw Error('Preserve previous evidence; choose another output before rerunning.');
const id='G-SM3PHE0FHT';
const report={startedAt:new Date().toISOString(),measurementId:id,testTraffic:true,debugMode:true,events:[],errors:[],limits:['Transport acceptance is not proof of processed reports; confirm separately in GA DebugView/Realtime.','No client/session IDs, IPs, cookie values or full request URLs saved.']};
let browser;
(async()=>{
 browser=await chromium.launch({headless:true,executablePath:'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe'});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await context.addInitScript(()=>{
   let implementation;
   Object.defineProperty(window,'gtag',{configurable:true,get(){return implementation;},set(fn){implementation=function(...args){if(args[0]==='config')args[2]={...args[2],debug_mode:true};return fn(...args);};}});
 });
 await context.route('**/*',route=>{
   const url=new URL(route.request().url());
   if(url.hostname==='ramita.dev'||url.hostname==='www.googletagmanager.com'||/(^|\.)google-analytics\.com$/.test(url.hostname))return route.continue();
   return route.abort();
 });
 const page=await context.newPage();
 page.on('response',response=>{
   const url=new URL(response.url());
   if(!/(^|\.)google-analytics\.com$/.test(url.hostname)||!url.pathname.endsWith('/collect'))return;
   const req=response.request();
   for(const line of (req.postData()||'').split('\n')){
     const params=new URLSearchParams(url.search);
     for(const [key,value] of new URLSearchParams(line))params.set(key,value);
     const name=params.get('en');if(!name)continue;
     const clean={event:name,status:response.status(),endpoint:url.hostname+url.pathname,stream:params.get('tid'),page:params.get('dl'),referrer:params.get('dr'),page_id:params.get('ep.page_id'),section_id:params.get('ep.section_id'),destination_id:params.get('ep.destination_id'),site_language:params.get('ep.site_language'),debug:params.get('_dbg')||params.get('ep.debug_mode')};
     report.events.push(clean);
     const raw=params.toString();
     if(raw.includes('DO_NOT_TRANSMIT')||raw.includes('private%40example')||raw.includes('TEST_PRIVATE'))report.errors.push('Unexpected test privacy marker in the collection payload.');
   }
 });
 page.on('pageerror',error=>report.errors.push(error.message));
 await page.goto('https://ramita.dev/?qa_private=DO_NOT_TRANSMIT&email=private%40example.com#DO_NOT_TRANSMIT',{waitUntil:'networkidle'});
 assert.equal(await page.locator('[data-consent-notice]').getAttribute('data-measurement-id'),id);
 assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0);
 assert.equal(report.events.length,0);
 await page.locator('[data-consent-reject]').click();
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0);
 assert.equal(report.events.length,0);
 await page.locator('[data-consent-preferences]').click();
 await page.locator('[data-consent-accept]').click();
 await page.waitForResponse(response=>/google-analytics\.com\/g\/collect/.test(response.url()),{timeout:30000});
 await page.evaluate(()=>{
   window.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('a'))event.preventDefault();},true);
   Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}});
 });
 await page.locator('#contacto .email').click();
 await page.locator('#contacto .phone').click();
 await page.locator('.email-row [data-copy]').click();
 await page.locator('#ramiro a[href*="github"]').click();
 await page.locator('.hero .cta').click();
 await page.locator('.menu-trigger').click();
 await page.locator('.menu-contact a[href^="mailto:"]').click();
 await page.waitForFunction(()=>!document.querySelector('[data-menu-root]').hasAttribute('data-open'));
 for(let index=0;index<4;index++){
   await page.locator('[data-project-select]').nth(index).click();
   await page.locator('[data-project-detail]').nth(index).locator('a').click();
 }
 await page.waitForFunction(()=>window.dataLayer.filter(x=>x[0]==='event').length>=11);
 // Wait for GA's batching, separately from successful UI event dispatch.
 for(let attempt=0;attempt<25 && report.events.filter(x=>x.event==='project_visit').length<4;attempt++)await page.waitForTimeout(1000);
 for(const event of report.events){
   assert.equal(event.stream,id);assert.ok([200,204].includes(event.status));
   assert.equal(event.page,'https://ramita.dev/');
   assert.ok(!event.referrer);
 }
 for(const name of ['page_view','contact_click','contact_copy','social_click','cta_click','project_visit'])assert.ok(report.events.some(x=>x.event===name),`Missing transport for ${name}`);
 assert.equal(report.events.filter(x=>x.event==='page_view').length,1);
 assert.equal(report.events.filter(x=>x.event==='contact_click').length,3);
 assert.equal(report.events.filter(x=>x.event==='project_visit').length,4);
 assert.ok(!report.events.some(x=>['click','scroll','form_start','form_submit','file_download','generate_lead'].includes(x.event)));
 const before=report.events.length;
 await page.locator('[data-consent-preferences]').click();await page.locator('[data-consent-reject]').click();
 await page.locator('#contacto .email').click();await page.waitForTimeout(1200);
 assert.equal(report.events.length,before);
 assert.equal((await context.cookies()).filter(x=>x.name.startsWith('_ga')).length,0);
 report.consent={noRequestsBeforeAcceptance:true,rejectionPersisted:true,revocationStopsCollection:true,analyticsCookiesRemoved:true};
 assert.deepEqual(report.errors,[]);
 await context.close();
})().catch(error=>{report.errors.push(error.stack);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify({output,events:report.events,errors:report.errors},null,2));});
