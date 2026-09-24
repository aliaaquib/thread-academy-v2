import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { PracticeItem, PracticeQuestions } from "@/components/textbook/PracticeQuestions";
import EquationSolver from "@/components/widgets/EquationSolver";
import { getSubject } from "@/lib/subjects";
import { getChapterForSubject } from "@/lib/stage-chapters";
import { getGradeForChapter, gradeSlug, parseGradeSlug } from "@/lib/grades";
import { getContentChapters } from "@/lib/content";
import { getChapterResources } from "@/lib/resources";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getContentChapters().map((c) => ({
    subject: c.subject,
    grade: gradeSlug(c.grade),
    chapter: c.chapter,
  }));
}

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
    title: `${chapter.title} resources — Grade ${grade} ${subject.name}`,
    description: `Notes, worksheets, videos, interactive tools and revision materials for ${chapter.title} (grade ${grade} ${subject.name}).`,
    path: `/resources/${params.subject}/${gradeSlug(grade)}/${params.chapter}`,
  });
}

function ResourceSection({ id, eyebrow, title, lede, children }: {
  id: string;
  eyebrow: string;
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} style={{ marginBottom: 72, scrollMarginTop: 100 }}>
      <div className="section-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <p>{lede}</p>
      </div>
      {children}
    </div>
  );
}

export default function ChapterResourcesPage({
  params,
}: {
  params: { subject: string; grade: string; chapter: string };
}) {
  const subject = getSubject(params.subject);
  const grade = parseGradeSlug(params.grade);
  const chapter = getChapterForSubject(params.subject, params.chapter);
  if (!subject || !grade || !chapter) notFound();
  if (getGradeForChapter(params.subject, params.chapter) !== grade) notFound();

  const resources = getChapterResources(params.subject, params.chapter);
  const chapterBase = `/subjects/${params.subject}/${gradeSlug(grade)}/${params.chapter}`;

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: subject.name },
          { label: `Grade ${grade}`, href: `/subjects/${params.subject}/${gradeSlug(grade)}` },
          { label: `${chapter.title} resources` },
        ]}
        title={`${chapter.title} resources`}
        lede={`${subject.name}, grade ${grade}. Notes, worksheets, videos, interactive tools and revision materials for this chapter.`}
      />

      <div className="subject-overview">
        <div className="stage-line" style={{ marginBottom: 64 }} aria-label="On this page">
          <a href="#notes">Notes</a>
          <a href="#worksheets">Worksheets</a>
          <a href="#videos">Videos</a>
          {resources.tools.length > 0 && <a href="#interactive-tools">Interactive tools</a>}
          <a href="#revision">Revision</a>
        </div>

        <ResourceSection
          id="notes"
          eyebrow="Notes"
          title="Study notes"
          lede="The chapter's lessons are the notes — read them in order, then use the resources below."
        >
          <div className="chapters">
            {resources.notes.map((note, i) => (
              <Link key={note.url} className="chapter-link" href={note.url}>
                <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="chapter-title">{note.title}</span>
                  <span className="chapter-desc">{note.desc}</span>
                </span>
                <span className="chapter-status">Read lesson →</span>
              </Link>
            ))}
          </div>
        </ResourceSection>

        <ResourceSection
          id="worksheets"
          eyebrow="Worksheets"
          title="Practice worksheet"
          lede="Attempt every question before revealing the answer — that struggle is where learning happens."
        >
          {resources.worksheets.length > 0 ? (
            <PracticeQuestions>
              {resources.worksheets.map((w, i) => (
                <PracticeItem key={i} question={`${i + 1}. ${w.question}`} hint={w.hint}>
                  <p>{w.answer}</p>
                </PracticeItem>
              ))}
            </PracticeQuestions>
          ) : (
            <p className="empty-note">
              Practice questions live inside each lesson — work through them there, then return for revision.
            </p>
          )}
        </ResourceSection>

        <ResourceSection
          id="videos"
          eyebrow="Videos"
          title="Watch and learn"
          lede="Hand-picked searches to find a clear video explanation of each lesson."
        >
          <div className="chapters">
            {resources.videos.map((video) => (
              <a
                key={video.url}
                className="video-row"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="video-play" aria-hidden="true">
                  ▶
                </span>
                <span>
                  <span className="chapter-title" style={{ fontSize: "1.2rem" }}>
                    {video.title}
                  </span>
                  <span className="chapter-desc">YouTube search · opens in a new tab</span>
                </span>
                <span className="chapter-status">Watch →</span>
              </a>
            ))}
          </div>
        </ResourceSection>

        {resources.tools.length > 0 && (
          <ResourceSection
            id="interactive-tools"
            eyebrow="Interactive tools"
            title="Try it yourself"
            lede={resources.tools[0].desc}
          >
            <EquationSolver />
          </ResourceSection>
        )}

        <ResourceSection
          id="revision"
          eyebrow="Revision"
          title="Revision checklist"
          lede="Can you explain each of these out loud, without looking? If not, re-read that lesson."
        >
          <ul className="learn-list">
            {resources.revision.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p style={{ marginTop: 48 }}>
            <Link className="inline-link" href={chapterBase}>
              ← Back to {chapter.title}
            </Link>
          </p>
        </ResourceSection>
      </div>
    </>
  );
}
