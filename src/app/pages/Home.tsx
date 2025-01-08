"use client";

import { useEffect } from "react";
import ScrollAnimation from "@/app/components/ScrollAnimation";
import Introduction from "@/app/pages/Introduction";
import AboutMe from "@/app/pages/AboutMe";

export default function Home() {
  // Al montar el componente, desplazarse hasta la parte superior de la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ScrollAnimation>
      <div className="w-full">
        <section className="section introduction-section w-full">
          <Introduction />
        </section>
        <section className="section aboutme-section w-full">
          <AboutMe />
        </section>
      </div>
    </ScrollAnimation>
  );
}