"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { scrollToSection } from "@/utils/scrollToSection";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface HeaderProps {
  textcolor?: string;
}

const Header: React.FC<HeaderProps> = ({ textcolor = "black" }) => {
  const handleMouseEnter = (id: string) => {
    const button = document.getElementById(`btn-${id}`);
    if (button) {
      gsap.to(button, {
        scale: 1.2,
        duration: 0.2,
        ease: "power3.out",
      });
    }
  };

  const handleMouseLeave = (id: string) => {
    const button = document.getElementById(`btn-${id}`);
    if (button) {
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power3.out",
      });
    }
  };

  const handleScrollToSection = (id: string) => {
    scrollToSection(id, { offsetY: 0, duration: 2 });
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center px-5 md:px-10 py-4 w-full intro-bg">
      {/* Logo */}
      <p style={{ color: textcolor }} className="text-lg md:text-2xl font-bold">
        EMG
      </p>

      {/* Navigation */}
      <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4 md:mt-0">
        <button
          id="btn-aboutme"
          onClick={() => handleScrollToSection("aboutme")}
          onMouseEnter={() => handleMouseEnter("aboutme")}
          onMouseLeave={() => handleMouseLeave("aboutme")}
          style={{ color: textcolor }}
          className="text-sm md:text-base"
        >
          ¿Qué hago?
        </button>
        <hr className="hidden md:block border border-gray-600 h-6" />
        <button
          id="btn-experience"
          onClick={() => handleScrollToSection("experience")}
          onMouseEnter={() => handleMouseEnter("experience")}
          onMouseLeave={() => handleMouseLeave("experience")}
          style={{ color: textcolor }}
          className="text-sm md:text-base"
        >
          Experiencia
        </button>
        <hr className="hidden md:block border border-gray-600 h-6" />
        <button
          id="btn-activities"
          onClick={() => handleScrollToSection("activities")}
          onMouseEnter={() => handleMouseEnter("activities")}
          onMouseLeave={() => handleMouseLeave("activities")}
          style={{ color: textcolor }}
          className="text-sm md:text-base"
        >
          Actividades
        </button>
        <hr className="hidden md:block border border-gray-600 h-6" />
        <button
          id="btn-contact"
          onClick={() => handleScrollToSection("contact")}
          onMouseEnter={() => handleMouseEnter("contact")}
          onMouseLeave={() => handleMouseLeave("contact")}
          style={{ color: textcolor }}
          className="text-sm md:text-base"
        >
          Contacto
        </button>
      </nav>
    </header>
  );
};

export default Header;
