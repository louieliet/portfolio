'use client'

import { Canvas } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const ParticleField = ({ containerId }: { containerId: string }) => {
  const ref = useRef<THREE.Points>(null!)
  const [isVisible, setIsVisible] = useState(true)
  
  // Reduce particle count for better performance
  const count = window?.innerWidth < 768 ? 800 : 1200
  
  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility state based on intersection
        setIsVisible(entries[0].isIntersecting)
      },
      { threshold: 0.1 }
    )
    
    // Start observing the container
    observer.observe(container)
    
    return () => {
      observer.disconnect()
    }
  }, [containerId])

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame(() => {
    if (ref.current && isVisible) {
      ref.current.rotation.y += 0.0015
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  )
}

const FloatingParticles = ({ containerId = "main-container" }: { containerId?: string }) => {
  return (
    <Canvas className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-[0.06]">
      <ParticleField containerId={containerId} />
    </Canvas>
  )
}

export default FloatingParticles