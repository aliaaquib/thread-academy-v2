/**
 * LESSON PAGE — the page at /subjects/<subject>/grade-<n>/<chapter>/<topic>
 * (e.g. .../algebra/linear-equations).
 * Renders one .mdx lesson file with the sidebar, breadcrumbs and Google data.
 * The lesson text itself lives in content/subject/... — this file only displays it.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/mdx-components";
import { ChapterSidebar } from "@/components/textbook/ChapterSidebar";
import { getSubject } from "@/lib/subjects";
import { getChapterForSubject } from "@/lib/stage-chapters";
import {
  getGradeForChapter,
  gradeSlug,
  parseGradeSlug,
} from "@/lib/grades";
import { getAllTopicParams, getAvailableTopics, getTopicContent, topicFileMtime } from "@/lib/content";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

/** Tells the site builder which pages to create ahead of time (one per subject/grade/chapter/topic). */
export function generateStaticParams() {
  const params: { subject: string; grade: string; chapter: string; topic: string }[] = [];
  for (const p of getAllTopicParams()) {
    const grade = getGradeForChapter(p.subject, p.chapter);
    if (!grade) continue;
    params.push({ subject: p.subject, grade: gradeSlug(grade), chapter: p.chapter, topic: p.topic });
  }
  return params;
}

/** The title + description Google and link previews show for this page. */
export async function generateMetadata({
  params,
}: {
  params: { subject: string; grade: string; chapter: string; topic: string };
}) {
  const content = getTopicContent(params);
  const subject = getSubject(params.subject);
  const grade = parseGradeSlug(params.grade);
  if (!content || !subject || !grade) return {};
  if (getGradeForChapter(params.subject, params.chapter) !== grade) return {};
  const chapter = getChapterForSubject(params.subject, params.chapter);
  return pageMetadata({
    title: `${content.title} — ${subject.name} (Grade ${grade})`,
    description: content.lede
      ? `${content.lede} A grade ${grade} ${subject.name} lesson with worked examples and practice.`
      : `${content.title}: a grade ${grade} ${subject.name} lesson with worked examples and practice.`,
    path: `/subjects/${params.subject}/${gradeSlug(grade)}/${params.chapter}/${params.topic}`,
    type: "article",
  });
}

/** The page itself — what the visitor sees. */
export default function TopicPage({
  params,
}: {
  params: { subject: string; grade: string; chapter: string; topic: string };
}) {
  const subject = getSubject(params.subject);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter);
  const content = getTopicContent(params);
  if (!subject || !grade || !chapter || !content) notFound();
  if (getGradeForChapter(params.subject, params.chapter) !== grade) notFound();

  const gradePath = `/subjects/${params.subject}/${gradeSlug(grade)}`;
  const chapterPath = `${gradePath}/${params.chapter}`;
  const topics = getAvailableTopics({
    subject: params.subject,
    chapter: params.chapter,
  });

  // Previous / next lessons inside this chapter, for easy navigation.
  const currentIndex = topics.findIndex((t) => t.slug === params.topic);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: subject.name, path: `/subjects/${params.subject}` },
            { name: `Grade ${grade}`, path: gradePath },
            { name: chapter.title, path: chapterPath },
            { name: content.title },
          ]),
          articleJsonLd({
            headline: content.title,
            description: content.lede || `${content.title} — a grade ${grade} ${subject.name} lesson.`,
            path: `/subjects/${params.subject}/${gradeSlug(grade)}/${params.chapter}/${params.topic}`,
            chapter: chapter.title,
            // Real last-modified date from the lesson file itself — never invented.
            dateModified: topicFileMtime({
              subject: params.subject,
              chapter: params.chapter,
              topic: params.topic,
            }).toISOString(),
            educationalLevel: `Grade ${grade}`,
          }),
        ]}
      />
      <div className="lesson-layout">
      <ChapterSidebar
        subjectName={subject.name}
        chapterTitle={chapter.title}
        topics={topics}
        currentSlug={params.topic}
        backHref={gradePath}
        backLabel={`Grade ${grade}`}
      />
      <div className="lesson-main">
        <nav aria-label="Breadcrumb" className="lesson-breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href={`/subjects/${params.subject}`}>{subject.name}</Link>
            </li>
            <li>
              <Link href={gradePath}>Grade {grade}</Link>
            </li>
            <li>
              <Link href={chapterPath}>{chapter.title}</Link>
            </li>
            <li aria-current="page">{content.title}</li>
          </ol>
        </nav>
        <div className="lesson-top">
          <h1>{content.title}</h1>
          {content.lede && <p>{content.lede}</p>}
        </div>
        <article className="lesson-article">
          {/* blockJS:false — our MDX is authored in-repo (trusted); it passes
              arrays/numbers as JSX props (e.g. QuizQuestion options).
              blockDangerousJS stays on (v6 default) as a safety net. */}
          <MDXRemote source={content.source} components={mdxComponents} options={{ blockJS: false }} />
          <div className="lesson-finish">
            {prevTopic && (
              <Link className="next-btn" href={`${chapterPath}/${prevTopic.slug}`}>
                ← {prevTopic.title}
              </Link>
            )}
            {nextTopic && (
              <Link className="next-btn" href={`${chapterPath}/${nextTopic.slug}`}>
                {nextTopic.title} →
              </Link>
            )}
            <Link className="next-btn" href={gradePath}>
              Back to Grade {grade} chapters
            </Link>
            <Link
              className="next-btn"
              href={`/resources/${params.subject}/${gradeSlug(grade)}/${params.chapter}`}
            >
              Related resources →
            </Link>
          </div>
        </article>
      </div>
      </div>
    </>
  );
}
