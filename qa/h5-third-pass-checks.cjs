const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const report = { routes: [], line: [], controls: [], cursor: [], checks: [] };
const check = (name, value) => { assert.ok(value, name); report.checks.push(name); };

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  const screenshots = path.join(__dirname, 'third-pass');
  fs.mkdirSync(screenshots, { recursive: true });

  for (const [route, locale] of [['/', 'es'], ['/en/', 'en'], ['/pt/', 'pt'], ['/fr/', 'fr'], ['/ja/', 'ja']]) {
    for (const width of [320, 390, 1366, 1920]) {
      const height = width >= 1366 ? (width === 1920 ? 1080 : 768) : 844;
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const state = await page.evaluate(() => {
        const hero = document.querySelector('.hero h1');
        const section = document.querySelector('#servicios h2');
        const current = document.querySelector('[data-word-current]');
        const letters = [...current.querySelectorAll('.word-char')];
        const keyframes = document.getAnimations().find((animation) => animation.effect?.target === letters[0])?.effect?.getKeyframes() || [];
        return {
          client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth,
          heroSize: parseFloat(getComputedStyle(hero).fontSize), sectionSize: parseFloat(getComputedStyle(section).fontSize),
          words: JSON.parse(document.querySelector('[data-word-slot]').dataset.words),
          firstDuration: parseFloat(getComputedStyle(letters[0]).animationDuration),
          lastDelay: parseFloat(getComputedStyle(letters.at(-1)).animationDelay),
          fromTransform: keyframes[0]?.transform || '',
          fromClip: keyframes[0]?.clipPath || ''
        };
      });
      assert.ok(state.scroll <= state.client, `${locale}/${width}: overflow`);
      assert.ok(state.heroSize > state.sectionSize * 1.13, `${locale}/${width}: H1 hierarchy`);
      assert.equal(state.words.length, 6, `${locale}/${width}: six words`);
      assert.ok(state.firstDuration + state.lastDelay >= .34 && state.firstDuration + state.lastDelay <= .46, `${locale}/${width}: word timing`);
      assert.ok(Number(state.fromTransform.match(/translateY\(([\d.]+)px\)/)?.[1]) > 0 && state.fromClip.includes('100%'), `${locale}/${width}: letters reveal upward from below`);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      const zoom = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(zoom.scroll <= zoom.client, `${locale}/${width}: 200% overflow`);
      assert.deepEqual(errors, [], `${locale}/${width}: JS errors`);
      report.routes.push({ locale, width, ...state, zoom });
      if ((locale === 'es' || locale === 'ja' || locale === 'pt') && [320, 390, 1920].includes(width)) {
        await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
        await page.screenshot({ path: path.join(screenshots, `${locale}-${width}-hero.png`) });
      }
      await page.close();
    }
  }
  check('all five locales at mobile/desktop and 200% text remain readable without overflow', report.routes.length === 20);

  for (const [width, height] of [[1366, 768], [1920, 1080], [2560, 1440]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const geometry = await page.evaluate(() => {
      const path = document.querySelector('[data-line-path]');
      const length = path.getTotalLength();
      const milestones = JSON.parse(document.querySelector('[data-continuous-line]').dataset.milestones);
      const middleStart = milestones.find((item) => item.name === 'stack-middle-entry');
      const middleEnd = milestones.find((item) => item.name === 'inside-stack');
      let runStart = null, horizontal = null;
      for (let distance = 20; distance < length - 20; distance += 10) {
        const a = path.getPointAtLength(distance - 10);
        const b = path.getPointAtLength(distance);
        const flat = Math.abs(a.y - b.y) < 1 && Math.abs(a.x - b.x) > 8;
        if (flat && runStart === null) runStart = distance - 10;
        if (!flat && runStart !== null) {
          if (distance - runStart > 430) { horizontal = [runStart + 20, runStart + 420]; break; }
          runStart = null;
        }
      }
      return { length, middleStart, middleEnd, horizontal, stroke: parseFloat(getComputedStyle(path).strokeWidth), node: Number(document.querySelector('[data-line-start-node]').getAttribute('r')), pulseDuration: getComputedStyle(document.querySelector('[data-line-start-pulse]')).animationDuration, halo: document.querySelectorAll('[data-line-halo-path]').length };
    });
    assert.ok(geometry.horizontal, `${width}: long horizontal run`);
    assert.equal(geometry.stroke, 17);
    assert.equal(geometry.node, 20);
    assert.equal(geometry.pulseDuration, '3.5s');
    assert.equal(geometry.halo, 0);
    const scrollFor = (distance) => geometry.middleStart.scroll + (distance - geometry.middleStart.distance) / (geometry.middleEnd.distance - geometry.middleStart.distance) * (geometry.middleEnd.scroll - geometry.middleStart.scroll);
    const [from, to] = geometry.horizontal;
    assert.ok(from >= geometry.middleStart.distance && to <= geometry.middleEnd.distance, `${width}: horizontal run belongs to the structural stack milestone`);
    const readDrawn = async (position) => {
      await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), position);
      await page.waitForTimeout(80);
      return page.evaluate(() => { const p = document.querySelector('[data-line-path]'); return p.getTotalLength() - Number(p.style.strokeDashoffset); });
    };
    const before = await readDrawn(scrollFor(from));
    const after = await readDrawn(scrollFor(to));
    const reverse = await readDrawn(scrollFor(from));
    assert.ok(Math.abs(before - from) < 6 && Math.abs(after - to) < 6, `${width}: physical path position`);
    assert.ok(Math.abs(after - before - 400) < 8 && scrollFor(to) - scrollFor(from) > 100, `${width}: horizontal consumes proportional scroll`);
    assert.ok(Math.abs(reverse - before) < 6, `${width}: reverse scroll restores identical path length`);
    report.line.push({ width, height, ...geometry, scrollConsumedFor400PathPx: scrollFor(to) - scrollFor(from), before, after, reverse });
    await page.close();
  }
  check('horizontal and curved path progress use structural milestones and reverse exactly', report.line.length === 3);

  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  const startingUrl = page.url();
  await page.locator('[data-hero-scroll]').click();
  const firstFrame = await page.evaluate(() => scrollY);
  await page.waitForFunction(() => document.activeElement.id === 'servicios');
  const services = await page.evaluate(() => ({ y: scrollY, target: document.querySelector('#servicios').getBoundingClientRect().top, header: document.querySelector('.site-header').getBoundingClientRect().height }));
  assert.ok(firstFrame < services.y - 50 && services.y > 300, 'SCROLL uses visible native motion');
  assert.equal(page.url(), startingUrl, 'SCROLL leaves URL unchanged');
  assert.ok(services.target >= services.header, 'Services title remains below header');
  report.controls.push({ name: 'SCROLL', firstFrame, ...services });
  await page.locator('#contacto').scrollIntoViewIfNeeded();
  const beforeBack = await page.evaluate(() => scrollY);
  await page.locator('[data-back-to-top]').click();
  const backFirstFrame = await page.evaluate(() => scrollY);
  await page.waitForFunction(() => scrollY === 0 && document.activeElement.id === 'inicio');
  assert.ok(backFirstFrame > 50 && backFirstFrame <= beforeBack, 'Back to top uses native smooth motion');
  assert.equal(page.url(), startingUrl, 'Back to top leaves URL unchanged');
  report.controls.push({ name: 'BACK TO TOP', beforeBack, backFirstFrame, final: 0 });

  const cursor = page.locator('[data-cursor]');
  await page.mouse.move(700, 500);
  await page.waitForTimeout(200);
  const normal = await cursor.evaluate((node) => parseFloat(getComputedStyle(node).width));
  await page.locator('.menu-trigger').hover();
  await page.waitForTimeout(200);
  const hover = await cursor.evaluate((node) => parseFloat(getComputedStyle(node).width));
  await page.mouse.move(700, 500);
  await page.waitForTimeout(200);
  await page.mouse.down();
  await page.waitForTimeout(200);
  const pressed = await cursor.evaluate((node) => parseFloat(getComputedStyle(node).width));
  await page.mouse.up();
  await page.waitForTimeout(200);
  const released = await cursor.evaluate((node) => parseFloat(getComputedStyle(node).width));
  assert.deepEqual([pressed, normal, hover, released], [12, 18, 30, 18]);
  report.cursor.push({ normal, hover, pressed, released });
  await page.close();
  check('cursor has distinct pressed, normal and interactive sizes', true);

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(base, { waitUntil: 'networkidle' });
  const reducedUrl = reduced.url();
  await reduced.locator('[data-hero-scroll]').click();
  assert.equal(await reduced.evaluate(() => document.activeElement.id), 'servicios');
  await reduced.locator('#contacto').scrollIntoViewIfNeeded();
  await reduced.locator('[data-back-to-top]').click();
  const reducedState = await reduced.evaluate(() => ({ y: scrollY, focus: document.activeElement.id, pulse: getComputedStyle(document.querySelector('[data-line-start-pulse]')).animationName, hero: document.querySelector('[data-word-current]').textContent, cursor: document.documentElement.classList.contains('cursor-ready') }));
  assert.deepEqual(reducedState, { y: 0, focus: 'inicio', pulse: 'none', hero: 'proyecto', cursor: false });
  assert.equal(reduced.url(), reducedUrl);
  await reduced.close();
  check('reduced motion jumps immediately and disables decorative motion', true);

  const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await touch.goto(base, { waitUntil: 'networkidle' });
  await touch.locator('[data-hero-scroll]').tap();
  await touch.waitForFunction(() => document.activeElement.id === 'servicios');
  assert.ok(await touch.evaluate(() => scrollY > 0 && !document.documentElement.classList.contains('cursor-ready')));
  await touch.locator('#contacto').scrollIntoViewIfNeeded();
  await touch.locator('[data-back-to-top]').tap();
  await touch.waitForFunction(() => scrollY === 0 && document.activeElement.id === 'inicio');
  await touch.close();
  check('both scroll controls work on touch without a custom cursor', true);

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'h5-third-pass-results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ routes: report.routes.length, line: report.line.length, controls: report.controls.length, cursor: report.cursor.length, checks: report.checks.length }, null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
