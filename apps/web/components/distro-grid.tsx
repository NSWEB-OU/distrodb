"use client";

import { useEffect, useRef, useState } from "react";
import { DistroCard } from "./distro-card";
import type { GridDistro } from "./types/types";

const PAGE_SIZE = 20;
const PRIORITY_COUNT = 6;

type DistroGridProps = {
  distros: GridDistro[];
};

export function DistroGrid({ distros }: DistroGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visible = distros.slice(0, visibleCount);
  const hasMore = visibleCount < distros.length;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [distros]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, distros.length));
        }
      },
      { rootMargin: "200px" }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, distros.length]);

  if (distros.length === 0) {
    return (
      <p className="text-muted-foreground col-span-full py-12 text-center">
        No distributions match your filters.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((distro, index) => (
          <DistroCard key={distro.id} {...distro} priority={index < PRIORITY_COUNT} />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </>
  );
}
