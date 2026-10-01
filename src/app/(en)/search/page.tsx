/**
 * SEARCH PAGE — the page at /search (and /tr/search, /ru/search, /ky/search).
 * A thin shell: the interactive search box lives in SearchUI.tsx next to it.
 * This page carries a noindex tag in every language — Google should index the
 * lessons, not the search results page.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import SearchUI from "./SearchUI";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

export function generateMetadata({ params }: { params: { lang?: LangParam["lang"] } }): Metadata {
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "search.meta.title"),
    description: t(lang, "search.meta.desc"),
    path: "/search",
    lang,
    noindex: true,
  });
}

/** Server shell (prerendered) + client search UI inside a Suspense boundary
 *  so useSearchParams() works with a fully static export. */
export default function SearchPage({ params }: { params: { lang?: LangParam["lang"] } }) {
  const lang: Lang = requireLang(params);
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "search.meta.title") },
        ]}
        title={t(lang, "search.hero.title")}
        lede={t(lang, "search.hero.lede")}
      />
      <div className="subject-overview" style={{ paddingTop: 0 }}>
        <Suspense
          fallback={
            <div className="search-panel">
              <p className="empty">{t(lang, "search.loading")}</p>
            </div>
          }
        >
          <SearchUI lang={lang} />
        </Suspense>
      </div>
    </>
  );
}
