import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import {
  CURRICULUM_SLUGS,
  curriculumOffersSubject,
  getCurriculum,
} from "@/lib/curriculum";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { pageMetadata } from "@/lib/seo";
import LevelPicker from "./LevelPicker";

export function generateStaticParams() {
  const params: { subject: string; curriculum: string }[] = [];
  for (const subject of SUBJECT_SLUGS) {
    for (const curriculum of CURRICULUM_SLUGS) {
      if (curriculumOffersSubject(curriculum, subject)) {
        params.push({ subject, curriculum });
      }
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { subject: string; curriculum: string };
}) {
  const subject = getSubject(params.subject);
  const curriculum = getCurriculum(params.curriculum);
  if (!subject || !curriculum) return {};
  return pageMetadata({
    title: `${subject.name} — ${curriculum.name} levels`,
    description: `Choose a ${curriculum.name} level to open the ${subject.name} chapters: lessons, worked examples and practice for every level.`,
    path: `/subjects/${subject.slug}/${curriculum.slug}`,
  });
}

export default function SubjectCurriculumPage({
  params,
}: {
  params: { subject: string; curriculum: string };
}) {
  const subject = getSubject(params.subject);
  const curriculum = getCurriculum(params.curriculum);
  if (!subject || !curriculum || !curriculumOffersSubject(curriculum.slug, subject.slug)) {
    notFound();
  }

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Subjects", href: "/subjects" },
          { label: subject.name, href: `/subjects/${subject.slug}` },
          { label: curriculum.name },
        ]}
        title="Choose your level"
        lede={`Pick a level to see the ${subject.name} chapters written for the ${curriculum.name} curriculum.`}
      />
      <section className="subject-overview">
        <LevelPicker curriculum={curriculum} subject={subject} />
      </section>
    </>
  );
}
