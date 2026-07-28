"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Global reference for other shaders (refraction, particles, centerpiece) to read the fluid displacement
export const fluidState = {
  texture: null as THREE.Texture | null,
};

const SIMULATION_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const SIMULATION_FRAGMENT_SHADER = `
  uniform sampler2D tDiffuse;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec2 uMouseVelocity;
  uniform float uRadius;
  uniform float uViscosity;
  uniform float uAspect;
  uniform bool uIsMouseMoved;
  
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 texel = 1.0 / uResolution;

    // tDiffuse R channel = height at t-1
    // tDiffuse G channel = height at t-2

    // Read neighbors (t-1)
    float p21 = texture2D(tDiffuse, uv + vec2(texel.x, 0.0)).r;
    float p01 = texture2D(tDiffuse, uv - vec2(texel.x, 0.0)).r;
    float p12 = texture2D(tDiffuse, uv + vec2(0.0, texel.y)).r;
    float p10 = texture2D(tDiffuse, uv - vec2(0.0, texel.y)).r;

    // Read center (t-1 and t-2)
    vec2 center = texture2D(tDiffuse, uv).rg;
    float prev = center.r;
    float prevPrev = center.g;

    // Wave propagation: new = (neighbors / 2) - previous_previous
    float current = (p21 + p01 + p12 + p10) * 0.5 - prevPrev;

    // Damping / Viscosity
    current *= uViscosity;

    // Mouse Interaction
    if (uIsMouseMoved) {
      vec2 p = uv - uMouse;
      p.x *= uAspect; // Correct aspect ratio for circular ripples
      
      float dist = length(p);
      float drop = max(0.0, 1.0 - dist / uRadius);
      drop = 0.5 - cos(drop * 3.14159) * 0.5; // smoothstep-like
      
      // Inject energy based on velocity magnitude
      float force = length(uMouseVelocity) * 20.0;
      current -= drop * force;
    }

    // Pass the new current height into R, and the OLD current (t-1) into G
    gl_FragColor = vec4(current, prev, 0.0, 1.0);
  }
`;

export default function FluidSimulation() {
  const { gl, size } = useThree();

  // Create Ping-Pong Render Targets
  const { rtA, rtB } = useMemo(() => {
    // 512x512 is plenty for fluid simulation
    const resX = 512;
    const resY = 512;
    const options: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType, // For precision without banding
      depthBuffer: false,
      stencilBuffer: false,
    };
    return {
      rtA: new THREE.WebGLRenderTarget(resX, resY, options),
      rtB: new THREE.WebGLRenderTarget(resX, resY, options),
    };
  }, []);

  const fboRead = useRef(rtA);
  const fboWrite = useRef(rtB);

  // Full screen quad for computing simulation
  const simulationMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: SIMULATION_VERTEX_SHADER,
      fragmentShader: SIMULATION_FRAGMENT_SHADER,
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new THREE.Vector2(512, 512) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) },
        uRadius: { value: 0.035 },
        uViscosity: { value: 0.985 }, // Energy retention (close to 1 means ripples last longer)
        uAspect: { value: 1.0 },
        uIsMouseMoved: { value: false },
      },
      depthWrite: false,
      depthTest: false,
    });
  }, []);

  const quad = useMemo(() => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simulationMaterial);
    mesh.frustumCulled = false;
    return mesh;
  }, [simulationMaterial]);

  const scene = useMemo(() => {
    const s = new THREE.Scene();
    s.add(quad);
    return s;
  }, [quad]);

  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  // Mouse Tracking State
  const mouseState = useRef({
    current: new THREE.Vector2(0.5, 0.5),
    prev: new THREE.Vector2(0.5, 0.5),
    velocity: new THREE.Vector2(0, 0),
    isMoved: false,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      const x = clientX / window.innerWidth;
      const y = 1.0 - clientY / window.innerHeight; // WebGL Y is inverted

      mouseState.current.prev.copy(mouseState.current.current);
      mouseState.current.current.set(x, y);
      
      const vx = x - mouseState.current.prev.x;
      const vy = y - mouseState.current.prev.y;
      mouseState.current.velocity.set(vx, vy);
      mouseState.current.isMoved = true;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, []);

  useFrame(() => {
    // 1. Update Uniforms
    simulationMaterial.uniforms.uAspect.value = size.width / size.height;
    simulationMaterial.uniforms.uMouse.value.copy(mouseState.current.current);
    
    // Decay velocity quickly
    mouseState.current.velocity.multiplyScalar(0.2);
    if (mouseState.current.velocity.length() < 0.0001) {
      mouseState.current.isMoved = false;
    }
    
    simulationMaterial.uniforms.uMouseVelocity.value.copy(mouseState.current.velocity);
    simulationMaterial.uniforms.uIsMouseMoved.value = mouseState.current.isMoved;

    // 2. Setup Ping-Pong
    // Read from read buffer, write to write buffer
    simulationMaterial.uniforms.tDiffuse.value = fboRead.current.texture;

    // Render using our custom orthographic camera and scene
    gl.setRenderTarget(fboWrite.current);
    gl.clear();
    gl.render(scene, camera);
    
    // Swap buffers
    const temp = fboRead.current;
    fboRead.current = fboWrite.current;
    fboWrite.current = temp;

    // Restore render target for the rest of the application
    gl.setRenderTarget(null);

    // Export texture for other materials to use
    fluidState.texture = fboRead.current.texture;
  });

  return null;
}
