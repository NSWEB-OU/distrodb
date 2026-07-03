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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, HeartAddIcon, Menu01Icon } from "@hugeicons/core-free-icons";

const wizardHref = "/wizard";

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

const project: { title: string; href: string; description: string }[] = [
  {
    title: "About",
    href: "/about",
    description: "Read more about the project, its goals, and how to contribute.",
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    description: "See what's completed and what's coming next. Updated every week.",
  },
  {
    title: "Changelog",
    href: "/changelog",
    description: "A log of every update, new feature, and improvement shipped to DistroDB.",
  },
  {
    title: "Support us",
    href: "/support",
    description:
      "Support the project through donations, sponsorships, or contributing to the codebase.",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch with the team for inquiries, support, or feedback.",
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    description: "Read our privacy policy to understand how we handle your data.",
  },
  {
    title: "Terms of Service",
    href: "/terms",
    description:
      "Read our terms of service to understand the rules and regulations for using our platform.",
  },
];

export function HeaderNav() {
  return (
    <div className="flex items-center">
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
        <Link
          href="/support"
          aria-label="Support us"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        >
          <HugeiconsIcon icon={HeartAddIcon} size="1.125rem" />
        </Link>
      </div>

      {/* Desktop navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href={wizardHref}>Distro wizard</Link>}
            />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href="/glossary">Glossary</Link>}
            />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link href="/resources">Resources</Link>}
            />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Comparison</NavigationMenuTrigger>
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
              <ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                {project.map((project) => (
                  <ListItem key={project.title} title={project.title} href={project.href}>
                    {project.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

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
          <nav className="flex flex-col gap-4 overflow-y-auto px-4 pb-4">
            <SheetClose
              nativeButton={false}
              render={
                <Link href={wizardHref} className="hover:bg-muted rounded-sm px-2 py-2 text-sm">
                  Distro wizard
                </Link>
              }
            />
            <SheetClose
              nativeButton={false}
              render={
                <Link href="/glossary" className="hover:bg-muted rounded-sm px-2 py-2 text-sm">
                  Glossary
                </Link>
              }
            />
            <SheetClose
              nativeButton={false}
              render={
                <Link href="/resources" className="hover:bg-muted rounded-sm px-2 py-2 text-sm">
                  Resources
                </Link>
              }
            />
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                Comparison
              </p>
              <div className="flex flex-col">
                {comparisons.map((item) => (
                  <SheetClose
                    key={item.title}
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href}
                        className="hover:bg-muted rounded-sm px-2 py-2 text-sm"
                      >
                        {item.title}
                      </Link>
                    }
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
                Project
              </p>
              <div className="flex flex-col">
                {project.map((item) => (
                  <SheetClose
                    key={item.title}
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href}
                        className="hover:bg-muted rounded-sm px-2 py-2 text-sm"
                      >
                        {item.title}
                      </Link>
                    }
                  />
                ))}
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href}>
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
