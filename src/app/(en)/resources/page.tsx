/**
 * RESOURCES HUB — the page at /resources (and /tr/resources, /ru/resources, /ky/resources).
 * Entry point to worksheets, videos and practice for every chapter that has
 * lesson content in the page language. Chapter list comes from src/lib/content.ts.
 * Non-English versions list only chapters with genuinely translated lessons.
 */
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getContentChapters } from "@/lib/content";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getChapterForSubject, getChaptersForSubject } from "@/lib/stage-chapters";
import { getGradeForChapter, gradeSlug } from "@/lib/grades";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

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
};

export async function generateMetadata(props: { params: Promise<LangParam> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "resources.meta.title"),
    description: t(lang, "resources.meta.desc"),
    path: "/resources",
    lang,
  });
}

/** The page itself — what the visitor sees. */
export default async function ResourcesHubPage(props: { params: Promise<LangParam> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const chapters = getContentChapters(lang);

  const cards = SUBJECT_SLUGS.map((subjectSlug) => {
    const subject = getSubject(subjectSlug, lang);
    if (!subject) return null;
    // First chapter (in subject order) that has published lessons in this language.
    const withContent = new Set(
      chapters.filter((c) => c.subject === subjectSlug).map((c) => c.chapter)
    );
    const first = getChaptersForSubject(subjectSlug, lang).find((c) => withContent.has(c.id));
    if (!first) return null;
    const chapter = getChapterForSubject(subjectSlug, first.id, lang);
    if (!chapter) return null;
    const grade = getGradeForChapter(subjectSlug, first.id);
    if (!grade) return null;
    return {
      subject,
      href: withLang(`/resources/${subjectSlug}/${gradeSlug(grade)}/${chapter.id}`, lang),
      meta: t(lang, "resources.card.meta", { chapter: chapter.title, grade }),
    };
  }).filter((c) => c !== null);

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "resources.meta.title") },
        ]}
        title={t(lang, "resources.hero.title")}
        lede={t(lang, "resources.hero.lede")}
      />
      <section className="subject-overview">
        {cards.length > 0 ? (
          <div className="subjects-grid">
            {cards.map((card) => (
              <Link key={card.subject.slug} className="subject-card" href={card.href}>
                <div className="subject-icon" aria-hidden="true">
                  {GLYPHS[card.subject.slug] ?? card.subject.slug.slice(0, 2).toUpperCase()}
                </div>
                <div className="subject-bottom">
                  <div>
                    <h3>{card.subject.name}</h3>
                    <div className="subject-meta">{card.meta}</div>
                  </div>
                  <span className="subject-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-note">{t(lang, "resources.empty")}</p>
        )}
      </section>
    </>
  );
}
