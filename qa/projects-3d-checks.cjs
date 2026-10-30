const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '../dist');
const out = path.join(__dirname, 'projects-3d');
fs.mkdirSync(out, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const report = { cases: [], interactions: [], errors: [] };
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  report.browser = browser.version();
  try {
    const routes = process.env.QA_QUICK ? [['es', '/']] : [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']];
    const sizes = process.env.QA_QUICK ? [[1440,900],[390,844]] : [[320,740],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080]];
    for (const [lang, route] of routes) for (const [width, height] of sizes) {
      const page = await browser.newPage({ viewport: {width,height}, reducedMotion: 'reduce' });
      page.on('pageerror', error => report.errors.push(error.message));
      await page.goto(base + route, {waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const desktop = width >= 1024;
      const before = await page.locator('#proyectos').boundingBox();
      await page.locator('.project-picker button').nth(1).click();
      await page.waitForTimeout(80);
      assert.equal(await page.locator('[data-project-card][data-active]').getAttribute('data-project-case'), 'jlaberturas');
      if (desktop) {
        const detail = page.locator('.project-detail:not([hidden])');
        assert.equal(await detail.locator('h3').textContent(), 'JL Aberturas');
        assert.equal(await detail.isVisible(), true);
        assert.equal(await page.locator('.project-card-link').first().isVisible(), false);
        const state = await page.evaluate(() => {
          const panel = document.querySelector('.project-details').getBoundingClientRect();
          const deck = document.querySelector('.project-deck').getBoundingClientRect();
          const cards = [...document.querySelectorAll('.project-card')];
          return { panelRight: panel.right, deckLeft: deck.left, centers: cards.map(c => {const b=c.getBoundingClientRect();return b.y+b.height/2;}), transforms:cards.map(c=>getComputedStyle(c).transform) };
        });
        assert.ok(state.panelRight < state.deckLeft, 'details left / deck right');
        assert.ok(Math.max(...state.centers)-Math.min(...state.centers)<2, 'cards share vertical center');
        assert.ok(state.transforms.every(t=>t.startsWith('matrix3d')), 'real 3D transforms');
        const after = await page.locator('#proyectos').boundingBox();
        assert.ok(Math.abs(before.height-after.height)<1, 'selection preserves scene height');
      }
      const dimensions = await page.evaluate(() => ({overflow:document.documentElement.scrollWidth>innerWidth,height:document.querySelector('#proyectos').getBoundingClientRect().height,broken:[...document.querySelectorAll('#proyectos img')].filter(i=>i.complete&&!i.naturalWidth).length,line:document.querySelector('.continuous-line path')?.getAttribute('d')}));
      if(dimensions.overflow){await page.screenshot({path:path.join(out,'overflow.png')});console.log(await page.evaluate(()=>[...document.querySelectorAll('#proyectos *')].map(e=>({tag:e.className,left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(e=>e.right>innerWidth||e.left<0)));}
      assert.equal(dimensions.overflow,false,lang+' '+width+' overflow');
      assert.equal(dimensions.broken,0);
      assert.ok(dimensions.line&&!/NaN|Infinity/.test(dimensions.line));
      if (['es','ja'].includes(lang)&&[390,1440].includes(width)) {
        await page.evaluate(()=>window.scrollTo(0,document.querySelector('#proyectos').getBoundingClientRect().top+scrollY-document.querySelector('.site-header').getBoundingClientRect().height));
        await page.screenshot({path:path.join(out,`${lang}-${width}.png`)});
      }
      if ([320,390,1440].includes(width)) {
        await page.addStyleTag({content:'html{font-size:200%}'});
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,lang+' '+width+' enlarged text overflow');
      }
      report.cases.push({lang,width,height:dimensions.height,desktop,overflow:false});
      await page.close();
    }
    if (!process.env.QA_QUICK) {
      const page = await browser.newPage({viewport:{width:1440,height:900}});
      await page.goto(base,{waitUntil:'networkidle'});
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      for(let i=0;i<4;i++) {
        await page.locator('.project-picker button').nth(i).hover();
        await page.waitForTimeout(260);
        await page.locator('.project-card-select').nth(i).focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.project-card-select').nth(i).getAttribute('aria-pressed'),'true');
        assert.equal(await page.locator('.project-detail:not([hidden]) h3').textContent(),['Residencias Grupo Casa','JL Aberturas','Vegan Records','LingoHive'][i]);
      }
      await page.locator('.project-card-select').last().click();
      assert.match(await page.locator('.project-detail:not([hidden]) .project-card-credit').textContent(),/Juan Galache de Toro/);
      await page.screenshot({path:path.join(out,'es-lingohive.png')});
      await page.context().route('https://lingo-hive.vercel.app/**',route=>route.fulfill({body:'Verified external target',contentType:'text/html'}));
      const popupPromise=page.waitForEvent('popup');
      await page.locator('.project-detail:not([hidden]) .project-detail-link').click();
      const popup=await popupPromise;await popup.waitForLoadState();assert.equal(popup.url(),'https://lingo-hive.vercel.app/');await popup.close();
      await page.evaluate(()=>{document.documentElement.dataset.theme='dark';document.documentElement.dataset.accent='dark-orange';});
      await page.screenshot({path:path.join(out,'es-dark.png')});
      await page.setViewportSize({width:390,height:844});
      await page.waitForTimeout(100);
      assert.equal(await page.locator('.project-details').isVisible(),false);
      assert.equal(await page.locator('#project-lingohive .project-card-link').isVisible(),true);
      report.interactions.push('hover, keyboard focus/Enter, card click selects, panel link opens expected target, credit visible, dark theme, resize');
      await page.close();
      const touch=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
      await touch.goto(base,{waitUntil:'networkidle'});await touch.locator('#proyectos').scrollIntoViewIfNeeded();
      await touch.locator('.project-picker button').nth(2).tap();
      await touch.waitForFunction(()=>document.querySelector('[data-project-card][data-active]')?.id==='project-veganrecords');
      report.interactions.push('mobile touch selector with reduced motion');await touch.close();
      for(const width of [390,1440]) {
        const nojs=await browser.newPage({viewport:{width,height:900},javaScriptEnabled:false});
        await nojs.goto(base,{waitUntil:'networkidle'});
        assert.equal(await nojs.locator('.project-card-link').count(),4);
        assert.equal(await nojs.locator('.project-card-select').first().isVisible(),false);
        await nojs.locator('#project-lingohive a').focus();
        assert.equal(await nojs.locator('#project-lingohive a').evaluate(a=>{const r=a.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1;}),true);
        await nojs.close();
      }
      report.interactions.push('no-JS horizontal cards, links and keyboard focus on desktop/mobile');
    }
    assert.deepEqual(report.errors,[]);report.status='PASS';
  } finally {
    fs.writeFileSync(path.join(__dirname,process.env.QA_QUICK?'projects-3d-preview-results.json':'projects-3d-results.json'),JSON.stringify(report,null,2));
    await browser.close();await new Promise(resolve=>server.close(resolve));
  }
  console.log(JSON.stringify({status:report.status,cases:report.cases.length,interactions:report.interactions,errors:report.errors}));
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
