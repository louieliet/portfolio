"use client"; // Asegúrate de usar este modo ya que es un hook en el cliente

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Selecciona todas las secciones para crear el efecto
    const sections = gsap.utils.toArray<HTMLElement>(".section");

    sections.forEach((section, index) => {
      if (index < sections.length - 1) {
        const nextSection = sections[index + 1];

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top", // Cuando la sección superior toca el top del viewport
            end: "bottom top", // Finaliza cuando el bottom de la sección toca el top del viewport
            pin: true, // Mantiene la sección actual fija
            scrub: 1.5, // Hace el scroll más fluido
            snap: {
              snapTo: "labels", // Salta a etiquetas o posiciones clave
              duration: 0.5, // Tiempo que toma el snap
              ease: "power1.inOut", // Easing elegante para el snap
            },
          },
        })
        .fromTo(
          nextSection,
          { y: "100%" }, // Comienza desde abajo
          { y: "0%", ease: "power4.out" } // Llega a su posición
        );
      }
    });
  }, []);

  return <div>{children}</div>;
}