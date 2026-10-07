/**
 * TERMS PAGE — the page at /terms (and /tr/terms, /ru/terms, /ky/terms).
 * Terms and Conditions for using Thread Academy. Copy lives in the
 * language dictionaries (src/lib/strings.ts, "terms.*" keys).
 */
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

const SECTIONS = 8;

export async function generateMetadata(props: { params: Promise<{ lang?: LangParam["lang"] }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "terms.meta.title"),
    description: t(lang, "terms.meta.desc"),
    path: "/terms",
    lang,
  });
}

/** The page itself — numbered legal sections. */
export default async function TermsPage(props: { params: Promise<{ lang?: LangParam["lang"] }> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const sections = Array.from({ length: SECTIONS }, (_, i) => ({
    title: t(lang, `terms.s${i + 1}.title`),
    body: t(lang, `terms.s${i + 1}.body`),
  }));
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "terms.meta.title") },
        ]}
        title={t(lang, "terms.hero.title")}
        lede={t(lang, "terms.hero.lede")}
      />
      <div className="legal-page">
        <p className="legal-updated">{t(lang, "terms.updated")}</p>
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
