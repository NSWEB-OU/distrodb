import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  Search01Icon,
  FilterIcon,
  ComputerIcon,
  DatabaseIcon,
  GitCompareIcon,
} from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button-variants";

export const metadata: Metadata = {
  title: "About",
  description:
    "DistroDB is a modern, open Linux distribution database - a cleaner, faster alternative to DistroWatch with powerful filtering, a distro wizard, and side-by-side comparisons.",
  alternates: { canonical: "https://distrodb.xyz/about" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/about",
    title: "About | DistroDB",
    description:
      "DistroDB is a modern, open Linux distribution database - a cleaner, faster alternative to DistroWatch.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

const features = [
  {
    icon: Search01Icon,
    title: "Powerful search",
    description:
      "Full-text search across distro names, descriptions, and tags - results update instantly as you type.",
  },
  {
    icon: FilterIcon,
    title: "Advanced filters",
    description:
      "Filter by package manager, init system, desktop environment, release model, difficulty level, and more.",
  },
  {
    icon: ComputerIcon,
    title: "Distro Wizard",
    description:
      "Answer 6 questions about your use case and experience level and get personalized distribution recommendations.",
  },
  {
    icon: GitCompareIcon,
    title: "Side-by-side comparison",
    description:
      "Compare any two distributions across all their attributes at a glance with highlighted winners.",
  },
  {
    icon: DatabaseIcon,
    title: "Open data",
    description:
      "All distro data is stored in a plain JSON file in the repository - easy to audit, contribute to, and extend.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">About DistroDB</h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            A modern, open alternative to DistroWatch - built for people who care about design,
            speed, and finding the right Linux distro.
          </p>
        </div>

        {/* Mission */}
        <section className="text-muted-foreground mb-10 space-y-3 text-sm leading-relaxed">
          <p>
            <span className="text-foreground font-medium">DistroDB</span> was created out of
            frustration with the dated UX of existing Linux distribution indexes. The goal is
            simple: make it fast and pleasant to discover, compare, and choose a Linux distribution
            - whether you&apos;re a first-time user or a seasoned sysadmin.
          </p>
          <p>
            Every distro page aggregates the key facts you actually need - package manager, init
            system, release model, desktop environments, architecture support, and more - without
            the noise. Screenshots are curated to reflect what a real desktop looks like, not
            marketing materials.
          </p>
          <p>
            The project is fully open-source. Contributions to the distro dataset, UI, and feature
            set are welcome.
          </p>
        </section>

        <Separator className="mb-10" />

        {/* Features */}
        <section className="mb-10">
          <h2 className="mb-6 text-lg font-semibold">What DistroDB offers</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map(({ icon, title, description }) => (
              <div
                key={title}
                className="border-border flex flex-col gap-1.5 rounded-sm border p-4"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <HugeiconsIcon icon={icon} size="1rem" />
                  {title}
                </div>
                <p className="text-muted-foreground text-xs">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator className="mb-10" />

        {/* Tech stack */}
        <section className="mb-10 text-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Built with</h2>
            <span className="text-muted-foreground text-xs">
              by{" "}
              <Link
                href="https://nsweb.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 transition-colors hover:underline"
              >
                NSWEB OÜ (Reg. 17522369)
              </Link>
            </span>
          </div>
          <ul className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            {[
              "Next.js 16 (App Router)",
              "TypeScript",
              "Tailwind CSS 4",
              "shadcn/ui",
              "@base-ui/react",
              "Hugeicons",
            ].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="bg-muted-foreground/50 size-1 shrink-0 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <Separator className="mb-10" />

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground max-w-sm text-sm">
            Want to contribute data, report a bug, or suggest a feature?
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/NSWEB-OU/distrodb"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <HugeiconsIcon icon={GithubIcon} size="1rem" />
              GitHub
            </Link>
            <Link href="/contact" className={buttonVariants({ size: "sm" })}>
              Contact us
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
