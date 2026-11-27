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
- Hover and press: four gestures, one per kind of target. Tokens on `:root` in `global.css`: `--ease-hover` (`cubic-bezier(0.23, 1, 0.32, 1)`), `--ease-pop` (`cubic-bezier(0.34, 1.56, 0.64, 1)`), `--dur-hover-in` 240ms, `--dur-hover-out` 160ms, `--dur-press` 120ms. Every hover is gated by `(hover: hover) and (pointer: fine)`. Movement is also gated by `(prefers-reduced-motion: no-preference)`; under reduced motion hovers change colour or opacity only. Exit is always faster than enter. Transitions name their properties; no `transition: all`.
- Gesture 1, text links (`data-swap`): the letters of the link slide up one line in a clipped cell, staggered 12ms per character (capped at 10). `initMotion` wraps the text nodes only; element children (counts, `sup`) stay. Used on header nav, the work index, the footer links row, "More about me" and the case "Back" label. Sibling dimming: while one link in a `.dim` group is hovered or focus-visible, the others go to `--muted` (150ms). The `aria-current` item is never dimmed. Keyboard focus shows the same dimming without the letter move. Accessible name: `aria-label` on a bare `<a>`, otherwise an `.sr-only` copy.
- Gesture 1b, inline links (default for every `<a>`): a 1px `currentColor` underline draws in from the left on hover and focus-visible, and retracts on leave. Links that are not running text opt out with `data-no-inl` (cards, the header name, the skip link, next project, the case "Back" pill).
- Gesture 2, work cards: on hover of a card whose resolve is complete (`is-settled`, set by the script at the threshold where the ASCII overlay clears) the media settles to `scale(1.02)` with the individual `scale` property (it multiplies with the scroll transform, and the overlay is already gone so nothing misaligns). The label bar slides the chips up and fades them, and slides in "View case" with an arrow (200ms, 40ms delay). A cursor label "View case" follows the pointer over the media only (one shared pill, `position: fixed`, rAF lerp, 14px offset, fine pointers and motion only). Press: `scale(0.99)`.
- Gesture 3, big calls (footer "Get in touch", next project name): an accent wipe sweeps across the text (280ms in, 200ms out) through a `.wipe` copy that is a sibling of the split text, not inside it. `data-magnetic` on a wrapper drifts it up to 6px toward the pointer (lerped, eased back on leave, fine pointers only). Press: `scale(0.98)`. Footer copy feedback is a 3px blur crossfade (200ms) between "Copy email" and "Copied" or "Copy failed".
- Gesture 4, small controls: the theme dot scales to 1.25 on hover (`--ease-pop`, 160ms) and presses to 0.92. No other hover motion.
- Press (`:active`) rules: cards 0.99, big calls 0.98, small controls 0.92 to 0.96. Never on disabled elements and never on inline text links.
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
- Page transition ("the card opens", `src/lib/page-transition.ts`). Names, direction classes, timings and the fallback:
  - Names. A plain click or Enter on a home card (or on the Next project block) names, for that navigation only: the media `vt-cover`, the label name `vt-title` and the label bar `vt-bar`. The case page carries the static names: the hero `vt-cover` and the h1 `vt-title`. Names are set in a capture-phase click, before ClientRouter prepares the navigation, and cleared in `astro:after-swap`. Each name exists once per document at snapshot time.
  - Forward (card or next -> case). The cover and title groups take 650ms on `cubic-bezier(0.77, 0, 0.175, 1)`. The cover snapshots are `object-fit: cover` and cross-fade in 200ms, so the picture never stretches. The title snapshots size from the height (`width: auto`), so the text scales from its leading edge and is never squashed; the colour change is their cross-fade. The label bar folds left over 220ms (`clip-path`, no counterpart). Other home pieces leave in 150ms (root old). The new page fades in over 250ms after a 150ms delay (root new). Case pieces that the shared shot does not carry (kicker, lead, meta, overview, Back) fade up from 420ms, 70ms stagger, through `buildLateArrivals()`. The hero and h1 are shown as they are and never roll (`data-vt-keep`, `data-vt-late`, `html[data-vt-arrive]`, set in `astro:after-swap`). The card's video playhead moves to the case hero when the src matches (sessionStorage, read once).
  - Way back, the card travel (case -> home: browser back, the Back pill, or any link home from a case). The case hero shrinks back into its card and the case title returns to the card's label, in 520ms on `cubic-bezier(0.77, 0, 0.175, 1)` (`html.vt-back`, never under reduced motion). The old snapshot is the case hero and h1 (static names). The new one is the landing card: `vt-cover` on its media, `vt-title` on its label name, `data-vt-landing`, `is-active`, `is-settled`, `--p 0`, `--res 1`, and `loading="eager"` `decoding="sync"` on its image, so it is flat and resolved from the first frame.
  - Late fade rule. The old snapshots of the return stay fully visible for the whole travel (`animation: none; opacity: 1`), and the new ones fade in over the last part (`vt-fade-in` 180ms, from 320ms). Why: the landing picture may not be decoded at the first frame. A fade from the start would show an empty or blank card. The title's colour change (`--text` to black on the accent bar) resolves in that late fade.
  - Return root. The case-only pieces leave in 120ms (old root), and the home pieces come back after a 220ms delay over 300ms (new root), so they reappear around the landing card. The header does not move (`site-header`).
  - Centring and order. In `astro:after-swap` the card is centred on the un-enhanced layout and marked as landing. `astro:page-load` then runs motion init (the Story pin spacer and the Experience sticky track), and `settleReturnCard` re-centres the card in the same task (Lenis `immediate`). The card's viewport position is the same before and after the layout change, so the live new-state group does not move. Nothing rolls again (`html[data-vt-return]`), and the first viewport is already on screen.
  - Clean-up. The landing names and marker end 700ms after the swap (longer than the 520ms travel), on the next `astro:before-preparation`, and at the start of the next card click. A name never survives into the next navigation.
  - Fallback (the SAFE path, `html[data-vt="back"]`): a plain 200ms root cross-fade with the card centred, no shared element. Used only for reduced motion, no View Transitions support, the theme switch, a card id that is not on the page, and an arrival at home from anything other than a case page (no travel and no centring, as before).
  - Case -> case. Next project, then browser back to the previous case: `astro:before-preparation` strips the static names of the case being left, so the change is a plain cross-fade. The hero is not morphed into the previous hero.
  - Back pill. When the page before the case was home it calls `history.back()`. Otherwise it calls `navigate('/')`, not the `/#work-{id}` href: a hash URL makes Astro's `moveToLocation` do a full page load, so the travel would not run.
  - Why not the shared element in the first place (kept for reference): Astro runs `astro:page-load` after the swap callback resolves and after `runScripts()`, and ScrollTrigger refreshes on rAF, so the layout the snapshot sees can differ from the final one. The viewport-centred card and the live new group are what make the travel correct despite that. See the comment in `page-transition.ts`.
  - Off. Under reduced motion no names are set (the global reduced-motion block makes the cross-fades instant). Without `document.startViewTransition` nothing is named. The way-back names are the landing card's only. During the theme switch (`html.theme-switching`) no name exists: the header and the static case names are cleared, so the circle is the only transition.
  - Header. It is `transition:persist` and named `site-header`, so it does not cross-fade or move during a page travel. Its `aria-current` is synced on each swap.
- Entrances for non-text blocks: `.reveal` fades in and rises 12px over 600ms `--ease-out`, stagger with `--i` (60ms steps). Visible without JS.
- Video loops (`.mp4`): muted, play only while on screen, never under reduced motion (the poster stays).
- Reduced motion: every item above is off. Transitions and animations collapse to ~0ms, text and arrivals show immediately.

## Components (one line each)

- `Layout.astro`: head and SEO, theme script, ClientRouter, Lenis and reveal init, skip link, Header, `<main>`, Footer.
- `Header.astro`: fixed bar: name, clock, Work (count), About, Resume, theme dot. `transition:persist`: the same node across navigations, `aria-current` synced on each swap.
- `Clock.astro`: "CDMX, 11:12 pm, 18°C" live time and Open-Meteo temperature. `[data-clock]`, any count per page. The colon blinks (opacity, 1s steps).
- `src/lib/motion.ts`: the motion system. Rules, durations, the `data-*` contract, `initMotion` / `destroyMotion`, theme switch, roll helpers.
- `Footer.astro`: "Get in touch" copies the email, links row, "Now building", clock, copyright. Min height `clamp(420px, 62vh, 620px)`, meta row pinned to the bottom. Muted copy is `color-mix(text 72%, bg)`.
- `DitherField.astro`: gray ordered-dither field (Bayer 8x8, 4 levels, 3 CSS px cells) behind the footer. Raw WebGL, no deps. Ink is `mix(bg, text, k)` read from the tokens: k 0.40 dark, 0.38 light. Renders at 1x CSS px, scaled with `image-rendering: pixelated`. Pointer glow on fine pointers only.
- `Story.astro`: "How I work" chapter, rendered on the home between Hero and WorkStack. Three beats from `personalInfo.story`, plus signs, and the ASCII block.
- `src/lib/ascii-story.ts`: pure functions for the chapter's ASCII block: noise, wireframe, product, and the blend `renderStoryFrame(progress, t)`.
- `src/lib/tech-icons.ts`: logo paths (Simple Icons, CC0) for the Experience stack chips. A chip always keeps its name; the logo is added only when the technology has a clear one, drawn with `currentColor`.
- `Experience.astro`: home "Experience". Companies as headlines (`h3`) on one shared time axis (gantt bars, years in mono). The active row opens on scroll: description, stack chips, and the first asset as a 300x190 ASCII-resolving photo (9:16 assets keep their shape at 190px tall). Motion modes are described under Motion rules.
- `src/lib/period.ts`: period math for Experience: parse "Mon YYYY - Mon YYYY|Present", range text, duration text, and the shared axis. Throws on a bad period so the build fails.
- `Timeline.astro`: year, company and role rows, with the `data-timeline` rail. Used by /about only.
- `Hero.astro`: home intro, first viewport: at least `100dvh - var(--header-h)` tall. `AsciiField` sits on the leading edge right above the text (60% of the column width and 60% of the free height), leaving the rest of the area empty; the name with `RoleWord` and the now/previously lines sit at the bottom (padding-bottom `clamp(28px, 6vh, 64px)`). Bottom-right scroll cue ("Scroll" plus a 1px, 24px line), `aria-hidden`, fades on opacity once the page scrolls 80px.
- `AsciiField.astro`: ASCII wave field at 60% of the `.col` width and 60% of the hero's free height, leading aligned (full width under 720px; 11px glyphs, 9px under 520px, min 160px). The grid is measured: cell size from a hidden probe (read once after fonts), cols/rows from a ResizeObserver, capped at 160x60. SSR frame is 134x40 in a box of the same size, so nothing shifts. Loop only when on screen and visible; reduced motion paints one static frame at the measured size. Math in `src/lib/wave.ts` (`renderWaveFrame(t, pointer, energy, reveal, cols, rows)`).
- `RoleWord.astro`: rotating role inside the intro, 3.2s dwell. Four entrances (wireframe, ASCII resolve, spring pop, cursor highlight). Width reserved for the longest role.
- `WorkStack.astro`: home work list as a perspective card stack. Tilt from `--p`; ASCII resolve per card (canvas overlay, `--res`); media settles inside its frame (`.stage`); sticky index at 1100px and up; only the active card plays video, once resolved. A plain click on a card starts the card travel (names, overlay cleared).
- `src/lib/ascii-image.ts`: pure maths and canvas painting for the WorkStack ASCII resolve (resolve amount, cell hash and sweep, glyph ramp, cover sampling, device cap).
- `Media.astro`: image or muted looping `.mp4` with `.webp` poster; optional `viewTransitionName` (a static inline name, marked `data-vt-static`). Used by the case pages.
- `src/lib/page-transition.ts`: the card travel and the way back: names, direction attributes, the video playhead handoff, the return-card centring. Called from `Layout.astro` (before-swap, after-swap), `WorkStack.astro`, `NextProject.astro` and the Back pill in `projects/[slug].astro`.
- `src/styles/global.css`: tokens, reset, `@font-face`, type utilities, `.col`/`.bleed`, `.reveal`.
- `src/lib/data.ts`: content, `heroShot` (a still for the case page, shown as a figure under the overview when it differs from the card's media and poster), `ProjectItem.card` (home stack: kind, media, chips; `card.media[0]` is also the case hero), `personalInfo.roles/now/previously/intro/facts/funFact`, `periodYear()`.
