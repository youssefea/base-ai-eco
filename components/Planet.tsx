"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import LogoImage from "./LogoImage";
import type { Project } from "@/lib/types";

interface PlanetProps {
  project: Project;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  planetSize: number;
  color: string;
  dimmed: boolean;
  highlighted: boolean;
  isSystemZoomed: boolean;
  categoryName: string;
  onClick: () => void;
}

export default function Planet({
  project,
  orbitRadius,
  orbitSpeed,
  orbitOffset,
  planetSize,
  color,
  dimmed,
  highlighted,
  isSystemZoomed,
  categoryName,
  onClick,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const orbitRef = useRef(orbitOffset);
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsCoarsePointer(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  useFrame((_, delta) => {
    orbitRef.current += delta * orbitSpeed;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(orbitRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(orbitRef.current) * orbitRadius;
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const glowIntensity = highlighted ? 1.9 : hovered || pinned ? 1.5 : 0.7;
  const opacity = dimmed ? 0.18 : 1;
  const showCard = hovered || pinned;
  // Card dimensions are fixed in screen-space pixels so the card is always
  // legible regardless of how far the camera is from the planet.
  const cardWidth = 320;
  const cardPadding = 16;
  const cardLogoSize = 44;
  const cardTitleSize = 18;
  const cardBodySize = 12;

  return (
    <group ref={groupRef}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (isCoarsePointer) {
            if (pinned) {
              onClick();
            } else {
              setPinned(true);
            }
            return;
          }
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          if (!pinned) {
            document.body.style.cursor = "default";
          }
        }}
      >
        <sphereGeometry args={[planetSize, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glowIntensity}
          transparent
          opacity={opacity * 0.34}
          roughness={0.25}
          metalness={0.25}
        />
      </mesh>

      <Html
        center
        sprite
        distanceFactor={8}
        style={{ pointerEvents: "none", opacity }}
      >
        <div
          className={`orbit-logo${highlighted ? " orbit-logo-highlighted" : ""}`}
          style={{
            borderColor: `${color}${showCard ? "aa" : "55"}`,
            boxShadow: `0 0 0 1px ${color}22, 0 18px 38px ${color}${showCard ? "4a" : "22"}`,
            transform: showCard ? "scale(1.08)" : highlighted ? "scale(1.04)" : "scale(1)",
          }}
        >
          <LogoImage project={project} size={46} />
        </div>
      </Html>

      {showCard && (
        <Html
          position={[0, 0, 0]}
          zIndexRange={[100, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="planet-hover-card"
            style={{
              width: cardWidth,
              padding: cardPadding,
              borderColor: `${color}66`,
              // Anchor is at the planet's center in screen-space; shift the
              // card so it sits centred horizontally and above the planet
              // regardless of camera distance.
              transform: "translate(-50%, calc(-100% - 72px))",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: cardLogoSize,
                  height: cardLogoSize,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.92)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LogoImage project={project} size={26} />
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color,
                  }}
                >
                  {categoryName}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: cardTitleSize,
                    fontWeight: 700,
                    color: "#f5fbff",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {project.name}
                </div>
              </div>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: cardBodySize,
                lineHeight: 1.5,
                color: "rgba(227,241,255,0.74)",
                maxWidth: cardWidth - 64,
              }}
            >
              {project.description}
            </p>

            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: "rgba(227,241,255,0.48)",
              }}
            >
              {isCoarsePointer ? "Tap again to open" : "Click to open"}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
