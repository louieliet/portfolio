'use client'

/**
 * This custom hook helps identify which section the user is currently viewing
 */

import { useState, useEffect } from 'react'

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  useEffect(() => {
    const checkActiveSection = () => {
      // Get all sections with IDs
      const sectionsArray = Array.from(document.querySelectorAll('[id]'))
      
      // Find the section most in view
      let currentMaxVisible = 0
      let currentMostVisibleId: string | null = null
      
      for (const section of sectionsArray) {
        const id = section.id
        if (!id) continue
        
        const rect = section.getBoundingClientRect()
        
        // Calculate how much of the section is visible in the viewport
        const visibleTop = Math.max(0, rect.top)
        const visibleBottom = Math.min(window.innerHeight, rect.bottom)
        const visibleAmount = Math.max(0, visibleBottom - visibleTop)
        
        // Update most visible section if this one has more visible area
        if (visibleAmount > currentMaxVisible) {
          currentMaxVisible = visibleAmount
          currentMostVisibleId = id
        }
      }
      
      // Update state with most visible section
      if (currentMostVisibleId) {
        setActiveSection(currentMostVisibleId)
      }
    }
    
    // Initial check
    checkActiveSection()
    
    // Check on scroll
    window.addEventListener('scroll', checkActiveSection, { passive: true })
    
    // Check periodically
    const intervalId = setInterval(checkActiveSection, 500)
    
    return () => {
      window.removeEventListener('scroll', checkActiveSection)
      clearInterval(intervalId)
    }
  }, [])
  
  return activeSection
}

/**
 * This hook specifically checks if a user is in the Experience section
 */
export function useIsExperienceSection() {
  const [isExperienceVisible, setIsExperienceVisible] = useState(false)
  
  useEffect(() => {
    const checkIfExperienceSection = () => {
      // Look for elements with experience data attribute
      const experienceSection = document.querySelector('[data-section-type="experience"]')
      if (!experienceSection) return false
      
      // Check if the experience section is in the viewport
      const rect = experienceSection.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
    }
    
    const updateVisibility = () => {
      setIsExperienceVisible(checkIfExperienceSection())
    }
    
    // Initial check
    updateVisibility()
    
    // Set up listeners
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility, { passive: true })
    
    // Periodic check for reliability
    const intervalId = setInterval(updateVisibility, 300)
    
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
      clearInterval(intervalId)
    }
  }, [])
  
  return isExperienceVisible
}
