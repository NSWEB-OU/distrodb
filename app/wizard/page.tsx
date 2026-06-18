import type { Metadata } from "next";
import { Suspense } from "react";
import { WizardClient } from "./wizard-client";

export const metadata: Metadata = {
  title: "Distro Wizard - Find Your Perfect Linux Distribution",
  description:
    "Answer 6 quick questions and get personalized Linux distribution recommendations tailored to your experience level, use case, hardware, and preferences.",
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
      "Answer 6 quick questions and get personalized Linux distribution recommendations tailored to your experience level, use case, hardware, and preferences.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

export default function WizardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-16">
      <div className="mb-10 w-full max-w-2xl space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Distro Wizard</h1>
        <p className="text-muted-foreground mx-auto max-w-md text-sm">
          6 questions. Personalized Linux recommendations. No &quot;just use Arch&quot; jokes
          (probably).
        </p>
      </div>
      <Suspense fallback={null}>
        <WizardClient />
      </Suspense>
    </main>
  );
}
