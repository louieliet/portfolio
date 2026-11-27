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
 *                             data-roll (rolls at that time), data-ascii-field (row draw, 0.5s), a .card
 *                             (rises 40px, 0.8s), a .reveal block (gets .is-in at that time).
 * - data-roll-hover           hover roll on a link or label. Fine pointers only (CSS), wrapped by initMotion.
 * - data-scrub                scroll-lit words (opacity 0.28 to 1 between "top 80%" and "top 35%").
 * - data-ascii-field          the hero field. Its load reveal writes data-reveal (0..1) on the element.
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

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------- Rules (the only numbers) ---------- */

export const EASE_OUT = 'power3.out';
export const EASE_INOUT = 'power3.inOut';
export const DUR = { fast: 0.3, base: 0.45, slow: 0.8 } as const;
export const LINE_STAGGER = 0.08;
const SLOW_LINE_STAGGER = 0.12;
const ARRIVE_RISE_PX = 40;
const ASCII_DRAW_SECONDS = 0.5;

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

/**
 * Line roll for text that changes in place (the hero fun fact). Splits the new text, rolls it in, and
 * leaves the element as plain text under reduced motion.
 */
export function swapLines(el: HTMLElement, text: string): void {
  splits.get(el)?.revert();
  splits.delete(el);
  rolls.delete(el);
  el.textContent = text;
  if (reduced()) return;
  const split = SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'roll-line',
    aria: 'none',
  });
  gsap.fromTo(split.lines, ROLL_FROM, { ...ROLL_TO, duration: DUR.fast, stagger: LINE_STAGGER, ease: EASE_OUT });
  splits.set(el, split);
}

/* ---------- Hover roll ---------- */

/**
 * Wraps each text node of a link or label in a holder with two identical faces. CSS (global.css) rolls the
 * faces on hover for fine pointers. Element children (sup, count spans) stay where they are.
 */
function mountHover(el: HTMLElement): void {
  const original = Array.from(el.childNodes);
  let wrapped = false;
  for (const node of original) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const match = /^(\s*)([\s\S]*?)(\s*)$/.exec(node.textContent ?? '');
    const core = match?.[2] ?? '';
    if (!match || core === '') continue;

    const face = document.createElement('span');
    face.className = 'roll-face';
    face.textContent = core;
    const copy = face.cloneNode(true) as HTMLElement;
    copy.setAttribute('aria-hidden', 'true');
    const holder = document.createElement('span');
    holder.className = 'roll-holder';
    holder.append(face, copy);

    const parts: Node[] = [];
    if (match[1]) parts.push(document.createTextNode(match[1]));
    parts.push(holder);
    if (match[3]) parts.push(document.createTextNode(match[3]));
    node.replaceWith(...parts);
    wrapped = true;
  }
  if (wrapped) undo.push(() => el.replaceChildren(...original));
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

/* ---------- Scroll-lit words ---------- */

function mountScrub(el: HTMLElement): void {
  const split = SplitText.create(el, {
    type: 'words',
    autoSplit: true,
    onSplit(self) {
      const words = self.words;
      const tl = gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 35%', scrub: 0.5 } })
        .fromTo(
          words,
          { opacity: 0.28 },
          { opacity: 1, duration: 0.1, ease: 'none', stagger: 0.9 / Math.max(words.length - 1, 1) },
        );
      timelines.push(tl);
      scheduleRefresh();
      return tl;
    },
  });
  splits.set(el, split);
}

/* ---------- Arrivals: first viewport, one timeline ---------- */

function buildArrivals(short: boolean): void {
  const tl = gsap.timeline();
  timelines.push(tl);
  const dur = short ? DUR.fast : DUR.slow;

  document.querySelectorAll<HTMLElement>('[data-arrive]').forEach((el) => {
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

    if (el.classList.contains('card')) {
      // Rise through the individual translate property, so the stack's transform (tilt, velocity) is untouched.
      const rise = short ? 0 : ARRIVE_RISE_PX;
      const lift = { y: rise };
      el.style.translate = `0px ${rise}px`;
      undo.push(() => {
        el.style.translate = '';
      });
      gsap.set(el, { opacity: 0 });
      tl.to(el, { opacity: 1, duration: dur, ease: EASE_OUT }, at);
      tl.to(
        lift,
        {
          y: 0,
          duration: dur,
          ease: EASE_OUT,
          onUpdate: () => {
            el.style.translate = `0px ${lift.y}px`;
          },
        },
        at,
      );
      return;
    }

    if (el.classList.contains('reveal')) {
      tl.call(() => el.classList.add('is-in'), [], at);
    }
  });
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

/* ---------- Full and reduced branches ---------- */

function mountFull(short: boolean): void {
  // Arrivals first: each one becomes visible in the same task that sets its start state, so nothing paints early.
  document.querySelectorAll<HTMLElement>('[data-arrive]').forEach(unhide);
  document.querySelectorAll<HTMLElement>('[data-roll]').forEach((el) => mountRoll(el, short));
  document.querySelectorAll<HTMLElement>('[data-roll-hover]').forEach(mountHover);
  document.querySelectorAll<HTMLElement>('[data-scrub]').forEach(mountScrub);
  buildArrivals(short);
  mountBatch();
  const footer = document.querySelector<HTMLElement>('.site-footer');
  if (footer) mountFooter(footer);
  scheduleRefresh();
  void document.fonts.ready.then(() => scheduleRefresh());
}

function showStatic(): void {
  // Reduced motion: nothing is split, hidden or animated. Arrivals are simply shown.
  document.querySelectorAll<HTMLElement>('[data-arrive]').forEach(unhide);
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
}

/** Reverts every SplitText, kills every tween and ScrollTrigger this module made, and restores the DOM it touched. */
export function destroyMotion(): void {
  if (refreshFrame) {
    cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
  }
  for (const tl of timelines) tl.kill();
  timelines = [];
  for (const trigger of triggers) trigger.kill();
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
