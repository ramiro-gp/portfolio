const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const evidenceDir = path.join(__dirname, 'eighth-pass');
fs.mkdirSync(evidenceDir, { recursive: true });
const routes = [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']];
const viewports = [[320, 600], [360, 800], [390, 844], [430, 932], [768, 900], [900, 900], [1023, 768], [1366, 768], [1920, 1080], [2560, 1440]];
const report = { cases: [], compactRhythm: [], desktopServices: [], reversals: [], screenshots: [], resize: null, reducedMotion: null, menu: null, darkScene: null };

const inspect = () => {
  const box = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const r = element.getBoundingClientRect();
    let revealOffsetY = 0;
    for (let current = element; current; current = current.parentElement) {
      if (!current.hasAttribute('data-reveal')) continue;
      const transform = getComputedStyle(current).transform;
      if (transform !== 'none') revealOffsetY += new DOMMatrixReadOnly(transform).m42;
    }
    return { left: r.left, right: r.right, top: r.top + scrollY - revealOffsetY, bottom: r.bottom + scrollY - revealOffsetY, width: r.width, height: r.height };
  };
  const textRects = (selector) => [...document.querySelectorAll(selector)].flatMap((element) => {
    if (!element.textContent.trim()) return [];
    const range = document.createRange();
    range.selectNodeContents(element);
    const rects = [...range.getClientRects()];
    return (rects.length ? rects : [element.getBoundingClientRect()]).map((r) => ({
      selector,
      left: r.left,
      right: r.right,
      top: r.top + scrollY,
      bottom: r.bottom + scrollY
    }));
  });
  const svg = document.querySelector('[data-continuous-line]');
  const line = svg.querySelector('[data-line-path]');
  const length = line.getTotalLength();
  const points = [];
  for (let distance = 0; distance < length; distance += 2) {
    const p = line.getPointAtLength(distance);
    points.push({ x: p.x, y: p.y });
  }
  const endPoint = line.getPointAtLength(length);
  points.push({ x: endPoint.x, y: endPoint.y });
  const tokens = line.getAttribute('d').match(/[A-Za-z]|[-+]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][-+]?\d+)?/g) || [];
  const horizontal = [];
  const vertical = [];
  let currentX = 0;
  let currentY = 0;
  for (let i = 0; i < tokens.length;) {
    const command = tokens[i++];
    if (command === 'M') {
      currentX = Number(tokens[i++]);
      currentY = Number(tokens[i++]);
    } else if (command === 'H') {
      const nextX = Number(tokens[i++]);
      horizontal.push({ x1: currentX, x2: nextX, y: currentY, length: Math.abs(nextX - currentX) });
      currentX = nextX;
    } else if (command === 'V') {
      const nextY = Number(tokens[i++]);
      vertical.push({ x: currentX, y1: currentY, y2: nextY, length: Math.abs(nextY - currentY) });
      currentY = nextY;
    } else if (command === 'Q') {
      i += 2;
      currentX = Number(tokens[i++]);
      currentY = Number(tokens[i++]);
    } else {
      throw new Error('Unexpected SVG path command: ' + command);
    }
  }
  const circle = (selector) => {
    const node = document.querySelector(selector);
    return { x: Number(node.getAttribute('cx')), y: Number(node.getAttribute('cy')), r: Number(node.getAttribute('r')) };
  };
  const contentSelectors = [
    '.hero h1', '.hero-copy',
    '.services .section-heading h2', '.services .section-intro > p',
    '[data-service-panel] h3', '[data-service-panel] p', '.capabilities p',
    '.projects .section-heading h2', '.project-heading h3', '.project-status',
    '.project-text p', '.project-capabilities',
    '.about .section-heading h2', '.about .professional-title', '.about .profile > p',
    '.profile-links', '.process h3', '.process-prose p', '.process-note',
    '.contact .section-heading h2', '.email', '.phone', '.contact-guidance', '[data-back-to-top]'
  ];
  const content = contentSelectors.flatMap((selector) => textRects(selector));
  const main = document.querySelector('main');
  const trigger = document.querySelector('.menu-trigger').getBoundingClientRect();
  const glyph = document.querySelector('.menu-glyph').getBoundingClientRect();
  const headerInner = document.querySelector('.header-inner').getBoundingClientRect();
  const markers = JSON.parse(svg.dataset.milestones);
  return {
    width: document.documentElement.clientWidth,
    height: innerHeight,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    route: svg.dataset.route,
    pathLength: length,
    points,
    horizontal,
    vertical,
    markers,
    maxScroll: document.documentElement.scrollHeight - innerHeight,
    start: circle('[data-line-start-node]'),
    startPulse: circle('[data-line-start-pulse]'),
    end: circle('[data-line-end-node]'),
    endPulse: circle('[data-line-end-pulse]'),
    strokeWidth: parseFloat(getComputedStyle(line).strokeWidth),
    bounds: {
      services: box('.services'),
      intro: box('.services .section-intro'),
      stack: box('[data-service-stack]'),
      panels: [...document.querySelectorAll('[data-service-panel]')].map((element) => {
        const r = element.getBoundingClientRect();
        const title = element.querySelector('h3').getBoundingClientRect();
        return {
          left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY,
          title: { left: title.left, right: title.right, top: title.top + scrollY, bottom: title.bottom + scrollY }
        };
      }),
      capabilities: box('.services .capabilities'),
      projectHeading: box('.projects .section-heading'),
      projects: box('.projects'),
      projectTail: box('.project-capabilities'),
      about: box('.about'),
      aboutHeading: box('.about .profile .section-heading'),
      contact: box('.contact'),
      contactGuidance: box('.contact-guidance'),
      back: box('[data-back-to-top]')
    },
    content,
    trigger: { left: trigger.left, right: trigger.right, top: trigger.top, bottom: trigger.bottom, width: trigger.width, height: trigger.height },
    glyph: { left: glyph.left, right: glyph.right, top: glyph.top, bottom: glyph.bottom, width: glyph.width, height: glyph.height },
    headerInner: { left: headerInner.left, right: headerInner.right },
    mainInert: main.inert,
    aboutBackground: getComputedStyle(document.querySelector('.about')).backgroundColor,
    canvasBackground: getComputedStyle(document.documentElement).backgroundColor,
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
    lineAccent: getComputedStyle(line).stroke,
    githubAccent: getComputedStyle(document.querySelector('.about a[href*=\"github.com\"]')).color
  };
};

const expectedDistance = (markers, y) => {
  if (y <= markers[0].scroll) return 0;
  if (y >= markers.at(-1).scroll) return markers.at(-1).distance;
  for (let i = 1; i < markers.length; i++) {
    const previous = markers[i - 1];
    const next = markers[i];
    if (y <= next.scroll) return previous.distance + (next.distance - previous.distance) * (y - previous.scroll) / (next.scroll - previous.scroll);
  }
  throw new Error('No milestone interval at scroll ' + y);
};

const collides = (point, box, halfStroke) =>
  point.x + halfStroke > box.left && point.x - halfStroke < box.right &&
  point.y + halfStroke > box.top && point.y - halfStroke < box.bottom;

const accentToRgb = (accent) => {
  const value = accent.replace('#', '');
  const full = value.length === 3 ? value.split('').map((digit) => digit + digit).join('') : value;
  const channels = [0, 2, 4].map((index) => Number.parseInt(full.slice(index, index + 2), 16));
  return 'rgb(' + channels.join(', ') + ')';
};

const markerByName = (state, name) => {
  const marker = state.markers.find((item) => item.name === name);
  assert.ok(marker, 'missing marker: ' + name);
  return marker;
};

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe'
  });
  try {
    for (const [locale, route] of routes) {
      for (const [width, height] of viewports) {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.waitForSelector('[data-continuous-line][data-ready]');
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(80);
        const state = await page.evaluate(inspect);
        const compact = width < 1024;
        const expectedRoute = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
        assert.deepEqual(errors, [], locale + ' ' + width + ': no page errors');
        assert.equal(state.overflow, 0, locale + ' ' + width + ': no horizontal overflow');
        assert.equal(state.route, expectedRoute, locale + ' ' + width + ': correct route family');
        assert.ok(state.pathLength > 0, locale + ' ' + width + ': non-empty path');
        assert.equal(state.markers.at(-1).scroll, state.maxScroll, locale + ' ' + width + ': end milestone remains reachable');
        assert.ok(state.markers.every((item, index, items) => index === 0 || (item.scroll > items[index - 1].scroll && item.distance > items[index - 1].distance)), locale + ' ' + width + ': milestones strictly increase');
        assert.ok(Math.abs(state.points.at(-1).x - state.end.x) < 0.1 && Math.abs(state.points.at(-1).y - state.end.y) < 0.1, locale + ' ' + width + ': end node matches SVG endpoint');

        if (compact) {
          const minInset = state.strokeWidth / 2 + 10;
          const inset = Math.max(minInset, Math.min(state.bounds.services.left - state.strokeWidth / 2 - 8, Math.max(minInset, state.bounds.services.left * 0.7)));
          const halfStroke = state.strokeWidth / 2;
          const leftEdgeAir = Math.min(...state.points.map((point) => point.x)) - halfStroke;
          const rightEdgeAir = width - Math.max(...state.points.map((point) => point.x)) - halfStroke;
          assert.ok(leftEdgeAir >= 9, locale + ' ' + width + ': line stroke has visible air from left viewport edge');
          assert.ok(rightEdgeAir >= 9, locale + ' ' + width + ': line stroke has visible air from right viewport edge');
          assert.ok(Math.abs(Math.min(...state.points.map((point) => point.x)) - inset) < 1, locale + ' ' + width + ': left corridor derives from responsive rail gutter');
          assert.ok(Math.abs(Math.max(...state.points.map((point) => point.x)) - (width - inset)) < 1, locale + ' ' + width + ': right corridor derives from responsive rail gutter');
          assert.ok(state.start.x === width - 34 && state.end.x === width - 34, locale + ' ' + width + ': approved endpoints are unchanged');
          assert.ok(state.startPulse.x - state.startPulse.r >= 8 && width - state.startPulse.x - state.startPulse.r >= 8, locale + ' ' + width + ': start pulse is not clipped');
          assert.ok(state.endPulse.x - state.endPulse.r >= 8 && width - state.endPulse.x - state.endPulse.r >= 8, locale + ' ' + width + ': end pulse is not clipped');
          if (width >= 360) {
            assert.ok(inset + halfStroke <= state.bounds.services.left - 7, locale + ' ' + width + ': left corridor clears content rail');
            assert.ok(width - inset - halfStroke >= state.bounds.services.right + 7, locale + ' ' + width + ': right corridor clears content rail');
          }

          const physicalIntervals = [
            ['services-transition', 'services-left'],
            ['services-exit', 'projects-entry'],
            ['projects-transition', 'about-entry'],
            ['contact-transition', 'contact-entry']
          ];
          const minimumTravel = width < 768 ? 180 : 300;
          for (const [from, to] of physicalIntervals) {
            const a = markerByName(state, from);
            const b = markerByName(state, to);
            assert.ok(b.scroll - a.scroll >= minimumTravel, locale + ' ' + width + ': physical horizontal scene has perceptible scroll travel (' + from + ' → ' + to + ')');
          }
          const intervals = state.markers.slice(1).map((item, index) => ({
            name: item.name,
            rate: (item.distance - state.markers[index].distance) / (item.scroll - state.markers[index].scroll)
          }));
          assert.ok(intervals.every((item) => item.rate < 2.5), locale + ' ' + width + ': no near-instant compact segment remains');
          const content = state.content;
          const collisions = state.points.filter((point) => content.some((box) => collides(point, box, halfStroke)));
          assert.equal(collisions.length, 0, locale + ' ' + width + ': compact route clears localized text and evidence');
          report.compactRhythm.push({
            locale, width,
            gutters: { left: +leftEdgeAir.toFixed(1), right: +rightEdgeAir.toFixed(1), contentClearance: +(state.bounds.services.left - inset - halfStroke).toFixed(1) },
            horizontalScroll: physicalIntervals.map(([from, to]) => ({
              from, to,
              px: +(markerByName(state, to).scroll - markerByName(state, from).scroll).toFixed(1),
              path: +(markerByName(state, to).distance - markerByName(state, from).distance).toFixed(1)
            })),
            maxSegmentRate: +Math.max(...intervals.map((item) => item.rate)).toFixed(2)
          });
        } else {
          const services = state.bounds.services;
          const stack = state.bounds.stack;
          const capabilities = state.bounds.capabilities;
          const landing = state.bounds.panels[1].title;
          const landingY = landing.top + (landing.bottom - landing.top) * 0.58;
          const lineLeft = Math.max(24, state.bounds.projects.left - 24);
          const nearLanding = state.horizontal.find((segment) =>
            Math.abs(segment.y - landingY) < 1 && Math.min(segment.x1, segment.x2) < lineLeft + 37 &&
            Math.max(segment.x1, segment.x2) > services.right - 20);
          assert.ok(nearLanding, locale + ' ' + width + ': long Services cross reaches left corridor at Landing Pages');
          const leftDrop = state.vertical.find((segment) =>
            Math.abs(segment.x - lineLeft) < 1 &&
            Math.min(segment.y1, segment.y2) < landing.bottom + 10 &&
            Math.max(segment.y1, segment.y2) > stack.bottom - 30);
          assert.ok(leftDrop, locale + ' ' + width + ': line descends outside left of stack past Rediseños');
          const approach = state.horizontal.find((segment) =>
            segment.x1 > lineLeft && Math.abs(segment.y - (stack.bottom + Math.min(24, Math.max(0, capabilities.top - stack.bottom) * 0.3))) < 1);
          assert.ok(approach, locale + ' ' + width + ': path approaches capabilities from below Rediseños');
          const textGutterX = Math.max(services.left + 28, capabilities.left - 36);
          const sideLeg = state.vertical.find((segment) => Math.abs(segment.x - textGutterX) < 1 &&
            Math.min(segment.y1, segment.y2) < capabilities.top + 1 &&
            Math.max(segment.y1, segment.y2) > capabilities.bottom - 1);
          assert.ok(sideLeg, locale + ' ' + width + ': capabilities are bordered vertically from a DOM-derived gutter');
          assert.ok(capabilities.left - (textGutterX + state.strokeWidth / 2) >= 24, locale + ' ' + width + ': line has comfortable air before capabilities text');
          const exit = state.horizontal.find((segment) => segment.y > capabilities.bottom + 8 && Math.min(segment.x1, segment.x2) <= lineLeft + 37 && Math.max(segment.x1, segment.x2) >= textGutterX - 37);
          assert.ok(exit, locale + ' ' + width + ': path turns left only after clearing capabilities');
          const panelText = state.content.filter((box) => box.selector !== '[data-service-panel] h3' && box.selector !== '[data-service-panel] p');
          const collisions = state.points.filter((point) => panelText.some((box) => collides(point, box, state.strokeWidth / 2)));
          assert.equal(collisions.length, 0, locale + ' ' + width + ': desktop line clears copy outside the intentionally layered cards');
          report.desktopServices.push({
            locale, width,
            landingHeadingY: +landingY.toFixed(1),
            leftCorridorX: +lineLeft.toFixed(1),
            stackBottom: +stack.bottom.toFixed(1),
            capabilities: { left: +capabilities.left.toFixed(1), top: +capabilities.top.toFixed(1), bottom: +capabilities.bottom.toFixed(1), lineX: +textGutterX.toFixed(1), gap: +(capabilities.left - textGutterX - state.strokeWidth / 2).toFixed(1) }
          });
        }
        report.cases.push({ locale, width, height, route: state.route, overflow: state.overflow, pathLength: Math.round(state.pathLength) });

        if (locale === 'es') {
          const shots = [];
          if (width === 390) shots.push(['mobile-390-services', 'services-left']);
          if ([360, 390, 430].includes(width)) shots.push(['mobile-' + width + '-contact', 'contact']);
          if ([1366, 1920, 2560].includes(width)) {
            shots.push(['desktop-' + width + '-landing-pages', 'landing-pages-turn']);
            shots.push(['desktop-' + width + '-redesigns-exit', 'redesigns-exit']);
            shots.push(['desktop-' + width + '-capabilities', 'capabilities-clear']);
          }
          for (const [name, markerName] of shots) {
            await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), markerByName(state, markerName).scroll);
            await page.waitForTimeout(600);
            const file = name + '.png';
            await page.screenshot({ path: path.join(evidenceDir, file) });
            report.screenshots.push(file);
          }
        }
        await page.close();
      }
    }

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(base, { waitUntil: 'networkidle' });
    await mobile.waitForSelector('[data-continuous-line][data-ready]');
    const originalRoute = await mobile.locator('[data-continuous-line]').getAttribute('data-route');
    await mobile.setViewportSize({ width: 844, height: 390 });
    await mobile.waitForFunction(() => document.querySelector('[data-continuous-line]').dataset.route === 'tablet');
    const landscape = await mobile.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, route: document.querySelector('[data-continuous-line]').dataset.route }));
    assert.equal(landscape.overflow, 0, 'orientation resize: no overflow');
    await mobile.setViewportSize({ width: 390, height: 844 });
    await mobile.waitForFunction(() => document.querySelector('[data-continuous-line]').dataset.route === 'mobile');
    await mobile.waitForTimeout(80);
    assert.equal(originalRoute, 'mobile');
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, 'orientation round trip: no overflow');
    report.resize = 'portrait → landscape/tablet → portrait; route and geometry rebuilt without overflow';
    await mobile.close();

    const reversal = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await reversal.goto(base, { waitUntil: 'networkidle' });
    await reversal.waitForSelector('[data-continuous-line][data-ready]');
    const reversalState = await reversal.evaluate(inspect);
    const from = markerByName(reversalState, 'services-left').scroll;
    const to = markerByName(reversalState, 'contact-entry').scroll;
    const positions = [from, from + (to - from) * 0.28, from + (to - from) * 0.7, to, from + (to - from) * 0.7, from + (to - from) * 0.28, from];
    const readings = [];
    for (const y of positions) {
      await reversal.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await reversal.waitForTimeout(70);
      readings.push(await reversal.evaluate(() => {
        const line = document.querySelector('[data-line-path]');
        const length = line.getTotalLength();
        const distance = length - Number(line.style.strokeDashoffset);
        const point = line.getPointAtLength(Math.max(0, Math.min(length, distance)));
        return { scroll: scrollY, drawn: distance, screenY: point.y - scrollY };
      }));
    }
    for (const reading of readings) assert.ok(Math.abs(reading.drawn - expectedDistance(reversalState.markers, reading.scroll)) < 4, 'compact progress matches path distance during forward/reverse scroll');
    assert.ok(readings[1].drawn < readings[2].drawn && readings[2].drawn < readings[3].drawn && readings[4].drawn < readings[3].drawn && readings[5].drawn < readings[4].drawn, 'same path reverses exactly on native scroll');
    assert.ok(Math.max(...readings.map((item) => item.screenY)) - Math.min(...readings.map((item) => item.screenY)) > 100, 'line head is not tied to a constant viewport Y');
    report.reversals.push({ viewport: '390x844', positions: readings.length, exactInterpolation: true, headScreenYSpan: Math.round(Math.max(...readings.map((item) => item.screenY)) - Math.min(...readings.map((item) => item.screenY))) });
    await reversal.close();

    const accessible = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await accessible.goto(base, { waitUntil: 'networkidle' });
    const target = await accessible.locator('.menu-trigger').boundingBox();
    const before = await accessible.locator('.menu-glyph').boundingBox();
    const headerRight = await accessible.locator('.header-inner').evaluate((element) => element.getBoundingClientRect().right);
    assert.ok(target.width >= 44 && target.height >= 44, 'menu trigger meets comfortable hit-target minimum');
    assert.ok(before.width === 16 && Math.abs(before.x + before.width - headerRight) < 1, 'menu glyph stays visually aligned with header');
    assert.ok(target.x + target.width - (before.x + before.width) >= 10, 'menu target adds usable right-side padding');
    await accessible.locator('.menu-trigger').click({ position: { x: target.width - 2, y: target.height / 2 } });
    await accessible.waitForSelector('.site-header[data-open]');
    await accessible.waitForTimeout(450);
    assert.equal(await accessible.locator('.menu-trigger').getAttribute('aria-expanded'), 'true');
    assert.equal(await accessible.locator('main').evaluate((element) => element.inert), true, 'background remains inert while modal is open');
    const closeTiming = accessible.evaluate(() => new Promise((resolve) => {
      const header = document.querySelector('.site-header');
      const state = { requestedAt: null };
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') state.requestedAt = performance.now();
      }, { once: true, capture: true });
      document.addEventListener('animationstart', (event) => {
        if (event.animationName !== 'menu-close') return;
        resolve({
          elapsed: performance.now() - state.requestedAt,
          delay: getComputedStyle(header).animationDelay,
          duration: getComputedStyle(header).animationDuration,
          closingAttribute: header.hasAttribute('data-closing'),
          backgroundInert: document.querySelector('main').inert,
          scrollLocked: getComputedStyle(document.documentElement).overflow === 'hidden'
        });
      }, { capture: true });
    }));
    await accessible.keyboard.press('Escape');
    const close = await closeTiming;
    assert.ok(close.elapsed <= 80, 'Escape starts close animation within the next few display frames');
    assert.ok(close.delay === '0s' || close.delay === '0s, 0s', 'close animation has no CSS delay');
    assert.equal(close.closingAttribute, true);
    assert.equal(close.backgroundInert, true, 'background remains inert through close animation');
    assert.equal(close.scrollLocked, true, 'scroll remains locked through close animation');
    await accessible.waitForFunction(() => !document.querySelector('.site-header').hasAttribute('data-open'), null, { timeout: 1200 });
    assert.equal(await accessible.locator('main').evaluate((element) => element.inert), false, 'background is released after close');
    assert.equal(await accessible.locator('.menu-trigger').getAttribute('aria-expanded'), 'false');
    assert.equal(await accessible.evaluate(() => document.activeElement === document.querySelector('.menu-trigger')), true, 'Escape restores focus');
    report.menu = {
      hitTarget: { width: +target.width.toFixed(1), height: +target.height.toFixed(1), addedRightPadding: +(target.x + target.width - (before.x + before.width)).toFixed(1) },
      closeLatencyMs: +close.elapsed.toFixed(1),
      animationDelay: close.delay,
      animationDuration: close.duration,
      inertAndScrollLockedThroughAnimation: close.backgroundInert && close.scrollLocked,
      focusRestored: true
    };
    await accessible.close();

    const themePage = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await themePage.goto(base, { waitUntil: 'networkidle' });
    const lightScene = await themePage.evaluate(() => getComputedStyle(document.querySelector('.about')).backgroundColor);
    await themePage.evaluate(() => { document.documentElement.dataset.theme = 'dark'; document.documentElement.dataset.accent = 'dark-blue'; });
    const darkScene = await themePage.evaluate(() => {
      const root = document.documentElement;
      const line = document.querySelector('[data-line-path]');
      const github = document.querySelector('.about a[href*=\"github.com\"]');
      return {
        scene: getComputedStyle(document.querySelector('.about')).backgroundColor,
        canvas: getComputedStyle(root).backgroundColor,
        accent: getComputedStyle(root).getPropertyValue('--accent').trim(),
        line: getComputedStyle(line).stroke,
        github: getComputedStyle(github).color
      };
    });
    assert.equal(lightScene, 'rgb(23, 24, 22)', 'Light Ramiro scene remains unchanged');
    assert.equal(darkScene.scene, 'rgb(16, 18, 15)', 'Dark Ramiro scene uses semantic deep-dark surface');
    assert.notEqual(darkScene.scene, darkScene.canvas, 'Dark Ramiro scene differs from global canvas');
    assert.equal(darkScene.line, accentToRgb(darkScene.accent), 'line keeps the selected accent');
    assert.equal(darkScene.github, darkScene.line, 'GitHub keeps the selected accent');
    report.darkScene = { light: lightScene, dark: darkScene };
    const aboutTop = await themePage.locator('.about').evaluate((element) => element.getBoundingClientRect().top + scrollY);
    const aboutHeight = await themePage.locator('.about').evaluate((element) => element.getBoundingClientRect().height);
    await themePage.evaluate(({ top, height }) => window.scrollTo({ top: top + height / 2 - innerHeight / 2, behavior: 'instant' }), { top: aboutTop, height: aboutHeight });
    await themePage.waitForTimeout(600);
    const darkScreenshot = 'dark-1366-ramiro.png';
    await themePage.screenshot({ path: path.join(evidenceDir, darkScreenshot) });
    report.screenshots.push(darkScreenshot);
    await themePage.close();

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await reduced.goto(base, { waitUntil: 'networkidle' });
    await reduced.waitForSelector('[data-continuous-line][data-ready]');
    report.reducedMotion = await reduced.evaluate(() => ({
      offset: Number(document.querySelector('[data-line-path]').style.strokeDashoffset),
      startPulse: getComputedStyle(document.querySelector('[data-line-start-pulse]')).animationName,
      endPulse: getComputedStyle(document.querySelector('[data-line-end-pulse]')).animationName
    }));
    assert.equal(report.reducedMotion.offset, 0, 'reduced motion keeps complete static line');
    assert.equal(report.reducedMotion.startPulse, 'none');
    assert.equal(report.reducedMotion.endPulse, 'none');
    await reduced.close();

    fs.writeFileSync(path.join(__dirname, 'h5-eighth-pass-results.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({
      cases: report.cases.length,
      compact: report.cases.filter((item) => item.width < 1024).length,
      desktop: report.cases.filter((item) => item.width >= 1024).length,
      reversals: report.reversals.length,
      resize: report.resize,
      menuCloseLatencyMs: report.menu.closeLatencyMs,
      reducedMotion: report.reducedMotion,
      screenshots: report.screenshots.length
    }));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
