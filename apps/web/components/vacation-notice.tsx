import { HugeiconsIcon } from "@hugeicons/react";
import { BeachIcon } from "@hugeicons/core-free-icons";

export function VacationNotice() {
  return (
    <div className="border-border bg-muted/40 mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-sm border p-4">
      <HugeiconsIcon icon={BeachIcon} size="1.1rem" className="text-foreground mt-0.5 shrink-0" />
      <p className="text-muted-foreground text-sm leading-relaxed">
        <span className="text-foreground font-medium">We&apos;re on vacation!</span> The DistroDB
        team is taking a short break, so new updates are paused for now. We&apos;ll be back to
        shipping in mid-August. Thanks for your patience.
      </p>
    </div>
  );
}
