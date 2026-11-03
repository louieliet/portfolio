import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { animationConfig } from "@/lib/animation-config";
import { setLenisInstance } from "@/lib/lenis-store";

export function useLenis() {
  useEffect(() => {
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

    // Preloader hold: `html.is-loading` is set before this island hydrates.
    // Stop Lenis so wheel/touch can't move the page behind the curtain, then
    // start on `app:ready` (fired by preloader.astro, or immediately when the
    // preloader is skipped).
    const onReady = () => lenis.start();
    if (document.documentElement.classList.contains("is-loading")) {
      lenis.stop();
      window.addEventListener("app:ready", onReady, { once: true });
    }

    // Sync ScrollTrigger on every Lenis scroll event so pinned elements
    // track the virtual scroll position, not the native scrollTop.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis via the GSAP ticker instead of a raw RAF loop.
    // This keeps both engines in the same frame, eliminating jitter on
    // pinned elements. lagSmoothing(0) stops GSAP from "catching up"
    // after the tab loses focus, which would cause a jarring jump.
    gsap.ticker.lagSmoothing(0);
    const tickerFn = (time: number) => {
      lenis.raf(time * 1000); // GSAP time is seconds; Lenis expects ms
    };
    gsap.ticker.add(tickerFn);

    return () => {
      window.removeEventListener("app:ready", onReady);
      gsap.ticker.remove(tickerFn);
      lenis.off("scroll", ScrollTrigger.update);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, []);
}
