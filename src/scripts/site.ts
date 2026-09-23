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
    if (!menuOpen || !(event.target instanceof Element)) return;
    if (event.target.closest('a,button,summary')) return;
    void closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (!menuOpen || closingPromise) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      void closeMenu(true);
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
    void closeMenu().then(() => {
      const target = document.getElementById(id);
      window.location.hash = id;
      focusSection(target, fromKeyboard);
    });
  }));
  header.querySelector<HTMLAnchorElement>('.brand')?.addEventListener('click', (event) => {
    if (!menuOpen) return;
    event.preventDefault();
    const fromKeyboard = event.detail === 0;
    void closeMenu().then(() => {
      window.location.hash = 'inicio';
      focusSection(document.getElementById('inicio'), fromKeyboard);
    });
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
const capabilities = document.querySelector<HTMLElement>('.services .capabilities');
const backToTop = document.querySelector<HTMLElement>('[data-back-to-top]');
if (svg && linePath && startNode && endNode && startPulse && endPulse && endGroup && serviceIntro && serviceStack && capabilities && backToTop && anchors.every(Boolean)) {
  type Milestone = { name: string; scroll: number; distance: number };
  let length = 1, scrollFrame = 0, geometryFrame = 0;
  let milestones: Milestone[] = [];
  const box = (element: HTMLElement) => { const r = element.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top + scrollY, bottom: r.bottom + scrollY, height: r.height }; };
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
    const intro = box(serviceIntro!);
    const stack = box(serviceStack!);
    const lowerText = box(capabilities!);
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
      // The compact route is composed for the narrow rail, not scaled from desktop.
      // Services text keeps a clear right margin; both detours run behind the panels.
      startX = endX = width - 34;
      const cue = startCue ? box(startCue) : null;
      startY = cue ? cue.bottom + 28 : hero.top + hero.height * .8;
      const innerX = stack.left + (stack.right - stack.left) * .52;
      const firstPanel = serviceStack!.querySelector<HTMLElement>('[data-service-panel]');
      const lastPanel = serviceStack!.querySelector<HTMLElement>('[data-service-panel]:last-child');
      const entryY = stack.top + Math.min(stack.height * .13, (firstPanel?.offsetHeight ?? stack.height / 3) * .42);
      const exitY = stack.bottom - Math.min(90, (lastPanel?.offsetHeight ?? stack.height / 3) * .25);
      const radius = Math.min(25, (startX - innerX) / 4);
      const projectY = projects.top + Math.min(42, projects.height * .06);
      const aboutY = about.top + Math.min(42, about.height * .06);
      d = `M ${startX} ${startY}`;
      mark('hero', startY - innerHeight * .8);
      add(`V ${entryY - radius}`);
      mark('stack-entry', stack.top - innerHeight * .62);
      add(`Q ${startX} ${entryY} ${startX - radius} ${entryY} H ${innerX + radius} Q ${innerX} ${entryY} ${innerX} ${entryY + radius}`);
      mark('inside-stack', stack.top - innerHeight * .30);
      add(`V ${exitY - radius}`);
      mark('stack-exit', stack.bottom - innerHeight * .72);
      add(`Q ${innerX} ${exitY} ${innerX + radius} ${exitY} H ${startX - radius} Q ${startX} ${exitY} ${startX} ${exitY + radius}`);
      mark('outside-stack', stack.bottom - innerHeight * .38);
      add(`V ${lowerText.bottom + 24}`);
      mark('services-text', lowerText.bottom - innerHeight * .55);
      add(`V ${projectY}`);
      mark('projects', projects.top - innerHeight * .48);
      add(`V ${aboutY}`);
      mark('about', about.top - innerHeight * .45);
      add(`V ${endY}`);
      mark('contact', endY - innerHeight * .55);
    } else {
      const cue = startCue ? box(startCue) : null;
      startX = Math.min(width - 54, cue ? (cue.left + cue.right) / 2 : services.right - 36);
      const serviceGutterX = Math.min(width - 20, services.right + 28);
      const innerX = stack.left + (stack.right - stack.left) * .53;
      const lowerTextGutterX = Math.max(services.left + 28, lowerText.left - 48);
      const left = Math.max(24, projects.left - 24);
      const aboutInset = Number.parseFloat(getComputedStyle(anchors[3]!).paddingRight) || 0;
      endX = Math.min(width - 54, about.right - aboutInset + 22);
      const turnA = projects.top + Math.min(42, projects.height * .06);
      const turnB = about.top + Math.min(42, about.height * .06);
      const radius = 36;
      startY = cue ? cue.bottom + 40 : hero.top + hero.height * .75;
      const firstTurnY = services.top + (intro.top - services.top) * .52;
      const firstRadius = Math.min(30, (serviceGutterX - startX) / 3);
      const middleY = stack.top + stack.height * .5;
      const exitY = stack.bottom - Math.min(72, stack.height * .025);
      const clearY = lowerText.bottom + Math.min(40, (projects.top - lowerText.bottom) * .3);
      d = `M ${startX} ${startY}`;
      mark('hero', startY - innerHeight * .8);
      add(`V ${firstTurnY - firstRadius} Q ${startX} ${firstTurnY} ${startX + firstRadius} ${firstTurnY} H ${serviceGutterX - firstRadius} Q ${serviceGutterX} ${firstTurnY} ${serviceGutterX} ${firstTurnY + firstRadius}`);
      mark('services-entry', services.top - innerHeight * .55);
      add(`V ${middleY - radius}`);
      mark('stack-middle-entry', stack.top + stack.height * .45 - innerHeight * .6);
      add(`Q ${serviceGutterX} ${middleY} ${serviceGutterX - radius} ${middleY} H ${innerX + radius} Q ${innerX} ${middleY} ${innerX} ${middleY + radius}`);
      mark('inside-stack', stack.top + stack.height * .60 - innerHeight * .6);
      add(`V ${exitY - radius}`);
      mark('stack-bottom', stack.bottom - innerHeight * .75);
      add(`Q ${innerX} ${exitY} ${innerX - radius} ${exitY} H ${lowerTextGutterX + radius} Q ${lowerTextGutterX} ${exitY} ${lowerTextGutterX} ${exitY + radius}`);
      mark('outside-stack', stack.bottom - innerHeight * .37);
      add(`V ${clearY}`);
      mark('services-text', lowerText.bottom - innerHeight * .5);
      add(`V ${turnA - radius} Q ${lowerTextGutterX} ${turnA} ${lowerTextGutterX - radius} ${turnA} H ${left + radius} Q ${left} ${turnA} ${left} ${turnA + radius}`);
      mark('projects', projects.top - innerHeight * .3);
      add(`V ${turnB - radius} Q ${left} ${turnB} ${left + radius} ${turnB} H ${endX - radius} Q ${endX} ${turnB} ${endX} ${turnB + radius}`);
      mark('about', about.top - innerHeight * .4);
      add(`V ${endY}`);
      mark('contact', endY - innerHeight * .55);
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
