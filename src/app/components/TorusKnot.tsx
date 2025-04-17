'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const RotatingTorusKnot = () => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      meshRef.current.rotation.x += 0.001
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[2.8, 0.7, 200, 24]} />
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

const TorusKnot = () => {
  return (
    <Canvas
      className="w-full h-full opacity-20 pointer-events-none"
      camera={{ position: [0, 0, 3], fov: 50 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 5]} intensity={2.0} />
      <RotatingTorusKnot />
    </Canvas>
  )
}

export default TorusKnot