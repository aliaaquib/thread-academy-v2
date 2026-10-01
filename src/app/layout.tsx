/**
 * ROOT LAYOUT — wraps EVERY page on the site.
 * Renders <html>/<body> and the site-wide default SEO tags only.
 * The header, footer and search overlay live in the per-tree layouts:
 *   src/app/(en)/layout.tsx    (English, unprefixed URLs)
 *   src/app/[lang]/layout.tsx  (Turkish / Russian / Kyrgyz mirrors)
 *
 * NOTE: this file intentionally has no TutorWidget import — the AI tutor is
 * a local-preview-only file that is not on the academy's main branch.
 */
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { t } from "@/lib/strings";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s — Thread Academy",
  },
  description: t("en", "seo.site.desc"),
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: t("en", "seo.site.desc"),
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: t("en", "seo.share.alt"),
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: t("en", "seo.site.desc"),
    images: ["/og-image.png"],
  },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

/**
 * The static export writes <html lang="en"> for every page; the postbuild
 * script (scripts/fix-html-lang.mjs) rewrites the lang attribute for the
 * /tr, /ru and /ky mirrors, and <HtmlLang> keeps it correct on client-side
 * navigation between languages.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are self-hosted via @font-face in globals.css — no external requests. */}
      </head>
      <body>{children}</body>
    </html>
  );
}
