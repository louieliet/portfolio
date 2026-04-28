"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { animationConfig } from "@/lib/animation-config";
import { setLenisInstance } from "@/lib/lenis-store";

export function useLenis() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: animationConfig.smoothScroll.duration,
      easing: animationConfig.smoothScroll.easing,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: animationConfig.smoothScroll.touchMultiplier,
    });

    setLenisInstance(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    // Sync Lenis with browser frame
    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", ScrollTrigger.update);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);
}
