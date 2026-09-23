const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const routes = [['/', 'es'], ['/en/', 'en'], ['/pt/', 'pt'], ['/fr/', 'fr'], ['/ja/', 'ja']];
const report = { overflow: [], geometry: [], focus: [], themes: [], checks: [] };
const check = (name, value) => { assert.ok(value, name); report.checks.push(name); };

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const screenshotDir = path.join(__dirname, 'second-pass');
  fs.mkdirSync(screenshotDir, { recursive: true });

  for (const [route, locale] of routes) for (const width of [320, 390, 768, 1366, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: width >= 1366 ? 1080 : 844 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const normal = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert.ok(normal.scroll <= normal.client && normal.body <= normal.client, `${locale} ${width}: horizontal overflow at rest`);
    await page.locator('.menu-trigger').click();
    const open = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert.ok(open.scroll <= open.client && open.body <= open.client, `${locale} ${width}: horizontal overflow with menu open`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    await page.waitForTimeout(100);
    const enlarged = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert.ok(enlarged.scroll <= enlarged.client && enlarged.body <= enlarged.client, `${locale} ${width}: horizontal overflow at 200% text`);
    assert.deepEqual(errors, [], `${locale} ${width}: page errors`);
    report.overflow.push({ locale, width, normal, open, enlarged });
    await page.close();
  }
  check('five locales × five widths fit at rest, menu open and 200% text', report.overflow.length === 25);

  for (const [width, height] of [[1366, 768], [1920, 1080], [2560, 1440]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const path = document.querySelector('[data-line-path]');
      const intro = document.querySelector('.section-intro');
      const capabilities = document.querySelector('.capabilities');
      const rect = (element) => { const r = element.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY }; };
      const blocked = [rect(intro), rect(capabilities)];
      const length = path.getTotalLength();
      let crossings = 0;
      for (let distance = 0; distance <= length; distance += 4) {
        const point = path.getPointAtLength(distance);
        if (blocked.some((area) => point.x >= area.left - 8 && point.x <= area.right + 8 && point.y >= area.top - 8 && point.y <= area.bottom + 8)) crossings++;
      }
      const start = document.querySelector('[data-line-start-node]');
      const pulse = document.querySelector('[data-line-start-pulse]');
      return {
        d: path.getAttribute('d'), crossings, stroke: parseFloat(getComputedStyle(path).strokeWidth),
        nodeRadius: Number(start.getAttribute('r')), pulseAnimation: getComputedStyle(pulse).animationName,
        pulseFill: getComputedStyle(pulse).fill, pathStroke: getComputedStyle(path).stroke
      };
    });
    assert.equal(geometry.crossings, 0, `${width}: line crosses Services intro/capabilities`);
    assert.equal(geometry.stroke, 17, `${width}: desktop stroke`);
    assert.equal(geometry.nodeRadius, 20, `${width}: desktop node radius`);
    assert.equal(geometry.pulseAnimation, 'line-node-pulse', `${width}: pulse animation`);
    assert.equal(geometry.pulseFill, geometry.pathStroke, `${width}: pulse keeps accent`);
    assert.ok(!/[DL]/.test(geometry.d) && /[HVQ]/.test(geometry.d), `${width}: orthogonal geometry`);
    report.geometry.push({ width, height, ...geometry });
    await page.locator('#servicios').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(screenshotDir, `services-${width}x${height}.png`) });
    await page.close();
  }
  check('Services text is clear of the line at 1366, 1920 and 2560', report.geometry.every((item) => item.crossings === 0));

  for (const method of ['mouse', 'keyboard']) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(base + '/#inicio', { waitUntil: 'networkidle' });
    for (const [route, code] of [['/en/', 'en'], ['/pt/', 'pt'], ['/fr/', 'fr'], ['/ja/', 'ja'], ['/', 'es']]) {
      await page.locator('.menu-trigger').click();
      const link = page.locator(`[data-language-link][hreflang="${code}"]`);
      const navigation = page.waitForURL(`${base}${route}#inicio`);
      if (method === 'keyboard') { await link.focus(); await page.keyboard.press('Enter'); }
      else await link.click();
      await navigation;
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(50);
      const state = await page.evaluate(() => {
        const section = document.querySelector('#inicio');
        const index = section.querySelector('.section-index');
        const sectionStyle = getComputedStyle(section);
        const indexStyle = getComputedStyle(index);
        return { active: document.activeElement.id, sectionOutline: sectionStyle.outlineStyle, indexOutline: indexStyle.outlineStyle, indexOutlineWidth: indexStyle.outlineWidth, pointerClass: document.documentElement.classList.contains('pointer-section-focus') };
      });
      assert.equal(state.active, 'inicio', `${method} ${code}: destination focus`);
      assert.equal(state.sectionOutline, 'none', `${method} ${code}: no full-section focus border`);
      if (method === 'keyboard') assert.ok(state.indexOutline !== 'none' && state.indexOutlineWidth === '2px' && !state.pointerClass, `${method} ${code}: compact visible focus`);
      else assert.ok(state.indexOutline === 'none' && state.pointerClass, `${method} ${code}: pointer navigation has no residual ring`);
      report.focus.push({ method, code, ...state });
    }
    await page.close();
  }
  check('all five language transitions distinguish mouse and keyboard focus', report.focus.length === 10);

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  for (const [theme, accent] of [['light', 'light-green'], ['light', 'light-black'], ['dark', 'dark-orange'], ['dark', 'dark-white']]) {
    await page.evaluate(([nextTheme, nextAccent]) => {
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.dataset.accent = nextAccent;
    }, [theme, accent]);
    await page.waitForTimeout(220);
    const colors = await page.evaluate(() => {
      const line = document.querySelector('[data-line-path]');
      const node = document.querySelector('[data-line-start-node]');
      return { path: getComputedStyle(line).stroke, node: getComputedStyle(node).fill, github: getComputedStyle(document.querySelector('.about .profile-links a')).color, accent: getComputedStyle(document.querySelector('.cta')).backgroundColor, haloCount: document.querySelectorAll('[data-line-halo-path]').length };
    });
    assert.equal(colors.path, colors.accent, `${theme}/${accent}: path changed accent`);
    assert.equal(colors.node, colors.accent, `${theme}/${accent}: node changed accent`);
    assert.equal(colors.github, colors.accent, `${theme}/${accent}: GitHub accent`);
    assert.equal(colors.haloCount, 0, `${theme}/${accent}: no second stroke`);
    report.themes.push({ theme, accent, ...colors });
  }
  await page.locator('#contacto').scrollIntoViewIfNeeded();
  const back = page.locator('.back-to-top');
  assert.equal(await back.evaluate((node) => node.tagName), 'BUTTON');
  const backUrl = page.url();
  await back.focus();
  await page.keyboard.press('Enter');
  try { await page.waitForFunction(() => scrollY === 0 && document.activeElement.id === 'inicio', undefined, { timeout: 5000 }); }
  catch (error) { console.error('back-to-top state', await page.evaluate(() => ({ y: scrollY, active: document.activeElement.id, hash: location.hash }))); throw error; }
  check('Back to top returns and focuses the Hero by keyboard without a hash', page.url() === backUrl);
  await page.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(base, { waitUntil: 'networkidle' });
  const mobileLine = await mobile.evaluate(() => ({ stroke: parseFloat(getComputedStyle(document.querySelector('[data-line-path]')).strokeWidth), radius: Number(document.querySelector('[data-line-start-node]').getAttribute('r')) }));
  assert.equal(mobileLine.stroke, 8.5);
  assert.equal(mobileLine.radius, 12.5);
  await mobile.locator('#contacto').scrollIntoViewIfNeeded();
  await mobile.screenshot({ path: path.join(screenshotDir, 'contact-mobile-390x844.png') });
  await mobile.close();

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(base, { waitUntil: 'networkidle' });
  const reducedState = await reduced.evaluate(() => ({ pulse: getComputedStyle(document.querySelector('[data-line-start-pulse]')).animationName, pulseOpacity: getComputedStyle(document.querySelector('[data-line-start-pulse]')).opacity, lineOffset: document.querySelector('[data-line-path]').style.strokeDashoffset, hero: document.querySelector('[data-word-current]').textContent }));
  assert.equal(reducedState.pulse, 'none');
  assert.equal(reducedState.pulseOpacity, '0');
  assert.equal(reducedState.lineOffset, '0');
  assert.equal(reducedState.hero, 'proyecto');
  check('reduced motion disables pulse and keeps static line/Hero', true);
  await reduced.close();

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'h5-second-pass-results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ overflowCases: report.overflow.length, geometryCases: report.geometry.length, focusCases: report.focus.length, themeCases: report.themes.length, checks: report.checks.length }, null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
