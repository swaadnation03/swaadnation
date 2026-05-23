import { MetadataRoute } from "next";
import { defaultSeoConfig } from "@/config/seo.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/checkout", "/login", "/register"],
    },
    sitemap: `${defaultSeoConfig.siteUrl}/sitemap.xml`,
  };
}