const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const routes = ['/', '/en/', '/pt/', '/fr/', '/ja/'];

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const report = [];
  try {
    for (const route of routes) {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          document.documentElement.style.fontSize = '200%';
          await document.fonts.ready;
        });
        await page.waitForTimeout(200);
        const result = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          loadedFonts: [...document.fonts].filter((font) => font.status === 'loaded').map((font) => ({ family: font.family, weight: font.weight })),
          missingImages: [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
        }));
        assert.ok(result.overflow <= 1, `${route} ${width}: horizontal overflow ${result.overflow}px`);
        assert.deepEqual(result.missingImages, [], `${route} ${width}: broken image`);
        assert.ok(result.loadedFonts.some((font) => font.family === 'Instrument Sans'), `${route} ${width}: Instrument Sans not loaded`);
        if (route === '/ja/') {
          assert.ok(result.loadedFonts.some((font) => font.family === 'Noto Sans JP' && font.weight === '400 600'), `${route} ${width}: JA variable font not loaded`);
          if (width === 390) await page.screenshot({ path: path.join(__dirname, 'h6-fonts', 'ja-mobile-200.png') });
        }
        report.push({ route, width, ...result });
        await page.close();
      }
    }
    fs.writeFileSync(path.join(__dirname, 'h6-font-zoom-results.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ checks: report.length, maxOverflow: Math.max(...report.map((x) => x.overflow)) }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
