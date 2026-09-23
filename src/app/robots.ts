import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Generates /robots.txt for the static export. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search", "/search/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
