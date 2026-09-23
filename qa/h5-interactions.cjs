const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const executablePath = 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const report = { routes: [], widths: [], interactions: [], browsers: [] };
const check = (name, value) => { assert.ok(value, name); report.interactions.push(name); };

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  const routes = [['/', 'es'], ['/en/', 'en'], ['/pt/', 'pt'], ['/fr/', 'fr'], ['/ja/', 'ja']];
  for (const [route, lang] of routes) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const data = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      sections: [...document.querySelectorAll('main>section')].map((item) => item.id),
      canonical: document.querySelector('link[rel=canonical]')?.href,
      hreflangs: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((item) => item.hreflang),
      overflow: document.documentElement.scrollWidth > innerWidth,
      words: JSON.parse(document.querySelector('[data-word-slot]')?.getAttribute('data-words') || '[]').length,
      theme: document.documentElement.dataset.theme,
      accent: document.documentElement.dataset.accent
    }));
    assert.equal(data.lang, lang);
    assert.deepEqual(data.sections, ['inicio', 'servicios', 'proyectos', 'ramiro', 'contacto']);
    assert.ok(data.canonical.endsWith(route));
    assert.deepEqual(data.hreflangs, ['es', 'en', 'pt', 'fr', 'ja', 'x-default']);
    assert.equal(data.overflow, false);
    assert.equal(data.words, 6);
    assert.equal(data.theme, 'light');
    assert.equal(data.accent, 'light-green');
    assert.deepEqual(errors, []);
    report.routes.push({ route, lang, ok: true });
    await page.close();
  }

  for (const [width, height] of [[320,740],[390,844],[600,900],[900,900],[1100,800],[1440,900],[1600,900]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(base, { waitUntil: 'networkidle' });
    const normal = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await page.evaluate(() => document.documentElement.style.fontSize = '200%');
    const enlarged = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(normal, false, `normal overflow at ${width}`);
    assert.equal(enlarged, false, `200% overflow at ${width}`);
    report.widths.push({ width, height, normal, enlarged });
    await page.close();
  }

  for (const [route, lang] of routes) {
    const page = await browser.newPage({ viewport: { width: 320, height: 600 } });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.documentElement.style.fontSize = '200%');
    await page.locator('.menu-trigger').click();
    check(`${lang} enlarged low-viewport menu remains scrollable`, await page.evaluate(() => {
      const panel = document.querySelector('.menu-panel');
      const last = panel?.querySelector('[data-language-link]:last-of-type');
      return document.documentElement.scrollWidth <= innerWidth && !!panel && panel.scrollHeight > panel.clientHeight && !!last;
    }));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    check(`${lang} enlarged menu closes with Escape`, await page.evaluate(() => !document.querySelector('[data-menu]')?.open));
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  const ariaHeading = await page.locator('h1').ariaSnapshot();
  check('stable accessible Hero', ariaHeading.includes('Diseño y desarrollo de sitios web para presentar tu proyecto') && !ariaHeading.includes('servicio'));
  await page.locator('.menu-trigger').click();
  check('dialog and inert background', await page.evaluate(() => document.querySelector('[data-menu-root]')?.getAttribute('aria-modal') === 'true' && document.querySelector('main')?.inert && document.querySelector('.skip-link')?.inert));
  await page.locator('[data-accent-choice="light-black"]').focus();
  await page.keyboard.press('Tab');
  check('focus trap forward', await page.evaluate(() => document.activeElement?.classList.contains('brand')));
  await page.keyboard.press('Shift+Tab');
  check('focus trap backward', await page.evaluate(() => document.activeElement?.getAttribute('data-accent-choice') === 'light-black'));
  check('theme and accent controls are directly visible', await page.evaluate(() => document.querySelector('[data-appearance]')?.tagName === 'DIV' && document.querySelector('[data-theme-choice="dark"]')?.getClientRects().length > 0));
  const lightAccents = ['light-green','light-blue','light-red','light-violet','light-black'];
  const darkAccents = ['dark-orange','dark-blue','dark-fuchsia','dark-lime','dark-white'];
  for (const accent of lightAccents) {
    await page.locator(`[data-accent-choice="${accent}"]`).click();
    check(`light ${accent} stays open`, await page.evaluate((id) => document.documentElement.dataset.accent === id && document.querySelector('[data-menu]')?.open, accent));
  }
  await page.locator('[data-theme-choice="dark"]').click();
  for (const accent of darkAccents) {
    await page.locator(`[data-accent-choice="${accent}"]`).click();
    check(`dark ${accent} stays open`, await page.evaluate((id) => document.documentElement.dataset.accent === id && document.querySelector('[data-menu]')?.open, accent));
  }
  await page.locator('[data-theme-choice="light"]').click();
  check('per-theme accent memory', await page.evaluate(() => document.documentElement.dataset.accent === 'light-black'));
  await page.keyboard.press('Escape');
  check('reverse close keeps dialog during animation', await page.evaluate(() => document.querySelector('[data-menu]')?.open && document.querySelector('[data-menu-root]')?.hasAttribute('data-closing') && document.querySelector('main')?.inert));
  await page.waitForTimeout(450);
  check('Escape restores trigger after reverse close', await page.evaluate(() => !document.querySelector('[data-menu]')?.open && document.activeElement?.classList.contains('menu-trigger') && !document.querySelector('main')?.inert));
  await page.reload({ waitUntil: 'networkidle' });
  check('stored theme and accent survive reload', await page.evaluate(() => document.documentElement.dataset.theme === 'light' && document.documentElement.dataset.accent === 'light-black'));
  await page.locator('.menu-trigger').click();
  await page.locator('a[href="#proyectos"]').click();
  await page.waitForTimeout(450);
  check('menu navigation closes and focuses destination', await page.evaluate(() => location.hash === '#proyectos' && !document.querySelector('[data-menu]')?.open && document.activeElement?.id === 'proyectos'));
  await page.locator('.menu-trigger').click();
  await page.locator('.menu-panel').click({ position: { x: 900, y: 520 } });
  await page.waitForTimeout(450);
  check('blank overlay closes without forcing trigger focus', await page.evaluate(() => !document.querySelector('[data-menu]')?.open));
  const lineBefore = await page.locator('[data-line-path]').getAttribute('d');
  await page.setViewportSize({ width: 900, height: 900 });
  await page.waitForTimeout(100);
  const lineAfter = await page.locator('[data-line-path]').getAttribute('d');
  check('line recalculates on resize', lineBefore !== lineAfter);
  await page.close();

  const stickyPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await stickyPage.goto(base, { waitUntil: 'networkidle' });
  check('desktop service stack enabled', await stickyPage.evaluate(() => document.documentElement.classList.contains('sticky-services')));
  const servicesTop = await stickyPage.locator('#servicios').evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await stickyPage.evaluate((top) => scrollTo({ top, behavior: 'instant' }), servicesTop + 700);
  const yDown = await stickyPage.evaluate(() => scrollY);
  await stickyPage.evaluate((top) => scrollTo({ top, behavior: 'instant' }), servicesTop + 200);
  const yUp = await stickyPage.evaluate(() => scrollY);
  check('native scroll reverses through sticky services', yDown > yUp && yUp > 0);
  await stickyPage.close();

  const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await touch.goto(base, { waitUntil: 'networkidle' });
  await touch.locator('.menu-trigger').tap();
  check('touch menu opens without custom cursor', await touch.evaluate(() => document.querySelector('[data-menu]')?.open && !document.documentElement.classList.contains('cursor-ready')));
  await touch.waitForTimeout(500);
  await touch.locator('.menu-trigger').tap();
  await touch.waitForTimeout(450);
  check('touch trigger closes', await touch.evaluate(() => !document.querySelector('[data-menu]')?.open));
  await touch.close();

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(base, { waitUntil: 'networkidle' });
  check('reduced motion fallback and static line', await reduced.evaluate(() => document.querySelector('[data-word-current]')?.textContent === 'proyecto' && !document.documentElement.classList.contains('sticky-services') && document.querySelector('[data-line-path]')?.style.strokeDashoffset === '0'));
  await reduced.close();

  const invalidPrefs = await browser.newPage();
  await invalidPrefs.addInitScript(() => {
    localStorage.setItem('ramita-theme', 'unexpected');
    localStorage.setItem('ramita-accent-light', 'dark-blue');
  });
  await invalidPrefs.goto(base, { waitUntil: 'networkidle' });
  check('invalid stored preferences use light/green fallback', await invalidPrefs.evaluate(() => document.documentElement.dataset.theme === 'light' && document.documentElement.dataset.accent === 'light-green'));
  await invalidPrefs.close();

  const blockedPrefs = await browser.newPage();
  await blockedPrefs.addInitScript(() => Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new Error('storage blocked'); } }));
  await blockedPrefs.goto(base, { waitUntil: 'networkidle' });
  check('blocked storage leaves base theme and usable menu', await blockedPrefs.evaluate(() => document.documentElement.dataset.theme === 'light' && document.documentElement.dataset.accent === 'light-green' && !!document.querySelector('.menu-trigger')));
  await blockedPrefs.close();

  const noJs = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  await noJs.goto(base, { waitUntil: 'networkidle' });
  await noJs.locator('.menu-trigger').click();
  check('no-JS content and navigation', await noJs.evaluate(() => document.querySelector('[data-menu]')?.open && !!document.querySelector('a[href="#contacto"]') && !!document.querySelector('a[href^="mailto:"]') && document.querySelector('[data-word-current]')?.textContent === 'proyecto'));
  await noJs.close();

  const clipboardContext = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const clipboardPage = await clipboardContext.newPage();
  await clipboardPage.goto(base, { waitUntil: 'networkidle' });
  await clipboardPage.locator('[data-copy="ramirogperucho@gmail.com"]').click();
  await clipboardPage.waitForTimeout(150);
  check('copy success icon and announcement', await clipboardPage.evaluate(() => document.querySelector('[data-copy="ramirogperucho@gmail.com"]')?.classList.contains('is-copied') && document.querySelector('[data-copy-feedback]')?.textContent === 'Email copiado'));
  await clipboardContext.close();
  const failPage = await browser.newPage();
  await failPage.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } }));
  await failPage.goto(base, { waitUntil: 'networkidle' });
  await failPage.locator('[data-copy="ramirogperucho@gmail.com"]').click();
  await failPage.waitForTimeout(150);
  check('copy failure preserves usable email', await failPage.evaluate(() => document.querySelector('[data-copy-feedback]')?.textContent?.includes('No se pudo copiar') && !!document.querySelector('a[href="mailto:ramirogperucho@gmail.com"]')));
  await failPage.close();
  await browser.close();

  for (const [name, executable] of [['Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'], ['Edge', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']]) {
    const hostBrowser = await chromium.launch({ headless: true, executablePath: executable });
    const hostPage = await hostBrowser.newPage();
    await hostPage.goto(base, { waitUntil: 'networkidle' });
    await hostPage.locator('.menu-trigger').click();
    assert.equal(await hostPage.locator('[data-menu]').evaluate((node) => node.open), true);
    report.browsers.push({ name, version: hostBrowser.version(), smoke: 'pass' });
    await hostBrowser.close();
  }

  fs.writeFileSync(path.join(__dirname, 'h5-interactions-results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ routes: report.routes.length, widths: report.widths, checks: report.interactions.length, browsers: report.browsers }, null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
