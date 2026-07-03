"use client";

import { useRouter } from "next/navigation";
import { badgeVariants } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { GLOSSARY, findGlossaryKey } from "@/lib/glossary";

type GlossaryBadgeProps = {
  /** The text to display inside the badge. */
  label: string;
  /**
   * Explicit glossary key. If omitted the key is resolved automatically
   * from the label via findGlossaryKey().
   */
  glossaryKey?: string;
};

export function GlossaryBadge({ label, glossaryKey }: GlossaryBadgeProps) {
  const router = useRouter();
  const key = glossaryKey ?? findGlossaryKey(label);
  const entry = key ? GLOSSARY[key] : undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (key) router.push(`/glossary#${key}`);
  };

  if (!entry || !key) {
    return (
      <span className={cn(badgeVariants({ variant: "secondary" }))}>{label}</span>
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
          {label}
        </TooltipTrigger>
        <TooltipContent className="max-w-60">{entry.description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
