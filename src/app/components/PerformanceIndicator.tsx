'use client'

import { useState, useEffect, useCallback } from 'react'

// Define a type for the Chrome-specific memory API
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/**
 * PerformanceIndicator component provides a visual indicator of performance metrics
 * in development environments only with optimized performance monitoring
 */
export default function PerformanceIndicator() {
  const [fps, setFps] = useState<number>(0)
  const [memory, setMemory] = useState<number>(0)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  
  const toggleVisibility = useCallback((e: KeyboardEvent) => {
    if (e.key === 'p' && e.ctrlKey) {
      setIsVisible(v => !v)
    }
  }, [])
  
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return
    
    let frameCount = 0
    let lastTime = performance.now()
    let animationFrameId: number | null = null
    let metricsInterval: NodeJS.Timeout | null = null
    
    // Use a more efficient approach with separate interval for UI updates
    const updateFrame = () => {
      frameCount++
      animationFrameId = requestAnimationFrame(updateFrame)
    }
    
    // Start measuring frames
    animationFrameId = requestAnimationFrame(updateFrame)
    
    // Update metrics at a reasonable interval (250ms) instead of every frame
    metricsInterval = setInterval(() => {
      const now = performance.now()
      const elapsed = now - lastTime
      
      // Calculate and update FPS
      const currentFps = Math.round((frameCount * 1000) / elapsed)
      setFps(currentFps)
      
      // Reset counters
      frameCount = 0
      lastTime = now
      
      // Check memory usage if available (Chrome only)
      if (performance && 'memory' in performance) {
        const memoryInfo = performance.memory as unknown as MemoryInfo
        setMemory(Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024)))
      }
    }, 250)
    
    // Enable toggle with key press
    window.addEventListener('keydown', toggleVisibility)
    
    return () => {
      window.removeEventListener('keydown', toggleVisibility)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (metricsInterval) clearInterval(metricsInterval)
    }
  }, [toggleVisibility])
  
  if (!isVisible || process.env.NODE_ENV !== 'development') return null
  
  return (
    <div 
      className="fixed bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-md text-xs z-50 font-mono"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="flex space-x-3">
        <div className={`flex items-center ${fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}`}>
          <span>FPS: {fps}</span>
        </div>
        {memory > 0 && (
          <div className={`flex items-center ${memory > 150 ? 'text-red-400' : memory > 100 ? 'text-yellow-400' : 'text-green-400'}`}>
            <span>Memory: {memory} MB</span>
          </div>
        )}
      </div>
    </div>
  )
}
