import { DistroGrid } from "@/components/distro-grid";
import { TypographyH1, TypographyLead } from "@/components/text";
import Search from "@/components/search";
import SearchSidebar from "@/components/search-sidebar";
import ActiveFilters from "@/components/active-filters";
import { MobileFiltersSheet } from "@/components/mobile-filters-sheet";
import { getAllDistros } from "@/lib/distros";
import { applyFilters } from "@/lib/filters";

type PageSearchParams = Promise<{ q?: string; tag?: string | string[] }>;

export default async function Home({ searchParams }: { searchParams: PageSearchParams }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const tags = Array.isArray(params.tag) ? params.tag : params.tag ? [params.tag] : [];

  const distros = applyFilters(getAllDistros(), tags, query);

  return (
    <main className="p-4">
      <section id="intro" className="mt-14">
        <TypographyH1>DistroDB</TypographyH1>
        <TypographyLead className="mx-auto mt-4 block max-w-3xl text-center">
          A database of Linux distributions, providing user-friendly, free information about various
          Linux distros. Search and filter based on your preferences, and discover the perfect Linux
          distribution for your needs.
        </TypographyLead>
      </section>
      <div className="bg-background/80 z-100 mx-auto mt-10 max-w-2xl rounded-sm py-6 backdrop-blur-sm md:px-6">
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
