#!/usr/bin/env node
// Gate test: the CODE BEAUTY scene and its three scroll handoffs are frozen.
// Fails (exit 1) if any protected region changed since the lock was written.
// Regenerate the lock only with explicit approval: `node scripts/check-code-beauty.mjs --update`
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lockPath = resolve(root, "scripts/code-beauty.lock.json");

const read = (p) => readFileSync(resolve(root, p), "utf8");

// Slice from the first line containing `start` through the first line
// containing `end` after it (inclusive). Throws if either anchor is missing.
function slice(text, start, end, label) {
  const lines = text.split("\n");
  const a = lines.findIndex((l) => l.includes(start));
  if (a === -1) throw new Error(`${label}: start anchor not found: ${start}`);
  const b = lines.findIndex((l, i) => i > a && l.includes(end));
  if (b === -1) throw new Error(`${label}: end anchor not found: ${end}`);
  return lines.slice(a, b + 1).join("\n");
}

const regions = {
  "reveal-scene.astro (whole file)": () => read("src/components/reveal-scene.astro"),
  "globals.css: .scrollytelling-scene .. .bg-image-liquid": () =>
    slice(read("src/styles/globals.css"), ".scrollytelling-scene {", "filter: grayscale(100%) contrast(1.2) url(#liquid-filter);", "globals.css"),
  "hero.astro: parallax-out handoff": () =>
    slice(read("src/components/hero.astro"), "Parallax out on scroll", 'trigger: ".scrollytelling-scene"', "hero.astro"),
  "index.astro: theme scrub handoff": () =>
    slice(read("src/pages/index.astro"), "function initThemeToggle()", "hero-background-paused", "index.astro"),
};

const hash = (s) => createHash("sha256").update(s.replace(/\r\n/g, "\n")).digest("hex");
const current = Object.fromEntries(Object.entries(regions).map(([k, fn]) => [k, hash(fn())]));

if (process.argv.includes("--update")) {
  writeFileSync(lockPath, JSON.stringify(current, null, 2) + "\n");
  console.log("code-beauty.lock.json updated");
  process.exit(0);
}

const locked = JSON.parse(readFileSync(lockPath, "utf8"));
const broken = Object.keys(locked).filter((k) => locked[k] !== current[k]);
if (broken.length) {
  console.error("CODE BEAUTY protected region changed:\n  - " + broken.join("\n  - "));
  process.exit(1);
}
console.log(`code-beauty: ${Object.keys(locked).length} protected regions intact`);
