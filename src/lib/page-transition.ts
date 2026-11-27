/*
 * Page transition: "the card opens" (home work card -> case hero) and the way back.
 *
 * FORWARD (card or next project -> case)
 * - A capture-phase click listener (WorkStack, NextProject) calls beginTravel() before ClientRouter prepares the
 *   navigation. It assigns view-transition names inline: the media is vt-cover, the label name (or the Next
 *   project name) is vt-title, and the origin card's label bar is vt-bar. Current-page static names
 *   ([data-vt-static]) are removed, so each name exists once in the old and once in the new document.
 * - astro:before-swap records the from/to paths (rememberSwap). Astro takes the old snapshot before the swap.
 * - astro:after-swap (applyAfterSwap) clears every inline name, sets html[data-vt="forward"] and
 *   html[data-vt-arrive] on the case page. Names on the case page are static in the markup (vt-cover on the hero,
 *   vt-title on the h1), so the new snapshot has them without any JS.
 * - The video playhead of a card is handed to the case hero (sessionStorage, read once in applyAfterSwap).
 *
 * BACK (case -> home): the SAFE FALLBACK. No shared elements.
 * - html[data-vt="back"] makes the root cross-fade 200ms. Browser back and the Back pill (when the page before
 *   the case was home) both take this path, because the landing check runs in before-swap for any case -> home move.
 * - applyAfterSwap scrolls the home so the card is centred, using the un-enhanced layout (the same frame as the
 *   swap). The card id goes on html[data-vt-return]. motion.ts settleReturnCard() re-centres after motion init.
 * - Why not the shared element: Astro runs astro:page-load (initMotion, which adds the Story pin spacer and the
 *   Experience sticky track) only after the swap callback resolves, and ScrollTrigger refreshes on rAF. So the
 *   new-state snapshot and the target rect of the travelling media may be taken before the layout is final. The
 *   stack also hides its media (ascii-pending) until its first paint, and its images are lazy. None of this can be
 *   verified without a browser, so the way back stays a plain fade.
 *
 * Everything is skipped under prefers-reduced-motion and when document.startViewTransition is missing. Names are
 * never assigned during the theme switch (html.theme-switching).
 */

export const VT_COVER = 'vt-cover';
export const VT_TITLE = 'vt-title';
export const VT_BAR = 'vt-bar';

const VIDEO_KEY = 'vt:video';
const PREV_KEY = 'vt:prev';
const CASE_PATH = /^\/projects\/([^/]+)\/?$/;

export interface TravelNames {
  cover?: HTMLElement | null;
  title?: HTMLElement | null;
  bar?: HTMLElement | null;
  /** The card's video, if the cover is one: its src and playhead are handed to the case hero. */
  video?: HTMLVideoElement | null;
}

// Inline names set by beginTravel, removed in applyAfterSwap.
let named: HTMLElement[] = [];
// Pathname a card or Next click is travelling to; consumed by applyAfterSwap.
let travel: string | null = null;
// Paths of the swap in progress; set by rememberSwap, consumed by applyAfterSwap.
let swapFrom: string | null = null;

/** The case id for a case pathname, or null. */
export function caseIdOf(pathname: string): string | null {
  const match = CASE_PATH.exec(pathname);
  return match ? match[1] : null;
}

/** Left click without modifier keys. Enter on a link fires the same click (button 0). */
export function isPlainActivation(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/** True when a card travel can be shown: the API exists, motion is allowed and no theme switch is running. */
export function travelAllowed(): boolean {
  const root = document.documentElement;
  return (
    typeof document.startViewTransition === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !root.classList.contains('theme-switching')
  );
}

function setName(el: HTMLElement, name: string): void {
  el.style.setProperty('view-transition-name', name);
  named.push(el);
}

function clearNames(): void {
  for (const el of named) el.style.removeProperty('view-transition-name');
  named = [];
}

/**
 * Called from a capture-phase click, before ClientRouter prepares the navigation. Names only the elements the
 * travel needs, and strips the static names of the page being left (so each name is unique at snapshot time).
 */
export function beginTravel(href: string, names: TravelNames): void {
  if (!travelAllowed()) return;
  clearNames();
  document.querySelectorAll<HTMLElement>('[data-vt-static]').forEach((el) => {
    el.style.removeProperty('view-transition-name');
  });
  travel = new URL(href, location.href).pathname;
  if (names.cover) setName(names.cover, VT_COVER);
  if (names.title) setName(names.title, VT_TITLE);
  if (names.bar) setName(names.bar, VT_BAR);
  if (names.video) {
    try {
      sessionStorage.setItem(VIDEO_KEY, JSON.stringify({ src: names.video.getAttribute('src'), t: names.video.currentTime }));
    } catch {
      // Storage blocked: the case video starts from its first frame.
    }
  }
}

/** True when the page before the current one (in this tab's SPA navigation order) was home. */
export function previousIsHome(): boolean {
  try {
    return sessionStorage.getItem(PREV_KEY) === '/';
  } catch {
    return false;
  }
}

/** Called from astro:before-swap with the URL being left. */
export function rememberSwap(from: URL): void {
  swapFrom = from.pathname;
  try {
    sessionStorage.setItem(PREV_KEY, from.pathname);
  } catch {
    // Storage blocked: the Back pill falls back to its href.
  }
}

/** The centre of a card in document coordinates, clamped to the top of the page. */
export function centreTop(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  return Math.max(0, rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2);
}

/** Hands the card's playhead to the case hero when the src matches, then clears the entry. */
function handOffVideo(): void {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(VIDEO_KEY);
    sessionStorage.removeItem(VIDEO_KEY);
  } catch {
    return;
  }
  if (!raw) return;
  let entry: { src?: unknown; t?: unknown };
  try {
    entry = JSON.parse(raw) as { src?: unknown; t?: unknown };
  } catch {
    return;
  }
  if (typeof entry.src !== 'string' || typeof entry.t !== 'number') return;
  const video = document.querySelector<HTMLVideoElement>('video[data-vt-static]');
  if (!video || video.getAttribute('src') !== entry.src) return;
  const start = (): void => {
    video.currentTime = entry.t as number;
    void video.play().catch(() => undefined);
  };
  if (video.readyState >= 1) {
    start();
  } else {
    video.preload = 'auto';
    video.addEventListener('loadedmetadata', start, { once: true });
  }
}

/**
 * Called from astro:after-swap, after the new document is in place and before its snapshot. Resets every
 * transition attribute, then sets the ones this navigation needs.
 */
export function applyAfterSwap(): void {
  const root = document.documentElement;
  root.removeAttribute('data-vt');
  root.removeAttribute('data-vt-arrive');
  root.removeAttribute('data-vt-return');
  clearNames();

  const from = swapFrom;
  const to = location.pathname;
  const travelled = travel;
  swapFrom = null;
  travel = null;

  const fromCase = from ? caseIdOf(from) : null;
  if (fromCase && to === '/') {
    // Back to home: the fallback cross-fade, then the home is scrolled to the card that was opened.
    root.setAttribute('data-vt', 'back');
    root.setAttribute('data-vt-return', fromCase);
    const card = document.getElementById(`work-${fromCase}`);
    if (card) window.scrollTo({ top: centreTop(card), behavior: 'instant' });
    return;
  }

  if (travelled && to === travelled) {
    root.setAttribute('data-vt', 'forward');
    if (caseIdOf(to)) root.setAttribute('data-vt-arrive', '');
    handOffVideo();
  }
}
