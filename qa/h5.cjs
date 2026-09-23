const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');

const output = path.join(__dirname, 'screenshots');
fs.mkdirSync(output, { recursive: true });
const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const locales = ['', 'en/', 'pt/', 'fr/', 'ja/'];
const viewports = [[1440, 900], [390, 844], [320, 740]];

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const results = [];
  for (const locale of locales) for (const [width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}/${locale}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const initial = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      lang: document.documentElement.lang,
      h1: document.querySelector('h1')?.innerText,
      sections: [...document.querySelectorAll('main>section')].map((item) => item.id),
      theme: document.documentElement.dataset.theme,
      line: !!document.querySelector('[data-continuous-line][data-ready]'),
      sticky: document.documentElement.classList.contains('sticky-services')
    }));
    await page.screenshot({ path: path.join(output, `${locale || 'es'}-${width}-initial.png`) });
    await page.locator('.menu-trigger').click();
    await page.waitForTimeout(500);
    const opened = await page.evaluate(() => ({
      dialog: document.querySelector('[data-menu-root]')?.getAttribute('role'),
      modal: document.querySelector('[data-menu-root]')?.getAttribute('aria-modal'),
      mainInert: document.querySelector('main')?.inert,
      overflow: getComputedStyle(document.documentElement).overflow,
      links: document.querySelectorAll('.menu-navigation a').length
    }));
    await page.screenshot({ path: path.join(output, `${locale || 'es'}-${width}-menu.png`) });
    await page.locator('[data-theme-choice="dark"]').click();
    await page.locator('[data-accent-choice="dark-blue"]').click();
    const preferences = await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, accent: document.documentElement.dataset.accent, controlsVisible: document.querySelector('.appearance')?.getClientRects().length > 0 }));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    const closed = await page.evaluate(() => ({ open: document.querySelector('[data-menu]')?.open, focus: document.activeElement?.className, mainInert: document.querySelector('main')?.inert }));
    await page.screenshot({ path: path.join(output, `${locale || 'es'}-${width}-hero.png`) });
    await page.locator('#servicios').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, `${locale || 'es'}-${width}-services.png`) });
    await page.evaluate(() => { const target = document.querySelector('#contacto'); if (target) scrollTo({top: target.getBoundingClientRect().top + scrollY - 90, behavior: 'instant'}); });
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(output, `${locale || 'es'}-${width}-contact.png`) });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const zoomOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    results.push({ locale: locale || 'es', width, height, initial, opened, preferences, closed, zoomOverflow, errors });
    await page.close();
  }
  for (const js of [false, true]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: js, reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    if (!js) await page.locator('.menu-trigger').click();
    results.push({ special: js ? 'reduced' : 'no-js', state: await page.evaluate(() => ({
      menuOpen: document.querySelector('[data-menu]')?.open,
      menuLinks: document.querySelectorAll('.menu-navigation a').length,
      fallback: document.querySelector('[data-word-current]')?.textContent,
      email: !!document.querySelector('a[href^="mailto:"]'),
      sticky: document.documentElement.classList.contains('sticky-services'),
      line: document.querySelector('[data-continuous-line]')?.hasAttribute('data-ready')
    })) });
    await page.close();
  }
  fs.writeFileSync(path.join(__dirname, 'h5-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({ locale, width, initial, opened, preferences, closed, zoomOverflow, errors, special, state }) => ({ locale, width, overflow: initial?.overflow, h1: initial?.h1, sticky: initial?.sticky, line: initial?.line, modal: opened?.modal, mainInert: opened?.mainInert, preferences, closed, zoomOverflow, errors, special, state })), null, 2));
  await browser.close();
})().catch((error) => { console.error(error); process.exitCode = 1; });
