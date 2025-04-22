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
        'google-auth-library': false,
        'gaxios': false,
        'https-proxy-agent': false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: [
      'firebase-admin',
      'google-auth-library',
      'gaxios',
      'https-proxy-agent',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 