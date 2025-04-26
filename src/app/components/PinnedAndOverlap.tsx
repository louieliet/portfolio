'use client'
import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Definimos la interfaz de las props
interface PinnedAndOverlapProps {
    contentOne: React.ReactNode // El contenido que se queda fijo
    contentTwo: React.ReactNode // El contenido que sube a cubrir al primero
    containerHeight?: string // Opcional: por si quieres pasar la altura de la sección padre (ej: "300vh")
}

export default function PinnedAndOverlap({
    contentOne,
    contentTwo,
    containerHeight = '225vh', // Valor por defecto
}: PinnedAndOverlapProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentOneRef = useRef<HTMLDivElement>(null)
    const contentTwoRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setIsScrolling] = useState(false)
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)
        const scrollTriggers: ScrollTrigger[] = []

        // Debounce scroll function to improve performance
        const handleScroll = () => {
            if (!isScrolling) {
                setIsScrolling(true)
            }
            
            // Clear previous timeout
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
            }
            
            // Set new timeout
            scrollTimeout.current = setTimeout(() => {
                setIsScrolling(false)
            }, 150)
        }

        // Solo en cliente
        if (typeof window !== 'undefined') {
            // Add scroll listener
            window.addEventListener('scroll', handleScroll, { passive: true })
            
            // 1) Pin del contenido 1
            const pinTrigger = ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: contentOneRef.current,
                pinSpacing: false,
                onUpdate: (self) => {
                    // Reduce animation complexity during fast scrolling
                    if (isScrolling) {
                        self.disable(false)
                    } else {
                        self.enable()
                    }
                }
            })
            scrollTriggers.push(pinTrigger)

            // 2) Animación de contenido 2 (sube desde 100vh hasta -window.innerHeight)
            const contentTwoTrigger = ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8, // Increased scrub value for smoother scrolling
                onUpdate: (self) => {
                    // Only update animation when not scrolling fast
                    if (!isScrolling) {
                        gsap.to(contentTwoRef.current, {
                            y: -window.innerHeight * self.progress,
                            ease: 'power2.inOut',
                            duration: 0.3,
                            overwrite: true
                        })
                    }
                }
            })
            scrollTriggers.push(contentTwoTrigger)

            // Animate HeaderNav when contentTwo appears
            const headerNavTrigger = ScrollTrigger.create({
                trigger: contentTwoRef.current,
                start: 'top center',
                end: 'bottom center',
                scrub: true,
                onUpdate: (self) => {
                    if (!isScrolling) {
                        gsap.to('#header-nav', {
                            y: -300 * self.progress,
                            duration: 0.3,
                            overwrite: true
                        })
                    }
                }
            })
            scrollTriggers.push(headerNavTrigger)

            // Animate the sideMenuButton when contentTwo appears
            const menuButtonTrigger = ScrollTrigger.create({
                trigger: contentTwoRef.current,
                start: 'top 10%',
                end: 'top top',
                scrub: true,
                onUpdate: (self) => {
                    if (!isScrolling) {
                        gsap.to('#sideMenuButton', {
                            opacity: self.progress,
                            scale: 0.5 + 0.5 * self.progress,
                            duration: 0.3,
                            overwrite: true
                        })
                    }
                }
            })
            scrollTriggers.push(menuButtonTrigger)
        }

        // Clean up all scroll triggers and event listeners
        return () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current)
            }
            window.removeEventListener('scroll', handleScroll)
            scrollTriggers.forEach(trigger => trigger.kill())
        }
    }, [isScrolling])

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                height: containerHeight, // por defecto "300vh"
                width: '100%',
            }}
        >
            {/* Contenido 1 (se pinnea) */}
            <div
                ref={contentOneRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                }}
            >
                {/* Aquí pintamos el contenido que viene por prop */}
                {contentOne}
            </div>

            {/* Contenido 2 (que sube) */}
            <div
                ref={contentTwoRef}
                style={{
                    position: 'absolute',
                    top: '100vh',
                    left: 0,
                    width: '100%',
                    height: containerHeight,
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                }}
            >
                {contentTwo}
            </div>
        </div>
    )
}
