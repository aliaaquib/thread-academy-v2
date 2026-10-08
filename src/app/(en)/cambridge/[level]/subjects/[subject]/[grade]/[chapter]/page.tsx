/**
 * CHAPTER TOPICS — the page at /cambridge/<level>/subjects/<subject>/grade-<n>/<chapter>
 * (e.g. /cambridge/lower-secondary/subjects/mathematics/grade-9/algebra), in every language.
 * Lists the chapter's lessons. Only topics that have a real .mdx lesson file
 * in the page language are shown (checked by src/lib/content.ts), so links
 * never go nowhere. Missing translations simply show fewer lessons —
 * nothing is presented as translated when it is not.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getChapterForSubject } from "@/lib/stage-chapters";
import {
  allGradeChapters,
  getGradeForChapter,
  gradeSlug,
  parseGradeSlug,
} from "@/lib/grades";
import { getAvailableTopics } from "@/lib/content";
import { JsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { LANGS, withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { chapterParams } from "@/lib/route-params";
import {
  resolveCurriculumLevel,
  levelStringKey,
  curriculumPath,
  levelPath,
  subjectPath,
  gradePath as gradeUrl,
  chapterPath as chapterUrl,
  resourcesPath,
  CURRICULUM_NAMES,
} from "@/lib/curricula";

/** Tells the site builder which pages to create ahead of time — every
 *  chapter page in every language (structural pages fall back to the
 *  English chapter structure; only translated lessons are listed). */
export function generateStaticParams() {
  return chapterParams("en");
}

type Params = LangParam & { level: string; subject: string; grade: string; chapter: string };

/** The title + description Google and link previews show for this page. */
export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter, lang);
  if (!resolved || !subject || !grade || !chapter) return {};
  if (getGradeForChapter(params.subject, params.chapter) !== grade) return {};
  if (!resolved.level.grades.includes(grade)) return {};
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  return pageMetadata({
    title: `${t(lang, "chapter.meta.title", { title: chapter.title, grade, name: subject.name })} — ${levelName}`,
    description: t(lang, "chapter.meta.desc", {
      desc: chapter.desc,
      title: chapter.title,
      grade,
      name: subject.name,
    }),
    path: chapterUrl(curriculum.id, level.id, subject.slug, grade, chapter.id),
    lang,
    type: "article",
  });
}

/** The page itself — what the visitor sees. */
export default async function ChapterPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter, lang);
  if (!resolved || !subject || !grade || !chapter) notFound();
  if (getGradeForChapter(params.subject, params.chapter) !== grade) notFound();
  if (!resolved.level.grades.includes(grade)) notFound();
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  const curriculumName = CURRICULUM_NAMES[curriculum.id];

  const url = withLang(gradeUrl(curriculum.id, level.id, subject.slug, grade), lang);
  // Lessons in the page language. If the teacher hasn't written them yet,
  // fall back to the English lessons (clearly marked) instead of showing
  // an empty chapter — nothing is ever presented as translated when it isn't.
  let topics = getAvailableTopics(
    { subject: params.subject, chapter: params.chapter },
    lang,
  );
  let fallbackToEnglish = false;
  if (lang !== "en" && topics.length === 0) {
    const englishTopics = getAvailableTopics(
      { subject: params.subject, chapter: params.chapter },
      "en",
    );
    if (englishTopics.length > 0) {
      topics = englishTopics;
      fallbackToEnglish = true;
    }
  }

  return (
    <>
      {/* Tells Google which lessons this chapter contains. Only rendered
          when the chapter actually has lessons in this language. */}
      {topics.length > 0 && (
        <JsonLd data={itemListJsonLd(topics.map((t) => ({ name: t.title, url: t.url })))} />
      )}
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
          { label: levelName, href: withLang(levelPath(curriculum.id, level.id) + "/subjects", lang) },
          { label: subject.name, href: withLang(subjectPath(curriculum.id, level.id, subject.slug), lang) },
          { label: t(lang, "topic.grade.label", { grade }), href: url },
          { label: chapter.title },
        ]}
        title={chapter.title}
        lede={chapter.desc}
      />
      <div className="subject-overview">
        <div className="overview-grid">
          <aside className="overview-aside">
            <h2>{t(lang, "chapter.aside.title")}</h2>
            <ul className="learn-list">
              <li>
                {topics.length > 0
                  ? tn(lang, "chapter.aside.lessons", topics.length, { n: topics.length })
                  : t(lang, "chapter.aside.soon")}
              </li>
              <li>{t(lang, "chapter.aside.defs")}</li>
              <li>{t(lang, "chapter.aside.worked")}</li>
              <li>{t(lang, "chapter.aside.practice")}</li>
              <li>{t(lang, "chapter.aside.quiz")}</li>
            </ul>
          </aside>
          <div>
            {fallbackToEnglish && (
              <p className="fallback-note">{t(lang, "chapter.fallback")}</p>
            )}
            <div className="chapters">
              {topics.length > 0 ? (
                topics.map((topic, i) => (
                  <Link key={topic.slug} className="chapter-link" href={topic.url}>
                    <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="chapter-title">{topic.title}</span>
                      <span className="chapter-desc">{topic.desc}</span>
                    </span>
                    <span className="chapter-status">{t(lang, "chapter.read.lesson")}</span>
                  </Link>
                ))
              ) : (
                <p className="empty-note">{t(lang, "chapter.empty")}</p>
              )}
            </div>
            {topics.length > 0 && (
              <p style={{ marginTop: 28 }}>
                <Link
                  className="inline-link"
                  href={withLang(resourcesPath(curriculum.id, level.id, params.subject, grade, params.chapter), lang)}
                >
                  {t(lang, "chapter.resources.link")}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
