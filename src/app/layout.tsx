import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SearchOverlayHost } from "@/components/SearchOverlayHost";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s — Thread Academy",
  },
  description:
    "Thread Academy is an open educational knowledge platform for school learning: clear lessons, practice and tests across British, Cambridge, American and IB curricula. No account required.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Thread Academy is an open educational knowledge platform for school learning: clear lessons, practice and tests across British, Cambridge, American and IB curricula.",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description:
      "Free school lessons, practice and tests across British, Cambridge, American and IB curricula.",
  },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are self-hosted via @font-face in globals.css — no external requests. */}
      </head>
      <body>
        <div className="shell">
          <SiteHeader />
          <main className="view">{children}</main>
          <SiteFooter />
          <SearchOverlayHost />
        </div>
      </body>
    </html>
  );
}
