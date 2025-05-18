'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'

const Contact = () => {
    const imgRef = useRef<HTMLImageElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    
    useEffect(() => {
        // Initialize any effects needed for magazine style
        const handleMouseMove = (e: MouseEvent) => {
            if (!imgRef.current) return
            
            // Subtle parallax effect on hover
            const { left, top, width, height } = imgRef.current.getBoundingClientRect()
            const x = (e.clientX - left) / width - 0.5
            const y = (e.clientY - top) / height - 0.5
            
            imgRef.current.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${y * -3}deg) scale(1.02)`
        }
        
        const contactSection = document.getElementById('contact')
        contactSection?.addEventListener('mousemove', handleMouseMove)
        
        return () => {
            contactSection?.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    return (
        <section 
            id="contact" 
            className="contact-bg min-h-[90vh] w-full relative overflow-hidden py-20 px-6 md:px-0"
            style={{ 
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
            }}
            data-section-type="contact"
            data-section-id="contact"
        >
            <div className="absolute top-0 left-0 w-full flex justify-between items-center z-30">
                <div className={`text-white/40 text-xs tracking-widest uppercase pl-6 md:pl-12 pt-4 pb-2 transition-colors duration-500 ${isHovering ? 'text-white/60' : ''}`}>
                    Section 03
                </div>
                <div className={`text-white/40 text-xs tracking-widest uppercase pr-6 md:pr-12 pt-4 pb-2 transition-colors duration-500 ${isHovering ? 'text-white/60' : ''}`}>
                    Get in Touch
                </div>
            </div>
            
            {/* Grain texture overlay */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <Image 
                    src="/grain.png" 
                    alt="Grain texture" 
                    fill 
                    className="object-cover mix-blend-overlay"
                />
            </div>
            
            {/* Subtle glow effect */}
            <div 
                className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] z-0 transition-all duration-1000" 
                style={{ 
                    background: isHovering ? 'rgba(76, 29, 149, 0.15)' : 'rgba(76, 29, 149, 0.1)',
                    transform: isHovering ? 'translateY(-10px)' : 'translateY(0)'
                }}
            ></div>
            <div 
                className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full blur-[100px] z-0 transition-all duration-1000"
                style={{ 
                    background: isHovering ? 'rgba(30, 58, 138, 0.15)' : 'rgba(30, 58, 138, 0.1)',
                    transform: isHovering ? 'translateY(10px)' : 'translateY(0)'
                }}
            ></div>
            
            {/* Content with magazine layout */}
            <div className="max-w-7xl mx-auto md:pl-20 flex flex-col md:flex-row justify-between items-start relative z-10 pt-16 md:pt-24">
                
                {/* Left - Title and contact info */}
                <div className="relative w-full md:w-5/12 mb-16 md:mb-0 md:pl-12 lg:pl-16">
                    <div className="text-white/60 text-sm uppercase tracking-widest mb-3 font-light ml-1">
                        Let&apos;s work together
                    </div>
                    <h2 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1.05] tracking-tight">
                        Contact <br />
                        <span className={`text-gray-300 font-light md:-ml-10 inline-block transition-transform duration-1000 ${isHovering ? 'transform translate-x-3' : ''}`}>Me</span>
                    </h2>
                    
                    <div className="mt-16 space-y-6 md:ml-16">
                        <div>
                            <h3 className="text-xl font-light uppercase text-white/80 mb-2">Email</h3>
                            <a 
                                href="mailto:emilianomg2003@hotmail.com" 
                                className="text-lg text-white group inline-flex items-center hover:text-indigo-300 transition-colors duration-300"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                emilianomg2003@hotmail.com
                                <span className="inline-block ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </a>
                        </div>
                        <div>
                            <h3 className="text-xl font-light uppercase text-white/80 mb-2">LinkedIn</h3>
                            <Link 
                                href="https://www.linkedin.com/in/emiliano-mg/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg text-white group inline-flex items-center hover:text-indigo-300 transition-colors duration-300"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                linkedin.com/in/emiliano-mg
                                <span className="inline-block ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Right - Image and connect text */}
                <div className="w-full md:w-7/12 flex flex-col items-center md:pr-8">
                    <div 
                        className="relative w-full max-w-md h-[400px] md:h-[500px] overflow-hidden shadow-2xl rotate-1 mb-10 border border-white/10 transition-transform duration-700 ease-out"
                        style={{
                            transform: isHovering ? 'scale(1.02)' : 'scale(1)',
                        }}
                    >
                        <Image
                            ref={imgRef}
                            src="/pp.png"
                            alt="Contact image"
                            fill
                            className="object-cover object-top grayscale transition-transform duration-700 ease-out"
                            style={{ 
                                transformStyle: 'preserve-3d',
                                transform: isHovering ? 'scale(1.05)' : 'scale(1)'
                            }}
                        />
                    </div>
                    
                    <div className="space-y-6 max-w-md">
                        <h3 className="text-xl font-light uppercase text-white/80">Let&apos;s Connect</h3>
                        <p className="text-base text-white/80 leading-relaxed">
                            I&apos;m available for project collaborations, consultations, or just to say hello. 
                            Feel free to reach out via email or connect with me on LinkedIn.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Offset decorative element */}
            <div className={`absolute bottom-10 left-28 h-[1px] w-24 bg-white/30 transition-all duration-1000 ${isHovering ? 'w-32 bg-white/50' : ''}`}></div>
            
            {/* Footer note */}
            <div className="absolute bottom-4 w-full text-center text-sm text-white/60">
                Made by Emiliano Montes with ❤️, Next.js & Tailwind CSS
            </div>
        </section>
    )
}

export default Contact
