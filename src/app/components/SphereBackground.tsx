'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const CrystalSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    meshRef.current.rotation.y += 0.002
    meshRef.current.rotation.x += 0.001
  })

  return (
    <mesh ref={meshRef} scale={2.0}>
      <icosahedronGeometry args={[1, 3]} />
      <meshStandardMaterial
        color="#CCCCCC"
        wireframe
        opacity={0.5}
        transparent
        metalness={0.8}
        roughness={0.2}
        emissive="#555555"
      />
    </mesh>
  )
}

const SphereBackground = () => {
  return (
    <Canvas
      className="w-full h-full opacity-20 pointer-events-none"
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 5]} intensity={2.0} />
      <CrystalSphere />
    </Canvas>
  )
}

export default SphereBackground