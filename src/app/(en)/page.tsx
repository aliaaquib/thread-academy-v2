/**
 * HOME PAGE — the page at / (the very first page visitors see).
 * Shows the hero, quick lesson links, and subject cards grouped by category
 * (STEM / Humanities / Languages). Content comes from src/lib/subjects.ts —
 * to change which subjects appear, edit that file, not this one.
 * Rendered once per language at /, /tr, /ru and /ky.
 */
import type { Metadata } from "next";
import Link from "next/link";
import HeroSearch, { type QuickLink } from "@/components/HeroSearch";
import { CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { getChaptersForSubject } from "@/lib/stage-chapters";
import { getTopicContent, type TopicParams } from "@/lib/content";
import { gradeSlug } from "@/lib/grades";
import { JsonLd, organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import { langMeta, withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

/** The title Google shows for the home page, in the page language. */
export function generateMetadata({ params }: { params: LangParam }): Metadata {
  const lang = requireLang(params);
  const base = pageMetadata({
    title: t(lang, "home.meta.title"),
    description: t(lang, "home.meta.desc"),
    path: "/",
    lang,
  });
  // `absolute` is used because the root layout's title template does not apply
  // to the root segment's own title — without it the brand suffix would be missing.
  const full = `${t(lang, "home.meta.title")} — Thread Academy`;
  return {
    ...base,
    title: { absolute: full },
    openGraph: { ...base.openGraph, title: full },
    twitter: { ...base.twitter, title: full },
  };
}

/** Reference glyphs per subject slug (approved design; not emoji). */
const GLYPHS: Record<string, string> = {
  mathematics: "x²",
  physics: "F→",
  chemistry: "H₂",
  biology: "DNA",
  "computer-science": "</>",
  english: "Aa",
  history: "AD",
  geography: "◎",
  economics: "↗",
  psychology: "Ψ",
  sociology: "◉",
  "political-science": "⚖",
  russian: "Ж",
};

/** Featured lessons for the hero quick links (only shown where they exist). */
const QUICK: (TopicParams & { grade: number })[] = [
  { subject: "mathematics", grade: 9, chapter: "algebra", topic: "linear-equations" },
  { subject: "biology", grade: 8, chapter: "cell-biology", topic: "cell-structure" },
  { subject: "physics", grade: 8, chapter: "forces", topic: "newtons-laws" },
  { subject: "computer-science", grade: 9, chapter: "programming", topic: "variables" },
];

function quickLinks(lang: Lang): QuickLink[] {
  const links: QuickLink[] = [];
  for (const q of QUICK) {
    const content = getTopicContent(q, lang);
    if (!content) continue;
    links.push({
      label: content.title,
      href: `/subjects/${q.subject}/${gradeSlug(q.grade)}/${q.chapter}/${q.topic}`,
    });
  }
  return links;
}

/** The page itself — what the visitor sees. */
export default function HomePage({ params }: { params: LangParam }) {
  const lang = requireLang(params);

  const steps = [1, 2, 3, 4].map((n) => ({
    num: String(n),
    title: t(lang, `home.how.${n}.title`),
    text: t(lang, `home.how.${n}.text`),
  }));

  return (
    <>
      {/* Machine-readable site data for Google. Invisible to visitors. */}
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <header className="home-hero">
        <div className="hero-grid">
          <div>
            <h1>
              {t(lang, "home.hero.a")} <span className="underline">{t(lang, "home.hero.b")}</span>
            </h1>
            <p className="hero-copy">{t(lang, "home.hero.copy")}</p>
          </div>
        </div>
        <HeroSearch lang={lang} links={quickLinks(lang)} />
      </header>

      <section className="section" id="subjects">
        <div className="section-head">
          <h2>{t(lang, "home.subjects.title")}</h2>
          <p>{t(lang, "home.subjects.lede")}</p>
        </div>
        {CATEGORY_ORDER.map((category) => (
          <div key={category}>
            <div className="eyebrow" style={{ margin: "42px 0 16px" }}>
              {t(lang, `subject.category.${category.toLowerCase()}`)}
            </div>
            <div className="subjects-grid">
              {subjectsByCategory(category, lang).slice(0, 3).map((subject) => {
                const n = getChaptersForSubject(subject.slug, lang).length;
                return (
                  <Link
                    key={subject.slug}
                    className="subject-card"
                    href={withLang(`/subjects/${subject.slug}`, lang)}
                  >
                    <div className="subject-icon" aria-hidden="true">
                      {GLYPHS[subject.slug] ?? subject.slug.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="subject-bottom">
                      <div>
                        <h3>{subject.name}</h3>
                        <div className="subject-meta">
                          {tn(lang, "common.chapters", n, { n })}
                        </div>
                      </div>
                      <span className="subject-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <p style={{ marginTop: 18 }}>
              <Link className="inline-link" href={withLang(`/subjects/${category.toLowerCase()}`, lang)}>
                {t(lang, "home.browse.category", { category: t(lang, `subject.category.${category.toLowerCase()}`) })}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        ))}
        <p style={{ marginTop: 36 }}>
          <Link className="inline-link" href={withLang("/subjects", lang)}>
            {t(lang, "home.browse.all")} <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>

      <section className="section" id="why">
        <aside className="today-card">
          <div className="today-label">{t(lang, "home.why.kicker")}</div>
          <h2>{t(lang, "home.why.title")}</h2>
          <p>{t(lang, "home.why.copy")}</p>
          <Link className="inline-link" href={withLang("/about", lang)}>
            {t(lang, "home.why.link")} <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </section>

      <section className="section" id="how">
        <div className="section-head">
          <h2>{t(lang, "home.how.title")}</h2>
          <p>{t(lang, "home.how.lede")}</p>
        </div>
        <div className="how-grid">
          {steps.map((step) => (
            <div key={step.num} className="how-step">
              <div className="how-n">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
