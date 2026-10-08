/**
 * LESSON PAGE — the page at /subjects/<subject>/grade-<n>/<chapter>/<topic>
 * (e.g. .../algebra/linear-equations), in every language.
 * Renders one .mdx lesson file with the sidebar, breadcrumbs and Google data.
 * The lesson text itself lives in content/subject/... (or content/<lang>/subject/...
 * for translated lessons) — this file only displays it.
 *
 * Translated lesson pages are generated ONLY where a real translated .mdx
 * file exists; nothing is presented as translated when it is not.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponentsForLang } from "@/mdx-components";
import { remarkSafeLessonMdx } from "@/lib/mdx-lesson-sanitize";
import { ChapterSidebar } from "@/components/textbook/ChapterSidebar";
import { getSubject } from "@/lib/subjects";
import { getChapterForSubject } from "@/lib/stage-chapters";
import {
  getGradeForChapter,
  gradeSlug,
  parseGradeSlug,
} from "@/lib/grades";
import { getAllTopicParams, getAvailableTopics, getTopicContent, topicFileMtime, topicLangs } from "@/lib/content";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { LANGS, langMeta, withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { topicParams } from "@/lib/route-params";
import {
  resolveCurriculumLevel,
  levelStringKey,
  curriculumPath,
  levelPath,
  subjectPath,
  gradePath as gradeUrl,
  chapterPath as chapterUrl,
  topicPath as topicUrl,
  resourcesPath,
  CURRICULUM_NAMES,
} from "@/lib/curricula";

/** Tells the site builder which pages to create ahead of time — every real
 *  lesson file in every language. Non-English pages exist only where a
 *  translated .mdx file genuinely exists. */
export function generateStaticParams() {
  return topicParams("en");
}

type Params = LangParam & { level: string; subject: string; grade: string; chapter: string; topic: string };

/** The title + description Google and link previews show for this page. */
export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const content = getTopicContent(params, lang);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  if (!content || !resolved || !subject || !grade) return {};
  if (getGradeForChapter(params.subject, params.chapter) !== grade) return {};
  if (!resolved.level.grades.includes(grade)) return {};
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  return pageMetadata({
    title: `${t(lang, "topic.meta.title", { title: content.title, name: subject.name, grade })} — ${levelName}`,
    description: content.lede
      ? t(lang, "topic.meta.desc", { lede: content.lede, grade, name: subject.name })
      : t(lang, "topic.meta.desc.noLede", { title: content.title, grade, name: subject.name }),
    path: topicUrl(curriculum.id, level.id, params.subject, grade, params.chapter, params.topic),
    lang,
    type: "article",
    alternates: topicLangs(params.subject, params.chapter, params.topic),
  });
}

/** The page itself — what the visitor sees. */
export default async function TopicPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter, lang);
  const content = getTopicContent(params, lang);
  if (!resolved || !subject || !grade || !chapter || !content) notFound();
  if (getGradeForChapter(params.subject, params.chapter) !== grade) notFound();
  if (!resolved.level.grades.includes(grade)) notFound();
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  const curriculumName = CURRICULUM_NAMES[curriculum.id];

  const url = withLang(gradeUrl(curriculum.id, level.id, params.subject, grade), lang);
  const chapterUrlFull = `${url}/${params.chapter}`;
  const topics = getAvailableTopics(
    { subject: params.subject, chapter: params.chapter },
    lang,
  );

  // Previous / next lessons inside this chapter, for easy navigation.
  const currentIndex = topics.findIndex((t) => t.slug === params.topic);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  const selfUrl = withLang(
    topicUrl(curriculum.id, level.id, params.subject, grade, params.chapter, params.topic),
    lang,
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: t(lang, "common.home"), path: withLang("/", lang) },
            { name: curriculumName, path: withLang(curriculumPath(curriculum.id), lang) },
            { name: levelName, path: withLang(levelPath(curriculum.id, level.id) + "/subjects", lang) },
            { name: subject.name, path: withLang(subjectPath(curriculum.id, level.id, params.subject), lang) },
            { name: t(lang, "topic.grade.label", { grade }), path: url },
            { name: chapter.title, path: chapterUrlFull },
            { name: content.title },
          ]),
          articleJsonLd({
            headline: content.title,
            description: content.lede || t(lang, "topic.jsonld.desc", { title: content.title, grade, name: subject.name }),
            path: selfUrl,
            chapter: chapter.title,
            // Real last-modified date from the lesson file itself — never invented.
            dateModified: topicFileMtime(
              { subject: params.subject, chapter: params.chapter, topic: params.topic },
              lang,
            ).toISOString(),
            educationalLevel: t(lang, "topic.grade.label", { grade }),
            inLanguage: langMeta(lang).locale,
          }),
        ]}
      />
      <div className="lesson-layout">
      <ChapterSidebar
        subjectName={subject.name}
        chapterTitle={chapter.title}
        topics={topics}
        currentSlug={params.topic}
        backHref={url}
        backLabel={t(lang, "topic.grade.label", { grade })}
        lang={lang}
      />
      <div className="lesson-main">
        <nav aria-label="Breadcrumb" className="lesson-breadcrumb">
          <ol>
            <li>
              <Link href={withLang("/", lang)}>{t(lang, "common.home")}</Link>
            </li>
            <li>
              <Link href={withLang(curriculumPath(curriculum.id), lang)}>{curriculumName}</Link>
            </li>
            <li>
              <Link href={withLang(levelPath(curriculum.id, level.id) + "/subjects", lang)}>{levelName}</Link>
            </li>
            <li>
              <Link href={withLang(subjectPath(curriculum.id, level.id, params.subject), lang)}>{subject.name}</Link>
            </li>
            <li>
              <Link href={url}>{t(lang, "topic.grade.label", { grade })}</Link>
            </li>
            <li>
              <Link href={chapterUrlFull}>{chapter.title}</Link>
            </li>
            <li aria-current="page">{content.title}</li>
          </ol>
        </nav>
        <div className="lesson-top">
          <h1>{content.title}</h1>
          {content.lede && <p>{content.lede}</p>}
        </div>
        <article className="lesson-article">
          {/* Lesson MDX compiles with blockJS:false so quizzes can pass plain-data
              JSX props (options={[...]}}. remarkSafeLessonMdx() runs first and
              fail-closes the hole that leaves open: it throws at build time
              on <script>/<iframe>/form tags, on* handlers, javascript: URLs
              and any JS expression that isn't pure data (no identifiers, no
              calls — fetch/localStorage/document can't be reached). The
              bundled blockDangerousJS stays on underneath as defense in depth. */}
          <MDXRemote
            source={content.source}
            components={mdxComponentsForLang(lang)}
            options={{
              blockJS: false,
              mdxOptions: { remarkPlugins: [remarkSafeLessonMdx] },
            }}
          />
          <div className="lesson-finish">
            {prevTopic && (
              <Link className="next-btn" href={prevTopic.url}>
                ← {prevTopic.title}
              </Link>
            )}
            {nextTopic && (
              <Link className="next-btn" href={nextTopic.url}>
                {nextTopic.title} →
              </Link>
            )}
            <Link className="next-btn" href={url}>
              {t(lang, "topic.back.grade", { grade })}
            </Link>
            <Link
              className="next-btn"
              href={withLang(resourcesPath(curriculum.id, level.id, params.subject, grade, params.chapter), lang)}
            >
              {t(lang, "topic.resources.link")}
            </Link>
          </div>
        </article>
      </div>
      </div>
    </>
  );
}
