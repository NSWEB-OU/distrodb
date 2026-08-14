import type { RoadmapItemDetail } from "@distrodb/types";

const CMS_URL = process.env.CMS_URL ?? "http://localhost:3001";

type PayloadRoadmapItem = Omit<RoadmapItemDetail, "id"> & { id: string | number };

type PayloadListResponse = {
  docs: PayloadRoadmapItem[];
};

export async function getRoadmapItems(): Promise<RoadmapItemDetail[]> {
  const res = await fetch(`${CMS_URL}/api/roadmap?limit=100&sort=order`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch roadmap from CMS: ${res.status} ${res.statusText}`);
  }
  const { docs } = (await res.json()) as PayloadListResponse;
  return docs.map((doc) => ({ ...doc, id: String(doc.id) }));
}
