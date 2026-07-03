"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Calendar01Icon,
  NoteIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

const CHANGELOG_DISMISSED_KEY = "home-widget-changelog-dismissed-version";
const ROADMAP_DISMISSED_KEY = "home-widget-roadmap-dismissed";

interface WidgetData {
  version: string;
  title: string;
  date: string;
}

interface HomeWidgetsClientProps {
  latest: WidgetData | null;
}

export function HomeWidgetsClient({ latest }: HomeWidgetsClientProps) {
  const [dismissedChangelogVersion, setDismissedChangelogVersion] = useState<string | null>(null);
  const [roadmapDismissed, setRoadmapDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setDismissedChangelogVersion(localStorage.getItem(CHANGELOG_DISMISSED_KEY));
      setRoadmapDismissed(localStorage.getItem(ROADMAP_DISMISSED_KEY) === "1");
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  function dismissChangelog(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!latest) return;
    setDismissedChangelogVersion(latest.version);
    try {
      localStorage.setItem(CHANGELOG_DISMISSED_KEY, latest.version);
    } catch {
      // ignore
    }
  }

  function dismissRoadmap(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setRoadmapDismissed(true);
    try {
      localStorage.setItem(ROADMAP_DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
  }

  // Show changelog if never dismissed, or if a newer version has shipped
  const showChangelog = dismissedChangelogVersion !== latest?.version;
  const showRoadmap = !roadmapDismissed;

  // Don't render until we've read localStorage to avoid layout shift
  if (!mounted || (!showChangelog && !showRoadmap)) return null;

  return (
    <div
      className={`mx-auto mt-6 grid max-w-2xl gap-3 md:px-6 ${
        showChangelog && showRoadmap ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {showChangelog && (
        <Link
          href="/changelog"
          className="border-border hover:bg-muted/50 group relative flex flex-col gap-2 rounded-sm border p-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={NoteIcon} size="0.875rem" className="text-muted-foreground" />
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Changelog
              </span>
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size="0.875rem"
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <button
                onClick={dismissChangelog}
                aria-label="Dismiss changelog widget"
                className="text-muted-foreground hover:text-foreground -mr-1 rounded-sm p-0.5 transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size="0.75rem" />
              </button>
            </div>
          </div>
          {latest ? (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="border-border rounded-sm border px-1.5 py-0.5 font-mono text-xs font-medium">
                  v{latest.version}
                </span>
                <span className="text-foreground truncate text-sm font-medium">{latest.title}</span>
              </div>
              <span className="text-muted-foreground text-xs">{latest.date}</span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">See what&apos;s new.</p>
          )}
        </Link>
      )}

      {showRoadmap && (
        <Link
          href="/roadmap"
          className="border-border hover:bg-muted/50 group relative flex flex-col gap-2 rounded-sm border p-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Calendar01Icon}
                size="0.875rem"
                className="text-muted-foreground"
              />
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Roadmap
              </span>
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-blue-500" />
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size="0.875rem"
                className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <button
                onClick={dismissRoadmap}
                aria-label="Dismiss roadmap widget"
                className="text-muted-foreground hover:text-foreground -mr-1 rounded-sm p-0.5 transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size="0.75rem" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground text-sm font-medium">What&apos;s coming next</span>
            <span className="text-muted-foreground text-xs">
              Updated weekly &mdash; DistroSea, Wizard improvements &amp; more
            </span>
          </div>
        </Link>
      )}
    </div>
  );
}
