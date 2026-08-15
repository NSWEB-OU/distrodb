import type { MetadataRoute } from "next";
import { getAllSlugs, getAllVsSlugs } from "@/lib/distros";

const BASE_URL = "https://distrodb.xyz";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/wizard", changeFrequency: "monthly", priority: 0.6 },
  { path: "/glossary", changeFrequency: "monthly", priority: 0.6 },
  { path: "/popularity", changeFrequency: "weekly", priority: 0.6 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.5 },
  { path: "/roadmap", changeFrequency: "monthly", priority: 0.5 },
  { path: "/changelog", changeFrequency: "weekly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/support", changeFrequency: "monthly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  );

  const [slugs, vsSlugs] = await Promise.all([getAllSlugs(), getAllVsSlugs()]);

  const distroEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/distros/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const vsEntries: MetadataRoute.Sitemap = vsSlugs.map(({ slugs }) => ({
    url: `${BASE_URL}/vs/${slugs}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticEntries, ...distroEntries, ...vsEntries];
}
