import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationConfig } from "@/lib/animation-config";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGSAPAnimations() {
  const animationsInitialized = useRef(false);

  useEffect(() => {
    if (animationsInitialized.current) return;
    animationsInitialized.current = true;

    const { fadeIn, stagger, line, scrollTrigger } = animationConfig.gsap;

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

    const staggerContainers = document.querySelectorAll(".stagger-container");
    staggerContainers.forEach((container) => {
      const items = container.querySelectorAll(".stagger-item");
      if (items.length === 0) return;

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

      gsap.set(items, { opacity: 0, y: stagger.y });
    });

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
        },
      });
    });

    gsap.utils.toArray<HTMLElement>(".animate-line").forEach((lineElement) => {
      gsap.fromTo(
        lineElement,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: line.duration,
          ease: line.ease,
          scrollTrigger: {
            trigger: lineElement,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    const timelineLine = document.querySelector(".timeline-line");
    if (timelineLine) {
      gsap.fromTo(
        timelineLine,
        { height: "0%" },
        {
          height: "100%",
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

    const heroTexts = document.querySelectorAll(".hero-text-reveal");
    if (heroTexts.length > 0) {
      gsap.fromTo(
        heroTexts,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 0);

    return () => {
      window.clearTimeout(refreshId);
      animationsInitialized.current = false;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}
