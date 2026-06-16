"use client";

import { useState } from "react";
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
      <Button variant="outline" size="sm" className={className} onClick={() => setOpen(true)}>
        Suggest a change
      </Button>
      <SuggestChangesSheet distroName={distroName} open={open} onOpenChange={setOpen} />
    </>
  );
}
