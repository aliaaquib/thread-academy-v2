import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { CURRICULUM_SLUGS, allLevelSlugs, getCurriculum, resolveLevel } from "@/lib/curriculum";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getChaptersFor } from "@/lib/stage-chapters";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const params: { subject: string; curriculum: string; level: string }[] = [];
  for (const curriculum of CURRICULUM_SLUGS) {
    for (const { slug: level } of allLevelSlugs(curriculum)) {
      const resolved = resolveLevel(curriculum, level);
      if (!resolved) continue;
      for (const subject of SUBJECT_SLUGS) {
        if (resolved.subjects.includes(subject)) {
          params.push({ subject, curriculum, level });
        }
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { subject: string; curriculum: string; level: string };
}) {
  const subject = getSubject(params.subject);
  const curriculum = getCurriculum(params.curriculum);
  const level = curriculum ? resolveLevel(params.curriculum, params.level) : null;
  if (!subject || !curriculum || !level) return {};
  return pageMetadata({
    title: `${subject.name} chapters — ${curriculum.name} ${level.name}`,
    description: `All ${subject.name} chapters for ${curriculum.name} ${level.name}. Open a chapter for lessons, worked examples and practice questions.`,
    path: `/subjects/${subject.slug}/${curriculum.slug}/${level.slug}`,
  });
}

export default function SubjectLevelPage({
  params,
}: {
  params: { subject: string; curriculum: string; level: string };
}) {
  const subject = getSubject(params.subject);
  const curriculum = getCurriculum(params.curriculum);
  const level = curriculum ? resolveLevel(params.curriculum, params.level) : null;
  if (!subject || !curriculum || !level || !level.subjects.includes(subject.slug)) notFound();

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: subject.name, href: `/subjects/${subject.slug}` },
          { label: curriculum.name, href: `/subjects/${subject.slug}/${curriculum.slug}` },
          { label: level.name },
        ]}
        title={subject.name}
        lede={`Follow the ${subject.name} chapters for ${curriculum.name} ${level.name}. The topics below move from foundations to connected applications.`}
      />
      <section className="subject-overview">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Chapters
          </div>
          <div className="chapters">
            {getChaptersFor(subject.slug, curriculum.slug, level.slug).map((chapter, i) => {
              return (
                <Link
                  key={chapter.id}
                  className="chapter-link"
                  href={`/subjects/${params.subject}/${params.curriculum}/${params.level}/${chapter.id}`}
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
