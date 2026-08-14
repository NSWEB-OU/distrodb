"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCompare } from "./compare-provider";
import { Button } from "./ui/button";

export function CompareBar() {
  const { selected, clear } = useCompare();
  const router = useRouter();

  const visible = selected.length > 0;
  const ready = selected.length === 2;

  const handleCompare = () => {
    if (!ready) return;
    const [a, b] = selected;
    router.push(`/vs/${a.slug}-vs-${b.slug}`);
    clear();
  };

  return (
    <div
      aria-hidden={!visible}
      className={[
        "fixed right-0 bottom-0 left-0 z-[200] transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <div className="mx-auto max-w-4xl px-4 pb-4">
        <div className="bg-card border-border flex flex-col gap-2 rounded-xl border px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-3">
          {/* Slots + VS */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {[0, 1].map((i) => {
              const entry = selected[i];
              return (
                <React.Fragment key={i}>
                  {i === 1 && (
                    <span className="text-muted-foreground/50 shrink-0 text-xs font-black select-none">
                      VS
                    </span>
                  )}
                  <div className="bg-muted/50 flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2">
                    {entry ? (
                      <>
                        {entry.img && (
                          <div className="relative h-5 w-8 shrink-0 overflow-hidden rounded-sm">
                            <Image
                              src={entry.img}
                              alt={entry.name}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                        )}
                        <span className="truncate text-sm font-medium">{entry.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground truncate text-xs">
                        {i === 0 ? "Select a distro…" : "Select one more…"}
                      </span>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={clear}
              aria-label="Clear comparison selection"
              className="flex-1 sm:flex-none"
            >
              Clear
            </Button>
            <Button
              size="sm"
              disabled={!ready}
              onClick={handleCompare}
              className="flex-1 sm:flex-none"
            >
              {ready ? "Compare →" : `${selected.length}/2 selected`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
