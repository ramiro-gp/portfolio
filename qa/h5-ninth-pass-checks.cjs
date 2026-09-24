const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const executablePath = 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const outputDir = path.join(__dirname, 'ninth-pass');
const routes = [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']];
const mobileViewports = [[320, 568], [360, 800], [390, 844], [430, 932], [768, 900], [900, 900], [1023, 768]];
const desktopViewports = [[1366, 768], [1920, 1080], [2560, 1440]];
const halfStroke = 8.5 / 2;
const report = {
  mobile: [],
  enlargedText: [],
  desktop: [],
  resize: [],
  reducedMotion: {},
  reversal: {},
  screenshots: []
};

fs.mkdirSync(outputDir, { recursive: true });

async function openReadyPage(browser, route, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport[0], height: viewport[1] } });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForFunction(() => document.querySelector('[data-continuous-line]')?.dataset.ready !== undefined);
  await page.waitForTimeout(550);
  return page;
}

async function pageMetrics(page) {
  return page.evaluate((strokeHalf) => {
    const rect = (element) => {
      const value = element.getBoundingClientRect();
      return {
        left: value.left + scrollX,
        right: value.right + scrollX,
        top: value.top + scrollY,
        bottom: value.bottom + scrollY,
        width: value.width,
        height: value.height
      };
    };
    const selectorRects = (selectors) => selectors.flatMap((selector) =>
      [...document.querySelectorAll(selector)].map((element) => ({ selector, ...rect(element) }))
    );
    const line = document.querySelector('[data-line-path]');
    const length = line.getTotalLength();
    const startNode = document.querySelector('[data-line-start-node]');
    const endNode = document.querySelector('[data-line-end-node]');
    const startX = Number(startNode.getAttribute('cx'));
    const endX = Number(endNode.getAttribute('cx'));
    const firstVerticalPoint = line.getPointAtLength(24);
    const finalVerticalPoint = line.getPointAtLength(length - 24);
    const boxes = selectorRects([
      '.projects .section-heading',
      '.projects .project-heading',
      '.projects .project-status',
      '.projects .project-text',
      '.projects .project-figures img',
      '.projects .project-capabilities',
      '.about .profile .section-heading',
      '.about .profile .professional-title',
      '.about .profile > p:not(.professional-title):not(.language-disclosure)',
      '.about .profile .language-disclosure',
      '.about .profile-links',
      '.about .process h3',
      '.about .process-prose p',
      '.about .process-note'
    ]);
    const collisions = [];
    for (let distance = 0; distance <= length; distance += 5) {
      const point = line.getPointAtLength(distance);
      if (boxes.some((box) =>
        point.x >= box.left - strokeHalf && point.x <= box.right + strokeHalf &&
        point.y >= box.top - strokeHalf && point.y <= box.bottom + strokeHalf
      )) {
        collisions.push({ x: +point.x.toFixed(2), y: +point.y.toFixed(2) });
        if (collisions.length >= 8) break;
      }
    }
    const section = (id) => {
      const element = document.getElementById(id);
      return { ...rect(element), minHeight: getComputedStyle(element).minHeight };
    };
    const back = rect(document.querySelector('[data-back-to-top]'));
    const compact = document.querySelector('[data-continuous-line]').dataset.route !== 'desktop';
    return {
      lang: document.documentElement.lang,
      viewport: [innerWidth, innerHeight],
      scrollWidth: document.documentElement.scrollWidth,
      route: document.querySelector('[data-continuous-line]').dataset.route,
      headerHeight: Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')),
      sections: Object.fromEntries(['inicio', 'servicios', 'proyectos', 'ramiro', 'contacto'].map((id) => [id, section(id)])),
      axis: {
        startX,
        endX,
        firstVerticalX: firstVerticalPoint.x,
        finalVerticalX: finalVerticalPoint.x,
        finalNodeY: Number(document.querySelector('[data-line-end-node]').getAttribute('cy')),
        expectedFinalY: back.top - (compact ? 36 : 56)
      },
      collisionCount: collisions.length,
      collisionSamples: collisions,
      milestones: JSON.parse(document.querySelector('[data-continuous-line]').dataset.milestones)
    };
  }, halfStroke);
}

function assertMobile(metrics, width, locale, enlarged) {
  const label = locale + ' ' + width + (enlarged ? ' text 200%' : '');
  assert.ok(metrics.scrollWidth <= width, label + ': no horizontal page overflow');
  assert.equal(metrics.route, width < 768 ? 'mobile' : 'tablet', label + ': compact route matches responsive breakpoint');
  assert.equal(metrics.collisionCount, 0, label + ': path clears Projects and Ramiro content');
  assert.ok(Math.abs(metrics.axis.startX - metrics.axis.endX) < 0.001, label + ': Hero/contact share one exact X axis');
  assert.ok(Math.abs(metrics.axis.startX - metrics.axis.firstVerticalX) < 0.001, label + ': first Hero segment uses shared axis');
  assert.ok(Math.abs(metrics.axis.startX - metrics.axis.finalVerticalX) < 0.001, label + ': final Contact segment uses shared axis');
  assert.ok(Math.abs(metrics.axis.finalNodeY - metrics.axis.expectedFinalY) < 0.5, label + ': endpoint remains anchored above Back to top');
  assert.ok(metrics.sections.inicio.height >= heightFor(width) - metrics.headerHeight - 1, label + ': Hero can fill first available scene');
  assert.ok(metrics.sections.ramiro.height >= heightFor(width) - 1, label + ': Ramiro has a flexible viewport minimum');
  assert.ok(metrics.sections.contacto.height >= heightFor(width) - 1, label + ': Contact has a flexible viewport minimum');
  assert.equal(metrics.sections.servicios.minHeight, '0px', label + ': Services remains natural height');
  assert.equal(metrics.sections.proyectos.minHeight, '0px', label + ': Projects remains natural height');
  assert.ok(metrics.milestones.length >= 8, label + ': structural milestones remain present');
  assert.ok(metrics.milestones.every((item, index, list) => index === 0 ||
    (item.scroll > list[index - 1].scroll && item.distance > list[index - 1].distance)),
  label + ': milestone scroll and SVG distance remain strictly increasing');
}

function heightFor(width) {
  return viewportByWidth.get(width);
}

const viewportByWidth = new Map([...mobileViewports, ...desktopViewports].map(([width, height]) => [width, height]));

async function closestPoint(page, x, y) {
  return page.evaluate(({ targetX, targetY }) => {
    const line = document.querySelector('[data-line-path]');
    const length = line.getTotalLength();
    let best = { distance: 0, x: 0, y: 0, error: Infinity };
    for (let distance = 0; distance <= length; distance += 2) {
      const point = line.getPointAtLength(distance);
      const error = (point.x - targetX) ** 2 + (point.y - targetY) ** 2;
      if (error < best.error) best = { distance, x: point.x, y: point.y, error };
    }
    const before = line.getPointAtLength(Math.max(0, best.distance - 4));
    const after = line.getPointAtLength(Math.min(length, best.distance + 4));
    return { ...best, before: { x: before.x, y: before.y }, after: { x: after.x, y: after.y } };
  }, { targetX: x, targetY: y });
}

async function capture(page, sectionId, filename, topOffset) {
  const top = await page.locator('#' + sectionId).evaluate((element) => element.getBoundingClientRect().top + scrollY);
  await page.evaluate((scrollTop) => window.scrollTo({ top: scrollTop, behavior: 'instant' }), Math.max(0, top - topOffset));
  await page.waitForTimeout(550);
  await page.screenshot({ path: path.join(outputDir, filename), animations: 'disabled' });
  report.screenshots.push(filename);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });

  for (const [locale, route] of routes) {
    for (const [width, height] of mobileViewports) {
      const page = await openReadyPage(browser, route, [width, height]);
      const metrics = await pageMetrics(page);
      metrics.locale = locale;
      metrics.width = width;
      assert.equal(metrics.lang, locale);
      assertMobile(metrics, width, locale, false);
      report.mobile.push({
        locale, viewport: [width, height], route: metrics.route,
        heights: Object.fromEntries(Object.entries(metrics.sections).map(([id, value]) => [id, +value.height.toFixed(1)])),
        axis: +metrics.axis.startX.toFixed(3)
      });
      if (locale === 'es' && width === 390) {
        await capture(page, 'inicio', 'mobile-390-hero.png', 0);
        await capture(page, 'proyectos', 'mobile-390-projects.png', 60);
        await capture(page, 'ramiro', 'mobile-390-ramiro.png', 60);
        await capture(page, 'contacto', 'mobile-390-contact.png', 60);
      }
      await page.close();
    }
  }

  for (const locale of ['es', 'pt', 'ja']) {
    const route = routes.find((item) => item[0] === locale)[1];
    for (const [width, height] of [[320, 568], [390, 844], [430, 932]]) {
      const page = await openReadyPage(browser, route, [width, height]);
      await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
      await page.waitForTimeout(550);
      const metrics = await pageMetrics(page);
      metrics.locale = locale;
      metrics.width = width;
      assertMobile(metrics, width, locale, true);
      report.enlargedText.push({
        locale, viewport: [width, height], scrollWidth: metrics.scrollWidth,
        heights: { hero: +metrics.sections.inicio.height.toFixed(1), ramiro: +metrics.sections.ramiro.height.toFixed(1), contact: +metrics.sections.contacto.height.toFixed(1) },
        axis: +metrics.axis.startX.toFixed(3)
      });
      await page.close();
    }
  }

  for (const [locale, route] of routes.filter(([code]) => ['es', 'pt', 'ja'].includes(code))) {
    for (const [width, height] of desktopViewports) {
      const page = await openReadyPage(browser, route, [width, height]);
      const layout = await page.evaluate(() => {
        const rect = (element) => {
          const value = element.getBoundingClientRect();
          return { left: value.left + scrollX, right: value.right + scrollX, top: value.top + scrollY, bottom: value.bottom + scrollY, width: value.width, height: value.height };
        };
        const projects = rect(document.querySelector('.projects'));
        const about = rect(document.querySelector('.about'));
        const aboutHeading = rect(document.querySelector('.about .profile .section-heading'));
        const contentRight = Math.max(
          rect(document.querySelector('.about .profile')).right,
          rect(document.querySelector('.about .process')).right
        );
        const aboutStyle = getComputedStyle(document.querySelector('.about'));
        const aboutInset = Number.parseFloat(aboutStyle.paddingRight) || 0;
        const aboutRightX = Math.min(innerWidth - 10, about.right - aboutInset + Math.min(36, aboutInset * .5));
        const projectLeftX = Math.max(24, projects.left - 24);
        const ramiroTurnY = about.top + Math.min(64, Math.max(36, (aboutHeading.top - about.top) * .35));
        return {
          projects, about, projectLeftX, contentRight, aboutRightX, ramiroTurnY,
          projectTextLeft: Math.min(...[...document.querySelectorAll('.projects .section-heading,.projects .project-heading,.projects .project-text,.projects .project-figures img,.projects .project-capabilities')].map((element) => rect(element).left))
        };
      });
      const pathLength = await page.locator('[data-line-path]').evaluate((element) => element.getTotalLength());
      const projectTurn = await closestPoint(page, (layout.projectLeftX + layout.aboutRightX) / 2, layout.projects.top);
      const ramiroTurn = await closestPoint(page, (layout.projectLeftX + layout.aboutRightX) / 2, layout.ramiroTurnY);
      assert.ok(projectTurn.error < 9, locale + ' ' + width + ': project transition crosses the measured top corridor');
      assert.ok(projectTurn.before.x > projectTurn.after.x, locale + ' ' + width + ': path explicitly turns LEFT before Projects');
      assert.ok(ramiroTurn.error < 9, locale + ' ' + width + ': Ramiro transition uses the measured free upper band');
      assert.ok(ramiroTurn.before.x < ramiroTurn.after.x, locale + ' ' + width + ': path explicitly turns RIGHT before Ramiro');
      const projectSamples = await Promise.all([.25, .5, .75].map(async (part) =>
        closestPoint(page, layout.projectLeftX, layout.projects.top + layout.projects.height * part)
      ));
      assert.ok(projectSamples.every((point) => Math.abs(point.x - layout.projectLeftX) < 1.5),
        locale + ' ' + width + ': line descends through the LEFT Projects corridor');
      const aboutSamples = await Promise.all([.3, .55, .8].map(async (part) =>
        closestPoint(page, layout.aboutRightX, layout.about.top + layout.about.height * part)
      ));
      assert.ok(aboutSamples.every((point) => Math.abs(point.x - layout.aboutRightX) < 1.5),
        locale + ' ' + width + ': line descends through the RIGHT exterior Ramiro corridor');
      assert.ok(layout.projectTextLeft - (layout.projectLeftX + halfStroke) >= 8,
        locale + ' ' + width + ': left Projects corridor has a clear content gutter');
      assert.ok(layout.aboutRightX - layout.contentRight - halfStroke >= 12,
        locale + ' ' + width + ': Ramiro corridor has comfortable clearance outside all content');
      const metrics = await pageMetrics(page);
      assert.ok(metrics.scrollWidth <= width, locale + ' ' + width + ': no horizontal overflow');
      assert.equal(metrics.collisionCount, 0, locale + ' ' + width + ': desktop path avoids Projects and Ramiro content');
      assert.ok(Math.abs(metrics.axis.finalNodeY - metrics.axis.expectedFinalY) < 0.5, locale + ' ' + width + ': Contact endpoint remains anchored');
      assert.ok(metrics.milestones.every((item, index, list) => index === 0 ||
        (item.scroll > list[index - 1].scroll && item.distance > list[index - 1].distance)),
      locale + ' ' + width + ': desktop milestones remain ordered and reversible');
      const projectMarker = metrics.milestones.find((item) => item.name === 'projects');
      const aboutMarker = metrics.milestones.find((item) => item.name === 'about');
      assert.ok(aboutMarker.scroll > projectMarker.scroll && aboutMarker.distance > projectMarker.distance,
        locale + ' ' + width + ': Proyectos→Ramiro retains positive scroll and path progress');
      report.desktop.push({
        locale, viewport: [width, height],
        leftProjectsX: +layout.projectLeftX.toFixed(1),
        rightRamiroX: +layout.aboutRightX.toFixed(1),
        contentClearance: +(layout.aboutRightX - layout.contentRight - halfStroke).toFixed(1),
        leftTurnAtProjects: true,
        rightTurnAtRamiro: true,
        transitionLength: +(aboutMarker.distance - projectMarker.distance).toFixed(1),
        transitionScroll: +(aboutMarker.scroll - projectMarker.scroll).toFixed(1),
        pathLength: +pathLength.toFixed(1)
      });
      if (locale === 'es') {
        await capture(page, 'proyectos', 'desktop-' + width + '-projects.png', 120);
        await capture(page, 'ramiro', 'desktop-' + width + '-ramiro.png', 120);
      }
      await page.close();
    }
  }

  const reversal = await openReadyPage(browser, '/', [390, 844]);
  const markers = await reversal.evaluate(() => JSON.parse(document.querySelector('[data-continuous-line]').dataset.milestones));
  const length = await reversal.locator('[data-line-path]').evaluate((element) => element.getTotalLength());
  const from = markers[0].scroll;
  const to = markers[markers.length - 1].scroll;
  const positions = [from, from + (to - from) * .3, from + (to - from) * .7, to, from + (to - from) * .7, from + (to - from) * .3, from];
  const drawn = [];
  for (const position of positions) {
    await reversal.evaluate((scrollTop) => window.scrollTo({ top: scrollTop, behavior: 'instant' }), position);
    await reversal.waitForTimeout(70);
    drawn.push(await reversal.locator('[data-line-path]').evaluate((element) =>
      element.getTotalLength() - Number(element.style.strokeDashoffset)
    ));
  }
  assert.ok(drawn[0] < drawn[1] && drawn[1] < drawn[2] && drawn[2] < drawn[3] &&
    Math.abs(drawn[2] - drawn[4]) < 4 && Math.abs(drawn[1] - drawn[5]) < 4 && Math.abs(drawn[0] - drawn[6]) < 4,
  'compact line progresses and reverses on the same native-scroll milestones');
  report.reversal = { viewport: '390x844', positions: positions.length, symmetric: true, pathLength: +length.toFixed(1) };
  await reversal.close();

  const resize = await openReadyPage(browser, '/', [390, 844]);
  for (const viewport of [[844, 390], [768, 900], [390, 844]]) {
    await resize.setViewportSize({ width: viewport[0], height: viewport[1] });
    await resize.waitForTimeout(250);
    const metrics = await pageMetrics(resize);
    assert.ok(metrics.scrollWidth <= viewport[0], 'resize/orientation ' + viewport.join('x') + ': no overflow');
    assert.ok(Math.abs(metrics.axis.startX - metrics.axis.finalVerticalX) < 0.001,
      'resize/orientation ' + viewport.join('x') + ': shared mobile/tablet axis rebuilt exactly');
    report.resize.push({ viewport, route: metrics.route, axis: +metrics.axis.startX.toFixed(3) });
  }
  await resize.close();

  const reduced = await openReadyPage(browser, '/', [390, 844]);
  await reduced.emulateMedia({ reducedMotion: 'reduce' });
  await reduced.waitForTimeout(80);
  const reducedState = await reduced.evaluate(() => ({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    offset: Number(document.querySelector('[data-line-path]').style.strokeDashoffset),
    endVisible: getComputedStyle(document.querySelector('[data-line-end-group]')).opacity,
    pulseDuration: getComputedStyle(document.querySelector('[data-line-end-pulse]')).animationDuration
  }));
  assert.equal(reducedState.matches, true);
  assert.equal(reducedState.offset, 0, 'reduced motion keeps the complete path static');
  assert.equal(reducedState.endVisible, '1');
  assert.ok(Number.parseFloat(reducedState.pulseDuration) <= .001, 'reduced motion suppresses the pulse');
  report.reducedMotion = reducedState;
  await reduced.close();

  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'h5-ninth-pass-results.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(JSON.stringify({
    mobile: report.mobile.length,
    enlargedText: report.enlargedText.length,
    desktop: report.desktop.length,
    screenshots: report.screenshots.length,
    resize: report.resize.length,
    reversal: report.reversal,
    reducedMotion: report.reducedMotion
  }));
})().catch((error) => {
  process.stderr.write(error.stack || String(error));
  process.exitCode = 1;
});
