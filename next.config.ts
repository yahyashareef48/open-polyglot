import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  images: {
    unoptimized: true,
  },
  // Ensure public assets are properly handled
  assetPrefix: process.env.ASSET_PREFIX || undefined,
};

export default nextConfig;
