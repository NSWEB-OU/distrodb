import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for DistroDB. Read our terms before using the site, including our disclaimer of warranties, limitation of liability, and intellectual property notices.",
  alternates: { canonical: "https://distrodb.xyz/terms" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/terms",
    title: "Terms of Service | DistroDB",
    description: "Terms and conditions for using DistroDB.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "16 June 2025";
const OPERATOR = "NSWEB OÜ (Reg. 17522369)";
const CONTACT_EMAIL = "hello@distrodb.xyz";
const SITE_URL = "https://distrodb.xyz";

export default function TermsPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="flex flex-col gap-8 text-sm leading-relaxed">
          {/* 1. Acceptance */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using DistroDB at <span className="text-foreground">{SITE_URL}</span>{" "}
              (the &quot;Site&quot;), you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree, please stop using the Site immediately.
            </p>
            <p className="text-muted-foreground">
              The Site is operated by <span className="text-foreground">{OPERATOR}</span>, a company
              registered in the European Union (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
            </p>
          </section>

          <Separator />

          {/* 2. Description of Service */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground">
              DistroDB is an independent informational catalog of Linux distributions. We provide
              descriptions, technical specifications, screenshots, and links to official download
              sources maintained by third parties. We do not host, distribute, or modify any Linux
              distribution software ourselves.
            </p>
          </section>

          <Separator />

          {/* 3. Accuracy of Information */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">3. Accuracy of Information</h2>
            <p className="text-muted-foreground">
              The information on the Site — including version numbers, package managers, release
              models, desktop environments, and download links — is provided for general
              informational purposes and is maintained on a best-effort basis.
            </p>
            <p className="text-muted-foreground">
              Linux distributions change frequently. Information on the Site may be incomplete, out
              of date, or contain typographical or technical errors. We make no representation or
              warranty that any information is accurate, complete, or current at any given time. We
              reserve the right to update or remove any content without notice.
            </p>
            <p className="text-muted-foreground">
              You should always verify critical information directly with the official website of
              the distribution before making decisions based on it.
            </p>
          </section>

          <Separator />

          {/* 4. Disclaimer of Warranties */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">4. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              THE SITE AND ALL CONTENT AND LINKS PROVIDED THROUGH IT ARE PROVIDED{" "}
              <span className="text-foreground font-medium">&quot;AS IS&quot;</span> AND{" "}
              <span className="text-foreground font-medium">&quot;AS AVAILABLE&quot;</span>, WITHOUT
              WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
            </p>
            <p className="text-muted-foreground">
              We expressly disclaim all warranties, including but not limited to:
            </p>
            <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-4">
              <li>
                any implied warranties of merchantability, fitness for a particular purpose, or
                non-infringement;
              </li>
              <li>
                that the Site will be uninterrupted, error-free, or free of viruses or other harmful
                components;
              </li>
              <li>
                that any download link on the Site points to software that is safe, functional,
                complete, or free from defects;
              </li>
              <li>that any information on the Site is accurate, reliable, or up to date.</li>
            </ul>
            <p className="text-muted-foreground">
              All software accessible via links on this Site is provided by its respective
              third-party developers under their own licenses and terms. You download and use such
              software entirely at your own risk.
            </p>
          </section>

          <Separator />

          {/* 5. Limitation of Liability */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,{" "}
              <span className="text-foreground font-medium">{OPERATOR}</span> AND ITS DIRECTORS,
              EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO YOUR USE OF THE SITE OR
              ANY CONTENT OR LINKS PROVIDED THROUGH IT.
            </p>
            <p className="text-muted-foreground">
              This includes, without limitation, any loss of data, loss of profits, business
              interruption, hardware damage, or any other loss or damage arising from:
            </p>
            <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-4">
              <li>downloading, installing, or using any software linked from this Site;</li>
              <li>reliance on any information, specification, or data displayed on the Site;</li>
              <li>any errors, inaccuracies, or omissions in the content of the Site;</li>
              <li>
                any unauthorised access to or use of our servers or any personal information stored
                therein.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Where liability cannot be excluded by law, our total liability to you for any claim
              shall not exceed EUR 100.
            </p>
          </section>

          <Separator />

          {/* 6. Third-Party Links */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">6. Third-Party Links</h2>
            <p className="text-muted-foreground">
              The Site contains links to third-party websites, including official distribution
              download pages and mirrors. These links are provided for convenience only. We have no
              control over, and assume no responsibility for, the content, privacy policies, or
              practices of any third-party sites. We do not endorse any third-party site, product,
              or service.
            </p>
          </section>

          <Separator />

          {/* 7. Intellectual Property */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All original content on the Site — including the DistroDB name, logo, design, and
              curated text — is owned by <span className="text-foreground">{OPERATOR}</span> and is
              protected by applicable intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              All Linux distribution names, logos, and trademarks displayed on this Site — including
              but not limited to Ubuntu, Fedora, Debian, Arch Linux, openSUSE, and others — are the
              property of their respective owners (e.g., Canonical Ltd., Red Hat Inc., the Debian
              Project). Their appearance on the Site is for identification and informational
              purposes only.
            </p>
            <p className="text-muted-foreground">
              DistroDB is an independent catalog and is not affiliated with, endorsed by, or
              sponsored by Canonical Ltd., Red Hat Inc., or any other Linux distribution creator or
              maintainer, unless explicitly stated otherwise.
            </p>
          </section>

          <Separator />

          {/* 8. User Submissions */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">8. User Submissions</h2>
            <p className="text-muted-foreground">
              When you submit a suggestion, correction, or contact message through the Site, you
              grant us a non-exclusive, royalty-free licence to use, reproduce, and incorporate that
              submission into the Site&apos;s content for the purpose of improving the accuracy of
              the database. You confirm that your submission does not infringe any third-party
              rights.
            </p>
          </section>

          <Separator />

          {/* 9. Acceptable Use */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">9. Acceptable Use</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="text-muted-foreground flex list-disc flex-col gap-2 pl-4">
              <li>
                use the Site in any way that violates applicable local, national, or international
                law or regulation;
              </li>
              <li>
                scrape, crawl, or harvest data from the Site in a manner that places excessive load
                on our servers or circumvents rate limits;
              </li>
              <li>
                transmit unsolicited or unauthorised advertising or spam through our contact forms;
              </li>
              <li>
                attempt to gain unauthorised access to any part of the Site or its infrastructure.
              </li>
            </ul>
          </section>

          <Separator />

          {/* 10. Governing Law */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">10. Governing Law & Jurisdiction</h2>
            <p className="text-muted-foreground">
              These Terms are governed by and construed in accordance with the laws of Estonia and
              applicable European Union law. Any disputes arising under or in connection with these
              Terms shall be subject to the exclusive jurisdiction of the courts of Estonia, without
              prejudice to any mandatory consumer protection rights you may have under the law of
              your country of residence.
            </p>
          </section>

          <Separator />

          {/* 11. Changes */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">11. Changes to These Terms</h2>
            <p className="text-muted-foreground">
              We may update these Terms at any time. Changes will be effective upon posting to the
              Site. Continued use of the Site after changes are posted constitutes your acceptance
              of the revised Terms. We will update the &quot;Last updated&quot; date at the top of
              this page when changes are made.
            </p>
          </section>

          <Separator />

          {/* 12. Contact */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">12. Contact</h2>
            <p className="text-muted-foreground">
              For any questions about these Terms, contact us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-foreground underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              or through the{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-4">
                contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
