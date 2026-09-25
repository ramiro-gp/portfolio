const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4324';
const output = path.join(__dirname, 'h6f', 'brand');
const viewports = [
  { name: 'desktop', width: 1440, height: 900, header: { x: 96, y: 14, width: 96.421875, height: 44, font: '600 21px "Instrument Sans", Arial, sans-serif', letterSpacing: '-0.84px' }, footer: { x: 96, y: 8876.40625, width: 72.203125, height: 19, font: '15px "Instrument Sans", Arial, sans-serif', letterSpacing: 'normal' } },
  { name: 'mobile', width: 390, height: 844, header: { x: 27, y: 8, width: 91.828125, height: 44, font: '600 20px "Instrument Sans", Arial, sans-serif', letterSpacing: '-0.8px' }, footer: { x: 27, y: 8978.65625, width: 72.203125, height: 19, font: '15px "Instrument Sans", Arial, sans-serif', letterSpacing: 'normal' } },
];
const variants = [
  { theme: 'light', accent: 'light-green' },
  { theme: 'light', accent: 'light-blue' },
  { theme: 'light', accent: 'light-violet' },
  { theme: 'dark', accent: 'dark-orange' },
  { theme: 'dark', accent: 'dark-blue' },
  { theme: 'dark', accent: 'dark-fuchsia' },
];

function closeTo(actual, expected, label) {
  assert(Math.abs(actual - expected) < 0.02, `${label}: expected ${expected}, got ${actual}`);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe',
  });
  const results = [];
  try {
    for (const viewport of viewports) {
      for (const variant of variants) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        await page.goto(base + '/', { waitUntil: 'networkidle' });
        await page.waitForFunction(() => document.documentElement.classList.contains('js-ready'));
        await page.locator('.menu-trigger').click();
        await page.locator(`[data-theme-choice="${variant.theme}"]`).click();
        await page.locator(`[data-accent-choice="${variant.accent}"]`).click();

        const visual = await page.evaluate(() => {
          const root = document.documentElement;
          const headerBrand = document.querySelector('.brand');
          const footerBrand = document.querySelector('.footer > span:first-child');
          const accentProbe = document.createElement('span');
          accentProbe.style.color = 'var(--accent)';
          document.body.append(accentProbe);
          const accentColor = getComputedStyle(accentProbe).color;
          accentProbe.remove();
          const details = (element) => {
            const rect = element.getBoundingClientRect();
            const dot = element.querySelector('.brand-dot');
            return {
              text: element.textContent,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              font: getComputedStyle(element).font,
              letterSpacing: getComputedStyle(element).letterSpacing,
              textColor: getComputedStyle(element).color,
              dotColor: getComputedStyle(dot).color,
            };
          };
          return {
            theme: root.dataset.theme,
            accent: root.dataset.accent,
            accentColor,
            headerLabel: headerBrand.getAttribute('aria-label'),
            header: details(headerBrand),
            footer: details(footerBrand),
          };
        });
        assert.equal(visual.theme, variant.theme);
        assert.equal(visual.accent, variant.accent);
        assert.equal(visual.header.text, 'ramita.dev');
        assert.equal(visual.footer.text, 'ramita.dev');
        assert.match(visual.headerLabel, /^ramita\.dev/);
        assert.equal(visual.header.dotColor, visual.accentColor);
        assert.equal(visual.footer.dotColor, visual.accentColor);
        assert.equal(visual.header.textColor, variant.theme === 'dark' ? 'rgb(241, 240, 236)' : 'rgb(32, 36, 33)');
        assert.equal(visual.footer.textColor, variant.theme === 'dark' ? 'rgb(170, 175, 169)' : 'rgb(85, 91, 85)');
        closeTo(visual.header.x, viewport.header.x, `${viewport.name} header x`);
        closeTo(visual.header.y, viewport.header.y, `${viewport.name} header y`);
        closeTo(visual.header.width, viewport.header.width, `${viewport.name} header width`);
        closeTo(visual.header.height, viewport.header.height, `${viewport.name} header height`);
        assert.equal(visual.header.font, viewport.header.font);
        assert.equal(visual.header.letterSpacing, viewport.header.letterSpacing);
        closeTo(visual.footer.x, viewport.footer.x, `${viewport.name} footer x`);
        closeTo(visual.footer.y, viewport.footer.y, `${viewport.name} footer y`);
        closeTo(visual.footer.width, viewport.footer.width, `${viewport.name} footer width`);
        closeTo(visual.footer.height, viewport.footer.height, `${viewport.name} footer height`);
        assert.equal(visual.footer.font, viewport.footer.font);
        assert.equal(visual.footer.letterSpacing, viewport.footer.letterSpacing);

        const suffix = `${variant.theme}-${variant.accent}-${viewport.name}`;
        await page.locator('.menu-trigger').click();
        await page.waitForFunction(() => !document.querySelector('.site-header').hasAttribute('data-open'));
        await page.locator('[data-cursor]').evaluate((element) => { element.style.display = 'none'; });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.locator('.site-header').screenshot({ path: path.join(output, `${suffix}-header.png`) });
        await page.locator('.footer').scrollIntoViewIfNeeded();
        await page.locator('.footer').screenshot({ path: path.join(output, `${suffix}-footer.png`) });
        results.push({ viewport: viewport.name, ...visual });
        await page.close();
      }
    }
    fs.writeFileSync(path.join(__dirname, 'h6f-brand-results.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(`H6.F brand QA passed: ${results.length} theme/accent/viewport cases; dot color updates immediately, brand metrics match pre-change baselines.`);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
