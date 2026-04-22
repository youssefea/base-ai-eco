"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

const ChevronIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: direction === "left" ? "rotate(180deg)" : "none",
      transition: "transform 0.2s ease",
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function HUD({
  categories,
  isZoomedIn,
  selectedIndex,
  selectedCategory,
  onSelectCategory,
  onToggleZoom,
}: HUDProps) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Default to collapsed on small viewports so the galaxy itself is the
  // primary surface on mobile. Desktop keeps the full panels open.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      setIsMobile(mq.matches);
      setLeftCollapsed(mq.matches);
      setRightCollapsed(mq.matches);
    };
    apply();
    // One-time mount marker so SSR-rendered content (always expanded) is
    // replaced with the viewport-aware state on first client render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // On mobile the two expanded panels would overlap, so only one can be
  // open at a time — opening one auto-collapses the other.
  const expandLeft = () => {
    setLeftCollapsed(false);
    if (isMobile) setRightCollapsed(true);
  };
  const expandRight = () => {
    setRightCollapsed(false);
    if (isMobile) setLeftCollapsed(true);
  };

  // Avoid a hydration flash by deferring the collapsed state until mount.
  const showLeft = hydrated ? !leftCollapsed : true;
  const showRight = hydrated ? !rightCollapsed : true;

  return (
    <>
      <div className="hud-left-panel">
        {showLeft ? (
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
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/base-basemark-white.svg"
                  alt="Base"
                  style={{ height: 18, width: "auto", display: "block", flexShrink: 0 }}
                />
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(227,241,255,0.82)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  AI Ecosystem
                </div>
              </div>

              <button
                type="button"
                aria-label="Collapse ecosystems panel"
                className="hud-icon-button"
                onClick={() => setLeftCollapsed(true)}
              >
                <ChevronIcon direction="left" />
              </button>
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
        ) : (
          <button
            type="button"
            className="hud-collapsed-bubble"
            aria-label="Open ecosystems panel"
            onClick={expandLeft}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/base-basemark-white.svg"
              alt="Base"
              style={{ height: 18, width: "auto", display: "block" }}
            />
            <span
              className="hud-collapsed-dot"
              style={{
                background: selectedCategory.color,
                boxShadow: `0 0 12px ${selectedCategory.color}aa`,
              }}
            />
          </button>
        )}
      </div>

      <div className="hud-right-panel">
        {showRight ? (
          <div className="hud-panel" style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: selectedCategory.color,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {isZoomedIn ? "Focused ecosystem" : "Selected ecosystem"}
              </div>
              <button
                type="button"
                aria-label="Collapse details panel"
                className="hud-icon-button"
                onClick={() => setRightCollapsed(true)}
              >
                <ChevronIcon direction="right" />
              </button>
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
              className="hud-description"
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
        ) : (
          <button
            type="button"
            className="hud-collapsed-bubble"
            aria-label="Open ecosystem details"
            onClick={expandRight}
            style={{
              borderColor: `${selectedCategory.color}77`,
              boxShadow: `0 18px 36px ${selectedCategory.color}33`,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: selectedCategory.color,
                boxShadow: `0 0 14px ${selectedCategory.color}aa`,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#f5fbff",
              }}
            >
              {selectedCategory.projects.length}
            </span>
          </button>
        )}
      </div>

      <div className="hud-bottom-left">
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

      <div className="hud-bottom-right">
        <Link
          href="/ecosystem-image"
          target="_blank"
          className="map-link"
          aria-label="Open market map"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <span className="map-link-label">Open market map</span>
        </Link>
      </div>
    </>
  );
}
