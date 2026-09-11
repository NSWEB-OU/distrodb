import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge02Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { badgeVariants } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type VerificationBadgeProps = {
  verified: boolean;
  /** ISO timestamp of the last edit to this entry. */
  updatedAt: string;
  /**
   * "default" renders a full text badge (detail page). "floating" renders a
   * compact icon-only chip meant to sit over a card's image, since the full
   * label pushes the card title onto extra lines at narrower breakpoints.
   */
  variant?: "default" | "floating";
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function VerificationBadge({
  verified,
  updatedAt,
  variant = "default",
}: VerificationBadgeProps) {
  const date = formatDate(updatedAt);

  const label = verified ? "Verified" : "Needs moderation";
  const description = verified
    ? `An admin has manually reviewed and confirmed the accuracy of this distro's information. Last changed on ${date}.`
    : `This entry hasn't been manually reviewed by an admin yet. Some information may be outdated or inaccurate. Last changed on ${date}.`;

  const icon = verified ? CheckmarkBadge02Icon : Alert02Icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            variant === "floating" ? (
              <span
                aria-label={label}
                className={cn(
                  "inline-flex size-6 shrink-0 cursor-default items-center justify-center rounded-full border backdrop-blur-sm",
                  verified
                    ? "border-emerald-400/30 bg-black/50 text-emerald-400"
                    : "border-amber-400/30 bg-black/50 text-amber-400"
                )}
              />
            ) : (
              <span
                className={cn(
                  badgeVariants({ variant: verified ? "default" : "outline" }),
                  "cursor-default",
                  verified
                    ? "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                    : "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400"
                )}
              />
            )
          }
        >
          <HugeiconsIcon icon={icon} size={variant === "floating" ? "0.875rem" : "0.75rem"} />
          {variant === "default" && label}
        </TooltipTrigger>
        <TooltipContent className="max-w-60">{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
