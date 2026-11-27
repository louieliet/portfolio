/*
 * ASCII image resolve for the home work stack (components/WorkStack.astro).
 *
 * A card's media frame has a canvas on top that paints the picture as characters on the page background.
 * As the card travels toward the viewport centre, the characters dissolve cell by cell and the real media
 * shows through the cells that have resolved. This module holds the maths and the canvas painting. The
 * stack owns the DOM, the observers and the scroll state.
 *
 * MATH
 * - Position p: the card's clamped offset from the viewport centre (-1..1, 0 = centre).
 * - Resolve amount: res = smoothstep(0.62, 0.1, |p|). 1 at the centre (|p| <= 0.1), 0 at |p| >= 0.62.
 * - Cell hash: hash(x, y) = fract(sin(x * 127.1 + y * 311.7) * 43758.5453). A fixed value per cell. Callers
 *   pass x + cardIndex * 7 and y + 3, so every card dissolves in its own pattern.
 * - Sweep: sweep = (1 - y / rows) * 0.28. The bottom row has the lowest threshold, so the dissolve runs from
 *   the bottom of the frame to the top.
 * - Cell state: a cell shows the real media (left transparent) when res * 1.3 - sweep > hash. Otherwise it
 *   paints a background fill and one glyph. At res 0 every cell is ASCII. At res 1 every threshold is above 1,
 *   so every cell is transparent and the canvas is cleared.
 * - Luminance: Rec. 709 luma of the cell's average colour, 0..1, sampled once per card per grid size.
 * - Glyph: density index = floor(v^0.9 * 10) into " .:-=+*#%@", where v is the luminance (dark theme) or
 *   1 - luminance (light theme, so dark pixels get denser glyphs). Alpha = 0.35 + 0.65 * v.
 * - Cover crop: the sample uses the same object-fit cover crop as the real media, so the characters line up
 *   with the picture at rest (scale 1, no offset).
 */

export const CELL_W = 7; // target cell width in CSS px; the grid is rounded so it fills the frame exactly
export const CELL_H = 12; // target cell height in CSS px
export const RAMP = " .:-=+*#%@";
export const MAX_BACKING_PX = 1400; // canvas backing store cap, in device px along the width
const GAMMA = 0.9;
const SWEEP = 0.28;
const SHIFT_X = 7; // card index stride in the hash, so neighbouring cards do not share a pattern
const HASH_Y = 3;
const RESOLVED = 0.999; // at or above this the canvas is cleared and nothing else is drawn
const GLYPH_RATIO = 0.9; // glyph size as a share of the cell height

export interface Grid {
  cols: number;
  rows: number;
  cellW: number; // CSS px, cols * cellW equals the frame width
  cellH: number; // CSS px, rows * cellH equals the frame height
}

export interface Palette {
  bg: string; // cell background, the --bg token
  fg: string; // glyph colour, the --text token
  font: string; // font-family list, the --font-mono token
  inverted: boolean; // true in the light theme
}

export interface Crop {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

/** Hermite smoothstep from edge0 to edge1. Works with edge0 > edge1 (a falling curve). */
export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Resolve amount for a card at clamped position p (-1..1). 1 at the centre, 0 when far away. */
export function resolveAmount(p: number): number {
  return smoothstep(0.62, 0.1, Math.abs(p));
}

/** Eased progress for the one-time flat-card resolve (power3.out, the site's entrance ease). */
export function easeOut(t: number): number {
  const u = 1 - Math.min(1, Math.max(0, t));
  return 1 - u * u * u;
}

/** Stable pseudo-random value in [0, 1) for a cell. */
export function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Grid for a frame of the given CSS size. Rounds to whole cells, then stretches each cell to fill the frame. */
export function gridFor(width: number, height: number): Grid {
  const cols = Math.max(1, Math.round(width / CELL_W));
  const rows = Math.max(1, Math.round(height / CELL_H));
  return { cols, rows, cellW: width / cols, cellH: height / rows };
}

/** Device pixels per CSS px for the overlay canvas: at most 2x, and the backing store stays within the cap. */
export function backingRatio(cssWidth: number, devicePixelRatio: number): number {
  return Math.min(devicePixelRatio, 2, MAX_BACKING_PX / cssWidth);
}

/** Centred object-fit: cover crop of a source of srcW x srcH into a destination of the given aspect (w / h). */
export function coverCrop(srcW: number, srcH: number, dstAspect: number): Crop {
  if (srcW / srcH > dstAspect) {
    const sw = srcH * dstAspect;
    return { sx: (srcW - sw) / 2, sy: 0, sw, sh: srcH };
  }
  const sh = srcW / dstAspect;
  return { sx: 0, sy: (srcH - sh) / 2, sw: srcW, sh };
}

/**
 * Draws an image into the rectangle (x, y, w, h) with the cover crop. `aspect` is the aspect of the box the
 * picture is fitted to in CSS px (the frame or screen), which can differ from w / h when the rectangle is in
 * grid units. Falls back to `aspect` when the image has no intrinsic size (some SVGs), so the crop is the whole image.
 */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  aspect: number,
): void {
  const srcW = img.naturalWidth || aspect;
  const srcH = img.naturalHeight || 1;
  const crop = coverCrop(srcW, srcH, aspect);
  ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, x, y, w, h);
}

/**
 * Luminance per cell. `paint` draws the source into an offscreen canvas of grid.cols x grid.rows pixels, so one
 * pixel is one cell. Returns null when the canvas cannot be read (for example a tainted canvas).
 */
export function sampleLuminance(
  grid: Grid,
  paint: (ctx: CanvasRenderingContext2D) => void,
): Float32Array | null {
  const off = document.createElement('canvas');
  off.width = grid.cols;
  off.height = grid.rows;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  paint(ctx);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, grid.cols, grid.rows).data;
  } catch {
    return null;
  }
  const count = grid.cols * grid.rows;
  const lum = new Float32Array(count);
  for (let k = 0; k < count; k++) {
    lum[k] = (0.2126 * data[k * 4] + 0.7152 * data[k * 4 + 1] + 0.0722 * data[k * 4 + 2]) / 255;
  }
  return lum;
}

/** Per-cell hash table for one card. Computed once per grid, not per frame. */
export function cellHashes(grid: Grid, cardIndex: number): Float32Array {
  const out = new Float32Array(grid.cols * grid.rows);
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      out[y * grid.cols + x] = hash(x + cardIndex * SHIFT_X, y + HASH_Y);
    }
  }
  return out;
}

/** True when the cell shows the real media at this resolve amount (the cell is left transparent). */
export function showsMedia(res: number, y: number, rows: number, cellHash: number): boolean {
  const sweep = (1 - y / rows) * SWEEP;
  return res * 1.3 - sweep > cellHash;
}

/**
 * Paints one card's overlay for resolve amount `res` (0..1). The canvas is in CSS px (the caller sets the
 * transform for the device ratio). Each visible cell costs one fillRect and at most one fillText. The font is
 * set once per call.
 */
export function paintAscii(
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  lum: Float32Array,
  hashes: Float32Array,
  res: number,
  palette: Palette,
): void {
  const { cols, rows, cellW, cellH } = grid;
  ctx.clearRect(0, 0, cols * cellW, rows * cellH);
  if (res >= RESOLVED) return;

  ctx.font = `500 ${(cellH * GLYPH_RATIO).toFixed(2)}px ${palette.font}`;
  ctx.textBaseline = 'top';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const k = y * cols + x;
      if (showsMedia(res, y, rows, hashes[k])) continue;

      ctx.globalAlpha = 1;
      ctx.fillStyle = palette.bg;
      ctx.fillRect(x * cellW, y * cellH, cellW + 0.5, cellH + 0.5);

      const v = palette.inverted ? 1 - lum[k] : lum[k];
      const index = Math.min(RAMP.length - 1, Math.floor(Math.pow(v, GAMMA) * RAMP.length));
      const glyph = RAMP[index];
      if (glyph === ' ') continue;
      ctx.globalAlpha = 0.35 + 0.65 * v;
      ctx.fillStyle = palette.fg;
      ctx.fillText(glyph, x * cellW, y * cellH + 1);
    }
  }
  ctx.globalAlpha = 1;
}
