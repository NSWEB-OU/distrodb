export type GridDistro = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  img: string | undefined;
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
  screenshots: string[];
  tags: string[];
  base: string | null;
  desktopEnvironments: string[];
  packageManager: string;
  initSystem: string;
  architecture: string[];
  releaseModel: ReleaseModel;
  latestVersion: string;
  releaseDate: string;
  website: string;
  docs: string;
  download: string;
  highlights: string[];
  difficulty: DifficultyLevel;
};
