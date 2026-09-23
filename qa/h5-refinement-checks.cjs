const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const report = { routes: [], checks: [], progress: [], colors: [] };
const check = (name, value) => { assert.ok(value, name); report.checks.push(name); };

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe' });
  for (const [route, locale] of [['/', 'es'], ['/en/', 'en'], ['/pt/', 'pt'], ['/fr/', 'fr'], ['/ja/', 'ja']]) for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => {
      const letters = [...document.querySelectorAll('[data-word-current] .word-char')];
      const slot = document.querySelector('[data-word-slot]');
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        nav: document.querySelector('.menu-navigation a:nth-child(4)')?.textContent,
        aboutTitle: document.querySelector('#about-title')?.textContent,
        letterCount: letters.length,
        word: document.querySelector('[data-word-current]')?.textContent,
        firstDelay: letters[0] && getComputedStyle(letters[0]).animationDelay,
        lastDelay: letters.at(-1) && getComputedStyle(letters.at(-1)).animationDelay,
        duration: letters[0] && getComputedStyle(letters[0]).animationDuration,
        fallback: document.querySelector('h1 .sr-only')?.textContent,
        width: slot?.getBoundingClientRect().width,
        lineStroke: getComputedStyle(document.querySelector('[data-line-path]')).strokeWidth,
        aboutBackground: getComputedStyle(document.querySelector('.about')).backgroundColor
      };
    });
    assert.equal(state.overflow, false, `${locale} ${width} overflow`);
    assert.ok(state.nav.includes('Ramiro Garcia'));
    assert.equal(state.aboutTitle, 'Ramiro Garcia');
    assert.ok(state.letterCount > 0 && state.word, `${locale} ${width}: ${JSON.stringify(state)}`);
    assert.ok(state.fallback && state.fallback.includes(locale === 'ja' ? 'プロジェクト' : locale === 'pt' ? 'projeto' : locale === 'fr' ? 'projet' : locale === 'en' ? 'project' : 'proyecto'));
    assert.ok(parseFloat(state.duration) + parseFloat(state.lastDelay) >= .34 && parseFloat(state.duration) + parseFloat(state.lastDelay) <= .45, `${locale} stagger outside the intended ~400 ms`);
    assert.equal(parseFloat(state.firstDelay), 0);
    assert.ok(state.width > 0);
    assert.equal(parseFloat(state.lineStroke), width < 768 ? 8.5 : 17);
    assert.equal(state.aboutBackground, 'rgb(23, 24, 22)');
    assert.deepEqual(errors, []);
    if (width === 320) for (const fontSize of ['100%', '200%']) {
      const variants = await page.evaluate((size) => {
        document.documentElement.style.fontSize = size;
        const current = document.querySelector('[data-word-current]');
        const words = JSON.parse(document.querySelector('[data-word-slot]').dataset.words);
        const measure = () => ({ heading: document.querySelector('h1').getBoundingClientRect().height, cta: document.querySelector('.cta').getBoundingClientRect().top, overflow: document.documentElement.scrollWidth > innerWidth });
        const positions = [];
        for (const word of words) {
          const fragment = document.createDocumentFragment();
          for (const character of Array.from(word)) {
            if (character === ' ') { fragment.append(document.createTextNode(' ')); continue; }
            const span = document.createElement('span');
            span.className = 'word-char';
            span.textContent = character;
            fragment.append(span);
          }
          current.replaceChildren(fragment);
          positions.push(measure());
        }
        return positions;
      }, fontSize);
      const headings = variants.map((item) => item.heading);
      const ctas = variants.map((item) => item.cta);
      assert.ok(Math.max(...headings) - Math.min(...headings) < 2 && Math.max(...ctas) - Math.min(...ctas) < 2 && variants.every((item) => !item.overflow), `${locale} 320 ${fontSize} Hero shifts: ${JSON.stringify(variants)}`);
    }
    await page.locator('.menu-trigger').click();
    await page.waitForTimeout(500);
    const menuFit = await page.evaluate(() => {
      const panel = document.querySelector('.menu-panel');
      return { fit: panel.scrollHeight <= panel.clientHeight, mode: !!document.querySelector('[data-theme-choice="dark"]'), color: !!document.querySelector('[data-accent-choice="light-green"]') };
    });
    if (width > 320) assert.equal(menuFit.fit, true, `${locale} ${width} unnecessary menu scroll`);
    assert.ok(menuFit.mode && menuFit.color);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    report.routes.push({ locale, width, menuFit: menuFit.fit, overflow: state.overflow });
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  const geometry = await page.evaluate(() => {
    const path = document.querySelector('[data-line-path]');
    const start = document.querySelector('[data-line-start-node]');
    const end = document.querySelector('[data-line-end-node]');
    return { d: path.getAttribute('d'), start: Number(start.getAttribute('cy')), end: Number(end.getAttribute('cy')), length: path.getTotalLength() };
  });
  check('line has orthogonal rounded turns and solid nodes', (geometry.d.match(/ Q /g) || []).length >= 4 && !/[DL]/.test(geometry.d) && geometry.length > 0 && geometry.end > geometry.start);
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (const target of [maxScroll * .2, maxScroll * .5, maxScroll * .8]) {
    await page.evaluate((top) => scrollTo({ top, behavior: 'instant' }), target);
    await page.waitForTimeout(100);
    const point = await page.evaluate(() => {
      const path = document.querySelector('[data-line-path]');
      const length = path.getTotalLength();
      const drawn = length - Number(path.style.strokeDashoffset);
      const milestones = JSON.parse(document.querySelector('[data-continuous-line]').dataset.milestones);
      const nextIndex = milestones.findIndex((item) => item.scroll >= scrollY);
      const next = milestones[nextIndex];
      const previous = milestones[nextIndex - 1];
      const expected = nextIndex < 0 ? length : nextIndex === 0 ? 0 : previous.distance + (next.distance - previous.distance) * (scrollY - previous.scroll) / (next.scroll - previous.scroll);
      return { scroll: scrollY, drawn, length, expected };
    });
    check(`line draws by physical length at scroll ${Math.round(target)}`, point.drawn > 0 && point.drawn < point.length);
    check(`line matches structural milestones at scroll ${Math.round(target)}`, Math.abs(point.drawn - point.expected) < 4);
    report.progress.push(point);
  }
  check('path length advances monotonically between structural milestones', report.progress.every((point, index) => !index || point.drawn > report.progress[index - 1].drawn));
  const down = report.progress.at(-1).drawn;
  await page.evaluate(() => scrollTo({ top: 500, behavior: 'instant' }));
  await page.waitForTimeout(100);
  const up = await page.evaluate(() => document.querySelector('[data-line-path]').getTotalLength() - Number(document.querySelector('[data-line-path]').style.strokeDashoffset));
  check('line retracts on reverse native scroll', up < down);

  await page.locator('.menu-trigger').click();
  await page.waitForTimeout(500);
  await page.locator('.menu-navigation a').first().hover();
  await page.waitForTimeout(700);
  const firstLine = await page.locator('.menu-navigation a').first().evaluate((node) => getComputedStyle(node, '::after').transform);
  await page.locator('.menu-navigation a').nth(1).hover();
  await page.waitForTimeout(120);
  const movingLines = await page.locator('.menu-navigation a').evaluateAll((nodes) => nodes.slice(0, 2).map((node) => getComputedStyle(node, '::after').transform));
  check('independent menu underlines enter and retract', firstLine !== 'matrix(0, 0, 0, 1, 0, 0)' && movingLines[0] !== movingLines[1]);
  await page.locator('.menu-trigger').focus();
  await page.keyboard.press('Tab');
  await page.waitForTimeout(650);
  check('keyboard focus reveals menu underline', await page.locator('.menu-navigation a').first().evaluate((node) => node.matches(':focus-visible') && getComputedStyle(node, '::after').transform !== 'matrix(0, 0, 0, 1, 0, 0)'));
  await page.locator('.menu-trigger').click();
  await page.waitForTimeout(150);
  const closing = await page.evaluate(() => ({ open: document.querySelector('[data-menu]').open, closing: document.querySelector('[data-menu-root]').hasAttribute('data-closing'), clip: getComputedStyle(document.querySelector('[data-menu-root]')).clipPath, coverRadius: Math.max(innerWidth, innerHeight) * 1.5 }));
  report.closing = closing;
  const radius = parseFloat(closing.clip.match(/circle\(([\d.]+)/)?.[1] || '0');
  check('reverse close retains a visible contracting overlay', closing.open && closing.closing && radius > 0 && radius < closing.coverRadius);
  await page.waitForTimeout(300);
  check('reverse close releases background after animation', await page.evaluate(() => !document.querySelector('[data-menu]').open && !document.querySelector('main').inert));

  for (const [theme, accent] of [['light', 'light-green'], ['light', 'light-black'], ['dark', 'dark-orange'], ['dark', 'dark-white']]) {
    await page.locator('.menu-trigger').click();
    await page.locator(`[data-theme-choice="${theme}"]`).click();
    await page.locator(`[data-accent-choice="${accent}"]`).click();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    const colors = await page.evaluate(() => {
      const root = document.documentElement;
      const path = document.querySelector('[data-line-path]');
      return { theme: root.dataset.theme, accent: root.dataset.accent, path: getComputedStyle(path).stroke, accentColor: getComputedStyle(document.querySelector('.cta')).backgroundColor, github: getComputedStyle(document.querySelector('.about .profile-links a')).color, about: getComputedStyle(document.querySelector('.about')).backgroundColor, haloCount: document.querySelectorAll('[data-line-halo-path]').length };
    });
    assert.equal(colors.theme, theme);
    assert.equal(colors.accent, accent);
    assert.ok(colors.path !== colors.about);
    assert.equal(colors.path, colors.accentColor);
    assert.equal(colors.github, colors.path);
    assert.equal(colors.haloCount, 0);
    report.colors.push(colors);
    await page.locator('#ramiro').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(__dirname, 'refinement', `${theme}-${accent}-ramiro.png`) });
  }
  await page.locator('.cta').scrollIntoViewIfNeeded();
  const cta = await page.locator('.cta').boundingBox();
  await page.mouse.move(cta.x + cta.width / 2, cta.y + cta.height / 2);
  check('cursor uses on-accent color over CTA', await page.locator('[data-cursor]').evaluate((node) => node.classList.contains('is-on-accent')));
  await page.locator('#ramiro').scrollIntoViewIfNeeded();
  const about = await page.locator('#ramiro').boundingBox();
  await page.mouse.move(about.x + about.width / 2, about.y + about.height / 2);
  check('cursor switches on inverse scene', await page.locator('[data-cursor]').evaluate((node) => node.classList.contains('is-inverse')));
  await page.evaluate(() => scrollTo({ top: document.querySelector('#proyectos').getBoundingClientRect().top + scrollY + 120, behavior: 'instant' }));
  await page.waitForTimeout(100);
  check('cursor refreshes context when scrolling without pointer movement', await page.locator('[data-cursor]').evaluate((node) => !node.classList.contains('is-inverse')));
  await page.evaluate(() => scrollTo({ top: document.querySelector('#ramiro').getBoundingClientRect().top + scrollY + 120, behavior: 'instant' }));
  await page.waitForTimeout(100);
  check('cursor enters inverse context without pointer movement', await page.locator('[data-cursor]').evaluate((node) => node.classList.contains('is-inverse')));
  await page.close();

  const reduced = await browser.newPage({ reducedMotion: 'reduce' });
  await reduced.goto(base, { waitUntil: 'networkidle' });
  await reduced.locator('.menu-trigger').click();
  await reduced.keyboard.press('Escape');
  await reduced.waitForTimeout(30);
  check('reduced-motion menu closes immediately', await reduced.evaluate(() => !document.querySelector('[data-menu]').open && document.querySelector('[data-line-path]').style.strokeDashoffset === '0'));
  check('reduced-motion pulse is off', await reduced.locator('[data-line-start-pulse]').evaluate((node) => getComputedStyle(node).animationName === 'none' && getComputedStyle(node).opacity === '0'));
  await reduced.close();
  await browser.close();
  fs.writeFileSync(path.join(__dirname, 'h5-refinement-checks-results.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ routes: report.routes.length, checks: report.checks.length, progress: report.progress, colors: report.colors }, null, 2));
})().catch((error) => { console.error(error); process.exit(1); });
