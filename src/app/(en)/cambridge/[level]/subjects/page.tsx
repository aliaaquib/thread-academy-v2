/**
 * SUBJECTS INDEX — the page at /cambridge/<level>/subjects
 * (and /tr/cambridge/<level>/subjects, …).
 * Shows the subjects that have lessons in this curriculum level's grades,
 * grouped by category (STEM / Humanities / Languages).
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { CATEGORY_ORDER, SUBJECT_SLUGS, subjectsByCategory } from "@/lib/subjects";
import { getGradesForSubject } from "@/lib/grades";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { levelParams } from "@/lib/route-params";
import {
  getCurriculum,
  getLevel,
  levelStringKey,
  curriculumPath,
  levelPath,
  subjectPath,
  CURRICULUM_NAMES,
} from "@/lib/curricula";

export async function generateMetadata(
  props: { params: Promise<{ lang?: LangParam["lang"]; level: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const curriculum = getCurriculum("cambridge");
  const level = curriculum ? getLevel(curriculum.id, params.level) : null;
  if (!curriculum || !level) return {};
  const levelName = t(lang, levelStringKey(level.id));
  return pageMetadata({
    title: `${t(lang, "subjects.meta.title")} — ${levelName}`,
    description: t(lang, "subjects.meta.desc.level", { level: levelName }),
    path: levelPath(curriculum.id, level.id) + "/subjects",
    lang,
  });
}

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
  "psychology": "Ψ",
  "sociology": "◉",
  "political-science": "⚖",
  "russian": "Ж",
};

type Params = { lang?: LangParam["lang"]; level: string };

/** Prerender every level's subjects index for the static export. */
export function generateStaticParams() {
  return levelParams("en");
}

/** The page itself — what the visitor sees. */
export default async function SubjectsPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const curriculum = getCurriculum("cambridge");
  if (!curriculum) notFound();
  const level = getLevel(curriculum.id, params.level);
  if (!level) notFound();
  const levelName = t(lang, levelStringKey(level.id));
  const curriculumName = CURRICULUM_NAMES[curriculum.id];

  // Coming-soon curricula have no levels by construction; this guards anyway.
  if (curriculum.status !== "active") {
    return (
      <>
        <PageHero
          crumbs={[
            { label: t(lang, "common.home"), href: withLang("/", lang) },
            { label: curriculumName },
          ]}
          title={curriculumName}
          lede={t(lang, "curriculum.comingSoon.lede", { name: curriculumName })}
        />
        <section className="subject-overview">
          <p className="muted">{t(lang, "curriculum.comingSoon")}</p>
          <p>
            <Link href={withLang(curriculumPath("cambridge"), lang)}>
              {t(lang, "curriculum.exploreCambridge")}
            </Link>
          </p>
        </section>
      </>
    );
  }

  // Levels with no content yet (e.g. Cambridge Primary, AS & A Level) —
  // honest empty state, no fake subjects.
  const hasContent = SUBJECT_SLUGS.some((slug) =>
    getGradesForSubject(slug, lang).some(
      (g) => level.grades.includes(g.grade) && g.chapters.length > 0
    )
  );
  if (!hasContent) {
    return (
      <>
        <PageHero
          crumbs={[
            { label: t(lang, "common.home"), href: withLang("/", lang) },
            { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
            { label: levelName },
          ]}
          title={levelName}
          lede={t(lang, "curriculum.level.empty", { level: levelName })}
        />
        <section className="subject-overview">
          <p>
            <Link href={withLang(curriculumPath(curriculum.id), lang)}>
              {t(lang, "curriculum.viewLevels")}
            </Link>
          </p>
        </section>
      </>
    );
  }

  // Subjects with at least one chapter in this level's grades.
  const byCategory = new Map<string, string[]>();
  for (const category of CATEGORY_ORDER) {
    byCategory.set(
      category,
      subjectsByCategory(category, lang)
        .map((s) => s.slug)
        .filter((slug) =>
          getGradesForSubject(slug, lang).some(
            (g) => level.grades.includes(g.grade) && g.chapters.length > 0
          )
        )
    );
  }
  const chapterCount = (slug: string) =>
    getGradesForSubject(slug, lang)
      .filter((g) => level.grades.includes(g.grade))
      .reduce((n, g) => n + g.chapters.length, 0);

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
          { label: levelName },
        ]}
        title={t(lang, "subjects.hero.title")}
        lede={t(lang, "subjects.hero.lede.level", { level: levelName })}
      />
      <section className="subject-overview">
        {CATEGORY_ORDER.map((category) => {
          const slugs = byCategory.get(category) ?? [];
          if (slugs.length === 0) return null;
          return (
            <div key={category}>
              <div className="eyebrow" style={{ margin: "42px 0 16px" }}>
                {t(lang, `subject.category.${category.toLowerCase()}`)}
              </div>
              <div className="subjects-grid">
                {slugs.map((slug) => {
                  const subject = subjectsByCategory(category, lang).find((s) => s.slug === slug)!;
                  const n = chapterCount(slug);
                  return (
                    <Link
                      key={slug}
                      className="subject-card"
                      href={withLang(subjectPath(curriculum.id, level.id, slug), lang)}
                    >
                      <div className="subject-icon" aria-hidden="true">
                        {GLYPHS[slug] ?? slug.slice(0, 2).toUpperCase()}
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
            </div>
          );
        })}
      </section>
    </>
  );
}
