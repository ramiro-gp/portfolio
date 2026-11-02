import type { APIRoute } from 'astro';
import { localeCodes, routes } from '../content/locales';

export const GET = (({ site }) => {
  if (!site) throw new Error('Astro site must be configured for the sitemap.');
  const entries = localeCodes.map((locale) => {
    const url = new URL(routes[locale], site).href;
    const alternates = localeCodes.map((code) => `<xhtml:link rel="alternate" hreflang="${code}" href="${new URL(routes[code], site).href}"/>`).join('');
    return `<url><loc>${url}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${new URL('/', site).href}"/></url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}<url><loc>${new URL('/privacidad/', site).href}</loc></url></urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}) satisfies APIRoute;
