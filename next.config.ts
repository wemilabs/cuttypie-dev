import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ubrw5iu3hw.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
