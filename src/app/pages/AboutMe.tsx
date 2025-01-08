"use client";
import Image from "next/image";
import tecsweb from "@/app/assets/tecsweb.svg";
import tecsmobile from "@/app/assets/tecsmobile.svg";

import Divider from "@/app/components/Divider";
import MobileProject from "@/app/components/MobileProject";
import WebProject from "@/app/components/WebProject";
import ReactIcon from "@/app/assets/reacticon.svg";
import GoogleCloudIcon from "@/app/assets/gcicon.svg";
import SwiftIcon from "@/app/assets/swifticon.svg";
import AboutSection from "@/app/components/AboutSection";

const AboutMe = () => {
  return (
    <div
      id="aboutme"
      className="aboutme-section aboutme-bg flex flex-col items-center text-white p-10 md:px-10 lg:px-20"
    >
      <div className="text-start w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold py-5">
          [01] ¿Qué hago?
        </h1>
      </div>

      <Divider />

      <AboutSection title="Desarrollo Web">
        <p className="text-base md:text-lg text-gray-300 leading-relaxed">
          Construyo experiencias digitales intuitivas y eficientes que combinan
          creatividad y funcionalidad. Como desarrollador web, me especializo
          principalmente en{" "}
          <span className="font-bold">frontend</span> para crear sitios modernos
          y aplicaciones robustas utilizando tecnologías de vanguardia.
        </p>
        <div className="py-10">
          <h2 className="text-2xl md:text-3xl font-bold pb-5">
            Tecnologías que uso
          </h2>
          <div className="flex justify-center md:justify-start flex-wrap gap-6">
            <Image
              src={tecsweb}
              alt="Tecnologías web"
              width={300}
              height={300}
              className="w-full px-3 md:w-[40%] pointer-events-none"
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold pb-5">Mi trabajo</h2>
          <div className="flex flex-col gap-10 items-center">
            <WebProject
              src="https://hus-demo.vercel.app/"
              title="Página de Hus"
              projectTitle="Página de Hus"
              description="Realizada con NextJS y Tailwind CSS"
            />
            <WebProject
              src="https://dev.ragabe.git.chainsol.io/"
              title="Página de Ragabe"
              projectTitle="Página de Ragabe"
              description="Realizada con NextJS y Tailwind CSS"
            />
          </div>
        </div>
      </AboutSection>

      <Divider />

      <AboutSection title="Desarrollo Móvil">
        <p className="text-base md:text-lg text-gray-300 leading-relaxed">
          Construyo experiencias digitales intuitivas y eficientes que combinan
          creatividad y funcionalidad. Como desarrollador móvil, me especializo
          principalmente en{" "}
          <span className="font-bold">frontend</span> para crear aplicaciones
          modernas y robustas utilizando tecnologías de vanguardia.
        </p>
        <div className="py-10">
          <h2 className="text-2xl md:text-3xl font-bold pb-5">
            Tecnologías que uso
          </h2>
          <div className="flex justify-center md:justify-start flex-wrap gap-6">
            <Image
              src={tecsmobile}
              alt="Tecnologías móvil"
              width={800}
              height={800}
              className="w-full px-3 md:w-1/4 portrait:"
              priority
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold pb-5">Mi trabajo</h2>
          <div className="flex flex-col gap-10 items-center">
            <MobileProject
              videoSrc="/videos/FFVideo.webm"
              icons={[
                { src: ReactIcon, alt: "React Native" },
                { src: GoogleCloudIcon, alt: "Google Cloud" },
              ]}
              description="Fashion Finder es una app hecha en Swift junto a tecnologías como Firebase
                  para el backend y CoreML para la detección de emociones. La app es un
                  closet virtual que te recomienda outfits dependiendo de tu estado de ánimo,
                  el clima y tus preferencias."
              videoFirst={true}
            />
            <MobileProject
              videoSrc="/videos/HabitusVideo.webm"
              icons={[
                { src: SwiftIcon, alt: "SwiftUI" },
                { src: GoogleCloudIcon, alt: "Google Cloud" },
              ]}
              description="Habitus es una app hecha en Swift junto a tecnologías como Firebase que permite 
                  a los usuarios llevar un registro de sus hábitos diarios y recibir notificaciones, así como
                  visualizar estadísticas de su progreso."
              videoFirst={false}
            />
          </div>
        </div>
      </AboutSection>
    </div>
  );
};

export default AboutMe;
