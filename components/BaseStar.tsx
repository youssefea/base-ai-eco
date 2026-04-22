"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function BaseStar() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.08;
      const scale = 1 + Math.sin(Date.now() * 0.002) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial
          color="#0052ff"
          emissive="#0052ff"
          emissiveIntensity={2.5}
          roughness={0.05}
          metalness={0.8}
        />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshStandardMaterial
          color="#0052ff"
          emissive="#0052ff"
          emissiveIntensity={0.8}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.15, 3.35, 64]} />
        <meshBasicMaterial color="#68b3ff" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>

      <pointLight color="#0052ff" intensity={18} distance={72} decay={2} />
      <ambientLight intensity={0.18} />

      <Html center position={[0, 4.2, 0]} style={{ pointerEvents: "none" }}>
        <div className="base-core-label">
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#f5fbff",
            }}
          >
            Base
          </span>
        </div>
      </Html>
    </group>
  );
}
