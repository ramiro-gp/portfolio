const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const imageDir = path.join(__dirname, 'fifth-pass');
fs.mkdirSync(imageDir, { recursive: true });
const report = { routes: [], cursor: null, backToTop: [], reducedMotion: null, zoom: [] };

const inspect = () => {
  const rect = (selector) => {
    const r = document.querySelector(selector).getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY, width: r.width, height: r.height };
  };
  const svg = document.querySelector('[data-continuous-line]');
  const line = svg.querySelector('[data-line-path]');
  return {
    viewport: { width: innerWidth, height: innerHeight },
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    contact: rect('#contacto'),
    heading: rect('#contacto .section-heading'),
    guidance: rect('#contacto .contact-guidance'),
    back: rect('[data-back-to-top]'),
    end: { x: Number(document.querySelector('[data-line-end-node]').getAttribute('cx')), y: Number(document.querySelector('[data-line-end-node]').getAttribute('cy')), radius: Number(document.querySelector('[data-line-end-node]').getAttribute('r')) },
    paddingBottom: parseFloat(getComputedStyle(document.querySelector('#contacto')).paddingBottom),
    minHeight: getComputedStyle(document.querySelector('#contacto')).minHeight,
    route: svg.dataset.route,
    milestones: JSON.parse(svg.dataset.milestones),
    pathLength: line.getTotalLength(),
    maxScroll: document.documentElement.scrollHeight - innerHeight
  };
};

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    for (const [locale, route] of [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']]) {
      for (const [width, height] of [[390, 844], [1366, 768], [1920, 1080], [2560, 1440]]) {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForSelector('[data-continuous-line][data-ready]');
        const state = await page.evaluate(inspect);
        const expectedGap = width < 1024 ? 36 : 56;
        assert.deepEqual(errors, [], `${locale} ${width}: page errors`);
        assert.equal(state.overflow, 0, `${locale} ${width}: horizontal overflow`);
        if (width >= 768) assert.ok(state.contact.height >= height - 1, `${locale} ${width}: Contact fills at least a viewport`);
        else assert.equal(state.minHeight, '0px', `${locale} ${width}: mobile Contact has natural height`);
        assert.ok(state.paddingBottom >= 36 && state.paddingBottom <= 56, `${locale} ${width}: no oversized bottom padding`);
        assert.ok(Math.abs(state.contact.bottom - state.back.bottom - state.paddingBottom) < 2, `${locale} ${width}: button anchors the scene bottom`);
        assert.ok(Math.abs(state.back.top - state.end.y - expectedGap) < 2, `${locale} ${width}: endpoint is near Back to top`);
        assert.ok(state.end.y + state.end.radius * 2.25 < state.back.top, `${locale} ${width}: pulse does not cover Back to top`);
        const pulseClearsGuidance = state.end.y - state.end.radius * 2.25 > state.guidance.bottom + 4 || state.end.x - state.end.radius * 2.25 > state.guidance.right + 8;
        assert.ok(pulseClearsGuidance, `${locale} ${width}: pulse clears guidance in both axes`);
        assert.ok(state.milestones.at(-1).distance > state.pathLength - 2, `${locale} ${width}: final milestone reaches path end`);
        assert.ok(state.milestones.at(-1).scroll <= state.maxScroll + 1, `${locale} ${width}: final milestone remains reachable`);
        report.routes.push({ locale, width, height, contactHeight: state.contact.height, paddingBottom: state.paddingBottom, endpointToBack: state.back.top - state.end.y, route: state.route, overflow: state.overflow });
        if (locale === 'es' || (locale === 'ja' && [390, 1920].includes(width))) {
          await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
          await page.waitForTimeout(550);
          await page.screenshot({ path: path.join(imageDir, `${locale}-${width}-contact-bottom.png`) });
        }
        if (width >= 768 && width <= 1366) {
          await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
          const visibleHeading = await page.evaluate(() => ({ top: document.querySelector('#contacto .section-heading').getBoundingClientRect().top, header: document.querySelector('.site-header').getBoundingClientRect().height }));
          assert.ok(visibleHeading.top >= visibleHeading.header + 8, `${locale} ${width}: Contact heading clears sticky header at page bottom`);
        }
        if (locale === 'es' && [390, 1920].includes(width)) {
          await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
          await page.waitForTimeout(75);
          const finished = await page.evaluate(() => ({ offset: Number(document.querySelector('[data-line-path]').style.strokeDashoffset), endOpacity: getComputedStyle(document.querySelector('[data-line-end-group]')).opacity, url: location.href }));
          assert.ok(finished.offset < 2, `${width}: endpoint is drawn at page bottom`);
          await page.locator('[data-back-to-top]').click();
          await page.waitForFunction(() => scrollY === 0 && document.activeElement.id === 'inicio');
          assert.equal(page.url(), finished.url, `${width}: Back to top preserves URL`);
          report.backToTop.push({ width, from: state.maxScroll, to: await page.evaluate(() => scrollY), hashPreserved: true });
        }
        await page.close();
      }
    }

    const cursorPage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await cursorPage.goto(base, { waitUntil: 'networkidle' });
    const cursor = cursorPage.locator('[data-cursor]');
    await cursorPage.mouse.move(700, 500);
    await cursorPage.waitForTimeout(200);
    const normal = await cursor.evaluate((element) => parseFloat(getComputedStyle(element).width));
    await cursorPage.locator('.menu-trigger').hover();
    await cursorPage.waitForTimeout(200);
    const hover = await cursor.evaluate((element) => parseFloat(getComputedStyle(element).width));
    await cursorPage.mouse.move(700, 500);
    await cursorPage.mouse.down();
    await cursorPage.waitForTimeout(200);
    const pressed = await cursor.evaluate((element) => parseFloat(getComputedStyle(element).width));
    await cursorPage.mouse.up();
    report.cursor = { pressed, normal, hover };
    assert.deepEqual(report.cursor, { pressed: 12, normal: 18, hover: 30 });
    await cursorPage.close();

    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await touch.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await touch.evaluate(() => document.documentElement.classList.contains('cursor-ready')), false);
    await touch.close();

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await reduced.goto(base, { waitUntil: 'networkidle' });
    report.reducedMotion = await reduced.evaluate(() => ({ offset: Number(document.querySelector('[data-line-path]').style.strokeDashoffset), pulse: getComputedStyle(document.querySelector('[data-line-end-pulse]')).animationName }));
    assert.deepEqual(report.reducedMotion, { offset: 0, pulse: 'none' });
    await reduced.close();

    for (const [width, height] of [[390, 844], [1366, 768]]) {
      const zoom = await browser.newPage({ viewport: { width, height } });
      await zoom.goto(base + '/ja/', { waitUntil: 'networkidle' });
      const baseHeight = await zoom.locator('#contacto').evaluate((element) => element.getBoundingClientRect().height);
      await zoom.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await zoom.waitForTimeout(150);
      const state = await zoom.evaluate(inspect);
      assert.equal(state.overflow, 0, `JA ${width}: 200% text has no overflow`);
      if (width >= 768) assert.ok(state.contact.height >= height && state.contact.height >= baseHeight, `JA ${width}: Contact grows as needed`);
      report.zoom.push({ width, baseHeight, zoomHeight: state.contact.height, overflow: state.overflow });
      await zoom.close();
    }

    fs.writeFileSync(path.join(__dirname, 'h5-fifth-pass-results.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ routes: report.routes.length, cursor: report.cursor, backToTop: report.backToTop.length, reducedMotion: report.reducedMotion, zoom: report.zoom.length }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
