"use client";
import gsap from "gsap";
import { useEffect } from "react"

import WebProject from "@/app/components/WebProject";
import Divider from "@/app/components/Divider";
import DevArea from "@/app/components/DevArea";


import WebIcon from "@/app/assets/tecsweb.svg"
import MobileIcon from "@/app/assets/tecsmobile.svg"
import GameIcon from "@/app/assets/tecsgame.svg"
import TsIcon from "@/app/assets/typescripticon.svg"
import ReactIcon from "@/app/assets/reacticon.svg"

const WhatIdo = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".whatido-title");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { y: 200, 
                opacity: 0,
                clipPath: "inset(0 0 100% 0)" 
              },
              {
                y: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power4.out",
                delay: Array.from(elements).indexOf(entry.target) * 0.3,
                clipPath: "inset(0 0 0% 0)" 
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div className="whatido-bg w-full h-full flex justify-start items-start gap-5 md:gap-24 flex-col px-10 md:px-1">
      <div className="mt-10 md:ml-20 md:mt-20">
        {/* Title */}
        <h1 className="whatido-title text-6xl md:text-7xl font-bold text-white mb-10 md:mb-16 py-2">
          [01] ¿Qué hago?
        </h1>
        <Divider />
        {/* Content */}
        <div className="flex gap-10 flex-col md:gap-20 mt-6 md:mt-10">
          <DevArea
            title="Desarrollo web"
            description="Construyo experiencias digitales intuitivas y eficientes que combinan creatividad y funcionalidad. 
            Como desarrollador web, me especializo principalmente en frontend para crear sitios modernos y aplicaciones 
            robustas utilizando tecnologías de vanguardia. Cada línea de código está orientada a resolver problemas, 
            mejorar la experiencia del usuario y lograr resultados óptimos."
            tecIcon={WebIcon}
            tecIconAlt="WebDev"
            tecIconWidth="w-full md:w-1/3"
          >
            <div className="flex flex-col gap-10 md:gap-20 items-center">
              <WebProject title="Página de Hus" 
                description="Página de Hus, realizada con NextJS y Tailwind CSS" 
                iframeSrc="https://hus-demo.vercel.app/"
                icons={[TsIcon, ReactIcon]}
                />
              <WebProject title="Página de Ragabe" 
                description="Página de Ragabe, realizada con NextJS y Tailwind CSS" 
                iframeSrc="https://dev.ragabe.git.chainsol.io/"
                icons={[TsIcon, ReactIcon]}
                frameOnLeft={true}
                />
            </div>
          </DevArea>

          <Divider />
          <DevArea
            title="Desarrollo móvl"
            description="Creo aplicaciones móviles modernas, funcionales y adaptadas a las necesidades de los usuarios, especializado en frontend. 
            Con un enfoque en la experiencia del usuario y la eficiencia, utilizo tecnologías avanzadas para desarrollar soluciones innovadoras que 
            funcionen tanto en plataformas iOS como Android. Cada proyecto móvil está diseñado para ofrecer un rendimiento óptimo y una interfaz intuitiva, 
            asegurando que las aplicaciones no solo cumplan con su propósito, sino que también superen las expectativas."
            tecIcon={MobileIcon}
            tecIconAlt="MobileDev"
            tecIconWidth="w-4/5 md:w-1/6"
          />
          <Divider />
          <DevArea
            title="Desarrollo de videojuegos"
            description="Doy vida a ideas creativas mediante el desarrollo de videojuegos inmersivos y dinámicos. Mi enfoque combina narrativa, diseño visual y 
              mecánicas innovadoras para ofrecer experiencias interactivas y atractivas. 
              Utilizando motores y tecnologías de última generación, me especializo en crear juegos optimizados para múltiples plataformas, 
              asegurando un equilibrio perfecto entre rendimiento, jugabilidad y gráficos. Cada proyecto está diseñado con atención al detalle para 
              proporcionar entretenimiento memorable y de alta calidad."
            tecIcon={GameIcon}
            tecIconAlt="GameDev"
            tecIconWidth="w-1/6 md:w-16"
          />
        </div>
      </div>
    </div>
  );
};

export default WhatIdo;
