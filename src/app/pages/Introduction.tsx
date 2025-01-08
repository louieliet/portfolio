"use client";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import Header from "@/app/components/Header";

const Introduction = () => {
  return (
    <div>
      <div className="hidden md:block -mb-12">
        <Header textcolor="white" />
      </div>
      <div
        id="intro"
        className="introduction-section intro-bg flex flex-col md:flex-row items-center justify-center gap-10 min-h-screen p-10"
        style={{ height: "100vh" }}
      >
        {/* Imagen circular y responsiva */}
        <div className="relative w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden shadow-lg">
          <Image
            src="/pp.png"
            alt="Profile picture"
            className="object-cover object-center w-full h-full pointer-events-none"
            width={900}
            height={900}
          />
        </div>

        {/* Texto con buena responsividad */}
        <div className="text-center md:text-left md:w-[600px] w-full">
          <h1 className="text-3xl md:text-4xl lg:text-6xl py-5 lg:py-10">
            <TypeAnimation
              sequence={[
                "Hello, I am Emiliano.",
                2000,
                "I am a frontend developer.",
                2000,
                "I am a Unity developer.",
                2000,
                "I am an iOS developer.",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="font-extrabold text-custom-Brown"
            />
          </h1>

          <p className="text-sm md:text-base lg:text-xl text-custom-Brown font-semibold">
            ¡Hola! Soy estudiante de Ingeniería en Animación y Videojuegos en la
            Universidad Panamericana. Me gusta mucho la programación y el
            diseño. Me caracterizo por ser una persona con ganas de aprender,
            organizada, con capacidad de trabajar en equipo y bajo presión. Mi
            objetivo es formar parte de una empresa competitiva, en la cual
            pueda desarrollarme como programador y/o diseñador con experiencia
            sólida.
          </p>
          <p className="text-sm md:text-base lg:text-xl text-custom-Brown font-semibold mt-5 md:mt-10">
            ¿Quieres saber más de mí? ¡Sigue bajando! 👇
          </p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
