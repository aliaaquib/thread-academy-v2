/**
 * LEVEL OVERVIEW — the page at /cambridge/<level>
 * (e.g. /cambridge/lower-secondary), in every language.
 * Shows the level's subjects as cards linking to their grade pickers.
 * Levels with no content yet (Cambridge Primary, AS & A Level) show an
 * honest empty state — no fake subjects.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getGradesForSubject } from "@/lib/grades";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { levelParams } from "@/lib/route-params";
import {
  resolveCurriculumLevel,
  levelStringKey,
  curriculumPath,
  levelPath,
  subjectPath,
  CURRICULUM_NAMES,
} from "@/lib/curricula";

export function generateStaticParams() {
  return levelParams("en");
}

type Params = LangParam & { level: string };

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  if (!resolved) return {};
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  return pageMetadata({
    title: `${levelName} — ${CURRICULUM_NAMES[curriculum.id]}`,
    description: t(lang, "curriculum.level.meta.desc", {
      level: levelName,
      name: CURRICULUM_NAMES[curriculum.id],
    }),
    path: levelPath(curriculum.id, level.id),
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

export default async function LevelPage(props: { params: Promise<Params> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const resolved = resolveCurriculumLevel({ curriculum: "cambridge", level: params.level });
  if (!resolved) notFound();
  const { curriculum, level } = resolved;
  const levelName = t(lang, levelStringKey(level.id));
  const curriculumName = CURRICULUM_NAMES[curriculum.id];

  // Subjects with lessons in this level's grades — never fake entries.
  const subjects = SUBJECT_SLUGS.map((slug) => {
    const subject = getSubject(slug, lang);
    if (!subject) return null;
    const chapters = getGradesForSubject(slug, lang)
      .filter((g) => level.grades.includes(g.grade))
      .reduce((n, g) => n + g.chapters.length, 0);
    return chapters > 0 ? { subject, chapters } : null;
  }).filter((s) => s !== null);

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: curriculumName, href: withLang(curriculumPath(curriculum.id), lang) },
          { label: levelName },
        ]}
        title={levelName}
        lede={
          subjects.length > 0
            ? t(lang, "curriculum.level.lede.full", {
                level: levelName,
                grades:
                  level.grades.length > 0
                    ? `${level.grades[0]}–${level.grades[level.grades.length - 1]}`
                    : "",
              })
            : t(lang, "curriculum.level.empty", { level: levelName })
        }
      />
      <section className="subject-overview">
        {subjects.length > 0 ? (
          <>
            <div className="eyebrow" style={{ margin: "42px 0 16px" }}>
              {t(lang, "curriculum.level.subjects.title", { level: levelName })}
            </div>
            <div className="subjects-grid">
              {subjects.map(({ subject, chapters }) => (
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
                        {tn(lang, "common.chapters", chapters, { n: chapters })}
                      </div>
                    </div>
                    <span className="subject-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <p style={{ marginTop: 32 }}>
              <Link
                className="inline-link"
                href={withLang(levelPath(curriculum.id, level.id) + "/subjects", lang)}
              >
                {t(lang, "curriculum.level.browseAll")}
              </Link>
            </p>
          </>
        ) : (
          <p>
            <Link className="inline-link" href={withLang(curriculumPath(curriculum.id), lang)}>
              {t(lang, "curriculum.viewLevels")}
            </Link>
          </p>
        )}
      </section>
    </>
  );
}
