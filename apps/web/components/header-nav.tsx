"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  GithubIcon,
  HeartAddIcon,
  Menu01Icon,
  MagicWand01Icon,
  Book02Icon,
  FolderLibraryIcon,
  ChartIncreaseIcon,
  InformationCircleIcon,
  Flag02Icon,
  Notebook01Icon,
  CustomerService01Icon,
  ShieldIcon,
  LegalDocument01Icon,
} from "@hugeicons/core-free-icons";

type IconType = IconSvgElement;

const wizardHref = "/wizard";

const primaryLinks: { title: string; href: string; icon: IconType }[] = [
  { title: "Distro wizard", href: wizardHref, icon: MagicWand01Icon },
  { title: "Glossary", href: "/glossary", icon: Book02Icon },
  { title: "Resources", href: "/resources", icon: FolderLibraryIcon },
  { title: "Popularity", href: "/popularity", icon: ChartIncreaseIcon },
];

const comparisons: { title: string; href: string; description: string }[] = [
  {
    title: "Ubuntu vs Fedora",
    href: "/vs/ubuntu-vs-fedora",
    description: "Compare the two most popular Linux distributions side by side.",
  },
  {
    title: "Ubuntu vs Debian",
    href: "/vs/ubuntu-vs-debian",
    description: "Explore the differences between Ubuntu and its upstream parent, Debian.",
  },
  {
    title: "Ubuntu vs Arch Linux",
    href: "/vs/ubuntu-vs-arch-linux",
    description: "Beginner-friendly Ubuntu versus the highly customizable Arch Linux.",
  },
  {
    title: "Ubuntu vs Linux Mint",
    href: "/vs/ubuntu-vs-linux-mint",
    description: "Two beginner-focused distros with different desktop philosophies.",
  },
  {
    title: "Ubuntu vs Pop!_OS",
    href: "/vs/ubuntu-vs-pop-os",
    description: "Ubuntu versus System76's developer- and gamer-oriented spin.",
  },
  {
    title: "Arch Linux vs Manjaro",
    href: "/vs/arch-linux-vs-manjaro-linux",
    description: "Pure Arch versus Manjaro's user-friendly Arch-based experience.",
  },
];

const projectLinks: { title: string; href: string; description: string; icon: IconType }[] = [
  {
    title: "About",
    href: "/about",
    description: "The project, its goals, and how to contribute.",
    icon: InformationCircleIcon,
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    description: "What's completed and what's coming next.",
    icon: Flag02Icon,
  },
  {
    title: "Changelog",
    href: "/changelog",
    description: "Every update and improvement shipped to DistroDB.",
    icon: Notebook01Icon,
  },
];

const supportLinks: { title: string; href: string; icon: IconType }[] = [
  { title: "Support us", href: "/support", icon: HeartAddIcon },
  { title: "Contact", href: "/contact", icon: CustomerService01Icon },
];

const legalLinks: { title: string; href: string; icon: IconType }[] = [
  { title: "Privacy Policy", href: "/privacy", icon: ShieldIcon },
  { title: "Terms of Service", href: "/terms", icon: LegalDocument01Icon },
];

export function HeaderNav() {
  return (
    <div className="flex items-center gap-1">
      {/* Desktop navigation */}
      <NavigationMenu className="hidden flex-none md:flex">
        <NavigationMenuList>
          {primaryLinks.map((link) => (
            <NavigationMenuItem key={link.title}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                render={<Link href={link.href}>{link.title}</Link>}
              />
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuTrigger>Comparisons</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                {comparisons.map((item) => (
                  <ListItem key={item.title} title={item.title} href={item.href}>
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Project</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-100 grid-cols-1 gap-4 p-1 sm:w-120 sm:grid-cols-[1.3fr_1fr] md:w-135 lg:w-150">
                <div>
                  <p className="text-muted-foreground mb-1 px-2 text-xs font-medium tracking-wider uppercase">
                    Project
                  </p>
                  <ul className="flex flex-col gap-1">
                    {projectLinks.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        icon={item.icon}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground mb-1 px-2 text-xs font-medium tracking-wider uppercase">
                    Support
                  </p>
                  <ul className="flex flex-col">
                    {supportLinks.map((item) => (
                      <CompactListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                        icon={item.icon}
                      />
                    ))}
                  </ul>
                  <Separator className="my-2" />
                  <ul className="flex flex-col">
                    {legalLinks.map((item) => (
                      <li key={item.title}>
                        <NavigationMenuLink
                          className="text-muted-foreground hover:text-foreground text-xs"
                          render={<Link href={item.href}>{item.title}</Link>}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Separator orientation="vertical" className="mx-1 hidden md:block" />

      {/* Icon links */}
      <div className="hidden items-center gap-1 md:flex">
        <Link
          href="https://github.com/NSWEB-OU/distrodb"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        >
          <HugeiconsIcon icon={GithubIcon} size="1.125rem" />
        </Link>
      </div>

      {/* Mobile navigation */}
      <Sheet>
        <SheetTrigger className="md:hidden" render={<Button variant="ghost" size="icon-sm" />}>
          <HugeiconsIcon icon={Menu01Icon} size="1.125rem" />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-1 flex-col overflow-y-auto px-4 pb-4">
            <div className="flex flex-col gap-1">
              {primaryLinks.map((link) => (
                <MobileLink key={link.title} href={link.href} title={link.title} icon={link.icon} />
              ))}
            </div>

            <Accordion className="mt-3">
              <AccordionItem value="comparisons">
                <AccordionTrigger>Comparisons</AccordionTrigger>
                <AccordionPanel>
                  <div className="flex flex-col gap-0.5">
                    {comparisons.map((item) => (
                      <MobileLink key={item.title} href={item.href} title={item.title} compact />
                    ))}
                  </div>
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem value="project">
                <AccordionTrigger>Project</AccordionTrigger>
                <AccordionPanel>
                  <div className="flex flex-col gap-0.5">
                    {projectLinks.map((item) => (
                      <MobileLink
                        key={item.title}
                        href={item.href}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                      />
                    ))}
                    <Separator className="my-1.5" />
                    {supportLinks.map((item) => (
                      <MobileLink
                        key={item.title}
                        href={item.href}
                        title={item.title}
                        icon={item.icon}
                      />
                    ))}
                    <Separator className="my-1.5" />
                    <div className="flex flex-col">
                      {legalLinks.map((item) => (
                        <MobileLink
                          key={item.title}
                          href={item.href}
                          title={item.title}
                          compact
                          muted
                        />
                      ))}
                    </div>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </nav>
          <SheetFooter className="border-border border-t pt-3">
            <SheetClose
              nativeButton={false}
              render={
                <Link
                  href="https://github.com/NSWEB-OU/distrodb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-2.5 rounded-none px-2 py-2 text-sm"
                >
                  <HugeiconsIcon icon={GithubIcon} size="1.125rem" />
                  GitHub repository
                </Link>
              }
            />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; icon?: IconType }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href}>
            {icon && (
              <span className="bg-muted text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center self-start [&_svg]:size-3.5">
                <HugeiconsIcon icon={icon} />
              </span>
            )}
            <div className="flex flex-col gap-1 text-sm">
              <div className="leading-none font-medium">{title}</div>
              <div className="text-muted-foreground line-clamp-2">{children}</div>
            </div>
          </Link>
        }
      />
    </li>
  );
}

function CompactListItem({ title, href, icon }: { title: string; href: string; icon: IconType }) {
  return (
    <li>
      <NavigationMenuLink
        render={
          <Link href={href}>
            <HugeiconsIcon icon={icon} />
            {title}
          </Link>
        }
      />
    </li>
  );
}

function MobileLink({
  href,
  title,
  icon,
  description,
  compact,
  muted,
}: {
  href: string;
  title: string;
  icon?: IconType;
  description?: string;
  compact?: boolean;
  muted?: boolean;
}) {
  return (
    <SheetClose
      nativeButton={false}
      render={
        <Link
          href={href}
          className={cn(
            "hover:bg-muted flex items-center gap-2.5 rounded-none px-2 text-sm",
            compact ? "py-1.5" : "py-2",
            muted && "text-muted-foreground text-xs"
          )}
        >
          {icon && !compact && (
            <span className="bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center [&_svg]:size-3.5">
              <HugeiconsIcon icon={icon} />
            </span>
          )}
          <span className="flex flex-col">
            <span className={cn("leading-none", !muted && "font-medium")}>{title}</span>
            {description && (
              <span className="text-muted-foreground mt-1 text-xs leading-snug">{description}</span>
            )}
          </span>
        </Link>
      }
    />
  );
}
