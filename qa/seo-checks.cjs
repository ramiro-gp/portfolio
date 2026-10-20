#!/usr/bin/env node
// Initial-response SEO audit. No browser rendering, credentials, or external packages.
// node qa/seo-checks.cjs --base http://127.0.0.1:4321 --out qa/seo-local-results.json
// node qa/seo-checks.cjs --base https://ramita.dev --out qa/seo-public-results.json
const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--help') {
    console.log('Usage: node qa/seo-checks.cjs [--base http://127.0.0.1:4321] [--site https://ramita.dev] [--dist dist] [--out NEW.json]');
    process.exit(0);
  }
  if (!['--base', '--site', '--out', '--dist'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--')) {
    throw new Error(`Unknown or incomplete option: ${args[i]}`);
  }
  options[args[i].slice(2)] = args[++i];
}
function origin(value) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('Base/site must be a plain HTTP(S) origin without credentials, path, query, or fragment.');
  }
  return url.origin;
}
const base = origin(options.base || 'http://127.0.0.1:4321');
const site = origin(options.site || 'https://ramita.dev');
const production = base === site;
const staticRoot = options.dist ? path.resolve(options.dist) : null;
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const out = path.resolve(options.out || path.join(__dirname, `seo-${production ? 'public' : 'local'}-${stamp}.json`));
if (fs.existsSync(out)) throw new Error('Output exists; choose a new --out file to preserve earlier evidence.');
const locales = [
  { code: 'es', route: '/' }, { code: 'en', route: '/en/' },
  { code: 'pt', route: '/pt/' }, { code: 'fr', route: '/fr/' }, { code: 'ja', route: '/ja/' },
];
const result = {
  date: new Date().toISOString(), base, site, staticRoot, scope: staticRoot ? 'generated files only; no HTTP validation' : production ? 'production initial HTTP responses' : 'local/preview initial HTTP responses',
  limitations: ['No JavaScript execution or visual QA.', 'Structural HTML/XML and JSON-LD checks are not a full HTML or Schema.org validator.', 'Indexability checks do not prove indexing or search performance.'],
  checks: [], findings: [], unavailable: [], pages: [], assets: [], redirects: [], duplicates: [], skipped: [],
};
if (staticRoot) result.skipped.push({ name: 'HTTP status, headers, MIME, redirects and effective hosting 404 behavior', reason: '--dist reads generated files only; content types are inferred from extensions.' });
function check(condition, name, evidence, priority = 'P1') {
  result.checks.push({ name, pass: Boolean(condition), evidence });
  if (!condition) result.findings.push({ priority, name, evidence });
}
function warning(name, evidence, priority = 'P2') { result.findings.push({ priority, name, evidence, advisory: true }); }
function decode(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) => {
    if (entity[0] === '#') {
      const point = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : '\uFFFD';
    }
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }[entity.toLowerCase()];
  });
}
// Handles quoted attributes and raw script/style text; designed for generated static HTML.
function parse(markup, xml = false) {
  const root = { tag: '#document', attrs: {}, children: [] };
  const stack = [root];
  const problems = [];
  const voids = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
  let cursor = 0;
  while (cursor < markup.length) {
    const parent = stack.at(-1);
    if (!xml && ['script', 'style'].includes(parent.tag)) {
      const end = markup.toLowerCase().indexOf(`</${parent.tag}`, cursor);
      parent.children.push({ tag: '#text', value: markup.slice(cursor, end < 0 ? markup.length : end) });
      cursor = end < 0 ? markup.length : end;
      if (end < 0) break;
    }
    if (markup.startsWith('<!--', cursor)) {
      const end = markup.indexOf('-->', cursor + 4);
      if (end < 0) problems.push('Unterminated comment');
      cursor = end < 0 ? markup.length : end + 3;
      continue;
    }
    if (markup[cursor] !== '<') {
      const end = markup.indexOf('<', cursor);
      stack.at(-1).children.push({ tag: '#text', value: decode(markup.slice(cursor, end < 0 ? markup.length : end)) });
      cursor = end < 0 ? markup.length : end;
      continue;
    }
    const token = /^<\/?(?:[^>"']|"[^"]*"|'[^']*')*>/.exec(markup.slice(cursor));
    if (!token) { problems.push('Malformed tag'); cursor++; continue; }
    const raw = token[0]; cursor += raw.length;
    if (/^<[!?]/.test(raw)) continue;
    const name = /^<\/?([\w:-]+)/.exec(raw)?.[1]?.toLowerCase();
    if (!name) { problems.push('Missing tag name'); continue; }
    if (raw.startsWith('</')) {
      const found = stack.findLastIndex(node => node.tag === name);
      if (found < 1) { problems.push(`Unmatched closing ${name}`); continue; }
      if (xml && found !== stack.length - 1) problems.push(`Mismatched closing ${name}`);
      stack.length = found;
      continue;
    }
    const attrs = {};
    const attrSource = raw.slice(raw.toLowerCase().indexOf(name) + name.length).replace(/\/?\s*>$/, '');
    const attrPattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    for (const match of attrSource.matchAll(attrPattern)) attrs[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? '');
    const node = { tag: name, attrs, children: [] };
    stack.at(-1).children.push(node);
    if (!/\/\s*>$/.test(raw) && (xml || !voids.has(name))) stack.push(node);
  }
  if (xml && stack.length > 1) problems.push(`Unclosed XML elements: ${stack.slice(1).map(node => node.tag).join(', ')}`);
  return { root, problems };
}
function all(node, predicate) {
  return node.children.flatMap(child => child.tag === '#text' ? [] : [...(predicate(child) ? [child] : []), ...all(child, predicate)]);
}
function text(node) { return node.children.map(child => child.tag === '#text' ? child.value : text(child)).join('').replace(/\s+/g, ' ').trim(); }
function hasClass(node, name) { return (node.attrs.class || '').split(/\s+/).includes(name); }
function metadata(root, name) { return all(root, node => node.tag === 'meta' && (node.attrs.name === name || node.attrs.property === name)); }
function links(root, rel) { return all(root, node => node.tag === 'link' && (node.attrs.rel || '').split(/\s+/).includes(rel)); }
function absolute(value, pageUrl) { try { return new URL(value, pageUrl).href; } catch { return null; } }
function mapped(url) { const target = new URL(url); return target.origin === site ? new URL(target.pathname + target.search, base).href : target.href; }
function robotsGroups(body) {
  const groups = [];
  let group = null;
  for (const raw of body.split(/\r?\n/)) {
    const match = /^([^:]+):\s*(.*)$/.exec(raw.replace(/#.*$/, '').trim());
    if (!match) continue;
    const directive = match[1].trim().toLowerCase();
    const value = match[2].trim();
    if (directive === 'user-agent') {
      if (!value) continue;
      if (!group || group.hasRules) { group = { agents: [], rules: [], hasRules: false }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(directive)) {
      group.hasRules = true;
      if (value) group.rules.push({ directive, value });
    }
  }
  return groups;
}
function robotsAllows(groups, agent, route) {
  const scored = groups.map(group => ({ group, score: Math.max(-1, ...group.agents.map(value => value === '*' ? 0 : agent.toLowerCase().includes(value) ? value.length : -1)) }));
  const specificity = Math.max(-1, ...scored.map(item => item.score));
  const rules = scored.filter(item => item.score === specificity && specificity >= 0).flatMap(item => item.group.rules);
  let winner = null;
  for (const rule of rules) {
    const end = rule.value.endsWith('$');
    const pattern = (end ? rule.value.slice(0, -1) : rule.value).split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
    if (!new RegExp(`^${pattern}${end ? '$' : ''}`).test(route)) continue;
    const length = Buffer.byteLength(rule.value.replace(/\*/g, '').replace(/\$$/, ''));
    if (!winner || length > winner.length || length === winner.length && rule.directive === 'allow') winner = { ...rule, length };
  }
  return !winner || winner.directive === 'allow';
}
const headers = ['content-type', 'content-encoding', 'cache-control', 'vary', 'x-robots-tag', 'location', 'server', 'x-powered-by', 'x-hcdn-cache-status'];
async function request(url) {
  if (staticRoot) {
    const target = new URL(url);
    if (![base, site].includes(target.origin)) throw new Error('External resources cannot be verified in --dist mode.');
    const pathname = decodeURIComponent(target.pathname);
    const relative = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
    let file = path.resolve(staticRoot, '.' + relative);
    if (path.relative(staticRoot, file).startsWith('..') || path.isAbsolute(path.relative(staticRoot, file))) throw new Error('File path escapes --dist directory.');
    const found = fs.existsSync(file) && fs.statSync(file).isFile();
    if (!found) file = path.join(staticRoot, '404.html');
    const bytes = fs.readFileSync(file);
    const mime = { '.html': 'text/html', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' }[path.extname(file)] || 'application/octet-stream';
    return { url, status: null, headers: { 'content-type': mime }, body: bytes.toString('utf8'), bytes: bytes.length, file, found };
  }
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  const bytes = Buffer.from(await response.arrayBuffer());
  return { url, status: response.status, headers: Object.fromEntries(headers.filter(name => response.headers.has(name)).map(name => [name, response.headers.get(name)])), body: bytes.toString('utf8'), bytes: bytes.length };
}
async function guarded(name, action) {
  try { await action(); }
  catch (error) { result.unavailable.push({ name, reason: `${error.name}: ${error.message}`, code: error.cause?.code || error.code || null }); }
}
const resources = new Map();
async function asset(url, expectedType) {
  if (!url) return;
  const target = mapped(url);
  if (!resources.has(target)) resources.set(target, request(target));
  const response = await resources.get(target);
  if (staticRoot) check(response.found && response.bytes > 0, `Generated asset exists and is nonempty: ${url}`, { file: response.file, bytes: response.bytes });
  else {
    check(response.status === 200, `Asset HTTP 200: ${url}`, { status: response.status });
    check(expectedType.test(response.headers['content-type'] || ''), `Asset MIME: ${url}`, response.headers['content-type']);
  }
  if (!result.assets.some(item => item.url === url)) result.assets.push({ url, requestedUrl: target, status: response.status, bytes: response.bytes, headers: response.headers });
}
const documents = new Map();
async function pageAudit(locale) {
  const canonical = site + locale.route;
  const response = await request(base + locale.route);
  const { root, problems } = parse(response.body);
  documents.set(locale.route, root);
  const html = all(root, node => node.tag === 'html');
  const title = all(root, node => node.tag === 'title');
  const descriptions = metadata(root, 'description');
  const canonicalLinks = links(root, 'canonical');
  const alternates = links(root, 'alternate').filter(node => node.attrs.hreflang);
  if (staticRoot) check(response.found, `${locale.code}: generated page exists`, response.file, 'P0');
  else {
    check(response.status === 200, `${locale.code}: page HTTP 200`, response.status, 'P0');
    check(/text\/html/i.test(response.headers['content-type'] || ''), `${locale.code}: HTML MIME`, response.headers['content-type']);
  }
  check(html.length === 1 && html[0].attrs.lang === locale.code, `${locale.code}: html language`, html.map(node => node.attrs.lang));
  check(title.length === 1 && text(title[0]).length > 0, `${locale.code}: unique nonempty title`, title.map(text));
  check(descriptions.length === 1 && descriptions[0].attrs.content?.trim().length > 0, `${locale.code}: unique nonempty description`, descriptions.map(node => node.attrs.content));
  check(canonicalLinks.length === 1 && canonicalLinks[0].attrs.href === canonical, `${locale.code}: self canonical`, canonicalLinks.map(node => node.attrs.href));
  const robots = [...metadata(root, 'robots'), ...metadata(root, 'googlebot'), ...metadata(root, 'bingbot')].map(node => node.attrs.content || '');
  check(!robots.some(value => /(?:^|[\s,])(noindex|none)(?:[\s,]|$)/i.test(value)) && !/(?:^|[\s,:])(noindex|none)(?:[\s,]|$)/i.test(response.headers['x-robots-tag'] || ''), `${locale.code}: indexing directives allow indexing`, { meta: robots, header: response.headers['x-robots-tag'] }, 'P0');
  check(alternates.length === locales.length + 1, `${locale.code}: hreflang count`, alternates.length);
  for (const alternative of [...locales, { code: 'x-default', route: '/' }]) {
    const found = alternates.filter(node => node.attrs.hreflang === alternative.code);
    check(found.length === 1 && found[0].attrs.href === site + alternative.route, `${locale.code}: hreflang ${alternative.code}`, found.map(node => node.attrs.href));
  }
  for (const name of ['og:type', 'og:url', 'og:site_name', 'og:title', 'og:description', 'og:image', 'og:image:alt', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) {
    const tags = metadata(root, name);
    check(tags.length === 1 && Boolean(tags[0].attrs.content?.trim()), `${locale.code}: ${name}`, tags.map(node => node.attrs.content));
  }
  check(metadata(root, 'og:url')[0]?.attrs.content === canonical, `${locale.code}: OG URL agrees with canonical`, metadata(root, 'og:url')[0]?.attrs.content);
  check(metadata(root, 'twitter:card')[0]?.attrs.content === 'summary_large_image', `${locale.code}: social card type`, metadata(root, 'twitter:card')[0]?.attrs.content);
  const social = metadata(root, 'og:image')[0]?.attrs.content;
  check(Boolean(social && absolute(social, canonical) === social && social.startsWith(`${site}/`)), `${locale.code}: absolute social image`, social);
  check(social === metadata(root, 'twitter:image')[0]?.attrs.content, `${locale.code}: OG/Twitter share image`, social);
  if (social) await asset(social, /^image\/png(?:;|$)/i);
  const h1s = all(root, node => node.tag === 'h1');
  const main = all(root, node => node.tag === 'main');
  check(h1s.length === 1 && text(h1s[0]).length > 0, `${locale.code}: single populated H1 in initial HTML`, h1s.map(text));
  check(main.length === 1, `${locale.code}: single main landmark`, main.length);
  const services = all(root, node => node.attrs.id === 'servicios')[0];
  const serviceHeadings = services ? all(services, node => node.tag === 'h3').map(text) : [];
  check(serviceHeadings.length === 3 && serviceHeadings.every(Boolean) && all(services || root, node => node.tag === 'p' && text(node).length > 20).length >= 3, `${locale.code}: three explained services in initial HTML`, serviceHeadings);
  const projects = all(root, node => hasClass(node, 'project-case'));
  check(projects.length === 2 && ['Residencias Grupo Casa', 'LingoHive'].every(name => projects.some(node => text(node).includes(name))), `${locale.code}: both real project cases in initial HTML`, projects.map(node => all(node, child => child.tag === 'h3').map(text)));
  const anchors = all(root, node => node.tag === 'a');
  check(anchors.some(node => node.attrs.href === 'mailto:ramirogperucho@gmail.com' && text(node).includes('@gmail.com')), `${locale.code}: actionable email in initial HTML`, 'mailto anchor + address text');
  check(anchors.some(node => node.attrs.href === 'https://wa.me/5491151354489' && /5135/.test(text(node))), `${locale.code}: actionable WhatsApp in initial HTML`, 'WhatsApp anchor + number text');
  const images = all(root, node => node.tag === 'img');
  for (const image of images) {
    check(Boolean(image.attrs.alt?.trim()), `${locale.code}: meaningful image alt`, image.attrs.src);
    check(Number(image.attrs.width) > 0 && Number(image.attrs.height) > 0, `${locale.code}: image dimensions reserve layout`, image.attrs.src);
    await asset(absolute(image.attrs.src, canonical), /^image\//i);
  }
  check(images.length >= 4, `${locale.code}: project visual evidence in HTML`, images.length);
  const ids = all(root, node => node.attrs.id).map(node => node.attrs.id);
  check(ids.length === new Set(ids).size, `${locale.code}: unique element IDs`, ids.filter((id, index) => ids.indexOf(id) !== index));
  check(!/TODO_CONTENT|TODO_ASSET/.test(response.body), `${locale.code}: no public content placeholders`, 'TODO_CONTENT/TODO_ASSET scan');
  const schema = [];
  for (const script of all(root, node => node.tag === 'script' && node.attrs.type === 'application/ld+json')) {
    try {
      const parsed = JSON.parse(script.children.map(child => child.value || '').join(''));
      check(parsed['@context'] === 'https://schema.org' || parsed['@context'] === 'http://schema.org' || Array.isArray(parsed), `${locale.code}: JSON-LD context`, parsed['@context']);
      schema.push(...(Array.isArray(parsed) ? parsed : parsed['@graph'] || [parsed]));
    } catch (error) { check(false, `${locale.code}: JSON-LD parses`, error.message); }
  }
  const people = schema.filter(node => [].concat(node['@type'] || []).includes('Person'));
  check(people.length === 1 && people[0].name === 'Ramiro Garcia' && people[0].url === site + '/' && [].concat(people[0].sameAs || []).includes('https://github.com/ramiro-gp'), `${locale.code}: factual Person JSON-LD`, people);
  for (const node of schema) check(Boolean(node['@type']), `${locale.code}: JSON-LD node has a type`, node['@id'] || node.name);
  const websites = schema.filter(node => [].concat(node['@type'] || []).includes('WebSite'));
  check(websites.length <= 1, `${locale.code}: at most one WebSite entity`, websites.length);
  for (const website of websites) check(website.name === 'ramita.dev' && website.url === site + '/', `${locale.code}: WebSite identifies the canonical site`, website);
  for (const icon of links(root, 'icon').concat(links(root, 'apple-touch-icon'))) await asset(absolute(icon.attrs.href, canonical), /^image\//i);
  result.pages.push({ locale: locale.code, route: locale.route, status: response.status, headers: response.headers, bytes: response.bytes, title: title.map(text), description: descriptions.map(node => node.attrs.content), canonical: canonicalLinks.map(node => node.attrs.href), hreflang: alternates.map(node => ({ lang: node.attrs.hreflang, url: node.attrs.href })), headings: all(root, node => /^h[1-6]$/.test(node.tag)).map(node => ({ level: node.tag, text: text(node) })), images: images.length, schemaTypes: schema.map(node => node['@type']), parseProblems: problems });
}
async function redirectAudit(url, expected, requirePermanent) {
  const chain = [];
  let next = url;
  for (let i = 0; i < 8; i++) {
    const response = await request(next);
    chain.push({ url: next, status: response.status, location: response.headers.location || null });
    if (![301, 302, 303, 307, 308].includes(response.status) || !response.headers.location) break;
    next = new URL(response.headers.location, next).href;
    if (chain.some(item => item.url === next)) break;
  }
  result.redirects.push({ initial: url, expected, chain });
  const last = chain.at(-1);
  check(last?.url === expected && last.status === 200, `Redirect reaches canonical: ${url}`, chain, 'P1');
  if (requirePermanent) check(chain.length >= 2 && chain.slice(0, -1).every(item => [301, 308].includes(item.status)), `Redirect is permanent: ${url}`, chain);
}
async function main() {
  for (const locale of locales) await guarded(`${locale.code}: initial page request`, () => pageAudit(locale));
  for (const [route, root] of documents) {
    for (const anchor of all(root, node => node.tag === 'a' && node.attrs.href)) {
      const url = absolute(anchor.attrs.href, site + route);
      if (!url) { check(false, `${route}: valid anchor URL`, anchor.attrs.href); continue; }
      const parsed = new URL(url);
      if (![site, base].includes(parsed.origin)) continue;
      const destination = documents.get(parsed.pathname);
      check(Boolean(destination), `${route}: internal link targets a real page`, anchor.attrs.href);
      if (destination && parsed.hash && parsed.hash !== '#') {
        const id = decodeURIComponent(parsed.hash.slice(1));
        check(all(destination, node => node.attrs.id === id).length === 1, `${route}: internal fragment exists`, anchor.attrs.href);
      }
    }
  }
  for (const key of result.pages.length === locales.length ? ['title', 'description'] : []) {
    const values = result.pages.map(page => page[key][0]).filter(Boolean);
    check(values.length === locales.length && new Set(values).size === values.length, `Localized ${key}s are distinct`, values);
  }
  await guarded('robots request', async () => {
    const response = await request(base + '/robots.txt');
    result.robots = { status: response.status, headers: response.headers, body: response.body };
    if (staticRoot) check(response.found, 'Generated robots file exists', response.file, 'P0');
    else check(response.status === 200 && /text\/plain/i.test(response.headers['content-type'] || ''), 'robots HTTP/MIME', { status: response.status, headers: response.headers }, 'P0');
    check(!/<html/i.test(response.body), 'robots is not an HTML fallback', response.status, 'P0');
    const groups = robotsGroups(response.body);
    const crawlPaths = [...new Set([...locales.map(locale => locale.route), '/sitemap.xml', ...result.assets.filter(item => new URL(item.url).origin === site).map(item => new URL(item.url).pathname), ...[...documents.values()].flatMap(root => all(root, node => (node.tag === 'script' && node.attrs.src) || (node.tag === 'link' && ['stylesheet', 'preload'].includes(node.attrs.rel))).map(node => new URL(node.attrs.src || node.attrs.href, site).pathname))])];
    for (const agent of ['Googlebot', 'Bingbot', 'OAI-SearchBot']) {
      const blocked = crawlPaths.filter(route => !robotsAllows(groups, agent, route));
      check(blocked.length === 0, `robots allows canonical pages and critical resources for ${agent}`, { blocked, inspectedPaths: crawlPaths.length }, 'P0');
    }
    check(response.body.split(/\r?\n/).some(line => /^sitemap:\s*/i.test(line) && line.replace(/^sitemap:\s*/i, '').trim() === site + '/sitemap.xml'), 'robots advertises canonical sitemap', response.body);
  });
  await guarded('sitemap request', async () => {
    const response = await request(base + '/sitemap.xml');
    const { root, problems } = parse(response.body, true);
    const urls = all(root, node => node.tag === 'loc').map(text);
    const urlsets = all(root, node => node.tag === 'urlset');
    result.sitemap = { status: response.status, headers: response.headers, urls, parseProblems: problems };
    if (staticRoot) check(response.found, 'Generated sitemap exists', response.file);
    else check(response.status === 200 && /(?:application|text)\/xml/i.test(response.headers['content-type'] || ''), 'sitemap HTTP/MIME', { status: response.status, headers: response.headers });
    check(problems.length === 0 && urlsets.length === 1 && urlsets[0].attrs.xmlns === 'http://www.sitemaps.org/schemas/sitemap/0.9', 'sitemap XML structure/namespace', problems);
    check(urls.length === locales.length && new Set(urls).size === locales.length && locales.every(locale => urls.includes(site + locale.route)), 'sitemap contains exactly the five real canonical pages', urls);
  });
  await guarded('404 request', async () => {
    const missing = '/__seo-audit-missing-route__/';
    const response = await request(base + missing);
    const { root } = parse(response.body);
    result.notFound = { route: missing, status: response.status, headers: response.headers, title: all(root, node => node.tag === 'title').map(text) };
    if (!staticRoot) check(response.status === 404, 'Missing URL returns HTTP 404, not a soft 404', response.status);
    const explicitNoindex = metadata(root, 'robots').some(node => /noindex/i.test(node.attrs.content || ''));
    if (!explicitNoindex && !staticRoot && response.status === 404) warning('404 has no explicit noindex; its HTTP 404 status already signals a missing page', result.notFound.title, 'P3');
    else check(explicitNoindex, 'Generated 404 document is noindex', metadata(root, 'robots').map(node => node.attrs.content), 'P2');
    if (all(root, node => node.tag === 'a' && locales.some(locale => locale.route === node.attrs.href)).length < locales.length) warning('404 lacks the approved five-language recovery navigation', result.notFound.title);
  });
  if (production && !staticRoot) {
    const canonical = new URL(site);
    const www = canonical.hostname.startsWith('www.') ? canonical.hostname.slice(4) : `www.${canonical.hostname}`;
    for (const url of [`http://${canonical.host}/en/?seo-audit=1`, `https://${www}/en/?seo-audit=1`]) {
      await guarded(`Public redirect ${url}`, () => redirectAudit(url, site + '/en/?seo-audit=1', true));
    }
    await guarded('Trailing slash redirect', () => redirectAudit(base + '/en', site + '/en/', true));
  } else result.skipped.push({ name: 'Public HTTP/www/trailing-slash redirects', reason: 'Local/preview server does not establish production host redirect behavior.' });
  for (const locale of locales) await guarded(`${locale.code}: index.html duplicate probe`, async () => {
    const url = base + locale.route + 'index.html';
    const response = await request(url);
    const { root } = parse(response.body);
    const canonical = links(root, 'canonical').map(node => node.attrs.href);
    result.duplicates.push({ url, status: response.status, location: response.headers.location || null, canonical });
    if (response.status === 200) warning('Duplicate index.html URL serves HTTP 200', { url, canonical, consolidatedByCanonical: canonical.length === 1 && canonical[0] === site + locale.route });
  });
}
main().catch(error => check(false, 'Audit runner', `${error.name}: ${error.message}`)).finally(() => {
  result.summary = { checks: result.checks.length, failures: result.checks.filter(item => !item.pass).length, advisories: result.findings.filter(item => item.advisory).length, unavailable: result.unavailable.length, pages: result.pages.length, assets: result.assets.length };
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ ...result.summary, output: out, findings: result.findings, unavailableDetails: result.unavailable }, null, 2));
  if (result.summary.failures) process.exitCode = 1;
  else if (result.summary.unavailable) process.exitCode = 2;
});
