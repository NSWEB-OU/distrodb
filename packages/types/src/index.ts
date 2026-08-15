export type GridDistro = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  img: string | undefined;
  imgFit?: "cover" | "contain";
};

export type ReleaseModel = "rolling" | "fixed" | "semi-rolling";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type DistroDetail = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  img: string | undefined;
  imgFit?: "cover" | "contain";
  screenshots: string[];
  tags: string[];
  base: string | null;
  desktopEnvironments: string[];
  packageManager: string;
  initSystem: string;
  architecture: string[];
  releaseModel: ReleaseModel;
  latestVersion: string;
  releaseDate: string | null;
  website: string;
  docs: string;
  download: string;
  /** DistroSea slug (https://distrosea.com/select/<slug>/) for in-browser test drives. Omit if unsupported. */
  distroSea?: string;
  highlights: string[];
  difficulty: DifficultyLevel;
};

export type RoadmapStatus = "done" | "in-progress" | "upcoming" | "planned";

export type RoadmapIcon =
  | "database"
  | "computer"
  | "filter"
  | "source-code"
  | "star"
  | "rocket"
  | "idea"
  | "chart"
  | "shield"
  | "global"
  | "target"
  | "flag"
  | "puzzle";

export type RoadmapItemDetail = {
  id: string;
  icon: RoadmapIcon;
  title: string;
  description: string;
  status: RoadmapStatus;
  quarter?: string;
  order: number;
};

export type ChangelogTag = "database" | "ui" | "feature" | "fix" | "roadmap" | "performance";

export type ChangelogEntryDetail = {
  id: string;
  slug: string;
  version: string;
  date: string;
  title: string;
  tags: ChangelogTag[];
  /** Markdown body, rendered via next-mdx-remote (apps/web/lib/changelog.ts). */
  content: string;
};
