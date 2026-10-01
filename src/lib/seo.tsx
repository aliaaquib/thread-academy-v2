/**
 * GOOGLE / SEO HELPERS — page titles, descriptions and structured data.
 *
 * pageMetadata() builds the <title> + description every page shows to Google.
 * The *JsonLd functions add machine-readable data (breadcrumbs, articles).
 * SITE_URL below must be the real public domain — update it if the domain changes.
 */
import type { Metadata } from "next";
import { langMeta, withLang, type Lang } from "./i18n";
import { t } from "./strings";

/**
 * Canonical production URL for Thread Academy.
 *
 * This is the domain Google should index. Every canonical URL, sitemap
 * entry, robots.txt reference and JSON-LD url on the site is built from it —
 * never point it at localhost or a preview deployment.
 */
export const SITE_URL = "https://threadacademy.aaquibali.com";

export const SITE_NAME = "Thread Academy";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaInput {
  /** Full page title (the root layout appends " — Thread Academy" via the template). */
  title: string;
  description: string;
  /**
   * Site-relative path WITHOUT any language prefix, e.g. "/subjects/mathematics".
   * The prefix for `lang` is added automatically.
   */
  path: string;
  /** Open Graph type; "article" for lesson/chapter pages, "website" otherwise. */
  type?: "website" | "article";
  /** Set true for pages that must not be indexed (e.g. /search). */
  noindex?: boolean;
  /** The language this page is rendered in. Defaults to English. */
  lang?: Lang;
  /**
   * The languages this exact page exists in. Defaults to all four.
   * Lesson pages pass only the languages with a teacher-written lesson file;
   * blog posts pass only the languages with a post file. This drives both
   * the hreflang links and the language switcher's availability check.
   */
  alternates?: Lang[];
}

/** Builds title, description, canonical, hreflang, Open Graph and Twitter metadata. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  noindex = false,
  lang = "en",
  alternates = ["en", "tr", "ru", "ky"],
}: PageMetaInput): Metadata {
  const url = absoluteUrl(withLang(path, lang));
  const languages: Record<string, string> = { "x-default": absoluteUrl(path) };
  for (const l of alternates) {
    languages[langMeta(l).locale] = absoluteUrl(withLang(path, l));
  }
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    // Machine-readable list of languages this page is available in, read by
    // the navbar language switcher to decide between the translated page
    // and the language homepage.
    other: { "thread-academy-langs": alternates.join(",") },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: langMeta(lang).locale,
      title: `${title} — ${SITE_NAME}`,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t(lang, "seo.share.alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE_NAME}`,
      description,
      images: ["/og-image.png"],
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

/** schema.org Course JSON-LD for a subject. */
export function courseJsonLd(input: {
  name: string;
  description: string;
  path: string;
  provider?: string;
  /** BCP-47 locale of the page, e.g. "tr-TR". */
  inLanguage?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
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
  /**
   * ISO date string of the real last-modified date (taken from the lesson
   * file's modification time). Only passed when known — never invented.
   * There is no datePublished because the original publish date is not recorded.
   */
  dateModified?: string;
  /** Real school level, e.g. "Grade 7". Only passed when known. */
  educationalLevel?: string;
  /** BCP-47 locale of the page, e.g. "tr-TR". */
  inLanguage?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.inLanguage ? { inLanguage: input.inLanguage } : {}),
    // Education vocabulary: this article IS a lesson, so say so with
    // schema.org's learning properties, using only real values.
    learningResourceType: "Lesson",
    ...(input.educationalLevel ? { educationalLevel: input.educationalLevel } : {}),
    isPartOf: { "@type": "CreativeWork", name: input.chapter },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/**
 * schema.org ItemList JSON-LD — a page listing a set of child pages,
 * e.g. the lessons inside a chapter or the chapters inside a grade.
 * Helps search engines understand the page's structure.
 */
export function itemListJsonLd(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.url),
    })),
  };
}

/**
 * schema.org WebSite data for the home page.
 * Tells Google the site's name, address and what it is.
 */
export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Free school subject revision: chapter-based lessons, worked examples and practice questions for grades 7–12.",
    inLanguage: "en",
  };
}

/**
 * schema.org Organization data for the site's publisher.
 * Only states what is true: the site's name and address. No fake
 * ratings, reviews or statistics.
 */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
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
