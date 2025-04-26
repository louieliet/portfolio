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
    const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([])

    const menuBtnRef = useRef<HTMLAnchorElement>(null)
    const menuBtnTxtRef = useRef<HTMLSpanElement>(null)
    
    // Initialize button animation on component mount
    useEffect(() => {
        if (buttonRef.current) {
            gsap.to(buttonRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                delay: 1
            });
        }
    }, []);

    // Animation for showing/hiding the side menu and overlay
    useEffect(() => {
        const buttonMenu = menuBtnRef.current
        const textMenu = menuBtnTxtRef.current

        if (menuRef.current && overlayRef.current) {
            if (isMenuOpen) {
                // Menu entrance animation
                gsap.to(menuRef.current, {
                    x: 0,
                    duration: 1,
                    ease: 'power4.out',
                })
                
                // Menu items staggered entrance
                gsap.fromTo(
                    menuItemsRef.current,
                    { 
                        x: 100, 
                        opacity: 0 
                    },
                    {
                        x: 0,
                        opacity: 1,
                        stagger: 0.1,
                        duration: 0.8,
                        ease: 'power3.out',
                        delay: 0.3
                    }
                )
                
                // Overlay appearance animation
                gsap.to(overlayRef.current, {
                    opacity: 0.8,
                    duration: 0.5,
                    ease: 'power4.out',
                    display: 'block',
                })
            } else {
                // Menu exit animation
                gsap.to(menuRef.current, {
                    x: '100%',
                    duration: 0.5,
                    ease: 'power4.in',
                })
                
                // Overlay disappearance animation
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

        // LinkedIn button hover effect
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
            setIsMenuOpen(false) // Close menu after scrolling
        }
    }

    const handleMouseEnter = (id: string) => {
        const button = document.getElementById(`btnMenu-${id}`)
        if (button) {
            gsap.to(button, {
                x: 20,
                duration: 0.3,
                ease: 'power3.out',
            })
        }
    }

    const handleMouseLeave = (id: string) => {
        const button = document.getElementById(`btnMenu-${id}`)
        if (button) {
            gsap.to(button, {
                x: 0,
                duration: 0.3,
                ease: 'power3.out',
            })
        }
    }

    // Add a menu item to the refs array
    const addToMenuRefs = (el: HTMLButtonElement | null, index: number) => {
        if (el) {
            menuItemsRef.current[index] = el;
        }
    };

    return (
        <>
            {/* Menu button */}
            <button
                id="sideMenuButton"
                ref={buttonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`fixed top-8 right-8 z-50 p-3 transform opacity-0 scale-0 transition-shadow duration-300 hover:scale-105`}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
                <div className={`relative w-12 h-12 flex items-center justify-center rounded-full ${isMenuOpen ? 'bg-white' : 'bg-black/20 backdrop-blur-md border border-white/10'}`}>
                    {isMenuOpen ? (
                        <Image
                            src={CloseMenu}
                            alt="Close menu"
                            width={20}
                            height={20}
                            className="opacity-70"
                        />
                    ) : (
                        <Image
                            src={MenuIcon}
                            alt="Open menu"
                            width={20}
                            height={20}
                            className="opacity-70"
                        />
                    )}
                </div>
            </button>

            {/* Side menu */}
            <div
                ref={menuRef}
                className="fixed top-0 right-0 w-full md:w-[580px] h-full z-40 transform translate-x-full"
            >
                <div className="relative h-full w-full overflow-hidden">
                    {/* Background panel */}
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl border-l border-white/10"></div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-20 h-[1px] bg-white/20"></div>
                    <div className="absolute top-0 right-0 w-20 h-[1px] bg-white/20"></div>
                    <div className="absolute top-24 left-12 text-white/20 text-xs tracking-widest uppercase">
                        Navigation
                    </div>
                    <div className="absolute bottom-10 right-10 h-[1px] w-24 bg-white/20"></div>
                
                    {/* Menu content */}
                    <div className="flex flex-col items-start justify-center p-6 h-full ml-2 md:ml-16 md:w-full relative z-10">
                        <div className="absolute -left-4 top-[30%] bottom-[40%] w-[1px] bg-white/10"></div>
                        
                        <div className="mb-20">
                            <div className="text-white/40 text-xs tracking-widest uppercase mb-8">Menu</div>
                            
                            <button
                                id="btnMenu-whatido"
                                ref={(el) => addToMenuRefs(el, 0)}
                                onClick={() => handleScroll('whatido')}
                                onMouseEnter={() => handleMouseEnter('whatido')}
                                onMouseLeave={() => handleMouseLeave('whatido')}
                                className="mb-8 text-5xl md:text-6xl text-white/90 font-light flex items-center hover:text-white transition-colors duration-300 relative group"
                            >
                                <span className="absolute -left-8 w-4 h-[1px] bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                What I Do
                            </button>
                            
                            <button
                                id="btnMenu-experience"
                                ref={(el) => addToMenuRefs(el, 1)}
                                onClick={() => handleScroll('experience')}
                                onMouseEnter={() => handleMouseEnter('experience')}
                                onMouseLeave={() => handleMouseLeave('experience')}
                                className="mb-8 text-5xl md:text-6xl text-white/90 font-light flex items-center hover:text-white transition-colors duration-300 relative group"
                            >
                                <span className="absolute -left-8 w-4 h-[1px] bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                Experience
                            </button>
                            
                            <button
                                id="btnMenu-activities"
                                ref={(el) => addToMenuRefs(el, 2)}
                                onClick={() => handleScroll('activities')}
                                onMouseEnter={() => handleMouseEnter('activities')}
                                onMouseLeave={() => handleMouseLeave('activities')}
                                className="mb-8 text-5xl md:text-6xl text-white/90 font-light flex items-center hover:text-white transition-colors duration-300 relative group"
                            >
                                <span className="absolute -left-8 w-4 h-[1px] bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                Activities
                            </button>
                            
                            <button
                                id="btnMenu-contact"
                                ref={(el) => addToMenuRefs(el, 3)}
                                onClick={() => handleScroll('contact')}
                                onMouseEnter={() => handleMouseEnter('contact')}
                                onMouseLeave={() => handleMouseLeave('contact')}
                                className="mb-8 text-5xl md:text-6xl text-white/90 font-light flex items-center hover:text-white transition-colors duration-300 relative group"
                            >
                                <span className="absolute -left-8 w-4 h-[1px] bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                Contact
                            </button>
                        </div>
                        
                        <div className="mt-auto">
                            <div className="flex flex-col mb-8">
                                <h2 className="text-white/40 text-xs tracking-widest uppercase mb-2">
                                    Email
                                </h2>
                                <a
                                    href="mailto:emilianomg2003@hotmail.com"
                                    className="text-white font-light text-lg relative overflow-hidden inline-block"
                                    id="emailLink"
                                    onMouseEnter={() => {
                                        const emailLink = document.getElementById('emailLink');
                                        if (emailLink) {
                                            const clone = emailLink.cloneNode(true) as HTMLElement;
                                            clone.style.position = 'absolute';
                                            clone.style.opacity = '0';
                                            clone.style.top = '-100%';
                                            clone.style.pointerEvents = 'none';
                                            emailLink.parentElement?.appendChild(clone);
                            
                                            gsap.to(emailLink, {
                                                y: '100%',
                                                duration: 0.3,
                                                ease: 'power4.out',
                                                onComplete: () => {
                                                    gsap.to(emailLink, {
                                                        y: '0%',
                                                        duration: 0,
                                                    });
                                                },
                                            });
                            
                                            gsap.to(clone, {
                                                y: '0%',
                                                opacity: 1,
                                                duration: 0.3,
                                                ease: 'power4.out',
                                                onComplete: () => {
                                                    clone.remove();
                                                },
                                            });
                                        }
                                    }}
                                >
                                    emilianomg2003@hotmail.com
                                </a>
                            </div>
                            
                            <div className="flex flex-row gap-4 mt-4">
                                <a
                                    href="https://www.linkedin.com/in/emiliano-mg/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    ref={menuBtnRef}
                                    className="relative inline-block px-8 py-3 text-white/70 border border-white/20 rounded-sm overflow-hidden hover:border-white/40 transition-colors duration-300"
                                >
                                    <span ref={menuBtnTxtRef} className="relative z-10 text-sm tracking-widest uppercase">
                                        LinkedIn
                                    </span>
                                </a>
                                
                                <a
                                    href="https://github.com/Humberto-Zayas"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative inline-block px-8 py-3 text-white/70 border border-white/20 rounded-sm overflow-hidden hover:border-white/40 transition-colors duration-300"
                                >
                                    <span className="relative z-10 text-sm tracking-widest uppercase">
                                        GitHub
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
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
