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

Accent is used only for: the role sticker, `::selection`, the "Now" timeline label, and link underline on hover.

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

- Smooth scroll: Lenis, created on `astro:page-load`, destroyed on `astro:before-swap`. Not created under reduced motion.
- Page transitions: Astro ClientRouter. Shared elements use `transition:name`.
- Entrances: `.reveal` fades in and rises 12px over 600ms `--ease-out`, stagger with `--i` (60ms steps). Visible without JS.
- Video loops (`.mp4`): muted, play only while on screen, never under reduced motion (the poster stays).
- Reduced motion: transitions and animations collapse to ~0ms, reveals show immediately.

## Components (one line each)

- `Layout.astro`: head and SEO, theme script, ClientRouter, Lenis and reveal init, skip link, Header, `<main>`, Footer.
- `Header.astro`: fixed bar: name, clock, Work (count), About, Resume, theme dot.
- `Clock.astro`: "CDMX, 11:12 pm, 18°C" live time and Open-Meteo temperature. `[data-clock]`, any count per page.
- `Footer.astro`: "Get in touch" copies the email, links row, "Now building", clock, copyright.
- `Media.astro`: image or muted looping `.mp4` with `.webp` poster; optional `transitionName`.
- `src/styles/global.css`: tokens, reset, `@font-face`, type utilities, `.col`/`.bleed`, `.reveal`.
- `src/lib/data.ts`: content, `heroShot` per project, `personalInfo.roles/intro/facts/funFact`, `periodYear()`.
