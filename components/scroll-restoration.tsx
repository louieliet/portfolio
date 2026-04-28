"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenisInstance } from "@/lib/lenis-store";
import {
    clearHomeReturnScrollPosition,
    getHomeReturnScrollPosition,
    getScrollPosition,
    saveScrollPosition,
} from "@/lib/scroll-position-store";

export default function ScrollRestoration() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const homeReturnY = pathname === "/" ? getHomeReturnScrollPosition() : null;
        const targetY = homeReturnY ?? getScrollPosition(pathname);
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
            if (isRestoringHomeReturn && !hasRestored) {
                return;
            }

            window.cancelAnimationFrame(scrollSaveRafId);
            scrollSaveRafId = window.requestAnimationFrame(saveCurrentScrollPosition);
        };

        const refreshScrollTrigger = () => {
            requestAnimationFrame(() => ScrollTrigger.refresh());
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
                refreshScrollTrigger();
            });
        };

        requestAnimationFrame(() => restoreScroll(0));

        window.addEventListener("scroll", persistScrollAfterUserScroll, { passive: true });
        window.addEventListener("pagehide", saveCurrentScrollPosition);

        return () => {
            window.removeEventListener("scroll", persistScrollAfterUserScroll);
            window.removeEventListener("pagehide", saveCurrentScrollPosition);
            window.cancelAnimationFrame(scrollSaveRafId);
            saveCurrentScrollPosition();
        };
    }, [pathname]);

    return null;
}
