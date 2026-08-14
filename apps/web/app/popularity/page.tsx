import type { Metadata } from "next";
import { GamersRating } from "@/components/gamers-rating";

export const metadata: Metadata = {
  title: "Linux Distro Popularity - Which Distros Gamers Actually Use",
  description:
    "Real distro popularity based on measured data, not page hits. See which Linux distributions gamers use, sourced from the Steam Hardware Survey and updated monthly.",
  keywords: [
    "linux distro popularity",
    "most popular linux distro",
    "linux gaming distro",
    "steam linux distro share",
    "distro usage statistics",
    "steamos cachyos arch usage",
  ],
  alternates: { canonical: "https://distrodb.xyz/popularity" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/popularity",
    title: "Linux Distro Popularity - Which Distros Gamers Actually Use | DistroDB",
    description:
      "Real distro popularity based on measured data, not page hits. Sourced from the Steam Hardware Survey, updated monthly.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

export default function PopularityPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Distro Popularity</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Popularity based on measured, real-world data instead of page hits. Each rating is a
            signal for a specific audience, not overall market share.
          </p>
        </div>

        <GamersRating />
      </div>
    </main>
  );
}
