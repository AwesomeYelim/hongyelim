/** @type { import('next').NextConfig } */

const nextConfig = {
  // output: "export",
  // skipTrailingSlashRedirect: true, // middeleware 설정 부분
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: "/api",
        headers: [
          // {
          //   key: "Cache-Control",
          //   value: "no-store",
          // },
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
          {
            key: "Etag",
            value: "false",
          },
        ],
      },
    ];
  },
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
