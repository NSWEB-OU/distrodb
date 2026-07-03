import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { getResourcesByCategory } from "@/lib/resources";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Linux Resources - Best Tools, Wikis & Communities for Linux Users",
  description:
    "The ultimate Linux resource hub: Arch Wiki, distro choosers, learning sites, news, and communities. Everything you need to learn Linux and find the right distribution.",
  keywords: [
    "linux resources",
    "how to learn linux",
    "best linux resources",
    "arch wiki",
    "linux training",
    "linux community",
    "distro chooser",
    "linux tools",
    "linux for beginners",
  ],
  alternates: { canonical: "https://distrodb.xyz/resources" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/resources",
    title: "Linux Resources - Best Tools, Wikis & Communities | DistroDB",
    description:
      "The ultimate Linux resource hub: Arch Wiki, distro choosers, learning sites, news, and communities. Everything you need to learn Linux and find the right distribution.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

export default function ResourcesPage() {
  const groups = getResourcesByCategory();

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            The Best Linux Resources: Tools, Wikis &amp; Communities
          </h1>
          <p className="text-muted-foreground mx-auto max-w-lg text-sm">
            A curated hub for every Linux user - from beginner-friendly communities and distro
            choosers to the Arch Wiki, learning sites, and essential tools.
          </p>
        </div>

        {/* Quick-navigation */}
        <nav aria-label="Resources index" className="mb-10">
          <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
            Jump to
          </p>
          <div className="flex flex-wrap gap-2">
            {groups.map(({ category, categoryLabel }) => (
              <Link
                key={category}
                href={`#${category}`}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {categoryLabel}
              </Link>
            ))}
          </div>
        </nav>

        <Separator className="mb-10" />

        {/* Grouped entries */}
        <div className="flex flex-col gap-14">
          {groups.map(({ category, categoryLabel, entries }) => (
            <section key={category} id={category} className="scroll-mt-20">
              <h2 className="mb-6 text-lg font-semibold tracking-tight">{categoryLabel}</h2>
              <ul className="flex flex-col gap-6">
                {entries.map(({ name, url, description, internal, recommended }) => {
                  const hostname = internal ? null : new URL(url).hostname.replace(/^www\./, "");
                  return (
                    <li key={url} className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <Link
                          href={url}
                          {...(!internal && { target: "_blank", rel: "noopener noreferrer" })}
                          className="text-foreground hover:text-primary inline-flex items-center gap-1 font-medium underline underline-offset-2 transition-colors"
                        >
                          {name}
                          {!internal && (
                            <HugeiconsIcon
                              icon={ArrowUpRight01Icon}
                              size="0.75rem"
                              className="shrink-0 opacity-60"
                            />
                          )}
                        </Link>
                        {hostname && (
                          <span className="text-muted-foreground text-xs">{hostname}</span>
                        )}
                        {recommended && (
                          <Badge
                            variant="outline"
                            className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] px-1.5 py-0"
                          >
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <Separator className="mt-14 mb-8" />

        <p className="text-muted-foreground text-center text-xs">
          Missing a resource?{" "}
          <Link
            href="/contact"
            className="text-foreground underline underline-offset-2 transition-colors hover:opacity-75"
          >
            Let us know
          </Link>
          .
        </p>
        <p className="text-muted-foreground text-center text-xs mt-2">
          Want to contribute?{" "}
          <Link
            href="https://github.com/NSWEB-OU/distrodb"
            className="text-foreground underline underline-offset-2 transition-colors hover:opacity-75"
          >
            Open an issue or PR on GitHub
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
