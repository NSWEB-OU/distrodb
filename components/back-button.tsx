"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { buttonVariants } from "@/components/ui/button-variants";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={buttonVariants({ variant: "outline", size: "sm" })}
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size="0.875rem" />
      Back
    </button>
  );
}
