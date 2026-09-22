import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://operator.codes"),
  title: {
    default: "Operator · Tyler Malin",
    template: "%s · Operator",
  },
  description:
    "Analysis and frameworks on AI systems, climate infrastructure, legal engineering, and protocol design, from Tyler Malin.",
  openGraph: {
    type: "website",
    url: "https://operator.codes/",
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
    <html lang="en" className={`${syne.variable} ${dmMono.variable}`}>
      <body>
        <Nav />
        <main className="pt-14 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
