/**
 * CAMBRIDGE RESOURCES — GRADE PICKER at /cambridge/resources/[subject]
 * (and /tr/cambridge/resources/…, …).
 * Step 3 of the resources flow: pick a grade to see only its resources.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getGradesForSubject, gradeSlug } from "@/lib/grades";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

export function generateStaticParams() {
  return SUBJECT_SLUGS.map((subject) => ({ subject }));
}

type Params = LangParam & { subject: string };

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const subject = getSubject(params.subject, lang);
  if (!subject) return {};
  return pageMetadata({
    title: `${t(lang, "resources.pick.grade.title")} — ${subject.name}`,
    description: t(lang, "resources.pick.grade.lede"),
    path: `/cambridge/resources/${params.subject}`,
    lang,
  });
}

export default async function SubjectResourcesPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const subject = getSubject(params.subject, lang);
  if (!subject) notFound();

  const grades = getGradesForSubject(params.subject, lang).filter((g) => g.chapters.length > 0);
  if (grades.length === 0) notFound();

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "nav.resources"), href: withLang("/resources", lang) },
          { label: "Cambridge", href: withLang("/cambridge/resources", lang) },
          { label: subject.name },
        ]}
        title={t(lang, "resources.pick.grade.title")}
        lede={t(lang, "resources.pick.grade.lede")}
      />
      <section className="subject-overview">
        <div className="subjects-grid">
          {grades.map(({ grade, chapters }) => (
            <Link
              key={grade}
              className="subject-card"
              href={withLang(`/cambridge/resources/${params.subject}/${gradeSlug(grade)}`, lang)}
            >
              <div className="eyebrow">{t(lang, "subject.grade.label", { grade })}</div>
              <div className="subject-bottom">
                <div>
                  <h3>{t(lang, "subject.grade.label", { grade })}</h3>
                  <div className="subject-meta">
                    {tn(lang, "common.chapters", chapters.length, { n: chapters.length })}
                  </div>
                </div>
                <span className="subject-arrow" aria-hidden="true">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
