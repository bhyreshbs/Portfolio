"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fluidState } from "./FluidSimulation";

const particleVertexShader = `
  uniform sampler2D tFluid;
  uniform float uTime;
  
  attribute float randomOffset;
  attribute vec3 originalPosition;

  varying float vAlpha;

  void main() {
    vec3 pos = originalPosition;
    
    // Slow natural drifting
    pos.x += sin(uTime * 0.2 + randomOffset) * 0.5;
    pos.y += cos(uTime * 0.2 + randomOffset) * 0.5;

    // Map world position to clip-space UV to sample fluid texture
    vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vec2 screenUV = (clipPos.xy / clipPos.w) * 0.5 + 0.5;
    
    float fluidHeight = 0.0;
    vec2 fluidGradient = vec2(0.0);
    
    if (screenUV.x >= 0.0 && screenUV.x <= 1.0 && screenUV.y >= 0.0 && screenUV.y <= 1.0) {
      fluidHeight = texture2D(tFluid, screenUV).r;
      
      float hx = texture2D(tFluid, screenUV + vec2(0.01, 0.0)).r;
      float hy = texture2D(tFluid, screenUV + vec2(0.0, 0.01)).r;
      fluidGradient = vec2(hx - fluidHeight, hy - fluidHeight);
    }

    // Apply displacement
    pos.z += fluidHeight * 2.0;
    pos.x -= fluidGradient.x * 20.0;
    pos.y -= fluidGradient.y * 20.0;
    
    // Twinkle effect
    vAlpha = (sin(uTime * 2.0 + randomOffset) * 0.5 + 0.5) * 0.6;
    vAlpha += abs(fluidHeight) * 2.0;
    
    // Final position — use modelViewMatrix on pos directly (Points, not InstancedMesh)
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = (15.0 / -mvPosition.z) * (1.0 + fluidHeight * 5.0);
  }
`;

const particleFragmentShader = `
  varying float vAlpha;
  
  void main() {
    // Soft circular particle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft edge glow
    float alpha = (0.5 - dist) * 2.0 * vAlpha;
    gl_FragColor = vec4(0.8, 0.9, 1.0, alpha);
  }
`;

export default function FluidParticles({ count = 2000 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    // Original positions (dummy since we use InstancedMesh)
    // Actually, for InstancedMesh with ShaderMaterial, we don't need a buffer geometry with thousands of verts.
    // Wait, gl_PointSize only works on Points, not InstancedMesh!
    // For InstancedMesh, we use a small plane or sphere geometry.
    // Let's use Points instead of InstancedMesh for thousands of particles, it's way faster and simpler!
    
    const positions = new Float32Array(count * 3);
    const randomOffsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across a wide area
      positions[i * 3] = (Math.random() - 0.5) * 40;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5; // z
      
      randomOffsets[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('originalPosition', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 1));
    
    return geo;
  }, [count]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        tFluid: { value: null },
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      if (fluidState.texture) {
        materialRef.current.uniforms.tFluid.value = fluidState.texture;
      }
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial ref={materialRef} attach="material" {...material} />
    </points>
  );
}
