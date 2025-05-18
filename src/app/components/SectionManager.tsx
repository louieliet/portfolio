'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * SectionManager component
 * Helps debug and manage sections on the page
 */
interface SectionManagerProps {
  debug?: boolean
}

const SectionManager = ({ debug = false }: SectionManagerProps) => {
  const [sections, setSections] = useState<{id: string, inView: boolean}[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    // Get all section elements
    const scanSections = () => {
      const sectionElements = document.querySelectorAll('[id]')
      const sectionData = Array.from(sectionElements).map(section => {
        const id = section.id
        if (!id) return null
        
        const rect = section.getBoundingClientRect()
        const inView = rect.top < window.innerHeight && rect.bottom > 0
        
        return { id, inView }
      }).filter(Boolean) as {id: string, inView: boolean}[]
      
      setSections(sectionData)
    }
    
    scanSections()
    window.addEventListener('scroll', scanSections, { passive: true })
    
    // Also run periodically
    timerRef.current = setInterval(scanSections, 500)
    
    return () => {
      window.removeEventListener('scroll', scanSections)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])
  
  // Only render in debug mode
  if (!debug) return null
  
  return (
    <div className="fixed top-0 right-0 bg-black/80 text-white p-2 z-50 text-xs">
      <div className="font-bold mb-1">Visible Sections:</div>
      {sections.map(section => (
        <div 
          key={section.id} 
          className={`${section.inView ? 'text-green-400' : 'text-red-400'}`}
        >
          {section.id}: {section.inView ? 'visible' : 'hidden'}
        </div>
      ))}
    </div>
  )
}

export default SectionManager
