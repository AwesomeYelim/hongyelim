import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hongyelim.vercel.app/",
      lastModified: new Date(),
    },
    {
      url: "https://hongyelim.vercel.app/profile",
      lastModified: new Date(),
    },
    {
      url: "https://hongyelim.vercel.app/posts",
      lastModified: new Date(),
    },
  ];
}
