"use client";

import {
  Award01Icon,
  CloudServerIcon,
  Code,
  GameController01Icon,
  GraduateMaleIcon,
  KnightShieldIcon,
  Layers01Icon,
  List,
  Lock,
  Medal01Icon,
  NewReleasesFreeIcons,
  Package01Icon,
  Plant,
  RefreshIcon,
  RepeatIcon,
  RocketIcon,
} from "@hugeicons/core-free-icons";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import { Kbd, KbdGroup } from "./ui/kbd";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FILTER_GROUPS } from "@/lib/filters";

const FILTER_ICONS: Partial<Record<string, IconSvgElement>> = {
  "all-distros": List,
  "recently-added": NewReleasesFreeIcons,
  beginner: Plant,
  intermediate: GraduateMaleIcon,
  advanced: Medal01Icon,
  "for-gamers": GameController01Icon,
  "for-developers": Code,
  "for-servers": CloudServerIcon,
  "for-privacy": Lock,
  independent: Award01Icon,
  "rolling-release": RefreshIcon,
  "fixed-release": KnightShieldIcon,
  "semi-rolling": RepeatIcon,
  hyprland: RocketIcon,
  apt: Package01Icon,
  pacman: Layers01Icon,
  dnf: RocketIcon,
};

const SidebarItem = ({
  children,
  id,
  isActive,
  className,
  onTagSelection,
}: {
  children: React.ReactNode;
  id: string;
  isActive?: boolean;
  className?: string;
  onTagSelection?: (id: string) => void;
}) => {
  return (
    <button
      aria-pressed={isActive}
      className={`hover:bg-muted hover:text-foreground aria-pressed:bg-muted aria-pressed:text-foreground dark:hover:bg-muted/50 cursor-pointer p-2 text-left ${className} flex items-center gap-2`}
      onClick={() => onTagSelection && onTagSelection(id)}
    >
      {children}
    </button>
  );
};

const SearchSidebar = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedTags = searchParams.getAll("tag");

  const handleTagSelection = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (id === "all-distros") {
        params.delete("tag");
      } else {
        const current = params.getAll("tag");
        params.delete("tag");
        if (current.includes(id)) {
          current.filter((t) => t !== id).forEach((t) => params.append("tag", t));
        } else {
          [...current, id].forEach((t) => params.append("tag", t));
        }
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return (
    <Card
      className={`h-fit max-h-[calc(100vh-2.5rem)] w-full max-w-3xs gap-0 overflow-y-auto p-2 ${className}`}
    >
      {FILTER_GROUPS.map((group) => (
        <div className="flex flex-col" key={group.groupname}>
          {group.label && (
            <span className="text-muted-foreground px-2 pt-1 pb-0.5 text-xs font-medium tracking-wider uppercase">
              {group.label}
            </span>
          )}
          {group.filters.map((filter) => {
            const icon = FILTER_ICONS[filter.id];
            const isActive =
              filter.id === "all-distros"
                ? selectedTags.length === 0
                : selectedTags.includes(filter.id);
            return (
              <SidebarItem
                key={filter.id}
                id={filter.id}
                isActive={isActive}
                onTagSelection={handleTagSelection}
              >
                {icon ? <HugeiconsIcon size="1rem" icon={icon} /> : null}
                {filter.label}
              </SidebarItem>
            );
          })}
          <Separator className="my-2" />
        </div>
      ))}
      <SidebarItem id="search-with-shortcut">
        Search with
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </SidebarItem>
    </Card>
  );
};

export default SearchSidebar;
