import distrosData from "@/lib/data/distros.json";
import { DistroDetail } from "@/components/types/types";

const distros = distrosData as DistroDetail[];

export function getAllDistros(): DistroDetail[] {
  return distros;
}

export function getDistroBySlug(slug: string): DistroDetail | undefined {
  return distros.find((d) => d.slug === slug.toLowerCase());
}

export function getAllSlugs(): string[] {
  return distros.map((d) => d.slug);
}

export function getAllVsSlugs(): { slugs: string }[] {
  const slugs = getAllSlugs();
  const pairs: { slugs: string }[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      pairs.push({ slugs: `${slugs[i]}-vs-${slugs[j]}` });
    }
  }
  return pairs;
}
