/**
 * READS THE LESSON FILES from the content/ folder.
 *
 * Lessons live at: content/subject/<subject>/grade-<n>/<chapter>/<topic>.mdx
 * Translated lessons live at: content/<lang>/subject/<subject>/grade-<n>/<chapter>/<topic>.mdx
 * (lang = "tr" | "ru" | "ky"). English keeps the original unprefixed paths.
 * This file finds and reads them. You never edit this file to change content —
 * just add or edit the .mdx files and rebuild the site.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getChapterTopics } from "./chapters";
import { SUBJECT_SLUGS } from "./subjects";
import { getChaptersForSubject } from "./stage-chapters";
import { getGradeForChapter, gradeSlug } from "./grades";
import type { Lang } from "./i18n";
import { withLang } from "./i18n";
import type { TopicWithContent } from "./types";

/**
 * Absolute path to the content/ directory (project root).
 * Each non-English language has its own parallel tree: content/<lang>/.
 */
export function contentRoot(lang: Lang = "en"): string {
  return lang === "en"
    ? path.join(process.cwd(), "content")
    : path.join(process.cwd(), "content", lang);
}

export interface TopicParams {
  subject: string;
  chapter: string;
  topic: string;
}

/**
 * Lesson files live once per chapter at
 * content/subject/<subject>/grade-<n>/<chapter>/<topic>.mdx
 * (or content/<lang>/subject/... for translated lessons).
 */
function chapterDir(p: Omit<TopicParams, "topic">, lang: Lang = "en"): string | null {
  const grade = getGradeForChapter(p.subject, p.chapter);
  if (!grade) return null;
  return path.join(contentRoot(lang), "subject", p.subject, gradeSlug(grade), p.chapter);
}

function topicFile(p: TopicParams, lang: Lang = "en"): string | null {
  const dir = chapterDir(p, lang);
  return dir ? path.join(dir, `${p.topic}.mdx`) : null;
}

export function topicExists(p: TopicParams, lang: Lang = "en"): boolean {
  const file = topicFile(p, lang);
  return !!file && fs.existsSync(file);
}

/**
 * Last-modified time of a topic's .mdx file (used as the sitemap lastmod).
 * Falls back to build time when the file is missing.
 */
export function topicFileMtime(p: TopicParams, lang: Lang = "en"): Date {
  try {
    const file = topicFile(p, lang);
    if (file) return fs.statSync(file).mtime;
  } catch {
    /* fall through to the default below */
  }
  return new Date();
}

export interface TopicContent {
  title: string;
  lede: string;
  source: string;
}

/** Read + parse an MDX topic file (frontmatter: title, lede). */
export function getTopicContent(p: TopicParams, lang: Lang = "en"): TopicContent | null {
  const file = topicFile(p, lang);
  if (!file || !fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    title: typeof data.title === "string" ? data.title : p.topic,
    lede: typeof data.lede === "string" ? data.lede : "",
    source: content,
  };
}

/** Slugs of topics that actually have MDX files for this chapter. */
export function existingTopicSlugs(p: Omit<TopicParams, "topic">, lang: Lang = "en"): string[] {
  const dir = chapterDir(p, lang);
  if (!dir || !fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .sort();
}

/**
 * Canonical topic metadata (from chapters.ts) filtered to topics that
 * actually have MDX content — so sidebars and lists never link to dead ends.
 */
export function getAvailableTopics(p: Omit<TopicParams, "topic">, lang: Lang = "en"): TopicWithContent[] {
  const existing = new Set(existingTopicSlugs(p, lang));
  const grade = getGradeForChapter(p.subject, p.chapter);
  const chapterBase = grade
    ? `/subjects/${p.subject}/${gradeSlug(grade)}/${p.chapter}`
    : `/subjects/${p.subject}/${p.chapter}`;
  return getChapterTopics(p.subject, p.chapter, lang)
    .filter((t) => existing.has(t.slug))
    .map((t) => ({
      ...t,
      url: withLang(`${chapterBase}/${t.slug}`, lang),
    }));
}

/** Every (subject, chapter) chapter page on the site. */
export function allSubjectChapters(lang: Lang = "en"): Omit<TopicParams, "topic">[] {
  const combos: Omit<TopicParams, "topic">[] = [];
  for (const subject of SUBJECT_SLUGS) {
    for (const chapter of getChaptersForSubject(subject, lang)) {
      combos.push({ subject, chapter: chapter.id });
    }
  }
  return combos;
}

/** Every topic that has an MDX file — for generateStaticParams. */
export function getAllTopicParams(lang: Lang = "en"): TopicParams[] {
  const out: TopicParams[] = [];
  const subjectRoot = path.join(contentRoot(lang), "subject");
  if (!fs.existsSync(subjectRoot)) return out;
  for (const subject of fs.readdirSync(subjectRoot)) {
    const sDir = path.join(subjectRoot, subject);
    if (!fs.statSync(sDir).isDirectory()) continue;
    for (const gradeDir of fs.readdirSync(sDir)) {
      const gDir = path.join(sDir, gradeDir);
      if (!fs.statSync(gDir).isDirectory()) continue;
      for (const chapter of fs.readdirSync(gDir)) {
        const chDir = path.join(gDir, chapter);
        if (!fs.statSync(chDir).isDirectory()) continue;
        for (const file of fs.readdirSync(chDir)) {
          if (!file.endsWith(".mdx")) continue;
          out.push({ subject, chapter, topic: file.replace(/\.mdx$/, "") });
        }
      }
    }
  }
  return out;
}

/**
 * The languages in which a lesson genuinely exists (has a translated file).
 * Used for hreflang alternates — never claims a translation that isn't there.
 */
export function topicLangs(subject: string, chapter: string, topic: string): Lang[] {
  const langs: Lang[] = ["en", "tr", "ru", "ky"];
  return langs.filter((l) =>
    getAllTopicParams(l).some(
      (p) => p.subject === subject && p.chapter === chapter && p.topic === topic
    )
  );
}

export interface SubjectChapter {
  subject: string;
  chapter: string;
  /** Grade the chapter belongs to (each chapter lives in exactly one grade). */
  grade: number;
  topicCount: number;
}

/** Every (subject, chapter) with at least one MDX topic. */
export function getContentChapters(lang: Lang = "en"): SubjectChapter[] {
  const seen = new Map<string, SubjectChapter>();
  for (const p of getAllTopicParams(lang)) {
    const key = `${p.subject}/${p.chapter}`;
    const entry = seen.get(key);
    if (entry) entry.topicCount += 1;
    else {
      const grade = getGradeForChapter(p.subject, p.chapter);
      if (!grade) continue;
      seen.set(key, { subject: p.subject, chapter: p.chapter, grade, topicCount: 1 });
    }
  }
  return [...seen.values()].sort((a, b) =>
    `${a.subject}${a.chapter}`.localeCompare(`${b.subject}${b.chapter}`),
  );
}
