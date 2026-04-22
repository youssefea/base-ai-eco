"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";
import HUD from "@/components/HUD";
import ecosystemData from "@/data/ecosystem";
import type { Project } from "@/lib/types";

// Dynamically import Galaxy to avoid SSR issues with Three.js
const Galaxy = dynamic(() => import("@/components/Galaxy"), { ssr: false });

const data = ecosystemData;
const SYSTEM_COUNT = data.categories.length;

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const zoomFnRef = useRef<{
    zoomToSystem: (i: number) => void;
    zoomOut: () => void;
  } | null>(null);

  const handleZoomIn = useCallback((index: number) => {
    setZoomedIndex(index);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomedIndex(null);
  }, []);

  const doZoomIn = useCallback(
    (index: number) => {
      zoomFnRef.current?.zoomToSystem(index);
    },
    []
  );

  const doZoomOut = useCallback(() => {
    zoomFnRef.current?.zoomOut();
  }, []);

  useEffect(() => {
    if (zoomedIndex !== null && zoomedIndex !== selectedIndex) {
      doZoomIn(selectedIndex);
    }
  }, [doZoomIn, selectedIndex, zoomedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (searchFocused && e.key !== "Escape") return;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => (i - 1 + SYSTEM_COUNT) % SYSTEM_COUNT);
          break;
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => (i + 1) % SYSTEM_COUNT);
          break;
        case "Enter":
          e.preventDefault();
          if (zoomedIndex === selectedIndex) {
            doZoomOut();
          } else {
            doZoomIn(selectedIndex);
          }
          break;
        case "Escape":
          e.preventDefault();
          if (zoomedIndex !== null) {
            doZoomOut();
          } else if (searchQuery) {
            setSearchQuery("");
          }
          break;
        case "/":
          e.preventDefault();
          setSearchFocused(true);
          break;
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [searchFocused, zoomedIndex, selectedIndex, searchQuery, doZoomIn, doZoomOut]);

  const handleSystemClick = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleSelectCategory = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleToggleSelectedZoom = useCallback(() => {
    if (zoomedIndex === selectedIndex) {
      doZoomOut();
      return;
    }

    doZoomIn(selectedIndex);
  }, [doZoomIn, doZoomOut, selectedIndex, zoomedIndex]);

  const handlePlanetClick = useCallback((project: Project) => {
    window.open(project.website, "_blank", "noopener,noreferrer");
  }, []);
  const selectedCategory = data.categories[selectedIndex];

  return (
    <main className="galaxy-page">
      <div className="galaxy-backdrop" aria-hidden="true" />
      <div className="galaxy-vignette" aria-hidden="true" />

      <Galaxy
        data={data}
        selectedIndex={selectedIndex}
        zoomedIndex={zoomedIndex}
        searchQuery={searchQuery}
        onPlanetClick={handlePlanetClick}
        onSystemClick={handleSystemClick}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        zoomFnRef={zoomFnRef}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        focused={searchFocused}
        onBlur={() => setSearchFocused(false)}
      />

      <HUD
        categories={data.categories}
        isZoomedIn={zoomedIndex === selectedIndex}
        selectedIndex={selectedIndex}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onToggleZoom={handleToggleSelectedZoom}
      />
    </main>
  );
}
