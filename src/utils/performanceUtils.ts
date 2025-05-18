'use client'

import { useEffect, useRef } from 'react'
// The types are now defined in src/types/web-vitals.d.ts

/**
 * Custom hook to track and optimize Core Web Vitals
 * This helps improve user experience metrics like LCP, FID, and CLS
 */
export const useWebVitalsTracker = () => {
  const lcpRef = useRef<number | null>(null)
  const clsRef = useRef<number | null>(null)
  const fidRef = useRef<number | null>(null)
  
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    
    // Only load web-vitals in production
    const importVitals = async () => {
      try {
        // Dynamic import of web-vitals
        const webVitals = await import('web-vitals')
        const { onLCP, onFID, onCLS } = webVitals
        
        // Largest Contentful Paint
        onLCP((metric) => {
          lcpRef.current = metric.value
          console.log('LCP:', metric.value)
          
          // Report to analytics if needed
          reportToAnalytics('LCP', metric.value)
        })
        
        // First Input Delay
        onFID((metric) => {
          fidRef.current = metric.value
          console.log('FID:', metric.value)
          
          // Report to analytics if needed
          reportToAnalytics('FID', metric.value)
        })
        
        // Cumulative Layout Shift
        onCLS((metric) => {
          clsRef.current = metric.value
          console.log('CLS:', metric.value)
          
          // Report to analytics if needed
          reportToAnalytics('CLS', metric.value)
        })
      } catch (error) {
        console.error('Failed to load web-vitals', error)
      }
    }
    
    importVitals()
  }, [])
  
  // Simple analytics reporting placeholder
  const reportToAnalytics = (metric: string, value: number) => {
    // Replace with your actual analytics implementation
    if (typeof window !== 'undefined') {
      // Handle Google Analytics if available
      // @ts-expect-error - gtag might not be defined in window
      if (window.gtag) {
        // @ts-expect-error - gtag is not typed
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: metric,
          value: Math.round(value * 100) / 100,
          non_interaction: true,
        })
      }
    }
  }
  
  return { lcpRef, clsRef, fidRef }
}

/**
 * Utility to optimize image loading sequence based on viewport visibility
 * Prioritizes images that are in the viewport and defers others
 */
export const optimizeImageLoading = () => {
  if (typeof window === 'undefined') return;
  
  // Use native browser features when available
  if ('loading' in HTMLImageElement.prototype) {
    // Find all images without explicit loading attribute
    const images = document.querySelectorAll('img:not([loading])')
    images.forEach(img => {
      img.setAttribute('loading', 'lazy')
    })
  } else {
    // Fallback to IntersectionObserver for older browsers
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            
            // Set the src from data-src
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
            }
            
            // Set the srcset from data-srcset
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset
              img.removeAttribute('data-srcset')
            }
            
            observer.unobserve(img)
          }
        })
      })
      
      // Apply to images with data-src
      const lazyImages = document.querySelectorAll('img[data-src]')
      lazyImages.forEach(img => {
        imageObserver.observe(img)
      })
    }
  }
}

/**
 * Hook to apply image loading optimization when a component mounts
 */
export const useOptimizedImageLoading = () => {
  useEffect(() => {
    // Apply optimizations after a short delay to prioritize critical content
    const timeoutId = setTimeout(() => {
      optimizeImageLoading()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [])
}
