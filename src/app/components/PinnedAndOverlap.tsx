'use client'
import React, { useRef, useEffect } from 'react'
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
    containerHeight = '300vh', // Valor por defecto
}: PinnedAndOverlapProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const contentOneRef = useRef<HTMLDivElement>(null)
    const contentTwoRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger)

        // Solo en cliente
        if (typeof window !== 'undefined') {
            // 1) Pin del contenido 1
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: contentOneRef.current,
                pinSpacing: false,
            })

            // 2) Animación de contenido 2 (sube desde 100vh hasta -window.innerHeight)
            gsap.fromTo(
                contentTwoRef.current,
                { y: 0 },
                {
                    y: -window.innerHeight,
                    ease: 'power2.inOut', // Easing más fluido
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 0.6,
                    },
                }
            )

            // Animate HeaderNav when contentTwo appears
            gsap.to('#header-nav', {
                y: -300, // Move up by 50px
                scrollTrigger: {
                    trigger: contentTwoRef.current,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: true,
                },
            })

            // Animate the sideMenuButton when contentTwo appears
            gsap.to('#sideMenuButton', {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: contentTwoRef.current,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: true,
                },
            })
        }

        return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill())
        }
    }, [])

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
                    willChange: 'transform', // Optimización para animaciones smooth
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
                    willChange: 'transform', // Optimización para animaciones smooth
                }}
            >
                {contentTwo}
            </div>
        </div>
    )
}
