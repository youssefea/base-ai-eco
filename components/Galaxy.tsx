"use client";

import { useRef, useEffect, useCallback, MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import Starfield from "./Starfield";
import BaseStar from "./BaseStar";
import SolarSystem from "./SolarSystem";
import type { EcosystemData, Project } from "@/lib/types";

const SYSTEM_POSITIONS: [number, number, number][] = [
  [-30, 0, -18],
  [30, 0, -18],
  [-30, 0, 18],
  [30, 0, 18],
];

const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 50, 50);
const DEFAULT_LOOK_AT = new THREE.Vector3(0, 0, 0);

interface SceneProps {
  data: EcosystemData;
  selectedIndex: number;
  zoomedIndex: number | null;
  searchQuery: string;
  onPlanetClick: (project: Project) => void;
  onSystemClick: (index: number) => void;
  cameraRef: MutableRefObject<THREE.Camera | null>;
}

function Scene({
  data,
  selectedIndex,
  zoomedIndex,
  searchQuery,
  onPlanetClick,
  onSystemClick,
  cameraRef,
}: SceneProps) {
  const { camera } = useThree();

  useEffect(() => {
    cameraRef.current = camera;
    camera.position.copy(DEFAULT_CAMERA_POS);
    camera.lookAt(DEFAULT_LOOK_AT);
  }, [camera, cameraRef]);

  return (
    <>
      <Starfield />
      <BaseStar />
      {data.categories.map((category, i) => (
        <SolarSystem
          key={category.id}
          category={category}
          position={SYSTEM_POSITIONS[i]}
          isSelected={selectedIndex === i}
          isZoomedIn={zoomedIndex === i}
          searchQuery={searchQuery}
          onSystemClick={() => onSystemClick(i)}
          onPlanetClick={onPlanetClick}
        />
      ))}
    </>
  );
}

export interface ZoomFns {
  zoomToSystem: (i: number) => void;
  zoomOut: () => void;
}

interface GalaxyProps {
  data: EcosystemData;
  selectedIndex: number;
  zoomedIndex: number | null;
  searchQuery: string;
  onPlanetClick: (project: Project) => void;
  onSystemClick: (index: number) => void;
  onZoomIn: (index: number) => void;
  onZoomOut: () => void;
  zoomFnRef: MutableRefObject<ZoomFns | null>;
}

export default function Galaxy({
  data,
  selectedIndex,
  zoomedIndex,
  searchQuery,
  onPlanetClick,
  onSystemClick,
  onZoomIn,
  onZoomOut,
  zoomFnRef,
}: GalaxyProps) {
  const cameraRef = useRef<THREE.Camera | null>(null);

  const zoomToSystem = useCallback(
    (index: number) => {
      const cam = cameraRef.current;
      if (!cam) return;
      const pos = SYSTEM_POSITIONS[index];
      const target = new THREE.Vector3(pos[0], pos[1], pos[2]);
      const camTarget = new THREE.Vector3(pos[0], pos[1] + 15, pos[2] + 18);

      gsap.to(cam.position, {
        x: camTarget.x,
        y: camTarget.y,
        z: camTarget.z,
        duration: 1.4,
        ease: "power3.inOut",
        onUpdate: () => cam.lookAt(target),
      });
      onZoomIn(index);
    },
    [onZoomIn]
  );

  const zoomOut = useCallback(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    gsap.to(cam.position, {
      x: DEFAULT_CAMERA_POS.x,
      y: DEFAULT_CAMERA_POS.y,
      z: DEFAULT_CAMERA_POS.z,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => cam.lookAt(DEFAULT_LOOK_AT),
    });
    onZoomOut();
  }, [onZoomOut]);

  // Expose zoom functions to parent
  useEffect(() => {
    zoomFnRef.current = { zoomToSystem, zoomOut };
  }, [zoomFnRef, zoomToSystem, zoomOut]);

  const handleSystemClick = useCallback(
    (index: number) => {
      onSystemClick(index);
      if (zoomedIndex === index) {
        zoomOut();
      } else {
        zoomToSystem(index);
      }
    },
    [zoomedIndex, zoomOut, zoomToSystem, onSystemClick]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 50, 50], fov: 46, near: 0.1, far: 2000 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          data={data}
          selectedIndex={selectedIndex}
          zoomedIndex={zoomedIndex}
          searchQuery={searchQuery}
          onPlanetClick={onPlanetClick}
          onSystemClick={handleSystemClick}
          cameraRef={cameraRef}
        />
      </Canvas>
    </div>
  );
}
