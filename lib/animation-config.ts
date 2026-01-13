/**
 * Animation Configuration
 * Centralized config for all animations in the portfolio
 */

export const animationConfig = {
  // Lenis smooth scroll settings
  smoothScroll: {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    touchMultiplier: 2,
  },

  // GSAP animation settings
  gsap: {
    // Fade-in animations
    fadeIn: {
      duration: 1.2,
      ease: "power2.out",
      y: 40,
    },

    // Stagger animations
    stagger: {
      duration: 1.0,
      ease: "power2.out",
      y: 60,
      delay: 0.15, // delay between each item
    },

    // Parallax settings
    parallax: {
      speed: 0.5, // 0.5 = half speed, 1 = no parallax, 2 = double speed
      scrub: 0, // No scrub for discrete transitions, or use small value for smoothing
    },

    // Line drawing animations
    line: {
      duration: 1.5,
      ease: "power2.out",
    },
    
    // Timeline drawing animation
    timeline: {
      duration: 1.5,
      ease: "none",
    },

    // Scroll trigger positions
    scrollTrigger: {
      fadeInStart: "top 80%",
      fadeInEnd: "top 60%",
      staggerStart: "top 85%",
    },
  },

  // Hover transitions (CSS-based)
  hover: {
    duration: 300, // in milliseconds
    scale: 1.02,
  },
};
