'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useIsExperienceSection } from '@/utils/sectionUtils'

const CrystalSphere = ({ containerId }: { containerId: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [isVisible, setIsVisible] = useState(false)
  
  // Performance optimization - pause animation when not visible
  useEffect(() => {
    const targetSection = document.getElementById(containerId) || 
                          document.querySelector(`[data-section-id="${containerId}"]`) ||
                          document.querySelector(`[data-section-type="${containerId}"]`)
    
    if (!targetSection) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Update visibility state based on intersection
        setIsVisible(entries[0].isIntersecting)
      },
      { 
        threshold: 0.1,
        rootMargin: '100px 0px' // Add some margin to make detection more reliable
      }
    )
    
    // Start observing the target section
    observer.observe(targetSection)
    
    // Also set up window scroll event as a backup
    const checkVisibility = () => {
      if (!targetSection) return
      
      const rect = targetSection.getBoundingClientRect()
      const isInView = 
        rect.top < window.innerHeight &&
        rect.bottom > 0
      
      if (isInView !== isVisible) {
        setIsVisible(isInView)
      }
    }
    
    window.addEventListener('scroll', checkVisibility, { passive: true })
    
    // Initialize visibility
    checkVisibility()
    
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', checkVisibility)
    }
  }, [containerId, isVisible])

  useFrame(() => {
    if (isVisible && meshRef.current) {
      // Fixed rotation speed that doesn't depend on frame rate
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x += 0.0025
    }
  })

  return (
    <mesh ref={meshRef} scale={2.5} position={[0, -0.5, 0]}>
      <icosahedronGeometry args={[1, 3]} />
      <meshStandardMaterial
        color="#CCCCCC"
        wireframe
        opacity={0.3}
        transparent
        metalness={0.8}
        roughness={0.2}
        emissive="#555555"
      />
    </mesh>
  )
}

interface SphereBackgroundProps {
  containerId?: string;
  debug?: boolean;
}

const SphereBackground = ({ containerId = "experience", debug = false }: SphereBackgroundProps) => {
  const [isInView, setIsInView] = useState(false);
  // Use our custom hook to check if we're in the Experience section
  const isExperienceSection = useIsExperienceSection();
  
  // Effect for visibility tracking - this runs unconditionally
  useEffect(() => {
    // Create a special check to only show in Experience section
    const checkVisibility = () => {
      // First check with our custom hook if we're in the Experience section
      if (!isExperienceSection) {
        setIsInView(false);
        return;
      }
      
      // Additional targeted check for the specific element
      const targetElement = document.querySelector('#experience, .experience-section, [data-section-id="experience"], [data-section-type="experience"]');
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const isVisible = 
          rect.top < window.innerHeight + 100 && 
          rect.bottom > -100;
        
        setIsInView(isVisible);
      } else {
        setIsInView(false);
      }
    };
    
    // Run on scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    
    // Also run periodically to catch any edge cases
    const intervalId = setInterval(checkVisibility, 500);
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
      clearInterval(intervalId);
    };
  }, [containerId, isExperienceSection]);
  
  // Show debug information if requested
  if (debug) {
    return (
      <>
        <div className="fixed top-12 left-0 bg-black/80 text-white p-2 z-50 text-xs">
          <div className={isExperienceSection ? "text-green-400" : "text-red-400"}>
            SphereBackground {isExperienceSection ? 'Active' : 'Hidden'}
          </div>
          <div>isExperienceSection: {isExperienceSection ? 'true' : 'false'}</div>
          <div>isInView: {isInView ? 'true' : 'false'}</div>
        </div>
        
        {isExperienceSection && isInView && (
          <Canvas
            className="w-full h-full opacity-25 pointer-events-none z-0"
            camera={{ position: [0, -1, 6.5], fov: 50 }}
            style={{ position: 'relative', top: '50px' }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[2, 2, 5]} intensity={2.0} />
            <CrystalSphere containerId={containerId} />
          </Canvas>
        )}
      </>
    );
  }
  
  // Only render the sphere if we're in the Experience section and it's in view
  if (!isExperienceSection || !isInView) {
    if (debug) {
      return (
        <div className="fixed top-12 left-0 bg-black/80 text-white p-2 z-50 text-xs">
          <div className="text-red-400">
            SphereBackground Hidden
          </div>
          <div>isExperienceSection: {isExperienceSection ? 'true' : 'false'}</div>
          <div>isInView: {isInView ? 'true' : 'false'}</div>
        </div>
      );
    }
    return null;
  }
  
  return (
    <Canvas
      className="w-full h-full opacity-25 pointer-events-none z-0"
      camera={{ position: [0, -1, 6.5], fov: 50 }}
      style={{ position: 'relative' }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[2, 2, 5]} intensity={2.0} />
      <CrystalSphere containerId={containerId} />
    </Canvas>
  );
}

export default SphereBackground