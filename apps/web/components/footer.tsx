import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Coffee01Icon, GithubIcon, TwitterIcon } from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";

const explore = [
  { title: "Browse Distros", href: "/" },
  { title: "Distro Wizard", href: "/wizard" },
  { title: "Glossary", href: "/glossary" },
  { title: "Resources", href: "/resources" },
  {
    title: "Add a Distro",
    href: "https://github.com/NSWEB-OU/distrodb/issues/new?template=new-distro.yml",
  },
];

const project = [
  { title: "About", href: "/about" },
  { title: "Support Us", href: "/support" },
  { title: "Contact", href: "/contact" },
  { title: "Roadmap", href: "/roadmap" },
  { title: "Changelog", href: "/changelog" },
];

const legal = [
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-border mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/icon-white.svg" alt="DistroDB Logo" width={20} height={20} />
              <span className="text-base font-semibold tracking-tight">DistroDB</span>
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              A modern Linux distribution database. Search, compare, and find the perfect distro for
              your needs.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com/NSWEB-OU/distrodb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                aria-label="GitHub"
              >
                <HugeiconsIcon icon={GithubIcon} size="1rem" />
              </Link>
              <Link
                href="https://x.com/distrodbproject"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                aria-label="Twitter / X"
              >
                <HugeiconsIcon icon={TwitterIcon} size="1rem" />
              </Link>
              <Link
                href="https://buymeacoffee.com/nsweb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                aria-label="Buy Me a Coffee"
              >
                <HugeiconsIcon icon={Coffee01Icon} size="1rem" />
              </Link>
            </div>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Explore
            </p>
            <ul className="flex flex-col gap-2">
              {explore.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project */}
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Project
            </p>
            <ul className="flex flex-col gap-2">
              {project.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Legal
            </p>
            <ul className="flex flex-col gap-2">
              {legal.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} DistroDB. All rights reserved.
          </p>
          <div className="flex flex-col gap-1.5 sm:items-end">
            <p className="text-muted-foreground text-xs">
              Not affiliated with any Linux distribution or organization.
            </p>
            <p className="text-muted-foreground text-xs">
              Developed and maintained by{" "}
              <Link
                href="https://nsweb.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline-offset-4 transition-colors hover:underline"
              >
                NSWEB OÜ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
