"use client";

import { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";
import * as THREE from "three";
import { fluidState } from "./FluidSimulation";

const fragmentShader = `
uniform sampler2D tFluid;
uniform float uRefractionStrength;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Read fluid height (R channel)
  float h = texture2D(tFluid, uv).r;
  
  // Calculate normals via finite difference for refraction
  vec2 texel = 1.0 / resolution.xy;
  float hx = texture2D(tFluid, uv + vec2(texel.x, 0.0)).r;
  float hy = texture2D(tFluid, uv + vec2(0.0, texel.y)).r;
  
  vec2 delta = vec2(hx - h, hy - h);
  
  // Refract UV based on gradient
  vec2 refractedUv = uv - delta * uRefractionStrength;
  
  // Ensure we don't sample outside bounds (optional, but good for clamp-to-edge)
  refractedUv = clamp(refractedUv, 0.0, 1.0);
  
  // Sample original scene with refracted UV
  vec4 color = texture2D(inputBuffer, refractedUv);
  
  // Optional: add a slight specular highlight based on wave peaks/valleys
  float specular = max(0.0, delta.x + delta.y) * 2.0;
  color.rgb += specular * vec3(0.5, 0.8, 1.0) * 0.5;

  outputColor = color;
}
`;

class FluidRefractionImpl extends Effect {
  constructor({ refractionStrength = 0.15 } = {}) {
    super("FluidRefractionEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["tFluid", new THREE.Uniform(null)],
        ["uRefractionStrength", new THREE.Uniform(refractionStrength)],
      ]),
    });
  }

  update(renderer: any, inputBuffer: any, deltaTime: any) {
    if (fluidState.texture) {
      this.uniforms.get("tFluid")!.value = fluidState.texture;
    }
  }
}

// React wrapper
export const FluidRefractionEffect = forwardRef(({ refractionStrength = 0.15 }: { refractionStrength?: number }, ref) => {
  const effect = useMemo(() => new FluidRefractionImpl({ refractionStrength }), [refractionStrength]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});

FluidRefractionEffect.displayName = "FluidRefractionEffect";
