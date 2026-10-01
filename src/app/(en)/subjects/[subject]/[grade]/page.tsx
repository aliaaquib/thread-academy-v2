/**
 * GRADE CHAPTERS — the page at /subjects/<subject>/grade-<n>
 * (e.g. /subjects/mathematics/grade-9), in every language.
 * Lists the chapters assigned to that grade in src/lib/grades.ts.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { GRADES, getChaptersForGrade, gradeSlug, parseGradeSlug } from "@/lib/grades";
import { JsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";
import { LANGS, withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { gradeParams } from "@/lib/route-params";

/** Tells the site builder which pages to create ahead of time — every
 *  subject/grade combination in every language. */
export function generateStaticParams() {
  return gradeParams("en");
}

type Params = LangParam & { subject: string; grade: string };

/** The title + description Google and link previews show for this page. */
export function generateMetadata({ params }: { params: Params }): Metadata {
  const lang = requireLang(params);
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  if (!subject || !grade) return {};
  const chapters = getChaptersForGrade(params.subject, grade, lang);
  return pageMetadata({
    title: t(lang, "grade.meta.title", { grade, name: subject.name }),
    description: t(lang, "grade.meta.desc", {
      grade,
      name: subject.name,
      chapters: chapters.map((c) => c.title).join(", "),
    }),
    path: `/subjects/${subject.slug}/${gradeSlug(grade)}`,
    lang,
  });
}

/** The page itself — what the visitor sees. */
export default function GradePage({ params }: { params: Params }) {
  const lang: Lang = requireLang(params);
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  if (!subject || !grade) notFound();

  const chapters = getChaptersForGrade(params.subject, grade, lang);
  const gradePath = withLang(`/subjects/${subject.slug}/${gradeSlug(grade)}`, lang);

  return (
    <>
      {/* Tells Google which chapters this grade contains. */}
      {chapters.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            chapters.map((c) => ({ name: c.title, url: withLang(`${gradePath}/${c.id}`, lang) })),
          )}
        />
      )}
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "subjects.meta.title"), href: withLang("/subjects", lang) },
          { label: subject.name, href: withLang(`/subjects/${subject.slug}`, lang) },
          { label: t(lang, "topic.grade.label", { grade }) },
        ]}
        title={t(lang, "grade.hero.title", { grade, name: subject.name })}
        lede={tn(lang, "grade.hero.lede", chapters.length, { n: chapters.length, grade })}
      />

      <section className="subject-overview">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            {t(lang, "grade.eyebrow")}
          </div>
          <div className="chapters">
            {chapters.map((chapter, i) => {
              return (
                <Link
                  key={chapter.id}
                  className="chapter-link"
                  href={withLang(`${gradePath}/${chapter.id}`, lang)}
                >
                  <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="chapter-title">{chapter.title}</span>
                    <span className="chapter-desc">{chapter.desc}</span>
                  </span>
                  <span className="chapter-status">{t(lang, "grade.read")}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
