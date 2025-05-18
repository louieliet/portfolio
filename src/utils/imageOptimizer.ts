'use client'

import { useEffect } from 'react'

/**
 * Custom hook to preload critical images
 * @param imageSources Array of image URLs to preload
 * @param priority Optional priority (high, low, auto)
 */
export const useImagePreloader = (
  imageSources: string[],
  priority: 'high' | 'low' | 'auto' = 'auto'
) => {
  useEffect(() => {
    const preloadImages = () => {
      imageSources.forEach((src) => {
        const img = new Image()
        img.src = src
        if (priority !== 'auto') {
          img.fetchPriority = priority
        }
      })
    }

    // Use requestIdleCallback for low priority, or fallback to setTimeout
    if (priority === 'low' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(preloadImages)
    } else if (priority === 'high') {
      preloadImages()
    } else {
      setTimeout(preloadImages, 300)
    }
  }, [imageSources, priority])
}

/**
 * Image optimization utility functions
 */
export const imageUtils = {
  /**
   * Generate responsive srcSet for an image (for use with plain <img> tags)
   * @param basePath Base path of the image
   * @param widths Array of widths to generate
   * @param extension File extension (default: webp)
   */
  generateSrcSet: (basePath: string, widths: number[], extension: string = 'webp') => {
    return widths
      .map((width) => {
        // Handle both full URLs and relative paths
        const isFullUrl = basePath.startsWith('http') || basePath.startsWith('//')
        const path = isFullUrl
          ? new URL(basePath).pathname
          : basePath
          
        const filename = path.split('/').pop()
        if (!filename) return ''
        
        const filenameWithoutExt = filename.split('.')[0]
        const directory = path.substring(0, path.lastIndexOf('/'))
        
        return `${directory}/${filenameWithoutExt}_${width}.${extension} ${width}w`
      })
      .join(', ')
  },
  
  /**
   * Converts any image to WebP format if supported
   * @param imagePath Original image path
   * @returns WebP path if supported, original path as fallback
   */
  toWebP: (imagePath: string) => {
    // Detect WebP support in modern browsers
    const hasWebP = (() => {
      try {
        return (
          document
            .createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('data:image/webp') === 0
        )
      } catch {
        return false
      }
    })()
    
    if (hasWebP) {
      const extension = imagePath.split('.').pop()
      if (extension && ['jpg', 'jpeg', 'png'].includes(extension.toLowerCase())) {
        return imagePath.substring(0, imagePath.lastIndexOf('.')) + '.webp'
      }
    }
    
    return imagePath
  },
  
  /**
   * Check if the browser supports the native lazy loading attribute
   */
  supportsLazyLoading: () => {
    return 'loading' in HTMLImageElement.prototype
  },
  
  /**
   * Get ideal image size based on viewport and container size
   * @param containerWidth Width of the container (in pixels or % of viewport)
   * @param pixelRatio Screen pixel ratio (defaults to window.devicePixelRatio)
   */
  getIdealImageSize: (containerWidth: number | string, pixelRatio?: number) => {
    // Convert percentage to pixels
    const widthInPixels = typeof containerWidth === 'string' && containerWidth.includes('%')
      ? (parseFloat(containerWidth) / 100) * window.innerWidth
      : containerWidth as number
    
    // Apply pixel ratio
    const ratio = pixelRatio || (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)
    
    // Round to nearest standard breakpoint
    const breakpoints = [320, 640, 768, 1024, 1280, 1536, 1920, 2560]
    const idealWidth = Math.ceil(widthInPixels * ratio)
    
    // Find closest breakpoint
    return breakpoints.reduce((prev, curr) => {
      return Math.abs(curr - idealWidth) < Math.abs(prev - idealWidth) ? curr : prev
    }, breakpoints[0])
  }
}
