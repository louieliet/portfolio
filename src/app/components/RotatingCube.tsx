'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const RotatingCubeInner = () => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
      meshRef.current.rotation.x += 0.0005
      meshRef.current.rotation.z += 0.0008
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

const RotatingCube = () => {
  return (
    <Canvas
      className="w-full h-full opacity-20 pointer-events-none"
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 5]} intensity={2.0} />
      <RotatingCubeInner />
    </Canvas>
  )
}

export default RotatingCube