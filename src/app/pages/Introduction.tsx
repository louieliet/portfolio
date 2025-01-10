'use client'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'
import { useEffect } from 'react'
import gsap from 'gsap'
import HeaderNav from "@/app/components/HeaderNav"

const Introduction = () => {
    useEffect(() => {
        const elements = document.querySelectorAll('.intro-content')
        elements.forEach((element, index) => {
            gsap.fromTo(
                element,
                { y: 200, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 2,
                    ease: 'power4.out',
                    delay: index * 0.3,
                }
            )
        })
    }, [])

    return (
        <div className="intro-bg w-full h-full flex justify-center items-center gap-5 md:gap-24 md:flex-row flex-col px-10 md:px-1">
            <HeaderNav />
            {/* Profile picture */}
            <div className="intro-content relative w-[300px] h-[300px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden shadow-2xl md:-mt-0 -mt-20">
                <Image
                    src="/pp.png"
                    priority
                    alt="Profile picture"
                    className="object-cover object-center w-full h-full"
                    width={500}
                    height={500}
                />
            </div>

            {/* Text */}
            <div className="intro-content text-center md:text-left md:w-[600px] w-full">
                <h1 className="text-2xl md:text-4xl lg:text-6xl py-5 lg:py-10">
                    <TypeAnimation
                        sequence={[
                            'Hello, I am Emiliano!',
                            2000,
                            'I am a frontend dev.',
                            2000,
                            'I am a Unity dev.',
                            2000,
                            'I am an mobile dev.',
                            2000,
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                        className="font-extrabold text-custom-Brown"
                    />
                </h1>

                <p className="text-sm md:text-base lg:text-xl text-custom-Brown font-semibold">
                    ¡Hola! Soy estudiante de Ingeniería en Animación y
                    Videojuegos en la Universidad Panamericana. Me gusta mucho
                    la programación y el diseño. Me caracterizo por ser una
                    persona con ganas de aprender, organizada, con capacidad de
                    trabajar en equipo y bajo presión. Mi objetivo es formar
                    parte de una empresa competitiva, en la cual pueda
                    desarrollarme como programador y/o diseñador con experiencia
                    sólida.
                </p>
                <p className="text-sm md:text-base lg:text-xl text-custom-Brown font-semibold mt-5 md:mt-10">
                    ¿Quieres saber más de mí? ¡Sigue bajando! 👇
                </p>
            </div>
        </div>
    )
}

export default Introduction
