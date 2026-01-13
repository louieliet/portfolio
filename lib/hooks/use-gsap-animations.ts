"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationConfig } from "@/lib/animation-config";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGSAPAnimations() {
  const animationsInitialized = useRef(false);

  useEffect(() => {
    if (animationsInitialized.current) return;
    animationsInitialized.current = true;

    const { fadeIn, stagger, parallax, line, scrollTrigger } = animationConfig.gsap;

    // Fade in sections
    gsap.utils.toArray<HTMLElement>(".fade-in").forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: fadeIn.y,
        },
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

    // Stagger animations for cards
    gsap.utils.toArray<HTMLElement>(".stagger-item").forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: stagger.y,
        },
        {
          opacity: 1,
          y: 0,
          duration: stagger.duration,
          delay: index * stagger.delay,
          ease: stagger.ease,
          scrollTrigger: {
            trigger: element,
            start: scrollTrigger.staggerStart,
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Parallax effect on hero
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      gsap.to(heroTitle, {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: heroTitle,
          start: "top top",
          end: "bottom top",
          scrub: parallax.scrub,
        },
      });
    }

    // Animate divider lines
    gsap.utils.toArray<HTMLElement>(".animate-line").forEach((lineElement) => {
      gsap.fromTo(
        lineElement,
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: line.duration,
          ease: line.ease,
          scrollTrigger: {
            trigger: lineElement,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}
