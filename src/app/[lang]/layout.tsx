/**
 * LANGUAGE SHELL — wraps every page under /tr, /ru and /ky.
 * Validates the language prefix (unknown prefixes like /fr/ 404), renders the
 * header, footer and search overlay in the page language, and sets the
 * language-specific site description metadata.
 */
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SearchOverlayHost } from "@/components/SearchOverlayHost";
import { HtmlLang } from "@/components/HtmlLang";
import { type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

/** Only the three non-English languages are statically generated here. */
export function generateStaticParams() {
  return (["tr", "ru", "ky"] as Lang[]).map((lang) => ({ lang }));
}

export async function generateMetadata(props: { params: Promise<LangParam> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return {
    description: t(lang, "seo.site.desc"),
    openGraph: {
      description: t(lang, "seo.site.desc"),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: t(lang, "seo.share.alt") }],
    },
    twitter: {
      description: t(lang, "seo.site.desc"),
      images: ["/og-image.png"],
    },
  };
}

export default async function LangLayout(
  props: {
    children: React.ReactNode;
    params: Promise<LangParam>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  // Unknown language prefixes (e.g. /fr/...) 404 here.
  const lang = requireLang(params);
  return (
    <>
      <HtmlLang lang={lang} />
      <div className="shell">
        <SiteHeader lang={lang} />
        <main className="view">{children}</main>
        <SiteFooter lang={lang} />
        <SearchOverlayHost lang={lang} />
      </div>
    </>
  );
}
