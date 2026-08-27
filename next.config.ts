import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["app", "components", "lib", "models", "scripts"],
  },
  serverExternalPackages: ["pdf-parse", "mongoose"],
};

export default nextConfig;
