'use client'
import React from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const HeaderNav = () => {
    const handleScroll = (sectionId: string) => {
        const section = document.getElementById(sectionId)
        if (section) {
            gsap.to(window, {
                scrollTo: section,
                duration: 2,
                ease: 'power4.out',
            })
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
            id="header-nav"
            className="
                absolute top-0 left-0 w-full 
                bg-transparent text-custom-Brown 
                flex justify-center gap-6 p-4 
                z-40 font-bold
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
