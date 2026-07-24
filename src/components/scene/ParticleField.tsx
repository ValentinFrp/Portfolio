"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { introState } from "@/lib/introState";

const SPHERE_COUNT = 4600;
const RING_COUNT = 1800;
const MOON1_COUNT = 700;
const MOON2_COUNT = 500;
const COUNT = SPHERE_COUNT + RING_COUNT + MOON1_COUNT + MOON2_COUNT;
const COLS = 100;
const ROWS = 76;

const vertexShader = /* glsl */ `
  attribute vec3 aScatter;
  attribute vec3 aPlanet;
  attribute float aBody;
  attribute float aOffset;
  attribute float aSignal;
  uniform float uTime;
  uniform float uProgress;
  uniform float uSpawn;
  varying float vSignal;
  varying float vAlpha;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
  }

  void main() {
    float s = smoothstep(aOffset - 0.15, aOffset, uSpawn);
    float g = clamp(uProgress * 1.3 - aOffset * 0.3, 0.0, 1.0);
    g = g * g * (3.0 - 2.0 * g);

    vec3 world;
    if (aBody < 0.5) {
      world = rotY(aPlanet, uTime * 0.08);
    } else if (aBody < 1.5) {
      world = rotY(aPlanet, uTime * 0.16);
    } else if (aBody < 2.5) {
      float t = uTime * 0.22 + 2.0;
      vec3 center = vec3(cos(t) * 5.6, sin(t * 0.7) * 1.1, sin(t) * 5.6 * 0.55);
      world = rotY(aPlanet, uTime * 0.35) + center;
    } else {
      float t = -uTime * 0.15 + 0.7;
      vec3 center = vec3(cos(t) * 7.1, sin(t * 0.9 + 1.0) * 1.4, sin(t) * 7.1 * 0.55);
      world = rotY(aPlanet, uTime * 0.4) + center;
    }

    vec3 pos = mix(mix(aScatter, world, s), position, g);
    float wobble = (1.0 - s) * 0.5 + 0.04;
    pos.x += sin(uTime * 0.38 + aOffset * 43.0) * wobble;
    pos.y += cos(uTime * 0.31 + aOffset * 71.0) * wobble;
    pos.z += sin(uTime * 0.47 + aOffset * 57.0) * wobble * 0.7;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = mix(12.0, 27.0, min(aSignal, 1.0));
    gl_PointSize = size * max(s, 0.15) / max(-mv.z, 0.1);
    vSignal = aSignal;
    vAlpha = mix(0.12, 0.55 + 0.45 * g, s);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vSignal;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    if (a < 0.002) discard;
    vec3 base = vec3(0.64, 0.58, 0.76);
    vec3 violet = vec3(0.63, 0.42, 1.0);
    vec3 magenta = vec3(0.89, 0.31, 0.85);
    vec3 accent = mix(violet, magenta, step(1.5, vSignal));
    vec3 color = mix(base, accent, clamp(vSignal, 0.0, 1.0));
    gl_FragColor = vec4(color, a);
  }
`;

function sphereSurface(
  out: Float32Array,
  index: number,
  pointIndex: number,
  total: number,
  radius: number,
  jitter: number
) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const t = (pointIndex + 0.5) / total;
  const y = 1 - 2 * t;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const a = golden * pointIndex;
  const bump = radius + (Math.random() - 0.5) * jitter;
  out[index * 3] = Math.cos(a) * r * bump;
  out[index * 3 + 1] = y * bump;
  out[index * 3 + 2] = Math.sin(a) * r * bump;
}

function buildGeometry() {
  const targets = new Float32Array(COUNT * 3);
  const scatters = new Float32Array(COUNT * 3);
  const planets = new Float32Array(COUNT * 3);
  const bodies = new Float32Array(COUNT);
  const offsets = new Float32Array(COUNT);
  const signals = new Float32Array(COUNT);

  const ringTilt = 0.5;

  for (let i = 0; i < COUNT; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    targets[i * 3] = (col / (COLS - 1) - 0.5) * 16;
    targets[i * 3 + 1] = (row / (ROWS - 1) - 0.5) * 9;
    targets[i * 3 + 2] = 0;

    const radius = 4 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    scatters[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    scatters[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    scatters[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 2;

    let accentChance = 0.05;

    if (i < SPHERE_COUNT) {
      sphereSurface(planets, i, i, SPHERE_COUNT, 2.3, 0.2);
      bodies[i] = 0;
      offsets[i] = Math.random() * 0.55;
    } else if (i < SPHERE_COUNT + MOON1_COUNT) {
      const j = i - SPHERE_COUNT;
      sphereSurface(planets, i, j, MOON1_COUNT, 0.55, 0.08);
      bodies[i] = 2;
      offsets[i] = 0.56 + Math.random() * 0.12;
      accentChance = 0.16;
    } else if (i < SPHERE_COUNT + MOON1_COUNT + MOON2_COUNT) {
      const j = i - SPHERE_COUNT - MOON1_COUNT;
      sphereSurface(planets, i, j, MOON2_COUNT, 0.4, 0.06);
      bodies[i] = 3;
      offsets[i] = 0.66 + Math.random() * 0.1;
      accentChance = 0.2;
    } else {
      const ringA = Math.random() * Math.PI * 2;
      const ringR = 3.2 + Math.pow(Math.random(), 1.6) * 1.5;
      const x = Math.cos(ringA) * ringR;
      const y = (Math.random() - 0.5) * 0.12;
      const z = Math.sin(ringA) * ringR;
      planets[i * 3] = x;
      planets[i * 3 + 1] = y * Math.cos(ringTilt) - z * Math.sin(ringTilt) * 0.35;
      planets[i * 3 + 2] = y * Math.sin(ringTilt) + z * Math.cos(ringTilt);
      bodies[i] = 1;
      offsets[i] = 0.78 + Math.random() * 0.22;
      accentChance = 0.08;
    }

    const roll = Math.random();
    signals[i] = roll < 0.012 ? 2 : roll < accentChance ? 1 : 0;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(targets, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatters, 3));
  geometry.setAttribute("aPlanet", new THREE.BufferAttribute(planets, 3));
  geometry.setAttribute("aBody", new THREE.BufferAttribute(bodies, 1));
  geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
  geometry.setAttribute("aSignal", new THREE.BufferAttribute(signals, 1));
  return geometry;
}

function Particles({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const progressRef = useRef(0);
  const spawnRef = useRef(0);

  const geometry = useMemo(buildGeometry, []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uSpawn: { value: 0 },
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
      material.uniforms.uSpawn.value = introState.done ? 1 : 0;
      material.uniforms.uProgress.value = scrollTarget;
      state.camera.position.z = 9;
      return;
    }

    const ease = 1 - Math.exp(-3.5 * delta);
    progressRef.current += (scrollTarget - progressRef.current) * ease;
    spawnRef.current +=
      (introState.progress - spawnRef.current) * (1 - Math.exp(-1.7 * delta));

    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProgress.value = progressRef.current;
    material.uniforms.uSpawn.value = spawnRef.current;

    const dolly = spawnRef.current * spawnRef.current * (3 - 2 * spawnRef.current);
    state.camera.position.z = 12.5 - 3.5 * dolly;

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
        camera={{ position: [0, 0, 12.5], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Particles reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
