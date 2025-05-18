'use client'

import { lazy, Suspense, useEffect } from 'react'
import { useOptimizedImageLoading, useWebVitalsTracker } from '@/utils/performanceUtils'

// Dynamically import components with Suspense
const PerformanceIndicator = lazy(() => 
  import('./PerformanceIndicator')
)

const ServiceWorkerRegistration = lazy(() => 
  import('./ServiceWorkerRegistration')
)

export default function ClientComponents() {
  // Initialize web vitals tracking
  useWebVitalsTracker()
  
  // Apply optimized image loading
  useOptimizedImageLoading()
  
  // Preload critical assets
  useEffect(() => {
    // Add preconnect for external resources
    const createPreconnect = (url: string) => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = url
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    }
    
    // Common CDNs and external resources
    createPreconnect('https://fonts.googleapis.com')
    createPreconnect('https://fonts.gstatic.com')
    
    // Preload critical images 
    const preloadCriticalImage = (src: string) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    }
    
    // Preload the most important images that appear above the fold
    preloadCriticalImage('/pp.png')
    preloadCriticalImage('/grain.png')
  }, [])
  
  return (
    <>
      <Suspense fallback={null}>
        <PerformanceIndicator />
      </Suspense>
      <Suspense fallback={null}>
        <ServiceWorkerRegistration />
      </Suspense>
    </>
  )
}
