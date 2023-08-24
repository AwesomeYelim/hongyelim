/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 1,
  exclude: ["/ignore-pages/page", "/ignore-pages/**"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ignore-pages"],
      },
    ],
    // 추가 sitemap 설정
    additionalSitemaps: [`${process.env.NEXTAUTH_URL || `http://localhost:3000`}/sitemap/posts-sitemap.xml`],
  },
};
