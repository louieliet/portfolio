'use client'
import React from 'react'
import gsap from 'gsap'

const HeaderNav = () => {
    const handleScroll = (sectionId: string) => {
        const section = document.getElementById(sectionId)
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleMouseEnter = (id: string) => {
        const button = document.getElementById(`btn-${id}`)
        if (button) {
            gsap.to(button, {
                scale: 1.2,
                duration: 0.2,
                ease: 'power3.out',
            })
        }
    }

    const handleMouseLeave = (id: string) => {
        const button = document.getElementById(`btn-${id}`)
        if (button) {
            gsap.to(button, {
                scale: 1,
                duration: 0.2,
                ease: 'power3.out',
            })
        }
    }

    return (
        <nav
            className="
                absolute top-0 left-0 w-full 
                bg-transparent text-black 
                flex justify-center gap-6 p-4 
                z-40
            "
        >
            <button
                id="btn-whatido"
                onClick={() => handleScroll('whatido')}
                onMouseEnter={() => handleMouseEnter('whatido')}
                onMouseLeave={() => handleMouseLeave('whatido')}
            >
                ¿Qué hago?
            </button>
            <button
                id="btn-experience"
                onClick={() => handleScroll('experience')}
                onMouseEnter={() => handleMouseEnter('experience')}
                onMouseLeave={() => handleMouseLeave('experience')}
            >
                Experiencia
            </button>
            <button
                id="btn-activities"
                onClick={() => handleScroll('activities')}
                onMouseEnter={() => handleMouseEnter('activities')}
                onMouseLeave={() => handleMouseLeave('activities')}
            >
                Actividades
            </button>
            <button
                id="btn-contact"
                onClick={() => handleScroll('contact')}
                onMouseEnter={() => handleMouseEnter('contact')}
                onMouseLeave={() => handleMouseLeave('contact')}
            >
                Contacto
            </button>
        </nav>
    )
}

export default HeaderNav
