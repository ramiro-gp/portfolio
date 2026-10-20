// Read-only public DNS, TLS and HTTP audit. No account access or mutations.
// Usage: node qa/seo-infrastructure.mjs qa/seo/infrastructure-YYYY-MM-DD.json
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import tls from 'node:tls';
import crypto from 'node:crypto';

const output = process.argv[2];
if (!output) throw new Error('Provide a new output path; existing evidence is never overwritten.');
if (fs.existsSync(output)) throw new Error(`Evidence already exists: ${output}`);
const result = { observedAt: new Date().toISOString(), domain: 'ramita.dev', dns: {}, tls: {}, http: [], errors: [] };
const headers = ['content-type', 'content-encoding', 'content-length', 'cache-control', 'vary', 'last-modified', 'x-robots-tag', 'content-security-policy', 'server', 'platform'];

await Promise.all([
  ['A', () => dns.resolve4('ramita.dev')],
  ['AAAA', () => dns.resolve6('ramita.dev')],
  ['NS', () => dns.resolveNs('ramita.dev')],
  ['wwwCNAME', () => dns.resolveCname('www.ramita.dev')],
  ['verificationPresence', async () => {
    const records = (await dns.resolveTxt('ramita.dev')).map(parts => parts.join(''));
    // Verification values are intentionally excluded from saved evidence.
    return { google: records.some(value => value.startsWith('google-site-verification=')), microsoft: records.some(value => /^MS=/.test(value)) };
  }],
].map(async ([name, read]) => {
  try { result.dns[name] = await read(); }
  catch (error) { result.dns[name] = { error: error.code || error.message }; }
}));

try {
  result.tls = await new Promise((resolve, reject) => {
    const socket = tls.connect({ host: 'ramita.dev', port: 443, servername: 'ramita.dev', rejectUnauthorized: true }, () => {
      const cert = socket.getPeerCertificate();
      resolve({ authorized: socket.authorized, protocol: socket.getProtocol(), subject: cert.subject, issuer: cert.issuer, subjectAltName: cert.subjectaltname, validFrom: cert.valid_from, validTo: cert.valid_to });
      socket.end();
    });
    socket.setTimeout(15000, () => socket.destroy(new Error('TLS timeout')));
    socket.once('error', reject);
  });
} catch (error) { result.errors.push({ area: 'tls', error: error.message }); }

const urls = [
  'https://ramita.dev/',
  'http://ramita.dev/en/?seo-audit=1',
  'https://www.ramita.dev/en/?seo-audit=1',
  'http://www.ramita.dev/en/?seo-audit=1',
  'https://ramita.dev/en',
  'https://ramita.dev/index.html',
  'https://ramita.dev/en/index.html',
  'https://ramita.dev/__seo-audit-missing-20261019__/',
  'https://ramita.dev/404.html',
  'https://ramita.dev/robots.txt',
  'https://ramita.dev/sitemap.xml',
  'https://ramita.dev/fonts/InstrumentSans.woff2',
  'https://ramita.dev/images/residencias-mobile.webp',
];
for (const start of urls) {
  const entry = { requested: start, chain: [] };
  try {
    let url = start;
    for (let hop = 0; hop < 6; hop++) {
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
      const bytes = Buffer.from(await response.arrayBuffer());
      const location = response.headers.get('location');
      const item = { url, status: response.status, headers: Object.fromEntries(headers.map(name => [name, response.headers.get(name)]).filter(([, value]) => value !== null)), bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
      if (location) item.location = new URL(location, url).href;
      if (/text\/html/.test(item.headers['content-type'] || '')) {
        const html = bytes.toString('utf8');
        item.title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
        item.canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
      }
      if (url === 'https://ramita.dev/robots.txt') item.body = bytes.toString('utf8');
      entry.chain.push(item);
      if (!location || response.status < 300 || response.status >= 400) break;
      url = new URL(location, url).href;
    }
  } catch (error) { entry.error = error.message; result.errors.push({ area: 'http', url: start, error: error.message }); }
  result.http.push(entry);
}
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ output, tls: result.tls.authorized, http: result.http.map(entry => ({ url: entry.requested, statuses: entry.chain.map(hop => hop.status), final: entry.chain.at(-1)?.url })), errors: result.errors }, null, 2));
if (result.errors.length) process.exitCode = 1;
