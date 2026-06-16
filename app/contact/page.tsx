import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon, Mail01Icon, TwitterIcon } from "@hugeicons/core-free-icons";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the DistroDB team. Have a question, suggestion, or just want to say hi? We'd love to hear from you.",
  alternates: { canonical: "https://distrodb.xyz/contact" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/contact",
    title: "Contact | DistroDB",
    description:
      "Get in touch with the DistroDB team. Have a question, suggestion, or just want to say hi?",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

const channels = [
  {
    icon: GithubIcon,
    label: "GitHub",
    description: "Open an issue or contribute to the project",
    href: "https://github.com/NSWEB-OU/distrodb",
    external: true,
  },
  {
    icon: TwitterIcon,
    label: "Twitter / X",
    description: "Follow us for updates and announcements",
    href: "https://x.com/distrodbproject",
    external: true,
  },
  {
    icon: Mail01Icon,
    label: "Email",
    description: "hello@distrodb.xyz",
    href: "mailto:hello@distrodb.xyz",
    external: false,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Have a question, suggestion, or want to contribute? Fill out the form below or reach us
            through one of the channels.
          </p>
        </div>

        {/* Contact channels */}
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {channels.map(({ icon, label, description, href, external }) => (
            <Link
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="border-border hover:bg-muted flex flex-col gap-1.5 rounded-sm border p-4 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <HugeiconsIcon icon={icon} size="1rem" />
                {label}
              </div>
              <p className="text-muted-foreground text-xs">{description}</p>
            </Link>
          ))}
        </div>

        <Separator className="mb-10" />

        {/* Contact form */}
        <section>
          <h2 className="mb-6 text-lg font-semibold">Send a message</h2>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
