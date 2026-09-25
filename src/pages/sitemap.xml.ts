import type { APIRoute } from 'astro';
import { localeCodes, routes } from '../content/locales';

export const GET = (({ site }) => {
  if (!site) throw new Error('Astro site must be configured for the sitemap.');
  const entries = localeCodes.map((locale) => {
    const url = new URL(routes[locale], site).href;
    return `<url><loc>${url}</loc></url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}) satisfies APIRoute;
