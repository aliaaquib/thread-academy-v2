/**
 * GRADE PICKER — the page at /cambridge/<level>/subjects/<subject>
 * (e.g. /cambridge/lower-secondary/subjects/mathematics).
 * Shows this level's grades as cards; each card previews its chapters.
 * This file ALSO serves the category pages
 * (/cambridge/<level>/subjects/stem, …) — see CategoryView below.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject, CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { getChaptersForSubject } from "@/lib/stage-chapters";
import { getGradesForSubject } from "@/lib/grades";
import { JsonLd, courseJsonLd, pageMetadata } from "@/lib/seo";
import type { SubjectCategory } from "@/lib/types";
import { LANGS, langMeta, withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { subjectParams } from "@/lib/route-params";
import {
  getCurriculum,
  getLevel,
  resolveCurriculumLevel,
  levelStringKey,
  curriculumPath,
  levelPath,
  subjectPath,
  gradePath,
  CURRICULUM_NAMES,
} from "@/lib/curricula";

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
  psychology: "Ψ",
  sociology: "◉",
  "political-science": "⚖",
  "russian": "Ж",
};

const CATEGORY_SLUGS = ["stem", "humanities", "languages"];

function categoryFromSlug(slug: string): SubjectCategory | null {
  const upper = slug.toUpperCase();
  return (CATEGORY_ORDER as string[]).includes(upper) ? (upper as SubjectCategory) : null;
}

/** Tells the site builder which pages to create ahead of time. */
export function generateStaticParams() {
  return subjectParams("en");
}

type Params = LangParam & { level: string; subject: string };

/** The title + description Google and link previews show for this page. */
export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const curriculum = getCurriculum("cambridge");
  const level = curriculum ? getLevel(curriculum.id, params.level) : null;
  if (!curriculum || !level) return {};
  const levelName = t(lang, levelStringKey(level.id));
  const category = categoryFromSlug(params.subject);
  if (category) {
    const names = subjectsByCategory(category, lang).map((s) => s.name).join(", ");
    return pageMetadata({
      title: t(lang, "subject.category.meta.title", { category: t(lang, `subject.category.${params.subject}`) }),
      description: t(lang, "subject.category.meta.desc", {
        category: t(lang, `subject.category.${params.subject}`),
        names,
      }),
      path: subjectPath(curriculum.id, level.id, params.subject),
      lang,
    });
  }
  const subject = getSubject(params.subject, lang);
  if (!subject) return {};
  return pageMetadata({
    title: `${t(lang, "subject.meta.title", { name: subject.name })} — ${levelName}`,
    description: t(lang, "subject.meta.desc", { name: subject.name }),
    path: subjectPath(curriculum.id, level.id, subject.slug),
    lang,
  });
}

function CategoryView({
  lang,
  category,
  slug,
  curriculum,
  level,
}: {
  lang: Lang;
  category: SubjectCategory;
  slug: string;
  curriculum: { id: string };
  level: { id: string; grades: number[] };
}) {
  const displayName = t(lang, `subject.category.${slug}`);
  const curriculumName = CURRICULUM_NAMES[curriculum.id as keyof typeof CURRICULUM_NAMES];
  const levelName = t(lang, levelStringKey(level.id));
  // Only subjects with lessons in this level's grades — never fake entries.
  const subjects = subjectsByCategory(category, lang).filter((s) =>
    getGradesForSubject(s.slug, lang).some(
      (g) => level.grades.includes(g.grade) && g.chapters.length > 0
    )
  );
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
          { label: levelName, href: withLang(levelPath(curriculum.id, level.id) + "/subjects", lang) },
          { label: displayName },
        ]}
        title={t(lang, "subject.category.hero.title", { category: displayName })}
        lede={t(lang, "subject.category.hero.lede", {
          category: displayName,
          names: subjects.map((s) => s.name).join(", "),
        })}
      />
      <section className="subject-overview">
        <div className="subjects-grid">
          {subjects.map((subject) => {
            const n = getGradesForSubject(subject.slug, lang)
              .filter((g) => level.grades.includes(g.grade))
              .reduce((sum, g) => sum + g.chapters.length, 0);
            return (
              <Link
                key={subject.slug}
                className="subject-card"
                href={withLang(subjectPath(curriculum.id, level.id, subject.slug), lang)}
              >
                <div className="subject-icon" aria-hidden="true">
                  {GLYPHS[subject.slug] ?? subject.slug.slice(0, 2).toUpperCase()}
                </div>
                <div className="subject-bottom">
                  <div>
                    <h3>{subject.name}</h3>
                    <div className="subject-meta">
                      {tn(lang, "common.chapters", n, { n })}
                    </div>
                  </div>
                  <span className="subject-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

/** The page itself — what the visitor sees. */
export default async function SubjectPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  if (!resolved) notFound();
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  const curriculumName = CURRICULUM_NAMES[curriculum.id];

  const category = categoryFromSlug(params.subject);
  if (category) {
    return <CategoryView lang={lang} category={category} slug={params.subject} curriculum={curriculum} level={level} />;
  }
  const subject = getSubject(params.subject, lang);
  if (!subject) notFound();

  // Only this level's grades that actually have chapters.
  const grades = getGradesForSubject(subject.slug, lang).filter(
    (g) => level.grades.includes(g.grade) && g.chapters.length > 0
  );
  if (grades.length === 0) notFound();

  return (
    <>
      <JsonLd
        data={courseJsonLd({
          name: t(lang, "subject.course.name", { name: subject.name }),
          description: subject.intro,
          path: withLang(subjectPath(curriculum.id, level.id, subject.slug), lang),
          inLanguage: langMeta(lang).locale,
        })}
      />
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
          { label: levelName, href: withLang(levelPath(curriculum.id, level.id) + "/subjects", lang) },
          { label: subject.name },
        ]}
        title={subject.name}
        lede={subject.intro}
      />

      <section className="subject-overview">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            {t(lang, "subject.choose.grade")}
          </div>
          <div className="chapters">
            {grades.map(({ grade, chapters }) => {
              const preview = chapters
                .slice(0, 3)
                .map((c) => c.title)
                .join(" · ");
              return (
                <Link
                  key={grade}
                  className="chapter-link"
                  href={withLang(gradePath(curriculum.id, level.id, subject.slug, grade), lang)}
                >
                  <span className="chapter-index">{String(grade).padStart(2, "0")}</span>
                  <span>
                    <span className="chapter-title">
                      {t(lang, "topic.grade.label", { grade })}
                    </span>
                    <span className="chapter-desc">
                      {tn(lang, "subject.grade.chapters", chapters.length, { n: chapters.length })} · {preview}
                      {chapters.length > 3 ? " …" : ""}
                    </span>
                  </span>
                  <span className="chapter-status">{t(lang, "subject.grade.choose")}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
