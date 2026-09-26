const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const base = process.env.QA_BASE || 'http://127.0.0.1:4323';
const executablePath = 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe';
const captures = path.join(__dirname, 'h8-services-copy');
const resultsPath = path.join(__dirname, 'h8-services-copy-results.json');
const routes = [
  { locale: 'es', route: '/', copy: [
    'Según el alcance, puedo integrar adaptación a celulares, formularios y otras herramientas, SEO técnico, cuidado de la velocidad de carga y publicación.',
    'Para negocios locales, también se puede trabajar en el Perfil de Empresa de Google. Además, preparo la estructura y el contenido para buscadores y asistentes de IA, sin prometer visibilidad.',
    '¿Ya tenés un diseño? Lo vemos y me encargo del desarrollo, revisando las pantallas y los comportamientos necesarios.'
  ] },
  { locale: 'en', route: '/en/', copy: [
    'Depending on the scope, I can also take care of mobile responsiveness, forms and other tools, technical SEO, page speed and publishing.',
    'For local businesses, a project may also include work on their Google Business Profile. I also prepare the structure and content for search engines and AI assistants, without promising visibility.',
    'Already have a design? Let’s review it together, and I’ll handle the development after checking the screens and interactions it needs.'
  ] },
  { locale: 'pt', route: '/pt/', copy: [
    'Conforme o escopo, também posso cuidar da adaptação para celulares, de formulários e outras ferramentas, do SEO técnico, da velocidade de carregamento e da publicação.',
    'Para negócios locais, também é possível trabalhar no Perfil da Empresa no Google. Além disso, preparo a estrutura e o conteúdo para mecanismos de busca e assistentes de IA, sem prometer visibilidade.',
    'Já tem um design? Podemos analisar juntos, e eu cuido do desenvolvimento, depois de revisar as telas e os comportamentos necessários.'
  ] },
  { locale: 'fr', route: '/fr/', copy: [
    'Selon le périmètre, je peux aussi intégrer l’adaptation mobile, des formulaires et d’autres outils, le référencement technique, l’optimisation de la vitesse de chargement et la mise en ligne.',
    'Pour les entreprises locales, il est aussi possible de travailler sur leur fiche d’établissement Google. Je prépare également la structure et le contenu pour les moteurs de recherche et les assistants IA, sans promettre de visibilité.',
    'Vous avez déjà un design ? Nous pouvons l’examiner ensemble, puis je prends en charge le développement après avoir vérifié les écrans et les comportements nécessaires.'
  ] },
  { locale: 'ja', route: '/ja/', copy: [
    '対応範囲に応じて、スマートフォンでの表示調整、フォームなどの機能、テクニカルSEO、読み込み速度への配慮、公開まで対応します。',
    '地域の事業者向けには、Google ビジネス プロフィールの設定や改善も可能です。また、検索エンジンやAIアシスタントに向けた情報構成とコンテンツも整えますが、検索結果での表示や露出を保証するものではありません。',
    'すでにデザインがありますか？一緒に確認し、必要な画面や動きを整理したうえで、開発を担当します。'
  ] }
];
const viewports = [
  { width: 320, height: 800, capture: false },
  { width: 390, height: 844, capture: true },
  { width: 1440, height: 900, capture: true }
];
const results = { date: new Date().toISOString(), base, commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: path.join(__dirname, '..'), encoding: 'utf8' }).trim(), cases: [], screenshots: [], failures: [], consoleErrors: [], requestFailures: [] };

fs.mkdirSync(captures, { recursive: true });

async function inspect(page) {
  return page.evaluate(() => {
    const svg = document.querySelector('[data-continuous-line]');
    const line = svg.querySelector('[data-line-path]');
    const capabilities = document.querySelector('.services .capabilities');
    const paragraphs = [...capabilities.querySelectorAll(':scope > p')];
    const textRects = paragraphs.flatMap((paragraph) => {
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      return [...range.getClientRects()].map((rect) => ({
        left: rect.left + scrollX,
        right: rect.right + scrollX,
        top: rect.top + scrollY,
        bottom: rect.bottom + scrollY
      }));
    });
    const ctm = line.getScreenCTM();
    const stroke = parseFloat(getComputedStyle(line).strokeWidth) * Math.max(Math.abs(ctm.a), Math.abs(ctm.d)) / 2;
    const points = [];
    const length = line.getTotalLength();
    for (let distance = 0; distance <= length; distance += 2) {
      const localPoint = line.getPointAtLength(distance);
      const point = new DOMPoint(localPoint.x, localPoint.y).matrixTransform(ctm);
      points.push({ x: point.x + scrollX, y: point.y + scrollY });
    }
    const collisionPoints = points.filter((point) => textRects.some((rect) =>
      point.x + stroke > rect.left && point.x - stroke < rect.right &&
      point.y + stroke > rect.top && point.y - stroke < rect.bottom));
    const box = capabilities.getBoundingClientRect();
    const project = document.querySelector('.projects').getBoundingClientRect();
    const flatText = paragraphs.map((paragraph) => paragraph.innerText.trim());
    return {
      locale: document.documentElement.lang,
      text: flatText,
      paragraphCount: paragraphs.length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      capabilitiesHeight: box.height,
      projectsTop: project.top + scrollY,
      capabilitiesBottom: box.bottom + scrollY,
      lineCollisionPoints: collisionPoints.length,
      lineReady: svg.dataset.ready !== undefined,
      route: svg.dataset.route
    };
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    for (const { locale, route, copy } of routes) {
      for (const viewport of viewports) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        page.on('console', (message) => { if (message.type() === 'error') results.consoleErrors.push(`${locale}-${viewport.width}: ${message.text()}`); });
        page.on('pageerror', (error) => results.consoleErrors.push(`${locale}-${viewport.width}: ${error.message}`));
        page.on('requestfailed', (request) => results.requestFailures.push(`${locale}-${viewport.width}: ${request.url()} ${request.failure()?.errorText || ''}`));
        try {
          await page.goto(base + route, { waitUntil: 'networkidle' });
          await page.evaluate(async () => {
            await document.fonts.ready;
            document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
            window.scrollTo({ top: 0, behavior: 'instant' });
          });
          await page.waitForFunction(() => document.querySelector('[data-continuous-line]')?.dataset.ready !== undefined);
          const state = await inspect(page);
          assert.equal(state.locale, locale, `${locale}-${viewport.width}: route locale`);
          assert.deepEqual(state.text, copy, `${locale}-${viewport.width}: exact three-paragraph copy`);
          assert.equal(state.paragraphCount, 3, `${locale}-${viewport.width}: three paragraphs`);
          assert.equal(state.overflow, 0, `${locale}-${viewport.width}: no horizontal overflow`);
          assert.ok(state.capabilitiesBottom < state.projectsTop, `${locale}-${viewport.width}: capabilities remain before Projects`);
          assert.equal(state.lineCollisionPoints, 0, `${locale}-${viewport.width}: line does not cross copy`);
          assert.ok(state.lineReady, `${locale}-${viewport.width}: line layout is ready`);

          if (viewport.capture) {
            await page.evaluate(() => {
              const top = document.querySelector('.services .capabilities').getBoundingClientRect().top + scrollY - 140;
              window.scrollTo({ top, behavior: 'instant' });
            });
            await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            const file = `${locale}-${viewport.width}.png`;
            await page.screenshot({ path: path.join(captures, file), animations: 'disabled' });
            results.screenshots.push({ file: `qa/h8-services-copy/${file}`, locale, width: viewport.width, height: viewport.height });
          }
          results.cases.push({ locale, viewport: [viewport.width, viewport.height], paragraphs: state.paragraphCount, overflow: state.overflow, capabilitiesHeight: Math.round(state.capabilitiesHeight), lineCollisionPoints: state.lineCollisionPoints, lineReady: state.lineReady });
        } catch (error) {
          results.failures.push(`${locale}-${viewport.width}: ${error.message}`);
          throw error;
        } finally {
          await page.close();
        }
      }
    }
    assert.deepEqual(results.consoleErrors, [], 'no browser console errors');
    assert.deepEqual(results.requestFailures, [], 'no failed requests');
    assert.deepEqual(results.failures, [], 'no failed cases');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ cases: results.cases.length, locales: routes.length, viewports: viewports.map(({ width }) => width), screenshots: results.screenshots.length, consoleErrors: results.consoleErrors.length, requestFailures: results.requestFailures.length, status: 'PASS' }));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.error(error);
  process.exitCode = 1;
});
