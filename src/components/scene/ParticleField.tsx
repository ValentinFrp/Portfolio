"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { introState } from "@/lib/introState";
import { cameraState, journeyState, tunnelAmount } from "@/lib/journey";

const SPHERE_COUNT = 4600;
const RING_COUNT = 1800;
const MOON1_COUNT = 700;
const MOON2_COUNT = 500;
const MOON1_RING_COUNT = 260;
const MOON2_CORE_COUNT = 140;
const BH_DISK_COUNT = 520;
const BH_RING_COUNT = 130;
const COUNT =
  SPHERE_COUNT +
  RING_COUNT +
  MOON1_COUNT +
  MOON2_COUNT +
  MOON1_RING_COUNT +
  MOON2_CORE_COUNT +
  BH_DISK_COUNT +
  BH_RING_COUNT;
const STAR_COUNT = 1600;

const vertexShader = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aBody;
  attribute float aOffset;
  attribute float aSignal;
  uniform float uTime;
  uniform float uSpawn;
  uniform float uTunnel;
  uniform float uWarp;
  varying float vSignal;
  varying float vBody;
  varying float vAlpha;

  vec3 rotY(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
  }

  vec3 rotX(vec3 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
  }

  void main() {
    float s = smoothstep(aOffset - 0.15, aOffset, uSpawn);

    float t1 = uTime * 0.22 + 2.0;
    vec3 moon1 = vec3(cos(t1) * 5.6, sin(t1 * 0.7) * 1.1, sin(t1) * 5.6 * 0.55);
    float t2 = -uTime * 0.15 + 0.7;
    vec3 moon2 = vec3(cos(t2) * 7.1, sin(t2 * 0.9 + 1.0) * 1.4, sin(t2) * 7.1 * 0.55);
    float t3 = uTime * 0.1 + 4.0;
    vec3 hole = vec3(cos(t3) * 8.6, sin(t3 * 0.6 + 2.0) * 0.9, sin(t3) * 8.6 * 0.5);

    vec3 world;
    if (aBody < 0.5) {
      world = rotY(position, uTime * 0.08);
      float r = length(world.xy);
      vec2 outward = r > 0.001 ? world.xy / r : vec2(1.0, 0.0);
      world.xy += outward * uTunnel * max(0.0, 3.0 - r) * 1.15;
    } else if (aBody < 1.5) {
      world = rotY(position, uTime * 0.16);
    } else if (aBody < 2.5) {
      world = rotY(position, uTime * 0.35) + moon1;
    } else if (aBody < 3.5) {
      vec3 breathing = position * (1.0 + 0.07 * sin(uTime * 1.3 + aOffset * 24.0));
      world = rotY(breathing, uTime * 0.4) + moon2;
    } else if (aBody < 4.5) {
      world = rotY(position, uTime * 0.85) + moon1;
    } else if (aBody < 5.5) {
      vec3 pulse = position * (1.0 + 0.3 * sin(uTime * 2.2));
      world = rotY(pulse, uTime * 0.5) + moon2;
    } else {
      float spin = aBody < 6.5 ? 1.3 : 1.9;
      world = rotX(rotY(position, uTime * spin), 1.0) + hole;
    }

    vec3 pos = mix(aScatter, world, s);
    float wobble = (1.0 - s) * 0.5 + 0.04;
    pos.x += sin(uTime * 0.38 + aOffset * 43.0) * wobble;
    pos.y += cos(uTime * 0.31 + aOffset * 71.0) * wobble;
    pos.z += sin(uTime * 0.47 + aOffset * 57.0) * wobble * 0.7;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float jitter = fract(sin(aOffset * 381.29) * 43758.5) - 0.5;
    mv.z += jitter * uWarp * 9.0;
    gl_Position = projectionMatrix * mv;

    float size = mix(12.0, 27.0, min(aSignal, 1.0));
    if (aBody > 4.5 && aBody < 5.5) size = 34.0;
    if (aBody > 6.5) size = 20.0;
    gl_PointSize = min(size * max(s, 0.15) / max(-mv.z, 0.1), 42.0);
    vSignal = aSignal;
    vBody = aBody;
    vAlpha = mix(0.12, 0.6, s) * (1.0 - uWarp * 0.35);
    if (aBody > 5.5) vAlpha = min(vAlpha * 1.6, 0.9);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vSignal;
  varying float vBody;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    if (a < 0.002) discard;
    vec3 base = vec3(0.64, 0.58, 0.76);
    vec3 violet = vec3(0.63, 0.42, 1.0);
    vec3 magenta = vec3(0.89, 0.31, 0.85);
    bool isMoon1 = (vBody > 1.5 && vBody < 2.5) || (vBody > 3.5 && vBody < 4.5);
    bool isMoon2 = (vBody > 2.5 && vBody < 3.5) || (vBody > 4.5 && vBody < 5.5);
    bool isHole = vBody > 5.5;
    if (isMoon1) base = mix(base, violet, 0.4);
    if (isMoon2) base = mix(base, magenta, 0.4);
    if (isHole) base = vBody > 6.5 ? vec3(1.0, 0.94, 0.98) : vec3(0.96, 0.72, 0.9);
    vec3 accent = mix(violet, magenta, step(1.5, vSignal));
    vec3 color = mix(base, accent, clamp(vSignal, 0.0, 1.0));
    gl_FragColor = vec4(color, a);
  }
`;

const starVertexShader = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSpawn;
  uniform float uWarp;
  varying float vAlpha;

  void main() {
    float c = cos(uTime * 0.005);
    float s = sin(uTime * 0.005);
    vec3 pos = vec3(position.x * c + position.z * s, position.y, -position.x * s + position.z * c);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    mv.z += (fract(aSeed * 17.31) - 0.5) * uWarp * 26.0;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min((1.5 + fract(aSeed * 7.7) * 2.2) * 60.0 / max(-mv.z, 0.1), 4.0);
    float twinkle = 0.65 + 0.35 * sin(uTime * 1.6 + aSeed * 90.0);
    vAlpha = smoothstep(0.0, 0.15, uSpawn) * twinkle * (0.5 + uWarp * 0.5);
  }
`;

const starFragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * vAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(vec3(0.85, 0.82, 0.95), a);
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
  const locals = new Float32Array(COUNT * 3);
  const scatters = new Float32Array(COUNT * 3);
  const bodies = new Float32Array(COUNT);
  const offsets = new Float32Array(COUNT);
  const signals = new Float32Array(COUNT);

  const ringTilt = 0.5;

  for (let i = 0; i < COUNT; i++) {
    const radius = 4 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    scatters[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    scatters[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    scatters[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 2;

    let accentChance = 0.05;

    if (i < SPHERE_COUNT) {
      sphereSurface(locals, i, i, SPHERE_COUNT, 2.3, 0.2);
      bodies[i] = 0;
      offsets[i] = Math.random() * 0.55;
    } else if (i < SPHERE_COUNT + MOON1_COUNT) {
      const j = i - SPHERE_COUNT;
      sphereSurface(locals, i, j, MOON1_COUNT, 0.55, 0.08);
      bodies[i] = 2;
      offsets[i] = 0.56 + Math.random() * 0.12;
      accentChance = 0.16;
    } else if (i < SPHERE_COUNT + MOON1_COUNT + MOON2_COUNT) {
      const j = i - SPHERE_COUNT - MOON1_COUNT;
      sphereSurface(locals, i, j, MOON2_COUNT, 0.4, 0.06);
      bodies[i] = 3;
      offsets[i] = 0.66 + Math.random() * 0.1;
      accentChance = 0.2;
    } else if (i < SPHERE_COUNT + MOON1_COUNT + MOON2_COUNT + MOON1_RING_COUNT) {
      const miniTilt = 0.9;
      const ringA = Math.random() * Math.PI * 2;
      const ringR = 0.85 + Math.pow(Math.random(), 1.4) * 0.35;
      const x = Math.cos(ringA) * ringR;
      const y = (Math.random() - 0.5) * 0.05;
      const z = Math.sin(ringA) * ringR;
      locals[i * 3] = x;
      locals[i * 3 + 1] = y * Math.cos(miniTilt) - z * Math.sin(miniTilt);
      locals[i * 3 + 2] = y * Math.sin(miniTilt) + z * Math.cos(miniTilt);
      bodies[i] = 4;
      offsets[i] = 0.6 + Math.random() * 0.12;
      accentChance = 0.25;
    } else if (
      i <
      SPHERE_COUNT + MOON1_COUNT + MOON2_COUNT + MOON1_RING_COUNT + MOON2_CORE_COUNT
    ) {
      const coreR = 0.16 * Math.cbrt(Math.random());
      const coreTheta = Math.random() * Math.PI * 2;
      const corePhi = Math.acos(2 * Math.random() - 1);
      locals[i * 3] = coreR * Math.sin(corePhi) * Math.cos(coreTheta);
      locals[i * 3 + 1] = coreR * Math.sin(corePhi) * Math.sin(coreTheta);
      locals[i * 3 + 2] = coreR * Math.cos(corePhi);
      bodies[i] = 5;
      offsets[i] = 0.68 + Math.random() * 0.1;
      signals[i] = 2;
      continue;
    } else if (
      i <
      SPHERE_COUNT +
        MOON1_COUNT +
        MOON2_COUNT +
        MOON1_RING_COUNT +
        MOON2_CORE_COUNT +
        BH_DISK_COUNT
    ) {
      const diskA = Math.random() * Math.PI * 2;
      const diskR = 0.42 + Math.pow(Math.random(), 2.0) * 0.75;
      locals[i * 3] = Math.cos(diskA) * diskR;
      locals[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
      locals[i * 3 + 2] = Math.sin(diskA) * diskR;
      bodies[i] = 6;
      offsets[i] = 0.72 + Math.random() * 0.14;
      accentChance = 0.3;
    } else if (
      i <
      SPHERE_COUNT +
        MOON1_COUNT +
        MOON2_COUNT +
        MOON1_RING_COUNT +
        MOON2_CORE_COUNT +
        BH_DISK_COUNT +
        BH_RING_COUNT
    ) {
      const ringA2 = Math.random() * Math.PI * 2;
      const ringR2 = 0.3 + Math.random() * 0.04;
      locals[i * 3] = Math.cos(ringA2) * ringR2;
      locals[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
      locals[i * 3 + 2] = Math.sin(ringA2) * ringR2;
      bodies[i] = 7;
      offsets[i] = 0.76 + Math.random() * 0.1;
      signals[i] = 2;
      continue;
    } else {
      const ringA = Math.random() * Math.PI * 2;
      const ringR = 3.2 + Math.pow(Math.random(), 1.6) * 1.5;
      const x = Math.cos(ringA) * ringR;
      const y = (Math.random() - 0.5) * 0.12;
      const z = Math.sin(ringA) * ringR;
      locals[i * 3] = x;
      locals[i * 3 + 1] = y * Math.cos(ringTilt) - z * Math.sin(ringTilt) * 0.35;
      locals[i * 3 + 2] = y * Math.sin(ringTilt) + z * Math.cos(ringTilt);
      bodies[i] = 1;
      offsets[i] = 0.78 + Math.random() * 0.22;
      accentChance = 0.08;
    }

    const roll = Math.random();
    signals[i] = roll < 0.012 ? 2 : roll < accentChance ? 1 : 0;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(locals, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatters, 3));
  geometry.setAttribute("aBody", new THREE.BufferAttribute(bodies, 1));
  geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
  geometry.setAttribute("aSignal", new THREE.BufferAttribute(signals, 1));
  return geometry;
}

function buildStars() {
  const positions = new Float32Array(STAR_COUNT * 3);
  const seeds = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    const radius = 28 + Math.random() * 27;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  return geometry;
}

function Scene({ reducedMotion }: { reducedMotion: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const starMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const progressRef = useRef(0);
  const prevProgressRef = useRef(0);
  const spawnRef = useRef(0);
  const warpRef = useRef(0);

  const geometry = useMemo(() => buildGeometry(), []);
  const starGeometry = useMemo(() => buildStars(), []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpawn: { value: 0 },
      uTunnel: { value: 0 },
      uWarp: { value: 0 },
    }),
    []
  );
  const starUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpawn: { value: 0 },
      uWarp: { value: 0 },
    }),
    []
  );

  useEffect(
    () => () => {
      geometry.dispose();
      starGeometry.dispose();
    },
    [geometry, starGeometry]
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    const starMaterial = starMaterialRef.current;
    if (!material || !starMaterial) return;

    const camera = state.camera as THREE.PerspectiveCamera;
    const time = state.clock.elapsedTime;

    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const scrollTarget = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    if (reducedMotion || !journeyState.active) {
      const spawn = introState.done ? 1 : 0;
      material.uniforms.uTime.value = time;
      material.uniforms.uSpawn.value = reducedMotion
        ? spawn
        : (spawnRef.current +=
            (introState.progress - spawnRef.current) *
            (1 - Math.exp(-1.7 * delta)));
      material.uniforms.uTunnel.value = 0;
      material.uniforms.uWarp.value = 0;
      starMaterial.uniforms.uTime.value = time;
      starMaterial.uniforms.uSpawn.value = material.uniforms.uSpawn.value;
      starMaterial.uniforms.uWarp.value = 0;
      camera.position.set(0, 0, 9.5);
      camera.lookAt(0, 0, 0);
      if (camera.fov !== 55) {
        camera.fov = 55;
        camera.updateProjectionMatrix();
      }
      return;
    }

    const ease = 1 - Math.exp(-3.5 * delta);
    progressRef.current += (scrollTarget - progressRef.current) * ease;
    spawnRef.current +=
      (introState.progress - spawnRef.current) * (1 - Math.exp(-1.7 * delta));

    const velocity =
      delta > 0
        ? (progressRef.current - prevProgressRef.current) / delta
        : 0;
    prevProgressRef.current = progressRef.current;
    const warpTarget = Math.min(Math.abs(velocity) * 2.6, 1);
    const attack = warpTarget > warpRef.current ? 10 : 2.2;
    warpRef.current +=
      (warpTarget - warpRef.current) * (1 - Math.exp(-attack * delta));

    material.uniforms.uTime.value = time;
    material.uniforms.uSpawn.value = spawnRef.current;
    material.uniforms.uTunnel.value = tunnelAmount(progressRef.current);
    material.uniforms.uWarp.value = warpRef.current;
    starMaterial.uniforms.uTime.value = time;
    starMaterial.uniforms.uSpawn.value = spawnRef.current;
    starMaterial.uniforms.uWarp.value = warpRef.current;

    const dolly = spawnRef.current * spawnRef.current * (3 - 2 * spawnRef.current);
    const { pos, look } = cameraState(progressRef.current, time);
    const pointer = state.pointer;
    camera.position.set(
      pos[0] + pointer.x * 0.3,
      pos[1] + pointer.y * 0.2,
      pos[2] + (1 - dolly) * 3.0
    );
    camera.lookAt(look[0], look[1], look[2]);

    const fov = 55 + warpRef.current * 18;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return (
    <>
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
      <points geometry={starGeometry}>
        <shaderMaterial
          ref={starMaterialRef}
          vertexShader={starVertexShader}
          fragmentShader={starFragmentShader}
          uniforms={starUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export default function ParticleField() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 12.5], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
