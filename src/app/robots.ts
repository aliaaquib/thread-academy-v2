/**
 * ROBOTS — builds /robots.txt for the static export.
 * Lets search engines crawl everything except /search, and points them at
 * the sitemap. The sitemap URL is built from the canonical domain in lib/seo.
 */
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Next 16 requires an explicit static opt-in for metadata routes in `output: "export"`.
export const dynamic = "force-static";

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
