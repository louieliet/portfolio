/*
 * Motion system: the single source of truth for every animation on the site.
 *
 * RULES
 * - One entrance ease, power3.out (CSS --ease-out). One hover ease, power3.inOut (CSS --ease-inout).
 * - Three durations: fast 0.3, base 0.45, slow 0.8 (CSS --dur-fast / --dur-base / --dur-slow). Line stagger 0.08.
 * - Animate only transform and opacity (plus clip-path for the theme circle).
 * - Everything motion-related is created inside gsap.matchMedia() under (prefers-reduced-motion: no-preference).
 *   Under reduced motion nothing is split, hidden, wrapped or animated. Arrivals are shown at once.
 * - Lenis and ScrollTrigger share one clock: gsap.ticker drives Lenis, and Lenis scroll events update ScrollTrigger.
 * - Hide-before-animate is applied by JS. The one CSS hide is html.js [data-arrive] (first viewport only), and it
 *   has a 2s failsafe in global.css.
 *
 * CONTRACT (attributes)
 * - data-roll="slow"          line roll on text. Slow = 0.8s, stagger 0.12. Below the fold it fires once at
 *                             "top 85%" (ScrollTrigger.batch). With data-arrive it is part of the load choreography.
 * - data-roll-delay="0.2"     optional delay in seconds for a data-roll.
 * - data-arrive="0.15"        load choreography offset in seconds. Used on the first viewport only:
 *                             data-roll (rolls at that time), data-ascii-field (row draw, 0.5s), a .reveal
 *                             block (gets .is-in at that time), data-scroll-cue (fades in at 0.9s, last).
 * - data-swap                 letter swap on a link or label (gesture 1). initMotion wraps its text nodes in clipped
 *                             per-character cells (mountSwap). Fine pointers only (CSS). aria-hidden copy; the
 *                             accessible name is kept on the link (aria-label) or in an .sr-only copy.
 * - data-no-inl               on an <a>: opts out of the default inline underline in global.css (gesture 1b).
 * - data-magnetic             wrapper that drifts up to 6px toward the pointer (gesture 3). Fine pointers, motion
 *                             only. Put it on a wrapper so its transform composes with the press scale.
 * - data-ascii-field          the hero field. Its load reveal writes data-reveal (0..1) on the element.
 * - data-scroll-cue           the hero's scroll cue. Its inner element fades (opacity) once the page scrolls 80px
 *                             (mountScrollCue, ScrollTrigger). Under reduced motion it stays visible.
 * - data-story                the "How I work" chapter (Story.astro). Desktop with motion: ONE pinned chapter,
 *                             scroll lights the words and drives the ASCII block (mountStoryPinned). Under 900px:
 *                             each beat lights once on entry (mountStoryFlow). Reduced motion: static, all lit.
 * - data-vt-keep              (case page) the hero and h1 of a card -> case travel. They are shown as they are and
 *                             never split or rolled: the new-state snapshot must show them. Only when html has
 *                             data-vt-arrive.
 * - data-vt-late              (case page) kicker, lead, meta row, overview and the Back pill. With data-vt-arrive
 *                             they fade in (LATE_AT, LATE_STAGGER) after the swap. Without it they are inert.
 * - html[data-vt-return]      the way back to home (page-transition.ts). The first viewport is already on screen,
 *                             so nothing rolls or replays, and settleReturnCard() re-centres the opened card.
 * - data-timeline             a Timeline. Its rail (data-timeline-draw) draws down on scroll and rows light as it
 *                             passes (mountTimeline).
 * - Footer (.site-footer) runs its own once-only arrival schedule at "top 85%".
 *
 * LIFECYCLE
 * - initMotion() on astro:page-load, destroyMotion() on astro:before-swap. Both are idempotent.
 * - The full choreography runs on the first arrival in a session (sessionStorage "motion:arrived").
 *   Later navigations use the short version: everything in the first viewport rolls together at 0.3s.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import type Lenis from 'lenis';
import { renderStoryFrame, renderStoryProduct, storyStage } from './ascii-story';
import { centreTop } from './page-transition';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------- Rules (the only numbers) ---------- */

export const EASE_OUT = 'power3.out';
export const EASE_INOUT = 'power3.inOut';
export const DUR = { fast: 0.3, base: 0.45, slow: 0.8 } as const;
export const LINE_STAGGER = 0.08;
const SLOW_LINE_STAGGER = 0.12;
const ASCII_DRAW_SECONDS = 0.5;
// Case page after a card travel: the late pieces start at 420ms, 70ms apart.
const LATE_AT = 0.42;
const LATE_STAGGER = 0.07;
const LATE_RISE = 14;

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';
const ARRIVED_KEY = 'motion:arrived';

// Line roll: each line rises from behind its mask while it rotates on X, like a roller.
const ROLL_FROM: gsap.TweenVars = { yPercent: 110, rotationX: -90, transformOrigin: '50% 100%', transformPerspective: 600 };
const ROLL_TO: gsap.TweenVars = { yPercent: 0, rotationX: 0 };

/* ---------- Scroll clock and velocity ---------- */

// The smoothed velocity has a 0.15s time constant and snaps to exactly 0 at rest (about 0.6s to settle).
const VELOCITY_TAU = 0.15;
const VELOCITY_REST = 0.002;
const VELOCITY_SCALE = 60;

let velocity = 0;
let lastTime = 0;
let lastScrollY = 0;

/** Smoothed scroll velocity in [-1, 1]. Always 0 when the scroll clock is not running (reduced motion). */
export function scrollEnergy(): number {
  return velocity;
}

function sampleVelocity(lenis: Lenis, time: number): void {
  const dt = lastTime ? Math.min(time - lastTime, 0.1) : 1 / 60;
  lastTime = time;
  const raw = Number.isFinite(lenis.velocity) ? lenis.velocity : window.scrollY - lastScrollY;
  lastScrollY = window.scrollY;
  const target = Math.max(-1, Math.min(1, raw / VELOCITY_SCALE));
  velocity += (target - velocity) * (1 - Math.exp(-dt / VELOCITY_TAU));
  if (Math.abs(velocity) < VELOCITY_REST) velocity = 0;
}

/**
 * Drive Lenis from gsap.ticker and let ScrollTrigger follow Lenis, so both share one clock.
 * Returns the teardown. Layout creates Lenis and calls this; it is the only place the scroll clock starts.
 */
export function startScrollClock(lenis: Lenis): () => void {
  lastTime = 0;
  lastScrollY = window.scrollY;
  const tick = (time: number): void => {
    lenis.raf(time * 1000);
    sampleVelocity(lenis, time);
  };
  // Wrapper, not ScrollTrigger.update itself: Lenis passes its own instance to the listener, and
  // ScrollTrigger.update treats its first argument as a force flag.
  const onScroll = (): void => ScrollTrigger.update();
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', onScroll);
  return () => {
    gsap.ticker.remove(tick);
    lenis.off('scroll', onScroll);
    gsap.ticker.lagSmoothing(500, 33);
    velocity = 0;
  };
}

/* ---------- Shared state (owned by initMotion, cleared by destroyMotion) ---------- */

const splits = new Map<HTMLElement, SplitText>();
const rolls = new Map<HTMLElement, gsap.core.Tween>();
const played = new Set<HTMLElement>();
let timelines: gsap.core.Timeline[] = [];
let triggers: ScrollTrigger[] = [];
let undo: Array<() => void> = [];
let arrived: HTMLElement[] = [];
let ctx: gsap.MatchMedia | null = null;
let refreshFrame = 0;

function reduced(): boolean {
  return window.matchMedia(REDUCE_QUERY).matches;
}

function scheduleRefresh(): void {
  if (refreshFrame) return;
  refreshFrame = requestAnimationFrame(() => {
    refreshFrame = 0;
    ScrollTrigger.refresh();
  });
}

function readArrived(): boolean {
  try {
    return sessionStorage.getItem(ARRIVED_KEY) === '1';
  } catch {
    return false;
  }
}

function writeArrived(): void {
  try {
    sessionStorage.setItem(ARRIVED_KEY, '1');
  } catch {
    // Storage blocked: every navigation plays the full choreography.
  }
}

/** Makes an arrival element visible and records it, so destroyMotion can hand visibility back. */
function unhide(el: HTMLElement): void {
  el.style.visibility = 'visible';
  arrived.push(el);
}

/* ---------- Line roll ---------- */

function playRoll(el: HTMLElement): void {
  const tween = rolls.get(el);
  if (!tween) return;
  played.add(el);
  tween.play(0);
}

function mountRoll(el: HTMLElement, short: boolean): void {
  const slow = el.dataset.roll === 'slow';
  const duration = short ? DUR.fast : slow ? DUR.slow : DUR.base;
  const stagger = short ? 0 : slow ? SLOW_LINE_STAGGER : LINE_STAGGER;
  const delay = Number(el.dataset.rollDelay) || 0;

  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'roll-line',
    // The hero role word is its own animated component; splitting it would destroy its nodes.
    ignore: '[data-role-word]',
    // The hero h1 keeps its own aria-label, so SplitText must not replace it.
    aria: el.tagName === 'H1' ? 'none' : 'auto',
    autoSplit: true,
    onSplit(self) {
      // Paused until playRoll(). A tween that already played stays at its end state after a re-split.
      const tween = gsap.fromTo(self.lines, ROLL_FROM, {
        ...ROLL_TO,
        duration,
        stagger,
        delay,
        ease: EASE_OUT,
        paused: !played.has(el),
      });
      if (played.has(el)) tween.progress(1);
      rolls.set(el, tween);
      scheduleRefresh();
      return tween;
    },
  });
  splits.set(el, split);
}

/* ---------- Letter swap (data-swap, gesture 1) ---------- */

// Per link: the child nodes it had before mountSwap, and whether it got an aria-label. Teardown restores both.
const swapped = new Set<HTMLElement>();
const graphemeSegmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
const SWAP_STAGGER_CAP = 10;

/** Grapheme clusters when Intl.Segmenter exists, so accented letters stay whole; code points otherwise. */
function graphemes(text: string): string[] {
  if (graphemeSegmenter) return Array.from(graphemeSegmenter.segment(text), (s) => s.segment);
  return Array.from(text);
}

/** One clipped cell: two identical faces stacked; CSS moves both up one line on hover. --i staggers the cell. */
function swapCell(ch: string, index: number): HTMLElement {
  const cell = document.createElement('span');
  cell.className = 'swap-char';
  cell.style.setProperty('--i', String(Math.min(index, SWAP_STAGGER_CAP)));
  const front = document.createElement('span');
  front.className = 'swap-face';
  front.textContent = /\s/.test(ch) ? ' ' : ch;
  cell.append(front, front.cloneNode(true));
  return cell;
}

/**
 * Wraps each text node of a link or label in .swap-word (aria-hidden). Element children (sup, count spans) stay
 * where they are and are not duplicated. Only fine pointers see the motion (CSS); the wrap itself is harmless.
 */
function mountSwap(el: HTMLElement): void {
  if (swapped.has(el)) return;
  const original = Array.from(el.childNodes);
  const hasElements = el.children.length > 0;
  let index = 0;
  let text = '';
  for (const node of original) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(node.textContent ?? '');
    const core = match?.[2] ?? '';
    if (!match || core === '') continue;

    const word = document.createElement('span');
    word.className = 'swap-word';
    word.setAttribute('aria-hidden', 'true');
    for (const ch of graphemes(core)) word.append(swapCell(ch, index++));

    const parts: Node[] = [];
    if (match[1]) parts.push(document.createTextNode(match[1]));
    parts.push(word);
    if (match[3]) parts.push(document.createTextNode(match[3]));
    node.replaceWith(...parts);
    text += core;
  }
  if (text === '') return;

  // The accessible name: aria-label on a bare link; otherwise a visually hidden copy of the text.
  const label = text.replace(/\s+/g, ' ').trim();
  const labelled = !hasElements && el.tagName === 'A';
  if (labelled) {
    el.setAttribute('aria-label', label);
  } else {
    const copy = document.createElement('span');
    copy.className = 'sr-only';
    copy.textContent = label;
    el.append(copy);
  }

  swapped.add(el);
  undo.push(() => {
    el.replaceChildren(...original);
    if (labelled) el.removeAttribute('aria-label');
    swapped.delete(el);
  });
}

/* ---------- Magnetic pull (data-magnetic, gesture 3) ---------- */

const MAGNET_MAX = 6;
const MAGNET_LERP = 0.16;
const FINE_QUERY = '(hover: hover) and (pointer: fine)';

/**
 * The wrapper drifts up to MAGNET_MAX px on each axis toward the pointer, eased in a rAF loop that runs only while
 * it is moving, and eases back to rest on leave. Fine pointers only; the transform is cleared on teardown.
 */
function mountMagnetic(el: HTMLElement): void {
  if (!window.matchMedia(FINE_QUERY).matches) return;
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let raf = 0;

  const step = (): void => {
    x += (tx - x) * MAGNET_LERP;
    y += (ty - y) * MAGNET_LERP;
    el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
    raf = Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05 ? requestAnimationFrame(step) : 0;
  };
  const kick = (): void => {
    if (!raf) raf = requestAnimationFrame(step);
  };
  const clampPull = (v: number): number => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
  const onMove = (event: PointerEvent): void => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    tx = clampPull(((event.clientX - rect.left - rect.width / 2) / rect.width) * 12);
    ty = clampPull(((event.clientY - rect.top - rect.height / 2) / rect.height) * 12);
    kick();
  };
  const onLeave = (): void => {
    tx = 0;
    ty = 0;
    kick();
  };

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerleave', onLeave);
  undo.push(() => {
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerleave', onLeave);
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    el.style.removeProperty('transform');
  });
}

/* ---------- Digit and label roll (WorkStack) ---------- */

/**
 * Replaces the text of a .roll-cell. dir 1 brings the new text from below (moving down the list), -1 from
 * above, and 0 swaps at once. force rolls even when the text is unchanged (the label of a newly active card).
 * The cell keeps the width of its widest face and clips the faces, so nothing shifts.
 */
export function rollText(cell: HTMLElement, text: string, dir: -1 | 0 | 1, force = false): void {
  const prev = cell.lastElementChild as HTMLElement | null;
  if (prev && !force && prev.textContent === text) return;

  const next = document.createElement('span');
  next.className = 'cell-face';
  next.textContent = text;

  if (!prev || dir === 0 || reduced()) {
    cell.replaceChildren(next);
    return;
  }

  cell.append(next);
  gsap.fromTo(next, { yPercent: 100 * dir }, { yPercent: 0, duration: DUR.fast, ease: EASE_OUT, overwrite: 'auto' });
  gsap.to(prev, {
    yPercent: -100 * dir,
    duration: DUR.fast,
    ease: EASE_OUT,
    overwrite: 'auto',
    onComplete: () => prev.remove(),
  });
}

/* ---------- Arrivals: first viewport, one timeline ---------- */

function buildArrivals(short: boolean, settled: (el: HTMLElement) => boolean): void {
  const tl = gsap.timeline();
  timelines.push(tl);
  const dur = short ? DUR.fast : DUR.slow;

  document.querySelectorAll<HTMLElement>('[data-arrive]').forEach((el) => {
    if (settled(el)) {
      // Already on screen (card -> case hero, or back to home): no roll, no replay. Only the end states are set.
      if (el.classList.contains('reveal')) el.classList.add('is-in');
      if (el.hasAttribute('data-scroll-cue')) gsap.set(el, { opacity: 1 });
      return;
    }
    const at = short ? 0 : Number(el.dataset.arrive) || 0;

    if (el.hasAttribute('data-ascii-field')) {
      if (short) return;
      el.dataset.reveal = '0';
      el.textContent = '';
      const progress = { value: 0 };
      tl.to(
        progress,
        {
          value: 1,
          duration: ASCII_DRAW_SECONDS,
          ease: 'none',
          onUpdate: () => {
            el.dataset.reveal = progress.value.toFixed(3);
          },
        },
        at,
      );
      return;
    }

    if (el.hasAttribute('data-roll')) {
      tl.call(playRoll, [el], at);
      return;
    }

    if (el.hasAttribute('data-scroll-cue')) {
      // Joins last. A plain opacity fade on the outer element; the scroll fade (mountScrollCue) owns the inner one.
      gsap.set(el, { opacity: 0 });
      tl.to(el, { opacity: 1, duration: dur, ease: EASE_OUT }, at);
      return;
    }

    if (el.classList.contains('reveal')) {
      tl.call(() => el.classList.add('is-in'), [], at);
    }
  });
}

/**
 * Case page after a card travel: the pieces the shared shot does not carry fade in from LATE_AT, staggered. The
 * markup hides them (html[data-vt-arrive] in global.css) until this runs, so the new snapshot never shows them early.
 */
function buildLateArrivals(): void {
  const late = Array.from(document.querySelectorAll<HTMLElement>('[data-vt-late]'));
  if (late.length === 0) return;
  const backs = late.filter((el) => el.hasAttribute('data-case-back'));
  const lifts = late.filter((el) => !el.hasAttribute('data-case-back'));
  gsap.set(lifts, { opacity: 0, y: LATE_RISE });
  gsap.set(backs, { opacity: 0 });
  const tl = gsap.timeline();
  timelines.push(tl);
  tl.to(lifts, { opacity: 1, y: 0, duration: DUR.base, ease: EASE_OUT, stagger: LATE_STAGGER }, LATE_AT);
  // The Back pill has its own 300ms opacity transition. Turn it off during the tween so the two do not chase.
  backs.forEach((el) => {
    el.style.transition = 'none';
  });
  const backAt = LATE_AT + LATE_STAGGER * lifts.length;
  tl.to(
    backs,
    {
      opacity: 1,
      duration: DUR.base,
      ease: EASE_OUT,
      // Clear the inline opacity at the end, so the footer's .is-hidden rule can hide the pill again.
      clearProps: 'opacity',
      onComplete: () => backs.forEach((el) => el.style.removeProperty('transition')),
    },
    backAt,
  );
  // The markup hides the late pieces only while data-vt-arrive is set. Remove it once they are all in place.
  tl.call(() => document.documentElement.removeAttribute('data-vt-arrive'), [], backAt + DUR.base);
}

/* ---------- Once-per-view triggers ---------- */

function mountBatch(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-roll]')).filter(
    (el) => !el.hasAttribute('data-arrive') && !el.closest('.site-footer'),
  );
  if (targets.length === 0) return;
  triggers.push(
    ...ScrollTrigger.batch(targets, {
      start: 'top 85%',
      once: true,
      onEnter: (elements: Element[]) => {
        elements.forEach((el) => playRoll(el as HTMLElement));
      },
    }),
  );
}

function mountFooter(footer: HTMLElement): void {
  const cta = footer.querySelector<HTMLElement>('[data-roll]');
  const row = footer.querySelector<HTMLElement>('.email');
  const links = Array.from(footer.querySelectorAll<HTMLElement>('.links > li'));
  const meta = Array.from(footer.querySelectorAll<HTMLElement>('.meta > *'));
  const copy = footer.querySelector<HTMLElement>('.copyright');
  const fades = [row, copy, ...links, ...meta].filter((el): el is HTMLElement => el !== null);

  gsap.set(fades, { opacity: 0, y: 12 });

  const tl = gsap.timeline({ paused: true });
  timelines.push(tl);
  if (cta) tl.call(playRoll, [cta], 0);
  if (row) tl.to(row, { opacity: 1, y: 0, duration: DUR.base, ease: EASE_OUT }, 0.25);
  tl.to(links, { opacity: 1, y: 0, duration: DUR.base, ease: EASE_OUT, stagger: 0.08 }, 0.4);
  tl.to(meta, { opacity: 1, y: 0, duration: DUR.base, ease: EASE_OUT, stagger: 0.08 }, 0.55);
  if (copy) tl.to(copy, { opacity: 1, y: 0, duration: DUR.base, ease: EASE_OUT }, 0.65);

  triggers.push(
    ScrollTrigger.create({
      trigger: footer,
      start: 'top 85%',
      once: true,
      onEnter: () => tl.play(),
    }),
  );
}

/* ---------- Timeline draws ---------- */

/**
 * The rail draws down the rows as the timeline scrolls through the viewport, and each row lights when the rail
 * reaches its top. The scrub drives a proxy so the rail and the rows share one smoothed progress value.
 */
function mountTimeline(root: HTMLElement): void {
  const draw = root.querySelector<HTMLElement>('[data-timeline-draw]');
  const wrap = draw?.parentElement;
  if (!draw || !wrap) return;
  const rows = Array.from(root.querySelectorAll<HTMLElement>('.row'));
  let tops: number[] = [];
  const drive = { p: 0 };

  root.classList.add('is-drawing');
  root.style.setProperty('--draw', '0');
  undo.push(() => {
    root.classList.remove('is-drawing');
    root.style.removeProperty('--draw');
    for (const row of rows) row.classList.remove('is-lit');
  });

  const paint = (p: number): void => {
    root.style.setProperty('--draw', p.toFixed(3));
    const y = p * wrap.offsetHeight;
    rows.forEach((row, i) => row.classList.toggle('is-lit', y >= tops[i]));
  };

  const scrubbed = gsap.timeline().to(drive, { p: 1, ease: 'none', onUpdate: () => paint(drive.p) });
  timelines.push(scrubbed);
  triggers.push(
    ScrollTrigger.create({
      trigger: root,
      start: 'top 75%',
      end: 'bottom 60%',
      scrub: 0.5,
      animation: scrubbed,
      onRefresh: () => {
        tops = rows.map((row) => row.offsetTop);
        paint(drive.p);
      },
    }),
  );
}

/* ---------- Story chapter ("How I work") ---------- */

// Beat i owns scroll progress [i/3, i/3 + STORY_SPAN]. Inside that window word j starts at its own offset and
// fades to full over STORY_FADE. The first word of beat 1 is always lit, so the section never looks empty.
const STORY_SPAN = 0.26;
const STORY_FADE = 0.06;
const STORY_LIT_FLOOR = 0.22;
const STORY_NOISE_SPEED = 1.8; // noise phase per second, the same rate as the hero field
const STORY_PIN_QUERY = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';
const STORY_FLOW_QUERY = '(max-width: 899px) and (prefers-reduced-motion: no-preference)';

// Bumped on every mount and on teardown. A shimmer loop or observer from an older mount sees the mismatch and stops.
let storyRun = 0;

interface StoryParts {
  beats: HTMLElement[];
  pluses: HTMLElement[];
  caption: HTMLElement;
  ascii: HTMLElement;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function headerHeight(): number {
  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h'));
  return Number.isFinite(value) ? value : 0;
}

function storyParts(root: HTMLElement): StoryParts | null {
  const beats = Array.from(root.querySelectorAll<HTMLElement>('[data-story-beat]'));
  const caption = root.querySelector<HTMLElement>('[data-story-caption]');
  const ascii = root.querySelector<HTMLElement>('[data-story-ascii]');
  if (beats.length === 0 || !caption || !ascii) return null;
  return {
    beats,
    pluses: Array.from(root.querySelectorAll<HTMLElement>('[data-story-plus]')),
    caption,
    ascii,
  };
}

/** Splits one beat into words. aria: 'auto' keeps the whole sentence readable as one label. */
function splitWords(beat: HTMLElement): HTMLElement[] {
  splits.get(beat)?.revert();
  splits.delete(beat);
  const split = SplitText.create(beat, { type: 'words', aria: 'auto', wordsClass: 'story-word' });
  splits.set(beat, split);
  return split.words as HTMLElement[];
}

/**
 * Desktop with motion: one ScrollTrigger pins the stage under the header. The trigger drives a scrubbed
 * timeline (scrub 0.5 gives the smoothing), and that timeline's update lights the words, the plus signs, the
 * caption. Between scroll events a shimmer loop moves the noise, but only while the
 * chapter is on screen and the tab is visible.
 */
function mountStoryPinned(root: HTMLElement): void {
  const parts = storyParts(root);
  const stage = root.querySelector<HTMLElement>('[data-story-stage]');
  if (!parts || !stage) return;
  const { beats, pluses, caption, ascii } = parts;
  const run = ++storyRun;

  root.classList.add('is-pinned');
  const wordsByBeat = beats.map(splitWords);

  let progress = 0;
  let lastStage = '';
  let t = 0;
  let frame = 0;
  let visible = false;
  let last = 0;

  const paintFrame = (): void => {
    ascii.textContent = renderStoryFrame(progress, t);
  };

  const apply = (p: number): void => {
    progress = p;
    wordsByBeat.forEach((words, i) => {
      const lo = i / 3;
      words.forEach((word, j) => {
        const start = lo + STORY_SPAN * (j / words.length);
        const lit = i === 0 && j === 0 ? 1 : clamp01((p - start) / STORY_FADE);
        word.style.opacity = String(STORY_LIT_FLOOR + (1 - STORY_LIT_FLOOR) * lit);
      });
    });
    pluses.forEach((plus, k) => plus.classList.toggle('is-on', p >= (k + 1) / 3 - 0.03));
    const name = storyStage(p);
    if (name !== lastStage) {
      caption.textContent = name;
      lastStage = name;
    }
  };

  const loop = (now: number): void => {
    frame = 0;
    if (run !== storyRun) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    t += dt * STORY_NOISE_SPEED;
    paintFrame();
    frame = requestAnimationFrame(loop);
  };

  const sync = (): void => {
    if (run !== storyRun) {
      if (frame !== 0) cancelAnimationFrame(frame);
      frame = 0;
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      return;
    }
    const want = visible && !document.hidden;
    if (want && frame === 0) {
      last = 0;
      frame = requestAnimationFrame(loop);
    } else if (!want && frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1]?.isIntersecting ?? false;
      sync();
    },
    { threshold: 0 },
  );
  io.observe(root);
  document.addEventListener('visibilitychange', sync);
  undo.push(() => {
    storyRun++;
    if (frame !== 0) cancelAnimationFrame(frame);
    frame = 0;
    io.disconnect();
    document.removeEventListener('visibilitychange', sync);
  });

  const driver = { p: 0 };
  const scrubbed = gsap.timeline().to(driver, { p: 1, ease: 'none', onUpdate: () => apply(driver.p) });
  timelines.push(scrubbed);
  triggers.push(
    ScrollTrigger.create({
      trigger: root,
      pin: stage,
      animation: scrubbed,
      start: () => `top top+=${headerHeight()}`,
      end: '+=200%',
      scrub: 0.5,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // Higher priority refreshes first, so every trigger below the pin accounts for its spacer.
      refreshPriority: 1,
    }),
  );

  apply(0);
  paintFrame();
}

/** Under 900px: no pin. Each beat lights once as it enters the viewport. The PRODUCT frame stays static. */
function mountStoryFlow(root: HTMLElement): void {
  const parts = storyParts(root);
  if (!parts) return;
  storyRun++;
  root.classList.remove('is-pinned');
  parts.ascii.textContent = renderStoryProduct();

  parts.beats.forEach((beat) => {
    const words = splitWords(beat);
    gsap.set(words, { opacity: STORY_LIT_FLOOR });
    triggers.push(
      ScrollTrigger.create({
        trigger: beat,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(words, { opacity: 1, duration: DUR.base, ease: EASE_OUT, stagger: 0.03 });
        },
      }),
    );
  });
}

/* ---------- Scroll cue ---------- */

const SCROLL_CUE_PX = 80;

/** Marks the cue faded once the page has scrolled past SCROLL_CUE_PX. ScrollTrigger shares the Lenis clock. */
function mountScrollCue(cue: HTMLElement): void {
  triggers.push(
    ScrollTrigger.create({
      start: SCROLL_CUE_PX,
      end: 'max',
      onToggle: (self) => cue.classList.toggle('is-faded', self.isActive),
    }),
  );
}

/* ---------- Full and reduced branches ---------- */

function mountFull(short: boolean): void {
  const root = document.documentElement;
  // Only first-viewport items (data-arrive) can settle. Back to home: all of them are already on screen. Card -> case:
  // the hero and h1 are kept as they are, and the late pieces fade in later (buildLateArrivals).
  const returning = root.hasAttribute('data-vt-return');
  const travelled = root.hasAttribute('data-vt-arrive');
  const settled = (el: HTMLElement): boolean =>
    el.hasAttribute('data-arrive') &&
    (returning || (travelled && (el.hasAttribute('data-vt-keep') || el.hasAttribute('data-vt-late'))));

  // Arrivals first: each one becomes visible in the same task that sets its start state, so nothing paints early.
  document.querySelectorAll<HTMLElement>('[data-arrive]').forEach(unhide);
  document.querySelectorAll<HTMLElement>('[data-roll]').forEach((el) => {
    if (settled(el)) return;
    mountRoll(el, short);
  });
  document.querySelectorAll<HTMLElement>('[data-swap]').forEach(mountSwap);
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(mountMagnetic);
  buildArrivals(short, settled);
  if (travelled) buildLateArrivals();
  mountBatch();
  document.querySelectorAll<HTMLElement>('[data-timeline]').forEach(mountTimeline);
  document.querySelectorAll<HTMLElement>('[data-scroll-cue]').forEach(mountScrollCue);
  const footer = document.querySelector<HTMLElement>('.site-footer');
  if (footer) {
    mountFooter(footer);
  }
  scheduleRefresh();
  void document.fonts.ready.then(() => scheduleRefresh());
}

function showStatic(): void {
  // Reduced motion: nothing is split, hidden or animated. Arrivals are simply shown.
  document.querySelectorAll<HTMLElement>('[data-arrive]').forEach(unhide);
  // A card travel never starts under reduced motion, but the late pieces must never stay hidden.
  document.querySelectorAll<HTMLElement>('[data-vt-late]').forEach((el) => {
    el.style.opacity = '1';
  });
}

/**
 * Back to home: re-centres the card the reader opened, after motion init and a ScrollTrigger refresh. Init adds the
 * Story pin spacer and the Experience sticky track, which move the card down the page. This runs in the same task
 * as init, so no frame shows the move. With Lenis running, the position is set with immediate: true.
 */
export function settleReturnCard(lenis: Lenis | null): void {
  const id = document.documentElement.getAttribute('data-vt-return');
  if (!id) return;
  const card = document.getElementById(`work-${id}`);
  if (!card) return;
  ScrollTrigger.refresh();
  const top = centreTop(card);
  if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: 'instant' });
}

/* ---------- Theme switch ---------- */

/**
 * Switch the theme inside a view transition: a circle grows from the origin (the theme dot) to the farthest
 * corner. Without startViewTransition or under reduced motion it is an instant switch. `commit` applies
 * the theme and stores it.
 */
export function switchTheme(origin: { x: number; y: number }, commit: () => void): void {
  const root = document.documentElement;
  if (reduced() || typeof document.startViewTransition !== 'function') {
    commit();
    return;
  }

  root.classList.add('theme-switching');
  const transition = document.startViewTransition(commit);
  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );
  const center = `${origin.x}px ${origin.y}px`;
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${center})`, `circle(${radius}px at ${center})`] },
        {
          duration: 650,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => undefined);
  void transition.finished.finally(() => root.classList.remove('theme-switching'));
}

/* ---------- Lifecycle ---------- */

/** Builds every motion piece for the current page. Safe to call again: it tears down first. */
export function initMotion(): void {
  destroyMotion();
  const short = readArrived();
  writeArrived();
  ctx = gsap.matchMedia();
  ctx.add(MOTION_QUERY, () => mountFull(short));
  ctx.add(REDUCE_QUERY, () => showStatic());
  // The chapter has its own queries so it can switch between pinned and flow across the 900px breakpoint.
  const story = document.querySelector<HTMLElement>('[data-story]');
  if (story) {
    ctx.add(STORY_PIN_QUERY, () => mountStoryPinned(story));
    ctx.add(STORY_FLOW_QUERY, () => mountStoryFlow(story));
  }
}

/** Reverts every SplitText, kills every tween and ScrollTrigger this module made, and restores the DOM it touched. */
export function destroyMotion(): void {
  if (refreshFrame) {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
  }
  for (const tl of timelines) tl.kill();
  timelines = [];
  // revert = true removes pin spacers and restores pinned elements before Astro swaps the page.
  for (const trigger of triggers) trigger.kill(true);
  triggers = [];
  for (const split of splits.values()) split.revert();
  splits.clear();
  rolls.clear();
  played.clear();
  for (const fn of undo) fn();
  undo = [];
  for (const el of arrived) el.style.visibility = '';
  arrived = [];
  ctx?.revert();
  ctx = null;
}
