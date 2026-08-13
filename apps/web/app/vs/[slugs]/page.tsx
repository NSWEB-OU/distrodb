import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getDistroBySlug, getAllVsSlugs } from "@/lib/distros";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DistroDetail, DifficultyLevel, ReleaseModel } from "@/components/types/types";

const BASE_URL = "https://distrodb.xyz";

const RELEASE_LABEL: Record<ReleaseModel, string> = {
  rolling: "Rolling Release",
  fixed: "Fixed Release",
  "semi-rolling": "Semi-Rolling",
};

const DIFFICULTY_LABEL: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function parseSlugs(slugs: string): [string, string] | null {
  const match = slugs.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;
  return [match[1], match[2]];
}

export async function generateStaticParams() {
  return await getAllVsSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string }>;
}): Promise<Metadata> {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) return {};

  const [slugA, slugB] = parsed;
  const [a, b] = await Promise.all([getDistroBySlug(slugA), getDistroBySlug(slugB)]);
  if (!a || !b) return {};

  const title = `${a.name} vs ${b.name} - Linux Distro Comparison | DistroDB`;
  const description = `Side-by-side comparison of ${a.name} and ${b.name}. Compare package managers, init systems, release models, desktop environments, architecture support and more.`;
  const url = `${BASE_URL}/vs/${slugs}`;
  const image = a.img ? `${BASE_URL}${a.img}` : `${BASE_URL}/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      `${a.name} vs ${b.name}`,
      `${a.name} compared to ${b.name}`,
      `${b.name} vs ${a.name}`,
      a.name,
      b.name,
      "Linux comparison",
      "Linux distro comparison",
      a.packageManager,
      b.packageManager,
      ...a.tags,
      ...b.tags,
    ],
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "DistroDB",
      images: [{ url: image, width: 1200, height: 675, alt: `${a.name} vs ${b.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

function VsJsonLd({ a, b, url }: { a: DistroDetail; b: DistroDetail; url: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name: `${a.name} vs ${b.name} - Linux Distro Comparison`,
    description: `Side-by-side comparison of ${a.name} and ${b.name} Linux distributions.`,
    publisher: { "@type": "Organization", name: "DistroDB", url: BASE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "SoftwareApplication",
            name: a.name,
            applicationCategory: "OperatingSystem",
            url: a.website,
            softwareVersion: a.latestVersion,
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "SoftwareApplication",
            name: b.name,
            applicationCategory: "OperatingSystem",
            url: b.website,
            softwareVersion: b.latestVersion,
          },
        },
      ],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type RowConfig = {
  label: string;
  key: keyof DistroDetail;
  format?: (val: DistroDetail[keyof DistroDetail]) => string;
  highlight?: (a: DistroDetail, b: DistroDetail) => "a" | "b" | "both" | "none";
};

const ROWS: RowConfig[] = [
  {
    label: "Base",
    key: "base",
    format: (v) => (v as string | null) ?? "Independent",
  },
  { label: "Package Manager", key: "packageManager" },
  { label: "Init System", key: "initSystem" },
  {
    label: "Release Model",
    key: "releaseModel",
    format: (v) => RELEASE_LABEL[v as ReleaseModel],
  },
  { label: "Latest Version", key: "latestVersion" },
  {
    label: "Difficulty",
    key: "difficulty",
    format: (v) => DIFFICULTY_LABEL[v as DifficultyLevel],
  },
  {
    label: "Release Date",
    key: "releaseDate",
    format: (v) => {
      if (!v) return "N/A";
      return new Date(v as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    highlight: (a, b) => {
      const da = new Date(a.releaseDate).getTime();
      const db = new Date(b.releaseDate).getTime();
      return da > db ? "a" : db > da ? "b" : "both";
    },
  },
];

// Lower difficulty index = more beginner-friendly (highlighted green)
const DIFFICULTY_ORDER: DifficultyLevel[] = ["beginner", "intermediate", "advanced"];

function getDifficultyHighlight(a: DistroDetail, b: DistroDetail): "a" | "b" | "both" | "none" {
  const ia = DIFFICULTY_ORDER.indexOf(a.difficulty);
  const ib = DIFFICULTY_ORDER.indexOf(b.difficulty);
  if (ia < ib) return "a";
  if (ib < ia) return "b";
  return "both";
}

function CompareRow({
  label,
  valA,
  valB,
  winner,
}: {
  label: string;
  valA: string;
  valB: string;
  winner: "a" | "b" | "both" | "none";
}) {
  return (
    <div className="border-border grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b py-3 last:border-0">
      <span
        className={[
          "rounded px-2 py-1 text-sm font-medium",
          winner === "a" || winner === "both"
            ? "bg-emerald-500/10 text-emerald-400"
            : "text-foreground",
        ].join(" ")}
      >
        {valA}
      </span>
      <span className="text-muted-foreground px-2 text-center text-xs whitespace-nowrap">
        {label}
      </span>
      <span
        className={[
          "rounded px-2 py-1 text-right text-sm font-medium",
          winner === "b" || winner === "both"
            ? "bg-emerald-500/10 text-emerald-400"
            : "text-foreground",
        ].join(" ")}
      >
        {valB}
      </span>
    </div>
  );
}

function ArchRow({ a, b }: { a: DistroDetail; b: DistroDetail }) {
  const aSet = new Set(a.architecture);
  const bSet = new Set(b.architecture);
  const allArches = [...new Set([...a.architecture, ...b.architecture])];
  const aWins = a.architecture.length > b.architecture.length;
  const bWins = b.architecture.length > a.architecture.length;

  return (
    <div className="border-border grid grid-cols-[1fr_auto_1fr] items-start gap-2 border-b py-3">
      <div
        className={["flex flex-wrap gap-1", aWins ? "rounded bg-emerald-500/10 p-1" : ""].join(" ")}
      >
        {allArches.map((arch) =>
          aSet.has(arch) ? (
            <Badge key={arch} variant="outline" className="text-xs">
              {arch}
            </Badge>
          ) : (
            <Badge key={arch} variant="outline" className="text-xs opacity-25">
              {arch}
            </Badge>
          )
        )}
      </div>
      <span className="text-muted-foreground px-2 pt-1.5 text-center text-xs whitespace-nowrap">
        Architecture
      </span>
      <div
        className={[
          "flex flex-wrap justify-end gap-1",
          bWins ? "rounded bg-emerald-500/10 p-1" : "",
        ].join(" ")}
      >
        {allArches.map((arch) =>
          bSet.has(arch) ? (
            <Badge key={arch} variant="outline" className="text-xs">
              {arch}
            </Badge>
          ) : (
            <Badge key={arch} variant="outline" className="text-xs opacity-25">
              {arch}
            </Badge>
          )
        )}
      </div>
    </div>
  );
}

function DERow({ a, b }: { a: DistroDetail; b: DistroDetail }) {
  const aSet = new Set(a.desktopEnvironments);
  const bSet = new Set(b.desktopEnvironments);
  const allDEs = [...new Set([...a.desktopEnvironments, ...b.desktopEnvironments])];
  const aWins = a.desktopEnvironments.length > b.desktopEnvironments.length;
  const bWins = b.desktopEnvironments.length > a.desktopEnvironments.length;

  return (
    <div className="border-border grid grid-cols-[1fr_auto_1fr] items-start gap-2 border-b py-3">
      <div
        className={["flex flex-wrap gap-1", aWins ? "rounded bg-emerald-500/10 p-1" : ""].join(" ")}
      >
        {allDEs.map((de) =>
          aSet.has(de) ? (
            <Badge key={de} variant="secondary" className="text-xs">
              {de}
            </Badge>
          ) : (
            <Badge key={de} variant="secondary" className="text-xs opacity-25">
              {de}
            </Badge>
          )
        )}
      </div>
      <span className="text-muted-foreground px-2 pt-1.5 text-center text-xs whitespace-nowrap">
        Desktops
      </span>
      <div
        className={[
          "flex flex-wrap justify-end gap-1",
          bWins ? "rounded bg-emerald-500/10 p-1" : "",
        ].join(" ")}
      >
        {allDEs.map((de) =>
          bSet.has(de) ? (
            <Badge key={de} variant="secondary" className="text-xs">
              {de}
            </Badge>
          ) : (
            <Badge key={de} variant="secondary" className="text-xs opacity-25">
              {de}
            </Badge>
          )
        )}
      </div>
    </div>
  );
}

export default async function VsPage({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const [a, b] = await Promise.all([getDistroBySlug(slugA), getDistroBySlug(slugB)]);
  if (!a || !b) notFound();

  const url = `${BASE_URL}/vs/${slugs}`;

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16">
      <VsJsonLd a={a} b={b} url={url} />

      {/* Breadcrumb */}
      <nav className="text-muted-foreground flex items-center gap-2 py-4 text-xs">
        <Link href="/" className="hover:text-foreground transition-colors">
          DistroDB
        </Link>
        <span>/</span>
        <span className="text-foreground">
          {a.name} vs {b.name}
        </span>
      </nav>

      {/* Hero header */}
      <div className="mb-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Distro A */}
        <div className="flex flex-col items-center gap-3">
          <div className="ring-foreground/10 relative aspect-video w-full overflow-hidden ring-1">
            <Image
              src={a.img ?? "/placeholder.png"}
              alt={`${a.name} screenshot`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 50vw, 384px"
              quality={85}
            />
          </div>
          <h1 className="text-center text-xl font-extrabold tracking-tight">
            <Link href={`/distros/${a.slug}`} className="hover:text-primary transition-colors">
              {a.name}
            </Link>
          </h1>
          <p className="text-muted-foreground line-clamp-2 text-center text-xs">{a.description}</p>
        </div>

        {/* VS badge */}
        <div className="flex items-center justify-center">
          <span className="text-muted-foreground/50 text-2xl font-black select-none">VS</span>
        </div>

        {/* Distro B */}
        <div className="flex flex-col items-center gap-3">
          <div className="ring-foreground/10 relative aspect-video w-full overflow-hidden ring-1">
            <Image
              src={b.img ?? "/placeholder.png"}
              alt={`${b.name} screenshot`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 50vw, 384px"
              quality={85}
            />
          </div>
          <h1 className="text-center text-xl font-extrabold tracking-tight">
            <Link href={`/distros/${b.slug}`} className="hover:text-primary transition-colors">
              {b.name}
            </Link>
          </h1>
          <p className="text-muted-foreground line-clamp-2 text-center text-xs">{b.description}</p>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Comparison table */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Specs Comparison</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {/* Column headers */}
          <div className="border-border mb-1 grid grid-cols-[1fr_auto_1fr] gap-2 border-b pb-3">
            <span className="text-sm font-semibold">{a.name}</span>
            <span />
            <span className="text-right text-sm font-semibold">{b.name}</span>
          </div>

          {ROWS.map((row) => {
            const valA = row.format ? row.format(a[row.key]) : String(a[row.key] ?? "");
            const valB = row.format ? row.format(b[row.key]) : String(b[row.key] ?? "");

            let winner: "a" | "b" | "both" | "none" = "none";
            if (row.highlight) {
              winner = row.highlight(a, b);
            } else if (row.key === "difficulty") {
              winner = getDifficultyHighlight(a, b);
            } else if (valA === valB) {
              winner = "both";
            }

            return (
              <CompareRow
                key={row.key as string}
                label={row.label}
                valA={valA}
                valB={valB}
                winner={winner}
              />
            );
          })}

          <ArchRow a={a} b={b} />
          <DERow a={a} b={b} />
        </CardContent>
      </Card>

      {/* Highlights comparison */}
      {(a.highlights.length > 0 || b.highlights.length > 0) && (
        <div className="mt-8 grid grid-cols-2 gap-6">
          {[a, b].map((distro) => (
            <div key={distro.slug} className="flex flex-col gap-3">
              <h2 className="text-base font-semibold">{distro.name} Highlights</h2>
              <ul className="flex flex-col gap-2">
                {distro.highlights.map((point, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-primary mt-0.5 shrink-0">-</span>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* CTA links */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        {[a, b].map((distro) => (
          <div key={distro.slug} className="flex flex-col gap-2">
            <Link
              href={`/distros/${distro.slug}`}
              className="hover:text-primary text-sm font-medium transition-colors"
            >
              Full {distro.name} review →
            </Link>
            <a
              href={distro.download}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Download {distro.name} ↗
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
