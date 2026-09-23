const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'
  });
  const results = [];
  for (const route of ['/', '/ja/']) for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const page = await browser.newPage({ viewport });
    await page.addInitScript(() => {
      window.__h5Metrics = { cls: 0, lcp: null, shifts: [] };
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) {
          window.__h5Metrics.cls += entry.value;
          window.__h5Metrics.shifts.push({ value: entry.value, sources: entry.sources?.map((source) => source.node?.className || source.node?.nodeName) });
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        window.__h5Metrics.lcp = entries.at(-1)?.startTime ?? null;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
    await page.goto(`${process.env.QA_BASE || 'http://127.0.0.1:4323'}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    results.push(await page.evaluate(({ route, viewport }) => ({
      route,
      viewport,
      cls: Number(window.__h5Metrics.cls.toFixed(4)),
      shifts: window.__h5Metrics.shifts,
      lcpMs: window.__h5Metrics.lcp && Math.round(window.__h5Metrics.lcp),
      resources: performance.getEntriesByType('resource').map((item) => ({ name: new URL(item.name).pathname, encodedBytes: item.encodedBodySize || 0 })),
      fontsLoaded: document.fonts.status
    }), { route, viewport }));
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'h5-performance-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({ route, viewport, cls, lcpMs, fontsLoaded }) => ({ route, width: viewport.width, cls, lcpMs, fontsLoaded })), null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
