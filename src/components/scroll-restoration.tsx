import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenisInstance } from "@/lib/lenis-store";
import {
  clearHomeReturnScrollPosition,
  getHomeReturnScrollPosition,
  saveScrollPosition,
} from "@/lib/scroll-position-store";

export default function ScrollRestoration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const pathname = window.location.pathname;
    const homeReturnY =
      pathname === "/" ? getHomeReturnScrollPosition() : null;
    const targetY = homeReturnY ?? 0;
    const isRestoringHomeReturn = homeReturnY !== null;
    let hasRestored = false;
    let scrollSaveRafId = 0;

    const getCurrentScroll = () => {
      const lenis = getLenisInstance();
      return lenis ? lenis.scroll : window.scrollY;
    };

    const saveCurrentScrollPosition = () => {
      saveScrollPosition(pathname, getCurrentScroll());
    };

    const persistScrollAfterUserScroll = () => {
      if (isRestoringHomeReturn && !hasRestored) return;
      window.cancelAnimationFrame(scrollSaveRafId);
      scrollSaveRafId = window.requestAnimationFrame(saveCurrentScrollPosition);
    };

    const scrollToTarget = () => {
      const lenis = getLenisInstance();
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(targetY, { immediate: true, force: true });
        return;
      }
      window.scrollTo(0, targetY);
    };

    const restoreScroll = (attempt: number) => {
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const layoutCanReachTarget = targetY <= maxScroll + 2;

      if (!layoutCanReachTarget && attempt < 30) {
        requestAnimationFrame(() => restoreScroll(attempt + 1));
        return;
      }

      scrollToTarget();
      saveScrollPosition(pathname, targetY);

      if (isRestoringHomeReturn) {
        clearHomeReturnScrollPosition();
      }

      hasRestored = true;

      requestAnimationFrame(() => {
        scrollToTarget();
        saveScrollPosition(pathname, targetY);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };

    requestAnimationFrame(() => restoreScroll(0));

    window.addEventListener("scroll", persistScrollAfterUserScroll, {
      passive: true,
    });
    window.addEventListener("pagehide", saveCurrentScrollPosition);

    return () => {
      window.removeEventListener("scroll", persistScrollAfterUserScroll);
      window.removeEventListener("pagehide", saveCurrentScrollPosition);
      window.cancelAnimationFrame(scrollSaveRafId);
      saveCurrentScrollPosition();
    };
  }, []); // Sin dependencias: en Astro cada página es una carga nueva

  return null;
}
