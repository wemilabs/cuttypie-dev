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
      ...[
        "img.freepik.com",
        "th.bing.com",
        "cdn.pocket-lint.com",
        "azure.microsoft.com",
        "www.vttresearch.com",
        "cdn-static.infotech.com",
        "www.slideteam.net",
        "thumbs.dreamstime.com",
      ].map((hostname) => ({ protocol: "https" as const, hostname })),
    ],
  },
  partialPrefetching: true,
  reactCompiler: true,
  serverExternalPackages: ["prettier"],
  typedRoutes: true,
};

export default nextConfig;
