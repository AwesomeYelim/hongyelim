/** @type { import('next').NextConfig } */

const nextConfig = {
  // output: "export",
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
