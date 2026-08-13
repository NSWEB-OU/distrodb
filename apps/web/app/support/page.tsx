import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  HandHeart,
  Coffee01Icon,
  SourceCodeIcon,
  StarIcon,
  Share08Icon,
} from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button-variants";

export const metadata: Metadata = {
  title: "Support Us",
  description:
    "DistroDB is free and open-source. Support the project by donating, contributing code or data, starring the repo, or simply spreading the word.",
  alternates: { canonical: "https://distrodb.xyz/support" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/support",
    title: "Support Us | DistroDB",
    description: "DistroDB is free and open-source. Help us keep it running and growing.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

const ways = [
  {
    icon: Coffee01Icon,
    title: "Buy us a coffee",
    description: "A small donation helps cover hosting, domain, and development time.",
    ctas: [
      {
        label: "Buy Me a Coffee",
        href: "https://buymeacoffee.com/nsweb",
        external: true,
      },
    ],
  },
  {
    icon: SourceCodeIcon,
    title: "Contribute code",
    description:
      "Found a bug? Have a feature idea? The codebase is open on GitHub - pull requests are always welcome.",
    ctas: [
      { label: "View repository", href: "https://github.com/NSWEB-OU/distrodb", external: true },
    ],
  },
  {
    icon: HandHeart,
    title: "Improve distro data",
    description:
      "All distribution data lives in a plain JSON file. You can open a PR to add a missing distro, fix incorrect info, or add screenshots.",
    ctas: [
      {
        label: "Edit data on GitHub",
        href: "https://github.com/NSWEB-OU/distrodb",
        external: true,
      },
    ],
  },
  {
    icon: StarIcon,
    title: "Star the repo",
    description:
      "Starring the GitHub repository helps others discover the project and motivates continued development.",
    ctas: [
      { label: "Star on GitHub", href: "https://github.com/NSWEB-OU/distrodb", external: true },
    ],
  },
  {
    icon: Share08Icon,
    title: "Spread the word",
    description:
      "Share DistroDB with your Linux-curious friends, post it in communities, or mention it in your blog. It helps more than you think.",
    ctas: [],
  },
];

export default function SupportPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Support DistroDB</h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            DistroDB is free and open-source. If it&apos;s been useful to you, here are a few ways
            to help it keep going.
          </p>
        </div>

        {/* Ways to support */}
        <div className="mb-10 flex flex-col gap-3">
          {ways.map(({ icon, title, description, ctas }) => (
            <div key={title} className="border-border flex flex-col gap-3 rounded-sm border p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <HugeiconsIcon icon={icon} size="1rem" />
                {title}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
              {ctas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ctas.map((cta) => (
                    <Link
                      key={cta.href}
                      href={cta.href}
                      {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      {cta.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator className="mb-10" />

        {/* Footer note */}
        <section className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground max-w-sm text-sm">
            Have a different way you&apos;d like to contribute or partner with us?
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/distrodb"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <HugeiconsIcon icon={GithubIcon} size="1rem" />
              GitHub
            </Link>
            <Link href="/contact" className={buttonVariants({ size: "sm" })}>
              Get in touch
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
