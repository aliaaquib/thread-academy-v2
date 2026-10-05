/**
 * GRADE PICKER — the page at /subjects/<subject> (e.g. /subjects/mathematics),
 * in every language (/tr/subjects/…, /ru/subjects/…, /ky/subjects/…).
 * Shows grades 7-12 as cards; each card previews its chapters.
 * This file ALSO serves /subjects/stem, /subjects/humanities and
 * /subjects/languages (the category pages) — see CategoryView below.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { SUBJECT_SLUGS, getSubject, CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { getChaptersForSubject } from "@/lib/stage-chapters";
import { getGradesForSubject, gradeSlug } from "@/lib/grades";
import { JsonLd, courseJsonLd, pageMetadata } from "@/lib/seo";
import type { SubjectCategory } from "@/lib/types";
import { LANGS, langMeta, withLang, type Lang } from "@/lib/i18n";
import { t, tn } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { subjectParams } from "@/lib/route-params";

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
  russian: "Ж",
};

const CATEGORY_SLUGS = ["stem", "humanities", "languages"];

function categoryFromSlug(slug: string): SubjectCategory | null {
  const upper = slug.toUpperCase();
  return (CATEGORY_ORDER as string[]).includes(upper) ? (upper as SubjectCategory) : null;
}

/** Tells the site builder which pages to create ahead of time — every
 *  subject and category page in every language. */
export function generateStaticParams() {
  return subjectParams("en");
}

type Params = LangParam & { subject: string };

/** The title + description Google and link previews show for this page. */
export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  const category = categoryFromSlug(params.subject);
  if (category) {
    const names = subjectsByCategory(category, lang).map((s) => s.name).join(", ");
    return pageMetadata({
      title: t(lang, "subject.category.meta.title", { category: t(lang, `subject.category.${params.subject}`) }),
      description: t(lang, "subject.category.meta.desc", {
        category: t(lang, `subject.category.${params.subject}`),
        names,
      }),
      path: `/subjects/${params.subject}`,
      lang,
    });
  }
  const subject = getSubject(params.subject, lang);
  if (!subject) return {};
  return pageMetadata({
    title: t(lang, "subject.meta.title", { name: subject.name }),
    description: t(lang, "subject.meta.desc", { name: subject.name }),
    path: `/subjects/${subject.slug}`,
    lang,
  });
}

function CategoryView({
  lang,
  category,
  slug,
}: {
  lang: Lang;
  category: SubjectCategory;
  slug: string;
}) {
  const displayName = t(lang, `subject.category.${slug}`);
  const subjects = subjectsByCategory(category, lang);
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "subjects.meta.title"), href: withLang("/subjects", lang) },
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
            const n = getChaptersForSubject(subject.slug, lang).length;
            return (
              <Link
                key={subject.slug}
                className="subject-card"
                href={withLang(`/subjects/${subject.slug}`, lang)}
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
  const category = categoryFromSlug(params.subject);
  if (category) {
    return <CategoryView lang={lang} category={category} slug={params.subject} />;
  }
  const subject = getSubject(params.subject, lang);
  if (!subject) notFound();

  const grades = getGradesForSubject(subject.slug, lang);

  return (
    <>
      <JsonLd
        data={courseJsonLd({
          name: t(lang, "subject.course.name", { name: subject.name }),
          description: subject.intro,
          path: withLang(`/subjects/${subject.slug}`, lang),
          inLanguage: langMeta(lang).locale,
        })}
      />
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "subjects.meta.title"), href: withLang("/subjects", lang) },
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
                  href={withLang(`/subjects/${subject.slug}/${gradeSlug(grade)}`, lang)}
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
