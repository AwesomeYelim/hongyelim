/** @type { import('next').NextConfig } */

const nextConfig = {
  // output: "export",
  // skipTrailingSlashRedirect: true, // middeleware 설정 부분
  experimental: {
    appDir: true,
  },
  compiler: {
    styledComponents: {
      displayName: false,
    },
  },
  // reactStrictMode: true,
  swcMinify: true,
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "no-store",
  //         },

  //         {
  //           key: "Etag",
  //           value: "false",
  //         },
  //       ],
  //     },
  //   ];
  // },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
      };
    }

    return config;
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.scss$/,
  //       use: [
  //         "sass-extract-loader", // Add this loader
  //       ],
  //     },
  //   ],
  // },
};

module.exports = nextConfig;
