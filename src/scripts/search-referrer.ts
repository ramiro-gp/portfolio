// Preserve useful organic attribution without sending search terms, paths,
// account URLs or unknown/private referring hosts to Analytics.
const googleDomains = ['google.com','google.com.ar','google.com.br','google.com.mx','google.com.co','google.cl','google.com.uy','google.es','google.pt','google.fr','google.co.jp','google.co.uk'];
export function searchReferrer(value: string): string {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    const host = url.hostname.replace(/^www\./, '');
    if (googleDomains.includes(host)) return 'https://www.google.com/';
    if (host === 'bing.com') return 'https://www.bing.com/';
    if (host === 'duckduckgo.com') return 'https://duckduckgo.com/';
    if (['search.yahoo.com','search.yahoo.co.jp'].includes(host)) return 'https://search.yahoo.com/';
  } catch { /* Empty, invalid and unrecognized referrers remain undisclosed. */ }
  return '';
}
