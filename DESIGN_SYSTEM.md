# Editorial Brutalist Design System ❋

This document outlines the architectural patterns, design engineering principles, and code structures used to create the premium "Editorial Magazine / Brutalist" look and feel for this site. Use this as a playbook to replicate this aesthetic across other repositories.

## 1. Core Philosophy & Aesthetic

*   **No Cards, No Containers:** Content lives directly on the background. We rely on negative space and typography to create hierarchy, not borders or boxes.
*   **Asymmetry & Grid:** Layouts deliberately avoid perfect symmetry. Using CSS Grid with off-center alignments creates an editorial, poster-like feel.
*   **Monumental Typography:** Headlines are massive, treating letters as graphic shapes.
*   **Tactile Interactions:** Micro-interactions (hover states, active states) must feel expensive, smooth, and responsive.
*   **Cinematic Motion:** Scroll-driven animations are used to tell a story (scrollytelling), not just for the sake of moving things.

---

## 2. Design System Tokens (CSS Variables)

We use a "Deep Dark Mode" approach. It's not pure black, but a very dark gray `#0a0a0a` that prevents eye strain while keeping high contrast with off-white text `#f5f5f5`.

```css
:root {
  /* Palette */
  --bg: #0a0a0a;
  --text: #f5f5f5;
  --text-muted: #888888;
  --border-light: rgba(255, 255, 255, 0.1);

  /* Typography */
  --font-sans: "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-display: "Satoshi", var(--font-sans);
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-liquid: cubic-bezier(0.77, 0, 0.175, 1);
}
```

---

## 3. Typography Architecture

The key to editorial design is fluid typography and strict control over text blocks.

*   **Headlines (`h1`, `h2`):** Use `clamp()` for monumental sizing that scales perfectly without media query breakpoints.
*   **Tracking (Letter-spacing):** Tight letter-spacing (`-0.02em`, `-0.04em`) makes large text look more cohesive and block-like.
*   **Line-height:** Tight leading (`1`, `1.1`) for headlines, relaxed leading (`1.5`, `1.6`) for body text.

```css
h1 {
  font-family: var(--font-display);
  /* Scales from 92px on mobile to 280px on massive screens */
  font-size: clamp(92px, 15.5vw, 280px);
  line-height: 0.85;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}
```

---

## 4. Architectural Layout Patterns

To achieve full-bleed (edge-to-edge) sections mixed with constrained content, the HTML structure is critical.

### The "Body vs. Page-Shell" Pattern
Elements that need to span `100vw` or stick to the viewport (like the Hero or Scrollytelling pins) must sit **outside** of any max-width container, directly inside the `<body>`.

```html
<body>
  <header class="site-header">...</header>
  
  <!-- Full-bleed Hero -->
  <section class="hero">...</section>
  
  <!-- Full-bleed Pinned Scrollytelling -->
  <section class="scrollytelling-scene">...</section>

  <!-- Constrained Content -->
  <main class="page-shell">
    <section class="narrative-band">...</section>
  </main>
</body>
```

### The Manifesto Hero
A full-screen, sticky hero that gets covered by subsequent content.
*   `position: sticky; top: 0;` keeps it in place.
*   `height: 100dvh;` ensures it covers the full viewport.
*   `z-index: 1;` ensures the `.page-shell` (which has a higher z-index and solid background) scrolls *over* it.

---

## 5. Advanced CSS Techniques

### The "Camaleonic" Sticky Header
To make the header visible over both dark images and the solid black background, we use blend modes.

```css
.site-header {
  position: fixed;
  mix-blend-mode: difference; /* Inverts color based on background */
  z-index: 999;
}
```

### Animated Liquid Texture (SVG Filter)
Instead of heavy videos, we use lightweight SVG math filters combined with CSS/GSAP animation.

```html
<!-- Inject at bottom of body -->
<svg style="display: none;">
  <filter id="liquid-filter">
    <feTurbulence type="fractalNoise" baseFrequency="0.015 0.04" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
  </filter>
</svg>
```
```css
/* Apply to an image */
.bg-image-liquid {
  filter: grayscale(100%) contrast(1.2) url(#liquid-filter);
}
```

---

## 6. Button Design Engineering (Emil Kowalski Philosophy)

Buttons must feel tactile. We implemented a reusable `<Button>` component (`src/components/Button.astro`) that handles complex DOM structures required for premium motion.

### The "Liquid Fill" Hover
Instead of changing the background color directly, we scale a pseudo-element for a directional wipe effect.

```css
.button {
  position: relative;
  overflow: hidden;
}
.button::before {
  content: "";
  position: absolute;
  inset: 0;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 400ms var(--ease-liquid);
}
.button:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}
```

### The "Endless Slide" Arrow Swap
We stack two SVGs vertically inside an `overflow: hidden` mask. On hover, we translate the container up.

```html
<span class="button-icon-inner">
  <span><svg>...</svg></span> <!-- Arrow 1 -->
  <span><svg>...</svg></span> <!-- Arrow 2 -->
</span>
```
```css
.button:hover .button-icon-inner {
  transform: translateY(-25%); /* Slides the first out and the second in */
}
```

### Accessibility Wrapper
Motion should only occur for users who have a mouse and haven't requested reduced motion.

```css
@media (hover: hover) and (pointer: fine) {
  /* All hover states go here */
}
```

---

## 7. Motion & Scroll Behavior (GSAP & Lenis)

### Smooth Scrolling Setup
We use `Lenis` for smooth scrolling, synced meticulously with `ScrollTrigger`. We use a custom easing curve for a slightly "heavier" premium feel.

```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
lenis.on("scroll", ScrollTrigger.update);
```

### Hardware Acceleration
Always animate `transform` and `opacity`. Never animate `top`, `left`, `width`, or `height` (except in specific `clip-path` edge cases) to maintain 60fps.

### Scrollytelling Pinning
To create a "sticky" scene where animations happen while the user scrolls, use `ScrollTrigger` with `pin: true`.

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scrollytelling-scene",
    start: "top top",
    end: "+=180%", // Keep pinned for 1.8x the height of the viewport
    scrub: true,
    pin: true,
    pinSpacing: true, // Crucial: adds padding so next content doesn't overlap early
  }
});

// Animate clip-path to open up a view
tl.fromTo(".image-mask", 
  { clipPath: "polygon(30% 30%, 70% 30%, 70% 70%, 30% 70%)" },
  { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }
);
```

---

## 8. Section-by-Section Breakdown

To truly replicate this look and feel, you must understand the architectural purpose behind each section.

### 8.1 The "Camaleonic" Nav Bar (`.site-header`)
*   **Purpose:** Provide constant navigation without interrupting the visual flow, regardless of what scrolls underneath it.
*   **Architecture:** Removed from the document flow (`position: fixed`).
*   **Visual Trick:** We use `mix-blend-mode: difference`. If the background image is light, the text automatically turns dark. If it passes over the deep dark mode background, it turns white. This avoids writing complex JS to track scroll position and swap CSS variables. We also integrate our `<Button data-size="micro">` here for consistent interaction.

### 8.2 The Manifesto Hero (`.hero`)
*   **Purpose:** Deliver a massive, magazine-cover first impression.
*   **Architecture:** It lives outside the main `.page-shell`. It uses `position: sticky; top: 0;` so instead of being pushed up by the scroll, it stays frozen in place. The rest of the site (which has a solid background and higher z-index) simply scrolls *over* it, covering it up like a curtain.
*   **Composition:** A 4K background image darkened via CSS filters (`brightness`, `contrast`). The word "EMOTIONAL" is sized using `clamp()` to act as a colossal graphic element rather than just a word.
*   **Motion:** A GSAP scrub animation that slowly fades out (`opacity: 0`) and moves down (`y: 100`) the text as the user starts scrolling, shifting focus to the incoming content.

### 8.3 The Narrative Band (`.narrative-band`)
*   **Purpose:** The transition point. It's the "cover" that slides over the Hero.
*   **Architecture:** This is the beginning of our `.page-shell` container. It has a solid Deep Dark background to hide the sticky Hero behind it.
*   **Composition:** Highly asymmetrical. We use CSS Grid to push the text entirely to the right (`grid-column: 7 / -1` on large screens), leaving a massive block of negative space on the left. This screams "editorial".

### 8.4 The Scrollytelling Scene (`.scrollytelling-scene`)
*   **Purpose:** To make the user *feel* the problem we are solving through interactive discovery.
*   **Architecture:** Like the Hero, this lives *outside* the constrained `.page-shell` to easily achieve full `100vw` width without CSS hacks. We use GSAP `ScrollTrigger` with `pin: true` to lock the section in place while the user scrolls.
*   **Composition & Motion:**
    *   **The Mask:** We start with a small square (`clipPath`) in the center revealing an abstract texture.
    *   **The Dolly Zoom:** As you scroll, the mask expands to `100% 100%`, and the texture scales slightly, creating a cinematic dolly effect.
    *   **The Typography:** Massive text ("WE REVEAL / THE FEELING") slides in from opposite sides (`x: -100` and `x: 100`) to meet in the middle.
*   **The Premium Detail:** The abstract liquid texture is NOT a video. It's a CSS `filter: url(#liquid-filter)` referencing an inline SVG with `<feTurbulence>`. We use GSAP to animate the `baseFrequency` of the turbulence. Result: A stunning liquid effect at 60fps with zero network overhead.

### 8.5 Output & Layer Scenes (`.output-scene`, `.layer-scene`)
*   **Purpose:** Explain the technical features (the "how").
*   **Architecture:** We avoid the typical SaaS "3 white cards with shadows". We stay in Deep Dark Mode.
*   **Composition:** We mix monumental sans-serif typography with small, mono-spaced "code" blocks. We use subtle `1px` borders (`var(--border-light)`) to define areas instead of solid background boxes, maintaining the raw, brutalist feel.

### 8.6 The Friction Loop (`.loop-scene`)
*   **Purpose:** List common problems the product solves.
*   **Architecture:** A rigid but invisible grid.
*   **Composition:** We use CSS Grid (`grid-template-columns: repeat(3, 1fr)`) to create columns. However, there are no borders separating them. Only the raw typography (title in white, description in gray) creates the structure.

### 8.7 Install CTA (`.install-scene`)
*   **Purpose:** The final conversion point.
*   **Architecture:** Brutal simplicity. Centered content, massive margins.
*   **Composition:** A huge headline, a raw terminal command block, and our premium `<Button>`. By removing all visual noise, we force the user's attention onto the button and its liquid/arrow-swap micro-interactions.