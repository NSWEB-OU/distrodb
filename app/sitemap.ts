import type { MetadataRoute } from "next";
import { getAllSlugs, getAllVsSlugs } from "@/lib/distros";

const BASE_URL = "https://distrodb.xyz";

// FORCE NEXT.JS TO CACHE AND TREAT THIS AS A STATIC FILE
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate at most once every 24 hours

export default function sitemap(): MetadataRoute.Sitemap {
  const distroSlugs = getAllSlugs();
  const vsSlugs = getAllVsSlugs();
  
  // Use a single static date object to avoid generating thousands of new Date instances
  const currentDate = new Date();

  const distroEntries: MetadataRoute.Sitemap = distroSlugs.map((slug) => ({
    url: `${BASE_URL}/distros/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const vsEntries: MetadataRoute.Sitemap = vsSlugs.map((item) => {
    // Safely extract your slug string depending on how your lib returns it
    // If it's an object like { slugs: "ubuntu-vs-debian" }, use item.slugs
    const targetSlug = typeof item === 'object' && item.slugs ? item.slugs : item;
    
    return {
      url: `${BASE_URL}/vs/${targetSlug}`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    ...distroEntries,
    ...vsEntries,
  ];
}
