import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { CompareProvider } from "@/components/compare-provider";
import { CompareBar } from "@/components/compare-bar";
import { CompareBarSpacer } from "@/components/compare-bar-spacer";
import { Footer } from "@/components/footer";
import { PrivacyNotice } from "@/components/privacy-notice";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://distrodb.xyz"),
  title: {
    default: "DistroDB - Linux Distribution Database",
    template: "%s | DistroDB",
  },
  description:
    "Search, compare and explore Linux distributions. Find the perfect Linux distro based on difficulty, release model, desktop environment, and more.",
  keywords: [
    "Linux distributions",
    "Linux distro",
    "best Linux distro",
    "Linux comparison",
    "Linux for beginners",
    "rolling release Linux",
    "Linux download",
  ],
  authors: [{ name: "DistroDB", url: "https://distrodb.xyz" }],
  creator: "DistroDB",
  openGraph: {
    type: "website",
    url: "https://distrodb.xyz",
    siteName: "DistroDB",
    title: "DistroDB - Linux Distribution Database",
    description:
      "Search, compare and explore Linux distributions. Find the perfect Linux distro based on difficulty, release model, desktop environment, and more.",
    images: [{ url: "/placeholder.png", width: 1200, height: 630, alt: "DistroDB" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DistroDB - Linux Distribution Database",
    description:
      "Search, compare and explore Linux distributions. Find the perfect Linux distro for your needs.",
    images: ["/placeholder.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <Script
          defer
          data-website-id="dfb0252b-506d-4fb4-bc2f-d3c9b9c09028"
          src="https://umami.nsweb.space/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <CompareProvider>
            <Header />
            {children}
            <Footer />
            <CompareBarSpacer />
            <CompareBar />
            <PrivacyNotice />
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
