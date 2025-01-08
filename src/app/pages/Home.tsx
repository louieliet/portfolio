"use client";

import ScrollAnimation from "@/app/components/ScrollAnimation";
import Introduction from "@/app/pages/Introduction";
import AboutMe from "@/app/pages/AboutMe";

export default function Home() {
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