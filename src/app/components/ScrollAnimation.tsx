"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return; // Verifica que el código se ejecute solo en el cliente

    const sections = gsap.utils.toArray<HTMLElement>(".section");

    sections.forEach((section, index) => {
      if (index < sections.length - 1) {
        const nextSection = sections[index + 1];

        // Configuración de la animación para cada sección
        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top", // Inicia la animación cuando la sección llega al tope
            end: "bottom top", // Finaliza cuando el fondo de la sección llega al tope
            pin: true, // Fija la sección actual
            scrub: 1.5, // Sincroniza con el scroll
            anticipatePin: 1, // Mejora la transición
          },
        }).fromTo(
          nextSection,
          { y: "100%" }, // Estado inicial de la siguiente sección
          { y: "0%", ease: "power4.out" } // Estado final de la siguiente sección
        );
      }
    });

    ScrollTrigger.refresh(); // Refresca los cálculos de GSAP
  }, []);

  return <div>{children}</div>;
}