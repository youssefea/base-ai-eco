"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { getProjectLogoSources } from "@/lib/logo-sources";
import type { Project } from "@/lib/types";

interface LogoImageProps {
  project: Project;
  size: number;
  alt?: string;
  style?: CSSProperties;
}

export default function LogoImage({ project, size, alt, style }: LogoImageProps) {
  const sources = useMemo(() => getProjectLogoSources(project), [project]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const source = sources[sourceIndex];

  if (!source) {
    return null;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt={alt ?? project.name}
      width={size}
      height={size}
      onError={() => {
        setSourceIndex((current) => {
          if (current >= sources.length - 1) return current;
          return current + 1;
        });
      }}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  );
}
