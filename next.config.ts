import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5n5vhs0v3c.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
