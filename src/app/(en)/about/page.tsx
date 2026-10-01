/**
 * ABOUT PAGE — the page at /about (and /tr/about, /ru/about, /ky/about).
 * Static text explaining what Thread Academy is. The copy lives in the
 * language dictionaries (src/lib/strings.ts, "about.*" keys).
 */
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

export function generateMetadata({ params }: { params: { lang?: LangParam["lang"] } }): Metadata {
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "about.meta.title"),
    description: t(lang, "about.meta.desc"),
    path: "/about",
    lang,
  });
}

/** The page itself — what the visitor sees. */
export default function AboutPage({ params }: { params: { lang?: LangParam["lang"] } }) {
  const lang: Lang = requireLang(params);
  const provides = [1, 2, 3, 4].map((n) => t(lang, `about.provides.${n}`));
  const chapters = [1, 2, 3, 4].map((n) => ({
    title: t(lang, `about.c${n}.title`),
    desc: t(lang, `about.c${n}.desc`),
  }));
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "about.meta.title") },
        ]}
        title={t(lang, "about.hero.title")}
        lede={t(lang, "about.hero.lede")}
      />
      <section className="subject-overview">
        <div className="overview-grid">
          <aside className="overview-aside">
            <h2>{t(lang, "about.provides.title")}</h2>
            <ul className="learn-list">
              {provides.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
          <div className="chapters">
            {chapters.map((c, i) => (
              <div key={c.title} className="chapter-link">
                <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="chapter-title">{c.title}</span>
                  <span className="chapter-desc">{c.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
