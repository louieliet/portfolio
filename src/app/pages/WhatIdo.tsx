'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const WhatIdo = () => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([])


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    // Title animation
    const title = titleRef.current
    if (title) {
      gsap.fromTo(
        title,
        {
          y: 100,
          opacity: 0,
          clipPath: 'inset(0 0 100% 0)',
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.8,
          ease: 'power4.out',
          clipPath: 'inset(0 0 0% 0)',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
          }
        }
      )
    }

    // Section animations
    sectionRefs.current.forEach((section, index) => {
      if (section) {
        gsap.fromTo(
          section,
          { 
            y: 100, 
            opacity: 0 
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power3.out',
            delay: index * 0.2,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
            }
          }
        )
      }
    })
  }, [])

  return (
    <section id="whatido" className="whatido-bg w-full min-h-screen relative overflow-x-hidden pt-28 pb-40 px-6 md:px-20 lg:px-28">
      <div className="absolute top-0 left-0 w-full flex justify-between items-center z-30">
        <div className="text-white/40 text-xs tracking-widest uppercase pl-6 md:pl-12 pt-4 pb-2">
          Section 01
        </div>
        <div className="text-white/40 text-xs tracking-widest uppercase pr-6 md:pr-12 pt-4 pb-2">
          Skills & Process
        </div>
      </div>
      
      <div className="relative max-w-7xl mx-auto z-10 md:pl-12">
        {/* Header */}
        <div className="mb-32 md:mb-40">
          <div className="text-white/60 text-sm uppercase tracking-widest mb-3 font-light ml-1">
            what I do
          </div>
          <h2 ref={titleRef} className="text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-[1.05] tracking-tight">
            My <br />
            <span className="text-gray-300 font-light">work</span>
          </h2>
          <p className="mt-8 text-white/80 text-base md:text-lg max-w-md leading-relaxed font-light md:ml-16">
            Web and mobile development, and Unity experiences, focused on visual design and clear functionality, with an editorial and minimalist aesthetic.
          </p>
        </div>

      </div>

      <div className="absolute bottom-10 right-28 h-[1px] w-24 bg-white/30"></div>
    </section>
  )
}

export default WhatIdo