const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const captures = path.join(__dirname, 'h8-preflight');
const cases = [
  { name: 'Chrome', executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' },
  { name: 'Edge', executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' },
];
const routes = ['/', '/en/', '/pt/', '/fr/', '/ja/'];
const results = { date: new Date().toISOString(), base, browsers: [], failures: [] };

async function check(browser, name, width, javaScriptEnabled, reducedMotion) {
  const context = await browser.newContext({
    viewport: { width, height: width < 600 ? 844 : 900 },
    javaScriptEnabled,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    const response = await page.goto(`${base}/__h8-missing-route-check__/`, { waitUntil: 'load' });
    assert.equal(response.status(), 404);
    assert.equal(await page.title(), '404 | ramita.dev');
    assert.equal(await page.locator('html').getAttribute('lang'), 'es');
    assert.equal(await page.locator('h1').innerText(), '404');
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
    const links = await page.locator('main nav a').evaluateAll(items => items.map(item => ({ href: item.getAttribute('href'), lang: item.lang, text: item.innerText.trim() })));
    assert.deepEqual(links.map(item => item.href), routes);
    assert.deepEqual(links.map(item => item.lang), ['es', 'en', 'pt', 'fr', 'ja']);
    assert(links.every(item => item.text.length > 0));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    if (name === 'Chrome' && javaScriptEnabled && !reducedMotion) {
      await page.screenshot({ path: path.join(captures, `404-${width}.png`), fullPage: true });
    }
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.className), 'skip-link');
    await page.locator('main nav a[href="/en/"]').click();
    await page.waitForURL(`${base}/en/`);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.deepEqual(errors, []);
    results.browsers.push({ name, version: browser.version(), width, javaScriptEnabled, reducedMotion, status: response.status(), links: links.length, pass: true });
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(captures, { recursive: true });
  for (const item of cases) {
    const browser = await chromium.launch({ headless: true, executablePath: item.executablePath });
    try {
      for (const width of [390, 1440]) await check(browser, item.name, width, true, false);
      if (item.name === 'Chrome') {
        await check(browser, item.name, 320, false, false);
        await check(browser, item.name, 390, true, true);
      }
    } finally {
      await browser.close();
    }
  }
})().catch(error => {
  results.failures.push(error.stack || String(error));
  process.exitCode = 1;
}).finally(() => {
  fs.writeFileSync(path.join(__dirname, 'h8-preflight-results.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify({ cases: results.browsers.length, failures: results.failures }, null, 2));
});
