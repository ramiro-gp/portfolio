const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.H8_BASE || 'https://ramita.dev';
if (base !== 'https://ramita.dev') throw new Error('H8 production checks must target https://ramita.dev');
const releaseSha = '0af5489a63559b18651a7d10360a54a7a9165506';
const manifestPath = path.join(__dirname, '..', 'release', `ramita-h8-${releaseSha}.sha256`);
const manifest = fs.readFileSync(manifestPath, 'utf8').trim().split(/\r?\n/)
  .map(line => /^([a-f0-9]{64})  (.+)$/.exec(line))
  .filter(match => match && !match[2].endsWith('.zip'))
  .map(match => ({ hash: match[1], path: match[2] }));
assert.equal(manifest.length, 25);
const locales = [
  { code: 'es', route: '/' }, { code: 'en', route: '/en/' },
  { code: 'pt', route: '/pt/' }, { code: 'fr', route: '/fr/' }, { code: 'ja', route: '/ja/' },
];
const outputDir = path.join(__dirname, 'h8-production');
const results = {
  date: new Date().toISOString(), base, releaseSha, manifestPath,
  http: [], files: [], browser: [], links: [], failures: [],
};

async function run(area, name, action) {
  try { await action(); }
  catch (error) { results.failures.push({ area, name, error: error.stack || String(error) }); }
}

async function request(url) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
  return { url, status: response.status, location: response.headers.get('location'), type: response.headers.get('content-type'), body: await response.text() };
}

async function httpChecks() {
  for (const { route } of locales) await run('http', route, async () => {
    const response = await request(base + route);
    assert.equal(response.status, 200);
    assert.match(response.type || '', /text\/html/);
    results.http.push({ route, status: response.status, type: response.type });
  });
  await run('http', 'http to https', async () => {
    const response = await request('http://ramita.dev/en/?h8=1');
    assert.equal(response.status, 301);
    assert.equal(response.location, 'https://ramita.dev/en/?h8=1');
    results.http.push({ route: response.url, status: response.status, location: response.location });
  });
  await run('http', 'www to apex', async () => {
    const response = await request('https://www.ramita.dev/en/?h8=1');
    assert.equal(response.status, 301);
    assert.equal(response.location, 'https://ramita.dev/en/?h8=1');
    results.http.push({ route: response.url, status: response.status, location: response.location });
  });
  await run('http', 'missing route', async () => {
    const response = await request(base + '/__h8-missing-route-check__/');
    assert.equal(response.status, 404);
    assert.match(response.body, /<title>404 \| ramita\.dev<\/title>/);
    results.http.push({ route: response.url, status: response.status, title: '404 | ramita.dev' });
  });
  await run('http', 'trailing slash', async () => {
    const response = await fetch(base + '/en', { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    assert.equal(response.url, base + '/en/');
    results.http.push({ route: '/en', status: response.status, finalUrl: response.url });
  });
  for (const item of manifest) await run('manifest', item.path, async () => {
    const url = item.path === 'index.html' ? `${base}/` :
      /^(en|pt|fr|ja)\/index\.html$/.test(item.path) ? `${base}/${item.path.replace('index.html', '')}` : `${base}/${item.path}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 200);
    const bytes = Buffer.from(await response.arrayBuffer());
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    assert.equal(hash, item.hash);
    results.files.push({ path: item.path, status: response.status, bytes: bytes.length, hash, type: response.headers.get('content-type') });
  });
}

async function smoke(browser, browserName, locale, width, reducedMotion = false, javaScriptEnabled = true) {
  const context = await browser.newContext({
    viewport: { width, height: width < 600 ? 844 : 900 },
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference', javaScriptEnabled,
  });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
    page.on('request', request => { if (request.url().startsWith('http://')) errors.push(`Mixed content: ${request.url()}`); });
    const response = await page.goto(base + locale.route, { waitUntil: 'load' });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator('html').getAttribute('lang'), locale.code);
    assert((await page.title()).length > 0);
    assert((await page.locator('meta[name="description"]').getAttribute('content')).length > 0);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), base + locale.route);
    assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 6);
    assert.equal(await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href'), `${base}/`);
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), base + locale.route);
    assert.equal(await page.locator('meta[name="twitter:card"]').getAttribute('content'), 'summary_large_image');
    assert.equal(await page.locator('main > section').count(), 5);
    assert.equal(await page.locator('.project-case').count(), 2);
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), `${base}/social/ramita-${locale.code}.png`);
    assert.equal(await page.locator('meta[name="twitter:image"]').getAttribute('content'), `${base}/social/ramita-${locale.code}.png`);
    const person = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
    assert.equal(person['@type'], 'Person');
    assert.equal(person.url, `${base}/`);
    for (const [label, href] of [
      ['email', 'mailto:ramirogperucho@gmail.com'],
      ['WhatsApp', 'https://wa.me/5491151354489'],
      ['GitHub', 'https://github.com/ramiro-gp'],
      ['Residencias', 'https://residenciasgrupocasa.com.ar/'],
      ['LingoHive', 'https://lingo-hive.vercel.app/'],
    ]) {
      assert((await page.locator(`a[href="${href}"]`).count()) > 0, `${label} missing`);
      results.links.push({ locale: locale.code, label, href });
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (browserName === 'Chrome' && locale.code === 'es' && javaScriptEnabled && !reducedMotion) {
      await page.screenshot({ path: path.join(outputDir, `es-${width}.png`) });
    }
    if (javaScriptEnabled) {
      await page.locator('.menu-trigger').click();
      assert.equal(await page.locator('.menu-trigger').getAttribute('aria-expanded'), 'true');
      await page.locator('[data-theme-choice="dark"]').click();
      await page.locator('[data-accent-choice="dark-blue"]').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      assert.equal(await page.locator('html').getAttribute('data-accent'), 'dark-blue');
      await page.locator('[data-section-link][href="#contacto"]').click();
      await page.waitForFunction(() => document.activeElement?.id === 'contacto', null, { timeout: 3000 });
      await page.locator('[data-back-to-top]').click();
      await page.waitForFunction(() => scrollY < 5, null, { timeout: 3000 });
    } else {
      assert.equal(await page.locator('.menu-shell').isVisible(), true);
      assert.equal(await page.locator('a[href^="mailto:"]').count() > 0, true);
    }
    assert.deepEqual(errors, []);
    results.browser.push({ browser: browserName, version: browser.version(), locale: locale.code, width, reducedMotion, javaScriptEnabled, pass: true });
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  await httpChecks();
  for (const [name, executablePath] of [
    ['Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'],
    ['Edge', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'],
  ]) {
    const browser = await chromium.launch({ headless: true, executablePath });
    try {
      for (const locale of locales) for (const width of [390, 1440]) {
        await run('smoke', `${name}/${locale.code}/${width}`, () => smoke(browser, name, locale, width));
      }
      if (name === 'Chrome') {
        await run('smoke', 'Chrome/reduced-motion', () => smoke(browser, name, locales[0], 390, true));
        await run('smoke', 'Chrome/no-js', () => smoke(browser, name, locales[0], 390, false, false));
      }
    } finally {
      await browser.close();
    }
  }
})().catch(error => {
  results.failures.push({ area: 'runner', name: 'fatal', error: error.stack || String(error) });
  process.exitCode = 1;
}).finally(() => {
  if (results.failures.length) process.exitCode = 1;
  fs.writeFileSync(path.join(__dirname, 'h8-production-results.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify({ http: results.http.length, files: results.files.length, browser: results.browser.length, failures: results.failures.length }, null, 2));
});
