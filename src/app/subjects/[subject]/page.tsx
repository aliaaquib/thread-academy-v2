/**
 * GRADE PICKER — the page at /subjects/<subject> (e.g. /subjects/mathematics).
 * Shows grades 7-12 as cards; each card previews its chapters.
 * This file ALSO serves /subjects/stem, /subjects/humanities and
 * /subjects/languages (the category pages) — see CategoryView below.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject, CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { getChaptersForSubject } from "@/lib/stage-chapters";
import { getGradesForSubject, gradeSlug } from "@/lib/grades";
import { JsonLd, courseJsonLd, pageMetadata } from "@/lib/seo";
import type { SubjectCategory } from "@/lib/types";

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
  psychology: "Ψ",
  sociology: "◉",
  "political-science": "⚖",
  russian: "Ж",
};

const CATEGORY_SLUGS = ["stem", "humanities", "languages"];
const CATEGORY_NAMES: Record<string, string> = {
  stem: "STEM",
  humanities: "Humanities",
  languages: "Languages",
};

function categoryFromSlug(slug: string): SubjectCategory | null {
  const upper = slug.toUpperCase();
  return (CATEGORY_ORDER as string[]).includes(upper) ? (upper as SubjectCategory) : null;
}

/** Tells the site builder which pages to create ahead of time (one per subject/grade/chapter/topic). */
export function generateStaticParams() {
  return [
    ...SUBJECT_SLUGS.map((subject) => ({ subject })),
    ...CATEGORY_SLUGS.map((subject) => ({ subject })),
  ];
}

/** The title + description Google and link previews show for this page. */
export async function generateMetadata({ params }: { params: { subject: string } }) {
  const category = categoryFromSlug(params.subject);
  if (category) {
    const names = subjectsByCategory(category).map((s) => s.name).join(", ");
    return pageMetadata({
      title: `${CATEGORY_NAMES[params.subject]} subjects`,
      description: `Browse ${CATEGORY_NAMES[params.subject]} subjects on Thread Academy: ${names}. Free lessons, chapters and practice — no account required.`,
      path: `/subjects/${params.subject}`,
    });
  }
  const subject = getSubject(params.subject);
  if (!subject) return {};
  return pageMetadata({
    title: `${subject.name} lessons by grade`,
    description: `Choose your grade (7 to 12) and follow the ${subject.name} chapters: lessons, worked examples and practice questions — free, no account required.`,
    path: `/subjects/${subject.slug}`,
  });
}

function CategoryView({ category, slug }: { category: SubjectCategory; slug: string }) {
  const displayName = CATEGORY_NAMES[slug];
  const subjects = subjectsByCategory(category);
  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Subjects", href: "/subjects" },
          { label: displayName },
        ]}
        title={`${displayName} subjects`}
        lede={`Explore ${displayName} subjects on Thread Academy: ${subjects.map((s) => s.name).join(", ")}. Free lessons, chapters and practice — no account required.`}
      />
      <section className="subject-overview">
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <Link
              key={subject.slug}
              className="subject-card"
              href={`/subjects/${subject.slug}`}
            >
              <div className="subject-icon" aria-hidden="true">
                {GLYPHS[subject.slug] ?? subject.slug.slice(0, 2).toUpperCase()}
              </div>
              <div className="subject-bottom">
                <div>
                  <h3>{subject.name}</h3>
                  <div className="subject-meta">
                    {getChaptersForSubject(subject.slug).length} chapters
                  </div>
                </div>
                <span className="subject-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

/** The page itself — what the visitor sees. */
export default function SubjectPage({ params }: { params: { subject: string } }) {
  const category = categoryFromSlug(params.subject);
  if (category) {
    return <CategoryView category={category} slug={params.subject} />;
  }
  const subject = getSubject(params.subject);
  if (!subject) notFound();

  const grades = getGradesForSubject(subject.slug);

  return (
    <>
      <JsonLd
        data={courseJsonLd({
          name: `${subject.name} — school lessons and practice`,
          description: subject.intro,
          path: `/subjects/${subject.slug}`,
        })}
      />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Subjects", href: "/subjects" },
          { label: subject.name },
        ]}
        title={subject.name}
        lede={subject.intro}
      />

      <section className="subject-overview">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Choose your grade
          </div>
          <div className="chapters">
            {grades.map(({ grade, chapters }) => {
              const preview = chapters
                .slice(0, 3)
                .map((c) => c.title)
                .join(" · ");
              return (
                <Link
                  key={grade}
                  className="chapter-link"
                  href={`/subjects/${subject.slug}/${gradeSlug(grade)}`}
                >
                  <span className="chapter-index">{String(grade).padStart(2, "0")}</span>
                  <span>
                    <span className="chapter-title">Grade {grade}</span>
                    <span className="chapter-desc">
                      {chapters.length} chapter{chapters.length === 1 ? "" : "s"} · {preview}
                      {chapters.length > 3 ? " …" : ""}
                    </span>
                  </span>
                  <span className="chapter-status">Choose →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
