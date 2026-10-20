import type { MetadataRoute } from "next";
import { ORIGINALS_LIVE, SITE_URL } from "@/shared/config";
import { PROJECTS, projectHref } from "@/content/projects";

export const dynamic = "force-static";

const ROUTES = ["/", "/work/", "/studio/", ...(ORIGINALS_LIVE ? ["/originals/"] : []), "/people/", "/start-a-project/", "/privacy/", "/terms/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, SITE_URL).toString();
  return [...ROUTES, ...PROJECTS.map((p) => `${projectHref(p.slug)}/`)].map((path) => ({ url: url(path) }));
}
