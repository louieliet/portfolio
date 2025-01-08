"use client";

import { TypeAnimation } from "react-type-animation";
import ProfileImage from "@/app/components/ProfileImage";

const IntroductionText = () => (
  <div className="text-center md:text-left md:w-[800px] w-full px-10 md:px-0 lg:px-0" >
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
      Universidad Panamericana. Me gusta mucho la programación y el diseño. Me
      caracterizo por ser una persona con ganas de aprender, organizada, con
      capacidad de trabajar en equipo y bajo presión. Mi objetivo es formar
      parte de una empresa competitiva, en la cual pueda desarrollarme como
      programador y/o diseñador con experiencia sólida.
    </p>
    <p className="text-sm md:text-base lg:text-xl text-custom-Brown font-semibold mt-5 md:mt-10">
      ¿Quieres saber más de mí? ¡Sigue bajando! 👇
    </p>
  </div>
);

const Introduction = () => {
  return (
    <div
      id="intro"
      className="introduction-section intro-bg flex flex-col md:flex-row items-center justify-center min-h-screen w-full"
    >
      <div className="introduction-content flex flex-col md:flex-row items-center justify-center gap-10">
        <ProfileImage />
        <IntroductionText />
      </div>
    </div>
  );
};

export default Introduction;