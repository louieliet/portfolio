import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { projects, type ProjectSection } from "./data.ts";

const isVideo = (src: string) => src.endsWith(".mp4");
const posterOf = (src: string) => src.replace(/\.mp4$/, ".webp");

const PUBLIC = fileURLToPath(new URL("../../public", import.meta.url));
const SLUG = /^[a-z0-9-]+$/;
// projects is inferred (not annotated), so its section union needs a typed view for media access.
const sectionsOf = (p: { sections?: unknown }) => (p.sections ?? []) as ProjectSection[];

test("project ids are unique", () => {
  const ids = projects.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every project has at least one section", () => {
  for (const p of projects) {
    assert.ok(sectionsOf(p).length >= 1, `${p.id} has no sections`);
  }
});

test("section ids are unique per project and slug-safe", () => {
  for (const p of projects) {
    const ids = sectionsOf(p).map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, `${p.id} repeats a section id`);
    for (const id of ids) assert.match(id, SLUG, `${p.id} section id "${id}" is not slug-safe`);
  }
});

test("every project image and section media image exists under public/", () => {
  for (const p of projects) {
    const paths = [...(p.images ?? []), ...sectionsOf(p).flatMap((s) => s.media?.images ?? [])];
    for (const src of paths) {
      assert.ok(existsSync(`${PUBLIC}${src}`), `${p.id}: missing ${src}`);
    }
  }
});

test("screens media holds 1-4 images, full media holds exactly one", () => {
  for (const p of projects) {
    for (const s of sectionsOf(p)) {
      if (!s.media) continue;
      const n = s.media.images.length;
      if (s.media.kind === "screens") {
        assert.ok(n >= 1 && n <= 4, `${p.id}/${s.id} screens has ${n} images`);
      } else {
        assert.equal(s.media.kind, "full", `${p.id}/${s.id} has unknown media kind`);
        assert.equal(n, 1, `${p.id}/${s.id} full media must hold one image`);
      }
    }
  }
});

test("every .mp4 section clip has a .webp poster beside it", () => {
  for (const p of projects) {
    for (const s of sectionsOf(p)) {
      for (const src of (s.media?.images ?? []).filter(isVideo)) {
        assert.ok(existsSync(`${PUBLIC}${src}`), `${p.id}/${s.id}: missing ${src}`);
        assert.ok(existsSync(`${PUBLIC}${posterOf(src)}`), `${p.id}/${s.id}: missing poster for ${src}`);
      }
    }
  }
});

test("mascot files exist when a project sets one", () => {
  for (const p of projects) {
    const m = (p as { mascot?: { mov: string; webm: string; poster: string } }).mascot;
    if (!m) continue;
    for (const src of [m.mov, m.webm, m.poster]) {
      assert.ok(existsSync(`${PUBLIC}${src}`), `${p.id}: mascot missing ${src}`);
    }
  }
});
