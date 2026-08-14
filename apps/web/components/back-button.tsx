"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs transition-colors"
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size="0.75rem" />
      Back
    </button>
  );
}
