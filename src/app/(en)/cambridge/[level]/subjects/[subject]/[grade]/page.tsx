/**
 * GRADE CHAPTERS — the page at /cambridge/<level>/subjects/<subject>/grade-<n>
 * (e.g. /cambridge/lower-secondary/subjects/mathematics/grade-9), in every language.
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
import {
  resolveCurriculumLevel,
  levelStringKey,
  curriculumPath,
  levelPath,
  subjectPath,
  gradePath as gradeUrl,
  chapterPath,
  CURRICULUM_NAMES,
} from "@/lib/curricula";

/** Tells the site builder which pages to create ahead of time — every
 *  curriculum/level/subject/grade combination in every language. */
export function generateStaticParams() {
  return gradeParams("en");
}

type Params = LangParam & { level: string; subject: string; grade: string };

/** The title + description Google and link previews show for this page. */
export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  if (!resolved || !subject || !grade) return {};
  const { curriculum, level } = resolved;
  if (!level.grades.includes(grade)) return {};
  const chapters = getChaptersForGrade(params.subject, grade, lang);
  const levelName = t(lang, levelStringKey(level.id));
  return pageMetadata({
    title: `${t(lang, "grade.meta.title", { grade, name: subject.name })} — ${levelName}`,
    description: t(lang, "grade.meta.desc", {
      grade,
      name: subject.name,
      chapters: chapters.map((c) => c.title).join(", "),
    }),
    path: gradeUrl(curriculum.id, level.id, subject.slug, grade),
    lang,
  });
}

/** The page itself — what the visitor sees. */
export default async function GradePage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  const subject = getSubject(params.subject, lang);
  const grade = parseGradeSlug(params.grade);
  if (!resolved || !subject || !grade) notFound();
  const { curriculum, level } = resolved;
  // The grade must belong to the level in the URL — no cross-level deep links.
  if (!level.grades.includes(grade)) notFound();
  const levelName = t(lang, levelStringKey(level.id));
  const curriculumName = CURRICULUM_NAMES[curriculum.id];

  const chapters = getChaptersForGrade(params.subject, grade, lang);
  const url = withLang(gradeUrl(curriculum.id, level.id, subject.slug, grade), lang);

  return (
    <>
      {/* Tells Google which chapters this grade contains. */}
      {chapters.length > 0 && (
        <JsonLd
          data={itemListJsonLd(
            chapters.map((c) => ({ name: c.title, url: `${url}/${c.id}` })),
          )}
        />
      )}
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
          { label: levelName, href: withLang(levelPath(curriculum.id, level.id) + "/subjects", lang) },
          { label: subject.name, href: withLang(subjectPath(curriculum.id, level.id, subject.slug), lang) },
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
                  href={`${url}/${chapter.id}`}
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
