"use client";

import Link from "next/link";
import type { Category } from "@/lib/types";

interface HUDProps {
  categories: Category[];
  isZoomedIn: boolean;
  selectedIndex: number;
  selectedCategory: Category;
  onSelectCategory: (index: number) => void;
  onToggleZoom: () => void;
}

const KEY = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      borderRadius: 5,
      padding: "1px 7px",
      fontSize: 11,
      fontFamily: "monospace",
      color: "rgba(255,255,255,0.7)",
      minWidth: 22,
    }}
  >
    {children}
  </span>
);

export default function HUD({
  categories,
  isZoomedIn,
  selectedIndex,
  selectedCategory,
  onSelectCategory,
  onToggleZoom,
}: HUDProps) {
  return (
    <>
      <div
        className="hud-left-panel"
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          zIndex: 40,
          width: "min(320px, calc(100vw - 48px))",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/base-basemark-white.svg"
              alt="Base"
              style={{ height: 18, width: "auto", display: "block" }}
            />
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(227,241,255,0.82)",
              }}
            >
              AI Ecosystem
            </div>
          </div>

          {isZoomedIn && (
            <button
              type="button"
              className="hud-action hud-back-button"
              onClick={onToggleZoom}
            >
              Back to overview
            </button>
          )}

          <div className="hud-panel" style={{ padding: "12px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(195,221,255,0.58)",
                marginBottom: 10,
              }}
            >
              Ecosystems
            </div>

            <div className="system-nav-list">
              {categories.map((category, index) => {
                const isActive = index === selectedIndex;

                return (
                  <button
                    key={category.id}
                    type="button"
                    className="system-nav-button"
                    aria-pressed={isActive}
                    onClick={() => onSelectCategory(index)}
                    style={{
                      background: isActive ? `${category.color}1d` : "rgba(255,255,255,0.04)",
                      borderColor: isActive ? `${category.color}77` : "rgba(174, 214, 255, 0.12)",
                      boxShadow: isActive ? `0 18px 40px ${category.color}22` : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: category.color,
                          boxShadow: `0 0 18px ${category.color}66`,
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 4,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#f5fbff",
                            letterSpacing: "-0.03em",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 180,
                          }}
                        >
                          {category.name}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "rgba(227,241,255,0.55)",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                          }}
                        >
                          {`${category.projects.length} companies`}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: 16,
                        color: isActive ? category.color : "rgba(227,241,255,0.35)",
                        lineHeight: 1,
                      }}
                    >
                      ↗
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className="hud-right-panel"
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 40,
          width: "min(320px, calc(100vw - 48px))",
        }}
      >
        <div className="hud-panel" style={{ padding: "16px" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: selectedCategory.color,
            }}
          >
            {isZoomedIn ? "Focused ecosystem" : "Selected ecosystem"}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#f5fbff",
            }}
          >
            {selectedCategory.name}
          </div>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 13,
              lineHeight: 1.6,
              color: "rgba(227,241,255,0.74)",
            }}
          >
            {selectedCategory.description}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 14,
              flexWrap: "wrap",
            }}
          >
            <span className="hud-pill">{selectedCategory.projects.length} companies</span>
            {!isZoomedIn && (
              <button type="button" className="hud-action" onClick={onToggleZoom}>
                Zoom into orbit
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="hud-bottom-left"
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <KEY>↑</KEY><KEY>↓</KEY><KEY>←</KEY><KEY>→</KEY>
          <span>navigate</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <KEY>↵</KEY>
          <span>{isZoomedIn ? "back to galaxy" : "zoom in"}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <KEY>Esc</KEY>
          <span>zoom out</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <KEY>/</KEY>
          <span>search</span>
        </div>
      </div>

      <div
        className="hud-bottom-right"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 40,
        }}
      >
        <Link
          href="/ecosystem-image"
          target="_blank"
          className="map-link"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Open market map
        </Link>
      </div>
    </>
  );
}
