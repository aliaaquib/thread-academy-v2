/**
 * PRIVACY PAGE — the page at /privacy (and /tr/privacy, /ru/privacy, /ky/privacy).
 * Privacy Policy for Thread Academy. Copy lives in the
 * language dictionaries (src/lib/strings.ts, "privacy.*" keys).
 */
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

const SECTIONS = 7;

export async function generateMetadata(props: { params: Promise<{ lang?: LangParam["lang"] }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "privacy.meta.title"),
    description: t(lang, "privacy.meta.desc"),
    path: "/privacy",
    lang,
  });
}

/** The page itself — numbered legal sections. */
export default async function PrivacyPage(props: { params: Promise<{ lang?: LangParam["lang"] }> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const sections = Array.from({ length: SECTIONS }, (_, i) => ({
    title: t(lang, `privacy.s${i + 1}.title`),
    body: t(lang, `privacy.s${i + 1}.body`),
  }));
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "privacy.meta.title") },
        ]}
        title={t(lang, "privacy.hero.title")}
        lede={t(lang, "privacy.hero.lede")}
      />
      <div className="legal-page">
        <p className="legal-updated">{t(lang, "privacy.updated")}</p>
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
