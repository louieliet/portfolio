/*
 * Page transition: "the card opens" (home work card -> case hero) and the way back (case -> home card).
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
 * BACK (case -> home): the card travel. Browser back and the Back pill both come here (the pill goes through
 * navigate() when the page before the case was not home, so it is never a hash-URL hard load).
 * - applyAfterSwap sets html[data-vt="return"] and the html.vt-back class, centres the card (html[data-vt-return])
 *   and makes it the landing card: data-vt-landing, is-active, is-settled, --p 0, --res 1, an eager and sync image,
 *   and the inline names vt-cover (media) and vt-title (label name). The case page's static names (hero, h1) are
 *   still in the old snapshot, so the hero shrinks back into its card and the title returns to the label bar.
 * - The travel CSS (global.css, html.vt-back, never under reduced motion) keeps the old snapshot fully visible and
 *   fades the new one in late (vt-fade-in from 320ms). The landing picture may not be decoded at the first frame,
 *   and a late fade keeps the old picture on screen until the new one is ready.
 * - motion.ts settleReturnCard() re-centres the card after motion init, in the same task. The card keeps the same
 *   viewport position before and after the layout change, so the live new-state group does not move.
 * - The landing names and marker end in endReturnTravel(): 700ms after the swap (longer than the 520ms travel), on
 *   the next astro:before-preparation, and at the start of beginTravel. A name never survives into the next
 *   navigation.
 * - Fallback (html[data-vt="back"]): a 200ms root cross-fade with the card centred. Used for reduced motion, no
 *   View Transitions support, the theme switch, a card that is not on the page. Arriving at home from anything
 *   other than a case page takes no travel and no centring, as before.
 *
 * CASE -> CASE (Next project, then browser back to the previous case): prepareNavigation() strips the static names
 * of the case being left, so the old snapshot has no name to pair with the new page's names. The change is a plain
 * cross-fade, not a morph of the hero into the previous hero.
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
// Longer than the 520ms return travel in global.css. The landing names are cleared after it.
const RETURN_CLEAR_MS = 700;
const RETURN_CLASS = 'vt-back';
const LANDING_ATTR = 'data-vt-landing';

export interface TravelNames {
  cover?: HTMLElement | null;
  title?: HTMLElement | null;
  bar?: HTMLElement | null;
  /** The card's video, if the cover is one: its src and playhead are handed to the case hero. */
  video?: HTMLVideoElement | null;
}

// Inline names set by beginTravel (forward), removed in applyAfterSwap and beginTravel.
let named: HTMLElement[] = [];
// Inline names set on the landing card (return travel). Separate, so a forward travel never clears them by mistake.
let landingNamed: HTMLElement[] = [];
// Pathname a card or Next click is travelling to; consumed by applyAfterSwap.
let travel: string | null = null;
// Paths of the swap in progress; set by rememberSwap, consumed by applyAfterSwap.
let swapFrom: string | null = null;
// Timer that ends the return travel (endReturnTravel).
let returnTimer = 0;

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
  endReturnTravel();
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
 * Makes the card the landing card of a return travel: the real picture from the first frame (no ASCII, no pending
 * hide, eager image), the active and settled look, and the travel names on its media and label name.
 */
function landCard(item: HTMLElement): void {
  item.setAttribute(LANDING_ATTR, '');
  item.classList.add('is-active', 'is-settled');
  item.style.setProperty('--p', '0');
  item.style.setProperty('--res', '1');

  const media = item.querySelector<HTMLElement>('.stage > .media');
  if (media) {
    // A video card keeps its poster as the visible frame. It does not wait for the clip.
    if (media instanceof HTMLImageElement) {
      media.loading = 'eager';
      media.decoding = 'sync';
    }
    nameLanding(media, VT_COVER);
  }
  const label = item.querySelector<HTMLElement>('[data-label-name]');
  if (label) nameLanding(label, VT_TITLE);
}

function nameLanding(el: HTMLElement, name: string): void {
  el.style.setProperty('view-transition-name', name);
  landingNamed.push(el);
}

/** Called from astro:after-swap on the way back: the fallback or the card travel, decided here. */
function returnToHome(id: string): void {
  const root = document.documentElement;
  const card = document.getElementById(`work-${id}`);
  root.setAttribute('data-vt-return', id);
  if (card) window.scrollTo({ top: centreTop(card), behavior: 'instant' });

  if (!card || !travelAllowed()) {
    root.setAttribute('data-vt', 'back');
    return;
  }
  root.setAttribute('data-vt', 'return');
  root.classList.add(RETURN_CLASS);
  landCard(card);
  returnTimer = window.setTimeout(endReturnTravel, RETURN_CLEAR_MS);
}

/**
 * Ends the return travel: removes the landing names and marker, and the html.vt-back class. Safe to call at any time.
 * Runs 700ms after the swap, on every astro:before-preparation (so no name survives into the next navigation), and
 * at the start of beginTravel.
 */
export function endReturnTravel(): void {
  if (returnTimer) {
    clearTimeout(returnTimer);
    returnTimer = 0;
  }
  for (const el of landingNamed) el.style.removeProperty('view-transition-name');
  landingNamed = [];
  const root = document.documentElement;
  root.classList.remove(RETURN_CLASS);
  if (root.getAttribute('data-vt') === 'return') root.removeAttribute('data-vt');
  document.querySelectorAll(`[${LANDING_ATTR}]`).forEach((el) => el.removeAttribute(LANDING_ATTR));
}

/**
 * Called from astro:before-preparation for every navigation, before the browser takes the old snapshot. Ends any
 * return travel still in place, and strips the static names of a case page that is left for another case (the
 * old snapshot must not pair its hero with the new page's hero).
 */
export function prepareNavigation(from: URL, to: URL): void {
  endReturnTravel();
  if (caseIdOf(from.pathname) && to.pathname !== '/') {
    document.querySelectorAll<HTMLElement>('[data-vt-static]').forEach((el) => {
      el.style.removeProperty('view-transition-name');
    });
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
  endReturnTravel();
  clearNames();

  const from = swapFrom;
  const to = location.pathname;
  const travelled = travel;
  swapFrom = null;
  travel = null;

  const fromCase = from ? caseIdOf(from) : null;
  if (fromCase && to === '/') {
    returnToHome(fromCase);
    return;
  }

  if (travelled && to === travelled) {
    root.setAttribute('data-vt', 'forward');
    if (caseIdOf(to)) root.setAttribute('data-vt-arrive', '');
    handOffVideo();
  }
}
