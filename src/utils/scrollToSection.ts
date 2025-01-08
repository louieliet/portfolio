import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

interface ScrollOptions {
  offsetY?: number;
  duration?: number;
  ease?: string;
  onBeforeScroll?: () => void;
  onAfterScroll?: () => void;
}

export const scrollToSection = (id: string, options?: ScrollOptions) => {
  const executeScroll = () => {
    const section = document.getElementById(id);

    if (!section) {
      console.error(`No se encontró la sección con id: ${id}`);
      return;
    }

    if (options?.onBeforeScroll) {
      options.onBeforeScroll();
    }

    const offsetY = options?.offsetY ?? 0;
    const sectionTop = section.offsetTop - offsetY;

    gsap.to(window, {
      scrollTo: { y: sectionTop },
      duration: options?.duration ?? 2,
      ease: options?.ease ?? "power3.out",
      onComplete: options?.onAfterScroll,
    });
  };

  if (document.readyState === "complete") {
    executeScroll();
  } else {
    window.addEventListener("load", executeScroll, { once: true });
  }
};
