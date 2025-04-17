'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import gsap from 'gsap'
import HeaderNav from '@/app/components/HeaderNav'
import TorusKnot from '@/app/components/TorusKnot'

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
        <div className="intro-bg min-h-screen w-full pb-16 flex flex-col md:flex-row justify-between items-start relative overflow-hidden">
            <HeaderNav />

            <div className="absolute top-0 left-0 w-full flex justify-between items-center z-30 ">
                <div className="text-white/40 text-xs tracking-widest uppercase pl-6 md:pl-12 pt-3 pb-2">
                    Portfolio / 2025
                </div>
            </div>

            {/* Torus Knot Background */}
            <div className="absolute inset-0 flex items-center justify-center z-0 opacity-80">
                <div className="w-full h-full max-w-[2000px] max-h-[2000px]">
                    <TorusKnot />
                </div>
            </div>

            {/* Content container with asymmetric layout */}
            <div className="w-full pt-28 md:pt-36 md:pl-20 px-6 md:px-0 flex flex-col md:flex-row justify-between items-start relative z-10">
                {/* Left text container with offset positioning */}
                <div className="relative w-full md:w-6/12 mb-12 md:mb-0 intro-content md:pl-12 lg:pl-16">
                    <div className="text-white/60 text-sm uppercase tracking-widest mb-3 font-light ml-1">
                        Frontend & Unity Developer
                    </div>
                    <h1 className="text-6xl md:text-7xl lg:text-9xl font-semibold text-white leading-[1.05] tracking-tight">
                        Emiliano <br />
                        <span className="text-gray-300 font-light md:-ml-10">Montes</span>
                    </h1>
                    
                    <p className="mt-8 text-white/80 text-base md:text-lg max-w-md leading-relaxed font-light md:ml-16">
                        I build web, mobile, and Unity experiences that combine clean interaction, visual clarity, and an editorial-grade aesthetic. My goal is to create work that is both functional and deeply expressive.
                    </p>
                    
                </div>

                {/* Right image with offset positioning */}
                <div className="intro-content w-full md:w-5/12 flex justify-center md:justify-end md:-mt-2 md:mr-4 lg:mr-20">
                    <div className="relative w-[320px] h-[420px] md:w-[380px] md:h-[600px] lg:w-[420px] lg:h-[700px] overflow-hidden shadow-2xl grayscale contrast-110 rotate-1">
                        <Image
                            src="/pp.png"
                            alt="Emiliano portrait"
                            fill
                            className="object-cover object-top"
                            priority
                        />
                    </div>
                </div>
            </div>
            
            {/* Offset decorative element */}
            <div className="absolute bottom-10 right-28 h-[1px] w-24 bg-white/30"></div>
        </div>
    )
}

export default Introduction