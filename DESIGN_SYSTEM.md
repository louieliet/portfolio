# Design System

Source of truth for tokens, type, layout, and motion. Code lives in `src/styles/global.css`.
Look: quiet, narrow column, hierarchy by color (not size). Neutral gray, no cream or beige.

## Tokens

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F4F4F4` | `#0B0C0B` |
| `--text` | `#0C0C0C` | `#EDEDED` |
| `--muted` | `#6B6B6B` | `#8A8A8C` |
| `--line` | black 8% | white 8% |
| `--accent` | `#F5D04A` (both themes) | same |

Theme: `data-theme` on `<html>`, set by the head script (stored choice, else system). Light is the
default on `:root`; dark follows the system only when no `data-theme` is set. `color-scheme` follows the theme.

Other tokens: `--font-sans`, `--font-serif`, `--font-mono`, `--col` (880px), `--header-h` (56px),
`--space-section` (`clamp(96px, 14vh, 180px)`), `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`).

Accent is used only for: the active work label bar and its index dot, the iOS builder and co-founder role effects, `::selection`, the "Now" chip and ongoing bar in Experience, and link underline on hover.

## Type scale

- Body and UI: 15px / 1.6, General Sans (200-700 variable).
- `.t-lead`: 22-26px fluid, line-height 1.3, tracking -0.01em. Opening sentences.
- `.t-display`: `clamp(44px, 6vw, 80px)`, weight 500, tracking -0.03em, line-height 1. Names, case titles.
- `.t-mono`: 12.5px Geist Mono, tabular numbers. Metadata, clock, labels.
- `.t-serif`: Instrument Serif italic. Accents only.
- `.muted`: `--muted` color.

## Layout rules

- `.col`: content column, max 880px. From 960px it starts at `26.25vw` (504px at 1920). Below 960px, 20px gutters.
- `.bleed`: full width, `clamp(20px, 3vw, 48px)` gutters. Use for full-bleed media.
- `.section`: vertical padding `--space-section`. `.rule`: 1px separator in `--line`.
- Radius 0. No shadows. No cards: separate with 1px rules and whitespace.
- Header is fixed, 56px, `--bg` at 85% with backdrop blur. Layout pads the body by its height.
- Below 720px: clock hidden, nav stays right.

## Motion rules

Source of truth: `src/lib/motion.ts` (header comment has the full contract). Components do not set their own timings.

- One entrance ease `power3.out` (CSS `--ease-out`). One hover ease `power3.inOut` (CSS `--ease-inout`).
- Three durations: `fast` 0.3s, `base` 0.45s, `slow` 0.8s (CSS `--dur-fast`, `--dur-base`, `--dur-slow`). Line stagger 0.08s.
- Animate only transform and opacity. The theme circle also animates `clip-path`.
- Everything is created inside `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`. Under reduced motion nothing is split, hidden or animated.
- Lenis is created on `astro:page-load` and driven by `gsap.ticker`, so ScrollTrigger shares its clock. Destroyed on `astro:before-swap`. Not created under reduced motion. `window.__lenis` is still set.
- `initMotion()` / `destroyMotion()` run on page load and before swap.
- Line roll: `data-roll` (text rises from behind a mask while rotating on X, 0.45s, stagger 0.08). `data-roll="slow"` is 0.8s, stagger 0.12. `data-roll-delay="0.2"` adds a delay. Below the fold it fires once at `top 85%`. Used on headings, titles and the case h1.
- Hover roll: `data-roll-hover` on a link or label. Fine pointers only. The label rolls 90deg onto an aria-hidden copy in 0.3s.
- Load choreography: `data-arrive="<seconds>"` marks first-viewport items. First visit in a session plays the full version (about 1.1s). Later navigations play the short version (everything rolls together at 0.3s).
- `data-arrive` is the only CSS-hidden state (`html.js [data-arrive]`). It has a 2s failsafe, so text shows if JS never runs.
- The one pinned chapter: `data-story` ("How I work", Story.astro). Desktop (>= 900px) with motion only. The stage pins under the header for 200% of a viewport (`scrub` 0.5). Words light up with scroll, each beat owning a third of the progress. The ASCII block dissolves noise, wireframe, product. Limits: one pin on the home, no snap, no pin on mobile or reduced motion. Under 900px each beat lights once on entry. Reduced motion and no JS show all beats lit with the product frame.
- Timeline rail (/about only): `data-timeline` draws a 1px rail down the rows (scrubbed `--draw`), and each row lights as the rail passes it. Without JS the rail is fully drawn and every row is lit.
- Experience (home, `Experience.astro`): desktop with motion and a viewport that fits the block (`innerHeight - header >= block + 48px`) uses a CSS sticky block, not a ScrollTrigger pin. The track is about 680px of scroll for five rows (`STEP` 170px per row). Scroll sets `s`, the open amount per row is a triangle over `s` (sums to 1, so the block height is constant), and detail opacity, ASCII resolve and bars follow it. Under 900px or a short viewport: natural flow, each row opens once at 70% of the viewport. Reduced motion and no JS: every row open, real photos.
- Footer: one arrival schedule at `top 85%`, once. The dither field (`DitherField.astro`, WebGL) runs only while the footer is in view and the tab is visible. Under reduced motion it draws one static frame, with no loop and no pointer glow. No WebGL: the footer shows its plain `--bg`.
- Stack velocity: smoothed scroll velocity sets `--v` on the work stack (up to 6deg tilt, 1.5% stretch) and scales the hero field (up to 2.2x amplitude and speed). Exactly 0 at rest.
- Work stack resolve (desktop, motion only): `res = smoothstep(0.62, 0.1, |p|)` per card. The media moves `-9%` of its frame height per unit of `p` and settles from 1.08x to 1x. The ASCII overlay dissolves bottom to top as `res` rises. Repaints only when `res` moves by 1/60.
- Work stack flat resolve (under 900px): each card resolves once, 700ms, when 35% of it is in view. Then its canvas is cleared for good.
- Theme dot: circle reveal from the dot (0.65s) through `document.startViewTransition`. Instant under reduced motion or without the API.
- Entrances for non-text blocks: `.reveal` fades in and rises 12px over 600ms `--ease-out`, stagger with `--i` (60ms steps). Visible without JS.
- Video loops (`.mp4`): muted, play only while on screen, never under reduced motion (the poster stays).
- Reduced motion: every item above is off. Transitions and animations collapse to ~0ms, text and arrivals show immediately.

## Components (one line each)

- `Layout.astro`: head and SEO, theme script, ClientRouter, Lenis and reveal init, skip link, Header, `<main>`, Footer.
- `Header.astro`: fixed bar: name, clock, Work (count), About, Resume, theme dot.
- `Clock.astro`: "CDMX, 11:12 pm, 18°C" live time and Open-Meteo temperature. `[data-clock]`, any count per page. The colon blinks (opacity, 1s steps).
- `src/lib/motion.ts`: the motion system. Rules, durations, the `data-*` contract, `initMotion` / `destroyMotion`, theme switch, roll helpers.
- `Footer.astro`: "Get in touch" copies the email, links row, "Now building", clock, copyright. Min height `clamp(420px, 62vh, 620px)`, meta row pinned to the bottom. Muted copy is `color-mix(text 72%, bg)`.
- `DitherField.astro`: gray ordered-dither field (Bayer 8x8, 4 levels, 3 CSS px cells) behind the footer. Raw WebGL, no deps. Ink is `mix(bg, text, k)` read from the tokens: k 0.40 dark, 0.38 light. Renders at 1x CSS px, scaled with `image-rendering: pixelated`. Pointer glow on fine pointers only.
- `Story.astro`: "How I work" chapter, rendered on the home between Hero and WorkStack. Three beats from `personalInfo.story`, plus signs, and the ASCII block.
- `src/lib/ascii-story.ts`: pure functions for the chapter's ASCII block: noise, wireframe, product, and the blend `renderStoryFrame(progress, t)`.
- `Experience.astro`: home "Experience". Companies as headlines (`h3`) on one shared time axis (gantt bars, years in mono). The active row opens on scroll: description, stack chips, and the first asset as a 300x190 ASCII-resolving photo (9:16 assets keep their shape at 190px tall). Motion modes are described under Motion rules.
- `src/lib/period.ts`: period math for Experience: parse "Mon YYYY - Mon YYYY|Present", range text, duration text, and the shared axis. Throws on a bad period so the build fails.
- `Timeline.astro`: year, company and role rows, with the `data-timeline` rail. Used by /about only.
- `Hero.astro`: home intro, first viewport: at least `100dvh - var(--header-h)` tall. `AsciiField` takes the free height on top; the name with `RoleWord`, now/previously lines and fun fact sit at the bottom (padding-bottom `clamp(28px, 6vh, 64px)`). Bottom-right scroll cue ("Scroll" plus a 1px, 24px line), `aria-hidden`, fades on opacity once the page scrolls 80px.
- `AsciiField.astro`: full-width ASCII wave field (`.col` width up to 880px, full free height, 11px glyphs, 9px under 520px, min 160px). The grid is measured: cell size from a hidden probe (read once after fonts), cols/rows from a ResizeObserver, capped at 160x60. SSR frame is 134x40 in a box of the same size, so nothing shifts. Loop only when on screen and visible; reduced motion paints one static frame at the measured size. Math in `src/lib/wave.ts` (`renderWaveFrame(t, pointer, energy, reveal, cols, rows)`).
- `RoleWord.astro`: rotating role inside the intro, 3.2s dwell. Four entrances (wireframe, ASCII resolve, spring pop, cursor highlight). Width reserved for the longest role.
- `WorkStack.astro`: home work list as a perspective card stack. Tilt from `--p`; ASCII resolve per card (canvas overlay, `--res`); media settles inside its frame (`.stage`); sticky index at 1100px and up; only the active card plays video, once resolved.
- `src/lib/ascii-image.ts`: pure maths and canvas painting for the WorkStack ASCII resolve (resolve amount, cell hash and sweep, glyph ramp, cover sampling, device cap).
- `Media.astro`: image or muted looping `.mp4` with `.webp` poster; optional `transitionName`. Used by the case pages.
- `src/styles/global.css`: tokens, reset, `@font-face`, type utilities, `.col`/`.bleed`, `.reveal`.
- `src/lib/data.ts`: content, `heroShot` (case hero), `ProjectItem.card` (home stack: kind, media, chips), `personalInfo.roles/now/previously/intro/facts/funFact`, `periodYear()`.
