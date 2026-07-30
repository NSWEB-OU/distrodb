import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GameController01Icon,
  ArrowUpRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { getGamersRating } from "@/lib/steam-survey";

export async function GamersRating() {
  const rating = await getGamersRating();

  if (!rating || rating.distros.length === 0) return null;

  const max = rating.distros[0].share;

  return (
    <section className="border-border rounded-sm border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={GameController01Icon}
              size="0.875rem"
              className="text-muted-foreground"
            />
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Gamers
            </span>
          </div>
          <h2 className="text-foreground text-lg font-semibold">Most popular among Linux gamers</h2>
        </div>
        <a
          href="https://store.steampowered.com/hwsurvey/Steam-Hardware-Software-Survey-Welcome-to-Steam?platform=linux"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground group inline-flex shrink-0 items-center gap-1 font-mono text-xs transition-colors"
        >
          Steam · {rating.month}
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size="0.75rem"
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>

      <ol className="mt-4 flex flex-col gap-2">
        {rating.distros.map((distro) => {
          const row = (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-5 shrink-0 text-right font-mono text-xs">
                {distro.rank}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-foreground truncate text-sm font-medium">
                    {distro.name}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <TrendBadge change={distro.change} />
                    <span className="text-muted-foreground font-mono text-xs">
                      {distro.share.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: `${(distro.share / max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );

          return (
            <li key={distro.slug ?? distro.name}>
              {distro.slug ? (
                <Link
                  href={`/distros/${distro.slug}`}
                  className="hover:bg-muted/50 -mx-2 block rounded-sm px-2 py-1.5 transition-colors"
                >
                  {row}
                </Link>
              ) : (
                <div className="-mx-2 px-2 py-1.5">{row}</div>
              )}
            </li>
          );
        })}
      </ol>

      <p className="text-muted-foreground mt-4 text-xs">
        Share of Steam&apos;s Linux users only (not overall usage). Versions of the same distro are
        combined; trend is the net month-over-month change. Source: Steam Hardware &amp; Software
        Survey, updated monthly.
      </p>
    </section>
  );
}

function TrendBadge({ change }: { change: number }) {
  if (change === 0) {
    return <span className="text-muted-foreground/60 font-mono text-xs">—</span>;
  }

  const up = change > 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 font-mono text-xs ${
        up ? "text-emerald-500" : "text-red-500"
      }`}
    >
      <HugeiconsIcon icon={up ? ArrowUp01Icon : ArrowDown01Icon} size="0.75rem" />
      {Math.abs(change).toFixed(2)}
    </span>
  );
}
