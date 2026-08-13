import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GameController01Icon,
  ArrowUpRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { getGamersRating } from "@/lib/steam-survey";

const TOP_N = 5;

export async function GamersRatingMini() {
  const rating = await getGamersRating();

  if (!rating || rating.distros.length === 0) return null;

  const top = rating.distros.slice(0, TOP_N);
  const max = top[0].share;

  return (
    <div className="mx-auto mt-6 max-w-2xl md:px-6">
      <Link
        href="/popularity"
        className="border-border hover:bg-muted/50 group relative flex flex-col gap-3 rounded-sm border p-4 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={GameController01Icon}
              size="0.875rem"
              className="text-muted-foreground"
            />
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Popular with gamers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-xs">Steam · {rating.month}</span>
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size="0.875rem"
              className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>

        <ol className="flex flex-col gap-1.5">
          {top.map((distro) => (
            <li key={distro.slug ?? distro.name} className="flex items-center gap-2.5">
              <span className="text-muted-foreground w-3 shrink-0 text-right font-mono text-xs">
                {distro.rank}
              </span>
              <span className="text-foreground w-24 shrink-0 truncate text-xs font-medium sm:w-32">
                {distro.name}
              </span>
              <div className="bg-muted h-1 flex-1 overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${(distro.share / max) * 100}%` }}
                />
              </div>
              <MiniTrend change={distro.change} />
              <span className="text-muted-foreground w-11 shrink-0 text-right font-mono text-xs">
                {distro.share.toFixed(1)}%
              </span>
            </li>
          ))}
        </ol>
      </Link>
    </div>
  );
}

function MiniTrend({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="text-muted-foreground/50 w-8 shrink-0 text-center font-mono text-xs">—</span>
    );
  }

  const up = change > 0;

  return (
    <span
      className={`inline-flex w-8 shrink-0 items-center justify-end gap-0.5 font-mono text-xs ${
        up ? "text-emerald-500" : "text-red-500"
      }`}
    >
      <HugeiconsIcon icon={up ? ArrowUp01Icon : ArrowDown01Icon} size="0.6875rem" />
      {Math.abs(change).toFixed(1)}
    </span>
  );
}
