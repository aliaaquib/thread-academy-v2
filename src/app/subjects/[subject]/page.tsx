import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject, CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import {
  CURRICULA,
  CURRICULUM_SLUGS,
  curriculumOffersSubject,
} from "@/lib/curriculum";
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
  "astronomy": "✦",
  "engineering": "⚙",
  "psychology": "Ψ",
  "sociology": "◉",
  "political-science": "⚖",
  "philosophy": "φ",
  "religious-studies": "◈",
  "civics": "§",
  "global-studies": "🌐",
  "german": "Ä",
  "arabic": "ع",
  "chinese": "中",
  "japanese": "あ",
  "russian": "Ж",
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
  const curricula = CURRICULUM_SLUGS.filter((c) => curriculumOffersSubject(c, subject.slug))
    .map((c) => CURRICULA[c].name)
    .join(", ");
  return pageMetadata({
    title: `${subject.name} lessons, chapters and practice`,
    description: `${subject.tagline ?? subject.intro} Follow ${subject.name} through ${curricula}: levels, chapters, lessons, worked examples and practice — free, no account required.`,
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
                    {subject.chapters.length} chapter areas · four curricula
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
            Choose curriculum
          </div>
          <div className="curriculum-grid">
              {CURRICULUM_SLUGS.filter((cSlug) => curriculumOffersSubject(cSlug, subject.slug)).map(
                (cSlug, i) => {
                  const curriculum = CURRICULA[cSlug];
                  return (
                    <Link
                      key={cSlug}
                      className="curriculum-card"
                      href={`/subjects/${subject.slug}/${cSlug}`}
                    >
                      <span className="curriculum-num">
                        {String(i + 1).padStart(2, "0")} / PATH
                      </span>
                      <h3>{curriculum.name}</h3>
                      <p>
                        {curriculum.stages.map((s) => s.name).join(" · ")}
                      </p>
                      <div className="stage-line" aria-hidden="true">
                        <span>Curriculum</span>
                        <span>Level</span>
                        <span>Chapters</span>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
        </div>
      </section>
    </>
  );
}
