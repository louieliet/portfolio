'use client'

import { Canvas } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null!)
  const count = 1500

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01
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

const FloatingParticles = () => {
  return (
    <Canvas className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-[0.06]">
      <ParticleField />
    </Canvas>
  )
}

export default FloatingParticles