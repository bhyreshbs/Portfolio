"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { fluidState } from "./FluidSimulation";

export default function FloatingGlassBlobs() {
  const meshRef = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);
  const meshRef3 = useRef<THREE.Mesh>(null);
  
  const materialRef = useRef<any>(null);
  const materialRef2 = useRef<any>(null);
  const materialRef3 = useRef<any>(null);
  
  const { viewport, pointer } = useThree();

  // Handle responsive scaling
  const responsiveScale = viewport.width < 5 ? 0.6 : 1;

  useFrame((state, delta) => {
    // Parallax mouse effect
    const targetX = (pointer.x * viewport.width) / 8;
    const targetY = (pointer.y * viewport.height) / 8;

    if (meshRef.current) {
      easing.damp3(meshRef.current.position, [targetX, targetY, 0], 0.25, delta);
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }

    if (meshRef2.current) {
      easing.damp3(meshRef2.current.position, [targetX * -0.5 - 2, targetY * -0.5 + 2, -2], 0.3, delta);
      meshRef2.current.rotation.x -= delta * 0.1;
      meshRef2.current.rotation.y += delta * 0.1;
    }
    
    if (meshRef3.current) {
      easing.damp3(meshRef3.current.position, [targetX * 0.3 + 3, targetY * 0.3 - 2, -4], 0.35, delta);
      meshRef3.current.rotation.x += delta * 0.05;
      meshRef3.current.rotation.z -= delta * 0.1;
    }

    // Update Fluid Texture for displacement
    if (fluidState.texture) {
      const tex = fluidState.texture;
      if (materialRef.current && materialRef.current.uniforms?.tFluid) {
        materialRef.current.uniforms.tFluid.value = tex;
      }
      if (materialRef2.current && materialRef2.current.uniforms?.tFluid) {
        materialRef2.current.uniforms.tFluid.value = tex;
      }
      if (materialRef3.current && materialRef3.current.uniforms?.tFluid) {
        materialRef3.current.uniforms.tFluid.value = tex;
      }
    }
  });

  const handleBeforeCompile = (shader: any) => {
    shader.uniforms.tFluid = { value: null };
    
    // Inject uniform for fluid texture
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      uniform sampler2D tFluid;
      `
    );

    // Calculate screen UV locally and apply displacement
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      vec4 clipPos = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      vec2 screenUV = (clipPos.xy / clipPos.w) * 0.5 + 0.5;
      
      // Read fluid height
      float fluidHeight = 0.0;
      if (screenUV.x >= 0.0 && screenUV.x <= 1.0 && screenUV.y >= 0.0 && screenUV.y <= 1.0) {
        fluidHeight = texture2D(tFluid, screenUV).r;
      }
      
      // Displace vertex along normal
      transformed += normal * fluidHeight * 2.0;
      `
    );

    // Optionally pass to fragment if we want normal recalculation, 
    // but the transmission shader usually relies on the vNormal from vertex.
    // The vertex displacement itself creates a physical ripple on the glass.
  };

  const materialProps = {
    transmission: 1,
    thickness: 1.5,
    roughness: 0.1,
    ior: 1.5,
    chromaticAberration: 0.1,
    backside: true,
    transparent: true,
    distortion: 0.2, // Native distortion
    distortionScale: 0.5,
    temporalDistortion: 0.1,
    color: "#ffffff",
  };

  return (
    <group scale={responsiveScale}>
      {/* Main Center Glass Blob */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Icosahedron ref={meshRef} args={[2.5, 32]} position={[0, 0, 0]}>
          <MeshTransmissionMaterial 
            ref={(mat: any) => {
              if (mat && !mat.userData.compiled) {
                const original = mat.onBeforeCompile.bind(mat);
                mat.onBeforeCompile = (shader: any, renderer: any) => {
                  original(shader, renderer);
                  handleBeforeCompile(shader);
                  materialRef.current = shader;
                };
                mat.userData.compiled = true;
              }
            }}
            {...materialProps} 
          />
        </Icosahedron>
      </Float>

      {/* Secondary Blob */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <Icosahedron ref={meshRef2} args={[1.5, 32]} position={[-2, 2, -2]}>
          <MeshTransmissionMaterial 
            ref={(mat: any) => {
              if (mat && !mat.userData.compiled) {
                const original = mat.onBeforeCompile.bind(mat);
                mat.onBeforeCompile = (shader: any, renderer: any) => {
                  original(shader, renderer);
                  handleBeforeCompile(shader);
                  materialRef2.current = shader;
                };
                mat.userData.compiled = true;
              }
            }}
            {...materialProps} 
          />
        </Icosahedron>
      </Float>

      {/* Tertiary Blob */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={3}>
        <Icosahedron ref={meshRef3} args={[2, 32]} position={[3, -2, -4]}>
          <MeshTransmissionMaterial 
            ref={(mat: any) => {
              if (mat && !mat.userData.compiled) {
                const original = mat.onBeforeCompile.bind(mat);
                mat.onBeforeCompile = (shader: any, renderer: any) => {
                  original(shader, renderer);
                  handleBeforeCompile(shader);
                  materialRef3.current = shader;
                };
                mat.userData.compiled = true;
              }
            }}
            {...materialProps} 
          />
        </Icosahedron>
      </Float>
    </group>
  );
}
