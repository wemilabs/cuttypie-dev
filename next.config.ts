import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  experimental: {
    useOffline: true,
    turbopackRustReactCompiler: true,
    typedEnv: true,
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
  partialPrefetching: true,
  reactCompiler: true,
  serverExternalPackages: ["prettier"],
  typedRoutes: true,
};

export default nextConfig;
