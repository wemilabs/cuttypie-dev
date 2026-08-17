import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    turbopackRustReactCompiler: true,
    useOffline: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ubrw5iu3hw.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "hsl8jk540a.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "essigfcv.netlify.app",
      },
    ],
  },
  reactCompiler: true,
  serverExternalPackages: ["prettier"],
  typedRoutes: true,
};

export default nextConfig;
