/**
 * CURRICULA INDEX — the page at /curricula (and /tr/curricula, …).
 * All four curricula as cards. Cambridge is active and links to /cambridge;
 * British, American and IB are honest coming-soon cards linking to their
 * holding pages. Students pick a curriculum here and start learning.
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

export async function generateMetadata(props: { params: Promise<LangParam> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "curricula.title"),
    description: t(lang, "curricula.hero.lede"),
    path: "/curricula",
    lang,
  });
}

export default async function CurriculaPage(props: { params: Promise<LangParam> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "curricula.title") },
        ]}
        title={t(lang, "curricula.title")}
        lede={t(lang, "curricula.hero.lede")}
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
                href={withLang(curriculumPath(id), lang)}
                badge={active ? t(lang, "curriculum.levels.title") : t(lang, "curriculum.comingSoon")}
                title={name}
                lede={
                  active
                    ? t(lang, "curriculum.landing.lede", { name })
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
