/**
 * CAMBRIDGE LANDING — the page at /cambridge (and /tr/cambridge, …).
 * The four Cambridge Pathway levels. Levels with lessons link to their
 * overview; levels without content yet (Primary, AS & A Level) show an
 * honest "coming soon" state — no fake subjects.
 * Also lists the other curricula (British, American, IB) as coming soon.
 */
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CurriculumCard from "@/components/CurriculumCard";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import {
  CURRICULUM_IDS,
  getCurriculum,
  levelStringKey,
  curriculumPath,
  levelPath,
  CURRICULUM_NAMES,
  type CurriculumId,
} from "@/lib/curricula";

export async function generateMetadata(props: { params: Promise<LangParam> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "curriculum.landing.title", { name: "Cambridge" }),
    description: t(lang, "curriculum.landing.desc", { name: "Cambridge" }),
    path: curriculumPath("cambridge"),
    lang,
  });
}

export default async function CambridgePage(props: { params: Promise<LangParam> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const curriculum = getCurriculum("cambridge")!;

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "curricula.title") },
          { label: "Cambridge" },
        ]}
        title={t(lang, "curriculum.landing.title", { name: "Cambridge" })}
        lede={t(lang, "curriculum.landing.lede", { name: "Cambridge" })}
      />
      <section className="subject-overview">
        <div className="eyebrow" style={{ margin: "42px 0 16px" }}>
          {t(lang, "curriculum.levels.title")}
        </div>
        <div className="subjects-grid">
          {curriculum.levels.map((level) => {
            const levelName = t(lang, levelStringKey(level.id));
            const hasContent = level.grades.length > 0;
            const gradesLabel =
              level.grades.length > 0
                ? t(lang, "curriculum.level.grades", {
                    grades: `${level.grades[0]}–${level.grades[level.grades.length - 1]}`,
                  })
                : t(lang, "curriculum.comingSoon");
            return (
              <CurriculumCard
                key={level.id}
                lang={lang}
                href={withLang(levelPath(curriculum.id, level.id), lang)}
                badge={gradesLabel}
                title={levelName}
                lede={
                  hasContent
                    ? t(lang, "curriculum.level.lede", { level: levelName })
                    : t(lang, "curriculum.level.empty.short")
                }
                disabled={!hasContent}
              />
            );
          })}
        </div>

        <div className="eyebrow" style={{ margin: "56px 0 16px" }}>
          {t(lang, "curricula.other.title")}
        </div>
        <div className="subjects-grid">
          {(CURRICULUM_IDS as CurriculumId[])
            .filter((id) => id !== "cambridge")
            .map((id) => {
              const c = getCurriculum(id)!;
              const active = c.status === "active";
              return (
                <CurriculumCard
                  key={id}
                  lang={lang}
                  href={withLang(curriculumPath(id), lang)}
                  badge={active ? t(lang, "curriculum.levels.title") : t(lang, "curriculum.comingSoon")}
                  title={CURRICULUM_NAMES[id]}
                  lede={t(lang, "curriculum.comingSoon.short", { name: CURRICULUM_NAMES[id] })}
                  disabled={!active}
                />
              );
            })}
        </div>
      </section>
    </>
  );
}
