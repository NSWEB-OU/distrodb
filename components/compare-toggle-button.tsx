"use client";

import { useCompare, type CompareEntry } from "./compare-provider";
import { Button } from "./ui/button";

type Props = Omit<CompareEntry, "img"> & { img?: string; className?: string };

export function CompareToggleButton({ slug, name, img, className }: Props) {
  const { toggle, isSelected, canAdd } = useCompare();
  const active = isSelected(slug);
  const disabled = !active && !canAdd;

  return (
    <Button
      size="sm"
      variant="ghost"
      className={[
        "border text-xs font-semibold backdrop-blur-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
          : disabled
            ? "cursor-not-allowed border-white/10 bg-black/50 text-white/40"
            : "border-white/20 bg-black/50 text-white hover:border-white/40 hover:bg-black/70",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      aria-label={active ? `Remove ${name} from comparison` : `Add ${name} to comparison`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ slug, name, img });
      }}
    >
      {active ? "✓ Comparing" : disabled ? "Max 2" : "+ Compare"}
    </Button>
  );
}
