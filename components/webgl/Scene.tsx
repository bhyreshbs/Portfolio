"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import FloatingGlassBlobs from "./FloatingGlassBlobs";
import FluidSimulation from "./FluidSimulation";
import GridBackground from "./GridBackground";
import FluidParticles from "./FluidParticles";
import { FluidRefractionEffect } from "./FluidRefractionEffect";
import * as THREE from "three";

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 2]} // Support for retina displays, capped at 2 for performance
      >
        <color attach="background" args={["#050505"]} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        {/* Fluid Interaction Simulator (Invisible computation) */}
        <FluidSimulation />

        {/* WebGL Background Grid (so it can be refracted) */}
        <GridBackground />

        {/* Ambient Fluid Particles */}
        <FluidParticles count={3000} />

        {/* Floating Liquid Glass Objects */}
        <FloatingGlassBlobs />
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} color="#ffffff" />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} color="#7b61ff" />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[5, 1, -1]} scale={2} color="#00f0ff" />
            <Lightformer form="ring" intensity={1} rotation-y={Math.PI / 2} position={[0, 0, -5]} scale={10} color="#ffffff" />
          </group>
        </Environment>

        {/* Post Processing for Cinematic Look & Fluid Refraction */}
        <EffectComposer>
          {/* Custom Fluid Refraction Pass */}
          <FluidRefractionEffect refractionStrength={0.2} />
          
          <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={1.5} 
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.002, 0.002)}
          />
          <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
