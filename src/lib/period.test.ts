import { test } from "node:test";
import assert from "node:assert/strict";
import { layoutRuler, parsePeriod } from "./period.ts";

const NOW = new Date(2026, 9, 15); // Oct 2026

test("parses a closed range into inclusive month indices", () => {
  assert.deepEqual(parsePeriod("Apr 2025 - Aug 2025", NOW), { start: 2025 * 12 + 3, end: 2025 * 12 + 7 });
});

test("Present resolves to the month of `now`, case-insensitive", () => {
  assert.equal(parsePeriod("Dec 2025 - Present", NOW).end, 2026 * 12 + 9);
  assert.equal(parsePeriod("Dec 2025 - PRESENT", NOW).end, 2026 * 12 + 9);
});

test("unparseable or reversed periods throw", () => {
  assert.throws(() => parsePeriod("Sometime 2025", NOW), /Unparseable/);
  assert.throws(() => parsePeriod("Apr 2025 Aug 2025", NOW), /Unparseable/);
  assert.throws(() => parsePeriod("Apr 2025 - Feb 2025", NOW), /ends before/);
});

test("overlapping periods go to different lanes", () => {
  const ruler = layoutRuler(["Apr 2025 - Aug 2025", "Mar 2025 - Aug 2025"], NOW);
  assert.notEqual(ruler.segments[0].lane, ruler.segments[1].lane);
});

test("a span that starts after a lane frees up reuses that lane", () => {
  const ruler = layoutRuler(["Jan 2025 - Mar 2025", "Apr 2025 - Jun 2025"], NOW);
  assert.equal(ruler.segments[0].lane, 0);
  assert.equal(ruler.segments[1].lane, 0);
});

test("ticks are each January inside the range, starting at the earliest year", () => {
  // Earliest start is Aug 2023, but the ruler floors to Jan 2023.
  const ruler = layoutRuler(["Aug 2023 - Aug 2023", "Jan 2024 - Present"], NOW);
  assert.deepEqual(ruler.ticks.map((t) => t.year), [2023, 2024, 2025, 2026]);
  assert.deepEqual(ruler.ticks[0], { year: 2023, left: 0 });
  const total = (2026 * 12 + 9) - (2023 * 12) + 1;
  assert.equal(ruler.ticks[1].left, ((2024 * 12 - 2023 * 12) / total) * 100);
});

test("one-month items get the minimum width", () => {
  // 78 months in range, so a single month is 1.28%, below the 1.5% floor.
  const ruler = layoutRuler(["Jan 2020 - Dec 2020", "Jun 2026 - Jun 2026"], NOW);
  assert.equal(ruler.segments[1].width, 1.5);
  assert.equal(ruler.segments[0].width, (12 / 78) * 100);
});
