import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MagicWand01Icon,
  GameController01Icon,
  Code,
  Plant,
  Lock,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { DistroGrid } from "@/components/distro-grid";
import { TypographyLead } from "@/components/text";
import Search from "@/components/search";
import SearchSidebar from "@/components/search-sidebar";
import ActiveFilters from "@/components/active-filters";
import { MobileFiltersSheet } from "@/components/mobile-filters-sheet";
import { getAllDistros } from "@/lib/distros";
import { applyFilters } from "@/lib/filters";
import { HomeWidgets } from "@/components/home-widgets";
import { GamersRatingMini } from "@/components/gamers-rating-mini";
import { VacationNotice } from "@/components/vacation-notice";

type PageSearchParams = Promise<{ q?: string; tag?: string | string[] }>;

const QUICK_FILTERS = [
  { href: "/?tag=beginner#distro-grid", label: "Beginner", icon: Plant },
  { href: "/?tag=for-gamers#distro-grid", label: "For gamers", icon: GameController01Icon },
  { href: "/?tag=for-developers#distro-grid", label: "For developers", icon: Code },
  { href: "/?tag=for-privacy#distro-grid", label: "Privacy", icon: Lock },
];

export default async function Home({ searchParams }: { searchParams: PageSearchParams }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const tags = Array.isArray(params.tag) ? params.tag : params.tag ? [params.tag] : [];

  const allDistros = await getAllDistros();
  const distros = applyFilters(allDistros, tags, query);

  return (
    <main className="p-4">
      <section id="intro" className="relative mt-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-8 -z-10 flex justify-center"
        >
          <div className="h-72 w-[46rem] max-w-full rounded-full bg-gradient-to-tr from-amber-500/25 via-orange-500/15 to-emerald-500/15 blur-[100px]" />
        </div>

        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-3 py-1 font-mono text-xs">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
          </span>
          <span className="text-muted-foreground">
            <span className="text-foreground font-medium">{allDistros.length}</span> distributions
            indexed
          </span>
        </div>

        <h1 className="mt-5 scroll-m-20 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-400 bg-clip-text text-center text-5xl font-extrabold tracking-tight text-balance text-transparent md:text-6xl">
          DistroDB
        </h1>

        <TypographyLead className="mx-auto mt-4 block max-w-3xl text-center">
          A database of Linux distributions, providing user-friendly, free information about various
          Linux distros. Search and filter based on your preferences, and discover the perfect Linux
          distribution for your needs.
        </TypographyLead>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/wizard"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-mono text-sm font-medium text-white shadow-sm transition-shadow hover:shadow-md hover:shadow-amber-500/20"
          >
            <HugeiconsIcon icon={MagicWand01Icon} size="1rem" />
            Distro Wizard
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size="1rem"
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          {QUICK_FILTERS.map((f) => (
            <Link
              key={f.label}
              href={f.href}
              className="border-border bg-muted/40 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-2 font-mono text-sm transition-colors hover:border-amber-500/40 hover:bg-amber-500/5"
            >
              <HugeiconsIcon icon={f.icon} size="0.9375rem" />
              {f.label}
            </Link>
          ))}
        </div>
      </section>
      <HomeWidgets />
      <div className="z-100 mx-auto mt-10 max-w-2xl rounded-sm py-6 backdrop-blur-sm md:px-6">
        <Search />
      </div>
      <ActiveFilters />
      <section id="distro-grid" className="mt-14 flex items-start justify-center gap-6">
        <SearchSidebar className="sticky top-5 z-100 hidden md:block" />
        <div className="w-full max-w-7xl flex-1">
          <div className="mb-4 md:hidden">
            <MobileFiltersSheet />
          </div>
          <DistroGrid distros={distros} />
        </div>
      </section>
    </main>
  );
}
