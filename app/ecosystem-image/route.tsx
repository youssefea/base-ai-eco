import { Buffer } from "node:buffer";
import { ImageResponse } from "next/og";
import ecosystemData from "@/data/ecosystem";
import { getProjectLogoSources } from "@/lib/logo-sources";
import type { Category, Project } from "@/lib/types";

export const runtime = "nodejs";

const data = ecosystemData;
const WIDTH = 1200;
const HEIGHT = 630;

// Layout constants. Geometry shared between the layout solver and the
// rendering tree so changes only need to happen in one place.
const SIDE_PADDING = 24;
const TOP_PADDING = 24;
const BOTTOM_PADDING = 22;
const HEADER_BLOCK_HEIGHT = 110;
const HEADER_BOTTOM_MARGIN = 16;
const COLUMN_GAP = 12;
const PANEL_GAP = 12;
const PANEL_PADDING = 18;
const PANEL_HEADER_BLOCK = 34;
const PANEL_DESC_BLOCK = 38;
const TILE_GAP_X = 8;
const TILE_GAP_Y = 10;
const TILE_LABEL_BLOCK = 18;
const TILE_LOGO_RATIO = 0.63;

const COLUMN_WIDTH = (WIDTH - SIDE_PADDING * 2 - COLUMN_GAP) / 2;
const PANEL_INNER_WIDTH = COLUMN_WIDTH - PANEL_PADDING * 2;
const AVAILABLE_PANEL_HEIGHT =
  HEIGHT - TOP_PADDING - BOTTOM_PADDING - HEADER_BLOCK_HEIGHT - HEADER_BOTTOM_MARGIN;

const TILE_SIZE_CANDIDATES = [82, 76, 70, 64, 58, 52, 46, 42, 38, 34, 30];

const logoCache = new Map<string, Promise<string | null>>();

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function detectImageMime(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "image/png";
  }
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  // GIF: 47 49 46
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "image/gif";
  }
  // WEBP: "RIFF"...."WEBP"
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return "image/webp";
  }
  // SVG: leading whitespace then '<' and contains "svg"
  const head = buffer.subarray(0, Math.min(buffer.length, 512)).toString("utf8").trimStart().toLowerCase();
  if (head.startsWith("<?xml") || head.startsWith("<svg")) {
    if (head.includes("<svg")) return "image/svg+xml";
  }
  return null;
}

async function fetchDataUri(url: string) {
  if (!logoCache.has(url)) {
    logoCache.set(
      url,
      (async () => {
        try {
          const response = await fetch(url, {
            headers: {
              "User-Agent": "Mozilla/5.0",
            },
          });

          if (!response.ok) {
            return null;
          }

          const buffer = Buffer.from(await response.arrayBuffer());
          // Trust the bytes, not the content-type header. Some hosts serve
          // HTML error pages or .ico files with a misleading image/* type,
          // which makes satori crash with "Offset is outside the bounds of
          // the DataView" while parsing the image header.
          const mime = detectImageMime(buffer);
          if (!mime) {
            return null;
          }
          return `data:${mime};base64,${buffer.toString("base64")}`;
        } catch {
          return null;
        }
      })()
    );
  }

  return logoCache.get(url)!;
}

async function resolveProjectLogo(project: Project) {
  const sources = getProjectLogoSources(project);

  for (const source of sources) {
    const dataUri = await fetchDataUri(source);
    if (dataUri) {
      return dataUri;
    }
  }

  return null;
}

interface Layout {
  tileWidth: number;
  tileHeight: number;
  logoSize: number;
  labelFontSize: number;
  perRow: number;
  panelHeights: Map<string, number>;
  columns: [Category[], Category[]];
  maxColumnHeight: number;
}

function panelHeightFor(category: Category, perRow: number, tileHeight: number) {
  const rows = Math.max(1, Math.ceil(category.projects.length / perRow));
  return (
    PANEL_PADDING * 2 +
    PANEL_HEADER_BLOCK +
    PANEL_DESC_BLOCK +
    rows * tileHeight +
    (rows - 1) * TILE_GAP_Y
  );
}

function packColumns(categories: Category[], heights: Map<string, number>): [Category[], Category[]] {
  const columns: [Category[], Category[]] = [[], []];
  const colHeights = [0, 0];
  const sorted = [...categories].sort(
    (a, b) => (heights.get(b.id) ?? 0) - (heights.get(a.id) ?? 0)
  );
  for (const category of sorted) {
    const idx = colHeights[0] <= colHeights[1] ? 0 : 1;
    const extraGap = columns[idx].length > 0 ? PANEL_GAP : 0;
    columns[idx].push(category);
    colHeights[idx] += (heights.get(category.id) ?? 0) + extraGap;
  }
  return columns;
}

function tryLayout(categories: Category[], tileWidth: number): Layout {
  const logoSize = Math.round(tileWidth * TILE_LOGO_RATIO);
  const tileHeight = logoSize + 6 + TILE_LABEL_BLOCK;
  const perRow = Math.max(
    1,
    Math.floor((PANEL_INNER_WIDTH + TILE_GAP_X) / (tileWidth + TILE_GAP_X))
  );
  const labelFontSize = Math.max(8, Math.min(11, Math.round(tileWidth * 0.14)));

  const panelHeights = new Map<string, number>();
  for (const category of categories) {
    panelHeights.set(category.id, panelHeightFor(category, perRow, tileHeight));
  }
  const columns = packColumns(categories, panelHeights);
  const colHeights = columns.map((col) =>
    col.reduce(
      (sum, cat, i) => sum + (panelHeights.get(cat.id) ?? 0) + (i > 0 ? PANEL_GAP : 0),
      0
    )
  );
  return {
    tileWidth,
    tileHeight,
    logoSize,
    labelFontSize,
    perRow,
    panelHeights,
    columns,
    maxColumnHeight: Math.max(...colHeights),
  };
}

function chooseLayout(categories: Category[]): Layout {
  let smallest: Layout | null = null;
  for (const candidate of TILE_SIZE_CANDIDATES) {
    const layout = tryLayout(categories, candidate);
    smallest = layout;
    if (layout.maxColumnHeight <= AVAILABLE_PANEL_HEIGHT) {
      return layout;
    }
  }
  // Even the smallest candidate overflows. Render it anyway — content
  // will clip rather than throw.
  return smallest!;
}

function ProjectTile({
  project,
  color,
  logoDataUri,
  layout,
}: {
  project: Project;
  color: string;
  logoDataUri: string | null;
  layout: Layout;
}) {
  const label = project.shortName ?? project.name;
  const innerLogo = Math.round(layout.logoSize * 0.6);
  const fallbackFont = Math.max(9, Math.round(innerLogo * 0.42));
  const tileRadius = Math.max(8, Math.round(layout.logoSize * 0.3));

  return (
    <div
      style={{
        width: layout.tileWidth,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          width: layout.logoSize,
          height: layout.logoSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: tileRadius,
          background: "rgba(255,255,255,0.95)",
          border: `1px solid ${hexToRgba(color, 0.2)}`,
          boxShadow: `0 10px 24px ${hexToRgba(color, 0.12)}`,
          overflow: "hidden",
        }}
      >
        {logoDataUri ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoDataUri}
            alt={project.name}
            width={innerLogo}
            height={innerLogo}
            style={{
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              width: innerLogo,
              height: innerLogo,
              borderRadius: Math.max(6, Math.round(innerLogo * 0.3)),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: fallbackFont,
              fontWeight: 700,
              color,
              background: hexToRgba(color, 0.12),
            }}
          >
            {label.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: layout.labelFontSize,
          lineHeight: 1.15,
          fontWeight: 600,
          color: "#0b1420",
          textAlign: "center",
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function CategoryPanel({
  category,
  logos,
  layout,
}: {
  category: Category;
  logos: Map<string, string | null>;
  layout: Layout;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: PANEL_PADDING,
        borderRadius: 28,
        background: "rgba(255,255,255,0.76)",
        border: `1px solid ${hexToRgba(category.color, 0.14)}`,
        boxShadow: `0 28px 48px ${hexToRgba(category.color, 0.14)}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: category.color,
              boxShadow: `0 0 18px ${hexToRgba(category.color, 0.5)}`,
            }}
          />
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#08131f",
            }}
          >
            {category.name}
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: hexToRgba(category.color, 0.9),
          }}
        >
          {`${category.projects.length} companies`}
        </div>
      </div>

      <div
        style={{
          fontSize: 11,
          lineHeight: 1.4,
          color: "rgba(11, 20, 32, 0.68)",
          marginBottom: 14,
          maxWidth: PANEL_INNER_WIDTH,
          // Cap to one line so the description never blows up the layout
          // when categories carry long copy.
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {category.description}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          columnGap: TILE_GAP_X,
          rowGap: TILE_GAP_Y,
          alignItems: "flex-start",
        }}
      >
        {category.projects.map((project) => (
          <ProjectTile
            key={project.id}
            project={project}
            color={category.color}
            logoDataUri={logos.get(project.id) ?? null}
            layout={layout}
          />
        ))}
      </div>
    </div>
  );
}

export async function GET() {
  const allProjects = data.categories.flatMap((category) => category.projects);
  const resolvedLogos = await Promise.all(
    allProjects.map(async (project) => [project.id, await resolveProjectLogo(project)] as const)
  );
  const logos = new Map(resolvedLogos);
  const layout = chooseLayout(data.categories);

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          padding: `${TOP_PADDING}px ${SIDE_PADDING}px ${BOTTOM_PADDING}px`,
          background:
            "linear-gradient(135deg, #dcf4ff 0%, #c8ebff 34%, #b8e4ff 62%, #eef8ff 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -70,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,82,255,0.18) 0%, transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -70,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(104,179,255,0.2) 0%, transparent 72%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: HEADER_BOTTOM_MARGIN,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(0,82,255,0.8)",
                marginBottom: 8,
              }}
            >
              Built on Base
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                letterSpacing: "-0.06em",
                lineHeight: 0.94,
                color: "#08131f",
              }}
            >
              Base AI Ecosystem
            </div>
            <div
              style={{
                fontSize: 17,
                color: "rgba(8, 19, 31, 0.66)",
                marginTop: 6,
              }}
            >
              Market map snapshot · April 2026
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 14px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.86)",
              border: "1px solid rgba(0,82,255,0.12)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: "#0052ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 28,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              B
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(8, 19, 31, 0.54)",
                }}
              >
                Systems
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "#08131f",
                }}
              >
                {`${data.categories.length} clusters · ${allProjects.length} companies`}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: COLUMN_GAP,
            flex: 1,
            alignItems: "flex-start",
          }}
        >
          {layout.columns.map((column, index) => (
            <div
              key={`column-${index}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: PANEL_GAP,
                flex: 1,
              }}
            >
              {column.map((category) => (
                <CategoryPanel
                  key={category.id}
                  category={category}
                  logos={logos}
                  layout={layout}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: WIDTH, height: HEIGHT }
  );
}
