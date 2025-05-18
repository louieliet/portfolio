'use client'

import { useEffect, useState, ReactNode, useRef, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazyLoadSectionProps {
  children: ReactNode
  id?: string
  className?: string
  threshold?: number
  rootMargin?: string
  placeholder?: ReactNode
  onVisible?: () => void
  fadeIn?: boolean
}

/**
 * LazyLoadSection - Progressively loads a section when it comes into view
 * This helps improve initial page load performance by deferring non-critical content
 */
export default function LazyLoadSection({
  children,
  id,
  className,
  threshold = 0.1,
  rootMargin = '100px 0px',
  placeholder,
  onVisible,
  fadeIn = true
}: LazyLoadSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const hasCallbackTriggered = useRef(false)
  
  // Use memoized InView options to prevent recreating the observer
  const inViewOptions = {
    threshold,
    rootMargin,
    triggerOnce: true // Changed to true for better performance
  }
  
  const { ref, inView } = useInView(inViewOptions)
  
  // Memoize the visibility handler to prevent unnecessary recomputation
  const handleVisibilityChange = useCallback(() => {
    if (inView && !isVisible) {
      setIsVisible(true)
      
      // Only trigger the callback once
      if (onVisible && !hasCallbackTriggered.current) {
        onVisible()
        hasCallbackTriggered.current = true
      }
    }
  }, [inView, isVisible, onVisible])
  
  useEffect(() => {
    handleVisibilityChange()
  }, [handleVisibilityChange])
  
  return (
    <section
      id={id}
      ref={ref}
      className={`relative ${className} ${fadeIn ? 'transition-opacity duration-500' : ''} ${fadeIn && isVisible ? 'opacity-100' : fadeIn && !isVisible ? 'opacity-0' : ''}`}
    >
      {isVisible ? children : placeholder || <div className="w-full h-64" />}
    </section>
  )
}
