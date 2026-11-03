import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationConfig } from "@/lib/animation-config";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// All animations are wrapped in gsap.context() so ctx.revert() in the
// cleanup function kills every tween and ScrollTrigger created here —
// preventing memory leaks on navigation (Astro View Transitions) and
// React StrictMode double-mount.
export function useGSAPAnimations() {
  useEffect(() => {
    const { fadeIn, stagger, line } = animationConfig.gsap;
    const { scrollTrigger } = animationConfig.gsap;

    const ctx = gsap.context(() => {
      // ── Fade-in utility class ───────────────────────────
      gsap.utils.toArray<HTMLElement>(".fade-in").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: fadeIn.y },
          {
            opacity: 1,
            y: 0,
            duration: fadeIn.duration,
            ease: fadeIn.ease,
            scrollTrigger: {
              trigger: element,
              start: scrollTrigger.fadeInStart,
              end: scrollTrigger.fadeInEnd,
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Stagger containers ──────────────────────────────
      const staggerContainers =
        document.querySelectorAll(".stagger-container");
      staggerContainers.forEach((container) => {
        const items = container.querySelectorAll(".stagger-item");
        if (items.length === 0) return;

        gsap.set(items, { opacity: 0, y: stagger.y });

        ScrollTrigger.batch(items, {
          start: scrollTrigger.staggerStart,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: stagger.duration,
              stagger: stagger.delay,
              ease: stagger.ease,
              overwrite: true,
            });
          },
        });
      });

      // ── Parallax layers ─────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".parallax-layer").forEach((layer) => {
        const speed = parseFloat(layer.getAttribute("data-speed") || "0.5");
        gsap.to(layer, {
          y: () => ScrollTrigger.maxScroll(window) * speed * 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0,
            invalidateOnRefresh: true,
          },
        });
      });

      // ── Line-draw animations ────────────────────────────
      // Uses scaleX instead of width — compositor-only, no layout recalc.
      gsap.utils.toArray<HTMLElement>(".animate-line").forEach((lineEl) => {
        gsap.fromTo(
          lineEl,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: line.duration,
            ease: line.ease,
            scrollTrigger: {
              trigger: lineEl,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // ── Experience timeline line ────────────────────────
      // Uses scaleY + transform-origin: top instead of height — avoids
      // layout thrashing on every scroll tick.
      const timelineLine = document.querySelector<HTMLElement>(".timeline-line");
      if (timelineLine) {
        gsap.fromTo(
          timelineLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "#experience",
              start: "top center",
              end: "bottom center",
              scrub: true,
            },
          }
        );
      }
    });

    // This island hydrates before the Astro <script>s that pin CODE BEAUTY run
    // on `load`, so triggers created here would refresh first and miss that
    // pin's spacer. Re-sort by position and refresh once everything exists:
    // after load, and again when the preloader releases the page.
    const resync = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const timers = [window.setTimeout(resync, 100)];
    const onLoad = () => timers.push(window.setTimeout(resync, 50));
    window.addEventListener("load", onLoad);
    window.addEventListener("app:ready", onLoad);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", onLoad);
      window.removeEventListener("app:ready", onLoad);
      ctx.revert();
    };
  }, []);
}
