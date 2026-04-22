"use client";

import Image from "next/image";
import { useState } from "react";
import type { Category, Project } from "@/lib/types";

interface ProjectCardsProps {
  category: Category;
  onProjectClick: (project: Project) => void;
  onClose: () => void;
}

function LogoFallback({ name, color }: { name: string; color: string }) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        background: color + "33",
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        fontWeight: 700,
        color,
        fontFamily: "Inter, system-ui, sans-serif",
        flexShrink: 0,
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function ProjectLogo({ project, color }: { project: Project; color: string }) {
  const [error, setError] = useState(false);
  if (error || !project.logoUrl) return <LogoFallback name={project.name} color={color} />;
  return (
    <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
      <Image
        src={project.logoUrl}
        alt={project.name}
        width={44}
        height={44}
        style={{ objectFit: "cover", borderRadius: "50%" }}
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  );
}

export default function ProjectCards({ category, onProjectClick, onClose }: ProjectCardsProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          background: "rgba(0,2,15,0.92)",
          border: `1px solid ${category.color}44`,
          borderRadius: "20px",
          padding: "32px",
          maxWidth: "680px",
          width: "calc(100% - 48px)",
          maxHeight: "80vh",
          overflowY: "auto",
          backdropFilter: "blur(20px)",
          boxShadow: `0 0 60px ${category.color}22, 0 24px 80px rgba(0,0,0,0.8)`,
        }}
        className="no-scrollbar"
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: category.color,
                marginBottom: 4,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Solar System
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: "#fff",
                fontFamily: "Inter, system-ui, sans-serif",
                textShadow: `0 0 20px ${category.color}88`,
              }}
            >
              {category.name}
            </h2>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: 1.5,
              }}
            >
              {category.description}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: 36,
              height: 36,
              color: "rgba(255,255,255,0.6)",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, ${category.color}44, transparent)`, marginBottom: 24 }} />

        {/* Project grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {category.projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onProjectClick(project)}
              style={{
                background: `${category.color}0d`,
                border: `1px solid ${category.color}2a`,
                borderRadius: 14,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = category.color + "88";
                e.currentTarget.style.background = category.color + "1a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = category.color + "2a";
                e.currentTarget.style.background = category.color + "0d";
              }}
            >
              <ProjectLogo project={project} color={category.color} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    fontFamily: "Inter, system-ui, sans-serif",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {project.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.45)",
                    fontFamily: "Inter, system-ui, sans-serif",
                    lineHeight: 1.4,
                    marginTop: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {project.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Click a project to visit · ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}
