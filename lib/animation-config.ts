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
      duration: 0.8,
      ease: "power3.out",
      y: 30,
    },

    // Stagger animations
    stagger: {
      duration: 0.8,
      ease: "power3.out",
      y: 40,
      delay: 0.1, // delay between each item
    },

    // Parallax settings
    parallax: {
      speed: 0.5, // 0.5 = half speed, 1 = no parallax, 2 = double speed
      scrub: 0.5,
    },

    // Line drawing animations
    line: {
      duration: 1.2,
      ease: "power2.out",
    },

    // Scroll trigger positions
    scrollTrigger: {
      fadeInStart: "top 85%",
      fadeInEnd: "top 60%",
      staggerStart: "top 90%",
    },
  },

  // Hover transitions (CSS-based)
  hover: {
    duration: 200, // in milliseconds
    scale: 1.02,
  },
};
