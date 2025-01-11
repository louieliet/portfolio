'use client'
import React, { useState, useRef, useEffect } from 'react'
import { gsap, Power4 } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import CloseMenu from '@/app/assets/CloseMenuIcon.svg'
import MenuIcon from '@/app/assets/MenuIcon.svg'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

const SideMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    const menuBtnRef = useRef<HTMLAnchorElement>(null)
    const menuBtnTxtRef = useRef<HTMLSpanElement>(null)
    

    // Animación para mostrar/ocultar el menú lateral y la superposición
    useEffect(() => {
        const buttonMenu = menuBtnRef.current
        const textMenu = menuBtnTxtRef.current


        if (menuRef.current && overlayRef.current) {
            if (isMenuOpen) {
                // Animar entrada del menú
                gsap.to(menuRef.current, {
                    x: 0,
                    duration: 1,
                    ease: 'power4.out',
                })
                // Animar aparición de la superposición
                gsap.to(overlayRef.current, {
                    opacity: 0.8,
                    duration: 0.5,
                    ease: 'power4.out',
                    display: 'block',
                })
            } else {
                // Animar salida del menú
                gsap.to(menuRef.current, {
                    x: '100%',
                    duration: 0.5,
                    ease: 'power4.in',
                })
                // Animar desaparición de la superposición
                gsap.to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power4.in',
                    onComplete: () => {
                        if (overlayRef.current) {
                            overlayRef.current.style.display = 'none'
                        }
                    },
                })
            }
        }

        if (buttonMenu && textMenu) {
            gsap.set(buttonMenu, { position: 'relative', overflow: 'hidden' })
            const hoverEffect = document.createElement('div')
            hoverEffect.style.position = 'absolute'
            hoverEffect.style.top = '100%'
            hoverEffect.style.left = '0'
            hoverEffect.style.width = '100%'
            hoverEffect.style.height = '100%'
            hoverEffect.style.backgroundColor = '#635c55'
            buttonMenu.appendChild(hoverEffect)

            buttonMenu.addEventListener('mouseenter', () => {
                gsap.to(hoverEffect, {
                    top: '0',
                    duration: 0.3,
                    ease: Power4.easeOut,
                })
                gsap.to(textMenu, {
                    color: '#ffffff',
                    duration: 0.3,
                    ease: Power4.easeOut,
                })
            })

            buttonMenu.addEventListener('mouseleave', () => {
                gsap.to(hoverEffect, {
                    top: '100%',
                    duration: 0.3,
                    ease: Power4.easeOut,
                })
                gsap.to(textMenu, {
                    color: '#635c55',
                    duration: 0.3,
                    ease: Power4.easeOut,
                })
            })
        }

    }, [isMenuOpen])

    const handleScroll = (sectionId: string) => {
        const section = document.getElementById(sectionId)
        if (section) {
            gsap.to(window, {
                scrollTo: section,
                duration: 1,
                ease: 'power4.out',
            })
            setIsMenuOpen(false) // Cierra el menú después de hacer scroll
        }
    }

    const handleMouseEnter = (id: string) => {
        const button = document.getElementById(`btnMenu-${id}`)
        if (button) {
            gsap.to(button, {
                scale: 1.2,
                duration: 0.2,
                ease: 'power3.out',
            })
        }
    }

    const handleMouseLeave = (id: string) => {
        const button = document.getElementById(`btnMenu-${id}`)
        if (button) {
            gsap.to(button, {
                scale: 1,
                duration: 0.2,
                ease: 'power3.out',
            })
        }
    }

    return (
        <>
            {/* Botón Hamburguesa */}
            <button
                id="sideMenuButton"
                ref={buttonRef} // Referencia para animar el botón
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`bg-[#a5998b] fixed top-8 right-4 z-50 py-3 px-4 text-white rounded-full ${isMenuOpen ? '' : 'shadow-md'} transform opacity-0 scale-0`}
            >
                {isMenuOpen ? (
                    <Image
                        src={CloseMenu}
                        alt="Cerrar menú"
                        width={24}
                        height={24}
                    />
                ) : (
                    <Image
                        src={MenuIcon}
                        alt="Abrir menú"
                        width={24}
                        height={24}
                    />
                )}
            </button>

            {/* Menú lateral */}
            <div
                ref={menuRef} // Referencia para animar el menú lateral
                className="bg-[#a5998b] fixed top-0 right-0 w-full md:w-1/2 h-full text-white z-40 transform translate-x-full scale-10"
            >
                <div className="flex flex-col items-start justify-center p-6 h-full ml-2 md:ml-8 md:w-full">
                    <button
                        id="btnMenu-whatido"
                        onClick={() => handleScroll('whatido')}
                        onMouseEnter={() => handleMouseEnter('whatido')}
                        onMouseLeave={() => handleMouseLeave('whatido')}
                        className="mb-4 font-bold text-6xl text-[#fffdfa]"
                    >
                        ¿Qué hago?
                    </button>
                    <button
                        id="btnMenu-experience"
                        onClick={() => handleScroll('experience')}
                        onMouseEnter={() => handleMouseEnter('experience')}
                        onMouseLeave={() => handleMouseLeave('experience')}
                        className="mb-4 font-bold text-6xl text-[#fffdfa]"
                    >
                        Experiencia
                    </button>
                    <button
                        id="btnMenu-activities"
                        onClick={() => handleScroll('activities')}
                        onMouseEnter={() => handleMouseEnter('activities')}
                        onMouseLeave={() => handleMouseLeave('activities')}
                        className="mb-4 font-bold text-6xl text-[#fffdfa]"
                    >
                        Actividades
                    </button>
                    <button
                        id="btnMenu-contact"
                        onClick={() => handleScroll('contact')}
                        onMouseEnter={() => handleMouseEnter('contact')}
                        onMouseLeave={() => handleMouseLeave('contact')}
                        className="mb-4 font-bold text-6xl text-[#fffdfa]"
                    >
                        Contacto
                    </button>
                    <div className="flex flex-col mt-10">
                        <h2 className="text-xl font-bold text-custom-Brown">
                            Correo Electrónico
                        </h2>
                        <a
                            href="mailto:emilianomg2003@hotmail.com"
                            className="text-[#fffdfa] font-medium hover:underline"
                        >
                            emilianomg2003@hotmail.com
                        </a>
                    </div>
                    <div className="flex flex-row gap-5 mt-10">
                        <a
                            href="https://www.linkedin.com/in/emiliano-mg/"
                            target="_blank"
                            rel="noopener noreferrer"
                            ref={menuBtnRef}
                            className="relative inline-block px-6 py-2 text-custom-Brown bg-[#fffdfa] rounded-full overflow-hidden"
                        >
                            <span ref={menuBtnTxtRef} className="relative z-10">
                                LinkedIn
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Superposición oscura */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black opacity-0 z-30"
                onClick={() => setIsMenuOpen(false)}
                style={{ display: 'none' }}
            ></div>
        </>
    )
}

export default SideMenu
