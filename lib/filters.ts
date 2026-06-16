import type { DistroDetail } from "@/components/types/types";

export type FilterId = string;

export type FilterDefinition = {
  id: FilterId;
  label: string;
  match: (distro: DistroDetail) => boolean;
};

export type FilterGroup = {
  groupname: string;
  label?: string;
  filters: FilterDefinition[];
};

export const FILTER_GROUPS: FilterGroup[] = [
  {
    groupname: "featured",
    filters: [
      {
        id: "all-distros",
        label: "All distros",
        match: () => true,
      },
      {
        id: "recently-added",
        label: "Recently added",
        match: (d) => {
          const cutoff = new Date();
          cutoff.setFullYear(cutoff.getFullYear() - 1);
          return new Date(d.releaseDate) >= cutoff;
        },
      },
    ],
  },
  {
    groupname: "experience",
    label: "By experience",
    filters: [
      {
        id: "beginner",
        label: "Beginner",
        match: (d) => d.difficulty === "beginner",
      },
      {
        id: "intermediate",
        label: "Intermediate",
        match: (d) => d.difficulty === "intermediate",
      },
      {
        id: "advanced",
        label: "Advanced",
        match: (d) => d.difficulty === "advanced",
      },
    ],
  },
  {
    groupname: "use-case",
    label: "By use case",
    filters: [
      {
        id: "for-gamers",
        label: "For gamers",
        match: (d) => d.tags.includes("gaming"),
      },
      {
        id: "for-developers",
        label: "For developers",
        match: (d) => d.tags.includes("developer"),
      },
      {
        id: "for-servers",
        label: "For servers",
        match: (d) => d.tags.includes("server"),
      },
      {
        id: "for-privacy",
        label: "For privacy",
        match: (d) => d.tags.includes("privacy"),
      },
    ],
  },
  {
    groupname: "base",
    label: "By base",
    filters: [
      {
        id: "arch-based",
        label: "Arch-based",
        match: (d) => d.base?.toLowerCase().includes("arch") ?? false,
      },
      {
        id: "debian-based",
        label: "Debian-based",
        match: (d) => d.base?.toLowerCase().includes("debian") ?? false,
      },
      {
        id: "ubuntu-based",
        label: "Ubuntu-based",
        match: (d) => d.base?.toLowerCase().includes("ubuntu") ?? false,
      },
      {
        id: "fedora-based",
        label: "Fedora-based",
        match: (d) =>
          (d.base?.toLowerCase().includes("fedora") || d.base?.toLowerCase().includes("rhel")) ??
          false,
      },
      {
        id: "independent",
        label: "Independent",
        match: (d) =>
          d.base === null || d.base === "" || d.base.toLowerCase().includes("independent"),
      },
    ],
  },
  {
    groupname: "release-model",
    label: "By release",
    filters: [
      {
        id: "rolling-release",
        label: "Rolling release",
        match: (d) => d.releaseModel === "rolling",
      },
      {
        id: "fixed-release",
        label: "Fixed release",
        match: (d) => d.releaseModel === "fixed",
      },
      {
        id: "semi-rolling",
        label: "Semi-rolling",
        match: (d) => d.releaseModel === "semi-rolling",
      },
    ],
  },
  {
    groupname: "desktop-environment",
    label: "By desktop",
    filters: [
      {
        id: "kde-plasma",
        label: "KDE Plasma",
        match: (d) => d.desktopEnvironments.some((de) => de.toLowerCase().includes("kde")),
      },
      {
        id: "gnome",
        label: "GNOME",
        match: (d) => d.desktopEnvironments.some((de) => de.toLowerCase() === "gnome"),
      },
      {
        id: "xfce",
        label: "Xfce",
        match: (d) => d.desktopEnvironments.some((de) => de.toLowerCase().includes("xfce")),
      },
      {
        id: "hyprland",
        label: "Hyprland",
        match: (d) => d.desktopEnvironments.some((de) => de.toLowerCase().includes("hyprland")),
      },
      {
        id: "cinnamon",
        label: "Cinnamon",
        match: (d) => d.desktopEnvironments.some((de) => de.toLowerCase().includes("cinnamon")),
      },
    ],
  },
  {
    groupname: "package-manager",
    label: "By package manager",
    filters: [
      {
        id: "apt",
        label: "apt",
        match: (d) => d.packageManager.toLowerCase().includes("apt"),
      },
      {
        id: "pacman",
        label: "pacman",
        match: (d) => d.packageManager.toLowerCase().includes("pacman"),
      },
      {
        id: "dnf",
        label: "dnf",
        match: (d) => d.packageManager.toLowerCase().includes("dnf"),
      },
    ],
  },
];

export const FILTERS_BY_ID = new Map<FilterId, FilterDefinition>(
  FILTER_GROUPS.flatMap((g) => g.filters).map((f) => [f.id, f])
);

export function applyFilters(
  distros: DistroDetail[],
  activeTags: string[],
  query: string
): DistroDetail[] {
  let result = distros;

  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // "all-distros" is a reset — ignore all other tags when it is present
  const effectiveTags = activeTags.filter((t) => t !== "all-distros");

  if (effectiveTags.length > 0) {
    // OR logic: distro matches if it satisfies at least one active tag
    result = result.filter((d) =>
      effectiveTags.some((tagId) => {
        const filter = FILTERS_BY_ID.get(tagId);
        return filter ? filter.match(d) : false;
      })
    );
  }

  return result;
}
