"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 6000;
const COLS = 100;
const ROWS = 60;

const vertexShader = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aOffset;
  attribute float aSignal;
  uniform float uTime;
  uniform float uProgress;
  uniform float uReveal;
  varying float vSignal;
  varying float vAlpha;

  void main() {
    float p = clamp(uProgress * 1.3 - aOffset * 0.3, 0.0, 1.0);
    p = p * p * (3.0 - 2.0 * p);
    vec3 pos = mix(aScatter, position, p);
    float wobble = (1.0 - p) * 0.55 + 0.06;
    pos.x += sin(uTime * 0.38 + aOffset * 43.0) * wobble;
    pos.y += cos(uTime * 0.31 + aOffset * 71.0) * wobble;
    pos.z += sin(uTime * 0.47 + aOffset * 57.0) * wobble * 0.7;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = mix(11.0, 24.0, aSignal);
    gl_PointSize = size * uReveal / max(-mv.z, 0.1);
    vSignal = aSignal;
    vAlpha = uReveal * (0.3 + 0.7 * p);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vSignal;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    if (a < 0.002) discard;
    vec3 fog = vec3(0.72, 0.76, 0.83);
    vec3 signal = vec3(1.0, 0.706, 0.329);
    vec3 color = mix(fog, signal, vSignal);
    gl_FragColor = vec4(color, a);
  }
`;

function buildGeometry() {
  const targets = new Float32Array(COUNT * 3);
  const scatters = new Float32Array(COUNT * 3);
  const offsets = new Float32Array(COUNT);
  const signals = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    targets[i * 3] = (col / (COLS - 1) - 0.5) * 16;
    targets[i * 3 + 1] = (row / (ROWS - 1) - 0.5) * 9;
    targets[i * 3 + 2] = 0;

    const radius = 4 + Math.random() * 7;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    scatters[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    scatters[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    scatters[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 2;

    offsets[i] = Math.random();
    signals[i] = Math.random() < 0.035 ? 1 : 0;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(targets, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatters, 3));
  geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
  geometry.setAttribute("aSignal", new THREE.BufferAttribute(signals, 1));
  return geometry;
}

function Particles({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const progressRef = useRef(0);
  const revealRef = useRef(0);

  const geometry = useMemo(buildGeometry, []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uReveal: { value: 0 },
    }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    const group = groupRef.current;
    if (!material || !group) return;

    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const scrollTarget = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    if (reducedMotion) {
      material.uniforms.uReveal.value = 1;
      material.uniforms.uProgress.value = scrollTarget;
      return;
    }

    const ease = 1 - Math.exp(-3.5 * delta);
    progressRef.current += (scrollTarget - progressRef.current) * ease;
    revealRef.current += (1 - revealRef.current) * (1 - Math.exp(-1.6 * delta));

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProgress.value = progressRef.current;
    material.uniforms.uReveal.value = revealRef.current;

    const pointer = state.pointer;
    group.rotation.y += (pointer.x * 0.12 - group.rotation.y) * ease;
    group.rotation.x += (-pointer.y * 0.08 - group.rotation.x) * ease;
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function ParticleField() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Particles reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
