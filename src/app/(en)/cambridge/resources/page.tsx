/**
 * CAMBRIDGE RESOURCES — SUBJECT PICKER at /cambridge/resources
 * (and /tr/cambridge/resources, …).
 * Step 2 of the resources flow: pick a subject, then a grade.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getGradesForSubject } from "@/lib/grades";
import { SUBJECT_GLYPHS } from "@/lib/subject-glyphs";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

export async function generateMetadata(props: { params: Promise<LangParam> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "resources.meta.title"),
    description: t(lang, "resources.pick.subject.lede"),
    path: "/cambridge/resources",
    lang,
  });
}

export default async function CambridgeResourcesPage(props: { params: Promise<LangParam> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);

  const subjects = SUBJECT_SLUGS.map((slug) => getSubject(slug, lang)).filter((s) => s);
  if (subjects.length === 0) notFound();

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "nav.resources"), href: withLang("/resources", lang) },
          { label: "Cambridge" },
        ]}
        title={t(lang, "resources.pick.subject.title")}
        lede={t(lang, "resources.pick.subject.lede")}
      />
      <section className="subject-overview">
        <div className="subjects-grid">
          {subjects.map((subject) => {
            if (!subject) return null;
            const grades = getGradesForSubject(subject.slug, lang).filter((g) => g.chapters.length > 0);
            if (grades.length === 0) return null;
            const chapterCount = grades.reduce((n, g) => n + g.chapters.length, 0);
            return (
              <Link
                key={subject.slug}
                className="subject-card"
                href={withLang(`/cambridge/resources/${subject.slug}`, lang)}
              >
                <div className="subject-icon" aria-hidden="true">
                  {SUBJECT_GLYPHS[subject.slug] ?? subject.slug.slice(0, 2).toUpperCase()}
                </div>
                <div className="subject-bottom">
                  <div>
                    <h3>{subject.name}</h3>
                    <div className="subject-meta">
                      {tn(lang, "common.chapters", chapterCount, { n: chapterCount })}
                    </div>
                  </div>
                  <span className="subject-arrow" aria-hidden="true">↗</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
