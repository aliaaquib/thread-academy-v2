import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getChapterTopics } from "./chapters";
import { SUBJECT_SLUGS } from "./subjects";
import { getChaptersForSubject } from "./stage-chapters";
import { getGradeForChapter, gradeSlug } from "./grades";
import type { TopicWithContent } from "./types";

/** Absolute path to the content/ directory (project root). */
export function contentRoot(): string {
  return path.join(process.cwd(), "content");
}

export interface TopicParams {
  subject: string;
  chapter: string;
  topic: string;
}

/**
 * Lesson files live once per chapter at
 * content/subject/<subject>/grade-<n>/<chapter>/<topic>.mdx.
 */
function chapterDir(p: Omit<TopicParams, "topic">): string | null {
  const grade = getGradeForChapter(p.subject, p.chapter);
  if (!grade) return null;
  return path.join(contentRoot(), "subject", p.subject, gradeSlug(grade), p.chapter);
}

function topicFile(p: TopicParams): string | null {
  const dir = chapterDir(p);
  return dir ? path.join(dir, `${p.topic}.mdx`) : null;
}

export function topicExists(p: TopicParams): boolean {
  const file = topicFile(p);
  return !!file && fs.existsSync(file);
}

export interface TopicContent {
  title: string;
  lede: string;
  source: string;
}

/** Read + parse an MDX topic file (frontmatter: title, lede). */
export function getTopicContent(p: TopicParams): TopicContent | null {
  const file = topicFile(p);
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
export function existingTopicSlugs(p: Omit<TopicParams, "topic">): string[] {
  const dir = chapterDir(p);
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
export function getAvailableTopics(p: Omit<TopicParams, "topic">): TopicWithContent[] {
  const existing = new Set(existingTopicSlugs(p));
  const grade = getGradeForChapter(p.subject, p.chapter);
  const chapterBase = grade
    ? `/subjects/${p.subject}/${gradeSlug(grade)}/${p.chapter}`
    : `/subjects/${p.subject}/${p.chapter}`;
  return getChapterTopics(p.chapter)
    .filter((t) => existing.has(t.slug))
    .map((t) => ({
      ...t,
      url: `${chapterBase}/${t.slug}`,
    }));
}

/** Every (subject, chapter) chapter page on the site. */
export function allSubjectChapters(): Omit<TopicParams, "topic">[] {
  const combos: Omit<TopicParams, "topic">[] = [];
  for (const subject of SUBJECT_SLUGS) {
    for (const chapter of getChaptersForSubject(subject)) {
      combos.push({ subject, chapter: chapter.id });
    }
  }
  return combos;
}

/** Every topic that has an MDX file — for generateStaticParams. */
export function getAllTopicParams(): TopicParams[] {
  const out: TopicParams[] = [];
  const subjectRoot = path.join(contentRoot(), "subject");
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

export interface SubjectChapter {
  subject: string;
  chapter: string;
  /** Grade the chapter belongs to (each chapter lives in exactly one grade). */
  grade: number;
  topicCount: number;
}

/** Every (subject, chapter) with at least one MDX topic. */
export function getContentChapters(): SubjectChapter[] {
  const seen = new Map<string, SubjectChapter>();
  for (const p of getAllTopicParams()) {
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
