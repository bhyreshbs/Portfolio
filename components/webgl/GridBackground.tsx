"use client";

import { useMemo, useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export default function GridBackground() {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uColor: { value: new THREE.Color("#ffffff") },
        uOpacity: { value: 0.03 },
        uGridSize: { value: 64.0 }, 
        uResolution: { value: new THREE.Vector2(size.width, size.height) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uGridSize;
        uniform vec2 uResolution;
        
        void main() {
          // Use exact screen pixels
          vec2 px = gl_FragCoord.xy;
          
          // Grid lines every uGridSize pixels
          vec2 grid = abs(fract(px / uGridSize - 0.5) - 0.5) / fwidth(px / uGridSize);
          float line = min(grid.x, grid.y);
          
          // Anti-aliased line drawing
          float alpha = 1.0 - min(line, 1.0);
          
          // Radial mask (ellipse 60% 60% at 50% 50%) based on screen center
          vec2 screenUv = px / uResolution;
          vec2 center = vec2(0.5, 0.5);
          vec2 dist = (screenUv - center) / vec2(0.6, 0.6);
          float mask = 1.0 - smoothstep(0.7, 1.0, length(dist));
          
          gl_FragColor = vec4(uColor, alpha * uOpacity * mask);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    }),
    []
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [size]);

  return (
    <mesh position={[0, 0, -20]} scale={[100, 100, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={materialRef} args={[shaderArgs]} />
    </mesh>
  );
}
