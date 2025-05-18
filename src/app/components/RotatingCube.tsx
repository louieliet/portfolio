'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

const RotatingCubeInner = ({ containerId }: { containerId: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [isVisible, setIsVisible] = useState(false)

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

  useFrame(() => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.x += 0.0015
      meshRef.current.rotation.z += 0.002
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={2.5}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        wireframe 
        color="#CCCCCC" 
        metalness={0.8}
        roughness={0.2}
        emissive="#333333"
      />
    </mesh>
  )
}

const RotatingCube = ({ containerId = "activities" }: { containerId?: string }) => {
  return (
    <Canvas
      className="w-full h-full opacity-20 pointer-events-none"
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 5]} intensity={2.0} />
      <RotatingCubeInner containerId={containerId} />
    </Canvas>
  )
}

export default RotatingCube