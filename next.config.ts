import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["app", "components", "lib", "models", "scripts"],
  },
  serverExternalPackages: ["pdf-parse", "mongoose"],
  experimental: {
    optimizePackageImports: ["recharts"],
  },
};

export default nextConfig;
