import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Terminal window chrome */}
        <div className="border-border overflow-hidden rounded-lg border shadow-2xl">
          {/* Title bar */}
          <div className="bg-muted border-border flex items-center gap-2 border-b px-4 py-3">
            <span className="bg-destructive/70 size-3 rounded-full" />
            <span className="bg-primary/70 size-3 rounded-full" />
            <span className="size-3 rounded-full bg-emerald-500/70" />
            <span className="text-muted-foreground ml-3 flex-1 text-center font-mono text-xs">
              bash — distrodb
            </span>
          </div>

          {/* Terminal body */}
          <div className="space-y-1 bg-[oklch(0.10_0.004_49.25)] px-5 py-5 font-mono text-sm leading-7">
            {/* prompt line 1 */}
            <div className="flex gap-2">
              <span className="text-emerald-400">user@distrodb</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground/80 ml-1">cd /this-page</span>
            </div>

            {/* error output */}
            <div className="text-destructive pl-1">
              bash: cd: /this-page: No such file or directory
            </div>

            {/* prompt line 2 */}
            <div className="flex gap-2">
              <span className="text-emerald-400">user@distrodb</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground/80 ml-1">echo $?</span>
            </div>

            {/* exit code */}
            <div className="text-primary py-2 pl-1 text-5xl font-bold tracking-tight">404</div>

            {/* prompt line 3 */}
            <div className="flex gap-2">
              <span className="text-emerald-400">user@distrodb</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground/80 ml-1">cat /proc/error</span>
            </div>

            {/* description */}
            <div className="text-muted-foreground pl-1">
              <span className="text-primary/80">page:</span> The distro or page you requested does
              not exist in the database.
            </div>
            <div className="text-muted-foreground pl-1">
              <span className="text-primary/80">hint:</span> Check the URL or browse all
              distributions from the home page.
            </div>

            {/* blinking cursor prompt */}
            <div className="mt-1 flex gap-2">
              <span className="text-emerald-400">user@distrodb</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-muted-foreground">$</span>
              <span className="bg-foreground/70 ml-1 inline-block h-5 w-2 animate-pulse align-middle" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button render={<Link href="/" />} nativeButton={false} variant="default" size="default">
            cd ~&nbsp;— Return home
          </Button>
          <Button render={<Link href="/" />} nativeButton={false} variant="outline" size="default">
            ls distros — Browse all
          </Button>
        </div>
      </div>
    </main>
  );
}
