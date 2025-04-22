/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        fs: false,
        http2: false,
        tls: false,
        dns: false,
        child_process: false,
        'firebase-admin': false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 