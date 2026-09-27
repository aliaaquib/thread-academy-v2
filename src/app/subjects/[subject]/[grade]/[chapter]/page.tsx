/**
 * CHAPTER TOPICS — the page at /subjects/<subject>/grade-<n>/<chapter>
 * (e.g. /subjects/mathematics/grade-9/algebra).
 * Lists the chapter's lessons. Only topics that have a real .mdx lesson file
 * are shown (checked by src/lib/content.ts), so links never go nowhere.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { pageMetadata } from "@/lib/seo";

/** Tells the site builder which pages to create ahead of time (one per subject/grade/chapter/topic). */
export function generateStaticParams() {
  return allGradeChapters().map(({ subject, grade, chapter }) => ({
    subject,
    grade: gradeSlug(grade),
    chapter,
  }));
}

/** The title + description Google and link previews show for this page. */
export async function generateMetadata({
  params,
}: {
  params: { subject: string; grade: string; chapter: string };
}) {
  const subject = getSubject(params.subject);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter);
  if (!subject || !grade || !chapter) return {};
  if (getGradeForChapter(params.subject, params.chapter) !== grade) return {};
  return pageMetadata({
    title: `${chapter.title} — Grade ${grade} ${subject.name}`,
    description: `${chapter.desc} Open ${chapter.title} for grade ${grade} ${subject.name}: lessons, worked examples and practice questions.`,
    path: `/subjects/${subject.slug}/${gradeSlug(grade)}/${chapter.id}`,
    type: "article",
  });
}

/** The page itself — what the visitor sees. */
export default function ChapterPage({
  params,
}: {
  params: { subject: string; grade: string; chapter: string };
}) {
  const subject = getSubject(params.subject);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter);
  if (!subject || !grade || !chapter) notFound();
  if (getGradeForChapter(params.subject, params.chapter) !== grade) notFound();

  const gradePath = `/subjects/${subject.slug}/${gradeSlug(grade)}`;
  const topics = getAvailableTopics({
    subject: params.subject,
    chapter: params.chapter,
  });

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Subjects", href: "/subjects" },
          { label: subject.name, href: `/subjects/${subject.slug}` },
          { label: `Grade ${grade}`, href: gradePath },
          { label: chapter.title },
        ]}
        title={chapter.title}
        lede={chapter.desc}
      />
      <div className="subject-overview">
        <div className="overview-grid">
          <aside className="overview-aside">
            <h2>In this chapter</h2>
            <ul className="learn-list">
              <li>
                {topics.length > 0
                  ? `${topics.length} lesson${topics.length === 1 ? "" : "s"}`
                  : "Lessons coming soon"}
              </li>
              <li>Definitions and key ideas</li>
              <li>Worked examples</li>
              <li>Practice questions with answers</li>
              <li>Short quizzes with explanations</li>
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
                    <span className="chapter-status">Read lesson →</span>
                  </Link>
                ))
              ) : (
                <p className="empty-note">
                  Lessons for this chapter are being written — check back soon, or explore another chapter.
                </p>
              )}
            </div>
            {topics.length > 0 && (
              <p style={{ marginTop: 28 }}>
                <Link className="inline-link" href={`/resources/${params.subject}/${gradeSlug(grade)}/${params.chapter}`}>
                  Chapter resources →
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
