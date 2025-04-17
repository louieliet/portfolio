'use client'
import React, { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const HeaderNav = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null)

    useEffect(() => {
        const elements = document.querySelectorAll('.header-btn')
        elements.forEach((element, index) => {
            gsap.fromTo(
                element,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power4.out',
                    delay: index * 0.15,
                }
            )
        })
    }, [])

    const handleScroll = (sectionId: string) => {
        setActiveSection(sectionId)
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
                y: -5,
                duration: 0.3,
                ease: 'power2.out',
            })
        }
    }

    const handleMouseLeave = (id: string) => {
        const button = document.getElementById(`btn-${id}`)
        if (button) {
            gsap.to(button, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
            })
        }
    }

    return (
        <nav
            id="header-nav"
            className="
                absolute top-5 left-0 w-full 
                bg-transparent
                flex justify-center gap-8 py-8 px-4
                z-40 font-light tracking-wide
                hidden md:flex
            "
        >
            <button
                id="btn-whatido"
                onClick={() => handleScroll('whatido')}
                onMouseEnter={() => handleMouseEnter('whatido')}
                onMouseLeave={() => handleMouseLeave('whatido')}
                className={`header-btn text-sm uppercase hover:text-white transition-colors duration-300 px-1 py-1 ${
                    activeSection === 'whatido' ? 'text-white border-b border-white' : 'text-white/70'
                }`}
            >
                My work
            </button>
            <button
                id="btn-experience"
                onClick={() => handleScroll('experience')}
                onMouseEnter={() => handleMouseEnter('experience')}
                onMouseLeave={() => handleMouseLeave('experience')}
                className={`header-btn text-sm uppercase hover:text-white transition-colors duration-300 px-1 py-1 ${
                    activeSection === 'experience' ? 'text-white border-b border-white' : 'text-white/70'
                }`}
            >
                Experience
            </button>
            <button
                id="btn-activities"
                onClick={() => handleScroll('activities')}
                onMouseEnter={() => handleMouseEnter('activities')}
                onMouseLeave={() => handleMouseLeave('activities')}
                className={`header-btn text-sm uppercase hover:text-white transition-colors duration-300 px-1 py-1 ${
                    activeSection === 'activities' ? 'text-white border-b border-white' : 'text-white/70'
                }`}
            >
                Activities
            </button>
            <button
                id="btn-contact"
                onClick={() => handleScroll('contact')}
                onMouseEnter={() => handleMouseEnter('contact')}
                onMouseLeave={() => handleMouseLeave('contact')}
                className={`header-btn text-sm uppercase hover:text-white transition-colors duration-300 px-1 py-1 ${
                    activeSection === 'contact' ? 'text-white border-b border-white' : 'text-white/70'
                }`}
            >
                Contact
            </button>
        </nav>
    )
}

export default HeaderNav
