"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 2500;

function createRandom(seed: number) {
  let value = seed;

  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Starfield() {
  const ref = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);
    const random = createRandom(402);

    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 200 + random() * 400;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = random() * 1.5 + 0.3;
    }
    return [pos, sz];
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.003;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.8}
        sizeAttenuation
        transparent
        opacity={0.7}
        fog={false}
      />
    </points>
  );
}
