import type { Metadata } from "next";

/**
 * Canonical production URL for Thread Academy.
 *
 * IMPORTANT: Vercel currently serves this project on per-deployment preview
 * URLs behind Deployment Protection (SSO login), which Google cannot crawl.
 * Replace this with the final public production domain as soon as it is set
 * (and Deployment Protection is disabled), then rebuild.
 */
export const SITE_URL = "https://threadlearning.vercel.app";

export const SITE_NAME = "Thread Academy";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaInput {
  /** Full page title (the root layout appends " — Thread Academy" via the template). */
  title: string;
  description: string;
  /** Site-relative path, e.g. "/subjects/mathematics". */
  path: string;
  /** Open Graph type; "article" for lesson/chapter pages, "website" otherwise. */
  type?: "website" | "article";
  /** Set true for pages that must not be indexed (e.g. /search). */
  noindex?: boolean;
}

/** Builds title, description, canonical, Open Graph and Twitter metadata. */
export function pageMetadata({ title, description, path, type = "website", noindex = false }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title: `${title} — ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${title} — ${SITE_NAME}`,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export interface Crumb {
  name: string;
  /** Site-relative path; omit for the current page. */
  path?: string;
}

/** schema.org BreadcrumbList JSON-LD. */
export function breadcrumbJsonLd(crumbs: Crumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: absoluteUrl(c.path) } : {}),
    })),
  };
}

/** schema.org Course JSON-LD for a subject (optionally within a curriculum). */
export function courseJsonLd(input: {
  name: string;
  description: string;
  path: string;
  provider?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: {
      "@type": "Organization",
      name: input.provider ?? SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** schema.org Article JSON-LD for a lesson (topic) page. */
export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  chapter: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: { "@type": "CreativeWork", name: input.chapter },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/**
 * Renders one or more JSON-LD blocks. Place inside the page component's JSX;
 * renders a visually-hidden script tag, so the locked visual design is untouched.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape `<` so a `</script>` sequence in titles/descriptions can
          // never break out of the script tag (defense in depth; JSON-LD
          // strings are internally generated but titles come from MDX files).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
