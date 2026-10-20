// Read-only deployment verification; writes new evidence and public payloads locally.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = process.cwd();
const label = process.argv[2] || '2026-10-20';
assert.match(label, /^[a-zA-Z0-9-]+$/);
const out = path.join(root, 'qa/seo', `deployment-http-${label}.json`);
const payloads = path.join(root, 'release', `public-payloads-${label}`);
await fs.access(out).then(() => { throw new Error('Evidence already exists'); }, () => {});
await fs.mkdir(payloads, { recursive: true });
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const manifest = (await fs.readFile('release/ramita-seo-2026-10-19-worktree.sha256', 'utf8'))
  .trim().split(/\r?\n/).map(line => /^([a-f0-9]{64})  (.+)$/.exec(line))
  .filter(row => row && !row[2].endsWith('.zip'));
assert.equal(manifest.length, 25);
const result = { at: new Date().toISOString(), base: 'https://ramita.dev', files: [], redirects: [], missing: [], bots: [], failures: [], pngComparisonsPending: [] };
const check = (condition, name) => { if (!condition) result.failures.push(name); };
async function get(url, options = {}) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(25000), ...options });
  return { response, bytes: Buffer.from(await response.arrayBuffer()) };
}
for (const [ , expected, file ] of manifest) {
  const { response, bytes } = await get(`${result.base}/${file}`);
  const actual = digest(bytes);
  await fs.mkdir(path.dirname(path.join(payloads, file)), { recursive: true });
  await fs.writeFile(path.join(payloads, file), bytes);
  const record = { file, status: response.status, type: response.headers.get('content-type'), expected, actual, matches: actual === expected, bytes: bytes.length };
  result.files.push(record);
  check(response.status === 200, `${file}: HTTP 200`);
  if (!record.matches && file.endsWith('.png')) result.pngComparisonsPending.push(file);
  else check(record.matches, `${file}: exact build bytes`);
}
for (const route of ['/', '/en/', '/pt/', '/fr/', '/ja/', '/en/?seo-closure=1&keep=a%2Bb']) {
  const url = `https://www.ramita.dev${route}`;
  const { response } = await get(url);
  const location = response.headers.get('location');
  const expected = `${result.base}${route}`;
  const final = await fetch(url, { signal: AbortSignal.timeout(25000) });
  result.redirects.push({ url, status: response.status, location, finalStatus: final.status, finalUrl: final.url });
  check(response.status === 301 && location === expected, `${url}: permanent redirect preserving path/query`);
  check(final.status === 200 && final.url === expected, `${url}: final canonical response without loop`);
}
for (const url of ['http://ramita.dev/en/?seo-closure=1', 'http://www.ramita.dev/en/?seo-closure=1']) {
  const { response } = await get(url);
  const final = await fetch(url, { signal: AbortSignal.timeout(25000) });
  result.redirects.push({ url, status: response.status, location: response.headers.get('location'), finalStatus: final.status, finalUrl: final.url });
  check(response.status === 301 && final.status === 200 && final.url === 'https://ramita.dev/en/?seo-closure=1', `${url}: HTTPS canonical redirect`);
}
const expected404 = await fs.readFile('dist/404.html');
for (const route of ['/seo-closure-missing-20261020/', '/en/seo-closure-missing-20261020/', '/ja/seo-closure-missing-20261020/']) {
  const { response, bytes } = await get(`${result.base}${route}`);
  result.missing.push({ route, status: response.status, location: response.headers.get('location'), matchesCustom404: digest(bytes) === digest(expected404), sha256: digest(bytes) });
  check(response.status === 404 && !response.headers.get('location') && digest(bytes) === digest(expected404), `${route}: real custom 404`);
}
for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot']) {
  for (const route of ['/', '/en/', '/pt/', '/fr/', '/ja/', '/robots.txt', '/sitemap.xml']) {
    const { response, bytes } = await get(`${result.base}${route}`, { headers: { 'User-Agent': bot } });
    const file = route.endsWith('/') ? `${route.slice(1)}index.html` : route.slice(1);
    const expected = manifest.find(row => row[2] === file)[1];
    result.bots.push({ bot, route, status: response.status, matchesExpected: digest(bytes) === expected, xRobotsTag: response.headers.get('x-robots-tag') });
    check(response.status === 200 && digest(bytes) === expected && !/noindex|none/i.test(response.headers.get('x-robots-tag') || ''), `${bot} ${route}: accessible expected content`);
  }
}
result.finishedAt = new Date().toISOString();
await fs.writeFile(out, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ out, files: result.files.length, exact: result.files.filter(row => row.matches).length, pngComparisonsPending: result.pngComparisonsPending, redirects: result.redirects.length, custom404: result.missing, bots: result.bots.length, failures: result.failures }, null, 2));
process.exitCode = result.failures.length ? 1 : 0;
