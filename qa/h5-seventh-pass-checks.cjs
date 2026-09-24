const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const evidenceDir = path.join(__dirname, 'seventh-pass');
fs.mkdirSync(evidenceDir, { recursive: true });
const routes = [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']];
const viewports = [[360, 800], [390, 844], [430, 932], [768, 900], [900, 900], [1023, 768], [1024, 768], [1366, 768], [1920, 1080], [2560, 1440]];
const report = { cases: [], reversals: [], resize: null, reducedMotion: null, screenshots: [] };

const measure = () => {
  const rect = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const r = element.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY, width: r.width, height: r.height };
  };
  const layoutRect = (selector) => {
    const element = document.querySelector(selector);
    const r = element.getBoundingClientRect();
    let revealOffsetY = 0;
    for (let current = element; current; current = current.parentElement) {
      if (!current.hasAttribute('data-reveal')) continue;
      const transform = getComputedStyle(current).transform;
      if (transform !== 'none') revealOffsetY += new DOMMatrixReadOnly(transform).m42;
    }
    return { left: r.left, right: r.right, top: r.top + scrollY - revealOffsetY, bottom: r.bottom + scrollY - revealOffsetY, width: r.width, height: r.height };
  };
  const svg = document.querySelector('[data-continuous-line]');
  const line = svg.querySelector('[data-line-path]');
  const pathLength = line.getTotalLength();
  const points = [];
  for (let distance = 0; distance < pathLength; distance += 2) {
    const point = line.getPointAtLength(distance);
    points.push({ x: point.x, y: point.y });
  }
  const finish = line.getPointAtLength(pathLength);
  points.push({ x: finish.x, y: finish.y });
  const contentSelectors = [
    '.services .section-heading h2', '.services .section-intro > p', '[data-service-panel]', '.capabilities p',
    '.projects .section-heading h2', '.project-heading h3', '.project-status', '.project-text p',
    '.project-figures figure', '.project-capabilities',
    '.about .section-heading h2', '.about .professional-title', '.about .profile > p', '.profile-links',
    '.process h3', '.process-prose p', '.process-note',
    '.contact .section-heading h2', '.email', '.channel-label', '.phone', '.copy-icon', '.contact-guidance', '[data-back-to-top]'
  ];
  return {
    width: document.documentElement.clientWidth,
    height: innerHeight,
    route: svg.dataset.route,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    path: line.getAttribute('d'),
    pathLength,
    points,
    milestones: JSON.parse(svg.dataset.milestones),
    maxScroll: document.documentElement.scrollHeight - innerHeight,
    start: { x: Number(document.querySelector('[data-line-start-node]').getAttribute('cx')), y: Number(document.querySelector('[data-line-start-node]').getAttribute('cy')) },
    end: { x: Number(document.querySelector('[data-line-end-node]').getAttribute('cx')), y: Number(document.querySelector('[data-line-end-node]').getAttribute('cy')) },
    cue: rect('[data-line-start]'),
    sections: {
      services: rect('.services'), intro: layoutRect('.services .section-intro'), introCopy: rect('.services .section-intro > p'),
      firstPanel: rect('[data-service-panel]'), stack: rect('[data-service-stack]'), capabilities: layoutRect('.services .capabilities'),
      projectHeading: layoutRect('.projects .section-heading'), projectTail: layoutRect('.project-capabilities'), projects: rect('.projects'),
      about: rect('.about'), aboutHeading: layoutRect('.about .profile .section-heading'), aboutBody: rect('.about .profile > p'),
      process: rect('.about .process'), contact: rect('.contact'), contactHeading: layoutRect('.contact .section-heading'),
      back: rect('[data-back-to-top]')
    },
    corridors: {
      servicesLeft: Math.max(5.25, rect('.services').left * .24),
      servicesRight: Math.min(document.documentElement.clientWidth - 5.25, document.documentElement.clientWidth - Math.max(5.25, rect('.services').left * .24)),
      aboutInset: parseFloat(getComputedStyle(document.querySelector('.about')).paddingRight) || 0,
      aboutContentRight: rect('.about').right - (parseFloat(getComputedStyle(document.querySelector('.about')).paddingRight) || 0),
      contactTitleTop: layoutRect('.contact .section-heading').top
    },
    content: contentSelectors.flatMap((selector) => [...document.querySelectorAll(selector)].flatMap((element) => {
      const layoutOnly = selector === '[data-service-panel]' || selector === '.project-figures figure' || selector === '.copy-icon' || selector === '[data-back-to-top]';
      let rects = [];
      if (!layoutOnly && element.textContent.trim()) {
        const range = document.createRange();
        range.selectNodeContents(element);
        rects = [...range.getClientRects()];
      }
      if (!rects.length) rects = [element.getBoundingClientRect()];
      return rects.map((r) => ({ selector, left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY }));
    }))
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

const hasHorizontalRun = (points, y, x1, x2) => {
  const low = Math.min(x1, x2), high = Math.max(x1, x2);
  const onRun = points.filter((point) => Math.abs(point.y - y) <= 1.5 && point.x >= low - 1 && point.x <= high + 1);
  return onRun.length > 10 && Math.min(...onRun.map((point) => point.x)) <= low + 2 && Math.max(...onRun.map((point) => point.x)) >= high - 2;
};

const overlapsContent = (point, boxes, strokeHalf) => boxes.some((box) =>
  point.x + strokeHalf > box.left && point.x - strokeHalf < box.right &&
  point.y + strokeHalf > box.top && point.y - strokeHalf < box.bottom
);

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    for (const [locale, route] of routes) {
      for (const [width, height] of viewports) {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(base + route, { waitUntil: 'networkidle' });
        await page.waitForSelector('[data-continuous-line][data-ready]');
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
          for (const image of document.images) {
            image.loading = 'eager';
            try { await image.decode(); } catch {}
          }
        });
        await page.waitForTimeout(60);
        const state = await page.evaluate(measure);
        const compact = width < 1024;
        const strokeHalf = compact ? 4.25 : 8.5;
        const commands = state.path.replace(/[+-]?(?:\d*\.?\d+)(?:e[+-]?\d+)?/gi, '').replace(/[\s,]/g, '');
        assert.deepEqual(errors, [], locale + ' ' + width + ': no page errors');
        assert.equal(state.overflow, 0, locale + ' ' + width + ': no horizontal overflow');
        assert.equal(state.route, width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop');
        assert.match(commands, /^[MQHV]+$/, locale + ' ' + width + ': only orthogonal lines and rounded turns');
        assert.ok(state.pathLength > 0);
        for (let i = 1; i < state.milestones.length; i++) {
          assert.ok(state.milestones[i].scroll > state.milestones[i - 1].scroll, locale + ' ' + width + ': milestone scroll strictly ascends');
          assert.ok(state.milestones[i].distance > state.milestones[i - 1].distance, locale + ' ' + width + ': milestone path distance strictly ascends');
        }
        assert.equal(state.milestones.at(-1).scroll, state.maxScroll, locale + ' ' + width + ': final milestone is reachable at native scroll end');
        assert.ok(Math.abs(state.end.x - state.points.at(-1).x) < .1 && Math.abs(state.end.y - state.points.at(-1).y) < .1, locale + ' ' + width + ': endpoint node matches path');

        if (compact) {
          const leftX = state.corridors.servicesLeft, rightX = state.corridors.servicesRight;
          const gaps = {
            services: state.sections.firstPanel.top - state.sections.intro.bottom,
            projects: state.sections.projectHeading.top - state.sections.capabilities.bottom,
            about: state.sections.aboutHeading.top - state.sections.projectTail.bottom,
            contact: state.sections.contactHeading.top - state.sections.about.bottom
          };
          const turns = {
            services: state.sections.intro.bottom + gaps.services / 2,
            projects: state.sections.capabilities.bottom + gaps.projects / 2,
            about: state.sections.projectTail.bottom + gaps.about / 2,
            contact: state.sections.about.bottom + gaps.contact / 2
          };
          const radius = (gap) => Math.max(1, Math.min(22, gap * .22, (rightX - leftX) * .12));
          assert.ok(Math.abs(state.start.x - (width - 34)) < .1 && Math.abs(state.start.y - (state.cue.bottom + 28)) < 1, locale + ' ' + width + ': approved compact Hero start is unchanged');
          assert.ok(Math.abs(state.end.x - (width - 34)) < .1 && Math.abs(state.end.y - (state.sections.back.top - 36)) < 1, locale + ' ' + width + ': approved compact Contact endpoint is unchanged');
          assert.ok(Object.values(gaps).every((gap) => gap > 12), locale + ' ' + width + ': each directional transition has a real content gap');
          assert.ok(hasHorizontalRun(state.points, turns.services, leftX + radius(gaps.services), width - 34 - radius(gaps.services)), locale + ' ' + width + ': Services turns left in the intro/card gap');
          assert.ok(hasHorizontalRun(state.points, turns.projects, leftX + radius(gaps.projects), rightX - radius(gaps.projects)), locale + ' ' + width + ': Projects turns right before its heading');
          assert.ok(hasHorizontalRun(state.points, turns.about, leftX + radius(gaps.about), rightX - radius(gaps.about)), locale + ' ' + width + ': Ramiro turns left before his heading');
          assert.ok(hasHorizontalRun(state.points, turns.contact, leftX + radius(gaps.contact), rightX - radius(gaps.contact)), locale + ' ' + width + ': Contact turns right before its heading');
          for (const [name, y1, y2, x] of [
            ['Services', state.sections.firstPanel.top, state.sections.stack.bottom, leftX],
            ['Projects', state.sections.projectHeading.top, state.sections.projectTail.bottom, rightX],
            ['Ramiro', state.sections.aboutHeading.bottom, state.sections.about.bottom, leftX],
            ['Contact', state.sections.contactHeading.top, state.end.y, rightX]
          ]) {
            const leg = state.points.filter((point) => point.y >= y1 + 12 && point.y <= y2 - 12);
            assert.ok(leg.length > 10 && leg.every((point) => Math.abs(point.x - x) < .15), locale + ' ' + width + ': ' + name + ' uses its prescribed side corridor');
          }
          const collisions = state.points.filter((point) => overlapsContent(point, state.content, strokeHalf));
          assert.equal(collisions.length, 0, locale + ' ' + width + ': route and stroke clear compact copy, cards, screenshots and controls');
          report.cases.push({ locale, width, route: state.route, corridors: { leftX, rightX }, gaps, overflow: state.overflow, pathLength: Math.round(state.pathLength) });
          if (locale === 'es' && width === 390) {
            for (const [name, marker] of [['services', 'services-left'], ['projects', 'projects-entry'], ['about', 'about-entry'], ['contact', 'contact-entry']]) {
              const milestone = state.milestones.find((item) => item.name === marker);
              await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), milestone.scroll);
              await page.waitForTimeout(100);
              const file = name + '-compact-' + width + '.png';
              await page.screenshot({ path: path.join(evidenceDir, file) });
              report.screenshots.push(file);
            }
            const middle = state.milestones.find((item) => item.name === 'projects-entry');
            const last = state.milestones.find((item) => item.name === 'contact-entry');
            const scrolls = [middle.scroll, (middle.scroll + last.scroll) / 2, last.scroll, (middle.scroll + last.scroll) / 2, middle.scroll];
            const readings = [];
            for (const y of scrolls) {
              await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), y);
              await page.waitForTimeout(65);
              readings.push(await page.evaluate(() => {
                const line = document.querySelector('[data-line-path]');
                return { y: scrollY, drawn: line.getTotalLength() - Number(line.style.strokeDashoffset) };
              }));
            }
            for (const reading of readings) assert.ok(Math.abs(reading.drawn - expectedDistance(state.milestones, reading.y)) < 4, 'compact scroll position follows path length in both directions');
            assert.ok(readings[1].drawn > readings[0].drawn && readings[2].drawn > readings[1].drawn && readings[3].drawn < readings[2].drawn && readings[4].drawn < readings[3].drawn, 'compact route reverses exactly along the same path');
            report.reversals.push({ width, samples: readings.length, exactInterpolation: true });
          }
        } else {
          const about = state.sections.about;
          const contentRight = state.corridors.aboutContentRight;
          const inset = state.corridors.aboutInset;
          const aboutX = Math.min(width - 10, contentRight + Math.min(36, inset * .5));
          const contactX = (state.sections.back.left + state.sections.back.right) / 2;
          const contactTurnY = state.sections.contact.top + (state.corridors.contactTitleTop - state.sections.contact.top) * .38;
          assert.ok(Math.abs(state.start.x - ((state.cue.left + state.cue.right) / 2)) < 1, locale + ' ' + width + ': desktop Hero start remains centered');
          assert.ok(Math.abs(state.end.x - contactX) < 1, locale + ' ' + width + ': node centers over Back to top');
          assert.ok(Math.abs(state.end.y - (state.sections.back.top - 56)) < 1, locale + ' ' + width + ': node has approved vertical air above Back to top');
          assert.ok(Math.abs(state.points.at(-1).x - contactX) < 1);
          assert.ok(state.points.filter((point) => point.y >= state.sections.aboutHeading.bottom && point.y <= about.bottom - 10).every((point) => point.x >= aboutX - .2), locale + ' ' + width + ': Ramiro body stays in the right gutter');
          assert.ok(aboutX - contentRight >= 19, locale + ' ' + width + ': Ramiro content has visible clearance from the line');
          assert.ok(hasHorizontalRun(state.points, contactTurnY, contactX + 20, aboutX - 20), locale + ' ' + width + ': Contact makes its small left turn before descending over the control');
          const contactLeg = state.points.filter((point) => point.y >= contactTurnY + 24 && point.y <= state.end.y);
          assert.ok(contactLeg.length > 10 && contactLeg.every((point) => Math.abs(point.x - contactX) < .15), locale + ' ' + width + ': final Contact descent is centered on Back to top');
          const visibleContent = state.content.filter((box) => box.selector !== '[data-service-panel]');
          const collisionBoxes = visibleContent.map((box) => ({ selector: box.selector, points: state.points.filter((point) => overlapsContent(point, [box], strokeHalf)) })).filter((entry) => entry.points.length);
          assert.equal(collisionBoxes.length, 0, locale + ' ' + width + ': desktop route clears text and controls: ' + JSON.stringify(collisionBoxes.map(({ selector, points }) => ({ selector, count: points.length, first: points[0] }))));
          report.cases.push({ locale, width, route: state.route, aboutCorridor: aboutX, contentRight, contactCenter: contactX, nodeGap: state.sections.back.top - state.end.y, overflow: state.overflow, pathLength: Math.round(state.pathLength) });
          if (locale === 'es' && [1366, 1920, 2560].includes(width)) {
            await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), about.top + about.height / 2 - height / 2);
            await page.waitForTimeout(100);
            const aboutFile = 'ramiro-desktop-' + width + '.png';
            await page.screenshot({ path: path.join(evidenceDir, aboutFile) });
            report.screenshots.push(aboutFile);
            if (width === 1366) {
              await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
              await page.waitForTimeout(100);
              const contactFile = 'contact-desktop-' + width + '.png';
              await page.screenshot({ path: path.join(evidenceDir, contactFile) });
              report.screenshots.push(contactFile);
              assert.ok(await page.evaluate(() => Number(document.querySelector('[data-line-path]').style.strokeDashoffset) < 2), 'desktop endpoint is fully drawn at native scroll end');
              const atEnd = await page.evaluate(() => Number(document.querySelector('[data-line-path]').style.strokeDashoffset));
              await page.evaluate(() => scrollTo({ top: scrollY - 300, behavior: 'instant' }));
              await page.waitForTimeout(80);
              const reversed = await page.evaluate(() => Number(document.querySelector('[data-line-path]').style.strokeDashoffset));
              assert.ok(reversed > atEnd + 2, 'desktop scroll reverses the line');
              await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
              await page.waitForTimeout(80);
              assert.ok(await page.evaluate(() => Number(document.querySelector('[data-line-path]').style.strokeDashoffset) < 2), 'desktop scroll restores endpoint');
              report.reversals.push({ width, samples: 3, exactInterpolation: true });
            }
          }
        }
        await page.close();
      }
    }

    const resizing = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await resizing.goto(base, { waitUntil: 'networkidle' });
    await resizing.waitForSelector('[data-continuous-line][data-ready]');
    await resizing.setViewportSize({ width: 1366, height: 768 });
    await resizing.waitForFunction(() => document.querySelector('[data-continuous-line]').dataset.route === 'desktop');
    await resizing.setViewportSize({ width: 768, height: 900 });
    await resizing.waitForFunction(() => document.querySelector('[data-continuous-line]').dataset.route === 'tablet');
    report.resize = 'mobile → desktop → tablet: route and geometry rebuilt';
    await resizing.close();

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await reduced.goto(base, { waitUntil: 'networkidle' });
    await reduced.waitForSelector('[data-continuous-line][data-ready]');
    report.reducedMotion = await reduced.evaluate(() => ({
      offset: Number(document.querySelector('[data-line-path]').style.strokeDashoffset),
      startPulse: getComputedStyle(document.querySelector('[data-line-start-pulse]')).animationName,
      endPulse: getComputedStyle(document.querySelector('[data-line-end-pulse]')).animationName
    }));
    assert.equal(report.reducedMotion.offset, 0);
    assert.equal(report.reducedMotion.startPulse, 'none');
    assert.equal(report.reducedMotion.endPulse, 'none');
    await reduced.close();

    fs.writeFileSync(path.join(__dirname, 'h5-seventh-pass-results.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ cases: report.cases.length, compact: report.cases.filter((item) => item.width < 1024).length, desktop: report.cases.filter((item) => item.width >= 1024).length, reversals: report.reversals.length, resize: report.resize, reducedMotion: report.reducedMotion, screenshots: report.screenshots.length }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
