import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject, CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { getChaptersForSubject } from "@/lib/stage-chapters";
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
  business: "B",
  spanish: "Ñ",
  french: "Ç",
  "environmental-science": "♻",
  "earth-science": "⊕",
  astronomy: "✦",
  engineering: "⚙",
  psychology: "Ψ",
  sociology: "◉",
  "political-science": "⚖",
  philosophy: "φ",
  "religious-studies": "◈",
  civics: "§",
  "global-studies": "🌐",
  german: "Ä",
  arabic: "ع",
  chinese: "中",
  japanese: "あ",
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

export function generateStaticParams() {
  return [
    ...SUBJECT_SLUGS.map((subject) => ({ subject })),
    ...CATEGORY_SLUGS.map((subject) => ({ subject })),
  ];
}

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
    title: `${subject.name} lessons, chapters and practice`,
    description: `${subject.tagline ?? subject.intro} Follow the ${subject.name} chapters: lessons, worked examples and practice — free, no account required.`,
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

export default function SubjectPage({ params }: { params: { subject: string } }) {
  const category = categoryFromSlug(params.subject);
  if (category) {
    return <CategoryView category={category} slug={params.subject} />;
  }
  const subject = getSubject(params.subject);
  if (!subject) notFound();

  const chapters = getChaptersForSubject(subject.slug);

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
            Chapters
          </div>
          <div className="chapters">
            {chapters.map((chapter, i) => {
              return (
                <Link
                  key={chapter.id}
                  className="chapter-link"
                  href={`/subjects/${subject.slug}/${chapter.id}`}
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
