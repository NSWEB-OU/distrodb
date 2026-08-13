"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FILTERS_BY_ID } from "@/lib/filters";

const ActiveFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tags = searchParams.getAll("tag");
  const query = searchParams.get("q") ?? "";

  const removeTag = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll("tag");
      params.delete("tag");
      current.filter((t) => t !== id).forEach((t) => params.append("tag", t));
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const clearQuery = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  if (tags.length === 0 && !query) return null;

  return (
    <div className="mx-auto mt-3 flex max-w-2xl flex-wrap items-center gap-2">
      {query && (
        <button
          onClick={clearQuery}
          className="border-border bg-muted text-foreground hover:bg-muted/70 inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs transition-colors"
        >
          <span className="text-muted-foreground">search:</span>
          {query}
          <HugeiconsIcon
            icon={Cancel01Icon}
            size="0.75rem"
            className="text-muted-foreground ml-0.5"
          />
        </button>
      )}
      {tags.map((id) => {
        const filter = FILTERS_BY_ID.get(id);
        return (
          <button
            key={id}
            onClick={() => removeTag(id)}
            className="border-border bg-muted text-foreground hover:bg-muted/70 inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs transition-colors"
          >
            {filter?.label ?? id}
            <HugeiconsIcon
              icon={Cancel01Icon}
              size="0.75rem"
              className="text-muted-foreground ml-0.5"
            />
          </button>
        );
      })}
      {(tags.length > 1 || (tags.length > 0 && query)) && (
        <button
          onClick={clearAll}
          className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;
