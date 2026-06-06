import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s1.ticketm.net" },
      { protocol: "https", hostname: "media.ticketmaster.eu" },
      { protocol: "https", hostname: "chairnerd.global.ssl.fastly.net" },
      { protocol: "https", hostname: "*.seatgeek.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
    ],
  },
};

export default nextConfig;
