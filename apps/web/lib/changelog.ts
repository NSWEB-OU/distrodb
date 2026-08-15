import type { ChangelogEntryDetail } from "@distrodb/types";

const CMS_URL = process.env.CMS_URL ?? "http://localhost:3001";

type PayloadChangelogEntry = Omit<ChangelogEntryDetail, "id"> & { id: string | number };

type PayloadListResponse = {
  docs: PayloadChangelogEntry[];
};

export async function getChangelogEntries(): Promise<ChangelogEntryDetail[]> {
  const res = await fetch(`${CMS_URL}/api/changelog?limit=100&sort=-date`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch changelog from CMS: ${res.status} ${res.statusText}`);
  }
  const { docs } = (await res.json()) as PayloadListResponse;
  return docs.map((doc) => ({ ...doc, id: String(doc.id) }));
}
