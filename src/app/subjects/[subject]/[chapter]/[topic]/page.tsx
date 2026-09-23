import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/mdx-components";
import { ChapterSidebar } from "@/components/textbook/ChapterSidebar";
import { getSubject } from "@/lib/subjects";
import { getChapterForSubject } from "@/lib/stage-chapters";
import { getAllTopicParams, getAvailableTopics, getTopicContent } from "@/lib/content";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllTopicParams();
}

export async function generateMetadata({
  params,
}: {
  params: { subject: string; chapter: string; topic: string };
}) {
  const content = getTopicContent(params);
  const subject = getSubject(params.subject);
  if (!content || !subject) return {};
  const chapter = getChapterForSubject(params.subject, params.chapter);
  const chapterPart = chapter ? ` — ${chapter.title}` : "";
  return pageMetadata({
    title: `${content.title}${chapterPart} — ${subject.name}`,
    description: content.lede
      ? `${content.lede} A ${subject.name} lesson with worked examples and practice.`
      : `${content.title}: a ${subject.name} lesson with worked examples and practice.`,
    path: `/subjects/${params.subject}/${params.chapter}/${params.topic}`,
    type: "article",
  });
}

export default function TopicPage({
  params,
}: {
  params: { subject: string; chapter: string; topic: string };
}) {
  const subject = getSubject(params.subject);
  const chapter = getChapterForSubject(params.subject, params.chapter);
  const content = getTopicContent(params);
  if (!subject || !chapter || !content) notFound();

  const subjectBase = `/subjects/${params.subject}`;
  const chapterBase = `${subjectBase}/${params.chapter}`;
  const topics = getAvailableTopics({
    subject: params.subject,
    chapter: params.chapter,
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: subject.name, path: subjectBase },
            { name: chapter.title, path: chapterBase },
            { name: content.title },
          ]),
          articleJsonLd({
            headline: content.title,
            description: content.lede || `${content.title} — a ${subject.name} lesson.`,
            path: `/subjects/${params.subject}/${params.chapter}/${params.topic}`,
            chapter: chapter.title,
          }),
        ]}
      />
      <div className="lesson-layout">
      <ChapterSidebar
        subjectName={subject.name}
        chapterTitle={chapter.title}
        topics={topics}
        currentSlug={params.topic}
        backHref={subjectBase}
        backLabel={subject.name}
      />
      <div className="lesson-main">
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
            <Link className="next-btn" href={subjectBase}>
              Back to {subject.name} chapters
            </Link>
            <Link
              className="next-btn"
              href={`/resources/${params.subject}/${params.chapter}`}
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
