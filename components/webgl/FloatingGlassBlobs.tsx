"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";

export default function FloatingGlassBlobs() {
  const meshRef = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);
  const meshRef3 = useRef<THREE.Mesh>(null);
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
  });

  const materialProps = {
    transmission: 1,
    thickness: 1.5,
    roughness: 0.1,
    ior: 1.5,
    chromaticAberration: 0.1,
    backside: true,
    transparent: true,
    distortion: 0.2,
    distortionScale: 0.5,
    temporalDistortion: 0.1,
    color: "#ffffff",
  };

  return (
    <group scale={responsiveScale}>
      {/* Main Center Glass Blob */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Icosahedron ref={meshRef} args={[2.5, 4]} position={[0, 0, 0]}>
          <MeshTransmissionMaterial {...materialProps} />
        </Icosahedron>
      </Float>

      {/* Secondary Blob */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <Icosahedron ref={meshRef2} args={[1.5, 3]} position={[-2, 2, -2]}>
          <MeshTransmissionMaterial {...materialProps} />
        </Icosahedron>
      </Float>

      {/* Tertiary Blob */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={3}>
        <Icosahedron ref={meshRef3} args={[2, 3]} position={[3, -2, -4]}>
          <MeshTransmissionMaterial {...materialProps} />
        </Icosahedron>
      </Float>
    </group>
  );
}
