const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const routes = ['/', '/en/', '/pt/', '/fr/', '/ja/'];
const expectedDemoLabels = { '/': 'Ver demo', '/en/': 'View demo', '/pt/': 'Ver demo', '/fr/': 'Voir la démo', '/ja/': 'デモを見る' };
const expectedLanguages = { '/': 'es', '/en/': 'en', '/pt/': 'pt', '/fr/': 'fr', '/ja/': 'ja' };
const expectedHistoricNotes = { '/': 'ya no está en actividad', '/en/': 'no longer active', '/pt/': 'não está mais em atividade', '/fr/': 'n’est plus en activité', '/ja/': '現在活動しておらず' };
const out = path.join(__dirname, 'h6e');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe',
  });
  const report = [];
  const visualCaptures = [];
  try {
    const scenarios = routes.flatMap((route) => [390, 1440].map((width) => ({ route, width })));
    scenarios.push(...[320, 768, 1366].map((width) => ({ route: '/', width })));
    for (const { route, width } of scenarios) {
      const mobile = width < 768;
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        isMobile: mobile,
        hasTouch: width <= 1024,
        reducedMotion: route === '/ja/' ? 'reduce' : 'no-preference',
      });
      const errors = [];
      const imageResponses = [];
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('response', (response) => {
        if (/\/images\/(residencias|lingohive)-(desktop|mobile)\.webp$/.test(new URL(response.url()).pathname)) imageResponses.push(response);
      });
      await page.addInitScript(() => {
        window.__h6eShifts = [];
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__h6eShifts.push(entry.value);
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('#proyectos').scrollIntoViewIfNeeded();
      const cases = page.locator('#proyectos > .project-case');
      assert.equal(await cases.count(), 2, `${route} ${width}: two project cases`);
      const headings = await cases.locator('.project-heading h3').allTextContents();
      assert.deepEqual(headings.map((value) => value.trim()), ['Residencias Grupo Casa', 'LingoHive'], `${route} ${width}: editorial order`);

      const demo = page.locator('[data-project-case="lingohive"] .project-status a');
      const link = await demo.evaluate((el) => ({ href: el.href, label: el.innerText.trim(), target: el.target, rel: el.rel }));
      assert.equal(link.href, 'https://lingo-hive.vercel.app/', `${route} ${width}: exact demo URL`);
      assert.equal(link.label, expectedDemoLabels[route], `${route} ${width}: localized demo CTA`);
      assert.equal(link.target, '_blank');
      assert.ok(link.rel.includes('noopener') && link.rel.includes('noreferrer'));

      const data = await page.evaluate(async () => {
        for (const img of document.querySelectorAll('#proyectos img')) {
          img.scrollIntoView({ block: 'center' });
          await img.decode();
        }
        await new Promise((resolve) => setTimeout(resolve, 600));
        const caseNodes = [...document.querySelectorAll('#proyectos > .project-case')];
        const projectData = caseNodes.map((node) => ({
          id: node.dataset.projectCase,
          heading: node.querySelector('h3')?.innerText.trim(),
          status: node.querySelector('.project-status')?.innerText.trim(),
          figures: [...node.querySelectorAll('figure')].map((figure) => {
            const img = figure.querySelector('img');
            return {
              src: new URL(img.src).pathname,
              width: Number(img.getAttribute('width')),
              height: Number(img.getAttribute('height')),
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              loading: img.loading,
              alt: img.alt,
              caption: figure.querySelector('figcaption')?.innerText.trim(),
              renderedWidth: Math.round(img.getBoundingClientRect().width),
            };
          }),
        }));
        const line = document.querySelector('[data-continuous-line]');
        const pathElement = line?.querySelector('[data-line-path]');
        const milestones = JSON.parse(line?.dataset.milestones || '[]');
        const tail = document.querySelector('#proyectos [data-project-tail]');
        const aboutHeading = document.querySelector('.about .profile .section-heading');
        const tailRect = tail.getBoundingClientRect();
        const aboutRect = aboutHeading.getBoundingClientRect();
        let tailRevealOffsetY = 0;
        for (let current = tail; current; current = current.parentElement) {
          if (!current.hasAttribute('data-reveal')) continue;
          const transform = getComputedStyle(current).transform;
          if (transform !== 'none') tailRevealOffsetY += new DOMMatrixReadOnly(transform).m42;
        }
        return {
          lang: document.documentElement.lang,
          projects: projectData,
          description: document.querySelector('[data-project-case="lingohive"] .project-text')?.innerText.trim(),
          technology: document.querySelector('[data-project-case="lingohive"] .project-capabilities')?.innerText.trim(),
          credits: [...document.querySelectorAll('[data-project-case="lingohive"] .project-credits > div')].map((item) => ({ label: item.querySelector('dt')?.innerText.trim(), name: item.querySelector('dd')?.innerText.trim() })),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          cls: window.__h6eShifts.reduce((sum, shift) => sum + shift, 0),
          line: {
            commands: [...(pathElement?.getAttribute('d') || '').matchAll(/[A-Za-z]/g)].map((match) => match[0]),
            milestones,
            projectExit: milestones.find((item) => item.name === 'projects-exit'),
            projectExitPointY: pathElement?.getPointAtLength(milestones.find((item) => item.name === 'projects-exit')?.distance || 0).y,
            expectedProjectTailY: tailRect.bottom + scrollY - tailRevealOffsetY,
            tailBelowProjects: tailRect.bottom,
            aboutHeadingTop: aboutRect.top,
            scrollY,
            endGroupOpacity: getComputedStyle(line.querySelector('[data-line-end-group]')).opacity,
          },
          jsResources: performance.getEntriesByType('resource').filter((entry) => /\.js(?:\?|$)/.test(entry.name)).map((entry) => ({ url: new URL(entry.name).pathname, bytes: entry.transferSize })),
        };
      });
      assert.equal(data.lang, expectedLanguages[route]);
      assert.equal(data.projects[0].figures.length, 2);
      assert.equal(data.projects[1].figures.length, 2);
      assert.equal(data.projects[0].figures[0].loading, 'lazy');
      assert.equal(data.projects[0].figures[1].loading, 'lazy');
      assert.equal(data.projects[1].figures[0].loading, 'lazy');
      assert.equal(data.projects[1].figures[1].loading, 'lazy');
      assert.deepEqual(data.projects[1].figures.map((figure) => [figure.src, figure.width, figure.height, figure.naturalWidth, figure.naturalHeight]), [
        ['/images/lingohive-mobile.webp', 390, 844, 390, 844],
        ['/images/lingohive-desktop.webp', 1440, 900, 1440, 900],
      ]);
      for (const project of data.projects) for (const figure of project.figures) {
        assert.ok(figure.alt.length > 25, `${route} ${width}: descriptive alt for ${figure.src}`);
        assert.ok(figure.caption.length > 20, `${route} ${width}: caption for ${figure.src}`);
      }
      assert.match(data.description, /LingoHive/);
      assert.ok(data.description.length > 80);
      assert.ok(data.description.includes(expectedHistoricNotes[route]), `${route} ${width}: localized historical status is explicit`);
      assert.match(data.technology, /Astro 5/);
      assert.match(data.technology, /Tailwind CSS 4/);
      assert.deepEqual(data.credits.map((item) => item.name), ['Juan Galache de Toro', 'Ramiro Garcia']);
      assert.ok(data.credits.every((item) => item.label.length > 3));
      assert.ok(data.projects[1].status.length > 10);
      assert.ok(data.overflow <= 1, `${route} ${width}: no horizontal overflow (${data.overflow}px)`);
      assert.ok(data.cls < 0.001, `${route} ${width}: image/layout CLS ${data.cls}`);
      assert.ok(data.line.projectExit, `${route} ${width}: project exit milestone exists`);
      assert.ok(Math.abs(data.line.projectExitPointY - data.line.expectedProjectTailY) <= 2, `${route} ${width}: path exits at the final credit geometry (path ${data.line.projectExitPointY}; tail ${data.line.expectedProjectTailY})`);
      assert.ok(data.line.tailBelowProjects < data.line.aboutHeadingTop, `${route} ${width}: line tail ends before Ramiro`);
      assert.ok(data.line.commands.every((command) => ['M', 'H', 'V', 'Q'].includes(command)), `${route} ${width}: existing orthogonal/curved route has no diagonal command`);
      if (route === '/ja/') assert.equal(data.line.endGroupOpacity, '1', `${route} ${width}: reduced-motion line is complete`);

      const resourceSummary = await Promise.all(imageResponses.map(async (response) => ({
        src: new URL(response.url()).pathname,
        status: response.status(),
        contentType: response.headers()['content-type'],
        bytes: (await response.body()).length,
      })));
      for (const image of resourceSummary) {
        assert.equal(image.status, 200);
        assert.ok(image.contentType.includes('image/webp'));
      }
      assert.deepEqual(resourceSummary.filter((item) => item.src.startsWith('/images/lingohive-')).map((item) => item.src).sort(), [
        '/images/lingohive-desktop.webp', '/images/lingohive-mobile.webp',
      ]);
      assert.deepEqual(errors, [], `${route} ${width}: browser console/page errors`);

      if ((route === '/' && [320, 390, 768, 1440].includes(width)) || (route === '/ja/' && width === 390)) {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
        const captures = [
          ['projects', '#proyectos > .section-heading', 100],
          ['lingohive', '[data-project-case="lingohive"] .project-heading h3', 100],
          ['credits', '[data-project-case="lingohive"] .project-credits', 160],
        ];
        for (const [label, selector, offset] of captures) {
          await page.evaluate(({ selector, offset }) => {
            const element = document.querySelector(selector);
            window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - offset, behavior: 'instant' });
          }, { selector, offset });
          await page.waitForTimeout(50);
          const file = `${expectedLanguages[route]}-${width}-${label}.png`;
          await page.screenshot({ path: path.join(out, file) });
          visualCaptures.push(file);
        }
      }
      if (route === '/' && width === 390) {
        await demo.evaluate((el) => el.addEventListener('click', (event) => { event.preventDefault(); window.__keyboardActivated = event.isTrusted; }, { once: true }));
        await demo.focus();
        assert.equal(await demo.evaluate((el) => document.activeElement === el), true, 'CTA is keyboard focusable');
        await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => window.__keyboardActivated), true, 'Enter activates the demo CTA');
        await demo.evaluate((el) => el.addEventListener('click', (event) => { event.preventDefault(); window.__touchActivated = event.isTrusted; }, { once: true }));
        await demo.tap();
        assert.equal(await page.evaluate(() => window.__touchActivated), true, 'Touch activates the demo CTA');
      }
      report.push({ route, width, projectOrder: headings.map((value) => value.trim()), ...data, resources: resourceSummary, browserErrors: errors });
      await page.close();
    }
    const sourceAssets = [
      { file: 'lingohive-desktop.png', width: 1440, height: 900, bytes: 84282 },
      { file: 'lingohive-mobile.png', width: 390, height: 844, bytes: 43556 },
    ];
    const webpAssets = [
      { file: 'lingohive-desktop.webp', width: 1440, height: 900 },
      { file: 'lingohive-mobile.webp', width: 390, height: 844 },
    ].map((asset) => ({ ...asset, bytes: fs.statSync(path.join(__dirname, '..', 'public', 'images', asset.file)).size }));
    const originalBytes = sourceAssets.reduce((sum, asset) => sum + asset.bytes, 0);
    const webpBytes = webpAssets.reduce((sum, asset) => sum + asset.bytes, 0);
    const optimization = {
      format: 'WebP', qualityHint: 0.84, resized: false,
      originalBytes, webpBytes, savedBytes: originalBytes - webpBytes,
      reductionPercent: Number(((originalBytes - webpBytes) / originalBytes * 100).toFixed(2)),
      sourcePng: sourceAssets, outputWebp: webpAssets,
    };
    fs.writeFileSync(path.join(__dirname, 'h6e-results.json'), JSON.stringify({ scenarios: report.length, optimization, visualCaptures, checks: report }, null, 2) + '\n', 'utf8');
    console.log(JSON.stringify({ scenarios: report.length, maxOverflow: Math.max(...report.map((item) => item.overflow)), maxCLS: Math.max(...report.map((item) => item.cls)), screenshots: visualCaptures }));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
