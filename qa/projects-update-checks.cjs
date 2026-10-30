const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '../dist');
const output = path.join(__dirname, 'projects-update');
fs.mkdirSync(output, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.xml': 'application/xml' };
const server = http.createServer((req, res) => {
  let file = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
const routes = [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']];
if (process.env.QA_INTERACTIONS_ONLY) routes.length = 0;
const viewports = [[320, 740], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080]];
const report = { responsive: [], enlargedText: [], interactions: [], errors: [] };

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  report.browser = browser.version();
  try {
    for (const [lang, route] of routes) {
      for (const [width, height] of viewports) {
        const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
        page.on('pageerror', e => report.errors.push(e.message));
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const headline = await page.locator('#hero-title .sr-only').textContent();
        if (lang === 'es') assert.equal(headline, 'Diseño y desarrollo de webs para tu proyecto');
        if (lang === 'es' && [390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `es-${width}-hero.png`) });
        await page.locator('#proyectos').scrollIntoViewIfNeeded();
        await page.locator('.project-picker button').nth(2).click();
        await page.waitForTimeout(80);
        const geometry = await page.evaluate(() => {
          const section = document.querySelector('#proyectos');
          const deck = document.querySelector('.project-deck');
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            height: section.getBoundingClientRect().height,
            usableHeight: innerHeight - document.querySelector('.site-header').getBoundingClientRect().height,
            links: [...section.querySelectorAll('.project-card-link')].map(a => a.href),
            brokenImages: [...section.querySelectorAll('img')].filter(img => img.complete && !img.naturalWidth).length,
            clippedCards: [...section.querySelectorAll('.project-card')].filter(card => card.scrollHeight > card.clientHeight + 2 || card.scrollWidth > card.clientWidth + 2).length,
            active: section.querySelector('[data-project-card][data-active]').id,
            horizontalScroll: deck.scrollWidth > deck.clientWidth,
            lineReady: !!document.querySelector('.continuous-line[data-ready]'),
            path: document.querySelector('.continuous-line path').getAttribute('d')
          };
        });
        assert.equal(geometry.overflow, false, `${lang} ${width}: page overflow`);
        assert.equal(geometry.clippedCards, 0, `${lang} ${width}: clipped content`);
        assert.equal(geometry.brokenImages, 0);
        assert.equal(geometry.links.length, 4);
        assert.equal(geometry.active, 'project-jlaberturas');
        assert.ok(geometry.path && !/NaN|Infinity/.test(geometry.path), 'valid continuous path');
        assert.equal(geometry.lineReady, true);
        if (width < 1024) assert.equal(geometry.horizontalScroll, true);
        if (lang === 'es' && [390, 1440].includes(width)) {
          await page.evaluate(() => window.scrollTo(0, document.querySelector('#proyectos').getBoundingClientRect().top + scrollY - document.querySelector('.site-header').getBoundingClientRect().height));
          await page.screenshot({ path: path.join(output, `es-${width}-projects.png`) });
        }
        if (lang === 'ja' && [390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `ja-${width}-projects.png`) });
        report.responsive.push({ lang, width, ...geometry, path: 'finite' });
        if ([320, 390, 1440].includes(width)) {
          await page.addStyleTag({ content: 'html{font-size:200%}' });
          const enlarged = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, clipped: [...document.querySelectorAll('.project-card')].some(c => c.scrollHeight > c.clientHeight + 2 || c.scrollWidth > c.clientWidth + 2) }));
          assert.equal(enlarged.overflow, false, `${lang} ${width}: enlarged text overflow`);
          assert.equal(enlarged.clipped, false, `${lang} ${width}: enlarged text clipping`);
          report.enlargedText.push({ lang, width, ...enlarged });
        }
        await page.close();
      }
    }
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('#proyectos').scrollIntoViewIfNeeded();
    for (let i = 0; i < 4; i++) {
      await page.locator('.project-picker button').nth(i).hover();
      await page.waitForTimeout(270);
      assert.equal(await page.locator('[data-project-card][data-active]').getAttribute('data-project-case'), ['residencias', 'lingohive', 'jlaberturas', 'veganrecords'][i]);
      assert.equal(await page.locator('[data-project-card][data-active]').evaluate(c => getComputedStyle(c).opacity), '1');
      await page.locator('.project-card-link').nth(i).focus();
      assert.equal(await page.locator('.project-picker button').nth(i).getAttribute('aria-pressed'), 'true');
    }
    await page.locator('.project-picker button').nth(1).focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    assert.match(await page.locator('[data-active] .project-card-credit').textContent(), /Juan Galache de Toro/);
    await page.screenshot({ path: path.join(output, 'es-desktop-lingohive.png') });
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; document.documentElement.dataset.accent = 'dark-orange'; });
    await page.locator('.project-picker button').nth(3).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(output, 'es-desktop-dark.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-project-card][data-active]').getAttribute('data-project-case'), 'veganrecords');
    await page.context().route('https://veganrecords.com.ar/**', route => route.fulfill({ body: '<title>External link target verified</title>', contentType: 'text/html' }));
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#project-veganrecords a').click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert.equal(popup.url(), 'https://veganrecords.com.ar/');
    await popup.close();
    report.interactions.push('hover selection, full opacity, keyboard focus/Enter, visible attribution, dark theme, resize preserving selection, actual external link popup');
    await page.close();

    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await touch.goto(base, { waitUntil: 'networkidle' });
    await touch.locator('#proyectos').scrollIntoViewIfNeeded();
    const deck = await touch.locator('.project-deck').boundingBox();
    const client = await touch.context().newCDPSession(touch);
    const swipeY = Math.min(500, deck.y + 100);
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 290, y: swipeY }] });
    for (let x = 260; x >= 60; x -= 40) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: swipeY }] });
      await touch.waitForTimeout(20);
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touch.waitForTimeout(350);
    assert.ok(await touch.locator('.project-deck').evaluate(el => el.scrollLeft) > 30, 'native touch swipe scrolls projects');
    await touch.close();
    // CDP can keep a compositor fling active after its synthetic touchEnd and consume a tap.
    // Verify the alternative tap controls independently, without an unfinished synthetic fling.
    const taps = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await taps.goto(base, { waitUntil: 'networkidle' });
    await taps.locator('#proyectos').scrollIntoViewIfNeeded();
    await taps.locator('.project-picker button').nth(2).tap();
    await taps.waitForFunction(() => document.querySelector('[data-active]')?.id === 'project-jlaberturas', null, { timeout: 1500 });
    assert.equal(await taps.locator('[data-active]').getAttribute('data-project-case'), 'jlaberturas');
    const fallbackBefore = await taps.locator('[data-word-current]').textContent();
    await taps.waitForTimeout(3400);
    assert.equal(await taps.locator('[data-word-current]').textContent(), fallbackBefore);
    report.interactions.push('native emulated touch swipe; touch selectors in a separate context (CDP fling limitation); stable reduced-motion Hero');
    await taps.close();

    for (const [width, height] of [[390, 844], [1440, 900]]) {
      const nojs = await browser.newPage({ viewport: { width, height }, javaScriptEnabled: false });
      await nojs.goto(base, { waitUntil: 'networkidle' });
      assert.equal(await nojs.locator('#hero-title .sr-only').textContent(), 'Diseño y desarrollo de webs para tu proyecto');
      assert.equal(await nojs.locator('.project-card-link').count(), 4);
      assert.equal(await nojs.locator('.project-picker').isVisible(), false);
      await nojs.locator('#project-veganrecords a').focus();
      assert.equal(await nojs.locator('#project-veganrecords a').evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1; }), true);
      await nojs.close();
    }
    report.interactions.push('no-JS links, focus and static Hero on desktop/mobile');
    assert.deepEqual(report.errors, []);
    report.status = 'PASS';
  } finally {
    fs.writeFileSync(path.join(__dirname, 'projects-update-results.json'), JSON.stringify(report, null, 2));
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify({ status: report.status, browser: report.browser, responsive: report.responsive.length, enlargedText: report.enlargedText.length, interactions: report.interactions, errors: report.errors }));
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
