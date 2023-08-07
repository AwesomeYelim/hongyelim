/** @type { import('next').NextConfig } */

const nextConfig = {
  // output: "export",
  // skipTrailingSlashRedirect: true, // middeleware 설정 부분
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
