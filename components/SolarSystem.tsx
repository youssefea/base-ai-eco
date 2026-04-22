"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import Planet from "./Planet";
import OrbitRing from "./OrbitRing";
import type { Category, Project } from "@/lib/types";

interface SolarSystemProps {
  category: Category;
  position: [number, number, number];
  isSelected: boolean;
  isZoomedIn: boolean;
  searchQuery: string;
  onSystemClick: () => void;
  onPlanetClick: (project: Project) => void;
}

const STAR_SIZE = 1.15;
const ORBIT_BASE = 3.5;
const ORBIT_STEP = 1.15;

const orbitRadius = (i: number) => ORBIT_BASE + i * ORBIT_STEP;
const orbitSpeed = (i: number) => 0.4 / (1 + i * 0.18);

export default function SolarSystem({
  category,
  position,
  isSelected,
  isZoomedIn,
  searchQuery,
  onSystemClick,
  onPlanetClick,
}: SolarSystemProps) {
  const starRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (starRef.current) {
      starRef.current.rotation.y += delta * 0.2;
    }
  });

  const lq = searchQuery.toLowerCase();
  const matchesSearch = (project: Project) =>
    !lq ||
    project.name.toLowerCase().includes(lq) ||
    project.description.toLowerCase().includes(lq) ||
    category.name.toLowerCase().includes(lq);

  const hasSearchMatch = !lq || category.name.toLowerCase().includes(lq) || category.projects.some(matchesSearch);

  const starIntensity = isSelected ? 2.4 : hovered ? 1.7 : 0.9;
  const starOpacity = hasSearchMatch ? 1 : 0.15;

  return (
    <group position={position}>
      <mesh
        ref={starRef}
        onClick={(e) => {
          e.stopPropagation();
          onSystemClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[STAR_SIZE, 32, 32]} />
        <meshStandardMaterial
          color={category.color}
          emissive={category.color}
          emissiveIntensity={starIntensity}
          transparent
          opacity={starOpacity}
          roughness={0.1}
          metalness={0.6}
        />
      </mesh>

      {/* Point light from star */}
      <pointLight
        color={category.color}
        intensity={isSelected ? 7 : 3.5}
        distance={40}
        decay={2}
      />

      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[STAR_SIZE + 0.4, STAR_SIZE + 0.8, 64]} />
          <meshBasicMaterial color={category.color} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      <Html
        center
        position={[0, STAR_SIZE + 2.35, 0]}
        style={{ pointerEvents: "none", opacity: hasSearchMatch ? 1 : 0.25 }}
      >
        <div
          className="system-label"
          style={{
            borderColor: `${category.color}${isSelected ? "88" : "44"}`,
            boxShadow: `0 18px 36px ${category.color}${isSelected ? "2f" : "18"}`,
            transform: isSelected ? "translateY(-2px)" : "translateY(0)",
          }}
        >
          <div
            style={{
              fontSize: isZoomedIn ? 13 : 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#f5fbff",
              transition: "font-size 0.25s ease",
            }}
          >
            {category.name}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 9,
              color: "rgba(227,241,255,0.6)",
              whiteSpace: "nowrap",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {category.projects.length} companies
          </div>
        </div>
      </Html>

      {category.projects.map((_, i) => (
        <OrbitRing
          key={i}
          radius={orbitRadius(i)}
          color={category.color}
          opacity={hasSearchMatch ? (isZoomedIn ? 0.18 : 0.12) : 0.03}
        />
      ))}

      {category.projects.map((project, i) => {
        const matches = matchesSearch(project);
        const dimmed = !!lq && !matches;
        const highlighted = !!lq && matches;
        return (
          <Planet
            key={project.id}
            project={project}
            orbitRadius={orbitRadius(i)}
            orbitSpeed={orbitSpeed(i)}
            orbitOffset={(i / category.projects.length) * Math.PI * 2}
            planetSize={0.72}
            color={category.color}
            dimmed={dimmed}
            highlighted={highlighted}
            isSystemZoomed={isZoomedIn}
            categoryName={category.name}
            onClick={() => onPlanetClick(project)}
          />
        );
      })}
    </group>
  );
}
