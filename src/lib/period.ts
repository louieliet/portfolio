/*
 * Period math for the home Experience block. Pure functions, no DOM, run at build time.
 *
 * Input is ExperienceItem.period: "Mon YYYY - Mon YYYY" or "Mon YYYY - Present".
 * Months are counted inclusively: "Dec 2025 - Jul 2026" covers 8 months. A month is the index year * 12 + month,
 * and a span stores fractional years (index / 12). An ongoing job ends at the end of the build month.
 *
 * Anything that does not parse throws, so a data typo fails the build instead of drawing a wrong bar.
 */

export interface Span {
  start: number; // fractional year: start of the first month
  end: number; // fractional year: end of the last month
  ongoing: boolean;
}

export interface Axis {
  min: number; // fractional year at the left edge of the gantt column
  max: number; // fractional year at the right edge (end of the current year)
  years: number[]; // year starts inside [min, max), for the axis labels
}

export interface Range {
  from: string; // "Dec 2025"
  to: string; // "Jul 2026", or "Present"
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SEPARATOR = /\s+-\s+/;
const MONTH_YEAR = /^([A-Z][a-z]{2}) (\d{4})$/;

function invalid(period: string, reason: string): Error {
  return new Error(`Experience period "${period}": ${reason}. Expected "Mon YYYY - Mon YYYY" or "Mon YYYY - Present".`);
}

function splitPeriod(period: string): [string, string] {
  const parts = period.trim().split(SEPARATOR);
  if (parts.length !== 2) throw invalid(period, 'needs exactly one " - " separator');
  return [parts[0], parts[1]];
}

function isPresent(text: string): boolean {
  return text.trim().toLowerCase() === 'present';
}

/** Month index (year * 12 + month) of "Mon YYYY". Throws on anything else. */
function monthIndex(text: string, period: string): number {
  const match = MONTH_YEAR.exec(text.trim());
  const month = match ? MONTHS.indexOf(match[1]) : -1;
  if (!match || month < 0) throw invalid(period, `"${text.trim()}" is not a "Mon YYYY" month`);
  return Number(match[2]) * 12 + month;
}

/** Parses a period into a span on the fractional-year scale. `now` is the build time. */
export function parsePeriod(period: string, now: Date): Span {
  const [from, to] = splitPeriod(period);
  const start = monthIndex(from, period);
  const current = now.getFullYear() * 12 + now.getMonth();

  if (isPresent(to)) {
    if (start > current) throw invalid(period, 'starts after the build date');
    return { start: start / 12, end: (current + 1) / 12, ongoing: true };
  }

  const end = monthIndex(to, period);
  if (end < start) throw invalid(period, 'ends before it starts');
  return { start: start / 12, end: (end + 1) / 12, ongoing: false };
}

/** The two ends of a period as text, for the When column. Throws on an unparseable period. */
export function formatRange(period: string): Range {
  const [from, to] = splitPeriod(period);
  monthIndex(from, period);
  if (isPresent(to)) return { from: from.trim(), to: 'Present' };
  monthIndex(to, period);
  return { from: from.trim(), to: to.trim() };
}

/** Whole months as "5 mos", "1 yr", "1 yr 7 mos". Spans are whole months, so the rounding is exact. */
export function formatDuration(span: Span): string {
  const months = Math.round((span.end - span.start) * 12);
  if (months < 1) throw new Error(`Experience span is shorter than one month (${span.start} to ${span.end}).`);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ');
}

/**
 * Shared time axis for the spans. min is the earliest start rounded down to the half-year, max is the end of the
 * current year, and years are the year starts that fall inside the axis.
 */
export function axisFor(spans: Span[], now: Date): Axis {
  if (spans.length === 0) throw new Error('axisFor needs at least one span.');
  const earliest = Math.min(...spans.map((span) => span.start));
  const min = Math.floor(earliest * 2) / 2;
  const max = now.getFullYear() + 1;
  const years: number[] = [];
  for (let year = Math.ceil(min); year < max; year++) years.push(year);
  return { min, max, years };
}

/** Position of a fractional year on the axis, in percent (0 at min, 100 at max). */
export function percentOf(value: number, axis: Axis): number {
  return ((value - axis.min) / (axis.max - axis.min)) * 100;
}
