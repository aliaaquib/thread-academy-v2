/**
 * GRADE CHAPTERS — the page at /subjects/<subject>/grade-<n>
 * (e.g. /subjects/mathematics/grade-9).
 * Lists the chapters assigned to that grade in src/lib/grades.ts.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { GRADES, getChaptersForGrade, gradeSlug, parseGradeSlug } from "@/lib/grades";
import { JsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";

/** Tells the site builder which pages to create ahead of time (one per subject/grade/chapter/topic). */
export function generateStaticParams() {
  const params: { subject: string; grade: string }[] = [];
  for (const subject of SUBJECT_SLUGS) {
    for (const grade of GRADES) {
      params.push({ subject, grade: gradeSlug(grade) });
    }
  }
  return params;
}

/** The title + description Google and link previews show for this page. */
export async function generateMetadata({
  params,
}: {
  params: { subject: string; grade: string };
}) {
  const subject = getSubject(params.subject);
  const grade = parseGradeSlug(params.grade);
  if (!subject || !grade) return {};
  const chapters = getChaptersForGrade(params.subject, grade);
  return pageMetadata({
    title: `Grade ${grade} ${subject.name} — chapters`,
    description: `Grade ${grade} ${subject.name} chapters: ${chapters.map((c) => c.title).join(", ")}. Lessons, worked examples and practice questions — free, no account required.`,
    path: `/subjects/${subject.slug}/${gradeSlug(grade)}`,
  });
}

/** The page itself — what the visitor sees. */
export default function GradePage({
  params,
}: {
  params: { subject: string; grade: string };
}) {
  const subject = getSubject(params.subject);
  const grade = parseGradeSlug(params.grade);
  if (!subject || !grade) notFound();

  const chapters = getChaptersForGrade(params.subject, grade);
  const gradePath = `/subjects/${subject.slug}/${gradeSlug(grade)}`;

  return (
    <>
      {/* Tells Google which chapters this grade contains. */}
      {chapters.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            chapters.map((c) => ({ name: c.title, url: `${gradePath}/${c.id}` })),
          )}
        />
      )}
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Subjects", href: "/subjects" },
          { label: subject.name, href: `/subjects/${subject.slug}` },
          { label: `Grade ${grade}` },
        ]}
        title={`Grade ${grade} ${subject.name}`}
        lede={`${chapters.length} chapter${chapters.length === 1 ? "" : "s"} for grade ${grade}. Work through the lessons in order — each one builds on the last.`}
      />

      <section className="subject-overview">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Chapters
          </div>
          <div className="chapters">
            {chapters.map((chapter, i) => {
              return (
                <Link
                  key={chapter.id}
                  className="chapter-link"
                  href={`${gradePath}/${chapter.id}`}
                >
                  <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="chapter-title">{chapter.title}</span>
                    <span className="chapter-desc">{chapter.desc}</span>
                  </span>
                  <span className="chapter-status">Read →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
