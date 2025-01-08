"use client";
import { useEffect } from "react";
import Introduction from "./Introduction";
import AboutMe from "./AboutMe";
import Experience from "./Experience";
import Activities from "./Activities";
import Contact from "./Contact";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <div>
        <Introduction />
        <AboutMe />
        <Experience />
        <Activities />
        <Contact />
      </div>
  );
}