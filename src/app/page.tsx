"use client";
import dynamic from "next/dynamic";

// Carga dinámica del componente ScrollAnimation
const ScrollAnimation = dynamic(() => import("@/app/components/ScrollAnimation"), { ssr: false });
import Introduction from "./pages/Introduction";
import AboutMe from "./pages/AboutMe";

export default function Home() {
  return (
    <ScrollAnimation>
      <div className="w-full">
        {/* Sección de Introduction */}
        <section className="section introduction-section w-full min-h-screen">
          <Introduction />
        </section>

        {/* Sección de AboutMe */}
        <section className="section aboutme-section w-full min-h-screen">
          <AboutMe />
        </section>
      </div>
    </ScrollAnimation>
  );
}