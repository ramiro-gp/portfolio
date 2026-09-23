const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const evidence = path.join(__dirname, 'fourth-pass');
const report = { routes: [], desktop: [], mobile: [], interaction: [], reducedMotion: null };
fs.mkdirSync(evidence, { recursive: true });

const measure = () => {
  const svg = document.querySelector('[data-continuous-line]');
  const line = svg.querySelector('[data-line-path]');
  const rect = (selector) => {
    const r = document.querySelector(selector).getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY, width: r.width, height: r.height };
  };
  const milestones = JSON.parse(svg.dataset.milestones);
  const pathLength = line.getTotalLength();
  const points = [];
  for (let distance = 0; distance <= pathLength; distance += 8) {
    const point = line.getPointAtLength(distance);
    points.push({ x: point.x, y: point.y });
  }
  const intro = rect('.services .section-intro');
  const lower = rect('.services .capabilities');
  const introCopy = rect('.services .section-intro>p');
  const lowerCopy = rect('.services .capabilities p');
  lowerCopy.bottom = rect('.services .capabilities p:last-child').bottom;
  const overlaps = (box) => points.some((point) => point.y > box.top - 5 && point.y < box.bottom + 5 && point.x > box.left - 10 && point.x < box.right + 10);
  return {
    route: svg.dataset.route,
    milestones,
    pathLength,
    stroke: parseFloat(getComputedStyle(line).strokeWidth),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    start: { x: Number(document.querySelector('[data-line-start-node]').getAttribute('cx')), y: Number(document.querySelector('[data-line-start-node]').getAttribute('cy')) },
    end: { x: Number(document.querySelector('[data-line-end-node]').getAttribute('cx')), y: Number(document.querySelector('[data-line-end-node]').getAttribute('cy')) },
    sections: { hero: rect('.hero'), services: rect('.services'), intro, stack: rect('.service-stack'), lower, projects: rect('.projects'), about: rect('.about'), contact: rect('.contact'), back: rect('.back-to-top') },
    touchesIntro: overlaps(introCopy) || overlaps(rect('.services .section-heading')),
    touchesLower: overlaps(lowerCopy)
  };
};

const expectedDistance = (milestones, y) => {
  if (y <= milestones[0].scroll) return 0;
  if (y >= milestones.at(-1).scroll) return milestones.at(-1).distance;
  for (let i = 1; i < milestones.length; i++) {
    const previous = milestones[i - 1], next = milestones[i];
    if (y <= next.scroll) return previous.distance + (next.distance - previous.distance) * (y - previous.scroll) / (next.scroll - previous.scroll);
  }
  throw new Error('No milestone interval');
};

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    for (const [locale, route] of [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']]) {
      for (const [width, height] of [[360, 800], [390, 844], [430, 932], [768, 900], [900, 900], [1024, 768], [1366, 768], [1920, 1080], [2560, 1440]]) {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForSelector('[data-continuous-line][data-ready]');
        const state = await page.evaluate(measure);
        assert.deepEqual(errors, [], `${locale} ${width}: no page errors`);
        assert.equal(state.overflow, 0, `${locale} ${width}: no horizontal overflow`);
        assert.equal(state.route, width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop');
        assert.equal(state.stroke, width < 1024 ? 8.5 : 17);
        for (let i = 1; i < state.milestones.length; i++) {
          assert.ok(state.milestones[i].scroll > state.milestones[i - 1].scroll, `${locale} ${width}: scroll milestones ascend`);
          assert.ok(state.milestones[i].distance > state.milestones[i - 1].distance, `${locale} ${width}: path milestones ascend`);
        }
        const bottomGap = state.sections.contact.bottom - state.sections.back.bottom;
        assert.ok(bottomGap >= 35 && bottomGap <= 58, `${locale} ${width}: Contact has only intentional bottom spacing (${bottomGap})`);
        assert.equal(state.touchesIntro, false, `${locale} ${width}: path does not cross Services intro copy`);
        assert.equal(state.touchesLower, false, `${locale} ${width}: path does not cross Services lower copy`);
        report.routes.push({ locale, width, route: state.route, overflow: state.overflow, bottomGap });
        if (width >= 1024) {
          const first = state.milestones.find((item) => item.name === 'services-entry');
          const middle = state.milestones.find((item) => item.name === 'inside-stack');
          const exit = state.milestones.find((item) => item.name === 'outside-stack');
          assert.ok(first.distance > 200 && state.sections.services.top < state.start.y + first.distance, `${locale} ${width}: first curve follows a visible vertical run`);
          assert.ok(middle.scroll > state.sections.stack.top - height, `${locale} ${width}: middle turn belongs to stack`);
          assert.ok(exit.scroll > middle.scroll, `${locale} ${width}: line exits after stack entry`);
          report.desktop.push({ locale, width, first, middle, exit, bottomGap });
        } else {
          assert.ok(state.milestones.some((item) => item.name === 'inside-stack'));
          assert.ok(state.milestones.some((item) => item.name === 'outside-stack'));
          report.mobile.push({ locale, width, route: state.route, bottomGap });
        }
        if (locale === 'es' && (width === 360 || width === 390 || width === 430 || width >= 1366)) {
          const prefix = `${locale}-${width}`;
          const names = width >= 1366 ? ['services-entry', 'stack-middle-entry', 'inside-stack', 'stack-bottom', 'outside-stack', 'services-text'] : width === 390 ? ['stack-entry', 'inside-stack', 'outside-stack', 'services-text'] : ['stack-entry', 'services-text'];
          for (const name of names) {
            const milestone = state.milestones.find((item) => item.name === name);
            await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), milestone.scroll);
            await page.waitForTimeout(550);
            await page.screenshot({ path: path.join(evidence, `${prefix}-${name}.png`) });
          }
        }
        if (locale === 'es' && width >= 1366) {
          let highestHead = -Infinity;
          for (let y = Math.max(0, state.sections.services.top - height * .8); y <= state.sections.stack.bottom; y += height / 4) {
            await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
            await page.waitForTimeout(35);
            const head = await page.evaluate(() => { const line = document.querySelector('[data-line-path]'); const distance = line.getTotalLength() - Number(line.style.strokeDashoffset); return line.getPointAtLength(Math.max(0, distance)).y - scrollY; });
            highestHead = Math.max(highestHead, head);
            assert.ok(head <= height + 8, `${width}: the head does not run below the Services viewport`);
          }
          report.interaction.push({ width, highestHead });
        }
        await page.close();
      }
    }

    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    let state = await page.evaluate(measure);
    const sampleScroll = [state.milestones[2].scroll, (state.milestones[2].scroll + state.milestones[3].scroll) / 2, state.milestones[4].scroll, state.milestones[3].scroll];
    for (const y of sampleScroll) {
      await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(75);
      const reading = await page.evaluate(() => {
        const line = document.querySelector('[data-line-path]');
        const distance = line.getTotalLength() - Number(line.style.strokeDashoffset);
        const point = line.getPointAtLength(distance);
        return { y: scrollY, distance, headViewportY: point.y - scrollY };
      });
      assert.ok(Math.abs(reading.distance - expectedDistance(state.milestones, reading.y)) < 4, 'drawn length follows milestones in both directions');
      assert.ok(reading.headViewportY <= 1080, 'line does not draw below the viewport in Services');
      report.interaction.push(reading);
    }
    const middleStart = state.milestones.find((item) => item.name === 'stack-middle-entry');
    const middleEnd = state.milestones.find((item) => item.name === 'inside-stack');
    const curveScrolls = Array.from({ length: 9 }, (_, index) => middleStart.scroll + (middleEnd.scroll - middleStart.scroll) * index / 8);
    const curveDistances = [];
    for (const y of [...curveScrolls, ...curveScrolls.slice(0, -1).reverse()]) {
      await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(55);
      const reading = await page.evaluate(() => { const line = document.querySelector('[data-line-path]'); return { y: scrollY, distance: line.getTotalLength() - Number(line.style.strokeDashoffset) }; });
      assert.ok(Math.abs(reading.distance - expectedDistance(state.milestones, reading.y)) < 4, 'slow scroll and direction reversal stay on the same path position');
      curveDistances.push(reading.distance);
    }
    assert.ok(curveDistances.slice(1, 9).every((distance, index) => distance >= curveDistances[index]), 'slow descent advances through the curve');
    assert.ok(curveDistances.slice(10).every((distance, index) => distance <= curveDistances[index + 9]), 'slow ascent retracts through the curve');
    report.interaction.push({ curveSteps: curveDistances.length, slowDownUp: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => document.querySelector('[data-continuous-line]').dataset.route === 'mobile');
    state = await page.evaluate(measure);
    assert.equal(state.overflow, 0, 'resize to mobile has no overflow');
    let current = await page.evaluate(() => { const line = document.querySelector('[data-line-path]'); return { y: scrollY, distance: line.getTotalLength() - Number(line.style.strokeDashoffset) }; });
    assert.ok(Math.abs(current.distance - expectedDistance(state.milestones, current.y)) < 4, 'resize immediately synchronizes mobile progress');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForFunction(() => document.querySelector('[data-continuous-line]').dataset.route === 'desktop');
    state = await page.evaluate(measure);
    current = await page.evaluate(() => { const line = document.querySelector('[data-line-path]'); return { y: scrollY, distance: line.getTotalLength() - Number(line.style.strokeDashoffset) }; });
    assert.ok(Math.abs(current.distance - expectedDistance(state.milestones, current.y)) < 4, 'resize immediately synchronizes desktop progress');
    report.interaction.push({ resize: 'desktop → mobile → desktop', route: state.route });
    const cursor = page.locator('[data-cursor]');
    await page.mouse.move(700, 500);
    await page.waitForTimeout(200);
    const normal = await cursor.evaluate((element) => parseFloat(getComputedStyle(element).width));
    await page.locator('.menu-trigger').hover();
    await page.waitForTimeout(200);
    const hover = await cursor.evaluate((element) => parseFloat(getComputedStyle(element).width));
    await page.mouse.move(700, 500);
    await page.mouse.down();
    await page.waitForTimeout(200);
    const pressed = await cursor.evaluate((element) => parseFloat(getComputedStyle(element).width));
    await page.mouse.up();
    assert.deepEqual([pressed, normal, hover], [12, 18, 30]);
    report.interaction.push({ cursor: { pressed, normal, hover } });
    await page.close();

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await reduced.goto(base, { waitUntil: 'networkidle' });
    report.reducedMotion = await reduced.evaluate(() => { const line = document.querySelector('[data-line-path]'); return { offset: Number(line.style.strokeDashoffset), pulse: getComputedStyle(document.querySelector('[data-line-start-pulse]')).animationName, route: document.querySelector('[data-continuous-line]').dataset.route }; });
    assert.equal(report.reducedMotion.offset, 0);
    assert.equal(report.reducedMotion.pulse, 'none');
    await reduced.close();

    fs.writeFileSync(path.join(__dirname, 'h5-fourth-pass-results.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ routes: report.routes.length, desktop: report.desktop.length, compact: report.mobile.length, interaction: report.interaction.length, reducedMotion: report.reducedMotion }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
