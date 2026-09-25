const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const root = path.resolve(__dirname, '..');
const captures = path.join(__dirname, 'h7');
const phase = process.env.H7_PHASE || 'all';
const output = path.join(__dirname, phase === 'all' ? 'h7-results.json' : `h7-${phase}-results.json`);
const locales = [
  { code: 'es', route: '/' }, { code: 'en', route: '/en/' },
  { code: 'pt', route: '/pt/' }, { code: 'fr', route: '/fr/' },
  { code: 'ja', route: '/ja/' },
];
const viewports = [
  [320, 640], [390, 844], [640, 800], [768, 1024],
  [1024, 768], [1366, 768], [1440, 900], [1600, 900],
];
const ids = ['inicio', 'servicios', 'proyectos', 'ramiro', 'contacto'];
const accentColors = {
  'light-green': '#176844', 'light-blue': '#1c57be', 'light-red': '#b23b35', 'light-violet': '#6d42aa', 'light-black': '#202421',
  'dark-orange': '#ff9b58', 'dark-blue': '#78cffc', 'dark-fuchsia': '#f58acd', 'dark-lime': '#c4e773', 'dark-white': '#f1f0ec',
};
const results = {
  date: new Date().toISOString(), base,
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  responsive: [], zoom: [], variants: [], keyboard: [], touchSimulated: [], appearance: [], sceneAccent: [],
  seo: [], links: [], assets: [], browsers: [], notFound: null, knownExceptions: [], failures: [],
};
function relativeLuminance(color) {
  const numbers = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!numbers || numbers.length !== 3) throw new Error(`Unsupported color: ${color}`);
  const [r, g, b] = numbers.map(value => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return Number(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2));
}

function fail(area, caseId, error) {
  results.failures.push({ area, case: caseId, message: String(error?.message || error) });
}
async function run(area, caseId, fn) {
  try { await fn(); } catch (error) { fail(area, caseId, error); }
}
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
}
function listeners(page) {
  const errors = [];
  const failed = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => failed.push(`${r.method()} ${r.url()}: ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  return { errors, failed };
}
async function open(browser, route, width, height, options = {}) {
  const context = await browser.newContext({ viewport: { width, height }, ...options });
  const page = await context.newPage();
  if (options.javaScriptEnabled !== false) await page.addInitScript(() => {
    window.__h7Shifts = [];
    try {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__h7Shifts.push(entry.value);
      }).observe({ type: 'layout-shift', buffered: true });
    } catch { /* unsupported browser */ }
  });
  const network = listeners(page);
  const response = await page.goto(base + route, { waitUntil: 'load' });
  await settle(page);
  return { context, page, network, response };
}
async function matrix(browser) {
  for (const { code, route } of locales) for (const [width, height] of viewports) {
    const caseId = `${code} ${width}x${height}`;
    if (process.env.H7_CASE && process.env.H7_CASE !== caseId) continue;
    await run('responsive', caseId, async () => {
      const { context, page, network, response } = await open(browser, route, width, height);
      try {
        assert.equal(response.status(), 200);
        for (const id of ids) {
          const section = page.locator(`#${id}`);
          assert.equal(await section.count(), 1, `${id} exists`);
          await section.scrollIntoViewIfNeeded();
          await page.waitForTimeout(40);
        }
        await page.locator('#proyectos img').first().scrollIntoViewIfNeeded();
        const data = await page.evaluate(() => {
          const sections = [...document.querySelectorAll('main > section')];
          const images = [...document.querySelectorAll('#proyectos img')];
          return {
            lang: document.documentElement.lang,
            overflow: document.documentElement.scrollWidth - innerWidth,
            bodyOverflow: document.body.scrollWidth - innerWidth,
            h1: document.querySelectorAll('h1').length,
            sections: sections.map(s => ({ id: s.id, width: s.getBoundingClientRect().width, height: s.getBoundingClientRect().height })),
            projects: [...document.querySelectorAll('[data-project-case]')].map(n => n.dataset.projectCase),
            images: images.map(i => ({ src: i.getAttribute('src'), alt: i.alt, width: i.width, height: i.height })),
            footer: !!document.querySelector('footer'),
            line: !!document.querySelector('[data-line-path]')?.getAttribute('d'),
            text: document.body.innerText,
            cls: (window.__h7Shifts || []).reduce((sum, value) => sum + value, 0),
            targets: [...document.querySelectorAll('.menu-trigger,.accent-choice,.cta,.copy-icon,.back-to-top,.scroll-cue')].filter(n => {
              const closed = n.closest('details:not([open])');
              return n.getClientRects().length > 0 && (!closed || closed.querySelector(':scope > summary') === n);
            }).map(n => ({ name: n.className, width: n.getBoundingClientRect().width, height: n.getBoundingClientRect().height })),
          };
        });
        assert.equal(data.lang, code);
        assert.equal(data.h1, 1);
        assert.deepEqual(data.sections.map(s => s.id), ids);
        assert.deepEqual(data.projects, ['residencias', 'lingohive']);
        assert.equal(data.images.length, 4);
        assert.ok(data.images.every(i => i.alt && i.width > 0 && i.height > 0), 'images named and sized');
        assert.ok(data.sections.every(s => s.width > 0 && s.height > 0), 'sections laid out');
        assert.ok(data.footer && data.line, 'footer and line present');
        assert.ok(!/TODO_(?:CONTENT|ASSET|DECISION)/.test(data.text), 'no visible TODO');
        assert.ok(data.overflow <= 1 && data.bodyOverflow <= 1, `horizontal overflow ${data.overflow}/${data.bodyOverflow}`);
        const undersized = data.targets.filter(t => t.width < 24 || t.height < 24);
        assert.deepEqual(undersized, [], 'interactive targets at least 24x24px');
        if (data.cls > 0.1) fail('stability', caseId, `Local CLS ${data.cls.toFixed(3)} after scrolling exceeds 0.1`);
        assert.deepEqual(network.errors, [], 'console errors');
        assert.deepEqual(network.failed, [], 'failed requests');
        const record = { case: caseId, overflow: data.overflow, bodyOverflow: data.bodyOverflow, cls: data.cls, targets: data.targets, sections: data.sections, errors: network.errors, failed: network.failed };
        results.responsive.push(record);
        if ((code === 'es' && [320, 390, 768, 1440].includes(width)) || (code === 'ja' && [390, 1440].includes(width)) || (code === 'fr' && width === 1440)) {
          for (const [name, selector] of [['hero', '#inicio'], ['projects', '#proyectos'], ['contact', '#contacto']]) {
            await page.locator(selector).scrollIntoViewIfNeeded();
            await page.waitForTimeout(120);
            await page.screenshot({ path: path.join(captures, `${code}-${width}-${name}.png`) });
          }
        }
        await page.locator('.menu-trigger').click();
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.menu-bottom')).opacity === '1');
        const menu = await page.evaluate(() => {
          const panel = document.querySelector('.menu-panel');
          return {
            links: panel.querySelectorAll('[data-section-link]').length,
            width: panel.scrollWidth, clientWidth: panel.clientWidth,
            height: panel.scrollHeight, clientHeight: panel.clientHeight,
            accents: [...panel.querySelectorAll('[data-accent-choice]')].filter(n => getComputedStyle(n).display !== 'none').map(n => ({ width: n.getBoundingClientRect().width, height: n.getBoundingClientRect().height })),
          };
        });
        assert.equal(menu.links, 5);
        assert.ok(menu.width <= menu.clientWidth + 1, `menu horizontal overflow ${menu.width - menu.clientWidth}`);
        assert.ok(menu.accents.every(t => t.width >= 24 && t.height >= 24), `accent target too small: ${JSON.stringify(menu.accents)}`);
        await page.locator('[data-accent-choice]:visible').last().scrollIntoViewIfNeeded();
        record.menu = menu;
        if (width === 320 && ['es', 'ja'].includes(code)) {
          await page.screenshot({ path: path.join(captures, `${code}-320-menu-bottom.png`) });
        }
      } finally { await context.close(); }
    });
  }
}
async function variants(browser) {
  for (const { code, route } of locales) for (const width of [390, 1440]) {
    const caseId = `${code} ${width}`;
    await run('no-js', caseId, async () => {
      const { context, page, response } = await open(browser, route, width, 900, { javaScriptEnabled: false });
      try {
        assert.equal(response.status(), 200);
        const state = await page.evaluate(() => ({
          title: document.querySelector('h1')?.innerText,
          cases: document.querySelectorAll('[data-project-case]').length,
          email: document.querySelector('.email')?.getAttribute('href'),
          cta: document.querySelector('.cta')?.getAttribute('href'),
          menu: !!document.querySelector('details summary'),
          back: getComputedStyle(document.querySelector('[data-back-to-top]')).display,
        }));
        assert.ok(state.title?.trim());
        assert.equal(state.cases, 2);
        assert.match(state.email, /^mailto:/);
        assert.equal(state.cta, '#contacto');
        assert.ok(state.menu);
        await page.locator('#proyectos').scrollIntoViewIfNeeded();
        assert.ok(await page.locator('[data-project-case="lingohive"]').isVisible(), 'project visible without JS');
        if (width === 390 && ['es', 'ja'].includes(code)) await page.screenshot({ path: path.join(captures, `${code}-390-no-js-projects.png`) });
        await page.locator('details summary').click();
        assert.ok(await page.locator('[data-section-link]').first().isVisible());
        await page.locator('details summary').click();
        await page.locator('.cta').click();
        assert.equal(new URL(page.url()).hash, '#contacto');
        results.variants.push({ case: caseId, mode: 'no-js', state });
      } finally { await context.close(); }
    });
    await run('reduced-motion', caseId, async () => {
      const { context, page } = await open(browser, route, width, 900, { reducedMotion: 'reduce' });
      try {
        const state = await page.evaluate(() => ({
          word: document.querySelector('[data-word-current]')?.textContent,
          lineDash: getComputedStyle(document.querySelector('[data-line-path]')).strokeDashoffset,
          reveals: [...document.querySelectorAll('[data-reveal]')].every(n => getComputedStyle(n).opacity === '1'),
          cursorOpacity: getComputedStyle(document.querySelector('[data-cursor]')).opacity,
          cursorReady: document.documentElement.classList.contains('cursor-ready'),
        }));
        await page.waitForTimeout(800);
        assert.equal(await page.locator('[data-word-current]').textContent(), state.word, 'stable Hero word');
        assert.ok(state.reveals, 'content visible');
        assert.ok(['0', '0px'].includes(state.lineDash), 'full static line');
        assert.equal(state.cursorReady, false, 'custom cursor disabled');
        if (width === 390 && ['es', 'ja'].includes(code)) await page.screenshot({ path: path.join(captures, `${code}-390-reduced-hero.png`) });
        await page.locator('.menu-trigger').click();
        await page.keyboard.press('Escape');
        await page.waitForTimeout(50);
        assert.equal(await page.locator('[data-menu]').getAttribute('open'), null, 'menu closes immediately');
        results.variants.push({ case: caseId, mode: 'reduced-motion', state });
      } finally { await context.close(); }
    });
  }
}
async function textZoom(browser) {
  for (const { code, route } of locales) for (const width of [320, 390]) {
    const caseId = `${code} ${width} text 200%`;
    await run('text-zoom', caseId, async () => {
      const { context, page } = await open(browser, route, width, 844, { reducedMotion: 'reduce' });
      try {
        await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
        await page.waitForTimeout(100);
        const sections = [];
        for (const id of ids) {
          await page.locator(`#${id}`).scrollIntoViewIfNeeded();
          sections.push(id);
        }
        const state = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - innerWidth,
          text: document.querySelector('#contacto h2')?.textContent,
        }));
        assert.ok(state.overflow <= 1, `horizontal overflow ${state.overflow}`);
        assert.ok(state.text?.trim());
        results.zoom.push({ case: caseId, sections, ...state });
        if (code === 'ja' && width === 320) {
          await page.locator('#contacto').scrollIntoViewIfNeeded();
          await page.screenshot({ path: path.join(captures, 'ja-320-text-200-contact.png') });
        }
      } finally { await context.close(); }
    });
  }
}
async function keyboard(browser) {
  for (const { code, route } of locales) for (const width of [390, 1440]) {
    const caseId = `${code} ${width}`;
    await run('keyboard', caseId, async () => {
      const { context, page } = await open(browser, route, width, 900, { reducedMotion: 'reduce' });
      try {
        const trigger = page.locator('.menu-trigger');
        await trigger.focus();
        await page.keyboard.press('Enter');
        assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
        assert.equal(await page.locator('.site-header').getAttribute('aria-modal'), 'true');
        assert.equal(await page.locator('#main').getAttribute('inert'), '');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-section-link') !== null), true, 'Tab enters nav');
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('menu-trigger')), true, 'Shift+Tab returns trigger');
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('brand')), true, 'Shift+Tab reaches brand');
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-accent-choice') !== null), true, 'focus wraps');
        await page.locator('[data-theme-choice="dark"]').focus();
        await page.keyboard.press('Space');
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', 'theme keyboard selection');
        await page.locator('[data-accent-choice="dark-blue"]').focus();
        await page.keyboard.press('Space');
        assert.equal(await page.locator('html').getAttribute('data-accent'), 'dark-blue', 'accent keyboard selection');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(50);
        assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('menu-trigger')), true, 'focus restored');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        assert.equal(await page.locator('[data-menu]').getAttribute('open'), null);
        assert.equal(await page.evaluate(() => document.activeElement?.id), 'inicio', 'destination focused');
        await page.locator('.cta').focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        assert.equal(await page.evaluate(() => document.activeElement?.id), 'contacto');
        const destination = await page.evaluate(() => ({
          headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
          titleTop: document.querySelector('#contacto h2').getBoundingClientRect().top,
        }));
        assert.ok(destination.titleTop >= destination.headerBottom - 1, `Contact title hidden by header: ${JSON.stringify(destination)}`);
        const copy = page.locator('[data-copy]').first();
        await copy.focus();
        await page.keyboard.press('Space');
        await page.waitForTimeout(50);
        assert.ok((await page.locator('[data-copy-feedback]').textContent()).trim(), 'copy announces outcome');
        await page.locator('[data-back-to-top]').focus();
        await page.keyboard.press('Enter');
        await page.waitForTimeout(100);
        assert.equal(await page.evaluate(() => document.activeElement?.id), 'inicio', 'back to top destination focused');
        await trigger.focus();
        await page.keyboard.press('Enter');
        const next = locales[(locales.findIndex(item => item.code === code) + 1) % locales.length];
        await page.locator(`[data-language-link][href="${next.route}"]`).focus();
        await page.keyboard.press('Enter');
        await page.waitForURL(base + next.route);
        assert.equal(await page.locator('html').getAttribute('lang'), next.code, 'language navigation');
        results.keyboard.push({ case: caseId, pass: true });
      } finally { await context.close(); }
    });
  }
}
async function touch(browser) {
  for (const { code, route } of locales) for (const width of [390, 768]) {
    const caseId = `${code} ${width}`;
    await run('touch-simulated', caseId, async () => {
      const { context, page } = await open(browser, route, width, 900, { hasTouch: true, isMobile: width === 390 });
      try {
        await page.locator('.menu-trigger').tap();
        assert.equal(await page.locator('.menu-trigger').getAttribute('aria-expanded'), 'true');
        await page.locator('[data-theme-choice="dark"]').tap();
        assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
        await page.locator('[data-accent-choice="dark-blue"]').tap();
        assert.equal(await page.locator('html').getAttribute('data-accent'), 'dark-blue');
        await page.locator('[data-section-link][href="#contacto"]').tap();
        await page.waitForTimeout(500);
        assert.equal(await page.locator('[data-menu]').getAttribute('open'), null);
        assert.equal(await page.evaluate(() => document.activeElement?.id), 'contacto');
        const pointer = await page.evaluate(() => ({ fineHover: matchMedia('(pointer: fine) and (hover: hover)').matches, cursorReady: document.documentElement.classList.contains('cursor-ready'), cursorOpacity: getComputedStyle(document.querySelector('[data-cursor]')).opacity }));
        if (!pointer.fineHover) assert.equal(pointer.cursorReady, false, 'coarse touch has no custom cursor');
        results.touchSimulated.push({ case: caseId, pointer, pass: true });
      } finally { await context.close(); }
    });
  }
}
async function appearance(browser) {
  for (const { code, route } of [locales[0], locales[4]]) for (const width of [390, 1440])
    for (const [theme, accents] of [['light', ['light-green', 'light-blue', 'light-red', 'light-violet', 'light-black']], ['dark', ['dark-orange', 'dark-blue', 'dark-fuchsia', 'dark-lime', 'dark-white']]])
      for (const accent of accents) {
        const caseId = `${code} ${width} ${theme}/${accent}`;
        await run('appearance', caseId, async () => {
          const { context, page } = await open(browser, route, width, 900, { reducedMotion: 'reduce' });
          try {
            await page.locator('.menu-trigger').click();
            await page.waitForTimeout(50);
            const earlyMenu = await page.evaluate(() => ({
              firstLinkOpacity: getComputedStyle(document.querySelector('[data-section-link]')).opacity,
              bottomOpacity: getComputedStyle(document.querySelector('.menu-bottom')).opacity,
            }));
            if (code === 'es' && width === 390 && accent === 'light-green') {
              await page.screenshot({ path: path.join(captures, 'es-390-reduced-menu-early.png') });
            }
            await page.waitForTimeout(450);
            await page.locator(`[data-theme-choice="${theme}"]`).click();
            await page.locator(`[data-accent-choice="${accent}"]`).click();
            await page.waitForTimeout(100);
            if (code === 'es' && [390, 1440].includes(width) && ['light-green', 'light-black', 'dark-orange', 'dark-white'].includes(accent)) {
              await page.screenshot({ path: path.join(captures, `${code}-${width}-${accent}-menu.png`) });
            }
            await page.locator('.menu-trigger').click();
            await page.waitForFunction(() => !document.querySelector('[data-menu]').open);
            await page.locator('#ramiro').scrollIntoViewIfNeeded();
            await page.waitForFunction(() => document.documentElement.hasAttribute('data-ramiro-scene'));
            await page.waitForTimeout(240);
            const state = await page.evaluate(() => ({
              theme: document.documentElement.dataset.theme,
              accent: document.documentElement.dataset.accent,
              ramiroScene: document.documentElement.hasAttribute('data-ramiro-scene'),
              dot: getComputedStyle(document.querySelector('.brand-dot')).color,
              accentVariable: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
              line: getComputedStyle(document.querySelector('[data-line-path]')).stroke,
              focus: getComputedStyle(document.querySelector('.menu-trigger')).outlineColor,
              aboutBg: getComputedStyle(document.querySelector('#ramiro')).backgroundColor,
              github: getComputedStyle(document.querySelector('#ramiro a[href*="github.com"]')).color,
              rootBg: getComputedStyle(document.documentElement).backgroundColor,
              ctaBg: getComputedStyle(document.querySelector('.cta')).backgroundColor,
              ctaText: getComputedStyle(document.querySelector('.cta')).color,
              menuNavVisible: getComputedStyle(document.querySelector('[data-section-link]')).opacity,
            }));
            assert.equal(state.theme, theme);
            assert.equal(state.accent, accent);
            assert.equal(state.accentVariable.toLowerCase(), accentColors[accent], 'chosen accent applied in CSS');
            assert.equal(await page.locator(`[data-accent-choice="${accent}"]`).getAttribute('aria-pressed'), 'true');
            assert.equal(state.menuNavVisible, '1', 'menu content visible with reduced motion');
            const ratios = { githubOnAbout: contrast(state.github, state.aboutBg), ctaTextOnButton: contrast(state.ctaText, state.ctaBg) };
            results.appearance.push({ case: caseId, earlyMenu, ...state, ratios });
            if (earlyMenu.firstLinkOpacity !== '1' || earlyMenu.bottomOpacity !== '1') fail('reduced-motion-menu', caseId, `Menu not fully visible after 50ms: first link ${earlyMenu.firstLinkOpacity}, bottom ${earlyMenu.bottomOpacity}`);
            const expectedAccent = `rgb(${accentColors[accent].match(/[\da-f]{2}/gi).map(value => parseInt(value, 16)).join(', ')})`;
            const inverseWhite = 'rgb(241, 240, 236)';
            const blackSceneOverride = theme === 'light' && accent === 'light-black';
            assert.equal(state.ramiroScene, true, 'Ramiro scene state active while visible');
            assert.equal(state.line, blackSceneOverride ? inverseWhite : expectedAccent, 'line uses the selected accent except Light+black in Ramiro');
            assert.equal(state.github, blackSceneOverride ? inverseWhite : expectedAccent, 'GitHub uses the selected accent except Light+black in Ramiro');
            if (ratios.githubOnAbout < 4.5) {
              if (theme === 'light' && ['light-green', 'light-blue', 'light-red', 'light-violet'].includes(accent)) {
                results.knownExceptions.push({ id: 'H7-P2-01', case: caseId, githubOnAbout: ratios.githubOnAbout, status: 'accepted design exception; accent behavior preserved per Ramiro instruction' });
              } else fail('contrast', caseId, `GitHub link contrast ${ratios.githubOnAbout}:1 on Ramiro scene (<4.5:1)`);
            }
            if (ratios.ctaTextOnButton < 4.5) fail('contrast', caseId, `Hero CTA contrast ${ratios.ctaTextOnButton}:1 (<4.5:1)`);
            if (code === 'es' && width === 390 && theme === 'light' && ['light-green', 'light-black'].includes(accent)) {
              await page.screenshot({ path: path.join(captures, `es-390-${accent}-github-contrast.png`) });
            }
          } finally { await context.close(); }
        });
      }
}

async function sceneAccent(browser) {
  const lightAccents = ['light-green', 'light-blue', 'light-red', 'light-violet'];
  for (const [width, height] of [[390, 844], [1440, 900]]) await run('scene-accent', `${width} Light+black`, async () => {
    const { context, page } = await open(browser, '/', width, height);
    try {
      await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; document.documentElement.dataset.accent = 'light-black'; });
      await page.waitForTimeout(240);
      await page.waitForFunction(() => !document.documentElement.hasAttribute('data-ramiro-scene'));
      const start = await page.locator('#ramiro').evaluate(node => node.getBoundingClientRect().top + scrollY);
      await page.evaluate(y => scrollTo(0, Math.max(0, y - innerHeight - 2)), start);
      await page.waitForTimeout(240);
      assert.equal(await page.evaluate(() => document.documentElement.hasAttribute('data-ramiro-scene')), false, 'outside before entering Ramiro');
      const before = await page.evaluate(() => {
        const path = document.querySelector('[data-line-path]');
        return { d: path.getAttribute('d'), stroke: getComputedStyle(path).stroke, width: getComputedStyle(path).strokeWidth, transition: getComputedStyle(path).transitionDuration };
      });
      assert.equal(before.stroke, 'rgb(32, 36, 33)', 'black accent outside Ramiro');
      assert.equal(before.transition, '0.18s', 'only Light+black has a short scene transition');
      await page.evaluate(() => {
        const line = document.querySelector('[data-line-path]');
        window.__h7StrokeTransitions = [];
        line.addEventListener('transitionrun', event => { if (event.propertyName === 'stroke') window.__h7StrokeTransitions.push('run:stroke'); });
        line.addEventListener('transitionend', event => { if (event.propertyName === 'stroke') window.__h7StrokeTransitions.push('end:stroke'); });
      });
      await page.evaluate(y => scrollTo(0, Math.max(0, y - innerHeight + 2)), start);
      await page.waitForFunction(() => document.documentElement.hasAttribute('data-ramiro-scene'));
      await page.waitForFunction(() => window.__h7StrokeTransitions?.includes('run:stroke'));
      const entering = await page.evaluate(() => ({
        stroke: getComputedStyle(document.querySelector('[data-line-path]')).stroke,
        transition: getComputedStyle(document.querySelector('[data-line-path]')).transitionDuration,
      }));
      assert.equal(entering.transition, '0.18s');
      await page.waitForTimeout(240);
      await page.waitForFunction(() => window.__h7StrokeTransitions?.includes('end:stroke'));
      const inside = await page.evaluate(() => ({
        d: document.querySelector('[data-line-path]').getAttribute('d'),
        stroke: getComputedStyle(document.querySelector('[data-line-path]')).stroke,
        width: getComputedStyle(document.querySelector('[data-line-path]')).strokeWidth,
        github: getComputedStyle(document.querySelector('#ramiro a[href*="github.com"]')).color,
        background: getComputedStyle(document.querySelector('#ramiro')).backgroundColor,
      }));
      assert.equal(inside.stroke, 'rgb(241, 240, 236)', 'line white inside Ramiro');
      assert.equal(inside.github, 'rgb(241, 240, 236)', 'GitHub white inside Ramiro');
      assert.ok(contrast(inside.github, inside.background) >= 4.5, 'GitHub contrast meets AA');
      assert.equal(inside.d, before.d, 'path geometry unchanged in Ramiro');
      assert.equal(inside.width, before.width, 'line width unchanged');
      const github = page.locator('#ramiro a[href*="github.com"]');
      await github.hover();
      assert.equal(await github.evaluate(node => getComputedStyle(node).color), 'rgb(241, 240, 236)', 'hover keeps white GitHub text');
      await github.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      const focus = await github.evaluate(node => ({ visible: node.matches(':focus-visible'), text: getComputedStyle(node).color, outline: getComputedStyle(node).outlineColor }));
      assert.equal(focus.visible, true, 'keyboard focus visible on GitHub');
      assert.equal(focus.text, 'rgb(241, 240, 236)');
      assert.equal(focus.outline, 'rgb(241, 240, 236)', 'focus outline white');
      await github.scrollIntoViewIfNeeded();
      await page.evaluate(delta => scrollBy(0, -delta), width < 768 ? 220 : 120);
      await page.waitForTimeout(240);
      if (width === 390) await page.screenshot({ path: path.join(captures, 'es-390-light-black-ramiro.png') });
      if (width === 1440) await page.screenshot({ path: path.join(captures, 'es-1440-light-black-ramiro.png') });

      const unchangedAccents = [];
      for (const accent of lightAccents) {
        await page.evaluate(value => { document.documentElement.dataset.theme = 'light'; document.documentElement.dataset.accent = value; }, accent);
        await page.waitForTimeout(220);
        const state = await page.evaluate(() => ({
          accent: document.documentElement.dataset.accent,
          line: getComputedStyle(document.querySelector('[data-line-path]')).stroke,
          github: getComputedStyle(document.querySelector('#ramiro a[href*="github.com"]')).color,
          cssAccent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
          geometry: document.querySelector('[data-line-path]').getAttribute('d'),
        }));
        const rgb = `rgb(${accentColors[accent].match(/[\da-f]{2}/gi).map(value => parseInt(value, 16)).join(', ')})`;
        assert.equal(state.accent, accent);
        assert.equal(state.line, rgb, `${accent} line unchanged inside Ramiro`);
        assert.equal(state.github, rgb, `${accent} GitHub unchanged inside Ramiro`);
        assert.equal(state.cssAccent, accentColors[accent]);
        assert.equal(state.geometry, before.d, `${accent} geometry unchanged`);
        unchangedAccents.push({ accent, line: state.line, github: state.github });
      }
      await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; document.documentElement.dataset.accent = 'dark-blue'; });
      await page.waitForTimeout(220);
      const dark = await page.evaluate(() => ({
        line: getComputedStyle(document.querySelector('[data-line-path]')).stroke,
        github: getComputedStyle(document.querySelector('#ramiro a[href*="github.com"]')).color,
        scene: document.documentElement.hasAttribute('data-ramiro-scene'),
        geometry: document.querySelector('[data-line-path]').getAttribute('d'),
      }));
      assert.equal(dark.scene, true);
      assert.equal(dark.line, 'rgb(120, 207, 252)', 'Dark line remains accent');
      assert.equal(dark.github, 'rgb(120, 207, 252)', 'Dark GitHub remains accent');
      assert.equal(dark.geometry, before.d, 'Dark geometry unchanged');

      await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; document.documentElement.dataset.accent = 'light-black'; });
      await page.waitForTimeout(240);
      assert.equal(await page.locator('[data-line-path]').evaluate(node => getComputedStyle(node).stroke), 'rgb(241, 240, 236)', 'line remains white before leaving Ramiro');
      const transitionsBeforeExit = await page.evaluate(() => window.__h7StrokeTransitions.filter(event => event === 'run:stroke').length);
      const end = await page.locator('#ramiro').evaluate(node => node.getBoundingClientRect().bottom + scrollY);
      await page.evaluate(y => scrollTo(0, y + 2), end);
      await page.waitForFunction(() => !document.documentElement.hasAttribute('data-ramiro-scene'));
      await page.waitForFunction(count => window.__h7StrokeTransitions?.filter(event => event === 'run:stroke').length >= count + 1, transitionsBeforeExit);
      const exiting = await page.locator('[data-line-path]').evaluate(node => ({ stroke: getComputedStyle(node).stroke, transition: getComputedStyle(node).transitionDuration }));
      assert.equal(exiting.transition, '0.18s');
      await page.waitForTimeout(240);
      await page.waitForFunction(count => window.__h7StrokeTransitions?.filter(event => event === 'end:stroke').length >= count + 1, transitionsBeforeExit);
      const outside = await page.evaluate(() => ({
        stroke: getComputedStyle(document.querySelector('[data-line-path]')).stroke,
        geometry: document.querySelector('[data-line-path]').getAttribute('d'),
      }));
      assert.equal(outside.stroke, 'rgb(32, 36, 33)', 'line returns to black outside Ramiro');
      assert.equal(outside.geometry, before.d, 'path geometry unchanged after exit');
      const transitionEvents = await page.evaluate(() => window.__h7StrokeTransitions);
      results.sceneAccent.push({ case: `${width} Light+black`, transition: { entering, inside: inside.stroke, exiting, outside: outside.stroke, events: transitionEvents }, github: { inside: inside.github, contrast: contrast(inside.github, inside.background), hover: 'white', focus }, unchangedAccents, dark, geometryUnchanged: true, pass: true });
    } finally { await context.close(); }
  });

  for (const [width, height] of [[390, 844], [1440, 900]]) {
    const { context, page } = await open(browser, '/', width, height, { reducedMotion: 'reduce' });
    try {
      await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; document.documentElement.dataset.accent = 'light-black'; });
      await page.locator('#ramiro').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.documentElement.hasAttribute('data-ramiro-scene'));
      const reduced = await page.evaluate(() => ({
        stroke: getComputedStyle(document.querySelector('[data-line-path]')).stroke,
        transition: getComputedStyle(document.querySelector('[data-line-path]')).transitionProperty,
        github: getComputedStyle(document.querySelector('#ramiro a[href*="github.com"]')).color,
        geometry: document.querySelector('[data-line-path]').getAttribute('d'),
      }));
      assert.equal(reduced.stroke, 'rgb(241, 240, 236)', 'reduced-motion line is white inside Ramiro');
      assert.equal(reduced.transition, 'none', 'reduced motion disables color transition');
      assert.equal(reduced.github, 'rgb(241, 240, 236)');
      results.sceneAccent.push({ case: `${width} Light+black reduced motion`, ...reduced, pass: true });
    } finally { await context.close(); }
  }
}
async function seoAndLinks(browser) {
  for (const { code, route } of locales) await run('seo-links', code, async () => {
    const { context, page } = await open(browser, route, 1440, 900);
    try {
      const data = await page.evaluate(() => {
        const meta = key => document.querySelector(`meta[property="${key}"],meta[name="${key}"]`)?.content;
        return {
          title: document.title, description: meta('description'), lang: document.documentElement.lang,
          canonical: document.querySelector('link[rel="canonical"]')?.href,
          alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(n => [n.hreflang, n.href]),
          jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(n => JSON.parse(n.textContent)),
          og: { url: meta('og:url'), title: meta('og:title'), description: meta('og:description'), image: meta('og:image'), alt: meta('og:image:alt') },
          twitter: { card: meta('twitter:card'), title: meta('twitter:title'), description: meta('twitter:description'), image: meta('twitter:image'), alt: meta('twitter:image:alt') },
          links: [...document.querySelectorAll('a[href]')].map(a => ({ text: a.innerText.trim() || a.getAttribute('aria-label'), href: a.getAttribute('href'), target: a.target, rel: a.rel })),
          headings: [...document.querySelectorAll('h1,h2,h3')].map(n => ({ level: n.tagName, text: n.innerText.trim() })),
          images: [...document.querySelectorAll('img')].map(n => ({ alt: n.alt, src: n.getAttribute('src') })),
        };
      });
      assert.equal(data.lang, code);
      assert.equal(data.canonical, `https://ramita.dev${route}`);
      assert.ok(data.title && data.description);
      assert.equal(data.alternates.length, 6);
      assert.ok(data.alternates.some(([lang, href]) => lang === 'x-default' && href === 'https://ramita.dev/'));
      assert.equal(data.jsonLd[0]['@type'], 'Person');
      assert.equal(data.og.url, data.canonical);
      assert.equal(data.og.image, data.twitter.image);
      assert.ok(data.og.image.endsWith(`/social/ramita-${code}.png`));
      assert.ok(data.og.alt && data.twitter.alt);
      assert.ok(data.images.every(i => i.alt));
      assert.equal(data.headings.filter(h => h.level === 'H1').length, 1);
      assert.equal(data.headings.filter(h => h.level === 'H2').length, 4);
      assert.equal(data.headings.filter(h => h.level === 'H3').length, 6);
      let previousLevel = 0;
      for (const heading of data.headings) {
        const level = Number(heading.level.slice(1));
        assert.ok(heading.text && level <= previousLevel + 1, `heading order ${heading.level}: ${heading.text}`);
        previousLevel = level;
      }
      for (const link of data.links) {
        assert.ok(link.href && link.href !== '#', `empty link ${link.text}`);
        const url = new URL(link.href, base + route);
        assert.ok(['http:', 'https:', 'mailto:'].includes(url.protocol), `bad protocol ${link.href}`);
        if (link.href.startsWith('#')) assert.ok(ids.includes(link.href.slice(1)) || link.href === '#main', `bad anchor ${link.href}`);
        if (link.target === '_blank') assert.ok(link.rel.includes('noopener') && link.rel.includes('noreferrer'), `unsafe external link ${link.href}`);
      }
      results.seo.push({ code, ...Object.fromEntries(Object.entries(data).filter(([k]) => !['links', 'headings', 'images'].includes(k))) });
      results.links.push({ code, links: data.links });
    } finally { await context.close(); }
  });
  for (const asset of ['/favicon.ico', '/favicon.svg', '/apple-touch-icon.png', '/robots.txt', '/sitemap.xml',
    ...locales.map(l => `/social/ramita-${l.code}.png`),
    ...['residencias', 'lingohive'].flatMap(n => [`/images/${n}-desktop.webp`, `/images/${n}-mobile.webp`])]) {
    await run('asset', asset, async () => {
      const response = await fetch(base + asset);
      assert.equal(response.status, 200, asset);
      const bytes = Buffer.from(await response.arrayBuffer());
      const type = response.headers.get('content-type');
      const record = { asset, status: response.status, type, bytes: bytes.length };
      if (asset.endsWith('.png')) {
        assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        record.width = bytes.readUInt32BE(16);
        record.height = bytes.readUInt32BE(20);
        assert.deepEqual([record.width, record.height], asset.includes('/social/') ? [1200, 630] : [180, 180]);
        assert.match(type, /image\/png/);
      }
      if (asset.endsWith('.webp')) assert.match(type, /image\/webp/);
      if (asset.endsWith('.svg')) assert.match(type, /image\/svg\+xml/);
      if (asset.endsWith('.xml')) assert.match(type, /xml/);
      results.assets.push(record);
    });
  }
  await run('seo', 'robots-sitemap', async () => {
    const robots = await (await fetch(base + '/robots.txt')).text();
    const sitemap = await (await fetch(base + '/sitemap.xml')).text();
    assert.match(robots, /Sitemap: https:\/\/ramita\.dev\/sitemap\.xml/);
    for (const { route } of locales) assert.ok(sitemap.includes(`<loc>https://ramita.dev${route}</loc>`));
    assert.equal((sitemap.match(/<loc>/g) || []).length, 5);
  });
  await run('404', 'preview', async () => {
    const response = await fetch(base + '/h7-nonexistent-route/');
    results.notFound = { status: response.status, type: response.headers.get('content-type'), bodyStart: (await response.text()).slice(0, 180) };
  });
}
async function hostBrowsers() {
  const hosts = [
    ['Chrome', 'C:/Program Files/Google/Chrome/Application/chrome.exe'],
    ['Edge', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'],
  ];
  for (const [name, executablePath] of hosts) await run('browser', name, async () => {
    const browser = await chromium.launch({ headless: true, executablePath });
    try {
      for (const { code, route } of locales) for (const width of [390, 1440]) {
        const { context, page, response, network } = await open(browser, route, width, 900, { reducedMotion: 'reduce' });
        try {
          assert.equal(response.status(), 200);
          await page.locator('.menu-trigger').click();
          await page.locator('[data-section-link][href="#contacto"]').click();
          await page.waitForTimeout(80);
          assert.equal(await page.evaluate(() => document.activeElement?.id), 'contacto');
          assert.deepEqual(network.errors, []);
          assert.deepEqual(network.failed, []);
          results.browsers.push({ browser: name, version: browser.version(), code, width, pass: true });
        } finally { await context.close(); }
      }
    } finally { await browser.close(); }
  });
}

(async () => {
  fs.mkdirSync(captures, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  try {
    if (phase === 'all' || phase === 'responsive') { console.log('H7: responsive matrix'); await matrix(browser); }
    if (phase === 'all' || phase === 'zoom') { console.log('H7: text zoom'); await textZoom(browser); }
    if (phase === 'all' || phase === 'variants') { console.log('H7: no JS and reduced motion'); await variants(browser); }
    if (phase === 'all' || phase === 'keyboard') { console.log('H7: keyboard'); await keyboard(browser); }
    if (phase === 'all' || phase === 'touch') { console.log('H7: touch simulation'); await touch(browser); }
    if (phase === 'all' || phase === 'appearance') { console.log('H7: appearance'); await appearance(browser); }
    if (phase === 'all' || phase === 'scene') { console.log('H7: Ramiro scene accent regression'); await sceneAccent(browser); }
    if (phase === 'all' || phase === 'seo') { console.log('H7: SEO, links and assets'); await seoAndLinks(browser); }
  } finally { await browser.close(); }
  if (phase === 'all' || phase === 'browsers') { console.log('H7: Chrome and Edge'); await hostBrowsers(); }
  fs.writeFileSync(output, JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify({ counts: Object.fromEntries(['responsive', 'zoom', 'variants', 'keyboard', 'touchSimulated', 'appearance', 'sceneAccent', 'seo', 'links', 'assets', 'browsers'].map(k => [k, results[k].length])), knownExceptions: results.knownExceptions.length, failures: results.failures, notFound: results.notFound }, null, 2));
  if (results.failures.length) process.exitCode = 1;
})().catch(error => {
  fail('harness', 'fatal', error);
  fs.writeFileSync(output, JSON.stringify(results, null, 2) + '\n');
  console.error(error);
  process.exitCode = 1;
});
