'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// ─── GLSL Shaders ────────────────────────────────────────────────────────────
// Este shader implementa un "Domain Warping" sobre Simplex Noise 3D.
// Genera vórtices y turbulencias (estilo humo/tinta en agua) en lugar 
// del movimiento de escalado plano que tenías antes.

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // ── Simplex 3D Noise ───────────────────────────────────────────────────────
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vec2 uv = vUv;
    
    // El ratón impacta sutilmente el UV, arrastrando el fluido
    vec2 mouseOffset = uMouse * 0.04;
    uv += mouseOffset;

    float t = uTime * 0.12;
    
    // Domain Warping: Usar ruido para distorsionar las coordenadas del siguiente ruido
    vec2 q = vec2(
      snoise(vec3(uv * 1.2, t)),
      snoise(vec3(uv * 1.2 + vec2(5.2, 1.3), t * 1.1))
    );

    vec2 r = vec2(
      snoise(vec3(uv * 2.0 + q * 2.0 + vec2(1.7, 9.2), t * 0.9)),
      snoise(vec3(uv * 2.0 + q * 2.0 + vec2(8.3, 2.8), t * 1.2))
    );

    float fluid = snoise(vec3(uv * 1.5 + r * 1.5, t));
    
    // Mapeo al rango [0, 1]
    fluid = fluid * 0.5 + 0.5;

    // Curva de contraste para "definir" el halo de luz como en la ref de Baffait
    float intensity = smoothstep(0.2, 0.85, fluid);
    intensity = pow(intensity, 1.6);

    // ── Paleta de Colores Cinemática ─────────────────────────────────────────
    // Fondo: Negro puro
    vec3 bgCol = vec3(0.0, 0.0, 0.0);
    
    // Tono medio: Beige oscuro / Taupe (cálido pero neutral)
    vec3 midCol = vec3(0.25, 0.22, 0.18); 
    
    // Tono alto: Beige claro
    vec3 highCol = vec3(0.75, 0.68, 0.58);

    vec3 finalCol = mix(bgCol, midCol, smoothstep(0.0, 0.5, intensity));
    finalCol = mix(finalCol, highCol, smoothstep(0.4, 1.0, intensity));

    // Reducimos la intensidad visual a la mitad (50%) fundiéndola con el negro
    finalCol = mix(bgCol, finalCol, 0.50);

    // Viñeta nativa en el shader para asegurar oscuridad en los bordes
    float dist = length(vUv - 0.5);
    finalCol *= smoothstep(0.8, 0.3, dist);

    gl_FragColor = vec4(finalCol, 1.0);
  }
`;

function ShaderMesh() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Guardamos posiciones de ratón para interpolación suave (lerp)
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));
  const isPaused = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  // Trackeamos el ratón a nivel window para que el Canvas no necesite robar
  // pointer-events al DOM que está por encima.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalización estricta [-1, 1]
      targetMouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const syncPausedState = () => {
      isPaused.current = document.body.classList.contains('hero-background-paused');
    };

    syncPausedState();

    const observer = new MutationObserver(syncPausedState);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useFrame(({ clock }) => {
    if (!materialRef.current || isPaused.current) return;

    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();

    // Amortiguación física (spring damping simulado con lerp)
    currentMouse.current.lerp(targetMouse.current, 0.04);
    materialRef.current.uniforms.uMouse.value.copy(currentMouse.current);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function HeroBackground() {
  return (
    // Z-Index 0 y pointer-events-none aseguran que no bloquee selecciones de texto
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], near: 0, far: 2 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <ShaderMesh />
        
        <EffectComposer multisampling={0}>
          {/* Ruido de película para unificar la iluminación (dithering) y evitar banding */}
          <Noise
            premultiply={false}
            blendFunction={BlendFunction.ADD}
            opacity={0.15}
          />
          <Vignette
            offset={0.3}
            darkness={0.65}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
