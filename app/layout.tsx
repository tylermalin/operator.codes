import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";

// Three faces, three jobs: serif for titles, sans for reading and UI,
// mono for metadata. See docs/design-system.md.
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://operator.codes"),
  title: {
    default: "Operator · Tyler Malin",
    template: "%s · Operator",
  },
  description:
    "Analysis and frameworks on AI systems, climate infrastructure, legal engineering, and protocol design, from Tyler Malin.",
  authors: [{ name: "Tyler Malin", url: "https://operator.codes/about" }],
  creator: "Tyler Malin",
  publisher: "Operator",
  // Canonical is set per page, never here: a root canonical would be
  // inherited by every page that forgets its own and point them all at
  // the home page. Same reason og:url is left out of the defaults.
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    siteName: "Operator",
    title: "Operator · Tyler Malin",
    description:
      "Analysis and frameworks on AI systems, climate infrastructure, legal engineering, and protocol design.",
    images: [{ url: "/brand/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tylermalin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Nav />
        <main className="pt-16 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
