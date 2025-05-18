'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

const RotatingTorusKnot = ({ containerId }: { containerId: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return
    
    // Check for mobile viewport only once on mount
    setIsMobile(window.innerWidth < 768)
    
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

  useFrame(() => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x += 0.0025
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={isMobile ? [2.5, 0.6, 150, 20] : [2.8, 0.7, 200, 24]} />
      <meshStandardMaterial
        wireframe
        color="#CCCCCC"
        metalness={0.8}
        roughness={0.2}
        emissive="#555555"
      />
    </mesh>
  )
}

const TorusKnot = ({ containerId = "introduction" }: { containerId?: string }) => {
  return (
    <Canvas
      className="w-full h-full opacity-20 pointer-events-none"
      camera={{ position: [0, 0, 3], fov: 50 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 5]} intensity={2.0} />
      <RotatingTorusKnot containerId={containerId} />
    </Canvas>
  )
}

export default TorusKnot