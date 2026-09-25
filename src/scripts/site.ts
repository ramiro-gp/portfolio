const root = document.documentElement;
const header = document.querySelector<HTMLElement>('[data-menu-root]');
const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');
const trigger = menu?.querySelector<HTMLElement>('.menu-trigger');
const panel = menu?.querySelector<HTMLElement>('.menu-panel');
const main = document.querySelector<HTMLElement>('main');
const footer = document.querySelector<HTMLElement>('footer');
const skipLink = document.querySelector<HTMLElement>('.skip-link');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncHeaderHeight(): void {
  if (!header || menuOpen) return;
  root.style.removeProperty('--header-height');
  const height = header.querySelector('.header-inner')?.getBoundingClientRect().height;
  if (height) root.style.setProperty('--header-height', `${height}px`);
}

const accentIds = {
  light: ['light-green', 'light-blue', 'light-red', 'light-violet', 'light-black'],
  dark: ['dark-orange', 'dark-blue', 'dark-fuchsia', 'dark-lime', 'dark-white']
} as const;
type Theme = keyof typeof accentIds;
function safeGet(key: string): string | null { try { return localStorage.getItem(key); } catch { return null; } }
function safeSet(key: string, value: string): void { try { localStorage.setItem(key, value); } catch { /* The in-memory choice still works. */ } }
function safeSessionSet(key: string, value: string): void { try { sessionStorage.setItem(key, value); } catch { /* Fragment navigation still works. */ } }
function safeSessionTake(key: string): string | null { try { const value = sessionStorage.getItem(key); sessionStorage.removeItem(key); return value; } catch { return null; } }
function focusSection(target: HTMLElement | null, fromKeyboard: boolean): void {
  if (!target) return;
  root.classList.toggle('pointer-section-focus', !fromKeyboard);
  target.scrollIntoView({ block: 'start', behavior: 'auto' });
  target.focus({ preventScroll: true });
}
function focusVisibleSection(target: HTMLElement, fromKeyboard: boolean): void {
  root.classList.toggle('pointer-section-focus', !fromKeyboard);
  target.focus({ preventScroll: true });
}
function scrollSectionIntoView(target: HTMLElement): void {
  target.scrollIntoView({ block: 'start', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
}
function clearFragment(): void {
  if (window.location.hash) window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}
function scrollToPosition(top: number, focusTarget: HTMLElement | null, fromKeyboard: boolean): void {
  const destination = Math.max(0, Math.min(top, document.documentElement.scrollHeight - innerHeight));
  const finish = () => {
    if (Math.abs(scrollY - destination) > 4 || !focusTarget) return;
    root.classList.toggle('pointer-section-focus', !fromKeyboard);
    focusTarget.focus({ preventScroll: true });
  };
  if (reduceMotion.matches || Math.abs(scrollY - destination) <= 4) {
    window.scrollTo({ top: destination, behavior: 'instant' });
    finish();
    return;
  }
  const onScrollEnd = () => {
    if (Math.abs(scrollY - destination) > 4) return;
    window.clearTimeout(fallbackTimer);
    finish();
  };
  window.addEventListener('scrollend', onScrollEnd, { once: true });
  const fallbackTimer = window.setTimeout(() => { window.removeEventListener('scrollend', onScrollEnd); finish(); }, 2200);
  window.scrollTo({ top: destination, behavior: 'smooth' });
}
function currentTheme(): Theme { return root.dataset.theme === 'dark' ? 'dark' : 'light'; }
function preferredAccent(theme: Theme): string {
  const saved = safeGet(`ramita-accent-${theme}`);
  return saved && (accentIds[theme] as readonly string[]).includes(saved) ? saved : accentIds[theme][0];
}
function syncAppearance(): void {
  const theme = currentTheme();
  document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
  document.querySelectorAll<HTMLButtonElement>('[data-accent-choice]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.accentChoice === root.dataset.accent)));
}
document.querySelectorAll<HTMLButtonElement>('[data-theme-choice]').forEach((button) => button.addEventListener('click', () => {
  const theme = button.dataset.themeChoice === 'dark' ? 'dark' : 'light';
  root.dataset.theme = theme;
  root.dataset.accent = preferredAccent(theme);
  safeSet('ramita-theme', theme);
  syncAppearance();
}));
document.querySelectorAll<HTMLButtonElement>('[data-accent-choice]').forEach((button) => button.addEventListener('click', () => {
  const theme = currentTheme();
  const choice = button.dataset.accentChoice;
  if (!choice || !(accentIds[theme] as readonly string[]).includes(choice)) return;
  root.dataset.accent = choice;
  safeSet(`ramita-accent-${theme}`, choice);
  syncAppearance();
}));
syncAppearance();

let menuOpen = false;
let closingPromise: Promise<void> | null = null;
let priorBodyPadding = '';
let priorOverflow = '';
function closeMenu(restoreFocus = false): Promise<void> {
  if (!menu || !header || !trigger || !menuOpen) return Promise.resolve();
  if (closingPromise) return closingPromise;
  const originX = Number.parseFloat(header.style.getPropertyValue('--menu-origin-x')) || 0;
  const originY = Number.parseFloat(header.style.getPropertyValue('--menu-origin-y')) || 0;
  const bounds = header.getBoundingClientRect();
  const visibleRadius = Math.max(
    Math.hypot(originX - bounds.left, originY - bounds.top),
    Math.hypot(bounds.right - originX, originY - bounds.top),
    Math.hypot(originX - bounds.left, bounds.bottom - originY),
    Math.hypot(bounds.right - originX, bounds.bottom - originY)
  ) + 1;
  const currentRadius = Number.parseFloat(getComputedStyle(header).clipPath.match(/circle\(([\d.]+)px/)?.[1] || '');
  header.style.setProperty('--menu-close-radius', `${Math.min(visibleRadius, Number.isFinite(currentRadius) ? currentRadius : visibleRadius)}px`);
  header.dataset.closing = '';
  closingPromise = new Promise((resolve) => {
    window.setTimeout(() => {
      menuOpen = false;
      menu.open = false;
      delete header.dataset.open;
      delete header.dataset.closing;
      header.removeAttribute('role');
      header.removeAttribute('aria-modal');
      header.removeAttribute('aria-label');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.removeAttribute('aria-label');
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      if (skipLink) skipLink.inert = false;
      document.body.style.paddingTop = priorBodyPadding;
      root.style.overflow = priorOverflow;
      if (restoreFocus) trigger.focus({ preventScroll: true });
      closingPromise = null;
      resolve();
    }, reduceMotion.matches ? 0 : 430);
  });
  return closingPromise;
}
function navigateToSection(target: HTMLElement, fromKeyboard: boolean): void {
  const closing = closeMenu();
  clearFragment();
  scrollSectionIntoView(target);
  void closing.then(() => {
    // Re-align after the sticky header and scrollbar return to their final layout.
    scrollSectionIntoView(target);
    focusVisibleSection(target, fromKeyboard);
  });
}
function openMenu(): void {
  if (!menu || !header || !trigger || !panel || menuOpen || closingPromise) return;
  syncHeaderHeight();
  const box = trigger.getBoundingClientRect();
  header.style.setProperty('--menu-origin-x', `${box.left + box.width / 2}px`);
  header.style.setProperty('--menu-origin-y', `${box.top + box.height / 2}px`);
  priorBodyPadding = document.body.style.paddingTop;
  priorOverflow = root.style.overflow;
  document.body.style.paddingTop = `${header.getBoundingClientRect().height}px`;
  root.style.overflow = 'hidden';
  menu.open = true;
  menuOpen = true;
  header.dataset.open = '';
  header.setAttribute('role', 'dialog');
  header.setAttribute('aria-modal', 'true');
  header.setAttribute('aria-label', panel.getAttribute('aria-label') || '');
  trigger.setAttribute('aria-expanded', 'true');
  trigger.setAttribute('aria-label', trigger.dataset.closeLabel || '');
  if (main) main.inert = true;
  if (footer) footer.inert = true;
  if (skipLink) skipLink.inert = true;
  trigger.focus({ preventScroll: true });
}
if (header && menu && trigger && panel && main && footer) {
  trigger.setAttribute('aria-expanded', 'false');
  trigger.addEventListener('click', (event) => { event.preventDefault(); if (!closingPromise) menuOpen ? void closeMenu(true) : openMenu(); });
  header.addEventListener('click', (event) => {
    if (!menuOpen || closingPromise || !(event.target instanceof Element)) return;
    if (event.target.closest('a,button,summary')) return;
    void closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (!menuOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (!closingPromise) void closeMenu(true);
      return;
    }
    if (event.key !== 'Tab') return;
    const focusables = Array.from(header.querySelectorAll<HTMLElement>('a[href],summary,button:not([disabled])')).filter((node) => {
      if (node.getClientRects().length === 0) return false;
      const closed = node.closest<HTMLDetailsElement>('details:not([open])');
      return !closed || closed.querySelector(':scope > summary') === node;
    });
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  panel.querySelectorAll<HTMLAnchorElement>('[data-section-link]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const id = link.hash.slice(1);
    const fromKeyboard = event.detail === 0;
    const target = document.getElementById(id);
    if (target) navigateToSection(target, fromKeyboard);
  }));
  header.querySelector<HTMLAnchorElement>('.brand')?.addEventListener('click', (event) => {
    event.preventDefault();
    const fromKeyboard = event.detail === 0;
    const target = document.getElementById('inicio');
    if (!target) return;
    if (menuOpen) navigateToSection(target, fromKeyboard);
    else { clearFragment(); scrollToPosition(0, target, fromKeyboard); }
  });
  panel.querySelectorAll<HTMLAnchorElement>('[data-language-link]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const destination = `${new URL(link.href).pathname}${window.location.hash}`;
    safeSessionSet('ramita-language-navigation-input', event.detail === 0 ? 'keyboard' : 'pointer');
    void closeMenu().then(() => { window.location.href = destination; });
  }));
  panel.querySelectorAll<HTMLAnchorElement>('.menu-contact a').forEach((link) => link.addEventListener('click', () => { void closeMenu(); }));
  root.classList.add('js-ready');
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight, { passive: true });
  document.fonts?.ready.then(syncHeaderHeight);
}

const languageNavigationInput = safeSessionTake('ramita-language-navigation-input');
if (languageNavigationInput && window.location.hash) requestAnimationFrame(() => {
  focusSection(document.getElementById(window.location.hash.slice(1)), languageNavigationInput === 'keyboard');
});
document.addEventListener('keydown', () => root.classList.remove('pointer-section-focus'), { capture: true });
document.querySelector<HTMLButtonElement>('[data-back-to-top]')?.addEventListener('click', (event) => {
  scrollToPosition(0, document.getElementById('inicio'), event.detail === 0);
});
document.querySelector<HTMLAnchorElement>('[data-hero-scroll]')?.addEventListener('click', (event) => {
  event.preventDefault();
  const target = document.getElementById('servicios');
  if (!target) return;
  clearFragment();
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  scrollToPosition(target.getBoundingClientRect().top + scrollY - margin, target, event.detail === 0);
});
document.querySelector<HTMLAnchorElement>('.hero .cta')?.addEventListener('click', (event) => {
  event.preventDefault();
  const target = document.getElementById('contacto');
  if (!target) return;
  clearFragment();
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  scrollToPosition(target.getBoundingClientRect().top + scrollY - margin, target, event.detail === 0);
});

// The visible word is decorative; the H1 always exposes the stable fallback to assistive technology.
const hero = document.querySelector<HTMLElement>('[data-hero]');
const wordSlot = document.querySelector<HTMLElement>('[data-word-slot]');
const wordCurrent = document.querySelector<HTMLElement>('[data-word-current]');
if (hero && wordSlot && wordCurrent) {
  let words: string[] = [];
  try { words = JSON.parse(wordSlot.dataset.words || '[]'); } catch { /* Static fallback remains. */ }
  if (words.length === 6) {
    let index = 0;
    let visible = true;
    let timer = 0;
    let transitionTimer = 0;
    const display = (word: string) => {
      const characters = document.createDocumentFragment();
      let stagger = 0;
      for (const character of Array.from(word)) {
        if (character === ' ') { characters.append(document.createTextNode(' ')); continue; }
        const letter = document.createElement('span');
        letter.className = 'word-char';
        letter.style.setProperty('--char-index', String(stagger++));
        letter.textContent = character;
        characters.append(letter);
      }
      wordCurrent.classList.remove('is-entering', 'is-leaving');
      wordCurrent.replaceChildren(characters);
      wordCurrent.classList.add('is-entering');
    };
    const schedule = () => {
      window.clearTimeout(timer);
      window.clearTimeout(transitionTimer);
      wordCurrent.classList.remove('is-leaving');
      if (!visible || document.hidden || reduceMotion.matches) return;
      timer = window.setTimeout(() => {
        wordCurrent.classList.remove('is-entering');
        wordCurrent.classList.add('is-leaving');
        transitionTimer = window.setTimeout(() => {
          if (!reduceMotion.matches && visible && !document.hidden) { index = (index + 1) % words.length; display(words[index] || words[0] || ''); schedule(); }
        }, 100);
      }, 3200);
    };
    if (!reduceMotion.matches) { display(words[0] || ''); schedule(); }
    if ('IntersectionObserver' in window) new IntersectionObserver((entries) => { visible = !!entries[0]?.isIntersecting; schedule(); }, { threshold: 0.05 }).observe(hero);
    document.addEventListener('visibilitychange', schedule);
    reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) { window.clearTimeout(timer); window.clearTimeout(transitionTimer); wordCurrent.textContent = words[1] || ''; wordCurrent.classList.remove('is-entering', 'is-leaving'); } else { index = 0; display(words[0] || ''); schedule(); } });
  }
}

function evaluateSticky(): void {
  const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-service-panel]'));
  const usable = window.innerHeight - (header?.getBoundingClientRect().height || 72) - 48;
  root.classList.toggle('sticky-services', !reduceMotion.matches && window.innerWidth >= 1024 && window.innerHeight >= 700 && panels.length === 3 && panels.every((panel) => panel.scrollHeight <= usable));
}
evaluateSticky();
window.addEventListener('resize', evaluateSticky, { passive: true });
reduceMotion.addEventListener('change', evaluateSticky);
document.fonts?.ready.then(evaluateSticky);

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }), { threshold: 0.06, rootMargin: '0px 0px 40px 0px' });
  blocks.forEach((block) => observer.observe(block));
  root.classList.add('reveals-ready');
  window.setTimeout(() => { blocks.forEach((block) => block.classList.add('is-visible')); observer.disconnect(); }, 5000);
  reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) { root.classList.remove('reveals-ready'); observer.disconnect(); } });
}

const copyFeedback = document.querySelector<HTMLElement>('[data-copy-feedback]');
if (navigator.clipboard?.writeText && window.isSecureContext && copyFeedback) {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    button.hidden = false;
    let resetTimer = 0;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy || '');
        button.classList.add('is-copied');
        copyFeedback.textContent = button.dataset.copySuccess || '';
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => button.classList.remove('is-copied'), 1800);
      } catch { copyFeedback.textContent = button.dataset.copyError || ''; }
    });
  });
}

const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)');
const cursor = document.querySelector<HTMLElement>('[data-cursor]');
if (cursor && finePointer.matches && !reduceMotion.matches) {
  let x = -100, y = -100, frame = 0, contextFrame = 0;
  const aboutScene = document.querySelector<HTMLElement>('.about');
  const paint = () => { cursor.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`; frame = 0; };
  const refreshContext = () => {
    const target = document.elementFromPoint(x, y);
    const aboutBox = aboutScene?.getBoundingClientRect();
    cursor.classList.toggle('is-hover', !!(target instanceof Element && target.closest('a,button,summary')));
    cursor.classList.toggle('is-inverse', !!(!header?.hasAttribute('data-open') && aboutBox && y >= aboutBox.top && y <= aboutBox.bottom));
    cursor.classList.toggle('is-on-accent', !!(target instanceof Element && target.closest('.cta')));
  };
  const scheduleContext = () => { if (!contextFrame) contextFrame = requestAnimationFrame(() => { contextFrame = 0; refreshContext(); }); };
  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    x = event.clientX; y = event.clientY;
    refreshContext();
    root.classList.add('cursor-ready');
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });
  window.addEventListener('scroll', scheduleContext, { passive: true });
  document.addEventListener('click', () => { scheduleContext(); window.setTimeout(scheduleContext, 450); });
  document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.addEventListener('pointercancel', () => cursor.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => root.classList.remove('cursor-ready'));
  window.addEventListener('blur', () => { root.classList.remove('cursor-ready'); cursor.classList.remove('is-down'); });
  reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) root.classList.remove('cursor-ready'); });
}

// The line is attached only after all content and geometry are in place.
const svg = document.querySelector<SVGSVGElement>('[data-continuous-line]');
const linePath = svg?.querySelector<SVGPathElement>('[data-line-path]');
const startNode = svg?.querySelector<SVGCircleElement>('[data-line-start-node]');
const endNode = svg?.querySelector<SVGCircleElement>('[data-line-end-node]');
const startPulse = svg?.querySelector<SVGCircleElement>('[data-line-start-pulse]');
const endPulse = svg?.querySelector<SVGCircleElement>('[data-line-end-pulse]');
const endGroup = svg?.querySelector<SVGGElement>('[data-line-end-group]');
const startCue = document.querySelector<HTMLElement>('[data-line-start]');
const anchors = ['hero', 'services', 'projects', 'about', 'contact'].map((name) => document.querySelector<HTMLElement>(`[data-line-anchor="${name}"]`));
const serviceIntro = document.querySelector<HTMLElement>('.services .section-intro');
const serviceStack = document.querySelector<HTMLElement>('[data-service-stack]');
const firstServicePanel = serviceStack?.querySelector<HTMLElement>('[data-service-panel]');
const servicePanels = Array.from(serviceStack?.querySelectorAll<HTMLElement>('[data-service-panel]') || []);
const landingTitle = servicePanels[1]?.querySelector<HTMLElement>('h3');
const finalServicePanel = servicePanels.at(-1);
const capabilities = document.querySelector<HTMLElement>('.services .capabilities');
const projectsHeading = document.querySelector<HTMLElement>('.projects .section-heading');
const projectTail = Array.from(document.querySelectorAll<HTMLElement>('.projects [data-project-tail]')).at(-1);
const aboutHeading = document.querySelector<HTMLElement>('.about .profile .section-heading');
const contactHeading = document.querySelector<HTMLElement>('.contact .section-heading');
const backToTop = document.querySelector<HTMLElement>('[data-back-to-top]');
if (svg && linePath && startNode && endNode && startPulse && endPulse && endGroup && serviceIntro && serviceStack && firstServicePanel && servicePanels.length === 3 && landingTitle && finalServicePanel && capabilities && projectsHeading && projectTail && aboutHeading && contactHeading && backToTop && anchors.every(Boolean)) {
  type Milestone = { name: string; scroll: number; distance: number };
  let length = 1, scrollFrame = 0, geometryFrame = 0;
  let milestones: Milestone[] = [];
  const box = (element: HTMLElement) => {
    const r = element.getBoundingClientRect();
    let revealOffsetY = 0;
    for (let current: HTMLElement | null = element; current; current = current.parentElement) {
      if (!current.hasAttribute('data-reveal')) continue;
      const transform = getComputedStyle(current).transform;
      if (transform !== 'none') revealOffsetY += new DOMMatrixReadOnly(transform).m42;
    }
    return { left: r.left, right: r.right, top: r.top + scrollY - revealOffsetY, bottom: r.bottom + scrollY - revealOffsetY, height: r.height };
  };
  function progress(): void {
    scrollFrame = 0;
    const last = milestones.at(-1);
    if (!last) return;
    if (reduceMotion.matches) {
      linePath!.style.strokeDashoffset = '0';
      endGroup!.style.opacity = '1';
      return;
    }
    let distance = 0;
    if (scrollY >= last.scroll) distance = length;
    else {
      for (let i = 1; i < milestones.length; i++) {
        const previous = milestones[i - 1]!;
        const next = milestones[i]!;
        if (scrollY > next.scroll) continue;
        const fraction = Math.max(0, (scrollY - previous.scroll) / (next.scroll - previous.scroll));
        distance = previous.distance + (next.distance - previous.distance) * fraction;
        break;
      }
    }
    const offset = String(Math.max(0, length - distance));
    linePath!.style.strokeDashoffset = offset;
    endGroup!.style.opacity = distance >= length - 2 ? '1' : '0';
  }
  function draw(): void {
    geometryFrame = 0;
    const hero = box(anchors[0]!);
    const services = box(anchors[1]!);
    const projects = box(anchors[2]!);
    const about = box(anchors[3]!);
    const contact = box(anchors[4]!);
    const intro = box(serviceIntro!);
    const stack = box(serviceStack!);
    const lowerText = box(capabilities!);
    const projectTitle = box(projectsHeading!);
    const projectsEnd = box(projectTail!);
    const aboutTitle = box(aboutHeading!);
    const contactTitle = box(contactHeading!);
    const back = box(backToTop!);
    const width = document.documentElement.clientWidth;
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const maxScroll = Math.max(0, height - innerHeight);
    const compact = width < 1024;
    svg!.style.height = `${height}px`;
    svg!.setAttribute('viewBox', `0 0 ${width} ${height}`);
    let startX: number, endX: number, startY: number;
    // The endpoint belongs to the closing control, not a fraction of Contact's height.
    const endY = back.top - (compact ? 36 : 56);
    let d: string;
    milestones = [];
    const add = (segment: string) => { d += ` ${segment}`; };
    const mark = (name: string, rawScroll: number) => {
      linePath!.setAttribute('d', d);
      const previous = milestones[milestones.length - 1];
      const bounded = Math.max(0, Math.min(maxScroll, rawScroll));
      milestones.push({ name, scroll: previous ? Math.max(previous.scroll + 1, bounded) : bounded, distance: linePath!.getTotalLength() });
    };
    if (compact) {
      // Keep the approved Hero start, then alternate through the real side gutters.
      const compactAxisX = width - 34;
      startX = compactAxisX;
      endX = compactAxisX;
      const cue = startCue ? box(startCue) : null;
      startY = cue ? cue.bottom + 28 : hero.top + hero.height * .8;
      const lineHalf = 8.5 / 2;
      const responsiveGutter = Number.parseFloat(getComputedStyle(root).getPropertyValue('--gutter')) || services.left;
      const minInset = lineHalf + 10;
      const maxInsetForCopy = services.left - lineHalf - 8;
      const corridorInset = Math.max(minInset, Math.min(maxInsetForCopy, Math.max(minInset, responsiveGutter * .7)));
      const leftX = corridorInset;
      const rightX = Math.min(width - lineHalf - 1, width - corridorInset);
      const radiusForGap = (gap: number) => Math.max(1, Math.min(22, gap * .22, (rightX - leftX) * .12));
      const firstPanel = box(firstServicePanel!);
      const servicesGap = Math.max(0, firstPanel.top - intro.bottom);
      const projectsGap = Math.max(0, projectTitle.top - lowerText.bottom);
      const aboutGap = Math.max(0, aboutTitle.top - projectsEnd.bottom);
      const contactGap = Math.max(0, contactTitle.top - about.bottom);
      const servicesTurnY = intro.bottom + servicesGap / 2;
      const projectsTurnY = lowerText.bottom + projectsGap / 2;
      const aboutTurnY = projectsEnd.bottom + aboutGap / 2;
      const contactTurnY = about.bottom + contactGap / 2;
      const servicesRadius = radiusForGap(servicesGap);
      const projectsRadius = radiusForGap(projectsGap);
      const aboutRadius = radiusForGap(aboutGap);
      const contactRadius = radiusForGap(contactGap);
      const stackMiddleY = stack.top + stack.height / 2;
      const projectsMiddleY = projects.top + projects.height / 2;
      const aboutMiddleY = about.top + about.height / 2;
      d = 'M ' + startX + ' ' + startY;
      mark('hero', startY - innerHeight * .8);
      add('V ' + (servicesTurnY - servicesRadius));
      mark('services-transition', servicesTurnY - innerHeight * .55);
      add('Q ' + startX + ' ' + servicesTurnY + ' ' + (startX - servicesRadius) + ' ' + servicesTurnY + ' H ' + (leftX + servicesRadius) + ' Q ' + leftX + ' ' + servicesTurnY + ' ' + leftX + ' ' + (servicesTurnY + servicesRadius));
      mark('services-left', servicesTurnY - innerHeight * .42);
      add('V ' + stackMiddleY);
      mark('inside-stack', stackMiddleY - innerHeight * .5);
      add('V ' + lowerText.bottom);
      mark('services-text', lowerText.bottom - innerHeight * .55);
      add('V ' + (projectsTurnY - projectsRadius));
      mark('services-exit', projectsTurnY - innerHeight * .55);
      add('Q ' + leftX + ' ' + projectsTurnY + ' ' + (leftX + projectsRadius) + ' ' + projectsTurnY + ' H ' + (rightX - projectsRadius) + ' Q ' + rightX + ' ' + projectsTurnY + ' ' + rightX + ' ' + (projectsTurnY + projectsRadius));
      mark('projects-entry', projectTitle.top - innerHeight * .5);
      add('V ' + projectsMiddleY);
      mark('projects-content', projectsMiddleY - innerHeight * .5);
      add('V ' + projectsEnd.bottom);
      mark('projects-exit', projectsEnd.bottom - innerHeight * .55);
      add('V ' + (aboutTurnY - aboutRadius));
      mark('projects-transition', aboutTurnY - innerHeight * .55);
      add('Q ' + rightX + ' ' + aboutTurnY + ' ' + (rightX - aboutRadius) + ' ' + aboutTurnY + ' H ' + (leftX + aboutRadius) + ' Q ' + leftX + ' ' + aboutTurnY + ' ' + leftX + ' ' + (aboutTurnY + aboutRadius));
      mark('about-entry', aboutTitle.top - innerHeight * .5);
      add('V ' + aboutMiddleY);
      mark('about-content', aboutMiddleY - innerHeight * .5);
      add('V ' + about.bottom);
      mark('about-exit', about.bottom - innerHeight * .6);
      add('V ' + (contactTurnY - contactRadius));
      mark('contact-transition', contactTurnY - innerHeight * .55);
      add('Q ' + leftX + ' ' + contactTurnY + ' ' + (leftX + contactRadius) + ' ' + contactTurnY + ' H ' + (compactAxisX - contactRadius) + ' Q ' + compactAxisX + ' ' + contactTurnY + ' ' + compactAxisX + ' ' + (contactTurnY + contactRadius));
      mark('contact-entry', contactTurnY - innerHeight * .35);
      add('V ' + endY);
      mark('contact', maxScroll);
    } else {
      const cue = startCue ? box(startCue) : null;
      startX = Math.min(width - 54, cue ? (cue.left + cue.right) / 2 : services.right - 36);
      const serviceGutterX = Math.min(width - 20, services.right + 28);
      const landing = box(landingTitle!);
      const lastPanel = box(finalServicePanel!);
      const left = Math.max(24, projects.left - 24);
      const radius = 36;
      const aboutInset = Number.parseFloat(getComputedStyle(anchors[3]!).paddingRight) || 0;
      const aboutContentRight = about.right - aboutInset;
      const aboutRightX = Math.min(width - 10, aboutContentRight + Math.min(36, aboutInset * .5));
      endX = (back.left + back.right) / 2;
      const contactRadius = Math.max(1, Math.min(20, (aboutRightX - endX) * .22, (contactTitle.top - contact.top) * .1));
      const contactTurnY = contact.top + (contactTitle.top - contact.top) * .38;
      startY = cue ? cue.bottom + 40 : hero.top + hero.height * .75;
      const firstTurnY = services.top + (intro.top - services.top) * .52;
      const firstRadius = Math.min(30, (serviceGutterX - startX) / 3);
      const landingTurnY = landing.top + landing.height * .58;
      const stackExitY = Math.max(stack.bottom, lastPanel.bottom);
      const lowerTextGap = Math.max(0, lowerText.top - stackExitY);
      const capabilitiesTurnY = stackExitY + Math.min(24, lowerTextGap * .3);
      const capabilitiesCopy = box(capabilities!.querySelector<HTMLElement>('p')!);
      const capabilitiesGutterX = Math.max(services.left + 28, capabilitiesCopy.left - 36);
      const capabilitiesRadius = Math.max(1, Math.min(20, lowerTextGap * .22, (capabilitiesGutterX - left) * .1));
      const capabilitiesToProjectsGap = Math.max(0, projects.top - lowerText.bottom);
      const clearY = lowerText.bottom + Math.min(36, capabilitiesToProjectsGap * .45);
      const clearRadius = Math.min(24, capabilitiesToProjectsGap * .16, (capabilitiesGutterX - left) * .12);
      const ramiroTurnY = about.top + Math.min(64, Math.max(36, (aboutTitle.top - about.top) * .35));
      const ramiroTurnRadius = Math.max(1, Math.min(radius, (aboutTitle.top - ramiroTurnY) * .4));
      d = `M ${startX} ${startY}`;
      mark('hero', startY - innerHeight * .8);
      add(`V ${firstTurnY - firstRadius} Q ${startX} ${firstTurnY} ${startX + firstRadius} ${firstTurnY} H ${serviceGutterX - firstRadius} Q ${serviceGutterX} ${firstTurnY} ${serviceGutterX} ${firstTurnY + firstRadius}`);
      mark('services-entry', services.top - innerHeight * .55);
      add(`V ${landingTurnY - radius}`);
      mark('landing-pages-approach', landing.top - innerHeight * .55);
      add(`Q ${serviceGutterX} ${landingTurnY} ${serviceGutterX - radius} ${landingTurnY} H ${left + radius} Q ${left} ${landingTurnY} ${left} ${landingTurnY + radius}`);
      mark('landing-pages-turn', landing.top - innerHeight * .5);
      add(`V ${stackExitY - capabilitiesRadius}`);
      mark('redesigns-exit', stackExitY - innerHeight * .55);
      add(`Q ${left} ${capabilitiesTurnY} ${left + capabilitiesRadius} ${capabilitiesTurnY} H ${capabilitiesGutterX - capabilitiesRadius} Q ${capabilitiesGutterX} ${capabilitiesTurnY} ${capabilitiesGutterX} ${capabilitiesTurnY + capabilitiesRadius}`);
      mark('capabilities-approach', lowerText.top - innerHeight * .5);
      add(`V ${clearY - clearRadius} Q ${capabilitiesGutterX} ${clearY} ${capabilitiesGutterX - clearRadius} ${clearY} H ${left + clearRadius} Q ${left} ${clearY} ${left} ${clearY + clearRadius}`);
      mark('capabilities-clear', lowerText.bottom - innerHeight * .5);
      add(`V ${projects.top}`);
      mark('projects', projects.top - innerHeight * .3);
      add(`V ${projectsEnd.bottom}`);
      mark('projects-exit', projectsEnd.bottom - innerHeight * .55);
      add(`V ${ramiroTurnY - ramiroTurnRadius} Q ${left} ${ramiroTurnY} ${left + ramiroTurnRadius} ${ramiroTurnY} H ${aboutRightX - ramiroTurnRadius} Q ${aboutRightX} ${ramiroTurnY} ${aboutRightX} ${ramiroTurnY + ramiroTurnRadius}`);
      mark('about', about.top - innerHeight * .4);
      add(`V ${contactTurnY - contactRadius}`);
      mark('contact-entry', contactTurnY - innerHeight * .55);
      add(`Q ${aboutRightX} ${contactTurnY} ${aboutRightX - contactRadius} ${contactTurnY} H ${endX + contactRadius} Q ${endX} ${contactTurnY} ${endX} ${contactTurnY + contactRadius}`);
      mark('contact-turn', contactTurnY - innerHeight * .35);
      add(`V ${endY}`);
      mark('contact', maxScroll);
    }
    linePath!.setAttribute('d', d);
    startNode!.setAttribute('cx', String(startX));
    startNode!.setAttribute('cy', String(startY));
    startPulse!.setAttribute('cx', String(startX));
    startPulse!.setAttribute('cy', String(startY));
    endNode!.setAttribute('cx', String(endX));
    endNode!.setAttribute('cy', String(endY));
    endPulse!.setAttribute('cx', String(endX));
    endPulse!.setAttribute('cy', String(endY));
    for (const circle of [startNode, endNode, startPulse, endPulse]) circle!.setAttribute('r', compact ? '12.5' : '20');
    length = linePath!.getTotalLength();
    const retimeRange = (startName: string, endName: string) => {
      const startIndex = milestones.findIndex((milestone) => milestone.name === startName);
      const endIndex = milestones.findIndex((milestone) => milestone.name === endName);
      if (startIndex < 0 || endIndex <= startIndex) return;
      const first = milestones[startIndex]!;
      const last = milestones[endIndex]!;
      const scrollSpan = last.scroll - first.scroll;
      const distanceSpan = last.distance - first.distance;
      if (scrollSpan <= 0 || distanceSpan <= 0) return;
      const structuralWeight = .15;
      milestones = milestones.map((milestone, index) => {
        if (index < startIndex || index > endIndex) return milestone;
        const structuralProgress = (milestone.scroll - first.scroll) / scrollSpan;
        const physicalProgress = (milestone.distance - first.distance) / distanceSpan;
        return {
          ...milestone,
          scroll: first.scroll + scrollSpan * (structuralProgress * structuralWeight + physicalProgress * (1 - structuralWeight))
        };
      });
    };
    if (compact) retimeRange(milestones[0]!.name, milestones.at(-1)!.name);
    else {
      retimeRange('services-entry', 'projects');
      retimeRange('projects', 'about');
    }
    linePath!.style.strokeDasharray = String(length);
    svg!.dataset.route = compact ? (width < 768 ? 'mobile' : 'tablet') : 'desktop';
    svg!.dataset.milestones = JSON.stringify(milestones);
    svg!.dataset.ready = '';
    svg!.style.visibility = '';
    progress();
  }
  const scheduleDraw = () => { svg!.style.visibility = 'hidden'; if (!geometryFrame) geometryFrame = requestAnimationFrame(draw); };
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(progress); }, { passive: true });
  window.addEventListener('resize', scheduleDraw, { passive: true });
  reduceMotion.addEventListener('change', progress);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleDraw);
    anchors.forEach((item) => observer.observe(item!));
  }
  document.fonts?.ready.then(scheduleDraw);
  document.querySelectorAll<HTMLImageElement>('img').forEach((image) => image.addEventListener('load', scheduleDraw));
  requestAnimationFrame(draw);
}
