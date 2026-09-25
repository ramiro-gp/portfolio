const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/ramiro/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const root = path.join(__dirname, '..');
const base = process.env.QA_BASE || 'http://127.0.0.1:4324';
const site = 'https://ramita.dev';
const pages = {
  '/': {
    lang: 'es', title: 'ramita | Diseño y desarrollo web',
    description: 'Diseño y desarrollo de sitios web nuevos y rediseños. Trabajo directo con Ramiro Garcia desde la definición hasta la publicación.',
    socialTitle: 'Ramiro Garcia — Diseño y desarrollo de sitios web',
    socialDescription: 'Sitios institucionales, landing pages y rediseños, con trato directo.',
  },
  '/en/': {
    lang: 'en', title: 'ramita | Web design & development',
    description: 'Website design and development for new sites and redesigns. Work directly with Ramiro Garcia, from definition through publication.',
    socialTitle: 'Ramiro Garcia — Website design and development',
    socialDescription: 'Institutional websites, landing pages and redesigns, with a direct point of contact.',
  },
  '/pt/': {
    lang: 'pt', title: 'ramita | Design e desenvolvimento web',
    description: 'Design e desenvolvimento de sites novos e redesigns. Trabalho direto com Ramiro Garcia, da definição à publicação.',
    socialTitle: 'Ramiro Garcia — Design e desenvolvimento de sites',
    socialDescription: 'Sites institucionais, landing pages e redesigns, com contato direto.',
  },
  '/fr/': {
    lang: 'fr', title: 'ramita | Design et développement web',
    description: 'Conception et développement de nouveaux sites web et refontes. Un travail direct avec Ramiro Garcia, de la définition à la mise en ligne.',
    socialTitle: 'Ramiro Garcia — Conception et développement de sites web',
    socialDescription: 'Sites institutionnels, landing pages et refontes, avec un interlocuteur direct.',
  },
  '/ja/': {
    lang: 'ja', title: 'ramita | Webデザイン・開発',
    description: '新規サイトとリニューアルのデザイン・開発。Ramiro Garcia が構想の整理から公開まで直接対応します。',
    socialTitle: 'Ramiro Garcia — ウェブサイトのデザインと開発',
    socialDescription: '企業・団体サイト、ランディングページ、リニューアルに直接対応します。',
  },
};
const urls = Object.keys(pages).map((route) => site + route);

function pngDimensions(file) {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), bytes: bytes.length };
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Users/ramiro/AppData/Local/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-win64/chrome-headless-shell.exe',
  });
  const report = { pages: [], assets: {}, sitemap: [], javascriptBytes: 0 };
  try {
    const jsFiles = fs.readdirSync(path.join(root, 'dist/_astro')).filter((file) => file.endsWith('.js'));
    assert.equal(jsFiles.length, 1);
    assert.equal(jsFiles[0], 'BaseLayout.astro_astro_type_script_index_0_lang.C3d_n1Ls.js', 'H6.F must not change the client JS bundle');
    report.javascriptBytes = fs.statSync(path.join(root, 'dist/_astro', jsFiles[0])).size;
    assert.equal(report.javascriptBytes, 18629, 'H6.F must not change the client JS payload');

    for (const [route, expected] of Object.entries(pages)) {
      const errors = [];
      const socialRequests = [];
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: route === '/ja/' ? 'reduce' : 'no-preference' });
      await page.addInitScript(() => {
        window.__h6fShifts = [];
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__h6fShifts.push(entry.value);
        }).observe({ type: 'layout-shift', buffered: true });
      });
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => { if (request.url().includes('/social/')) socialRequests.push(request.url()); });
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await page.evaluate(async () => { await document.fonts.ready; });

      const result = await page.evaluate(() => {
        const one = (selector) => {
          const matches = [...document.head.querySelectorAll(selector)];
          return { count: matches.length, value: matches[0]?.getAttribute('content') || matches[0]?.getAttribute('href') || '' };
        };
        return {
          lang: document.documentElement.lang,
          title: document.title,
          description: one('meta[name="description"]'),
          canonical: one('link[rel="canonical"]'),
          alternates: [...document.head.querySelectorAll('link[rel="alternate"][hreflang]')].map((link) => [link.getAttribute('hreflang'), link.href]),
          icons: [...document.head.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"]')].map((link) => [link.rel, link.getAttribute('href')]),
          og: Object.fromEntries([...document.head.querySelectorAll('meta[property^="og:"]')].map((meta) => [meta.getAttribute('property'), meta.content])),
          twitter: Object.fromEntries([...document.head.querySelectorAll('meta[name^="twitter:"]')].map((meta) => [meta.name, meta.content])),
          robots: one('meta[name="robots"]'),
          jsonLd: [...document.head.querySelectorAll('script[type="application/ld+json"]')].map((script) => JSON.parse(script.textContent)),
          cls: window.__h6fShifts.reduce((sum, value) => sum + value, 0),
          overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        };
      });
      assert.equal(result.lang, expected.lang);
      assert.equal(result.title, expected.title);
      assert.deepEqual(result.description, { count: 1, value: expected.description });
      assert.deepEqual(result.canonical, { count: 1, value: site + route });
      assert.deepEqual(result.alternates, [...Object.entries(pages).map(([otherRoute, other]) => [other.lang, site + otherRoute]), ['x-default', site + '/']]);
      assert.deepEqual(result.icons, [['icon', '/favicon.ico'], ['icon', '/favicon.svg'], ['apple-touch-icon', '/apple-touch-icon.png']]);
      assert.deepEqual(result.og, {
        'og:type': 'website', 'og:url': site + route, 'og:site_name': 'ramita.dev',
        'og:title': expected.socialTitle, 'og:description': expected.socialDescription,
        'og:image': site + `/social/ramita-${expected.lang}.png`, 'og:image:type': 'image/png',
        'og:image:width': '1200', 'og:image:height': '630',
        'og:image:alt': `ramita.dev — ${expected.socialTitle}`,
      });
      assert.deepEqual(result.twitter, {
        'twitter:card': 'summary_large_image', 'twitter:title': expected.socialTitle,
        'twitter:description': expected.socialDescription,
        'twitter:image': site + `/social/ramita-${expected.lang}.png`,
        'twitter:image:alt': `ramita.dev — ${expected.socialTitle}`,
      });
      assert.equal(result.robots.count, 0);
      assert.deepEqual(result.jsonLd, [{ '@context': 'https://schema.org', '@type': 'Person', name: 'Ramiro Garcia', url: site + '/', sameAs: ['https://github.com/ramiro-gp'] }]);
      assert.equal(result.cls, 0);
      assert.equal(result.overflow, 0);
      assert.deepEqual(socialRequests, []);
      assert.deepEqual(errors, []);
      report.pages.push({ route, ...result, socialRequests, errors });
      await page.close();
    }

    const request = await browser.newContext();
    const robots = await request.request.get(base + '/robots.txt');
    assert.equal(robots.status(), 200);
    assert.match(robots.headers()['content-type'], /^text\/plain/);
    const robotsText = await robots.text();
    assert.equal(robotsText.trim(), 'User-agent: *\nAllow: /\nSitemap: https://ramita.dev/sitemap.xml');
    const sitemap = await request.request.get(base + '/sitemap.xml');
    assert.equal(sitemap.status(), 200);
    assert.match(sitemap.headers()['content-type'], /^(application|text)\/xml/);
    const sitemapText = await sitemap.text();
    const xmlPage = await request.newPage();
    report.sitemap = await xmlPage.evaluate((xml) => {
      const document = new DOMParser().parseFromString(xml, 'application/xml');
      return { errors: document.querySelectorAll('parsererror').length, locs: [...document.getElementsByTagName('loc')].map((node) => node.textContent), lastmod: document.getElementsByTagName('lastmod').length };
    }, sitemapText);
    assert.deepEqual(report.sitemap, { errors: 0, locs: urls, lastmod: 0 });
    await xmlPage.close();
    await request.close();

    const assetTypes = {
      'favicon.ico': 'image/x-icon',
      'favicon.svg': 'image/svg+xml',
      'apple-touch-icon.png': 'image/png',
      ...Object.fromEntries(Object.values(pages).map((item) => [`social/ramita-${item.lang}.png`, 'image/png'])),
    };
    for (const [name, type] of Object.entries(assetTypes)) {
      const asset = await browser.newContext();
      const response = await asset.request.get(base + '/' + name);
      assert.equal(response.status(), 200, name);
      assert(response.headers()['content-type'].startsWith(type), name);
      report.assets[name] = { bytes: fs.statSync(path.join(root, 'public', name)).size, contentType: response.headers()['content-type'] };
      await asset.close();
    }
    const ico = fs.readFileSync(path.join(root, 'public/favicon.ico'));
    const iconCount = ico.readUInt16LE(4);
    assert.equal(iconCount, 3);
    report.assets['favicon.ico'].sizes = Array.from({ length: iconCount }, (_, i) => ico.readUInt8(6 + 16 * i)).sort((a, b) => a - b);
    assert.deepEqual(report.assets['favicon.ico'].sizes, [16, 32, 64]);
    const appleDimensions = pngDimensions(path.join(root, 'public/apple-touch-icon.png'));
    assert.deepEqual([appleDimensions.width, appleDimensions.height], [180, 180]);
    const svg = fs.readFileSync(path.join(root, 'public/favicon.svg'), 'utf8');
    assert.equal((svg.match(/<path /g) || []).length, 2);
    assert.doesNotMatch(svg, /<text|@font-face|<image|(?:xlink:)?href=|url\(/i);
    for (const item of Object.values(pages)) {
      const dimensions = pngDimensions(path.join(root, 'public/social', `ramita-${item.lang}.png`));
      assert.deepEqual([dimensions.width, dimensions.height], [1200, 630]);
      assert(dimensions.bytes < 250000);
      report.assets[`social/ramita-${item.lang}.png`].dimensions = dimensions;
    }
    const publicImages = fs.readdirSync(path.join(root, 'public/images')).sort();
    assert.deepEqual(publicImages, ['lingohive-desktop.webp', 'lingohive-mobile.webp', 'residencias-desktop.webp', 'residencias-mobile.webp']);
    report.projectImages = publicImages;
    fs.writeFileSync(path.join(__dirname, 'h6f-results.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(`H6.F QA passed: ${report.pages.length} locales, ${report.sitemap.locs.length} sitemap URLs, no CLS, no social image requests, no console errors.`);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
