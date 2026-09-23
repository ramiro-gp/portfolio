const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const imageDir = path.join(__dirname, 'sixth-pass');
fs.mkdirSync(imageDir, { recursive: true });
const routes = [
  ['es', '/', 'ramita | Diseño y desarrollo web'],
  ['en', '/en/', 'ramita | Web design & development'],
  ['pt', '/pt/', 'ramita | Design e desenvolvimento web'],
  ['fr', '/fr/', 'ramita | Design et développement web'],
  ['ja', '/ja/', 'ramita | Webデザイン・開発']
];
const report = { routes: [], scrollbar: [], reverse: [], backToTop: false, compact: null };

const inspect = () => {
  const rect = (selector) => {
    const r = document.querySelector(selector).getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY, height: r.height };
  };
  const svg = document.querySelector('[data-continuous-line]');
  const line = svg.querySelector('[data-line-path]');
  const end = document.querySelector('[data-line-end-node]');
  return {
    title: document.title,
    route: svg.dataset.route,
    contact: rect('#contacto'),
    back: rect('[data-back-to-top]'),
    end: { x: Number(end.getAttribute('cx')), y: Number(end.getAttribute('cy')), radius: Number(end.getAttribute('r')) },
    headingAlign: getComputedStyle(document.querySelector('#contacto .section-heading')).alignItems,
    peerAligns: ['#servicios', '#proyectos', '#ramiro'].map((selector) => getComputedStyle(document.querySelector(selector + ' .section-heading')).alignItems),
    forms: document.querySelectorAll('#contacto form').length,
    paddingBottom: parseFloat(getComputedStyle(document.querySelector('#contacto')).paddingBottom),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    path: line.getAttribute('d'),
    pathLength: line.getTotalLength(),
    milestones: JSON.parse(svg.dataset.milestones),
    maxScroll: document.documentElement.scrollHeight - innerHeight
  };
};

const scrollbar = () => {
  const html = document.documentElement;
  const probe = document.createElement('span');
  probe.style.color = 'var(--accent)';
  html.append(probe);
  const accent = getComputedStyle(probe).color;
  probe.remove();
  return {
    theme: html.dataset.theme,
    accentId: html.dataset.accent,
    accent,
    canvas: getComputedStyle(html).backgroundColor,
    thumb: getComputedStyle(html, '::-webkit-scrollbar-thumb').backgroundColor,
    track: getComputedStyle(html, '::-webkit-scrollbar-track').backgroundColor,
    button: getComputedStyle(html, '::-webkit-scrollbar-button').display,
    width: getComputedStyle(html, '::-webkit-scrollbar').width
  };
};

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    for (const [locale, route, title] of routes) {
      for (const [width, height] of [[1366, 768], [1920, 1080], [2560, 1440]]) {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForSelector('[data-continuous-line][data-ready]');
        const state = await page.evaluate(inspect);
        const finalTurn = state.path.match(/ V ([0-9.]+) Q ([0-9.]+) ([0-9.]+) ([0-9.]+) ([0-9.]+) H ([0-9.]+)$/);
        assert.deepEqual(errors, [], locale + ' ' + width + ': no page errors');
        assert.equal(state.title, title, locale + ': localized title');
        assert.equal(state.route, 'desktop');
        assert.equal(state.overflow, 0, locale + ' ' + width + ': no horizontal overflow');
        assert.equal(state.headingAlign, 'baseline');
        assert.deepEqual(state.peerAligns, ['baseline', 'baseline', 'baseline']);
        assert.equal(state.forms, 0, locale + ': Contact remains form-free');
        assert.ok(state.contact.height >= height - 1, locale + ' ' + width + ': flexible fullscreen Contact');
        assert.ok(state.paddingBottom >= 36 && state.paddingBottom <= 56);
        assert.ok(finalTurn, locale + ' ' + width + ': final orthogonal curve and horizontal exit');
        assert.ok(Number(finalTurn[2]) < state.contact.right - 50, locale + ' ' + width + ': curve starts inside rail');
        assert.ok(state.end.x > state.contact.right, locale + ' ' + width + ': node exits content rail');
        assert.ok(Math.abs(Number(finalTurn[6]) - state.end.x) < 1);
        assert.ok(Math.abs(Number(finalTurn[3]) - state.end.y) < 1);
        assert.ok(Math.abs(state.back.top - state.end.y - 56) < 2, locale + ' ' + width + ': node near control');
        assert.ok(state.end.y + state.end.radius * 2.25 < state.back.top, locale + ' ' + width + ': pulse clears control');
        assert.ok(state.milestones.at(-1).distance > state.pathLength - 2);
        assert.ok(state.milestones.at(-1).scroll <= state.maxScroll + 1);
        report.routes.push({ locale, width, contactHeight: state.contact.height, nodeToBack: state.back.top - state.end.y, exitBeyondRail: state.end.x - state.contact.right, overflow: state.overflow });
        if (locale === 'es') {
          await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
          await page.waitForTimeout(350);
          await page.screenshot({ path: path.join(imageDir, 'es-' + width + '-contact.png') });
          const atEnd = await page.evaluate(() => Number(document.querySelector('[data-line-path]').style.strokeDashoffset));
          assert.ok(atEnd < 2, width + ': path reaches node');
          await page.evaluate(() => scrollTo({ top: scrollY - 300, behavior: 'instant' }));
          await page.waitForTimeout(80);
          const reversed = await page.evaluate(() => Number(document.querySelector('[data-line-path]').style.strokeDashoffset));
          assert.ok(reversed > atEnd + 2, width + ': line reverses');
          await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
          await page.waitForTimeout(80);
          const finished = await page.evaluate(() => Number(document.querySelector('[data-line-path]').style.strokeDashoffset));
          assert.ok(finished < 2, width + ': line redraws');
          report.reverse.push(width);
          if (width === 1366) {
            const originalUrl = page.url();
            await page.locator('[data-back-to-top]').click();
            await page.waitForFunction(() => scrollY === 0 && document.activeElement.id === 'inicio');
            assert.equal(page.url(), originalUrl);
            report.backToTop = true;
          }
        }
        await page.close();
      }
    }

    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    const capture = async (name) => {
      const state = await page.evaluate(scrollbar);
      assert.equal(state.thumb, state.accent, name + ': thumb follows accent');
      assert.equal(state.track, state.canvas, name + ': track follows theme canvas');
      assert.equal(state.button, 'none', name + ': arrow buttons hidden');
      assert.equal(state.width, '10px', name + ': narrow native scrollbar');
      report.scrollbar.push(state);
    };
    await capture('light default');
    await page.locator('.menu-trigger').click();
    await page.locator('[data-accent-choice="light-blue"]').click();
    await capture('light alternate');
    await page.locator('[data-theme-choice="dark"]').click();
    await capture('dark default');
    await page.locator('[data-accent-choice="dark-blue"]').click();
    await capture('dark alternate');
    await page.keyboard.press('Escape');
    await page.evaluate(() => scrollTo({ top: 500, behavior: 'instant' }));
    assert.ok(await page.evaluate(() => scrollY >= 499), 'native scroll remains functional');
    await page.close();

    const compact = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await compact.goto(base, { waitUntil: 'networkidle' });
    report.compact = await compact.evaluate(inspect);
    assert.equal(report.compact.route, 'mobile');
    assert.equal(report.compact.overflow, 0);
    assert.ok(report.compact.path.endsWith('V ' + report.compact.end.y), 'compact route keeps straight ending');
    await compact.close();

    fs.writeFileSync(path.join(__dirname, 'h5-sixth-pass-results.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ routes: report.routes.length, scrollbar: report.scrollbar.length, reverse: report.reverse.length, backToTop: report.backToTop, compact: report.compact.route }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
