"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react"

import WebProject from "@/app/components/WebProject";
import MobileProject from "@/app/components/MobileProject";
import Divider from "@/app/components/Divider";
import DevArea from "@/app/components/DevArea";


import WebIcon from "@/app/assets/tecsweb.svg"
import MobileIcon from "@/app/assets/tecsmobile.svg"
import TsIcon from "@/app/assets/typescripticon.svg"
import ReactIcon from "@/app/assets/reacticon.svg"
import SwiftIcon from "@/app/assets/swifticon.svg"
import FbIcon from "@/app/assets/firebaseicon.svg"
import JsIcon from "@/app/assets/jsicon.svg"

const WhatIdo = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const title = titleRef.current;

    if (title) {
        const observer = new IntersectionObserver(
            ([entry]) => {
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
                      clipPath: "inset(0 0 0% 0)" 
                    }
                  );
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(title);
    }
  }, []);
  return (
    <div className="whatido-bg w-full h-full flex justify-start items-start gap-5 md:gap-24 flex-col px-10 md:px-1">
      <div className="mt-10 md:ml-20 md:mt-20">
        {/* Title */}
        <h1 ref={titleRef} className="text-6xl md:text-7xl font-bold text-white mb-10 md:mb-16 py-2">
          [01] ¿Qué hago?
        </h1>
        <Divider />
        {/* Content */}
        <div className="flex gap-10 flex-col md:gap-20 mt-6 md:mt-10">
          { /* Web Development */}
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
            {/* Web Projects */}
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
          { /* Mobile Development */}
          <DevArea
            title="Desarrollo móvl"
            description="Creo aplicaciones móviles modernas, funcionales y adaptadas a las necesidades de los usuarios, especializado en frontend. 
            Con un enfoque en la experiencia del usuario y la eficiencia, utilizo tecnologías avanzadas para desarrollar soluciones innovadoras que 
            funcionen tanto en plataformas iOS como Android. Cada proyecto móvil está diseñado para ofrecer un rendimiento óptimo y una interfaz intuitiva, 
            asegurando que las aplicaciones no solo cumplan con su propósito, sino que también superen las expectativas."
            tecIcon={MobileIcon}
            tecIconAlt="MobileDev"
            tecIconWidth="w-4/5 md:w-1/6"
          >
            { /* Mobile Projects */}
            <div className="flex flex-col gap-10 md:gap-20 items-center mt-8 md:mt-0">
              <MobileProject 
                  title="Fashion Finder" 
                  description="Fashion Finder es una app de moda, realizada con SwiftUI y tecnologías como CoreML y Firebase que 
                  permite a los usuarios tener un closet virtual y recibir recomendaciones de moda en base a este closet,
                  sus emociones detectadas y el clima de su ubicación actual. Además, permite compartir outfits con otros usuarios, ¡Incluso
                  recibir descuentos en tiendas de moda!" 
                  videoSrc="/videos/FFVideo.webm"
                  icons={[SwiftIcon, FbIcon]}
              />
              <MobileProject 
                  title="Habitus" 
                  description="Habitus es una app hecha en React Native junto a tecnologías como Firebase que permite 
                  a los usuarios llevar un registro de sus hábitos diarios y recibir notificaciones, así como
                  visualizar estadísticas de su progreso." 
                  videoSrc="/videos/HabitusVideo.webm"
                  icons={[JsIcon, ReactIcon]}
                  videoOnLeft={true}
              />
            </div>
          </DevArea>
        </div>
      </div>
    </div>
  );
};

export default WhatIdo;
