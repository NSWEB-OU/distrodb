import type { Metadata } from "next";
import { Suspense } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { MagicWand01Icon } from "@hugeicons/core-free-icons";
import { WizardClient, TOTAL_STEPS } from "./wizard-client";
import { TypographyLead } from "@/components/text";
import { getAllDistros } from "@/lib/distros";

export const metadata: Metadata = {
  title: "Distro Wizard - Find Your Perfect Linux Distribution",
  description:
    "Answer a few quick questions and get personalized Linux distribution recommendations tailored to your experience level, use case, hardware, and preferences.",
  keywords: [
    "Linux distro quiz",
    "best Linux distro for me",
    "Linux distribution finder",
    "Linux recommendation",
    "which Linux should I use",
    "Linux wizard",
  ],
  alternates: { canonical: "https://distrodb.xyz/wizard" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/wizard",
    title: "Distro Wizard - Find Your Perfect Linux Distribution",
    description:
      "Answer a few quick questions and get personalized Linux distribution recommendations tailored to your experience level, use case, hardware, and preferences.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

export default async function WizardPage() {
  const distros = await getAllDistros();

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-14">
      <section className="relative w-full">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-8 -z-10 flex justify-center"
        >
          <div className="h-56 w-[36rem] max-w-full rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/15 to-emerald-500/15 blur-[100px]" />
        </div>

        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 font-mono text-xs">
          <HugeiconsIcon icon={MagicWand01Icon} size="0.875rem" className="text-amber-500" />
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">{TOTAL_STEPS}</span> quick questions
          </span>
        </div>

        <h1 className="mt-5 scroll-m-20 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-balance text-transparent md:text-5xl">
          Distro Wizard
        </h1>

        <TypographyLead className="mx-auto mt-4 block max-w-md text-center">
          Personalized Linux recommendations. No &quot;just use Arch&quot; jokes (probably).
        </TypographyLead>
      </section>

      <div className="mt-10 w-full">
        <Suspense fallback={null}>
          <WizardClient distros={distros} />
        </Suspense>
      </div>
    </main>
  );
}
