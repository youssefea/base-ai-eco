import { ImageResponse } from "next/og";
import ecosystemData from "@/data/ecosystem";

export const runtime = "edge";
export const alt =
  "Base AI Ecosystem — interactive 3D galaxy of agentic projects on Base";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const totalCompanies = ecosystemData.categories.reduce(
    (sum, c) => sum + c.projects.length,
    0
  );

  // Pre-positioned star specks. Hard-coded to keep the route deterministic
  // (so the image stays static + cacheable) and edge-compatible.
  const stars: { x: number; y: number; r: number; o: number }[] = [
    { x: 60, y: 80, r: 1.4, o: 0.7 }, { x: 180, y: 40, r: 1, o: 0.5 },
    { x: 280, y: 120, r: 1.8, o: 0.85 }, { x: 420, y: 60, r: 1, o: 0.45 },
    { x: 540, y: 180, r: 1.2, o: 0.55 }, { x: 660, y: 30, r: 0.9, o: 0.35 },
    { x: 800, y: 90, r: 1.5, o: 0.7 }, { x: 940, y: 150, r: 1, o: 0.5 },
    { x: 1080, y: 50, r: 1.3, o: 0.65 }, { x: 1140, y: 220, r: 1, o: 0.4 },
    { x: 80, y: 280, r: 1.1, o: 0.55 }, { x: 220, y: 380, r: 1.4, o: 0.65 },
    { x: 360, y: 480, r: 1, o: 0.4 }, { x: 500, y: 540, r: 1.6, o: 0.75 },
    { x: 60, y: 460, r: 1, o: 0.5 }, { x: 200, y: 560, r: 1.2, o: 0.6 },
    { x: 760, y: 460, r: 1.1, o: 0.55 }, { x: 880, y: 560, r: 1.5, o: 0.7 },
    { x: 1020, y: 410, r: 1, o: 0.45 }, { x: 1150, y: 510, r: 1.3, o: 0.6 },
    { x: 980, y: 280, r: 0.9, o: 0.4 }, { x: 1100, y: 340, r: 1.2, o: 0.55 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
          color: "#f5fbff",
          background:
            "radial-gradient(circle at 22% 30%, rgba(46,129,255,0.32) 0%, transparent 38%)," +
            "radial-gradient(circle at 78% 70%, rgba(0,82,255,0.28) 0%, transparent 42%)," +
            "radial-gradient(circle at 50% 50%, rgba(104,179,255,0.14) 0%, transparent 55%)," +
            "linear-gradient(180deg, #051026 0%, #02091a 50%, #02060f 100%)",
        }}
      >
        {/* Star specks layered behind everything */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          {stars.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: s.y,
                left: s.x,
                width: s.r * 2,
                height: s.r * 2,
                borderRadius: "50%",
                background: "#ffffff",
                opacity: s.o,
                boxShadow: "0 0 6px rgba(255,255,255,0.55)",
              }}
            />
          ))}
        </div>

        {/* Faint grid overlay echoing the landing page backdrop */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)," +
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "88px 88px, 88px 88px",
            opacity: 0.35,
          }}
        />

        {/* Left content column */}
        <div
          style={{
            width: 720,
            padding: "56px 60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Brand row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 36,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#0052ff",
                  boxShadow: "0 0 26px rgba(0,82,255,0.7)",
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                B
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "rgba(195,221,255,0.78)",
                }}
              >
                Built on Base
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 92,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 0.96,
                color: "#f5fbff",
                marginBottom: 22,
              }}
            >
              <div style={{ display: "flex" }}>Base AI</div>
              <div style={{ display: "flex" }}>Ecosystem</div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 22,
                lineHeight: 1.45,
                color: "rgba(227,241,255,0.72)",
                maxWidth: 580,
                marginBottom: 28,
              }}
            >
              {`An interactive 3D galaxy of ${totalCompanies} projects building the agentic stack on Base — wallets, x402, inference, and onchain data.`}
            </div>

            {/* Category chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {ecosystemData.categories.map((category) => (
                <div
                  key={category.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${category.color}55`,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: category.color,
                      boxShadow: `0 0 14px ${category.color}aa`,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#f5fbff",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {category.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(227,241,255,0.55)",
                    }}
                  >
                    {String(category.projects.length)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                color: "rgba(195,221,255,0.55)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Click · drag · explore
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(174,214,255,0.18)",
                fontSize: 14,
                fontWeight: 700,
                color: "#f5fbff",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#0052ff",
                  boxShadow: "0 0 12px rgba(0,82,255,0.9)",
                }}
              />
              <div style={{ display: "flex" }}>
                {`${totalCompanies} companies · ${ecosystemData.categories.length} ecosystems`}
              </div>
            </div>
          </div>
        </div>

        {/* Right galaxy visualization */}
        <div
          style={{
            width: 480,
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer faint orbits */}
          {[260, 340, 420].map((d, i) => (
            <div
              key={`orbit-${i}`}
              style={{
                position: "absolute",
                width: d,
                height: d,
                borderRadius: "50%",
                border: "1px solid rgba(104,179,255,0.18)",
              }}
            />
          ))}

          {/* Glow halo behind the central orb */}
          <div
            style={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,82,255,0.55) 0%, rgba(0,82,255,0.18) 40%, transparent 72%)",
            }}
          />

          {/* Central Base orb */}
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 35% 30%, #6ea8ff 0%, #0052ff 60%, #00277a 100%)",
              border: "1px solid rgba(174,214,255,0.4)",
              boxShadow:
                "0 0 60px rgba(0,82,255,0.85), inset 0 0 28px rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.06em",
              textShadow: "0 4px 18px rgba(0,0,0,0.4)",
            }}
          >
            B
          </div>

          {/* Category satellites — placed at four orbital positions */}
          {ecosystemData.categories.map((category, i) => {
            const positions = [
              { top: 80, left: 70 }, // top-left
              { top: 80, right: 70 }, // top-right
              { bottom: 80, left: 70 }, // bottom-left
              { bottom: 80, right: 70 }, // bottom-right
            ];
            const pos = positions[i] ?? positions[0];
            return (
              <div
                key={category.id}
                style={{
                  position: "absolute",
                  ...pos,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: category.color,
                    boxShadow: `0 0 30px ${category.color}cc, inset 0 0 12px rgba(255,255,255,0.25)`,
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "rgba(245,251,255,0.85)",
                    background: "rgba(6,18,42,0.7)",
                    padding: "4px 8px",
                    borderRadius: 8,
                    border: `1px solid ${category.color}55`,
                  }}
                >
                  {category.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),
    { ...size }
  );
}
