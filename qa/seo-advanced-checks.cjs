// Isolated app regression tests. Never attach to the owner's browser/profile.
// The GA fixture is intercepted; no analytics data or contacts reach a third party.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const label = process.env.QA_LABEL || 'local-2026-11-02';
const out = path.join(root, 'qa/seo', `advanced-${label}`);
if (fs.existsSync(out)) throw Error('Use a new QA_LABEL to preserve evidence.');
fs.mkdirSync(out);
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.woff2':'font/woff2', '.webp':'image/webp', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon', '.xml':'application/xml' };
const report = { label, at: new Date().toISOString(), scenarios: [], errors: [], limitations: ['Isolated headless browser, not physical touch or assistive technology.', 'GA fixture tests the command contract, not Google receipt or account settings.'] };
let browser;
async function contextFor(directory, options = {}) {
  const context = await browser.newContext({ viewport: {width:390,height:844}, reducedMotion:'reduce', ...options });
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'ramita.dev') {
      // Stub the tag itself; never send events to Google from this test.
      if (url.hostname === 'www.googletagmanager.com') return route.fulfill({ contentType:'text/javascript', body:'/* GA test stub: no collection */' });
      return route.abort();
    }
    if (process.env.QA_LIVE === '1' && directory === 'dist') return route.continue();
    const base = path.resolve(root, directory);
    let file = path.resolve(base, '.' + decodeURIComponent(url.pathname));
    if (file !== base && !file.startsWith(base + path.sep)) return route.fulfill({status:403,body:''});
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
    const found = fs.existsSync(file);
    if (!found) file = path.join(base,'404.html');
    return route.fulfill({status:found?200:404, contentType:mime[path.extname(file)] || 'application/octet-stream', body:fs.readFileSync(file)});
  });
  return context;
}
async function state(page) {
  return page.evaluate(() => ({ overflow:document.documentElement.scrollWidth-innerWidth, lang:document.documentElement.lang, h1:document.querySelectorAll('h1').length, services:document.querySelectorAll('[data-service-panel]').length, projects:document.querySelectorAll('[data-project-card]').length, missingAlt:[...document.images].filter(x=>!x.hasAttribute('alt')).length, schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>JSON.parse(x.textContent)), banner:!!document.querySelector('[data-consent-notice]'), google:!!document.querySelector('script[src*="googletagmanager"]') }));
}
(async () => {
  browser = await chromium.launch({headless:true, executablePath:'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe'});
  report.browser = browser.version();
  for (const [lang, route] of [['es','/'],['en','/en/'],['pt','/pt/'],['fr','/fr/'],['ja','/ja/']]) {
    for (const width of [320,390,768,1440]) {
      const context = await contextFor('dist', {viewport:{width,height:900}});
      const page = await context.newPage();
      page.on('pageerror', e=>report.errors.push(e.message));
      await page.goto('https://ramita.dev'+route, {waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const actual = await state(page);
      assert.equal(actual.lang,lang); assert.equal(actual.h1,1); assert.equal(actual.services,3); assert.equal(actual.projects,4); assert.equal(actual.missingAlt,0); assert.ok(actual.overflow<=1);
      assert.equal(actual.google,false); assert.equal(actual.banner,false);
      const serviceSchema = actual.schema.filter(x=>x['@type']==='Service');
      assert.equal(serviceSchema.length,3);
      for (const service of serviceSchema) {
        const fragment=new URL(service.url).hash.slice(1);
        const content=await page.locator(`[id="${fragment}"]`).textContent();
        assert.ok(content.includes(service.name) && content.includes(service.description));
      }
      // All four selections, visible descriptions and external destinations remain usable.
      for (let index=0;index<4;index++) {
        await page.locator('[data-project-select]').nth(index).click();
        const detail=page.locator('[data-project-detail]').nth(index);
        await page.waitForFunction(index=>{const node=document.querySelectorAll('[data-project-detail]')[index];return node && !node.hidden && getComputedStyle(node).visibility==='visible';},index,{timeout:3000});
        assert.equal(await detail.isVisible(),true,JSON.stringify({lang,width,index,details:await page.locator('[data-project-detail]').evaluateAll(nodes=>nodes.map(x=>({hidden:x.hidden,display:getComputedStyle(x).display}))),selected:await page.locator('[data-project-select]').evaluateAll(nodes=>nodes.map(x=>x.getAttribute('aria-pressed')))}));
        assert.ok((await detail.locator('p.project-card-description').textContent()).length>25);
        assert.ok(await detail.locator('a').getAttribute('href'));
      }
      if ([320,1440].includes(width) && ['es','ja'].includes(lang)) {
        await page.locator('#proyectos').scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(out,`${lang}-${width}-projects.png`)});
        await page.locator('footer').scrollIntoViewIfNeeded();
        await page.screenshot({path:path.join(out,`${lang}-${width}-footer.png`)});
      }
      if(lang==='es' && [390,1440].includes(width)) {
        // Reveal each section before scanning so opacity-based entrances do
        // not hide offscreen content from contrast/accessibility checks.
        for (const id of ['inicio','servicios','proyectos','ramiro','contacto']) {
          await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        }
        await page.waitForFunction(()=>[...document.querySelectorAll('[data-reveal]')].every(x=>getComputedStyle(x).opacity==='1'));
        await page.addScriptTag({path:'C:/Users/ramiro/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js'});
        const axe=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(x=>({id:x.id,impact:x.impact,nodes:x.nodes.map(n=>n.target)}));});
        assert.deepEqual(axe,[]);
        actual.axe=axe;
      }
      report.scenarios.push({lang,width,mode:'reduced-motion',...actual});
      await context.close();
    }
  }
  for (const route of ['/','/ja/']) {
    const context=await contextFor('dist',{javaScriptEnabled:false}); const page=await context.newPage();
    await page.goto('https://ramita.dev'+route); assert.equal(await page.locator('.project-card-link:visible').count(),4);
    assert.equal(await page.locator('#servicios').isVisible(),true);
    report.scenarios.push({route,mode:'no-js',projectLinks:4});await context.close();
  }
  const privacyContext=await contextFor('dist');const privacy=await privacyContext.newPage();
  await privacy.goto('https://ramita.dev/privacidad/'); assert.equal(await privacy.locator('h1').textContent(),'Privacidad y cookies');
  assert.equal(await privacy.locator('link[rel=canonical]').getAttribute('href'),'https://ramita.dev/privacidad/');
  await privacy.screenshot({path:path.join(out,'privacy-390.png')});await privacyContext.close();
  // A separate build with a synthetic stream ID tests acceptance/rejection without a real account.
  const context=await contextFor('.cache/seo-analytics-dist');const page=await context.newPage();
  await page.goto('https://ramita.dev/?email=private%40example.com#sensitive');
  assert.equal(await page.locator('[data-consent-notice]').isVisible(),true);
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0);
  await page.locator('[data-consent-reject]').click();
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0);
  await page.reload();assert.equal(await page.locator('[data-consent-notice]').isVisible(),false);
  await page.locator('[data-consent-preferences]').click();
  await page.locator('[data-consent-accept]').click();
  await page.waitForFunction(()=>window.dataLayer?.some(x=>x[0]==='event'));
  // Prevent actual navigation while exercising real click listeners.
  await page.evaluate(()=>window.addEventListener('click',e=>{if(e.target instanceof Element && e.target.closest('a')) e.preventDefault();},true));
  await page.locator('#contacto a.email').click();
  await page.locator('#contacto a.phone').click();
  await page.locator('.menu-trigger').click();
  await page.locator('.menu-contact a[href^="mailto:"]').click();
  await page.waitForFunction(()=>!document.querySelector('[data-menu-root]').hasAttribute('data-open'));
  await page.locator('#ramiro a[href*="github"]').click();
  await page.locator('.hero .cta').click();
  await page.locator('[data-project-select]').nth(1).click();await page.locator('[data-project-detail]').nth(1).locator('a').click();
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}}));
  await page.locator('.email-row [data-copy]').click();
  await page.waitForFunction(()=>window.dataLayer.some(x=>x[0]==='event'&&x[1]==='contact_copy'));
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('simulated clipboard denial');}}}));
  await page.locator('.phone-row [data-copy]').click();
  const commands=await page.evaluate(()=>window.dataLayer.map(x=>Array.from(x)));
  const events=commands.filter(x=>x[0]==='event');
  assert.equal(events.filter(x=>x[1]==='page_view').length,1);
  assert.equal(events.filter(x=>x[1]==='contact_click').length,3);
  assert.ok(events.some(x=>x[1]==='contact_click'&&x[2].section_id==='header'));
  for(const name of ['social_click','cta_click','project_visit','contact_copy']) assert.equal(events.filter(x=>x[1]===name).length,1);
  assert.equal(commands.find(x=>x[0]==='config')[2].page_location,'https://ramita.dev/');
  assert.equal(commands.find(x=>x[0]==='config')[2].page_referrer,'');
  assert.ok(!JSON.stringify(commands).includes('private%40') && !JSON.stringify(commands).includes('sensitive'));
  const before=events.length;
  await context.addCookies([{name:'_ga',value:'test',domain:'ramita.dev',path:'/',secure:true},{name:'_ga_TEST1234',value:'test',domain:'.ramita.dev',path:'/',secure:true}]);
  await page.locator('[data-consent-preferences]').click();await page.locator('[data-consent-reject]').click();
  await page.locator('#contacto a.email').click();
  assert.equal(await page.evaluate(()=>window.dataLayer.filter(x=>x[0]==='event').length),before);
  assert.equal((await context.cookies()).filter(x=>x.name.startsWith('_ga')).length,0);
  await page.locator('[data-consent-preferences]').click();await page.locator('[data-consent-accept]').click();
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(),1);
  assert.equal(await page.evaluate(()=>window.dataLayer.filter(x=>x[0]==='event'&&x[1]==='page_view').length),1);
  await page.locator('[data-consent-preferences]').click();
  await page.addScriptTag({path:'C:/Users/ramiro/AppData/Local/npm-cache/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js'});
  const bannerAxe=await page.evaluate(async()=>{const r=await axe.run(document.querySelector('[data-consent-notice]'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(x=>x.id);});assert.deepEqual(bannerAxe,[]);
  await page.screenshot({path:path.join(out,'consent-390.png')});
  await page.setViewportSize({width:1440,height:900});await page.screenshot({path:path.join(out,'consent-1440.png')});
  report.scenarios.push({mode:'GA fixture (no transmission)',events,config:commands.find(x=>x[0]==='config'),rejection:true,reacceptWithoutDuplicates:true});
  await context.close();
  for (const lang of ['es','ja']) {
    const context=await contextFor('dist',{viewport:{width:320,height:740}});const page=await context.newPage();
    await page.goto('https://ramita.dev'+(lang==='es'?'/':'/ja/'));
    await page.addStyleTag({content:'html{font-size:200% !important}'});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth<=1));
    await page.locator('footer').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`${lang}-320-text200.png`)});
    report.scenarios.push({mode:'text-200-percent',lang,width:320});await context.close();
  }
  assert.deepEqual(report.errors,[]);
})().catch(e=>{report.errors.push(e.stack);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({out,scenarios:report.scenarios.length,errors:report.errors},null,2));});
