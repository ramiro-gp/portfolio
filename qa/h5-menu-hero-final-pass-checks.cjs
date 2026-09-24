const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const executablePath = 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const routes = [['/', 'es'], ['/en/', 'en'], ['/pt/', 'pt'], ['/fr/', 'fr'], ['/ja/', 'ja']];
const report = { menuClose: [], navigation: [], hero: [], reducedMotion: {}, noJsFallback: {} };

async function armCloseProbe(page) {
  await page.evaluate(() => {
    const header = document.querySelector('.site-header');
    window.__h5CloseProbe = { requestedAt: null, startRadius: null, coverageRadius: null, firstVisibleMs: null };
    const requestClose = () => {
      if (header.hasAttribute('data-open') && window.__h5CloseProbe.requestedAt === null) window.__h5CloseProbe.requestedAt = performance.now();
    };
    header.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('.menu-trigger')) requestClose();
    }, true);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') requestClose();
    }, true);
    header.addEventListener('animationstart', (event) => {
      if (event.animationName !== 'menu-close-visible') return;
      let recorded = false;
      const sample = () => {
        const match = getComputedStyle(header).clipPath.match(/circle\(([\d.]+)px at ([\d.]+)px ([\d.]+)px\)/);
        if (match) {
          const radius = Number(match[1]);
          const x = Number(match[2]);
          const y = Number(match[3]);
          const coverage = Math.max(
            Math.hypot(x, y), Math.hypot(innerWidth - x, y),
            Math.hypot(x, innerHeight - y), Math.hypot(innerWidth - x, innerHeight - y)
          );
          if (window.__h5CloseProbe.startRadius === null) {
            window.__h5CloseProbe.startRadius = radius;
            window.__h5CloseProbe.coverageRadius = coverage;
          }
          if (!recorded && radius < coverage - .5) {
            recorded = true;
            window.__h5CloseProbe.firstVisibleMs = Math.round(performance.now() - window.__h5CloseProbe.requestedAt);
          }
        }
        if (!recorded && performance.now() - start < 300) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    }, { once: true });
  });
}

async function expectedScrollPosition(page, id) {
  return page.evaluate((sectionId) => {
    const target = document.getElementById(sectionId);
    const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    return Math.max(0, Math.min(target.getBoundingClientRect().top + scrollY - margin, document.documentElement.scrollHeight - innerHeight));
  }, id);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });

  for (const [width, height, method] of [[1366, 768, 'trigger'], [1366, 768, 'escape'], [390, 844, 'trigger'], [390, 844, 'escape']]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.menu-trigger').click();
    await page.waitForTimeout(500);
    await armCloseProbe(page);
    if (method === 'escape') await page.keyboard.press('Escape');
    else await page.locator('.menu-trigger').click();
    await page.waitForFunction(() => window.__h5CloseProbe?.firstVisibleMs !== null, null, { timeout: 1000 });
    const early = await page.evaluate(() => ({
      ...window.__h5CloseProbe,
      menuStillModal: document.querySelector('.site-header').hasAttribute('data-open') &&
        document.querySelector('.site-header').getAttribute('aria-modal') === 'true',
      mainInert: document.querySelector('main').inert,
      expanded: document.querySelector('.menu-trigger').getAttribute('aria-expanded')
    }));
    assert.ok(early.firstVisibleMs <= 50, 'close edge should move at once at ' + width + 'px (' + method + '): ' + early.firstVisibleMs + 'ms');
    assert.ok(early.menuStillModal && early.mainInert && early.expanded === 'true', 'modal remains active while its close animation runs');
    await page.waitForFunction(() => !document.querySelector('.site-header').hasAttribute('data-open'), null, { timeout: 1200 });
    const closed = await page.evaluate(() => ({
      expanded: document.querySelector('.menu-trigger').getAttribute('aria-expanded'),
      mainInert: document.querySelector('main').inert,
      rootOverflow: document.documentElement.style.overflow,
      focusedTrigger: document.activeElement === document.querySelector('.menu-trigger')
    }));
    assert.equal(closed.expanded, 'false');
    assert.equal(closed.mainInert, false);
    assert.equal(closed.rootOverflow, '');
    assert.equal(closed.focusedTrigger, true);
    report.menuClose.push({ width, height, method, firstVisibleMs: early.firstVisibleMs, modalRetained: true, restored: true });
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.menu-trigger').click();
    await page.waitForTimeout(500);
    await page.evaluate(() => {
      const header = document.querySelector('.site-header');
      const focusables = [...header.querySelectorAll('a[href],summary,button:not([disabled])')].filter((node) => node.getClientRects().length > 0);
      focusables[focusables.length - 1].focus();
    });
    await page.keyboard.press('Escape');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('brand')), true, 'Tab remains trapped while the modal is closing');
    await page.waitForFunction(() => !document.querySelector('.site-header').hasAttribute('data-open'), null, { timeout: 1200 });
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('menu-trigger')), true, 'Escape restores focus after the close finishes');
    report.menuClose.push({ method: 'escape-and-tab-trap', focusTrappedUntilEnd: true, restoredToTrigger: true });
    await page.close();
  }

  for (const id of ['inicio', 'servicios', 'proyectos', 'ramiro', 'contacto']) {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.menu-trigger').click();
    await page.waitForTimeout(500);
    const startY = await page.evaluate(() => scrollY);
    await page.locator('[data-section-link][href="#' + id + '"]').click();
    const immediate = await page.evaluate(() => ({
      hash: location.hash, scrollY,
      open: document.querySelector('.site-header').hasAttribute('data-open'),
      inert: document.querySelector('main').inert
    }));
    assert.equal(immediate.hash, '#' + id);
    assert.equal(immediate.open, true);
    assert.equal(immediate.inert, true);
    await page.waitForTimeout(100);
    const moving = await page.evaluate(() => ({ scrollY, open: document.querySelector('.site-header').hasAttribute('data-open') }));
    if (id !== 'inicio') {
      assert.ok(moving.scrollY > startY + 4, 'native scroll begins while menu is closing for ' + id);
      const destination = await expectedScrollPosition(page, id);
      assert.ok(Math.abs(moving.scrollY - destination) > 10, 'scroll to ' + id + ' is visibly in progress, not a jump');
    }
    await page.waitForFunction(() => !document.querySelector('.site-header').hasAttribute('data-open'), null, { timeout: 1200 });
    const atClose = await page.evaluate(() => ({
      focus: document.activeElement.id,
      mainInert: document.querySelector('main').inert,
      pointerFocus: document.documentElement.classList.contains('pointer-section-focus')
    }), id);
    assert.equal(atClose.focus, id, 'focus transfers to ' + id + ' after overlay disappears');
    assert.equal(atClose.mainInert, false);
    assert.equal(atClose.pointerFocus, true);
    await page.waitForFunction((sectionId) => {
      const target = document.getElementById(sectionId);
      const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const destination = Math.max(0, Math.min(target.getBoundingClientRect().top + scrollY - margin, document.documentElement.scrollHeight - innerHeight));
      return Math.abs(scrollY - destination) <= 3;
    }, id, { timeout: 4000 });
    report.navigation.push({ id, method: 'mouse', hash: immediate.hash, movedBeforeClose: moving.scrollY > startY + 4, focusAfterClose: atClose.focus });
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.menu-trigger').click();
    await page.waitForTimeout(500);
    await page.locator('[data-section-link][href="#servicios"]').focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('.site-header').hasAttribute('data-open'), null, { timeout: 1200 });
    assert.equal(await page.evaluate(() => document.activeElement.id), 'servicios');
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains('pointer-section-focus')), false);
    report.navigation.push({ id: 'servicios', method: 'keyboard', focusAfterClose: 'servicios', keyboardFocusVisible: true });
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.menu-trigger').tap();
    await page.waitForTimeout(500);
    await page.locator('[data-section-link][href="#proyectos"]').tap();
    await page.waitForFunction(() => !document.querySelector('.site-header').hasAttribute('data-open'), null, { timeout: 1200 });
    assert.equal(await page.evaluate(() => document.activeElement.id), 'proyectos');
    await page.waitForFunction(() => {
      const target = document.getElementById('proyectos');
      const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const destination = Math.max(0, Math.min(target.getBoundingClientRect().top + scrollY - margin, document.documentElement.scrollHeight - innerHeight));
      return Math.abs(scrollY - destination) <= 3;
    }, null, { timeout: 4000 });
    report.navigation.push({ id: 'proyectos', method: 'touch', focusAfterClose: 'proyectos' });
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.menu-trigger').click();
    await page.waitForTimeout(30);
    await page.locator('[data-section-link][href="#contacto"]').click();
    await page.waitForFunction(() => !document.querySelector('.site-header').hasAttribute('data-open'), null, { timeout: 500 });
    const state = await page.evaluate(() => ({ hash: location.hash, y: scrollY, focus: document.activeElement.id, inert: document.querySelector('main').inert }));
    assert.equal(state.hash, '#contacto');
    assert.equal(state.focus, 'contacto');
    assert.equal(state.inert, false);
    const destination = await expectedScrollPosition(page, 'contacto');
    assert.ok(Math.abs(state.y - destination) <= 3, 'reduced-motion navigation uses an immediate scroll (y=' + state.y + ', destination=' + destination + ')');
    report.reducedMotion = { menuClosesImmediately: true, navigation: 'auto', focus: state.focus };
    await page.close();
  }

  for (const [route, lang] of routes) {
    for (const [width, height] of [[1366, 768], [390, 844], [320, 740]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: [
        '.qa-static .word-char{animation:none!important;opacity:1!important;transform:none!important;clip-path:inset(0)!important}',
        '.qa-no-overscan .word-current,.qa-no-overscan .word-char{margin-inline:0!important;padding-inline:0!important}',
        '.qa-no-overscan .word-current{max-width:100%!important}'
      ].join('') });
      const initial = await page.evaluate(() => ({
        words: JSON.parse(document.querySelector('[data-word-slot]').dataset.words),
        fallback: document.querySelector('[data-word-current]').textContent,
        lineHeight: document.querySelector('[data-word-slot]').getBoundingClientRect().height
      }));
      assert.equal(initial.words.length, 6, lang + ' has all six approved word states');
      for (const word of initial.words) {
        await page.evaluate((value) => {
          const current = document.querySelector('[data-word-current]');
          current.classList.add('qa-static');
          const fragment = document.createDocumentFragment();
          for (const [index, character] of Array.from(value).entries()) {
            if (character === ' ') {
              fragment.append(document.createTextNode(' '));
              continue;
            }
            const letter = document.createElement('span');
            letter.className = 'word-char';
            letter.style.setProperty('--char-index', String(index));
            letter.textContent = character;
            fragment.append(letter);
          }
          current.replaceChildren(fragment);
          document.documentElement.classList.add('qa-no-overscan');
        }, word);
        const baselineWidth = await page.evaluate(() => document.querySelector('[data-word-slot]').getBoundingClientRect().width);
        await page.evaluate(() => document.documentElement.classList.remove('qa-no-overscan'));
        const geometry = await page.evaluate(() => {
          const current = document.querySelector('[data-word-current]');
          const slot = document.querySelector('[data-word-slot]');
          const wordBox = current.getBoundingClientRect();
          const slotBox = slot.getBoundingClientRect();
          const style = getComputedStyle(current);
          const padding = Number.parseFloat(style.paddingLeft) || 0;
          const chars = [...current.children];
          const characterStyle = chars[0] ? getComputedStyle(chars[0]) : null;
          return {
            text: current.textContent, slotWidth: slotBox.width, slotHeight: slotBox.height,
            contentLeft: wordBox.left + padding, contentRight: wordBox.right - padding,
            slotLeft: slotBox.left, slotRight: slotBox.right,
            parentOverscan: [style.paddingLeft, style.marginLeft, style.paddingRight, style.marginRight],
            characterOverscan: characterStyle ? [characterStyle.paddingLeft, characterStyle.marginLeft, characterStyle.paddingRight, characterStyle.marginRight] : [],
            rows: new Set(chars.map((letter) => Math.round(letter.getBoundingClientRect().top * 10) / 10)).size,
            overflow: document.documentElement.scrollWidth > innerWidth
          };
        });
        assert.equal(geometry.text, word);
        assert.ok(Math.abs(geometry.slotWidth - baselineWidth) < .1, lang + ' ' + width + 'px ' + word + ': reserved width unchanged by overscan');
        assert.ok(Math.abs(geometry.slotHeight - initial.lineHeight) < .1, lang + ' ' + width + 'px ' + word + ': reserved height unchanged');
        assert.ok(geometry.contentLeft >= geometry.slotLeft - .1, lang + ' ' + width + 'px ' + word + ': no left clip');
        assert.ok(geometry.contentRight <= geometry.slotRight + .1, lang + ' ' + width + 'px ' + word + ': no right clip');
        assert.ok(geometry.parentOverscan.every((value, index, all) => Math.abs(parseFloat(value) + parseFloat(all[index ^ 1])) < .1), lang + ' ' + width + 'px ' + word + ': parent padding/margin are compensated');
        assert.ok(geometry.characterOverscan.every((value, index, all) => Math.abs(parseFloat(value) + parseFloat(all[index ^ 1])) < .1), lang + ' ' + width + 'px ' + word + ': character padding/margin are compensated');
        assert.equal(geometry.overflow, false, lang + ' ' + width + 'px ' + word + ': no horizontal viewport overflow');
        if (width >= 390) assert.equal(geometry.rows, 1, lang + ' ' + width + 'px ' + word + ': word does not wrap');
      }
      report.hero.push({ route, lang, width, words: initial.words, reservedSlotStable: true, noOverflow: true });
      await page.close();
    }
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(base + '/ja/', { waitUntil: 'networkidle' });
    const fallback = await page.evaluate(() => ({
      word: document.querySelector('[data-word-current]').textContent,
      accessibleHeadline: document.querySelector('.sr-only').textContent
    }));
    await page.waitForTimeout(3500);
    assert.equal(await page.evaluate(() => document.querySelector('[data-word-current]').textContent), fallback.word);
    assert.ok(fallback.accessibleHeadline.includes(fallback.word));
    report.reducedMotion.heroFallback = fallback.word;
    await page.close();
  }

  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.menu-trigger').click();
    assert.equal(await page.locator('[data-menu]').evaluate((node) => node.open), true);
    await page.locator('[data-section-link][href="#proyectos"]').click();
    assert.equal(await page.evaluate(() => location.hash), '#proyectos');
    assert.equal(await page.locator('[data-word-current]').textContent(), 'proyecto');
    report.noJsFallback = { nativeDetailsMenu: true, sectionAnchor: '#proyectos', heroFallback: 'proyecto' };
    await page.close();
  }

  await browser.close();
  const outputPath = path.join(__dirname, 'h5-menu-hero-final-pass-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ outputPath, closeTests: report.menuClose.length, navigationTests: report.navigation.length, heroMatrix: report.hero.length, heroStates: report.hero.length * 6, reducedMotion: report.reducedMotion, noJsFallback: report.noJsFallback }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
