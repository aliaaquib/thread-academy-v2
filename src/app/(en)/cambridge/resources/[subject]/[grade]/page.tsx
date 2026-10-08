/**
 * CAMBRIDGE RESOURCES — GRADE RESOURCES at /cambridge/resources/[subject]/[grade]
 * (and /tr/cambridge/resources/…, …).
 * Step 4 of the resources flow: every chapter of this grade, each card
 * linking to its chapter resources (notes, worksheets, videos, practice).
 * Only this grade's resources are shown.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getChaptersForGrade, parseGradeSlug, gradeSlug, GRADES } from "@/lib/grades";
import { getContentChapters } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { levelIdForGrade, resourcesPath } from "@/lib/curricula";

export function generateStaticParams() {
  const params: { subject: string; grade: string }[] = [];
  for (const subject of SUBJECT_SLUGS) {
    for (const grade of GRADES) {
      if (getChaptersForGrade(subject, grade, "en").length === 0) continue;
      params.push({ subject, grade: gradeSlug(grade) });
    }
  }
  return params;
}

type Params = LangParam & { subject: string; grade: string };

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  if (!subject || !grade) return {};
  return pageMetadata({
    title: `${subject.name} — ${t(lang, "subject.grade.label", { grade })} ${t(lang, "resources.meta.title")}`,
    description: t(lang, "resources.grade.lede", { subject: subject.name, grade }),
    path: `/cambridge/resources/${params.subject}/${params.grade}`,
    lang,
  });
}

export default async function GradeResourcesPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  if (!subject || !grade) notFound();

  const chapters = getChaptersForGrade(params.subject, grade, lang);
  if (chapters.length === 0) notFound();

  const levelId = levelIdForGrade("cambridge", grade);
  // Chapters that actually have translated content (hence resources).
  const contentChapters = new Set(
    getContentChapters(lang)
      .filter((c) => c.subject === params.subject && c.grade === grade)
      .map((c) => c.chapter)
  );

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "nav.resources"), href: withLang("/resources", lang) },
          { label: "Cambridge", href: withLang("/cambridge/resources", lang) },
          { label: subject.name, href: withLang(`/cambridge/resources/${params.subject}`, lang) },
          { label: t(lang, "subject.grade.label", { grade }) },
        ]}
        title={`${subject.name} — ${t(lang, "subject.grade.label", { grade })}`}
        lede={t(lang, "resources.grade.lede", { subject: subject.name, grade })}
      />
      <section className="subject-overview">
        {chapters.length === 0 ? (
          <p className="empty-note">{t(lang, "resources.grade.empty")}</p>
        ) : (
          <div className="subjects-grid">
            {chapters.map((chapter) => {
              const hasContent = contentChapters.has(chapter.id);
              const href =
                levelId && hasContent
                  ? withLang(
                      resourcesPath("cambridge", levelId, params.subject, grade, chapter.id),
                      lang
                    )
                  : null;
              const card = (
                <>
                  <div className="eyebrow">{chapter.id.replace(/-/g, " ")}</div>
                  <div className="subject-bottom">
                    <div>
                      <h3>{chapter.title}</h3>
                      <div className="subject-meta">{chapter.desc}</div>
                    </div>
                    <span className="subject-arrow" aria-hidden="true">
                      {href ? "↗" : "○"}
                    </span>
                  </div>
                </>
              );
              return href ? (
                <Link key={chapter.id} className="subject-card" href={href}>
                  {card}
                </Link>
              ) : (
                <div key={chapter.id} className="subject-card" style={{ opacity: 0.6 }}>
                  {card}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
