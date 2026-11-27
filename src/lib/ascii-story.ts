/*
 * Story ASCII: the picture for the "How I work" chapter (src/components/Story.astro).
 * Pure functions, no DOM. The server frame and every client frame come from the same code.
 *
 * Three states on one STORY_COLS x STORY_ROWS grid:
 * - noise: a shimmering field of glyphs (noiseChar, moved by t)
 * - wireframe: a page layout with a header bar, a crossed image, text bars and three cards
 * - product: a phone with a status bar, a "Today" title, a "ONE THING" card, a checklist and a tab bar
 *
 * renderStoryFrame blends them. Each cell has a fixed hash k in [0, 1). A state takes over a cell once its
 * blend level, minus a left-to-right sweep (0 at the left edge, SWEEP at the right), passes k, so the change
 * dissolves across the block. Blank cells of the wireframe clear the noise under them.
 *
 * Scroll progress bands (0..1 across the chapter):
 *   noise -> wireframe over WIRE_FROM..WIRE_TO, wireframe -> product over PRODUCT_FROM..PRODUCT_TO.
 */

export const STORY_COLS = 46;
export const STORY_ROWS = 27;

const NOISE_RAMP = " .·:+*"; // index 0 is empty; the same light-to-dense ramp family as wave.ts
const NOISE_SKIP = 0.72; // cells whose hash is below this stay empty in the noise state
const WIRE_FROM = 0.22;
const WIRE_TO = 0.46;
const PRODUCT_FROM = 0.56;
const PRODUCT_TO = 0.8;
const SWEEP = 0.25;
// A blend level of 1 covers every cell: k < 1 and the sweep is at most SWEEP, so 1 * 1.25 - SWEEP > k.
const BLEND_OVERSHOOT = 1.25;

export type StoryStage = "noise" | "wireframe" | "product";

type Grid = string[][];

function blankGrid(): Grid {
  return Array.from({ length: STORY_ROWS }, () => Array<string>(STORY_COLS).fill(" "));
}

function put(grid: Grid, x: number, y: number, ch: string): void {
  if (x < 0 || y < 0 || x >= STORY_COLS || y >= STORY_ROWS) return;
  grid[y][x] = ch;
}

function drawText(grid: Grid, x: number, y: number, s: string): void {
  for (let i = 0; i < s.length; i++) put(grid, x + i, y, s[i]);
}

function drawBox(grid: Grid, x0: number, y0: number, x1: number, y1: number): void {
  for (let x = x0 + 1; x < x1; x++) {
    put(grid, x, y0, "-");
    put(grid, x, y1, "-");
  }
  for (let y = y0 + 1; y < y1; y++) {
    put(grid, x0, y, "|");
    put(grid, x1, y, "|");
  }
  put(grid, x0, y0, "+");
  put(grid, x1, y0, "+");
  put(grid, x0, y1, "+");
  put(grid, x1, y1, "+");
}

/** Straight diagonal between two cells. Down-right strokes are backslashes, up-right strokes are slashes. */
function drawDiagonal(grid: Grid, x0: number, y0: number, x1: number, y1: number): void {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  if (steps === 0) return;
  const glyph = dx * dy > 0 ? "\\" : "/";
  for (let i = 0; i <= steps; i++) {
    put(grid, Math.round(x0 + (dx * i) / steps), Math.round(y0 + (dy * i) / steps), glyph);
  }
}

/** Page layout: header bar, hero image with a cross, three text bars, three cards. */
function buildWireframe(): Grid {
  const g = blankGrid();
  drawBox(g, 1, 0, 44, 2);
  drawText(g, 3, 1, "[ * ]");
  drawText(g, 27, 1, "---  ---  ---");

  drawBox(g, 1, 4, 44, 14);
  drawDiagonal(g, 2, 5, 43, 13);
  drawDiagonal(g, 43, 5, 2, 13);

  drawText(g, 1, 16, "-".repeat(34));
  drawText(g, 1, 18, "-".repeat(24));
  drawText(g, 1, 20, "-".repeat(40));

  drawBox(g, 1, 22, 14, 26);
  drawBox(g, 16, 22, 29, 26);
  drawBox(g, 31, 22, 44, 26);
  drawText(g, 3, 24, "-".repeat(8));
  drawText(g, 18, 24, "-".repeat(8));
  drawText(g, 33, 24, "-".repeat(8));
  return g;
}

/** Phone outline (24 columns wide, centred) with the "Today" screen. */
function buildProduct(): Grid {
  const g = blankGrid();
  const x0 = 11;
  const x1 = 34;
  const y0 = 0;
  const y1 = 26;
  for (let x = x0 + 1; x < x1; x++) {
    put(g, x, y0, "-");
    put(g, x, y1, "-");
  }
  for (let y = y0 + 1; y < y1; y++) {
    put(g, x0, y, "|");
    put(g, x1, y, "|");
  }
  put(g, x0, y0, ".");
  put(g, x1, y0, ".");
  put(g, x0, y1, "'");
  put(g, x1, y1, "'");

  drawText(g, 13, 1, "9:41");
  drawText(g, 29, 1, "[##]");

  drawText(g, 13, 3, "Today");
  drawText(g, 13, 4, "~".repeat(8));

  drawBox(g, 13, 6, 32, 12);
  drawText(g, 15, 7, "ONE THING");
  drawText(g, 15, 8, "Ship the");
  drawText(g, 15, 9, "portfolio");
  drawText(g, 28, 8, "( )");

  drawText(g, 13, 14, "[x] Understand");
  drawText(g, 13, 16, "[x] Design");
  drawText(g, 13, 18, "[x] Build");
  drawText(g, 13, 20, "[ ] Refine");

  for (let x = 12; x <= 33; x++) put(g, x, 22, "_");
  drawText(g, 14, 24, "#");
  drawText(g, 19, 24, "@");
  drawText(g, 24, 24, "*");
  drawText(g, 29, 24, "=");
  drawText(g, 18, 25, "-".repeat(6));
  return g;
}

const WIREFRAME = buildWireframe();
const PRODUCT = buildProduct();

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function smoothstep(from: number, to: number, v: number): number {
  const t = clamp01((v - from) / (to - from));
  return t * t * (3 - 2 * t);
}

/** Stable per-cell value in [0, 1). Same input, same output: the dissolve threshold of each cell. */
function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Glyph for one noise cell at time t. Empty cells are chosen by hash, the rest by three slow sines. */
export function noiseChar(x: number, y: number, t: number): string {
  if (hash(x, y) < NOISE_SKIP) return " ";
  const v = Math.sin(x * 0.31 + t) + Math.sin(y * 0.52 - t * 1.2) + Math.sin((x + y) * 0.17 + t * 0.6);
  const index = Math.min(NOISE_RAMP.length - 1, Math.max(1, Math.floor(((v + 3) / 6) * NOISE_RAMP.length)));
  return NOISE_RAMP[index];
}

/** The chapter's label for a progress value. Used for the caption under the block. */
export function storyStage(progress: number): StoryStage {
  const p = clamp01(progress);
  if (smoothstep(PRODUCT_FROM, PRODUCT_TO, p) > 0.5) return "product";
  if (smoothstep(WIRE_FROM, WIRE_TO, p) > 0.5) return "wireframe";
  return "noise";
}

/** The final product frame, with no animation. Used for the server render, no-JS and mobile. */
export function renderStoryProduct(): string {
  return PRODUCT.map((row) => row.join("")).join("\n");
}

/**
 * One full frame as text: STORY_ROWS lines of STORY_COLS characters, no trailing newline.
 * progress is the chapter progress (0..1), t the noise phase in radians.
 */
export function renderStoryFrame(progress: number, t: number): string {
  const p = clamp01(progress);
  const wire = smoothstep(WIRE_FROM, WIRE_TO, p);
  const product = smoothstep(PRODUCT_FROM, PRODUCT_TO, p);
  const rows: string[] = [];
  for (let y = 0; y < STORY_ROWS; y++) {
    let row = "";
    for (let x = 0; x < STORY_COLS; x++) {
      const k = hash(x + 3, y + 7);
      const sweep = (x / STORY_COLS) * SWEEP;
      let ch = noiseChar(x, y, t);
      if (wire * BLEND_OVERSHOOT - sweep > k) ch = WIREFRAME[y][x];
      if (product * BLEND_OVERSHOOT - sweep > k) ch = PRODUCT[y][x];
      row += ch;
    }
    rows.push(row);
  }
  return rows.join("\n");
}
