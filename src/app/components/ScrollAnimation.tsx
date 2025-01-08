"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".section");

    sections.forEach((section, index) => {
      if (index < sections.length - 1) {
        const nextSection = sections[index + 1];


        gsap.timeline({
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
        })
        .fromTo(
          nextSection,
          { y: "100%" }, // Inicio: parte inferior fuera de vista
          { y: "0%", ease: "power4.out" } // Fin: posicionamiento normal
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