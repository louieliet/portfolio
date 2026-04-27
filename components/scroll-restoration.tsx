"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLenisInstance } from "@/lib/lenis-store";

const STORAGE_KEY = "scroll-positions";

type ScrollPositions = Record<string, number>;

function readPositions(): ScrollPositions {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ScrollPositions) : {};
    } catch {
        return {};
    }
}

function writePositions(positions: ScrollPositions) {
    if (typeof window === "undefined") {
        return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

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

        const positions = readPositions();
        const targetY = typeof positions[pathname] === "number" ? positions[pathname] : 0;

        const restoreScroll = (attempt: number) => {
            const lenis = getLenisInstance();

            if (lenis) {
                lenis.scrollTo(targetY, { immediate: true });
                return;
            }

            if (attempt < 10) {
                requestAnimationFrame(() => restoreScroll(attempt + 1));
                return;
            }

            window.scrollTo(0, targetY);
        };

        restoreScroll(0);

        let rafId = 0;

        const captureScroll = () => {
            const updated = readPositions();
            const lenis = getLenisInstance();
            updated[pathname] = lenis ? lenis.scroll : window.scrollY;
            writePositions(updated);
            rafId = window.requestAnimationFrame(captureScroll);
        };

        rafId = window.requestAnimationFrame(captureScroll);

        return () => {
            window.cancelAnimationFrame(rafId);
        };
    }, [pathname]);

    return null;
}
