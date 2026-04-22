"use client";

import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface OrbitRingProps {
  radius: number;
  color: string;
  opacity?: number;
}

export default function OrbitRing({ radius, color, opacity = 0.12 }: OrbitRingProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.6}
      transparent
      opacity={opacity}
    />
  );
}
