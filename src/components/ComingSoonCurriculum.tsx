/**
 * COMING-SOON CURRICULUM PAGE — honest holding page for curricula that
 * aren't live yet (British, American, IB). No fake subjects, chapters or
 * mappings — just the curriculum name, a coming-soon note, and a link to
 * the live Cambridge curriculum.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { getCurriculum, curriculumPath, CURRICULUM_NAMES, type CurriculumId } from "@/lib/curricula";

export function comingSoonMetadata(id: CurriculumId, lang: Lang): Metadata {
  const name = CURRICULUM_NAMES[id];
  return pageMetadata({
    title: `${name} — ${t(lang, "curriculum.comingSoon")}`,
    description: t(lang, "curriculum.comingSoon.lede", { name }),
    path: curriculumPath(id),
    lang,
  });
}

export default function ComingSoonCurriculum({
  id,
  lang,
}: {
  id: CurriculumId;
  lang: Lang;
}) {
  const curriculum = getCurriculum(id);
  if (!curriculum) notFound();
  const name = CURRICULUM_NAMES[id];

  // If this curriculum ever goes active, its real landing takes over —
  // this holding page only renders while coming-soon.
  if (curriculum.status === "active") notFound();

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "curricula.title") },
          { label: name },
        ]}
        title={`${name} — ${t(lang, "curriculum.comingSoon")}`}
        lede={t(lang, "curriculum.comingSoon.lede", { name })}
      />
      <section className="subject-overview">
        <p>
          <Link className="inline-link" href={withLang(curriculumPath("cambridge"), lang)}>
            {t(lang, "curriculum.exploreCambridge")}
          </Link>
        </p>
      </section>
    </>
  );
}

// Re-exported for the [lang] mirrors' generateMetadata wrappers.
export async function generateComingSoonMetadata(
  id: CurriculumId,
  props: { params: Promise<LangParam> }
): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return comingSoonMetadata(id, lang);
}
