import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getChapterForSubject, getChaptersForSubject } from "@/lib/stage-chapters";
import { getAvailableTopics } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const params: { subject: string; chapter: string }[] = [];
  for (const subject of SUBJECT_SLUGS) {
    for (const chapter of getChaptersForSubject(subject)) {
      params.push({ subject, chapter: chapter.id });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { subject: string; chapter: string };
}) {
  const subject = getSubject(params.subject);
  const chapter = getChapterForSubject(params.subject, params.chapter);
  if (!subject || !chapter) return {};
  return pageMetadata({
    title: `${chapter.title} — ${subject.name}`,
    description: `${chapter.desc} Open ${chapter.title} for ${subject.name}: lessons, worked examples and practice questions.`,
    path: `/subjects/${subject.slug}/${chapter.id}`,
    type: "article",
  });
}

export default function ChapterPage({
  params,
}: {
  params: { subject: string; chapter: string };
}) {
  const subject = getSubject(params.subject);
  const chapter = getChapterForSubject(params.subject, params.chapter);
  if (!subject || !chapter) notFound();

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
                <Link className="inline-link" href={`/resources/${params.subject}/${params.chapter}`}>
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
