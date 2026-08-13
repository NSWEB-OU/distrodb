import type { DistroDetail } from "@distrodb/types";

const CMS_URL = process.env.CMS_URL ?? "http://localhost:3001";

type PayloadListResponse = {
  docs: (DistroDetail & { id: string | number })[];
};

// Cached per request/revalidate window; Next.js dedupes identical fetch calls
// automatically, so repeated calls below don't cause N+1 requests.
async function fetchDistros(): Promise<DistroDetail[]> {
  const res = await fetch(`${CMS_URL}/api/distros?limit=1000&depth=0`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch distros from CMS: ${res.status} ${res.statusText}`);
  }
  const { docs } = (await res.json()) as PayloadListResponse;
  return docs.map((doc) => ({ ...doc, id: String(doc.id) }));
}

export async function getAllDistros(): Promise<DistroDetail[]> {
  return fetchDistros();
}

export async function getDistroBySlug(slug: string): Promise<DistroDetail | undefined> {
  const distros = await fetchDistros();
  return distros.find((d) => d.slug === slug.toLowerCase());
}

export async function getAllSlugs(): Promise<string[]> {
  const distros = await fetchDistros();
  return distros.map((d) => d.slug);
}

export async function getAllVsSlugs(): Promise<{ slugs: string }[]> {
  const slugs = await getAllSlugs();
  const pairs: { slugs: string }[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      pairs.push({ slugs: `${slugs[i]}-vs-${slugs[j]}` });
    }
  }
  return pairs;
}
