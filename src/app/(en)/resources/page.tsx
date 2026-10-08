/**
 * RESOURCES INDEX — the page at /resources (and /tr/resources, …).
 * Students pick a curriculum first, then a subject, then a grade —
 * and see only that grade's resources.
 * Cambridge is active (→ /cambridge/resources); British, American and IB
 * are honest coming-soon cards.
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
  curriculumPath,
  CURRICULUM_NAMES,
  type CurriculumId,
} from "@/lib/curricula";

/** Cambridge resources live under /cambridge/resources (subject → grade flow). */
function curriculumResourcesPath(id: CurriculumId): string {
  if (id === "cambridge") return "/cambridge/resources";
  return curriculumPath(id);
}

export async function generateMetadata(props: { params: Promise<LangParam> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "resources.meta.title"),
    description: t(lang, "resources.curricula.lede"),
    path: "/resources",
    lang,
  });
}

export default async function ResourcesIndexPage(props: { params: Promise<LangParam> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "nav.resources") },
        ]}
        title={t(lang, "resources.meta.title")}
        lede={t(lang, "resources.curricula.lede")}
      />
      <section className="subject-overview">
        <div className="subjects-grid">
          {(CURRICULUM_IDS as CurriculumId[]).map((id) => {
            const c = getCurriculum(id)!;
            const active = c.status === "active";
            const name = CURRICULUM_NAMES[id];
            return (
              <CurriculumCard
                key={id}
                lang={lang}
                href={withLang(curriculumResourcesPath(id), lang)}
                badge={active ? t(lang, "curriculum.levels.title") : t(lang, "curriculum.comingSoon")}
                title={name}
                lede={
                  active
                    ? t(lang, "resources.curricula.lede")
                    : t(lang, "curriculum.comingSoon.short", { name })
                }
                disabled={!active}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
