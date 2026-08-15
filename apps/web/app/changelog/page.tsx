import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { getChangelogEntries } from "@/lib/changelog";
import { useMDXComponents } from "@/mdx-components";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "A running log of everything new in DistroDB - feature releases, database updates, and improvements.",
  alternates: { canonical: "https://distrodb.xyz/changelog" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/changelog",
    title: "Changelog | DistroDB",
    description:
      "A running log of everything new in DistroDB - feature releases, database updates, and improvements.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

const TAG_COLORS: Record<string, string> = {
  database: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ui: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  feature: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  fix: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  roadmap: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  performance: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};

function tagClass(tag: string): string {
  return TAG_COLORS[tag] ?? "bg-muted text-muted-foreground";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ChangelogPage() {
  const entries = await getChangelogEntries();
  const components = useMDXComponents({});

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Everything new in DistroDB. Updated on a{" "}
            <span className="text-foreground font-medium">weekly cycle</span> — features, database
            improvements, and fixes.
          </p>
        </div>

        <Separator className="mb-10" />

        {entries.length === 0 ? (
          <p className="text-muted-foreground text-center text-sm">No entries yet.</p>
        ) : (
          <div className="flex flex-col gap-12">
            {entries.map((entry, index) => (
              <article key={entry.slug}>
                {/* Entry header */}
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="border-border rounded-sm border px-2 py-0.5 font-mono text-xs font-medium">
                        v{entry.version}
                      </span>
                      <h2 className="text-base font-semibold">{entry.title}</h2>
                    </div>
                    <time dateTime={entry.date} className="text-muted-foreground pl-0.5 text-xs">
                      {formatDate(entry.date)}
                    </time>
                  </div>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tagClass(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* MDX content */}
                <div className="border-border rounded-sm border p-5">
                  <MDXRemote source={entry.content} components={components} />
                </div>

                {index < entries.length - 1 && <Separator className="mt-12" />}
              </article>
            ))}
          </div>
        )}

        <Separator className="mt-12 mb-10" />

        {/* Footer CTA */}
        <section className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground max-w-sm text-sm">
            Want to suggest a feature or report a bug? Open an issue on GitHub.
          </p>
          <Link
            href="https://github.com/NSWEB-OU/distrodb"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <HugeiconsIcon icon={GithubIcon} size="1rem" />
            View on GitHub
          </Link>
        </section>
      </div>
    </main>
  );
}
