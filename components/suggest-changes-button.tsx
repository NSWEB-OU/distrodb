"use client";

import { useState } from "react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { SuggestChangesSheet } from "@/components/suggest-changes-sheet";

export function SuggestChangesButton({
  distroName,
  className,
}: {
  distroName: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" className={className} onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={PencilEdit02Icon} />
        Suggest a change
      </Button>
      <SuggestChangesSheet distroName={distroName} open={open} onOpenChange={setOpen} />
    </>
  );
}
