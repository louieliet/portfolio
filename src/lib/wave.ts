/*
 * Wave field: one pure function picks the glyph for every cell of the hero ASCII object.
 * AsciiField renders the t = 0 frame on the server and calls the same function on every client frame,
 * so the first paint and the animation use identical math.
 *
 * Coordinates are cell units: x in [0, COLS), y in [0, ROWS).
 */

export const COLS = 46;
export const ROWS = 18;

// Light to dense. Index 0 is an empty cell.
export const RAMP = " .·:+*#";

export interface Pointer {
  x: number; // cell units
  y: number; // cell units
}

/**
 * Glyph index for one cell at time t, with an optional ripple centred on the pointer.
 * The base texture is three sines over x, y and the diagonal. The base sum spans [-3, 3] and is scaled
 * by `energy` (amplitude; the caller scales time the same way). The ripple adds up to 3 near the pointer,
 * and the final clamp keeps the index in range. energy = 1 reproduces the resting field exactly.
 */
export function glyphIndex(x: number, y: number, t: number, pointer: Pointer | null, energy = 1): number {
  let v = energy * (Math.sin(x * 0.28 + t) + Math.sin(y * 0.5 - t * 1.3) + Math.sin((x + y) * 0.18 + t * 0.7));

  if (pointer) {
    // Y distance is doubled because a monospace cell is about twice as tall as it is wide.
    const d = Math.hypot(x - pointer.x, (y - pointer.y) * 2);
    v += 3 * Math.exp((-d * d) / 30) * Math.cos(d * 0.9 - t * 4);
  }

  const k = Math.floor(((v + 3) / 6) * RAMP.length);
  return Math.min(RAMP.length - 1, Math.max(0, k));
}

/**
 * One full frame as text: ROWS lines of COLS characters, no trailing newline.
 * `reveal` (0..1) is the load draw: rows at or below the progress line are blank, so the field draws top
 * to bottom. reveal = 1 draws every row.
 */
export function renderWaveFrame(t: number, pointer: Pointer | null = null, energy = 1, reveal = 1): string {
  const visibleRows = Math.max(0, Math.min(ROWS, Math.round(reveal * ROWS)));
  const blank = " ".repeat(COLS);
  const rows: string[] = [];
  for (let y = 0; y < ROWS; y++) {
    if (y >= visibleRows) {
      rows.push(blank);
      continue;
    }
    let row = "";
    for (let x = 0; x < COLS; x++) row += RAMP[glyphIndex(x, y, t, pointer, energy)];
    rows.push(row);
  }
  return rows.join("\n");
}
