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

Accent is used only for: the active work label bar and its index dot, the iOS builder and co-founder role effects, `::selection`, the "Now" timeline label, and link underline on hover.

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
- Timeline rail: `data-timeline` draws a 1px rail down the rows (scrubbed `--draw`), and each row lights as the rail passes it. Without JS the rail is fully drawn and every row is lit.
- Footer: one arrival schedule at `top 85%`, once. The ghost word "CONTACT" (`data-ghost`) scrubs from 35% down to 0 and fades in as the footer enters. It is cropped by the footer, absolutely positioned, and adds no height.
- Stack velocity: smoothed scroll velocity sets `--v` on the work stack (up to 6deg tilt, 1.5% stretch) and scales the hero field (up to 2.2x amplitude and speed). Exactly 0 at rest.
- Theme dot: circle reveal from the dot (0.65s) through `document.startViewTransition`. Instant under reduced motion or without the API.
- Entrances for non-text blocks: `.reveal` fades in and rises 12px over 600ms `--ease-out`, stagger with `--i` (60ms steps). Visible without JS.
- Video loops (`.mp4`): muted, play only while on screen, never under reduced motion (the poster stays).
- Reduced motion: every item above is off. Transitions and animations collapse to ~0ms, text and arrivals show immediately.

## Components (one line each)

- `Layout.astro`: head and SEO, theme script, ClientRouter, Lenis and reveal init, skip link, Header, `<main>`, Footer.
- `Header.astro`: fixed bar: name, clock, Work (count), About, Resume, theme dot.
- `Clock.astro`: "CDMX, 11:12 pm, 18°C" live time and Open-Meteo temperature. `[data-clock]`, any count per page. The colon blinks (opacity, 1s steps).
- `src/lib/motion.ts`: the motion system. Rules, durations, the `data-*` contract, `initMotion` / `destroyMotion`, theme switch, roll helpers.
- `Footer.astro`: "Get in touch" copies the email, links row, "Now building", clock, copyright, and the decorative "CONTACT" ghost word.
- `Story.astro`: "How I work" chapter, rendered on the home between Hero and WorkStack. Three beats from `personalInfo.story`, plus signs, and the ASCII block.
- `src/lib/ascii-story.ts`: pure functions for the chapter's ASCII block: noise, wireframe, product, and the blend `renderStoryFrame(progress, t)`.
- `Timeline.astro`: year, company and role rows, with the `data-timeline` rail. Shared by home and about.
- `Hero.astro`: home intro, first viewport: at least `100dvh - var(--header-h)` tall. `AsciiField` takes the free height on top; the name with `RoleWord`, now/previously lines and fun fact sit at the bottom (padding-bottom `clamp(28px, 6vh, 64px)`). Bottom-right scroll cue ("Scroll" plus a 1px, 24px line), `aria-hidden`, fades on opacity once the page scrolls 80px.
- `AsciiField.astro`: full-width ASCII wave field (`.col` width up to 880px, full free height, 11px glyphs, 9px under 520px, min 160px). The grid is measured: cell size from a hidden probe (read once after fonts), cols/rows from a ResizeObserver, capped at 160x60. SSR frame is 134x40 in a box of the same size, so nothing shifts. Loop only when on screen and visible; reduced motion paints one static frame at the measured size. Math in `src/lib/wave.ts` (`renderWaveFrame(t, pointer, energy, reveal, cols, rows)`).
- `RoleWord.astro`: rotating role inside the intro, 3.2s dwell. Four entrances (wireframe, ASCII resolve, spring pop, cursor highlight). Width reserved for the longest role.
- `WorkStack.astro`: home work list as a perspective card stack. Tilt from `--p`; sticky index and counter at 1100px and up; only the active card plays video.
- `Media.astro`: image or muted looping `.mp4` with `.webp` poster; optional `transitionName`. Used by the case pages.
- `src/styles/global.css`: tokens, reset, `@font-face`, type utilities, `.col`/`.bleed`, `.reveal`.
- `src/lib/data.ts`: content, `heroShot` (case hero), `ProjectItem.card` (home stack: kind, media, chips), `personalInfo.roles/now/previously/intro/facts/funFact`, `periodYear()`.
