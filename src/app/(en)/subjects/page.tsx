/**
 * SUBJECTS INDEX — the page at /subjects (and /tr/subjects, /ru/subjects, /ky/subjects).
 * Shows all 13 subjects grouped by category (STEM / Humanities / Languages).
 * The list comes from src/lib/subjects.ts — edit that file to add/remove subjects.
 */
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { getChaptersForSubject } from "@/lib/stage-chapters";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

export function generateMetadata({ params }: { params: { lang?: LangParam["lang"] } }): Metadata {
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "subjects.meta.title"),
    description: t(lang, "subjects.meta.desc"),
    path: "/subjects",
    lang,
  });
}

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
  "psychology": "Ψ",
  "sociology": "◉",
  "political-science": "⚖",
  "russian": "Ж",
};

/** The page itself — what the visitor sees. */
export default function SubjectsPage({ params }: { params: { lang?: LangParam["lang"] } }) {
  const lang: Lang = requireLang(params);
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "subjects.meta.title") },
        ]}
        title={t(lang, "subjects.hero.title")}
        lede={t(lang, "subjects.hero.lede")}
      />
      <section className="subject-overview">
        {CATEGORY_ORDER.map((category) => (
          <div key={category}>
            <div className="eyebrow" style={{ margin: "42px 0 16px" }}>
              {t(lang, `subject.category.${category.toLowerCase()}`)}
            </div>
            <div className="subjects-grid">
              {subjectsByCategory(category, lang).map((subject) => {
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
          </div>
        ))}
      </section>
    </>
  );
}
