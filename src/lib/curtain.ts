/*
 * Curtain: the full-screen ASCII cover on the home page. On every arrival at home it covers the whole viewport
 * (header included) in the page background, fills it with the hero's wave glyphs, then dissolves it cell by cell
 * from the bottom of the screen to the top. The hero's own arrival starts as the dissolve starts (motion.ts).
 *
 * TIMING (seconds from the start)
 * - 0 to CURTAIN_FILL: glyphs appear. Each cell has a fixed hash and shows once the fill front passes it.
 * - CURTAIN_HOLD: the dissolve starts. showsMedia (ascii-image.ts) opens cells bottom to top, the same sweep the
 *   work-card photos use, so the two effects read as one material.
 * - CURTAIN_TOTAL (HOLD + DISSOLVE): the cover is gone.
 *
 * WHY A CANVAS ON TOP OF A CSS COVER
 * - The cover element is in the server HTML (Curtain.astro), so it is on the first paint and nothing flashes before
 *   JS runs. The canvas only draws the background, the glyphs, and the cells that are open.
 * - Open cells must show the page, so the element's own background becomes transparent right after the first full
 *   paint of the cover. The canvas fills bg itself, so there is never an uncovered frame.
 *
 * LIFECYCLE
 * - mountCurtain runs inside buildArrivals. Its single proxy tween lives on the arrivals timeline, and its teardown
 *   goes into motion.ts undo.
 * - If the CSS failsafe (2.5s, in Curtain.astro) already hid the cover, or the cover is hidden by
 *   CSS, mountCurtain hides it for good and returns null. A page the visitor can already see is never re-covered.
 * - Otherwise JS owns the cover: the CSS failsafe is cancelled, and a timer finishes it at CURTAIN_TOTAL + 0.6s.
 *   The tween lives in a gsap.matchMedia context and needs the ticker. If the context reverts while the cover is
 *   open (reduced motion toggled), or the tab is in the background, the tween may never complete. The timer makes
 *   sure the page is never left covered.
 */

import gsap from 'gsap';
import { hash, showsMedia } from './ascii-image';
import { glyphIndex, RAMP } from './wave';

export const CURTAIN_FILL = 0.3; // glyphs appear
export const CURTAIN_HOLD = 0.4; // the dissolve starts here
export const CURTAIN_DISSOLVE = 0.7; // the dissolve runs from CURTAIN_HOLD to the end
export const CURTAIN_TOTAL = CURTAIN_HOLD + CURTAIN_DISSOLVE;

// Mirrors of AsciiField.astro. A .astro script cannot be imported, so these values are kept in step by hand.
const BASE_FONT = 11; // the hero field's glyph size; cell height = font size
const SPEED = 1.8; // wave phase per second (AsciiField SPEED)
const MAX_CELLS = 9600; // the same budget as AsciiField (160 x 60)

const SAFETY_MARGIN = 0.6; // seconds after CURTAIN_TOTAL before the timer finishes the cover
// The dissolve reads its own hash table, offset from the fill table, so a cell does not open where it filled first.
const DISSOLVE_DX = 37;
const DISSOLVE_DY = 19;

export interface CurtainGrid {
  cols: number;
  rows: number;
}

interface Palette {
  bg: string;
  fg: string;
  font: string;
}

interface Layout {
  size: number; // glyph size and cell height, CSS px
  cellW: number; // CSS px
  cols: number;
  rows: number;
  fill: Float32Array; // per cell, the fill hash
  dissolve: Float32Array; // per cell, the dissolve hash
}

/** Grid that covers a width x height area. The caller applies the cell budget. */
export function curtainGrid(width: number, height: number, cellW: number, cellH: number): CurtainGrid {
  return { cols: Math.ceil(width / cellW), rows: Math.ceil(height / cellH) };
}

/** A cell shows its glyph once the fill front (0 to 1 over CURTAIN_FILL) has passed its hash. */
export function fillShown(cellHash: number, t: number): boolean {
  return cellHash <= Math.min(1, t / CURTAIN_FILL);
}

/** Dissolve progress: -1 before the hold (nothing opens), then 0 to 1 over CURTAIN_DISSOLVE. */
export function dissolveAmount(t: number): number {
  if (t < CURTAIN_HOLD) return -1;
  return Math.min(1, (t - CURTAIN_HOLD) / CURTAIN_DISSOLVE);
}

function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  return {
    bg: style.getPropertyValue('--bg').trim() || '#0b0c0b',
    fg: style.getPropertyValue('--text').trim() || '#ededed',
    font: style.getPropertyValue('--font-mono').trim() || 'monospace',
  };
}

function hashTable(cols: number, rows: number, dx: number, dy: number): Float32Array {
  const out = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) out[y * cols + x] = hash(x + dx, y + dy);
  }
  return out;
}

/**
 * Mounts the cover on `el` (the [data-curtain] element, which holds one canvas) and adds its proxy tween to `tl` at 0.
 * Returns the teardown, or null when the cover is not playing (already hidden, so the page is shown as it is).
 */
export function mountCurtain(el: HTMLElement, tl: gsap.core.Timeline): (() => void) | null {
  const canvas = el.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  const style = getComputedStyle(el);
  if (!canvas || !ctx || style.visibility === 'hidden' || style.display === 'none') {
    el.style.display = 'none';
    return null;
  }

  // JS takes over from the CSS failsafe: from here the timer below guarantees removal.
  el.style.animation = 'none';

  const palette = readPalette();
  // Device ratio capped at 2 (the same cap as the ASCII image overlay). Drawing is in CSS px via setTransform.
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const clock = { t: 0 };
  let css = { w: 0, h: 0 };
  let layout: Layout | null = null;
  let done = false;
  let timer = 0;

  const setSize = (): void => {
    const box = canvas.getBoundingClientRect();
    css = { w: box.width, h: box.height };
    canvas.width = Math.round(box.width * ratio);
    canvas.height = Math.round(box.height * ratio);
  };

  const measure = (size: number): { cellW: number; cols: number; rows: number } => {
    ctx.font = `500 ${size}px ${palette.font}`;
    const cellW = ctx.measureText('0').width;
    return { cellW, ...curtainGrid(css.w, css.h, cellW, size) };
  };

  // Font size starts at the hero's 11px. A full-screen grid can exceed the budget, so the glyphs grow once to fit.
  const layoutFor = (): Layout | null => {
    setSize();
    if (css.w <= 0 || css.h <= 0) return null;
    let size = BASE_FONT;
    let grid = measure(size);
    const cells = grid.cols * grid.rows;
    if (cells > MAX_CELLS) {
      size *= Math.sqrt(cells / MAX_CELLS);
      grid = measure(size);
    }
    return {
      size,
      ...grid,
      fill: hashTable(grid.cols, grid.rows, 0, 0),
      dissolve: hashTable(grid.cols, grid.rows, DISSOLVE_DX, DISSOLVE_DY),
    };
  };

  const paint = (t: number): void => {
    if (done || !layout) return;
    const { size, cellW, cols, rows, fill, dissolve } = layout;
    const { w, h } = css;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (t >= CURTAIN_TOTAL) return;

    const res = dissolveAmount(t);
    const isOpen = (x: number, y: number): boolean => res >= 0 && showsMedia(res, y, rows, dissolve[y * cols + x]);

    // Pass 1, the cover: the whole canvas in the page background, then every open cell cleared. Cell edges are
    // rounded to whole pixels, so neighbouring cells share an edge and no hairline shows between them.
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, w, h);
    if (res >= 0) {
      for (let y = 0; y < rows; y++) {
        const y0 = Math.round(y * size);
        const y1 = Math.round((y + 1) * size);
        for (let x = 0; x < cols; x++) {
          if (!isOpen(x, y)) continue;
          const x0 = Math.round(x * cellW);
          const x1 = Math.round((x + 1) * cellW);
          ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
        }
      }
    }

    // Pass 2, the glyphs: cells that are filled and not open. Text colour, no alpha: the same material as the hero.
    ctx.font = `500 ${size}px ${palette.font}`;
    ctx.textBaseline = 'top';
    ctx.fillStyle = palette.fg;
    const phase = t * SPEED;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const k = y * cols + x;
        if (isOpen(x, y) || !fillShown(fill[k], t)) continue;
        const glyph = RAMP[glyphIndex(x, y, phase, null, 1)];
        if (glyph === ' ') continue;
        ctx.fillText(glyph, x * cellW, y * size);
      }
    }
  };

  const finish = (): void => {
    if (done) return;
    done = true;
    window.clearTimeout(timer);
    window.removeEventListener('resize', relayout);
    el.style.display = 'none';
    // Frees the backing store. The element is hidden, so nothing reads the canvas again.
    canvas.width = 0;
    canvas.height = 0;
  };

  function relayout(): void {
    if (done) return;
    layout = layoutFor();
    paint(clock.t);
  }

  const tween = gsap.to(clock, {
    t: CURTAIN_TOTAL,
    duration: CURTAIN_TOTAL,
    ease: 'none',
    onUpdate: () => paint(clock.t),
    onComplete: finish,
  });
  tl.add(tween, 0);

  layout = layoutFor();
  paint(0);
  // The canvas has painted the full cover (bg fill), so the element's own background can go. Same task, no gap.
  el.style.background = 'transparent';
  window.addEventListener('resize', relayout);
  void document.fonts.ready.then(relayout);
  timer = window.setTimeout(finish, (CURTAIN_TOTAL + SAFETY_MARGIN) * 1000);

  return () => {
    tween.kill();
    finish();
  };
}
