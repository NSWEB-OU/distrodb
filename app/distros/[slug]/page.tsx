import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Download04Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getDistroBySlug, getAllSlugs } from "@/lib/distros";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyH2, TypographyH3, TypographyLead } from "@/components/text";
import { DifficultyLevel, ReleaseModel } from "@/components/types/types";
import { CompareToggleButton } from "@/components/compare-toggle-button";
import { buttonVariants } from "@/components/ui/button-variants";
import { BackButton } from "@/components/back-button";
import { DistroGallery } from "@/components/distro-gallery";
import { SuggestChangesButton } from "@/components/suggest-changes-button";
import { TagBadge } from "@/components/tag-badge";
import { GlossaryBadge } from "@/components/glossary-badge";
import { cn } from "@/lib/utils";

const BASE_URL = "https://distrodb.xyz";
const DISTROSEA_BASE = "https://distrosea.com/select";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const distro = getDistroBySlug(slug);
  if (!distro) return {};

  const title = `${distro.name} Linux - Review, Specs & Download`;
  const description = `${distro.description} Learn about ${distro.name}'s package manager (${distro.packageManager}), release model (${distro.releaseModel}), desktop environments, and more.`;
  const url = `${BASE_URL}/distros/${distro.slug}`;
  const image = distro.img ? `${BASE_URL}${distro.img}` : `${BASE_URL}/og-default.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      distro.name,
      "Linux distribution",
      "Linux distro",
      distro.base ? `${distro.base} based` : "independent Linux",
      distro.packageManager,
      ...distro.desktopEnvironments,
      ...distro.tags,
      "Linux review",
      "Linux download",
    ],
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "DistroDB",
      images: [
        {
          url: image,
          width: 1200,
          height: 675,
          alt: `${distro.name} screenshot`,
        },
      ],
      publishedTime: distro.releaseDate,
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

const DIFFICULTY_LABEL: Record<DifficultyLevel, string> = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
};

const DIFFICULTY_VARIANT: Record<DifficultyLevel, "default" | "secondary" | "outline"> = {
  beginner: "default",
  intermediate: "secondary",
  advanced: "outline",
};

const RELEASE_LABEL: Record<ReleaseModel, string> = {
  rolling: "rolling release",
  fixed: "fixed release",
  "semi-rolling": "semi-rolling",
};

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs tracking-wider uppercase">{label}</span>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function TechTokenBadges({ value }: { value: string }) {
  const tokens = value
    .split(/[,/]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <div className="flex flex-wrap gap-1.5">
      {tokens.map((token, i) => (
        <GlossaryBadge key={`${token}-${i}`} label={token} />
      ))}
    </div>
  );
}

function DistroJsonLd({ distro }: { distro: NonNullable<ReturnType<typeof getDistroBySlug>> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: distro.name,
    description: distro.longDescription,
    applicationCategory: "OperatingSystem",
    operatingSystem: distro.name,
    url: distro.website,
    downloadUrl: distro.download,
    softwareVersion: distro.latestVersion,
    datePublished: distro.releaseDate,
    image: distro.img ? `https://distrodb.xyz${distro.img}` : undefined,
    publisher: {
      "@type": "Organization",
      name: "DistroDB",
      url: "https://distrodb.xyz",
    },
    ...(distro.base ? { isBasedOn: distro.base } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function DistroPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const distro = getDistroBySlug(slug);

  if (!distro) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <DistroJsonLd distro={distro} />
      {/* Breadcrumb */}
      <nav className="text-muted-foreground flex items-center gap-2 py-4 text-xs">
        <BackButton />
        <span>/</span>
        <Link href="/" className="hover:text-foreground transition-colors">
          DistroDB
        </Link>
        <span>/</span>
        <span className="text-foreground">{distro.name}</span>
      </nav>

      {/* Hero / Gallery */}
      <DistroGallery img={distro.img} screenshots={distro.screenshots} name={distro.name} />

      {/* Title + badges */}
      <div className="mt-6 flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{distro.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={DIFFICULTY_VARIANT[distro.difficulty]}>
            {DIFFICULTY_LABEL[distro.difficulty]}
          </Badge>
          <GlossaryBadge
            label={RELEASE_LABEL[distro.releaseModel]}
            glossaryKey={distro.releaseModel}
          />
          {distro.tags
            .filter((tag) => !tag.includes(distro.difficulty))
            .map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
        </div>
        {/* CTAs */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Primary actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <a
              href={distro.download}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "h-10 w-full text-sm sm:w-auto")}
            >
              <HugeiconsIcon icon={Download04Icon} />
              Download {distro.name}
            </a>
            {distro.distroSea && (
              <a
                href={`${DISTROSEA_BASE}/${distro.distroSea}/`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-primary/40 text-primary hover:bg-primary/10 hover:text-primary h-10 w-full text-sm sm:w-auto"
                )}
                title={`Run ${distro.name} in your browser via DistroSea`}
              >
                <HugeiconsIcon icon={PlayIcon} />
                Try in browser
              </a>
            )}
          </div>
          {/* Secondary / utility actions */}
          <div className="text-muted-foreground flex items-center gap-1 sm:ml-auto">
            <CompareToggleButton
              slug={distro.slug}
              name={distro.name}
              img={distro.img}
              withIcon
              className="hover:bg-muted hover:text-foreground border-transparent bg-transparent text-current backdrop-blur-none"
            />
            <SuggestChangesButton
              distroName={distro.name}
              className="hover:bg-muted hover:text-foreground text-current"
            />
          </div>
        </div>
        <TypographyLead className="mt-6">{distro.description}</TypographyLead>
      </div>

      <Separator className="my-6" />

      {/* Quick facts + links side-by-side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Left column */}
        <div className="flex flex-col gap-8">
          {/* Spec grid */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
                <MetaRow label="Base" value={distro.base ?? "Independent"} />
                <MetaRow
                  label="Package Manager"
                  value={<TechTokenBadges value={distro.packageManager} />}
                />
                <MetaRow
                  label="Init System"
                  value={<TechTokenBadges value={distro.initSystem} />}
                />
                <MetaRow label="Latest Version" value={distro.latestVersion} />
                <MetaRow label="Release Model" value={RELEASE_LABEL[distro.releaseModel]} />
                {distro.releaseDate ? (
                  <MetaRow
                    label="Release Date"
                    value={new Date(distro.releaseDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                ) : null}
              </div>

              <Separator className="my-5" />

              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  Architecture
                </span>
                <div className="flex flex-wrap gap-2">
                  {distro.architecture.map((arch) => (
                    <Badge key={arch} variant="outline">
                      {arch}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-1.5">
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  Desktop Environments
                </span>
                <div className="flex flex-wrap gap-2">
                  {distro.desktopEnvironments.map((de) => (
                    <GlossaryBadge key={de} label={de} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <div className="flex flex-col gap-3">
            <TypographyH2>About {distro.name}</TypographyH2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {distro.longDescription}
            </p>
          </div>

          {/* Highlights */}
          {distro.highlights.length > 0 && (
            <div className="flex flex-col gap-3">
              <TypographyH3>Highlights</TypographyH3>
              <ul className="flex flex-col gap-2">
                {distro.highlights.map((point, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-primary mt-0.5 shrink-0">-</span>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right sidebar - links */}
        <div className="flex flex-col gap-4 self-start lg:sticky lg:top-5">
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              <a
                href={distro.download}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary border-border flex items-center justify-between border-b px-0 py-3 text-sm font-medium transition-colors last:border-0"
              >
                Download
                <span className="text-muted-foreground text-xs">↗</span>
              </a>
              {distro.distroSea && (
                <a
                  href={`${DISTROSEA_BASE}/${distro.distroSea}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary border-border flex items-center justify-between border-b px-0 py-3 text-sm transition-colors last:border-0"
                >
                  Try in browser
                  <span className="text-muted-foreground text-xs">↗</span>
                </a>
              )}
              <a
                href={distro.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary border-border flex items-center justify-between border-b px-0 py-3 text-sm transition-colors last:border-0"
              >
                Official Website
                <span className="text-muted-foreground text-xs">↗</span>
              </a>
              <a
                href={distro.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary flex items-center justify-between px-0 py-3 text-sm transition-colors last:border-0"
              >
                Documentation
                <span className="text-muted-foreground text-xs">↗</span>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
