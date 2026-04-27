"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { animationConfig } from "@/lib/animation-config";
import { setLenisInstance } from "@/lib/lenis-store";

export function useLenis() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: animationConfig.smoothScroll.duration,
      easing: animationConfig.smoothScroll.easing,
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false,
      touchMultiplier: animationConfig.smoothScroll.touchMultiplier,
    });

    setLenisInstance(lenis);

    // Sync Lenis with browser frame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);
}
