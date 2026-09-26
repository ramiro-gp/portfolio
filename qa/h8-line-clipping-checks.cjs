const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = path.resolve(__dirname, '..');
const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const captures = path.join(__dirname, 'h8-line-clipping');
const h7SceneBaseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'h7-scene-results.json'), 'utf8'));
const executablePath = 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const locales = [
  { code: 'es', route: '/' }, { code: 'en', route: '/en/' },
  { code: 'pt', route: '/pt/' }, { code: 'fr', route: '/fr/' },
  { code: 'ja', route: '/ja/' },
];
const viewports = [[390, 844], [1440, 900]];
const accentColors = {
  'light-green': 'rgb(23, 104, 68)', 'light-blue': 'rgb(28, 87, 190)',
  'light-red': 'rgb(178, 59, 53)', 'light-violet': 'rgb(109, 66, 170)',
  'light-black': 'rgb(32, 36, 33)', 'dark-orange': 'rgb(255, 155, 88)',
  'dark-blue': 'rgb(120, 207, 252)', 'dark-fuchsia': 'rgb(245, 138, 205)',
  'dark-lime': 'rgb(196, 231, 115)', 'dark-white': 'rgb(241, 240, 236)',
};
const inverseWhite = 'rgb(241, 240, 236)';
const results = {
  date: new Date().toISOString(), base,
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  viewports: [], locales: [], appearance: [], baselineComparisons: [], reducedMotion: null,
  failures: [], consoleErrors: [], requestFailures: [], screenshots: [],
};
fs.mkdirSync(captures, { recursive: true });

function listen(page, caseId) {
  page.on('pageerror', error => results.consoleErrors.push({ case: caseId, type: 'pageerror', message: error.message }));
  page.on('console', message => { if (message.type() === 'error') results.consoleErrors.push({ case: caseId, type: 'console', message: message.text() }); });
  page.on('requestfailed', request => results.requestFailures.push({ case: caseId, url: request.url(), reason: request.failure()?.errorText }));
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelector('[data-continuous-line]')?.hasAttribute('data-ready'));
  await page.waitForTimeout(120);
}

async function scrollTo(page, y) {
  await page.evaluate(value => window.scrollTo({ top: value, behavior: 'instant' }), y);
  await page.waitForTimeout(520);
}

async function state(page) {
  return page.evaluate(() => {
    const svg = document.querySelector('[data-continuous-line]');
    const path = svg.querySelector('[data-line-path]');
    const inversePath = svg.querySelector('[data-line-inverse-path]');
    const inverseLayer = svg.querySelector('[data-line-inverse-layer]');
    const about = document.querySelector('#ramiro').getBoundingClientRect();
    const clip = svg.querySelector('[data-line-inverse-clip]');
    const readPairs = (baseSelector, inverseSelector) => {
      const baseNode = svg.querySelector(baseSelector);
      const inverseNode = svg.querySelector(inverseSelector);
      return ['cx', 'cy', 'r'].map(name => [baseNode.getAttribute(name), inverseNode.getAttribute(name)]);
    };
    return {
      theme: document.documentElement.dataset.theme,
      accent: document.documentElement.dataset.accent,
      language: document.documentElement.lang,
      scrollY,
      innerWidth,
      overflow: document.documentElement.scrollWidth - innerWidth,
      baseStroke: getComputedStyle(path).stroke,
      baseStrokeWidth: getComputedStyle(path).strokeWidth,
      inverseStroke: getComputedStyle(inversePath).stroke,
      inverseStrokeWidth: getComputedStyle(inversePath).strokeWidth,
      inverseDisplay: getComputedStyle(inverseLayer).display,
      samePath: path.getAttribute('d') === inversePath.getAttribute('d'),
      path: path.getAttribute('d'),
      dashArray: path.style.strokeDasharray,
      inverseDashArray: inversePath.style.strokeDasharray,
      dashOffset: path.style.strokeDashoffset,
      inverseDashOffset: inversePath.style.strokeDashoffset,
      milestones: JSON.parse(svg.dataset.milestones || '[]'),
      clip: ['x', 'y', 'width', 'height'].map(name => Number(clip.getAttribute(name))),
      about: [about.left, about.top + scrollY, about.width, about.height],
      nodes: [
        readPairs('[data-line-start-node]', '[data-line-inverse-start-node]'),
        readPairs('[data-line-start-pulse]', '[data-line-inverse-start-pulse]'),
        readPairs('[data-line-end-node]', '[data-line-inverse-end-node]'),
        readPairs('[data-line-end-pulse]', '[data-line-inverse-end-pulse]'),
      ],
      pulseAnimation: getComputedStyle(svg.querySelector('[data-line-inverse-start-pulse]')).animationName,
      github: getComputedStyle(document.querySelector('#ramiro a[href*="github.com"]')).color,
    };
  });
}

function assertState(current, expectedLanguage, expectedAccent = 'light-black') {
  assert.equal(current.language, expectedLanguage);
  assert.equal(current.theme, 'light');
  assert.equal(current.accent, expectedAccent);
  assert.equal(current.overflow, 0, 'no horizontal overflow');
  assert.equal(current.samePath, true, 'inverse rendering uses the exact base path d');
  assert.equal(current.baseStroke, accentColors[expectedAccent], 'base path remains accent-colored');
  assert.equal(current.inverseStroke, inverseWhite, 'inverse rendering is white');
  assert.equal(current.baseStrokeWidth, current.inverseStrokeWidth, 'both path paints use the same stroke width');
  assert.equal(current.dashArray, current.inverseDashArray, 'both path paints use the same dash length');
  assert.equal(current.dashOffset, current.inverseDashOffset, 'both path paints share scroll progress');
  assert.equal(current.inverseDisplay, 'inline', 'spatial white layer enabled only for Light + black');
  assert.deepEqual(current.clip.map(value => Math.round(value * 10) / 10), current.about.map(value => Math.round(value * 10) / 10), 'clip follows the actual Ramiro section bounds');
  for (const group of current.nodes) for (const pair of group) assert.equal(pair[0], pair[1], 'inverse node coordinates/radii match the base nodes');
  assertMilestoneStructure(current);
}

function assertMilestoneStructure(current) {
  const compact = current.innerWidth < 1024;
  const expected = compact
    ? ['hero', 'services-transition', 'services-left', 'inside-stack', 'services-text', 'services-exit', 'projects-entry', 'projects-content', 'projects-exit', 'projects-transition', 'about-entry', 'about-content', 'about-exit', 'contact-transition', 'contact-entry', 'contact']
    : ['hero', 'services-entry', 'landing-pages-approach', 'landing-pages-turn', 'redesigns-exit', 'capabilities-approach', 'capabilities-clear', 'projects', 'projects-exit', 'about', 'contact-entry', 'contact-turn', 'contact'];
  assert.deepEqual(current.milestones.map(item => item.name), expected, 'milestone names/order remain unchanged for this route');
  for (let i = 1; i < current.milestones.length; i++) {
    assert.ok(current.milestones[i].scroll > current.milestones[i - 1].scroll, 'milestone scroll order remains strictly increasing');
    assert.ok(current.milestones[i].distance >= current.milestones[i - 1].distance, 'milestone path distances remain ordered');
  }
}

function comparePathGeometry(actual, expected) {
  const numeric = /-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi;
  const actualValues = actual.match(numeric)?.map(Number) || [];
  const expectedValues = expected.match(numeric)?.map(Number) || [];
  assert.equal(actual.replace(numeric, '#'), expected.replace(numeric, '#'), 'SVG path command structure remains unchanged');
  assert.equal(actualValues.length, expectedValues.length, 'SVG path coordinate count remains unchanged');
  const maxDeltaPx = Math.max(0, ...actualValues.map((value, index) => Math.abs(value - expectedValues[index])));
  assert.ok(maxDeltaPx <= 0.01, `SVG path coordinates remain within 0.01 CSS px of the H7 baseline (max ${maxDeltaPx})`);
  return maxDeltaPx;
}

async function runViewport(browser, locale, width, height, screenshot) {
  const caseId = `${locale.code}-${width}`;
  const context = await browser.newContext({ viewport: { width, height } });
  try {
    const page = await context.newPage();
    listen(page, caseId);
    const response = await page.goto(base + locale.route, { waitUntil: 'load' });
    assert.equal(response.status(), 200, `${caseId} route loads`);
    await settle(page);
    await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; document.documentElement.dataset.accent = 'light-black'; });
    const box = await page.locator('#ramiro').evaluate(node => {
      const r = node.getBoundingClientRect();
      return { top: r.top + scrollY, bottom: r.bottom + scrollY };
    });
    const positions = [
      { name: 'before', y: Math.max(0, box.top - height - 2) },
      { name: 'projects-to-ramiro', y: Math.max(0, box.top - height * .4 + 12) },
      { name: 'ramiro-to-contact', y: Math.max(0, box.bottom - height * .45) },
    ];
    let stableGeometry;
    for (const position of positions) {
      await scrollTo(page, position.y);
      const current = await state(page);
      assertState(current, locale.code);
      if (!stableGeometry) {
        stableGeometry = { path: current.path, milestones: current.milestones };
        if (locale.code === 'es') {
          const previous = h7SceneBaseline.sceneAccent.find(item => item.case === `${width} Light+black`)?.dark?.geometry;
          assert.ok(previous, `H7 geometry baseline exists for ${width}px`);
          const maxDeltaPx = comparePathGeometry(current.path, previous);
          results.baselineComparisons.push({ case: caseId, source: 'qa/h7-scene-results.json', maxCoordinateDeltaPx: maxDeltaPx, tolerancePx: 0.01, commandStructureUnchanged: true });
        }
      }
      assert.equal(current.path, stableGeometry.path, 'path geometry stays fixed while scrolling');
      assert.deepEqual(current.milestones, stableGeometry.milestones, 'milestones stay fixed while scrolling');
      if (screenshot && locale.code === 'es') {
        const file = path.join(captures, `${locale.code}-${width}-${position.name}.png`);
        await page.screenshot({ path: file });
        results.screenshots.push({ file: path.relative(root, file), state: position.name, width, height, scrollY: current.scrollY });
      }
      results.viewports.push({ case: caseId, state: position.name, scrollY: current.scrollY, about: current.clip, lineWidth: current.baseStrokeWidth, pathLength: current.path.length, milestoneCount: current.milestones.length, milestoneNames: current.milestones.map(item => item.name) });
    }
    for (const position of [...positions].reverse()) {
      await scrollTo(page, position.y);
      const current = await state(page);
      assertState(current, locale.code);
      assert.equal(current.path, stableGeometry.path, 'reverse scroll preserves the path geometry');
      assert.deepEqual(current.milestones, stableGeometry.milestones, 'reverse scroll preserves milestones');
    }
    results.locales.push({ case: caseId, status: 'PASS', route: locale.route, states: positions.map(item => item.name), geometryStableOnReverseScroll: true });
  } finally { await context.close(); }
}

async function appearanceMatrix(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    listen(page, 'appearance-matrix');
    await page.goto(base + '/', { waitUntil: 'load' });
    await settle(page);
    await page.evaluate(() => scrollTo(0, document.querySelector('#ramiro').getBoundingClientRect().top + scrollY));
    await page.waitForTimeout(100);
    for (const [theme, accents] of [
      ['light', ['light-black', 'light-green', 'light-blue', 'light-red', 'light-violet']],
      ['dark', ['dark-orange', 'dark-blue', 'dark-fuchsia', 'dark-lime', 'dark-white']],
    ]) for (const accent of accents) {
      await page.evaluate(([nextTheme, nextAccent]) => {
        document.documentElement.dataset.theme = nextTheme;
        document.documentElement.dataset.accent = nextAccent;
      }, [theme, accent]);
      const current = await state(page);
      assert.equal(current.baseStroke, accentColors[accent], `${theme}/${accent} keeps its own line accent`);
      assert.equal(current.inverseDisplay, theme === 'light' && accent === 'light-black' ? 'inline' : 'none', `${theme}/${accent} spatial white override scope`);
      assert.equal(current.github, theme === 'light' && accent === 'light-black' ? inverseWhite : accentColors[accent], `${theme}/${accent} GitHub color scope`);
      results.appearance.push({ theme, accent, baseStroke: current.baseStroke, inverseDisplay: current.inverseDisplay, github: current.github, status: 'PASS' });
    }
    await page.locator('.menu-trigger').click();
    await page.locator('[data-theme-choice="light"]').click();
    await page.locator('[data-accent-choice="light-black"]').click();
    const selectedLightBlack = await state(page);
    assert.equal(selectedLightBlack.baseStroke, accentColors['light-black']);
    assert.equal(selectedLightBlack.inverseDisplay, 'inline');
    assert.equal(selectedLightBlack.github, inverseWhite);
    await page.locator('[data-theme-choice="dark"]').click();
    await page.locator('[data-accent-choice="dark-blue"]').click();
    const selectedDarkBlue = await state(page);
    assert.equal(selectedDarkBlue.baseStroke, accentColors['dark-blue']);
    assert.equal(selectedDarkBlue.inverseDisplay, 'none');
    assert.equal(selectedDarkBlue.github, accentColors['dark-blue']);
    results.appearanceControl = { lightBlack: selectedLightBlack.baseStroke, darkBlue: selectedDarkBlue.baseStroke, inverseOnlyForLightBlack: true, status: 'PASS' };
  } finally { await context.close(); }
}

async function resizeAndReducedMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    listen(page, 'resize');
    await page.goto(base + '/', { waitUntil: 'load' });
    await settle(page);
    const narrow = await state(page);
    assertMilestoneStructure(narrow);
    await page.setViewportSize({ width: 1440, height: 900 });
    await settle(page);
    const wide = await state(page);
    assertMilestoneStructure(wide);
    assert.equal(wide.innerWidth, 1440);
    assert.equal(wide.inverseStrokeWidth, wide.baseStrokeWidth);
    assert.equal(wide.samePath, true);
    assert.deepEqual(wide.clip.map(value => Math.round(value * 10) / 10), wide.about.map(value => Math.round(value * 10) / 10));
    await page.setViewportSize({ width: 390, height: 844 });
    await settle(page);
    const resizedBack = await state(page);
    assertMilestoneStructure(resizedBack);
    assert.equal(resizedBack.innerWidth, 390);
    assert.equal(resizedBack.samePath, true);
    assert.deepEqual(resizedBack.clip.map(value => Math.round(value * 10) / 10), resizedBack.about.map(value => Math.round(value * 10) / 10));
    results.viewports.push({ case: 'resize 390→1440→390', routeAfter: resizedBack.innerWidth, mobileStroke: narrow.baseStrokeWidth, desktopStroke: wide.baseStrokeWidth, clipRebuilt: true, status: 'PASS' });
  } finally { await context.close(); }

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  try {
    const page = await reducedContext.newPage();
    listen(page, 'reduced-motion');
    await page.goto(base + '/', { waitUntil: 'load' });
    await settle(page);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      document.documentElement.dataset.accent = 'light-black';
      scrollTo(0, document.querySelector('#ramiro').getBoundingClientRect().top + scrollY);
    });
    await page.waitForTimeout(100);
    const current = await state(page);
    assertState(current, 'es');
    assert.equal(current.pulseAnimation, 'none', 'reduced motion disables node pulse');
    assert.equal(current.dashOffset, '0', 'reduced motion preserves the static full path');
    assert.equal(current.inverseDashOffset, '0', 'reduced motion keeps both paints synchronized');
    results.reducedMotion = { pulseAnimation: current.pulseAnimation, dashOffset: current.dashOffset, inverseDashOffset: current.inverseDashOffset, spatialClipActive: current.inverseDisplay === 'inline', status: 'PASS' };
  } finally { await reducedContext.close(); }
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    for (const locale of locales) for (const [width, height] of viewports) await runViewport(browser, locale, width, height, true);
    await appearanceMatrix(browser);
    await resizeAndReducedMotion(browser);
  } catch (error) {
    results.failures.push({ message: error.stack || String(error) });
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(__dirname, 'h8-line-clipping-results.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify({
    status: results.failures.length || results.consoleErrors.length || results.requestFailures.length ? 'FAIL' : 'PASS',
    viewports: results.viewports.length, locales: results.locales.length, appearance: results.appearance.length,
    reducedMotion: results.reducedMotion?.status, screenshots: results.screenshots.length,
    consoleErrors: results.consoleErrors.length, requestFailures: results.requestFailures.length, failures: results.failures,
  }, null, 2));
  if (results.failures.length || results.consoleErrors.length || results.requestFailures.length) process.exitCode = 1;
})();
