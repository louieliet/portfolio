"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section");

    sections.forEach((section, index) => {
      const content = section.querySelector(".sec-to-disolve");
      if (index < sections.length - 1) {
        const nextSection = sections[index + 1];

        // Ajustar la siguiente sección
        gsap.set(nextSection, { y: "100%" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            pin: true,
            scrub: 1.5,
            snap: {
              snapTo: "labels",
              duration: 0.5,
              ease: "power1.inOut",
            },
          },
        });

        tl.fromTo(
          nextSection,
          { y: "100%" },
          { y: "0%", ease: "power4.out" }
        )
          .to(
            content,
            { opacity: 0, ease: "power1.out" },
            "<"
          )
          // Asegurarte de que la sección actual quede completamente invisible
          .set(content, { display: "none" }, ">"); // Oculta la sección actual después de que desaparezca
      }
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <div suppressHydrationWarning>{children}</div>;
}