// Visual + runtime verification over CDP: serves ./dist, drives headless Chrome,
// scrolls through the page, captures screenshots, collects console errors and
// DOM diagnostics. Usage: node cdp-shots.mjs <distDir> <outDir>
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";

const [, , distDir, outDir] = process.argv;
mkdirSync(outDir, { recursive: true });
const PORT = Number(process.env.VERIFY_PORT) || 4321;

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".json": "application/json" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const data = await readFile(join(distDir, p));
    res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
    res.end(data);
  } catch {
    try {
      const data = await readFile(join(distDir, p, "index.html"));
      res.writeHead(200, { "content-type": "text/html" }); res.end(data);
    } catch { res.writeHead(404); res.end(); }
  }
});
await new Promise((r) => server.listen(PORT, r));

const CDP_PORT = 9333;
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${CDP_PORT}`, "--window-size=1440,900", "--hide-scrollbars",
  "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--no-first-run",
  "--user-data-dir=/tmp/chrome-cdp-profile", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets = [];
for (let i = 0; i < 40 && !targets.length; i++) {
  await sleep(250);
  try { targets = (await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json()).filter((t) => t.type === "page"); } catch {}
}
if (!targets.length) { console.error("no chrome target"); process.exit(1); }

const ws = new WebSocket(targets[0].webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map(); const errors = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  if (msg.method === "Runtime.exceptionThrown") errors.push("EXCEPTION: " + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
  if (msg.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(msg.params.type)) {
    const frames = (msg.params.stackTrace?.callFrames || []).slice(0, 4).map((f) => `${f.url.split("/").pop()}:${f.lineNumber}:${f.columnNumber}`).join(" < ");
    errors.push(msg.params.type.toUpperCase() + ": " + msg.params.args.map((a) => a.value ?? a.description).join(" ") + (frames ? ` [${frames}]` : ""));
  }
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;

await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setEmulatedMedia", { features: [{ name: "hover", value: "hover" }, { name: "pointer", value: "fine" }] });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/` });
await sleep(1300);
{
  const { result } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(outDir, "00-preloader.png"), Buffer.from(result.data, "base64"));
}
await sleep(5000); // preloader + hero entrance

const shot = async (name) => {
  const { result } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(outDir, `${name}.png`), Buffer.from(result.data, "base64"));
};

const diag = {};
diag.afterLoad = await evaluate(`({
  preloaderGone: !document.getElementById("preloader"),
  isLoading: document.documentElement.classList.contains("is-loading"),
  heroTitleTransform: getComputedStyle(document.querySelector(".hero-section .hero-anim-top > h1")).transform,
  heroTitleOpacity: getComputedStyle(document.querySelector(".hero-section .hero-anim-top > h1")).opacity,
  bodyClasses: document.body.className,
  pinSpacers: document.querySelectorAll(".pin-spacer").length,
  cases: document.querySelectorAll(".case").length,
  splitLines: document.querySelectorAll(".lumena-viewer-paragraph .line, .about-lead .line").length,
  splitMasks: document.querySelectorAll(".line-mask").length,
  paraHTML: document.querySelector(".lumena-viewer-paragraph")?.innerHTML.slice(0, 160),
  accent: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),
  scrollHeight: document.documentElement.scrollHeight,
})`);
await shot("01-hero");

const H = diag.afterLoad.scrollHeight;
const stops = [
  ["02-codebeauty-mid", 900 + 1.1 * 900],
  ["03-codebeauty-end", 900 + 3.1 * 900],
  ["04-cases", async (el) => (await el("#projects")) - 100],
  ["04b-cases-mid", async (el) => (await el("#projects")) + 1400],
  ["05-experience", async (el) => (await el("#experience")) - 100],
  ["07-about", async (el) => (await el("#about")) - 100],
  ["08-about-mid", async (el) => (await el("#about")) + 500],
  ["09-contact", H - 900],
];
const top = async (sel) => await evaluate(`document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect().top + window.scrollY`);
for (const [name, y] of stops) {
  const target = typeof y === "function" ? await y(top) : y;
  await evaluate(`window.scrollTo(0, ${Math.round(target)})`);
  await sleep(1800);
  diag[name] = await evaluate(`({ scrollY: Math.round(window.scrollY), bg: getComputedStyle(document.body).getPropertyValue("--bg").trim(), activeCase: document.querySelector(".cases-index li.is-active button")?.textContent })`);
  await shot(name);
}

// ── Experience: scroll-driven focus. The item crossing the viewport centre is active, the sticky panel mirrors it ──
const scrollToItem = (i) => evaluate(`(() => {
  const r = document.querySelectorAll(".xp-item")[${i}].getBoundingClientRect();
  window.scrollTo(0, r.top + scrollY + r.height / 2 - innerHeight / 2);
})()`);
const xpState = () => evaluate(`(() => {
  const items = [...document.querySelectorAll(".xp-item")];
  const active = items.filter((el) => el.classList.contains("is-active"));
  const flag = active[0]?.querySelector(".xp-flag");
  const img = document.querySelector(".xp-media-img.is-top");
  return {
    activeCount: active.length,
    activeIndex: items.indexOf(active[0]),
    dataActive: Number(document.querySelector(".xp-root").dataset.active),
    counter: document.querySelector(".xp-num").textContent,
    flagOpacity: flag ? Number(getComputedStyle(flag).opacity) : null,
    mediaOpacity: img ? Number(getComputedStyle(img).opacity) : null,
    mediaSrc: img?.getAttribute("src") ?? null,
    lastTop: Math.round(items[items.length - 1].getBoundingClientRect().top + scrollY),
    overflowX: document.documentElement.scrollWidth - innerWidth,
  };
})()`);
diag.experience = {};
await scrollToItem(0); await sleep(1200);
diag.experience.feeble = await xpState();
await shot("13a-xp-feeble");
await scrollToItem(2); await sleep(1200);
diag.experience.vyvo = await xpState();
await shot("13-xp-vyvo");
await scrollToItem(4); await sleep(1200);
diag.experience.luyoa = await xpState();
await shot("14-xp-luyoa");
diag.experience.stableDelta = diag.experience.luyoa.lastTop - diag.experience.vyvo.lastTop;
// Last role: active while the sticky panel is still pinned. Scroll to 2px before the unpin point (grid bottom minus panel height and sticky top).
const unpinY = await evaluate(`(() => { const g = document.querySelector(".xp-grid"), p = document.querySelector(".xp-panel"); return Math.round(g.getBoundingClientRect().bottom + scrollY - p.offsetHeight - parseFloat(getComputedStyle(p).top)); })()`);
await evaluate(`window.scrollTo(0, ${unpinY - 2})`); await sleep(1200);
diag.experience.beforeUnpin = { ...(await xpState()), panelTop: await evaluate("document.querySelector('.xp-panel').getBoundingClientRect().top"), stickyTop: await evaluate("parseFloat(getComputedStyle(document.querySelector('.xp-panel')).top)") };
await shot("15-xp-before-unpin");
// Jump back from the end to the top in one step: no item edge is crossed, so only the scroll-update trigger resets the focus.
await evaluate("window.scrollTo(0, 0)"); await sleep(1200);
diag.experience.jumpBack = await xpState();

// ── Page curtain: while it leaves, the dither cuts no image holes (the curtain covers the images) ──
await evaluate(`window.scrollTo(0, document.querySelector("#projects").getBoundingClientRect().top + scrollY - 100)`); await sleep(1500);
diag.curtain = { rectsBefore: await evaluate("window.__ditherStats?.rects") };
await evaluate("document.documentElement.classList.add('is-leaving')"); await sleep(800);
diag.curtain.rectsLeaving = await evaluate("window.__ditherStats?.rects");
await evaluate("document.documentElement.classList.remove('is-leaving')");

await sleep(1500);
// ── Cursor ink: a fast horizontal stroke must leave an elongated comet (shape follows velocity),
//    then settle into a quiet cloud, then fade out once the pointer leaves ──
await evaluate("window.scrollTo(0, 0)"); await sleep(1200);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 300, y: 500 });
await sleep(400);
for (let i = 1; i <= 8; i++) {
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 300 + i * 75, y: 500 });
  await sleep(16);
}
await sleep(120);
const S = (x, y) => evaluate(`window.__ditherSample ? window.__ditherSample(${x}, ${y}) : null`);
diag.ink = { along: await S(820, 500), perp: await S(900, 585), moving: await S(870, 500) };
await shot("11-ink");
await sleep(1400);
diag.ink.resting = await S(900, 500);
await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 1380, y: 860 });
await sleep(2600);
diag.ink.afterDecay = await S(900, 500);

// ── Image mask, CODE BEAUTY: the photo is clipped by the animated .image-mask, so its visible area
//    is the clip inset, not the box. Checked at the first stop where the photo is on screen (scroll
//    1890). The clip is usually still partly closed there, which exercises the inset parser. The
//    visible box is read from the mask's rect and clip-path at that moment ──
const insetBox = (r, clip) => {
  if (clip === "none") return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  const m = /^inset\((.*)\)$/.exec(clip);
  if (!m) return null;
  const [t, rt = t, b = t, l = rt] = m[1].trim().split(/\s+/);
  const px = (s, base) => (s.endsWith("%") ? (parseFloat(s) / 100) * base : parseFloat(s));
  return { left: r.left + px(l, r.width), top: r.top + px(t, r.height), right: r.right - px(rt, r.width), bottom: r.bottom - px(b, r.height) };
};
await evaluate(`window.scrollTo(0, ${Math.round(900 + 1.1 * 900)})`);
await sleep(1800);
const cbMask = await evaluate(`(() => { const m = document.querySelector(".image-mask"); if (!m) return null; const r = m.getBoundingClientRect(); return { rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height }, clip: getComputedStyle(m).clipPath }; })()`);
const hasDither = cbMask ? await evaluate("typeof window.__ditherScreen === 'function'") : false;
const vis = cbMask ? insetBox(cbMask.rect, cbMask.clip) : null;
if (!cbMask || !hasDither) {
  diag.maskCB = null;
} else if (!vis) {
  diag.maskCB = { rect: cbMask.rect, clip: cbMask.clip, error: "clip-path is not an inset() box" };
} else {
  const cx = (vis.left + vis.right) / 2;
  // Centre probe: the first y inside the visible box where elementFromPoint lands on the photo
  // (CODE / BEAUTY text can sit on top of the centre). Falls back to null, which fails the assertions.
  const probe = await evaluate(`(() => {
    const x = ${cx}, top = ${vis.top}, bottom = ${vis.bottom};
    for (const f of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
      const y = top + (bottom - top) * f;
      const el = document.elementFromPoint(x, y);
      if (el && el.closest(".image-mask")) return { y, hit: "image-mask:" + el.tagName };
    }
    return null;
  })()`);
  const cy = probe ? probe.y : (vis.top + vis.bottom) / 2;
  const x0 = Math.round(vis.left - 200);
  // Background probe: at least 24px outside the visible box, on screen, inside the ink stroke (which runs along cy).
  // Left of the box, or above it when the left point would be within 8px of the viewport edge.
  const bgLeft = vis.left - 60 > 8;
  const bgX = bgLeft ? vis.left - 60 : cx;
  const bgY = bgLeft ? cy : vis.top - 40;
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: x0, y: Math.round(cy) });
  await sleep(400);
  for (let i = 1; i <= 8; i++) {
    await send("Input.dispatchMouseEvent", { type: "mouseMoved", x: Math.round(x0 + ((cx - x0) * i) / 8), y: Math.round(cy) });
    await sleep(16);
  }
  await sleep(120);
  diag.maskCB = {
    rect: cbMask.rect,
    clip: cbMask.clip,
    visible: vis,
    centre: { x: cx, y: cy },
    bgProbe: { x: bgX, y: bgY, side: bgLeft ? "left" : "above" },
    hitAtCentre: probe ? probe.hit : null,
    inkOnImg: await S(cx, cy),
    screenOnImg: await evaluate(`window.__ditherScreen(${cx}, ${cy})`),
    screenOnBg: await evaluate(`window.__ditherScreen(${bgX}, ${bgY})`),
    rects: await evaluate("window.__ditherStats?.rects"),
  };
  await shot("12-codebeauty-mask");
}

diag.perf = await evaluate(`({ ditherAvgMs: window.__ditherStats?.avgMs, ditherFrames: window.__ditherStats?.frames, floatersReady: !!window.__floatersReady, noDither: document.body.classList.contains("no-dither") })`);

// ── View Transitions: a case link click must not move the curtain where the native morph runs ──
diag.vt = { supported: await evaluate(`"onpageswap" in window`) };
await evaluate("window.scrollTo(0, 0)"); await sleep(800);
diag.vt.before = await evaluate(`getComputedStyle(document.querySelector(".page-curtain")).transform`);
await evaluate(`document.querySelector('a.case[href="/projects/neura-path"]').click()`);
await sleep(300);
diag.vt.after = await evaluate(`getComputedStyle(document.querySelector(".page-curtain")).transform`);

// ── Reload path: preloader skipped (sessionStorage flag) — hero must still play ──
await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/` });
await sleep(3500);
diag.reload = await evaluate(`({
  preloaderGone: !document.getElementById("preloader"),
  heroTitleY: new DOMMatrix(getComputedStyle(document.querySelector(".hero-section .hero-anim-top > h1")).transform).m42,
  heroTitleOpacity: Number(getComputedStyle(document.querySelector(".hero-section .hero-anim-top > h1")).opacity),
  pinSpacers: [...document.querySelectorAll(".pin-spacer")].map((el) => { const r = el.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), bottom: Math.round(r.bottom + scrollY) }; }),
})`);
await shot("10-reload-hero");

// Arrival is done when every animation under .pj-page has finished. Headless software GL can delay the first frame by seconds, so a fixed sleep is not enough.
const waitArrival = async () => {
  for (let i = 0; i < 100; i++) {
    const done = await evaluate(`(() => { const a = document.querySelector(".pj-page")?.getAnimations({ subtree: true }) ?? []; return a.length > 0 && a.every((x) => x.playState === "finished"); })()`);
    if (done) return true;
    await sleep(100);
  }
  return false;
};
// ── Case page: /projects/neura-path/ (home view-transition name, TOC, scrollspy, TOC jump, next case, mobile overflow) ──
diag.casePage = {};
diag.casePage.homeVT = await evaluate(`getComputedStyle(document.querySelector('a.case[href="/projects/neura-path"] .case-media')).viewTransitionName`);
await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/projects/neura-path/` });
const arrivedDesktop = await waitArrival(); // arrival choreography finished
const C = diag.casePage;
C.arrived = arrivedDesktop;
C.toc = await evaluate(`document.querySelectorAll(".pj-toc a").length`);
C.sections = await evaluate(`document.querySelectorAll(".pj-section").length`);
C.heroVT = await evaluate(`getComputedStyle(document.querySelector(".pj-hero")).viewTransitionName`);
C.nextHref = await evaluate(`document.querySelector(".pj-next")?.getAttribute("href") ?? null`);
C.titleMask = await evaluate(`getComputedStyle(document.querySelector(".pj-title")).maskImage`);
// Scrollspy: 3rd section at ~30% of the viewport, so it is the last section past the 40% line.
await evaluate(`(() => { const el = document.querySelectorAll(".pj-section")[2]; window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * 0.3); })()`);
await sleep(900);
C.spy3 = await evaluate(`[...document.querySelectorAll(".pj-toc a")].map((a) => a.getAttribute("aria-current"))`);
// TOC click goes through Lenis scrollTo with the header offset: the 5th section should land ~128px from the top.
await evaluate(`document.querySelectorAll(".pj-toc a")[4].click()`);
await sleep(2200);
C.tocJumpTop = await evaluate(`Math.round(document.querySelectorAll(".pj-section")[4].getBoundingClientRect().top)`);
C.tocJumpActive = await evaluate(`document.querySelectorAll(".pj-toc a")[4].getAttribute("aria-current")`);
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/projects/neura-path/` });
const arrivedMobile = await waitArrival();
C.arrivedMobile = arrivedMobile;
C.mobileScrollWidth = await evaluate("document.documentElement.scrollWidth");
C.mobileRailDisplay = await evaluate(`getComputedStyle(document.querySelector(".pj-rail")).display`);

// ── Case back link: from the home page, history.back() restores the home (bfcache keeps the marker, no reload).
//    Direct entry has no home referrer, so the same link navigates normally ──
const visibleBack = `[...document.querySelectorAll(".pj-back")].find((el) => el.getClientRects().length > 0)`;
const waitFor = async (expr) => {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expr)) return true;
    await sleep(100);
  }
  return false;
};
diag.backLink = {};
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/` });
await waitFor(`document.readyState === "complete" && !!document.querySelector('a.case[href="/projects/neura-path"]')`);
await sleep(3500); // preloader and hero entrance
await evaluate(`window.scrollTo(0, document.querySelector("#projects").getBoundingClientRect().top + scrollY - 100)`);
await sleep(1500);
diag.backLink.scrollBefore = await evaluate("Math.round(window.scrollY)");
await evaluate("window.__homeMarker = 1");
await evaluate(`document.querySelector('a.case[href="/projects/neura-path"]').click()`);
diag.backLink.toCase = await waitFor(`location.pathname.replace(/\\/$/, "") === "/projects/neura-path"`);
await waitArrival();
diag.backLink.referrerFromHome = await evaluate("document.referrer");
await evaluate(`${visibleBack}.click()`);
diag.backLink.backed = await waitFor(`location.pathname === "/" && document.readyState === "complete"`);
await sleep(1500);
diag.backLink.home = await evaluate(`({
  pathname: location.pathname,
  navType: performance.getEntriesByType("navigation")[0]?.type,
  marker: window.__homeMarker ?? null,
  scrollY: Math.round(scrollY),
})`);
await send("Page.navigate", { url: "about:blank" });
await sleep(300);
await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/projects/neura-path/` });
await waitFor(`document.readyState === "complete" && location.pathname === "/projects/neura-path/"`);
await waitArrival();
diag.backLink.directReferrer = await evaluate("document.referrer");
await evaluate(`${visibleBack}.click()`);
diag.backLink.directBacked = await waitFor(`location.pathname === "/" && document.readyState === "complete"`);
await sleep(1500);
diag.backLink.direct = await evaluate(`({
  pathname: location.pathname,
  navType: performance.getEntriesByType("navigation")[0]?.type,
  marker: window.__homeMarker ?? null,
})`);

// ── Luma case: 9 section clips (reminders also has a still), clips play only on screen, the dither cuts holes around
//    visible clips (not the mascot), and the mascot never overlaps the H1 or the facts ──
diag.luma = {};
{
  const L = diag.luma;
  const mascot = `(() => { const v = document.querySelector(".pj-mascot video"); const r = (el) => el.getBoundingClientRect(); const m = r(v), t = r(document.querySelector(".pj-title")), f = r(document.querySelector(".pj-facts")); const apart = (a, b) => a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top; return { ariaHidden: v.getAttribute("aria-hidden"), width: Math.round(m.width), overlapsH1: !apart(m, t), overlapsFacts: !apart(m, f) }; })()`;
  const playing = `(() => { const v = document.querySelector("#reminders video"); return { paused: v.paused, t: v.currentTime, src: v.getAttribute("src") }; })()`;
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/projects/luma/` });
  L.arrived = await waitArrival();
  await sleep(800);
  L.sectionVideos = await evaluate(`document.querySelectorAll(".pj-screens video").length`);
  L.reminders = await evaluate(`(() => { const s = document.getElementById("reminders"); return { videos: s.querySelectorAll("video").length, stills: s.querySelectorAll(".pj-screen img:not(.pj-bezel)").length }; })()`);
  L.mascotTop = { ...(await evaluate(mascot)), playing: !(await evaluate(`document.querySelector(".pj-mascot video").paused`)) };
  L.teamPausedAtTop = await evaluate(`document.querySelector("#team video").paused`);
  await evaluate(`(() => { const el = document.getElementById("reminders"); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 120); })()`);
  await sleep(1500);
  L.remindersA = await evaluate(playing);
  await sleep(800);
  L.remindersB = await evaluate(playing);
  L.teamPaused = await evaluate(`document.querySelector("#team video").paused`);
  L.visibleClips = await evaluate(`[...document.querySelectorAll(".pj-page video[data-clip]:not([data-no-mask])")].filter((v) => { const r = v.getBoundingClientRect(); return r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight && v.checkVisibility({ opacityProperty: true, visibilityProperty: true }); }).length`);
  L.ditherRects = await evaluate("window.__ditherStats?.rects");
  await shot("31-luma-reminders-1440");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/projects/luma/` });
  L.arrivedMobile = await waitArrival();
  await sleep(800);
  L.mascot390 = await evaluate(mascot);
  L.mobileScrollWidth = await evaluate("document.documentElement.scrollWidth");
  // Screens: each phone is at most 300px at 1440 and nothing leaves the viewport at 390 (luma, then neura-path).
  const screens = `(() => { const frames = [...document.querySelectorAll(".pj-screens .pj-screen")]; const boxes = [...frames, ...document.querySelectorAll(".pj-screens .pj-screen-img")].map((el) => el.getBoundingClientRect()); return { count: frames.length, maxWidth: Math.round(Math.max(0, ...boxes.map((b) => b.width))), maxRight: Math.round(Math.max(0, ...boxes.map((b) => b.right))), minLeft: Math.round(Math.min(0, ...boxes.map((b) => b.left))), onlyWidth: Math.round(frames[0]?.getBoundingClientRect().width ?? 0) }; })()`;
  await sleep(1500);
  L.screens390 = await evaluate(screens);
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/projects/luma/` });
  await waitArrival();
  await sleep(1500);
  L.screens1440 = await evaluate(screens);
  const N = (diag.neura = {});
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/projects/neura-path/` });
  await waitArrival();
  await sleep(1500);
  N.screens1440 = await evaluate(screens);
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Page.navigate", { url: `http://127.0.0.1:${PORT}/projects/neura-path/` });
  await waitArrival();
  await sleep(1500);
  N.screens390 = await evaluate(screens);
  N.mobileScrollWidth = await evaluate("document.documentElement.scrollWidth");
}
diag.consoleErrors = errors;
writeFileSync(join(outDir, "diag.json"), JSON.stringify(diag, null, 2));
console.log(JSON.stringify(diag, null, 2));
ws.close(); chrome.kill(); server.close();

// ── Assertions: the two regressions Emiliano hit, plus runtime errors ──
const failures = [];
const r = diag.reload;
if (!r.preloaderGone) failures.push("reload: preloader still mounted");
if (Math.abs(r.heroTitleY) > 1) failures.push(`reload: hero title still offset (translateY ${r.heroTitleY}px)`);
if (r.heroTitleOpacity < 0.9) failures.push(`reload: hero title opacity ${r.heroTitleOpacity}`);
if (r.pinSpacers.length < 1) failures.push(`expected the CODE BEAUTY pin spacer, got ${r.pinSpacers.length}`);
for (let i = 1; i < r.pinSpacers.length; i++) {
  if (r.pinSpacers[i].top < r.pinSpacers[i - 1].bottom - 2) failures.push(`pin ${i} starts (${r.pinSpacers[i].top}) before pin ${i - 1} ends (${r.pinSpacers[i - 1].bottom})`);
}
if (diag.perf.ditherFrames > 0 && diag.perf.ditherAvgMs > 4) failures.push(`dither too expensive: ${diag.perf.ditherAvgMs.toFixed(2)} ms/frame`);
if (!diag.perf.floatersReady && !diag.perf.noDither) failures.push("floaters never initialised (three.js lazy import failed?)");
if (diag.ink.along !== null) {
  if (diag.ink.moving < 0.3) failures.push(`ink did not respond to the stroke (${diag.ink.moving})`);
  if (!(diag.ink.along > diag.ink.perp)) failures.push(`cloud is not elongated along the stroke (along ${diag.ink.along}, perp ${diag.ink.perp})`);
  if (diag.ink.resting > 0.45 || diag.ink.resting < 0.12) failures.push(`resting ink out of range (${diag.ink.resting})`);
  if (diag.ink.afterDecay > 0.03) failures.push(`ink did not decay (${diag.ink.afterDecay})`);
}
// Regression: the CODE BEAUTY photo is clipped by an animated mask, so its rect must follow the clip inset.
if (diag.maskCB) {
  const c = diag.maskCB;
  if (c.error) failures.push(`codebeauty mask: ${c.error} (${c.clip})`);
  else if (!c.hitAtCentre) failures.push(`codebeauty mask: no point inside the visible box hits the photo (clip ${c.clip})`);
  else {
    if (!(c.inkOnImg > 0.2)) failures.push(`codebeauty mask: no ink on the photo (${c.inkOnImg})`);
    if (c.screenOnImg !== 0) failures.push(`codebeauty mask: screen pass leaks onto the photo (${c.screenOnImg}, hit ${c.hitAtCentre})`);
    if (!(c.screenOnBg > 0)) failures.push(`codebeauty mask: background not inked (${c.screenOnBg})`);
    if (!(c.rects >= 1)) failures.push(`codebeauty mask: no image rects uploaded (${c.rects})`);
  }
} else if (!diag.perf.noDither) failures.push("codebeauty mask: .image-mask missing or dither test hook absent");
// Experience: exactly one active item, tracking the centre; the panel and the Lead flag follow; positions stable.
{
  const f = diag.experience.feeble, v = diag.experience.vyvo, l = diag.experience.luyoa;
  if (f.activeCount !== 1) failures.push(`experience: expected 1 active item at Feeble, got ${f.activeCount}`);
  if (f.activeIndex !== 0 || f.dataActive !== 0) failures.push(`experience: Feeble step active index ${f.activeIndex} (data-active ${f.dataActive}), expected 0`);
  if (f.counter !== "01") failures.push(`experience: counter "${f.counter}" at Feeble, expected "01"`);
  if (f.flagOpacity !== null) failures.push(`experience: Lead flag present on Feeble (${f.flagOpacity})`);
  if (f.mediaSrc !== null) failures.push(`experience: Feeble has no assets but media src is ${f.mediaSrc}`);
  if (v.activeCount !== 1) failures.push(`experience: expected 1 active item at Vyvo, got ${v.activeCount}`);
  if (v.activeIndex !== 2 || v.dataActive !== 2) failures.push(`experience: Vyvo step active index ${v.activeIndex} (data-active ${v.dataActive}), expected 2`);
  if (v.counter !== "03") failures.push(`experience: counter "${v.counter}", expected "03"`);
  if (!(v.flagOpacity > 0.9)) failures.push(`experience: Lead flag not visible on Vyvo (${v.flagOpacity})`);
  if (!(v.mediaOpacity > 0.9) || !v.mediaSrc?.includes("vyvo")) failures.push(`experience: Vyvo media not visible (opacity ${v.mediaOpacity}, src ${v.mediaSrc})`);
  if (l.activeCount !== 1) failures.push(`experience: expected 1 active item at Luyoa, got ${l.activeCount}`);
  if (l.activeIndex !== 4 || l.dataActive !== 4) failures.push(`experience: Luyoa step active index ${l.activeIndex} (data-active ${l.dataActive}), expected 4`);
  if (l.counter !== "05") failures.push(`experience: counter "${l.counter}", expected "05"`);
  if (l.flagOpacity !== null && l.flagOpacity > 0.1) failures.push(`experience: Lead flag still visible on Luyoa (${l.flagOpacity})`);
  if (!l.mediaSrc?.includes("luyoa")) failures.push(`experience: Luyoa media not shown (src ${l.mediaSrc})`);
  if (Math.abs(diag.experience.stableDelta) > 1) failures.push(`experience: list moves when focus changes (last item ${diag.experience.stableDelta}px)`);
  if (v.overflowX > 0 || l.overflowX > 0) failures.push(`experience: horizontal overflow (${Math.max(v.overflowX, l.overflowX)}px)`);
  const b = diag.experience.beforeUnpin, j = diag.experience.jumpBack;
  if (b.activeCount !== 1 || b.activeIndex !== 4 || b.dataActive !== 4) failures.push(`experience: last role not active before unpin (index ${b.activeIndex}, data-active ${b.dataActive}, expected 4)`);
  if (b.counter !== "05") failures.push(`experience: counter "${b.counter}" before unpin, expected "05"`);
  if (Math.abs(b.panelTop - b.stickyTop) > 0.5) failures.push(`experience: panel already unpinned before the last role (top ${b.panelTop}, pinned top ${b.stickyTop})`);
  if (j.activeCount !== 1 || j.activeIndex !== 0 || j.dataActive !== 0) failures.push(`experience: jump from end to top left index ${j.activeIndex} (data-active ${j.dataActive}), expected 0`);
}
// Case page: TOC count, scrollspy, TOC jump, view-transition names, settled title, mobile overflow.
{
  const c = diag.casePage;
  if (!c.arrived || !c.arrivedMobile) failures.push("case page: arrival animations never finished");
  if (c.toc !== 5) failures.push(`case page: TOC has ${c.toc} links, expected 5`);
  if (c.toc !== c.sections) failures.push(`case page: TOC (${c.toc}) does not match sections (${c.sections})`);
  if (c.spy3?.[2] !== "true" || c.spy3.some((v, i) => i !== 2 && v)) failures.push(`case page: scrollspy at 3rd section gave ${JSON.stringify(c.spy3)}`);
  if (Math.abs(c.tocJumpTop - 128) > 24 || c.tocJumpActive !== "true") failures.push(`case page: TOC jump landed ${c.tocJumpTop}px from top (active ${c.tocJumpActive}), expected ~128`);
  if (c.nextHref !== "/projects/wellty") failures.push(`case page: next case href is ${c.nextHref}, expected /projects/wellty`);
  if (c.heroVT !== "case-neura-path") failures.push(`case page: hero view-transition-name is ${c.heroVT}`);
  if (c.homeVT !== "case-neura-path") failures.push(`home: neura-path card view-transition-name is ${c.homeVT}`);
  if (c.titleMask !== "none") failures.push(`case page: title still masked after arrival (${c.titleMask})`);
  if (c.mobileScrollWidth > 390) failures.push(`case page: horizontal overflow at 390px (scrollWidth ${c.mobileScrollWidth})`);
  if (c.mobileRailDisplay !== "none") failures.push(`case page: rail visible on mobile (${c.mobileRailDisplay})`);
}
// Case back link: from home, back restores the same home document (marker survives, so no reload). Chrome keeps the
// original entry type on bfcache restores (reports "navigate"), so navType is reported, not asserted. Direct entry is a plain navigation.
{
  const b = diag.backLink;
  if (!b.toCase || !b.backed) failures.push(`back link: home -> case -> back did not complete (case ${b.toCase}, back ${b.backed})`);
  if (b.home?.pathname !== "/") failures.push(`back link: from home, back landed on ${b.home?.pathname}, expected /`);
  if (b.home?.marker !== 1) failures.push(`back link: from home, home reloaded instead of restoring (marker ${b.home?.marker}, navType ${b.home?.navType})`);
  if (b.direct?.pathname !== "/" || !b.directBacked) failures.push(`back link: direct entry, link landed on ${b.direct?.pathname}`);
  if (b.direct?.navType !== "navigate") failures.push(`back link: direct entry, navigation type ${b.direct?.navType}, expected navigate`);
}
// Page curtain: the dither has image rects on the Cases, and none while the curtain leaves; a case click in a View Transitions browser moves nothing.
if (!(diag.curtain.rectsBefore >= 1)) failures.push(`curtain: no image rects on the Cases before leaving (${diag.curtain.rectsBefore})`);
if (diag.curtain.rectsLeaving !== 0) failures.push(`curtain: dither still cuts ${diag.curtain.rectsLeaving} holes while leaving`);
if (diag.vt.before !== diag.vt.after) failures.push(`curtain moved on a case link click with View Transitions (${diag.vt.before} -> ${diag.vt.after}, supported ${diag.vt.supported})`);
{
  const L = diag.luma;
  if (!L.arrived || !L.arrivedMobile) failures.push("luma: arrival animations never finished");
  if (L.sectionVideos !== 9) failures.push(`luma: ${L.sectionVideos} section videos, expected 9`);
  if (L.reminders.videos !== 1 || L.reminders.stills !== 1) failures.push(`luma: reminders has ${L.reminders.videos} videos and ${L.reminders.stills} stills, expected 1 and 1`);
  if (L.remindersA.paused || L.remindersB.paused || !(L.remindersB.t > L.remindersA.t)) failures.push(`luma: reminders clip not playing on screen (paused ${L.remindersB.paused}, time ${L.remindersA.t} -> ${L.remindersB.t})`);
  if (!L.teamPaused || !L.teamPausedAtTop) failures.push(`luma: off-screen team clip is playing (paused at top ${L.teamPausedAtTop}, after reminders ${L.teamPaused})`);
  if (!(L.visibleClips >= 1)) failures.push(`luma: no section clip visible at reminders (${L.visibleClips})`);
  if (!(L.ditherRects >= L.visibleClips)) failures.push(`luma: dither counts ${L.ditherRects} rects, expected >= ${L.visibleClips} visible clips`);
  if (L.mascotTop.ariaHidden !== "true") failures.push(`luma: mascot video aria-hidden is ${L.mascotTop.ariaHidden}`);
  if (!L.mascotTop.playing) failures.push("luma: mascot not playing on screen at 1440");
  for (const [label, m] of [["1440", L.mascotTop], ["390", L.mascot390]]) {
    if (m.overlapsH1) failures.push(`luma: mascot overlaps the H1 at ${label}`);
    if (m.overlapsFacts) failures.push(`luma: mascot overlaps the facts at ${label}`);
  }
  if (L.mobileScrollWidth > 390) failures.push(`luma: horizontal overflow at 390px (scrollWidth ${L.mobileScrollWidth})`);
  for (const [label, v] of [["luma", L.screens1440], ["neura-path", diag.neura.screens1440]]) {
    if (v.count < 1) failures.push(`${label}: no screens frames at 1440`);
    if (v.maxWidth > 300) failures.push(`${label}: screens item is ${v.maxWidth}px wide at 1440, expected <= 300`);
  }
  for (const [label, v, scroll] of [["luma", L.screens390, L.mobileScrollWidth], ["neura-path", diag.neura.screens390, diag.neura.mobileScrollWidth]]) {
    if (v.maxRight > 390 || v.minLeft < 0) failures.push(`${label}: screens overflow the 390px viewport (left ${v.minLeft}, right ${v.maxRight})`);
    if (scroll > 390) failures.push(`${label}: horizontal overflow at 390px (scrollWidth ${scroll})`);
  }
}
const hard = errors.filter((e) => e.startsWith("EXCEPTION") || (e.startsWith("ERROR") && !e.includes("THREE.Clock")));
if (hard.length) failures.push(...hard);
if (failures.length) { console.error("VERIFY FAILED:\n  - " + failures.join("\n  - ")); process.exit(1); }
console.log("VERIFY OK");
