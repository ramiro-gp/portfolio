// Basic consent: no Google script, pings or event backlog before acceptance.
// Event parameters are enums. Never forward href, text, clipboard or input values.
import { searchReferrer } from './search-referrer';
type Gtag = (...args: unknown[]) => void;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: Gtag; [key: `ga-disable-${string}`]: boolean };
const win = window as unknown as AnalyticsWindow;
const notice = document.querySelector<HTMLElement>('[data-consent-notice]');
const id = notice?.dataset.measurementId || '';
const paths: Record<string, string> = { '/': 'home_es', '/en/': 'home_en', '/pt/': 'home_pt', '/fr/': 'home_fr', '/ja/': 'home_ja', '/privacidad/': 'privacy' };
const pageId = paths[location.pathname] || '';
const storageKey = 'ramita-consent-v1';
const lifetime = 180 * 24 * 60 * 60 * 1000;
let accepted = false;
let started = false;
const destinations: Record<string, [string, string]> = {
  'mailto:ramirogperucho@gmail.com': ['contact_click', 'email'],
  'https://wa.me/5491151354489': ['contact_click', 'whatsapp'],
  'https://github.com/ramiro-gp': ['social_click', 'github'],
  'https://residenciasgrupocasa.com.ar/': ['project_visit', 'residencias'],
  'https://jlaberturas.com.ar/': ['project_visit', 'jlaberturas'],
  'https://veganrecords.com.ar/': ['project_visit', 'veganrecords'],
  'https://lingo-hive.vercel.app/': ['project_visit', 'lingohive']
};
const sections: Record<string, string> = { inicio: 'hero', servicios: 'services', proyectos: 'projects', ramiro: 'about', contacto: 'contact' };
function sectionOf(element: Element): string {
  if (element.closest('header')) return 'header';
  if (element.closest('footer')) return 'footer';
  return sections[element.closest('main > section')?.id || ''] || 'page';
}
function event(name: string, section: string, destination: string, complete?: () => void): void {
  if (!accepted) return;
  win.gtag?.('event', name, { page_id: pageId, section_id: section, destination_id: destination, site_language: document.documentElement.lang,
    ...(complete ? { event_callback: complete, event_timeout: 250 } : {}) });
}
function readChoice(): boolean | null {
  try {
    const choice = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (choice && typeof choice.accepted === 'boolean' && Number.isFinite(choice.at) && Date.now() - choice.at >= 0 && Date.now() - choice.at < lifetime) return choice.accepted;
  } catch { /* Storage denied: ask each visit, collect nothing by default. */ }
  return null;
}
function start(): void {
  if (started) return;
  started = true;
  win.dataLayer = win.dataLayer || [];
  win.gtag = function (..._args: unknown[]) { win.dataLayer!.push(arguments); };
  win.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  win.gtag('consent', 'update', { analytics_storage: 'granted' });
  win.gtag('js', new Date());
  const referrer = searchReferrer(document.referrer);
  win.gtag('config', id, {
    send_page_view: false,
    page_location: `https://ramita.dev${location.pathname}`,
    page_referrer: referrer,
    page_title: document.title,
    ignore_referrer: !referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: lifetime / 1000,
    cookie_update: false,
    cookie_flags: 'SameSite=Lax;Secure'
  });
  // Exactly one per document; hash navigation is not a new page view.
  event('page_view', 'page', pageId);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.append(script);
}
function eraseAnalyticsCookies(): void {
  for (const part of document.cookie.split(';')) {
    const name = part.trim().split('=')[0] || '';
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of ['', '; domain=ramita.dev', '; domain=.ramita.dev']) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax; Secure`;
    }
  }
}
function choose(value: boolean, persist = true): void {
  accepted = value;
  if (persist) {
    try { localStorage.setItem(storageKey, JSON.stringify({ accepted: value, at: Date.now() })); } catch { /* Choice applies to this document. */ }
  }
  if (notice) notice.hidden = true;
  win[`ga-disable-${id}`] = !value;
  if (value) {
    if (started) win.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    else start();
  }
  else {
    if (started) win.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    eraseAnalyticsCookies();
  }
}
if (notice && /^G-[A-Z0-9]+$/.test(id) && pageId && location.hostname === 'ramita.dev') {
  const previous = readChoice();
  if (previous === null) notice.hidden = false;
  else choose(previous, false);
  notice.querySelector('[data-consent-accept]')?.addEventListener('click', () => choose(true));
  notice.querySelector('[data-consent-reject]')?.addEventListener('click', () => choose(false));
  document.querySelectorAll<HTMLButtonElement>('[data-consent-preferences]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => { notice.hidden = false; notice.querySelector<HTMLButtonElement>('[data-consent-accept]')?.focus(); });
  });
  document.addEventListener('click', (click) => {
    if (!(click.target instanceof Element)) return;
    const link = click.target.closest('a');
    if (!link) return;
    const known = destinations[link.href];
    if (known) {
      // Let the tag process an outbound event before this document disappears.
      // Modified/new-tab clicks keep their native behavior; blocked tags cannot
      // prevent navigation. A callback and independent timer share one guard.
      const leavesDocument = /^https?:/.test(link.protocol) && !link.target;
      if (accepted && leavesDocument && !click.defaultPrevented && click.button === 0 && !click.ctrlKey && !click.metaKey && !click.shiftKey && !click.altKey) {
        click.preventDefault();
        let navigated = false;
        const continueNavigation = () => { if (!navigated) { navigated = true; location.assign(link.href); } };
        window.setTimeout(continueNavigation, 250);
        event(known[0], sectionOf(link), known[1], continueNavigation);
      } else event(known[0], sectionOf(link), known[1]);
      return;
    }
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname) return;
    const destination = sections[url.hash.slice(1)];
    if (!destination) return;
    event(link.matches('.cta') ? 'cta_click' : 'navigation_click', sectionOf(link), destination);
  });
  document.addEventListener('ramita:copy', ((copy: CustomEvent<{ channel: string }>) => {
    if (['email', 'whatsapp'].includes(copy.detail.channel)) event('contact_copy', 'contact', copy.detail.channel);
  }) as EventListener);
  window.addEventListener('storage', (change) => {
    if (change.key === storageKey && readChoice() !== true) choose(false, false);
  });
}
