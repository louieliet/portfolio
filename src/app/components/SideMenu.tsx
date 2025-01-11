'use client';
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import CloseMenu from '@/app/assets/CloseMenuIcon.svg';
import MenuIcon from '@/app/assets/MenuIcon.svg';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const SideMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Animación para mostrar/ocultar el menú lateral
    useEffect(() => {
        if (menuRef.current) {
            if (isMenuOpen) {
                // Animar entrada del menú
                gsap.to(menuRef.current, {
                    x: 0,
                    duration: 1,
                    ease: 'power4.out',
                });
            } else {
                // Animar salida del menú
                gsap.to(menuRef.current, {
                    x: '100%',
                    duration: 0.5,
                    ease: 'power4.in',
                });
            }
        }
    }, [isMenuOpen]);

    const handleScroll = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            gsap.to(window, {
                scrollTo: section,
                duration: 1,
                ease: 'power4.out',
            });
            setIsMenuOpen(false); // Cierra el menú después de hacer scroll
        }
    };

    const handleMouseEnter = (id: string) => {
        const button = document.getElementById(`btn-${id}`);
        if (button) {
            gsap.to(button, {
                scale: 1.2,
                duration: 0.2,
                ease: 'power3.out',
            });
        }
    };

    const handleMouseLeave = (id: string) => {
        const button = document.getElementById(`btn-${id}`);
        if (button) {
            gsap.to(button, {
                scale: 1,
                duration: 0.2,
                ease: 'power3.out',
            });
        }
    };

    return (
        <>
            {/* Botón Hamburguesa */}
            <button
                id="sideMenuButton"
                ref={buttonRef} // Referencia para animar el botón
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed top-4 right-4 z-50 p-3 bg-gray-800 text-white rounded-full shadow-lg transform opacity-0"
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
                className="fixed top-0 right-0 w-1/3 h-full bg-gray-800 bg-opacity-90 text-white z-40 transform translate-x-full"
            >
                <div className="flex flex-col items-start justify-center p-6 h-full ml-3">
                    <button
                        id="btn-whatido"
                        onClick={() => handleScroll('whatido')}
                        onMouseEnter={() => handleMouseEnter('whatido')}
                        onMouseLeave={() => handleMouseLeave('whatido')}
                        className="mb-4 font-bold text-4xl"
                    >
                        ¿Qué hago?
                    </button>
                    <button
                        id="btn-experience"
                        onClick={() => handleScroll('experience')}
                        onMouseEnter={() => handleMouseEnter('experience')}
                        onMouseLeave={() => handleMouseLeave('experience')}
                        className="mb-4 font-bold text-4xl"
                    >
                        Experiencia
                    </button>
                    <button
                        id="btn-activities"
                        onClick={() => handleScroll('activities')}
                        onMouseEnter={() => handleMouseEnter('activities')}
                        onMouseLeave={() => handleMouseLeave('activities')}
                        className="mb-4 font-bold text-4xl"
                    >
                        Actividades
                    </button>
                    <button
                        id="btn-contact"
                        onClick={() => handleScroll('contact')}
                        onMouseEnter={() => handleMouseEnter('contact')}
                        onMouseLeave={() => handleMouseLeave('contact')}
                        className="mb-4 font-bold text-4xl"
                    >
                        Contacto
                    </button>
                </div>
            </div>
        </>
    );
};

export default SideMenu;