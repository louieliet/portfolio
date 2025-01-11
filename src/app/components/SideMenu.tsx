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
                    duration: 1,
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

    return (
        <>
            {/* Botón Hamburguesa */}
            <button
                id="sideMenuButton"
                ref={buttonRef} // Referencia para animar el botón
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="fixed top-4 right-4 z-50 p-2 bg-gray-800 text-white rounded-full shadow-lg transform opacity-0 scale-0"
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
                className="fixed top-0 right-0 w-64 h-full bg-black bg-opacity-90 text-white z-40 transform translate-x-full"
            >
                <div className="flex flex-col items-start p-6">
                    <h2 className="text-xl font-bold mb-6">Contáctanos</h2>
                    <button
                        onClick={() => handleScroll('whatido')}
                        className="mb-4 hover:underline"
                    >
                        ¿Qué hago?
                    </button>
                    <button
                        onClick={() => handleScroll('experience')}
                        className="mb-4 hover:underline"
                    >
                        Experiencia
                    </button>
                    <button
                        onClick={() => handleScroll('activities')}
                        className="mb-4 hover:underline"
                    >
                        Actividades
                    </button>
                    <button
                        onClick={() => handleScroll('contact')}
                        className="hover:underline"
                    >
                        Contacto
                    </button>
                </div>
            </div>
        </>
    );
};

export default SideMenu;