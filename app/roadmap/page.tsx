import type { Metadata } from "next";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import {
  DatabaseIcon,
  ComputerIcon,
  FilterIcon,
  SourceCodeIcon,
  StarIcon,
  Tick02Icon,
  Loading01Icon,
  Clock01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "See what's planned for DistroDB - from database improvements and DistroSea integration to an expanded distro catalog and a full rating system.",
  alternates: { canonical: "https://distrodb.xyz/roadmap" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/roadmap",
    title: "Roadmap | DistroDB",
    description:
      "See what's planned for DistroDB - from database improvements and DistroSea integration to an expanded distro catalog and a full rating system.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

type RoadmapStatus = "done" | "in-progress" | "upcoming" | "planned";

interface RoadmapItem {
  icon: IconSvgElement;
  title: string;
  description: string;
  status: RoadmapStatus;
  quarter?: string;
}

const roadmapItems: RoadmapItem[] = [
  {
    icon: DatabaseIcon,
    title: "Database review & curation",
    description:
      "Manual audit of the entire distro database - fixing tag inconsistencies, correcting descriptions, updating broken links, and adding high-quality desktop screenshots for every entry.",
    status: "in-progress",
  },
  {
    icon: ComputerIcon,
    title: "DistroSea integration",
    description:
      "Launch a live distro test directly from its page via DistroSea. No download required - try before you commit, straight from the browser.",
    status: "upcoming",
  },
  {
    icon: FilterIcon,
    title: "Distro Wizard improvements",
    description:
      "Sharpen the recommendation algorithm behind the Distro Wizard. Better answer weighting, improved scoring logic, and more accurate results that reflect real-world use cases.",
    status: "upcoming",
  },
  {
    icon: SourceCodeIcon,
    title: "100 more distros",
    description:
      "Expand the database with 100 additional Linux distributions - covering more niche, regional, and specialized distros that deserve a proper home in the catalog.",
    status: "upcoming",
  },
  {
    icon: StarIcon,
    title: "Ratings & reviews",
    description:
      "A community-driven rating and review system. Users will be able to rate distributions and share short written reviews to help others make informed decisions.",
    status: "planned",
    quarter: "Q4",
  },
];

const statusConfig = {
  done: {
    label: "Completed",
    icon: Tick02Icon,
    badgeClass: "text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
    lineClass: "bg-emerald-500/30",
  },
  "in-progress": {
    label: "In progress",
    icon: Loading01Icon,
    badgeClass: "text-blue-600 dark:text-blue-400",
    dotClass: "bg-blue-500",
    lineClass: "bg-blue-500/30",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock01Icon,
    badgeClass: "text-muted-foreground",
    dotClass: "bg-border",
    lineClass: "bg-border",
  },
  planned: {
    label: "Planned",
    icon: Calendar01Icon,
    badgeClass: "text-muted-foreground",
    dotClass: "bg-border",
    lineClass: "bg-border",
  },
} satisfies Record<
  RoadmapStatus,
  {
    label: string;
    icon: IconSvgElement;
    badgeClass: string;
    dotClass: string;
    lineClass: string;
  }
>;

export default function RoadmapPage() {
  const completedCount = roadmapItems.filter((i) => i.status === "done").length;

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {completedCount} of {roadmapItems.length} completed
            </span>
            <span className="text-muted-foreground rounded-full border px-3 py-0.5 text-xs font-medium">
              Updated weekly
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            What we&apos;re building, what&apos;s done, and what&apos;s coming next. DistroDB ships
            updates on a <span className="text-foreground font-medium">weekly cycle</span> -
            progress is steady and public.
          </p>
        </div>

        <Separator className="mb-10" />

        {/* Roadmap list */}
        <ol className="relative flex flex-col gap-0">
          {roadmapItems.map((item, index) => {
            const config = statusConfig[item.status];
            const isLast = index === roadmapItems.length - 1;

            return (
              <li key={item.title} className="relative flex gap-5 pb-8 last:pb-0">
                {/* Timeline spine */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
                      item.status === "done"
                        ? "border-emerald-500 bg-emerald-500/10"
                        : item.status === "in-progress"
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-border bg-background"
                    }`}
                  >
                    <HugeiconsIcon icon={config.icon} size="0.8rem" className={config.badgeClass} />
                  </div>
                  {!isLast && <div className={`mt-1 w-px grow ${config.lineClass}`} />}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pb-2">
                  <div className="border-border flex flex-col gap-3 rounded-sm border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={item.icon}
                          size="1rem"
                          className="text-foreground mt-0.5 shrink-0"
                        />
                        <span className="text-sm leading-snug font-semibold">{item.title}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {item.quarter && (
                          <Badge variant="outline" className="text-muted-foreground text-xs">
                            {item.quarter}
                          </Badge>
                        )}
                        <span
                          className={`flex items-center gap-1 text-xs font-medium whitespace-nowrap ${config.badgeClass}`}
                        >
                          {config.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <Separator className="mt-4 mb-10" />

        {/* Footer note */}
        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          This roadmap reflects the current priorities of the project. Items may shift between
          cycles. <span className="text-foreground font-medium">Have a suggestion?</span> Open an
          issue or pull request on GitHub.
        </p>
      </div>
    </main>
  );
}
