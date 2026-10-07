/**
 * COOKIES PAGE — the page at /cookies (and /tr/cookies, /ru/cookies, /ky/cookies).
 * Cookie Policy for Thread Academy. Copy lives in the
 * language dictionaries (src/lib/strings.ts, "cookies.*" keys).
 */
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

const SECTIONS = 4;

export async function generateMetadata(props: { params: Promise<{ lang?: LangParam["lang"] }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "cookies.meta.title"),
    description: t(lang, "cookies.meta.desc"),
    path: "/cookies",
    lang,
  });
}

/** The page itself — numbered legal sections. */
export default async function CookiesPage(props: { params: Promise<{ lang?: LangParam["lang"] }> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const sections = Array.from({ length: SECTIONS }, (_, i) => ({
    title: t(lang, `cookies.s${i + 1}.title`),
    body: t(lang, `cookies.s${i + 1}.body`),
  }));
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "cookies.meta.title") },
        ]}
        title={t(lang, "cookies.hero.title")}
        lede={t(lang, "cookies.hero.lede")}
      />
      <div className="legal-page">
        <p className="legal-updated">{t(lang, "cookies.updated")}</p>
        {sections.map((s, i) => (
          <section key={i} className="legal-section">
            <h2>
              <span className="legal-num">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </>
  );
}
