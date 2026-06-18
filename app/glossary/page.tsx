import type { Metadata } from "next";
import Link from "next/link";
import { getGlossaryEntriesByCategory } from "@/lib/glossary";
import { getAllDistros } from "@/lib/distros";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Glossary — Linux distro tags explained",
  description:
    "Definitions for every tag used on DistroDB — from atomic updates and immutable systems to source-based packaging and live environments.",
  alternates: { canonical: "https://distrodb.xyz/glossary" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/glossary",
    title: "Glossary | DistroDB",
    description: "Definitions for every tag used across DistroDB Linux distribution entries.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

export default function GlossaryPage() {
  const groups = getGlossaryEntriesByCategory();
  const allDistros = getAllDistros();

  const distrosByTag = new Map<string, { name: string; slug: string }[]>();
  for (const distro of allDistros) {
    for (const tag of distro.tags) {
      if (!distrosByTag.has(tag)) distrosByTag.set(tag, []);
      distrosByTag.get(tag)!.push({ name: distro.name, slug: distro.slug });
    }
  }

  const allEntries = groups.flatMap((g) => g.entries);

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Glossary</h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Plain-English explanations of tags, init systems, package managers, display servers,
            desktop environments, and release models used across DistroDB.
          </p>
        </div>

        {/* Quick-navigation */}
        <nav aria-label="Glossary index" className="mb-10">
          <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
            Jump to
          </p>
          <div className="flex flex-wrap gap-2">
            {allEntries.map(({ tag, label }) => (
              <Link
                key={tag}
                href={`#${tag}`}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <Separator className="mb-10" />

        {/* Grouped entries */}
        <div className="flex flex-col gap-14">
          {groups.map(({ category, categoryLabel, entries }) => {
            if (entries.length === 0) return null;
            return (
              <section key={category}>
                <h2 className="mb-6 text-lg font-semibold tracking-tight">{categoryLabel}</h2>
                <dl className="flex flex-col gap-10">
                  {entries.map(({ tag, label, description }) => {
                    const distros = distrosByTag.get(tag) ?? [];
                    return (
                      <div key={tag} id={tag} className="scroll-mt-20">
                        <dt className="mb-1 flex items-center gap-3">
                          <span className="text-xl font-semibold tracking-tight">{label}</span>
                          <Badge variant="secondary">{tag}</Badge>
                        </dt>
                        <dd className="text-muted-foreground mb-4 text-sm leading-relaxed">
                          {description}
                        </dd>
                        {distros.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-muted-foreground self-center text-xs">
                              Used by:
                            </span>
                            {distros.map((d) => (
                              <Link
                                key={d.slug}
                                href={`/distros/${d.slug}`}
                                className="text-foreground hover:text-primary text-xs underline underline-offset-2 transition-colors"
                              >
                                {d.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </dl>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
