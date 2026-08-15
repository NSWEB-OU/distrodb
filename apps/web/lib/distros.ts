import type { DistroDetail } from "@distrodb/types";

const CMS_URL = process.env.CMS_URL ?? "http://localhost:3001";

// img/screenshots are Payload upload relations (media collection); with
// depth=1 the API returns the populated media doc instead of just its id.
type MediaDoc = { url?: string | null };
type PayloadDistro = Omit<DistroDetail, "img" | "screenshots" | "id"> & {
  id: string | number;
  img?: MediaDoc | number | string | null;
  screenshots?: (MediaDoc | number | string)[] | null;
};

type PayloadListResponse = {
  docs: PayloadDistro[];
};

function mediaUrl(media: MediaDoc | number | string | null | undefined): string | undefined {
  if (media && typeof media === "object") return media.url ?? undefined;
  return undefined;
}

// Cached per request/revalidate window; Next.js dedupes identical fetch calls
// automatically, so repeated calls below don't cause N+1 requests.
async function fetchDistros(): Promise<DistroDetail[]> {
  const res = await fetch(`${CMS_URL}/api/distros?limit=1000&depth=1&sort=createdAt`, {
    next: { revalidate: 3600, tags: ["distros"] },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch distros from CMS: ${res.status} ${res.statusText}`);
  }
  const { docs } = (await res.json()) as PayloadListResponse;
  return docs.map((doc) => ({
    ...doc,
    id: String(doc.id),
    img: mediaUrl(doc.img),
    screenshots: (doc.screenshots ?? []).map(mediaUrl).filter((url): url is string => Boolean(url)),
  }));
}

export async function getAllDistros(): Promise<DistroDetail[]> {
  return fetchDistros();
}

export async function getDistroBySlug(slug: string): Promise<DistroDetail | undefined> {
  const distros = await fetchDistros();
  return distros.find((d) => d.slug === slug.toLowerCase());
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const distros = await fetchDistros();
    return distros.map((d) => d.slug);
  } catch (error) {
    // Only used by generateStaticParams (distros/[slug], vs/[slugs]); if the
    // CMS isn't reachable at build time, skip pre-rendering and fall back to
    // on-demand rendering at runtime instead of failing the whole build.
    console.warn("getAllSlugs: CMS unreachable, skipping static pre-render -", error);
    return [];
  }
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
