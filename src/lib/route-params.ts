/**
 * ROUTE PARAMS — shared generateStaticParams builders for the (en) page tree
 * and the [lang] mirror tree. They live here (not in page files) because
 * Next.js only allows specific exports in a page module.
 *
 * Curriculum content lives under /[curriculum]/[level]/… — every builder
 * includes the curriculum + level params. Only active curricula generate
 * pages; coming-soon curricula generate nothing (no fake pages).
 *
 * Structural routes (subjects, grades, chapters) are identical in every
 * language. Educational routes (lessons, resources, blog posts) list only
 * genuinely translated content per language — never fake translated pages.
 */
import { SUBJECT_SLUGS } from "./subjects";
import { GRADES, allGradeChapters, getGradeForChapter, gradeSlug } from "./grades";
import { getAllTopicParams, getContentChapters } from "./content";
import { getPostSlugs } from "./blog";
import { activeCurricula } from "./curricula";
import type { Lang } from "./i18n";

/** Level pages — every Cambridge level (page implementations are curriculum-agnostic). */
export function levelParams(_lang: Lang) {
  const params: { level: string }[] = [];
  for (const c of activeCurricula()) {
    for (const level of c.levels) {
      params.push({ level: level.id });
    }
  }
  return params;
}

/** Subject and category index pages, per curriculum level. */
export function subjectParams(_lang: Lang) {
  const CATEGORY_SLUGS = ["stem", "humanities", "languages"];
  const params: { level: string; subject: string }[] = [];
  for (const c of activeCurricula()) {
    for (const level of c.levels) {
      for (const subject of [...SUBJECT_SLUGS, ...CATEGORY_SLUGS]) {
        params.push({ level: level.id, subject });
      }
    }
  }
  return params;
}

/** Grade pages — only grades that belong to the level. */
export function gradeParams(_lang: Lang) {
  const params: { level: string; subject: string; grade: string }[] = [];
  for (const c of activeCurricula()) {
    for (const level of c.levels) {
      for (const subject of SUBJECT_SLUGS) {
        for (const grade of GRADES) {
          if (!level.grades.includes(grade)) continue;
          params.push({ level: level.id, subject, grade: gradeSlug(grade) });
        }
      }
    }
  }
  return params;
}

/** Chapter pages — the chapter's grade determines its level. */
export function chapterParams(_lang: Lang) {
  const params: { level: string; subject: string; grade: string; chapter: string }[] = [];
  for (const c of activeCurricula()) {
    for (const { subject, grade, chapter } of allGradeChapters()) {
      const level = c.levels.find((l) => l.grades.includes(grade));
      if (!level) continue;
      params.push({ level: level.id, subject, grade: gradeSlug(grade), chapter });
    }
  }
  return params;
}

/**
 * Lesson pages for one language — ONLY where a real translated .mdx file
 * exists. Missing translations are never generated as pages.
 */
export function topicParams(lang: Lang) {
  const params: {
    level: string;
    subject: string;
    grade: string;
    chapter: string;
    topic: string;
  }[] = [];
  for (const c of activeCurricula()) {
    for (const p of getAllTopicParams(lang)) {
      const grade = getGradeForChapter(p.subject, p.chapter);
      if (!grade) continue;
      const level = c.levels.find((l) => l.grades.includes(grade));
      if (!level) continue;
      params.push({
        level: level.id,
        subject: p.subject,
        grade: gradeSlug(grade),
        chapter: p.chapter,
        topic: p.topic,
      });
    }
  }
  return params;
}

/**
 * Chapter resource pages for one language — ONLY for chapters with
 * genuinely translated lessons.
 */
export function resourceParams(lang: Lang) {
  const params: {
    level: string;
    subject: string;
    grade: string;
    chapter: string;
  }[] = [];
  for (const c of activeCurricula()) {
    for (const ch of getContentChapters(lang)) {
      const level = c.levels.find((l) => l.grades.includes(ch.grade));
      if (!level) continue;
      params.push({
        level: level.id,
        subject: ch.subject,
        grade: gradeSlug(ch.grade),
        chapter: ch.chapter,
      });
    }
  }
  return params;
}

/**
 * Blog post pages for one language — ONLY where a real translated .mdx
 * file exists.
 */
export function postParams(lang: Lang) {
  return getPostSlugs(lang).map((slug) => ({ slug }));
}
