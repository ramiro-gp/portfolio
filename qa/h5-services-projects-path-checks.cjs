const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const executablePath = 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const evidenceDir = path.join(__dirname, 'services-projects-path');
const resultsPath = path.join(__dirname, 'h5-services-projects-path-results.json');
const routes = [['es', '/'], ['en', '/en/'], ['pt', '/pt/'], ['fr', '/fr/'], ['ja', '/ja/']];
const viewports = [[1366, 768], [1920, 1080], [2560, 1440]];
const report = { cases: [], reversals: [], screenshots: [], reducedMotion: null };

fs.mkdirSync(evidenceDir, { recursive: true });

const inspect = () => {
  const absoluteBox = (element) => {
    const r = element.getBoundingClientRect();
    let revealOffsetY = 0;
    for (let current = element; current; current = current.parentElement) {
      if (!current.hasAttribute('data-reveal')) continue;
      const transform = getComputedStyle(current).transform;
      if (transform !== 'none') revealOffsetY += new DOMMatrixReadOnly(transform).m42;
    }
    return { left: r.left + scrollX, right: r.right + scrollX, top: r.top + scrollY - revealOffsetY, bottom: r.bottom + scrollY - revealOffsetY, width: r.width, height: r.height };
  };
  const svg = document.querySelector('[data-continuous-line]');
  const line = svg.querySelector('[data-line-path]');
  const milestones = JSON.parse(svg.dataset.milestones);
  const named = Object.fromEntries(milestones.map((item) => [item.name, item]));
  const length = line.getTotalLength();
  const pointAt = (distance) => {
    const p = line.getPointAtLength(distance);
    return { distance, x: p.x, y: p.y };
  };
  const redesigns = absoluteBox(document.querySelector('[data-service-panel]:last-child'));
  const capabilities = absoluteBox(document.querySelector('.services .capabilities'));
  const copyStart = absoluteBox(document.querySelector('.services .capabilities > p:first-child'));
  const projectSection = absoluteBox(document.querySelector('.projects'));
  const projectHeading = absoluteBox(document.querySelector('.projects .section-heading'));
  const halfStroke = parseFloat(getComputedStyle(line).strokeWidth) / 2;
  const transitionStart = named['redesigns-exit'].distance;
  const transitionEnd = named.projects.distance;
  const pathPoints = [];
  for (let distance = 0; distance < length; distance += 2) pathPoints.push(pointAt(distance));
  pathPoints.push(pointAt(length));
  const transitionPoints = pathPoints.filter((point) => point.distance >= transitionStart && point.distance <= transitionEnd);
  const projectPoints = pathPoints.filter((point) => point.distance >= transitionEnd && point.distance <= named['projects-exit'].distance);
  const textRects = [...document.querySelectorAll('.services .capabilities > p')].flatMap((paragraph) => {
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    return [...range.getClientRects()].map((r) => ({ left: r.left + scrollX, right: r.right + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY }));
  });
  const collisionPoints = transitionPoints.filter((point) => textRects.some((r) =>
    point.x + halfStroke > r.left && point.x - halfStroke < r.right &&
    point.y + halfStroke > r.top && point.y - halfStroke < r.bottom));
  const pointsBesideCopy = transitionPoints.filter((point) => point.y >= capabilities.top && point.y <= capabilities.bottom);
  return {
    lang: document.documentElement.lang,
    viewport: [innerWidth, innerHeight],
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    route: svg.dataset.route,
    path: line.getAttribute('d'),
    length,
    halfStroke,
    anchors: {
      redesigns,
      capabilities,
      copyStart,
      projectSection,
      projectHeading,
      projectLeftCorridorX: Math.max(24, projectSection.left - 24)
    },
    milestones,
    turns: {
      redesignsExit: pointAt(named['redesigns-exit'].distance),
      capabilitiesApproach: pointAt(named['capabilities-approach'].distance),
      capabilitiesClear: pointAt(named['capabilities-clear'].distance),
      projectsEntry: pointAt(named.projects.distance)
    },
    transitionSpan: Math.max(...transitionPoints.map((p) => p.x)) - Math.min(...transitionPoints.map((p) => p.x)),
    copyClearance: Math.min(...pointsBesideCopy.map((p) => copyStart.left - (p.x + halfStroke))),
    copyCollisionCount: collisionPoints.length,
    projectsSideDeviation: Math.max(...projectPoints.map((p) => Math.abs(p.x - Math.max(24, projectSection.left - 24))))
  };
};

async function openReadyPage(browser, locale, route, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport[0], height: viewport[1] } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForFunction(() => document.querySelector('[data-continuous-line]')?.dataset.ready !== undefined);
  await page.waitForTimeout(550);
  assert.deepEqual(errors, [], locale + ' ' + viewport[0] + ': no page errors');
  return page;
}

function assertTransition(state, locale, width) {
  const label = locale + ' ' + width;
  const { turns, anchors } = state;
  assert.equal(state.route, 'desktop', label + ': desktop builder is active');
  assert.equal(state.overflow, 0, label + ': no horizontal page overflow');
  assert.ok(turns.capabilitiesApproach.x > turns.redesignsExit.x + 50, label + ': below Rediseños the first transition advances right');
  assert.ok(turns.capabilitiesApproach.y > anchors.redesigns.bottom, label + ': the horizontal begins below the last service panel');
  assert.ok(anchors.copyStart.left - (turns.capabilitiesApproach.x + state.halfStroke) >= 16, label + ': approach turns down with air before the capabilities copy');
  assert.ok(state.copyClearance >= 16, label + ': the vertical corridor stays left of the full copy block');
  assert.equal(state.copyCollisionCount, 0, label + ': transition does not touch or cross capabilities text');
  assert.ok(turns.capabilitiesClear.x < turns.capabilitiesApproach.x - 50, label + ': after the copy the route turns left');
  assert.ok(turns.capabilitiesClear.y > anchors.capabilities.bottom, label + ': the left turn occurs after the complete capabilities block');
  assert.ok(Math.abs(turns.projectsEntry.x - anchors.projectLeftCorridorX) < 0.5, label + ': Projects begins on its existing left corridor');
  assert.ok(Math.abs(turns.projectsEntry.y - anchors.projectSection.top) < 0.5, label + ': Projects entry is anchored to the real section start');
  assert.ok(state.projectsSideDeviation < 0.5, label + ': the route descends by the left corridor throughout Projects');
  assert.ok(state.transitionSpan < width * 0.5, label + ': Services-to-Projects has no viewport-wide horizontal');
  assert.ok(state.milestones.every((item, index, items) => index === 0 ||
    (item.scroll > items[index - 1].scroll && item.distance > items[index - 1].distance)), label + ': milestones stay strictly ordered');
}

async function setScroll(page, top) {
  await page.evaluate((value) => window.scrollTo({ top: value, behavior: 'instant' }), top);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    for (const [locale, route] of routes) {
      for (const viewport of viewports) {
        const page = await openReadyPage(browser, locale, route, viewport);
        const state = await page.evaluate(inspect);
        assert.equal(state.lang, locale, locale + ': route language matches');
        assertTransition(state, locale, viewport[0]);
        report.cases.push({ locale, viewport, overflow: state.overflow, anchors: state.anchors, turns: state.turns, transitionSpan: +state.transitionSpan.toFixed(2), copyClearance: +state.copyClearance.toFixed(2), copyCollisionCount: state.copyCollisionCount, projectsSideDeviation: +state.projectsSideDeviation.toFixed(3), milestones: state.milestones.map(({ name }) => name) });

        if (locale === 'es') {
          const named = Object.fromEntries(state.milestones.map((item) => [item.name, item]));
          const captures = [
            ['capabilities-approach', 'services-to-copy'],
            ['capabilities-clear', 'copy-turns-left'],
            ['projects', 'projects-left-corridor']
          ];
          for (const [milestoneName, filenamePrefix] of captures) {
            const top = named[milestoneName].scroll;
            await setScroll(page, top);
            const filename = filenamePrefix + '-' + viewport[0] + 'x' + viewport[1] + '.png';
            await page.screenshot({ path: path.join(evidenceDir, filename), animations: 'disabled' });
            report.screenshots.push(filename);
          }

          const positions = ['redesigns-exit', 'capabilities-approach', 'capabilities-clear', 'projects']
            .map((name) => named[name].scroll);
          const down = new Map();
          for (const top of positions) {
            await setScroll(page, top);
            down.set(top, await page.locator('[data-line-path]').evaluate((line) => Number(line.style.strokeDashoffset)));
          }
          for (const top of [...positions].reverse()) {
            await setScroll(page, top);
            const upOffset = await page.locator('[data-line-path]').evaluate((line) => Number(line.style.strokeDashoffset));
            assert.ok(Math.abs(upOffset - down.get(top)) < 1.5, locale + ' ' + viewport[0] + ': reverse scroll retraces the same progress');
          }
          report.reversals.push({ viewport, samples: positions.length, symmetric: true });
        }
        await page.close();
      }
    }

    const reduced = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
    await reduced.goto(base, { waitUntil: 'networkidle' });
    await reduced.waitForSelector('[data-continuous-line][data-ready]');
    report.reducedMotion = await reduced.locator('[data-line-path]').evaluate((line) => ({
      offset: Number(line.style.strokeDashoffset),
      totalLength: line.getTotalLength(),
      dashArray: Number(line.style.strokeDasharray)
    }));
    assert.equal(report.reducedMotion.offset, 0, 'reduced motion keeps the full line static');
    assert.ok(Math.abs(report.reducedMotion.dashArray - report.reducedMotion.totalLength) < 0.1, 'reduced motion retains the complete path');
    await reduced.close();

    fs.writeFileSync(resultsPath, JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ cases: report.cases.length, viewports: viewports.length, locales: routes.length, reversals: report.reversals.length, screenshots: report.screenshots.length, reducedMotion: report.reducedMotion }));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
