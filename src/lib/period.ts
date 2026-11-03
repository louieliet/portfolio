// Experience periods ("Mon YYYY - Mon YYYY" or "Mon YYYY - Present") as month
// indices (year * 12 + monthIndex), plus the timeline layout built from them.
// Pure and deterministic: same input and `now` give the same output.

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MIN_WIDTH = 1.5; // percent; keeps one-month items visible on the ruler

export interface Span {
  start: number;
  end: number;
}

export interface Ruler {
  min: number;
  max: number;
  // Same order as the input periods. left/width in %, lane is 0-based.
  segments: { left: number; width: number; lane: number }[];
  ticks: { year: number; left: number }[];
}

function monthIndex(token: string, whole: string): number {
  const m = /^([a-z]{3}) (\d{4})$/i.exec(token.trim());
  const month = m ? MONTHS.indexOf(m[1].toLowerCase()) : -1;
  if (!m || month < 0) throw new Error(`Unparseable period: "${whole}"`);
  return Number(m[2]) * 12 + month;
}

export function parsePeriod(s: string, now = new Date()): Span {
  const parts = s.split(" - ");
  if (parts.length !== 2) throw new Error(`Unparseable period: "${s}"`);
  const start = monthIndex(parts[0], s);
  const end = /^present$/i.test(parts[1].trim())
    ? now.getFullYear() * 12 + now.getMonth()
    : monthIndex(parts[1], s);
  if (end < start) throw new Error(`Period ends before it starts: "${s}"`);
  return { start, end };
}

export function layoutRuler(periods: string[], now = new Date()): Ruler {
  if (periods.length === 0) throw new Error("layoutRuler: no periods");
  const spans = periods.map((p) => parsePeriod(p, now));
  // Floored to January of the earliest year, so the first year gets a tick at 0%.
  const min = Math.floor(Math.min(...spans.map((s) => s.start)) / 12) * 12;
  const max = Math.max(...spans.map((s) => s.end));
  const total = max - min + 1;
  const pct = (months: number) => (months / total) * 100;

  // Greedy lanes: earliest start first; each span takes the first lane that is
  // already free before it starts, otherwise opens a new lane.
  const order = spans.map((_, i) => i).sort((a, b) => spans[a].start - spans[b].start || a - b);
  const laneEnd: number[] = [];
  const lane = new Array<number>(spans.length);
  for (const i of order) {
    const { start, end } = spans[i];
    const free = laneEnd.findIndex((e) => e < start);
    if (free === -1) {
      laneEnd.push(end);
      lane[i] = laneEnd.length - 1;
    } else {
      laneEnd[free] = end;
      lane[i] = free;
    }
  }

  const segments = spans.map((s, i) => ({
    left: pct(s.start - min),
    width: Math.max(MIN_WIDTH, pct(s.end - s.start + 1)),
    lane: lane[i],
  }));

  // Ticks: every January inside [min, max].
  const ticks: { year: number; left: number }[] = [];
  for (let jan = Math.ceil(min / 12) * 12; jan <= max; jan += 12) {
    ticks.push({ year: jan / 12, left: pct(jan - min) });
  }

  return { min, max, segments, ticks };
}
