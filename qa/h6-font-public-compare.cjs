const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const targets = {
  before: 'https://portfolio-rrrramita.vercel.app',
  afterLocal: 'http://127.0.0.1:4323',
};

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const result = [];
  try {
    for (const [version, base] of Object.entries(targets)) {
      for (const route of ['/', '/ja/']) {
        for (const width of [390, 1440]) {
          const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
          await page.goto(base + route, { waitUntil: 'networkidle' });
          await page.evaluate(async () => { await document.fonts.ready; });
          const data = await page.evaluate(() => {
            const heading = document.querySelector('h1');
            const rect = heading.getBoundingClientRect();
            return {
              heading: heading.innerText,
              headingHeight: Math.round(rect.height),
              headingWidth: Math.round(rect.width),
              overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
              fonts: [...document.fonts].filter((font) => font.status === 'loaded').map((font) => ({ family: font.family, weight: font.weight })),
              fontResources: performance.getEntriesByType('resource').filter((entry) => entry.name.includes('/fonts/')).map((entry) => ({ url: new URL(entry.name).pathname, transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize })),
            };
          });
          await page.screenshot({ path: path.join(__dirname, 'h6-fonts', `${version}-${route === '/' ? 'es' : 'ja'}-${width}.png`) });
          result.push({ version, route, width, ...data });
          await page.close();
        }
      }
    }
    fs.writeFileSync(path.join(__dirname, 'h6-font-public-compare.json'), JSON.stringify(result, null, 2) + '\n');
    console.log(JSON.stringify(result.map(({ version, route, width, headingHeight, overflow, fontResources }) => ({ version, route, width, headingHeight, overflow, fontResources }))));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
