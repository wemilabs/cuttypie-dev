import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	experimental: {
		viewTransition: true,
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
	serverExternalPackages: ["prettier"],
	typedRoutes: true,
};

export default nextConfig;
