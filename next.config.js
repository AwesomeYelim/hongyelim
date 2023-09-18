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
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
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
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
