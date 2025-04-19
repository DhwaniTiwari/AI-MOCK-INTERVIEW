import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
      ignoreDuringBuilds: true,
  },

    typescript: {
      ignoreBuildErrors: true,
    },

    images: {
      domains: [],
      unoptimized: true,
    },

    output: 'standalone'
};

export default nextConfig;
