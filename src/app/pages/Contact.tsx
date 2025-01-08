import Image from "next/image";
import MailIcon from "@/app/assets/mailicon.svg";
import LinkedInIcon from "@/app/assets/linkedinicon.svg";
import { TypeAnimation } from "react-type-animation";

const Contact = () => {
  return (
    <div
      id="contact"
      className="contact-section contact-bg flex flex-col items-center justify-center w-full gap-10 px-5 bg-custom-LightBrown min-h-screen"
    >
      {/* Title */}
      <h1 className="text-4xl md:text-8xl py-5 font-extrabold text-custom-Brown text-center -mb-8">
        ¡Contáctame!
      </h1>

      <p className="text-lg md:text-2xl text-custom-Brown text-center max-w-2xl">
        Estoy disponible para colaborar en proyectos, resolver dudas y/o
        asesoramiento de{" "}
        <TypeAnimation
          sequence={[
            "desarrollo de videojuegos.",
            2000,
            "desarrollo web.",
            2000,
            "deasarollo móvil.",
            2000,
            "diseño UX/UI.",
            2000,
          ]}
          wrapper="span"
          speed={80}
          repeat={Infinity}
          className="text-lg md:text-2xl text-custom-Brown"
        />
      </p>

      {/* Contact Methods */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
        {/* Email Section */}
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Image src={MailIcon} alt="Email Icon" width={80} height={80} />
          <h2 className="text-xl font-bold text-custom-Brown">
            Correo Electrónico
          </h2>
          <p className="text-gray-600">Puedes escribirme a:</p>
          <a
            href="mailto:emilianomg2003@hotmail.com"
            className="text-custom-Brown font-medium hover:underline"
          >
            emilianomg2003@hotmail.com
          </a>
        </div>

        {/* LinkedIn Section */}
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Image
            src={LinkedInIcon}
            alt="LinkedIn Icon"
            width={80}
            height={80}
          />
          <h2 className="text-xl font-bold text-custom-Brown">LinkedIn</h2>
          <p className="text-gray-600">Conecta conmigo en LinkedIn:</p>
          <a
            href="https://www.linkedin.com/in/emiliano-mg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-custom-Brown font-medium hover:underline"
          >
            Link a mi perfil
          </a>
        </div>
      </div>

      {/* Call-to-action */}
      <div className="text-center md:mt-48">
        <p className="text-sm text-gray-700 italic">
          Made by Emiliano Montes with ❤️, Next.js and Tailwind CSS
        </p>
      </div>
    </div>
  );
};

export default Contact;