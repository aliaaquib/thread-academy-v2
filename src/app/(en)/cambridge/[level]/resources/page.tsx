/**
 * RESOURCES HUB — the page at /cambridge/<level>/resources
 * (and /tr/cambridge/<level>/resources, …).
 * Entry point to worksheets, videos and practice for every chapter in this
 * level that has lesson content in the page language. Chapter list comes
 * from src/lib/content.ts. Non-English versions list only chapters with
 * genuinely translated lessons.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getContentChapters } from "@/lib/content";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getChapterForSubject, getChaptersForSubject } from "@/lib/stage-chapters";
import { getGradeForChapter, gradeSlug } from "@/lib/grades";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { levelParams } from "@/lib/route-params";
import {
  resolveCurriculumLevel,
  levelStringKey,
  curriculumPath,
  levelPath,
  resourcesPath,
  CURRICULUM_NAMES,
} from "@/lib/curricula";

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

type Params = LangParam & { level: string };

/** Prerender every level's resources hub for the static export. */
export function generateStaticParams() {
  return levelParams("en");
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  if (!resolved) return {};
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  return pageMetadata({
    title: `${t(lang, "resources.meta.title")} — ${levelName}`,
    description: t(lang, "resources.meta.desc"),
    path: levelPath(curriculum.id, level.id) + "/resources",
    lang,
  });
}

/** The page itself — what the visitor sees. */
export default async function ResourcesHubPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  if (!resolved) notFound();
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  const curriculumName = CURRICULUM_NAMES[curriculum.id];
  const chapters = getContentChapters(lang).filter((c) => level.grades.includes(c.grade));

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
      href: withLang(resourcesPath(curriculum.id, level.id, subjectSlug, grade, chapter.id), lang),
      meta: t(lang, "resources.card.meta", { chapter: chapter.title, grade }),
    };
  }).filter((c) => c !== null);

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
          { label: levelName, href: withLang(levelPath(curriculum.id, level.id) + "/subjects", lang) },
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
