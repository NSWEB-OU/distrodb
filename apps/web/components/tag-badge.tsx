"use client";

import { useRouter } from "next/navigation";
import { badgeVariants } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GLOSSARY } from "@/lib/glossary";

type TagBadgeProps = {
  tag: string;
};

export function TagBadge({ tag }: TagBadgeProps) {
  const router = useRouter();
  const entry = GLOSSARY[tag];
  const href = `/glossary#${tag}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href);
  };

  if (!entry) {
    return (
      <button
        type="button"
        className={cn(badgeVariants({ variant: "secondary" }), "cursor-pointer")}
        onClick={handleClick}
      >
        {tag}
      </button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              className={cn(badgeVariants({ variant: "secondary" }), "cursor-pointer")}
              onClick={handleClick}
            />
          }
        >
          {tag}
        </TooltipTrigger>
        <TooltipContent className="max-w-60">{entry.description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
