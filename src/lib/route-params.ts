/**
 * ROUTE PARAMS — shared generateStaticParams builders for the (en) page tree
 * and the [lang] mirror tree. They live here (not in page files) because
 * Next.js only allows specific exports in a page module.
 *
 * Structural routes (subjects, grades, chapters) are identical in every
 * language. Educational routes (lessons, resources, blog posts) list only
 * genuinely translated content per language — never fake translated pages.
 */
import { SUBJECT_SLUGS } from "./subjects";
import { GRADES, allGradeChapters, getGradeForChapter, gradeSlug } from "./grades";
import { getAllTopicParams, getContentChapters } from "./content";
import { getPostSlugs } from "./blog";
import type { Lang } from "./i18n";

/** Subject and category index pages (slugs are identical in every language). */
export function subjectParams(_lang: Lang) {
  const CATEGORY_SLUGS = ["stem", "humanities", "languages"];
  return [...SUBJECT_SLUGS, ...CATEGORY_SLUGS].map((subject) => ({ subject }));
}

/** Grade pages (structure is identical in every language). */
export function gradeParams(_lang: Lang) {
  const params: { subject: string; grade: string }[] = [];
  for (const subject of SUBJECT_SLUGS) {
    for (const grade of GRADES) {
      params.push({ subject, grade: gradeSlug(grade) });
    }
  }
  return params;
}

/** Chapter pages (structure falls back to English in every language). */
export function chapterParams(_lang: Lang) {
  return allGradeChapters().map(({ subject, grade, chapter }) => ({
    subject,
    grade: gradeSlug(grade),
    chapter,
  }));
}

/**
 * Lesson pages for one language — ONLY where a real translated .mdx file
 * exists. Missing translations are never generated as pages.
 */
export function topicParams(lang: Lang) {
  const params: { subject: string; grade: string; chapter: string; topic: string }[] = [];
  for (const p of getAllTopicParams(lang)) {
    const grade = getGradeForChapter(p.subject, p.chapter);
    if (!grade) continue;
    params.push({
      subject: p.subject,
      grade: gradeSlug(grade),
      chapter: p.chapter,
      topic: p.topic,
    });
  }
  return params;
}

/**
 * Chapter resource pages for one language — ONLY for chapters with
 * genuinely translated lessons.
 */
export function resourceParams(lang: Lang) {
  return getContentChapters(lang).map((c) => ({
    subject: c.subject,
    grade: gradeSlug(c.grade),
    chapter: c.chapter,
  }));
}

/**
 * Blog post pages for one language — ONLY where a real translated .mdx
 * file exists.
 */
export function postParams(lang: Lang) {
  return getPostSlugs(lang).map((slug) => ({ slug }));
}
