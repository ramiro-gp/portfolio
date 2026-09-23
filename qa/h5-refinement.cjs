const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const output = path.join(__dirname, 'refinement');
fs.mkdirSync(output, { recursive: true });
const base = process.env.QA_BASE || 'http://127.0.0.1:4323';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const results = [];
  for (const [route, label, width, height] of [['/', 'es-desktop', 1440, 900], ['/', 'es-mobile', 390, 844], ['/pt/', 'pt-mobile', 390, 844], ['/ja/', 'ja-mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(output, `${label}-hero.png`) });
    await page.locator('.menu-trigger').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(output, `${label}-menu.png`) });
    const menuFit = await page.evaluate(() => {
      const panel = document.querySelector('.menu-panel');
      return { scrollHeight: panel?.scrollHeight, clientHeight: panel?.clientHeight, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    if (label === 'es-desktop') await page.screenshot({ path: path.join(output, `${label}-menu-closing.png`) });
    await page.waitForTimeout(150);
    for (const id of ['proyectos', 'ramiro', 'contacto']) {
      await page.evaluate((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) scrollTo({ top: element.getBoundingClientRect().top + scrollY - 90, behavior: 'instant' });
      }, id);
      await page.waitForTimeout(550);
      await page.screenshot({ path: path.join(output, `${label}-${id}.png`) });
    }
    results.push({ label, menuFit, errors });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'h5-refinement-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
