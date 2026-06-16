"use client";

import { useCompare } from "./compare-provider";

export function CompareBarSpacer() {
  const { selected } = useCompare();
  const visible = selected.length > 0;

  return (
    <div
      className={`shrink-0 transition-[height] duration-300 ease-in-out ${visible ? "h-28 sm:h-20" : "h-0"}`}
      aria-hidden
    />
  );
}
