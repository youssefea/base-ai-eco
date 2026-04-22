import type { Project } from "@/lib/types";

export function googleFaviconUrl(website: string, size = 256) {
  return `https://www.google.com/s2/favicons?sz=${size}&domain_url=${encodeURIComponent(website)}`;
}

export function siteFaviconUrl(website: string) {
  try {
    const { origin } = new URL(website);
    return `${origin}/favicon.ico`;
  } catch {
    return "";
  }
}

export function getProjectLogoSources(project: Pick<Project, "logoUrl" | "website">) {
  return Array.from(
    new Set([project.logoUrl, googleFaviconUrl(project.website), siteFaviconUrl(project.website)].filter(Boolean))
  );
}
