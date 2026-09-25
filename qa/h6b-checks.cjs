const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const routes = ['/', '/en/', '/pt/', '/fr/', '/ja/'];
const out = path.join(__dirname, 'h6b');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const report = [];
  try {
    for (const route of routes) {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({
          viewport: { width, height: width === 390 ? 844 : 900 },
          isMobile: width === 390,
          hasTouch: width === 390,
          reducedMotion: route === '/ja/' ? 'reduce' : 'no-preference',
        });
        await page.addInitScript(() => {
          window.__h6bShifts = [];
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) window.__h6bShifts.push({
                value: entry.value,
                sources: entry.sources.map((source) => source.node?.tagName + '.' + (source.node?.className || '')),
              });
            }
          }).observe({ type: 'layout-shift', buffered: true });
        });
        const imageResponses = [];
        page.on('response', (response) => {
          if (/\/images\/residencias-(desktop|mobile)\.webp$/.test(new URL(response.url()).pathname)) imageResponses.push(response);
        });
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.locator('#proyectos').scrollIntoViewIfNeeded();
        await page.locator('[data-project-case="residencias"] img').first().scrollIntoViewIfNeeded();
        await page.evaluate(async () => {
          for (const img of document.querySelectorAll('[data-project-case="residencias"] img')) {
            img.scrollIntoView();
            await img.decode();
          }
        });
        await page.waitForTimeout(250);
        const data = await page.evaluate(() => {
          const caseElement = document.querySelector('[data-project-case="residencias"]');
          const images = [...caseElement.querySelectorAll('img')].map((img) => ({
            src: new URL(img.src).pathname,
            width: Number(img.getAttribute('width')),
            height: Number(img.getAttribute('height')),
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            loading: img.loading,
            alt: img.alt,
            caption: img.closest('figure').querySelector('figcaption').innerText,
            renderedWidth: Math.round(img.getBoundingClientRect().width),
          }));
          return {
            images,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            cls: window.__h6bShifts.reduce((sum, shift) => sum + shift.value, 0),
            shifts: window.__h6bShifts,
          };
        });
        assert.ok(data.overflow <= 1, `${route} ${width}: horizontal overflow`);
        assert.equal(data.images.length, 2);
        const mobile = data.images.find((img) => img.src.endsWith('residencias-mobile.webp'));
        const desktop = data.images.find((img) => img.src.endsWith('residencias-desktop.webp'));
        assert.ok(mobile && desktop, `${route} ${width}: expected WebP sources`);
        assert.deepEqual([mobile.width, mobile.height, mobile.naturalWidth, mobile.naturalHeight], [390, 844, 390, 844]);
        assert.deepEqual([desktop.width, desktop.height, desktop.naturalWidth, desktop.naturalHeight], [1440, 900, 1440, 900]);
        assert.equal(mobile.loading, 'lazy');
        assert.equal(desktop.loading, 'lazy');
        assert.ok(desktop.alt.includes('Casa San Juan') && !desktop.alt.includes('Casa Boedo'));
        assert.ok(desktop.caption.includes('Casa San Juan') && !desktop.caption.includes('Casa Boedo'));
        assert.ok(mobile.alt.includes('Nuestras residencias') && mobile.alt.includes('Casa San Juan'));
        assert.ok(mobile.caption.includes('Nuestras residencias') && mobile.caption.includes('Casa San Juan'));
        assert.ok(data.cls < 0.001, `${route} ${width}: CLS ${data.cls}`);
        const resources = await Promise.all(imageResponses.map(async (response) => ({
          src: new URL(response.url()).pathname,
          bytes: (await response.body()).length,
          status: response.status(),
          contentType: response.headers()['content-type'],
        })));
        assert.equal(resources.find((resource) => resource.src === mobile.src)?.bytes, 40126);
        assert.equal(resources.find((resource) => resource.src === desktop.src)?.bytes, 110488);
        if (route === '/' || route === '/ja/') {
          const label = route === '/' ? 'es' : 'ja';
          await page.locator('[data-project-case="residencias"]').screenshot({ path: path.join(out, `${label}-${width}-section.png`) });
          if (route === '/' && width === 390) await page.locator('[data-project-case="residencias"] .figure-mobile').screenshot({ path: path.join(out, 'es-mobile-figure.png') });
          if (route === '/' && width === 1440) await page.locator('[data-project-case="residencias"] .figure-desktop').screenshot({ path: path.join(out, 'es-desktop-figure.png') });
        }
        report.push({ route, width, ...data, resources });
        await page.close();
      }
    }
    fs.writeFileSync(path.join(__dirname, 'h6b-results.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ checks: report.length, maxCLS: Math.max(...report.map((item) => item.cls)), maxOverflow: Math.max(...report.map((item) => item.overflow)) }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
