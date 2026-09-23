import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { CURRICULUM_SLUGS, allLevelSlugs, getCurriculum, resolveLevel } from "@/lib/curriculum";
import { getSubject } from "@/lib/subjects";
import { pageMetadata } from "@/lib/seo";

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
};

export function generateStaticParams() {
  const params: { curriculum: string; level: string }[] = [];
  for (const curriculum of CURRICULUM_SLUGS) {
    for (const { slug: level } of allLevelSlugs(curriculum)) {
      params.push({ curriculum, level });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: { curriculum: string; level: string } }) {
  const curriculum = getCurriculum(params.curriculum);
  const level = curriculum ? resolveLevel(params.curriculum, params.level) : null;
  if (!curriculum || !level) return {};
  return pageMetadata({
    title: `${curriculum.name} ${level.name} subjects`,
    description: `Subjects offered in ${curriculum.name} ${level.name}. Pick a subject to open its chapters, lessons and practice.`,
    path: `/curriculum/${curriculum.slug}/${level.slug}`,
  });
}

export default function CurriculumLevelPage({ params }: { params: { curriculum: string; level: string } }) {
  const curriculum = getCurriculum(params.curriculum);
  const level = curriculum ? resolveLevel(params.curriculum, params.level) : null;
  if (!curriculum || !level) notFound();

  const subjects = level.subjects.map((s) => getSubject(s)).filter((s) => s !== null);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Curriculum", href: "/curriculum" },
          { label: curriculum.name, href: `/curriculum/${curriculum.slug}` },
          { label: level.name },
        ]}
        eyebrow={`${curriculum.name} · ${level.name}`}
        title="Choose a subject"
        lede={`Each subject opens a curriculum-aware chapter sequence for ${level.name}.`}
      />
      <section className="subject-overview">
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <Link
              key={subject.slug}
              className="subject-card"
              href={`/subjects/${subject.slug}/${curriculum.slug}/${level.slug}`}
            >
              <div className="subject-icon" aria-hidden="true">
                {GLYPHS[subject.slug] ?? subject.slug.slice(0, 2).toUpperCase()}
              </div>
              <div className="subject-bottom">
                <div>
                  <h3>{subject.name}</h3>
                  <div className="subject-meta">
                    {curriculum.name} · {level.name}
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
