"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section");

    sections.forEach((section, index) => {
      const content = section.querySelector('.introduction-content'); 
      if (index < sections.length - 1) {
        const nextSection = sections[index + 1];

        // Opcional: Asegurarse de que nextSection comience fuera de la vista si es necesario
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

        tl
          .fromTo(
            nextSection,
            { y: "100%" },
            { y: "0%", ease: "power4.out" }
          )
          // Agregar desvanecimiento al contenido de la sección actual
          .to(
            content,
            { opacity: 0, ease: "power1.out" },
            "<" // Sincroniza este paso con el anterior
          );
      }
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <div suppressHydrationWarning>{children}</div>;
}