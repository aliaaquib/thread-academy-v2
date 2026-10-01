/**
 * CHAPTER TOPICS — the page at /subjects/<subject>/grade-<n>/<chapter>
 * (e.g. /subjects/mathematics/grade-9/algebra), in every language.
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

/** Tells the site builder which pages to create ahead of time — every
 *  chapter page in every language (structural pages fall back to the
 *  English chapter structure; only translated lessons are listed). */
export function generateStaticParams() {
  return chapterParams("en");
}

type Params = LangParam & { subject: string; grade: string; chapter: string };

/** The title + description Google and link previews show for this page. */
export function generateMetadata({ params }: { params: Params }): Metadata {
  const lang = requireLang(params);
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter, lang);
  if (!subject || !grade || !chapter) return {};
  if (getGradeForChapter(params.subject, params.chapter) !== grade) return {};
  return pageMetadata({
    title: t(lang, "chapter.meta.title", { title: chapter.title, grade, name: subject.name }),
    description: t(lang, "chapter.meta.desc", {
      desc: chapter.desc,
      title: chapter.title,
      grade,
      name: subject.name,
    }),
    path: `/subjects/${subject.slug}/${gradeSlug(grade)}/${chapter.id}`,
    lang,
    type: "article",
  });
}

/** The page itself — what the visitor sees. */
export default function ChapterPage({ params }: { params: Params }) {
  const lang: Lang = requireLang(params);
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter, lang);
  if (!subject || !grade || !chapter) notFound();
  if (getGradeForChapter(params.subject, params.chapter) !== grade) notFound();

  const gradePath = withLang(`/subjects/${subject.slug}/${gradeSlug(grade)}`, lang);
  const topics = getAvailableTopics(
    { subject: params.subject, chapter: params.chapter },
    lang,
  );

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
          { label: t(lang, "subjects.meta.title"), href: withLang("/subjects", lang) },
          { label: subject.name, href: withLang(`/subjects/${subject.slug}`, lang) },
          { label: t(lang, "topic.grade.label", { grade }), href: gradePath },
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
                  href={withLang(`/resources/${params.subject}/${gradeSlug(grade)}/${params.chapter}`, lang)}
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
