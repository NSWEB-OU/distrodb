import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for DistroDB. Learn how we collect, use, and protect your personal data in compliance with GDPR.",
  alternates: { canonical: "https://distrodb.xyz/privacy" },
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz/privacy",
    title: "Privacy Policy | DistroDB",
    description: "How DistroDB collects, uses, and protects your personal data.",
    siteName: "DistroDB",
  },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "16 June 2026";
const CONTROLLER_EMAIL = "hello@distrodb.xyz";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mt-6 mb-10 space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose-like flex flex-col gap-8 text-sm leading-relaxed">
          {/* 1. Who we are */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">1. Data Controller</h2>
            <p className="text-muted-foreground">
              DistroDB (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is the data controller
              responsible for your personal data. We are established in the European Union and
              process personal data in accordance with Regulation (EU) 2016/679 (GDPR).
            </p>
            <p className="text-muted-foreground">
              Contact:{" "}
              <a
                href={`mailto:${CONTROLLER_EMAIL}`}
                className="text-foreground underline underline-offset-4"
              >
                {CONTROLLER_EMAIL}
              </a>
            </p>
          </section>

          <Separator />

          {/* 2. What we collect */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">2. Data We Collect</h2>
            <p className="text-muted-foreground">
              We collect only the minimum data necessary to operate the service.
            </p>

            <div className="flex flex-col gap-4">
              <div className="border-border flex flex-col gap-1.5 rounded-sm border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Contact form
                </p>
                <p className="text-muted-foreground">
                  When you submit the contact form we collect your{" "}
                  <strong className="text-foreground">name</strong>,{" "}
                  <strong className="text-foreground">email address</strong>, subject, and message.
                  This data is forwarded to our inbox via Resend (see §5) and is not stored in any
                  database by us.
                </p>
              </div>

              <div className="border-border flex flex-col gap-1.5 rounded-sm border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Suggest a change form
                </p>
                <p className="text-muted-foreground">
                  When you suggest a correction for a distro page we collect the distro name, the
                  field to change, your suggestion, and an optional{" "}
                  <strong className="text-foreground">email address</strong> if you choose to
                  provide one. This data is forwarded to our inbox via Resend and is not stored in
                  any database by us.
                </p>
              </div>

              <div className="border-border flex flex-col gap-1.5 rounded-sm border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  IP address (rate limiting)
                </p>
                <p className="text-muted-foreground">
                  To prevent abuse of our API endpoints we temporarily store your{" "}
                  <strong className="text-foreground">IP address</strong> in server memory. This
                  data is never written to disk, never shared with third parties, and is
                  automatically discarded within one hour.
                </p>
              </div>

              <div className="border-border flex flex-col gap-1.5 rounded-sm border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Server / hosting logs
                </p>
                <p className="text-muted-foreground">
                  Our hosting provider automatically records standard HTTP request logs (IP address,
                  URL path, browser type, timestamp) for operational and security purposes. We do
                  not control the retention period of these logs; please refer to our hosting
                  provider&apos;s privacy policy.
                </p>
              </div>

              <div className="border-border flex flex-col gap-1.5 rounded-sm border p-4">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Analytics (self-hosted Umami)
                </p>
                <p className="text-muted-foreground">
                  We use a self-hosted instance of Umami Analytics to understand how visitors
                  interact with the site in aggregate. Umami is{" "}
                  <strong className="text-foreground">cookie-free</strong> and collects{" "}
                  <strong className="text-foreground">
                    no personally identifiable information
                  </strong>
                  . The data recorded per page view includes: page URL, referrer, browser type,
                  operating system, device type, and country (derived from the IP address, which is
                  hashed and never stored or logged by Umami). Because it is self-hosted by us, this
                  data never passes through or is shared with any third-party analytics provider.
                  See §5 for details.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* 3. Legal basis */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">3. Legal Basis for Processing</h2>
            <ul className="text-muted-foreground flex list-none flex-col gap-2">
              <li>
                <strong className="text-foreground">Contact & suggestion forms</strong> - Art.
                6(1)(b) GDPR: processing is necessary to take steps at your request (responding to
                your inquiry or acting on your suggestion).
              </li>
              <li>
                <strong className="text-foreground">IP address for rate limiting</strong> - Art.
                6(1)(f) GDPR: our legitimate interest in protecting the service from abuse and
                ensuring availability for all users.
              </li>
              <li>
                <strong className="text-foreground">Hosting logs</strong> - Art. 6(1)(f) GDPR:
                legitimate interest in maintaining service security and performance.
              </li>
              <li>
                <strong className="text-foreground">Analytics (self-hosted Umami)</strong> - Art.
                6(1)(f) GDPR: legitimate interest in understanding aggregate, anonymised usage
                patterns to improve the service. No personal data is processed; IP addresses are
                never stored.
              </li>
            </ul>
          </section>

          <Separator />

          {/* 4. Data retention */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">4. Data Retention</h2>
            <ul className="text-muted-foreground flex list-none flex-col gap-2">
              <li>
                <strong className="text-foreground">Contact & suggestion submissions</strong> -
                retained in our email inbox for as long as necessary to respond and act on your
                request, and no longer than 2 years from the date of receipt.
              </li>
              <li>
                <strong className="text-foreground">IP address (rate limiting)</strong> - held in
                server memory for a maximum of 1 hour, then automatically discarded.
              </li>
              <li>
                <strong className="text-foreground">Hosting logs</strong> - as determined by our
                hosting provider&apos;s policies.
              </li>
              <li>
                <strong className="text-foreground">Analytics data (Umami)</strong> - aggregate
                statistics are retained for the lifetime of the account. No individual-level data is
                stored; all records are anonymised at the point of collection.
              </li>
            </ul>
          </section>

          <Separator />

          {/* 5. Third parties */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">5. Third-Party Processors</h2>
            <p className="text-muted-foreground">
              We use the following sub-processors. We do not sell your personal data to any third
              party, nor share it for advertising or marketing purposes.
            </p>
            <div className="flex flex-col gap-3">
              <div className="border-border flex flex-col gap-1 rounded-sm border p-4">
                <p className="text-xs font-medium">Resend (email delivery)</p>
                <p className="text-muted-foreground text-xs">
                  Used to deliver contact and suggestion form submissions to our inbox. Data is
                  transmitted over TLS. Resend is GDPR-compliant and processes data on
                  infrastructure located in the EU/US with appropriate safeguards. See{" "}
                  <a
                    href="https://resend.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4"
                  >
                    resend.com/legal/privacy-policy
                  </a>
                  .
                </p>
              </div>
              <div className="border-border flex flex-col gap-1 rounded-sm border p-4">
                <p className="text-xs font-medium">
                  Umami Analytics (self-hosted, privacy-friendly analytics)
                </p>
                <p className="text-muted-foreground text-xs">
                  We run our own self-hosted instance of Umami Analytics to collect anonymised,
                  aggregate usage statistics. Because it is self-hosted by us, this data is not
                  shared with any third-party analytics company. Umami does not use cookies and does
                  not store raw IP addresses or other identifiers. See{" "}
                  <a
                    href="https://umami.is/docs/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4"
                  >
                    umami.is/docs/privacy-policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* 6. Cookies */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">6. Cookies &amp; Tracking</h2>
            <p className="text-muted-foreground">
              DistroDB does not use advertising or any third-party tracking cookies. We use a{" "}
              <strong className="text-foreground">self-hosted instance of Umami Analytics</strong>,
              which is entirely cookie-free and does not place any cookies in your browser. The only
              data stored in your browser is:
            </p>
            <ul className="text-muted-foreground flex list-none flex-col gap-2">
              <li>
                <strong className="text-foreground">Theme preference</strong> - stored in{" "}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">localStorage</code> to
                remember whether you prefer dark or light mode. This data never leaves your device.
              </li>
              <li>
                <strong className="text-foreground">Cookie notice dismissal</strong> - stored in{" "}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">localStorage</code> to avoid
                showing the notice again once you have acknowledged it. This data never leaves your
                device.
              </li>
            </ul>
          </section>

          <Separator />

          {/* 7. Your rights */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">7. Your Rights Under GDPR</h2>
            <p className="text-muted-foreground">
              As a data subject you have the following rights:
            </p>
            <ul className="text-muted-foreground flex flex-col gap-1.5">
              <li>
                <strong className="text-foreground">Access</strong> - request a copy of the personal
                data we hold about you.
              </li>
              <li>
                <strong className="text-foreground">Rectification</strong> - request correction of
                inaccurate data.
              </li>
              <li>
                <strong className="text-foreground">Erasure</strong> - request deletion of your data
                where there is no overriding legitimate reason to retain it.
              </li>
              <li>
                <strong className="text-foreground">Restriction</strong> - request that we restrict
                processing of your data in certain circumstances.
              </li>
              <li>
                <strong className="text-foreground">Portability</strong> - receive your data in a
                structured, machine-readable format.
              </li>
              <li>
                <strong className="text-foreground">Objection</strong> - object to processing based
                on legitimate interests.
              </li>
            </ul>
            <p className="text-muted-foreground">
              To exercise any of these rights, email us at{" "}
              <a
                href={`mailto:${CONTROLLER_EMAIL}`}
                className="text-foreground underline underline-offset-4"
              >
                {CONTROLLER_EMAIL}
              </a>
              . We will respond within 30 days. You also have the right to lodge a complaint with
              your national data protection supervisory authority.
            </p>
          </section>

          <Separator />

          {/* 8. Changes */}
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold">8. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this policy from time to time. Material changes will be reflected by
              updating the &quot;Last updated&quot; date at the top of this page. Continued use of
              the site after changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
