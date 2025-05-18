'use client'

import { useEffect, useState } from 'react'
import { useIsExperienceSection } from '@/utils/sectionUtils'

/**
 * A simple utility component to test section visibility and debug SphereBackground rendering
 */
const SectionTest = () => {
  const isExperienceSection = useIsExperienceSection()
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0)
  const [experienceElementPos, setExperienceElementPos] = useState({ top: 0, bottom: 0 })
  const [visibleSections, setVisibleSections] = useState<{[key: string]: boolean}>({
    intro: false,
    whatido: false,
    experience: false,
    activities: false,
    contact: false
  })
  
  useEffect(() => {
    const handleScroll = () => {
      setCurrentScrollPosition(window.scrollY)
      
      // Get experience section position
      const experienceEl = document.querySelector('[data-section-id="experience"]')
      if (experienceEl) {
        const rect = experienceEl.getBoundingClientRect()
        setExperienceElementPos({
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY
        })
      }
      
      // Check all sections visibility
      const sections = {
        intro: document.querySelector('#intro-section, [data-section-type="intro"]'),
        whatido: document.querySelector('#whatido-section, [data-section-type="whatido"]'),
        experience: document.querySelector('#experience-section, [data-section-type="experience"], #experience, [data-section-id="experience"]'),
        activities: document.querySelector('#activities-section, [data-section-type="activities"]'),
        contact: document.querySelector('#contact-section, [data-section-type="contact"]')
      }
      
      // Create a new object for visible sections status without depending on previous state
      const newVisibleSections: {[key: string]: boolean} = {
        intro: false,
        whatido: false,
        experience: false,
        activities: false,
        contact: false
      }
      
      Object.entries(sections).forEach(([key, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          newVisibleSections[key] = rect.top < window.innerHeight && rect.bottom > 0
        }
      })
      
      setVisibleSections(newVisibleSections)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // Remove visibleSections from dependencies
  
  // Only show in development environment
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white z-50 p-4 text-xs max-w-[300px]">
      <h3 className="font-bold mb-2">Section Visibility Test</h3>
      
      <div className="mb-2">
        <div className="font-bold mb-1">Visible Sections:</div>
        {Object.entries(visibleSections).map(([section, isVisible]) => (
          <div 
            key={section} 
            className={isVisible ? "text-green-400" : "text-red-400"}
          >
            {section}: {isVisible ? 'visible' : 'hidden'}
            {section === 'experience' && isVisible && ' (SphereBackground active)'}
          </div>
        ))}
      </div>
      
      <div className={isExperienceSection ? "text-green-400 font-bold" : "text-red-400"}>
        useIsExperienceSection hook: {isExperienceSection ? 'TRUE' : 'FALSE'}
      </div>
      
      <div className="mt-2">
        <div>Current scroll: {currentScrollPosition}px</div>
        <div>Experience section:</div>
        <div>- Top: {experienceElementPos.top}px</div>
        <div>- Bottom: {experienceElementPos.bottom}px</div>
      </div>
      <div className="mt-2 text-gray-400">
        SphereBackground will only render when the Experience section is visible.
      </div>
    </div>
  )
}

export default SectionTest
