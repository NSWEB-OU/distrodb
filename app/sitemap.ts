import type { MetadataRoute } from "next";
import { getAllSlugs, getAllVsSlugs } from "@/lib/distros";

const BASE_URL = "https://distrodb.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const distroSlugs = getAllSlugs();
  const vsSlugs = getAllVsSlugs();

  const distroEntries: MetadataRoute.Sitemap = distroSlugs.map((slug) => ({
    url: `${BASE_URL}/distros/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const vsEntries: MetadataRoute.Sitemap = vsSlugs.map(({ slugs }) => ({
    url: `${BASE_URL}/vs/${slugs}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...distroEntries,
    ...vsEntries,
  ];
}
