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
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

const wizardHref = "/wizard";

const project: { title: string; href: string; description: string }[] = [
  {
    title: "About",
    href: "/about",
    description: "Read more about the project, its goals, and how to contribute.",
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
