import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Interactive guides ship as self-contained static pages under
  // public/guides/<slug>/index.html, each with its own design system.
  // Next serves public files by exact path only, so the clean URL is
  // mapped here. Add a line per guide.
  async rewrites() {
    return [
      {
        source: "/guides/measured-not-ranked",
        destination: "/guides/measured-not-ranked/index.html",
      },
    ];
  },
};

export default nextConfig;
