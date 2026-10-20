// Read-only public smoke test. Uses the bundled Playwright runtime; installs nothing.
// Run: node qa/seo/production-smoke.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.QA_BASE || 'https://ramita.dev';
const runLabel = process.env.QA_LABEL || 'production-2026-10-19';
const expectsSeoPatch = process.env.QA_EXPECT_SEO_PATCH === '1';
const output = path.join(__dirname, `browser-${runLabel}.json`);
const captures = path.join(__dirname, `screenshots-${runLabel}`);
const locales = [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']];
if (fs.existsSync(output) || fs.existsSync(captures)) throw new Error(`QA_LABEL already exists: ${runLabel}. Use a new label to preserve previous evidence.`);
const results = { startedAt: new Date().toISOString(), base, expectsSeoPatch, scope: process.env.QA_SCOPE || 'full', environment: base.startsWith('https://ramita.dev') ? 'production' : 'local', browsers: [], cases: [], animation: null, failures: [], screenshots: [] };
fs.mkdirSync(captures);

async function runCase(browser, browserName, locale, width, javaScriptEnabled = true, reducedMotion = false) {
  const [lang, route] = locale;
  const id = `${browserName}/${lang}/${width}/${javaScriptEnabled ? 'js' : 'no-js'}/${reducedMotion ? 'reduce' : 'motion'}`;
  const context = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 }, javaScriptEnabled, reducedMotion: reducedMotion ? 'reduce' : 'no-preference' });
  const errors = [];
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
  try {
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    if (javaScriptEnabled) await page.waitForFunction(() => document.querySelector('[data-continuous-line]')?.hasAttribute('data-ready'));
    const state = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      description: document.querySelector('meta[name="description"]')?.content,
      h1Count: document.querySelectorAll('h1').length,
      stableH1: document.querySelector('h1 .sr-only')?.textContent,
      heroCopy: document.querySelector('.hero-copy')?.textContent,
      sections: [...document.querySelectorAll('main > section')].map(node => node.id),
      servicePanels: document.querySelectorAll('[data-service-panel]').length,
      projects: document.querySelectorAll('.project-case').length,
      alternatives: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(node => ({ lang: node.hreflang, url: node.href })),
      languageLinks: [...document.querySelectorAll('[data-language-link]')].map(node => node.getAttribute('href')),
      contact: [...document.querySelectorAll('#contacto a')].map(node => node.href),
      headings: [...document.querySelectorAll('h2,h3')].map(node => ({ tag: node.tagName, text: node.textContent.trim() })),
      imagesMissingAlt: [...document.images].filter(node => !node.hasAttribute('alt')).map(node => node.src),
      internalFragmentsMissing: [...document.querySelectorAll('a[href^="#"]')].map(node => node.getAttribute('href')).filter(hash => hash.length > 1 && !document.getElementById(hash.slice(1))),
      overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      fonts: document.fonts.status,
      linePulse: getComputedStyle(document.querySelector('[data-line-start-pulse]')).animationName,
      lineDashOffset: document.querySelector('[data-line-path]').style.strokeDashoffset,
      currentWord: document.querySelector('[data-word-current]')?.textContent,
      structuredData: [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent)),
      staticHtmlContent: ['servicios', 'proyectos', 'ramiro', 'contacto'].every(id => document.getElementById(id)?.textContent?.trim()),
    }));
    state.scrollCueAccessibility = await page.locator('[data-hero-scroll]').ariaSnapshot();
    if (expectsSeoPatch) {
      assert.match(state.scrollCueAccessibility, /link "SCROLL:/, 'computed accessible name includes the visible SCROLL label');
      for (const selector of ['.menu-panel', '.language-group', '.appearance']) {
        assert.equal(await page.locator(selector).getAttribute('role'), 'group', `${selector} permits its accessible label`);
      }
    }
    assert.equal(state.lang, lang);
    assert.equal(state.h1Count, 1);
    assert.ok(state.stableH1 && state.heroCopy && state.description && state.title);
    assert.deepEqual(state.sections, ['inicio', 'servicios', 'proyectos', 'ramiro', 'contacto']);
    assert.equal(state.servicePanels, 3);
    assert.equal(state.projects, 2);
    assert.equal(state.alternatives.length, 6);
    assert.equal(state.canonical, `https://ramita.dev${route}`);
    assert.deepEqual(state.languageLinks, locales.map(([, path]) => path));
    assert.ok(state.contact.includes('mailto:ramirogperucho@gmail.com'));
    assert.ok(state.contact.includes('https://wa.me/5491151354489'));
    assert.deepEqual(state.imagesMissingAlt, []);
    assert.deepEqual(state.internalFragmentsMissing, []);
    assert.equal(state.overflow, 0);
    assert.equal(state.fonts, 'loaded');
    assert.equal(state.staticHtmlContent, true);
    assert.equal(state.structuredData.filter(item => item['@type'] === 'Person').length, 1);
    if (expectsSeoPatch) assert.equal(state.structuredData.filter(item => item['@type'] === 'WebSite').length, lang === 'es' ? 1 : 0);
    if (expectsSeoPatch && lang === 'es') {
      const website = state.structuredData.find(item => item['@type'] === 'WebSite');
      assert.equal(website.url, 'https://ramita.dev/');
      assert.equal(website.name, 'ramita.dev');
    }

    if (browserName === 'Chrome' && lang === 'es' && [390, 1440].includes(width) && javaScriptEnabled && !reducedMotion) {
      for (const section of ['inicio', 'servicios', 'proyectos', 'contacto']) {
        await page.locator(`#${section}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(450);
        const screenshot = path.join(captures, `es-${width}-${section}.png`);
        await page.screenshot({ path: screenshot });
        results.screenshots.push(path.relative(path.join(__dirname, '..', '..'), screenshot).replaceAll('\\', '/'));
      }
    }
    if (javaScriptEnabled) {
      await page.locator('.menu-trigger').click();
      assert.equal(await page.locator('.menu-trigger').getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('main').evaluate(node => node.inert), true);
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.closest('[data-menu-root]') !== null), true);
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.querySelector('.menu-trigger')?.getAttribute('aria-expanded') === 'false');
      assert.equal(await page.locator('.menu-trigger').evaluate(node => document.activeElement === node), true);
      await page.locator('.menu-trigger').click();
      await page.locator('[data-theme-choice="dark"]').click();
      await page.locator('[data-accent-choice="dark-blue"]').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      assert.equal(await page.locator('html').getAttribute('data-accent'), 'dark-blue');
      await page.locator('[data-section-link][href="#contacto"]').click();
      await page.waitForFunction(() => document.activeElement?.id === 'contacto');
      assert.equal(await page.locator('main').evaluate(node => node.inert), false);
      await page.locator('[data-back-to-top]').click();
      await page.waitForFunction(() => scrollY < 5);
      assert.equal(new URL(page.url()).hash, '');
      if (reducedMotion) {
        assert.equal(state.linePulse, 'none');
        assert.equal(state.lineDashOffset, '0');
        const initial = await page.locator('[data-word-current]').textContent();
        await page.waitForTimeout(3500);
        assert.equal(await page.locator('[data-word-current]').textContent(), initial);
      }
      if (browserName === 'Chrome' && lang === 'es' && width === 390 && !reducedMotion) {
        await page.reload({ waitUntil: 'networkidle' });
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
        assert.equal(await page.locator('html').getAttribute('data-accent'), 'dark-blue');
        const first = await page.locator('[data-word-current]').textContent();
        await page.waitForFunction(value => document.querySelector('[data-word-current]')?.textContent !== value, first, { timeout: 5000 });
        results.animation = { first, next: await page.locator('[data-word-current]').textContent(), stableH1: await page.locator('h1 .sr-only').textContent(), persistence: true };
        await page.locator('.menu-trigger').click();
        await Promise.all([page.waitForURL(`${base}/en/`), page.locator('[data-language-link][lang="en"]').click()]);
        assert.equal(await page.locator('html').getAttribute('lang'), 'en');
        results.animation.languageNavigation = 'es -> /en/';
      }
    } else {
      await page.locator('.menu-trigger').click();
      assert.equal(await page.locator('[data-menu]').evaluate(node => node.open), true);
      assert.equal(await page.locator('[data-language-link][lang="en"]').isVisible(), true);
      await page.locator('.menu-trigger').click();
      await page.locator('.cta').click();
      assert.equal(new URL(page.url()).hash, '#contacto');
      assert.equal(await page.locator('#contacto .email').isVisible(), true);
    }
    assert.deepEqual(errors, []);
    results.cases.push({ id, status: 'PASS', state, errors });
  } catch (error) {
    results.failures.push({ id, error: error.stack, errors });
  } finally { await context.close(); }
}

(async () => {
  for (const [browserName, executablePath] of [
    ['Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'],
    ['Edge', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'],
  ]) {
    const browser = await chromium.launch({ headless: true, executablePath });
    try {
      results.browsers.push({ name: browserName, version: browser.version() });
      if (process.env.QA_SCOPE === 'semantics') {
        if (browserName === 'Chrome') {
          for (const locale of locales) await runCase(browser, browserName, locale, 390);
          await runCase(browser, browserName, locales[0], 1440);
        }
      } else if (browserName === 'Chrome') {
        for (const locale of locales) for (const width of [320, 390, 1440]) await runCase(browser, browserName, locale, width);
        for (const locale of locales) await runCase(browser, browserName, locale, 390, false);
        for (const width of [390, 1440]) await runCase(browser, browserName, locales[0], width, true, true);
      } else for (const width of [390, 1440]) await runCase(browser, browserName, locales[0], width);
    } finally { await browser.close(); }
  }
})().catch(error => results.failures.push({ id: 'runner', error: error.stack })).finally(() => {
  results.completedAt = new Date().toISOString();
  fs.writeFileSync(output, `${JSON.stringify(results, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify({ output, passed: results.cases.length, failed: results.failures.length, failures: results.failures }, null, 2));
  if (results.failures.length) process.exitCode = 1;
});
