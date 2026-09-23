import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getChapterTopics } from "./chapters";
import { SUBJECT_SLUGS } from "./subjects";
import { getChaptersForSubject } from "./stage-chapters";
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
 * content/chapters/<subject>/<chapter>/<topic>.mdx.
 */
function topicFile(p: TopicParams): string {
  return path.join(contentRoot(), "chapters", p.subject, p.chapter, `${p.topic}.mdx`);
}

export function topicExists(p: TopicParams): boolean {
  return fs.existsSync(topicFile(p));
}

export interface TopicContent {
  title: string;
  lede: string;
  source: string;
}

/** Read + parse an MDX topic file (frontmatter: title, lede). */
export function getTopicContent(p: TopicParams): TopicContent | null {
  const file = topicFile(p);
  if (!fs.existsSync(file)) return null;
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
  const dir = path.join(contentRoot(), "chapters", p.subject, p.chapter);
  if (!fs.existsSync(dir)) return [];
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
  return getChapterTopics(p.chapter)
    .filter((t) => existing.has(t.slug))
    .map((t) => ({
      ...t,
      url: `/subjects/${p.subject}/${p.chapter}/${t.slug}`,
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
  const sharedRoot = path.join(contentRoot(), "chapters");
  if (!fs.existsSync(sharedRoot)) return out;
  for (const subject of fs.readdirSync(sharedRoot)) {
    const sDir = path.join(sharedRoot, subject);
    if (!fs.statSync(sDir).isDirectory()) continue;
    for (const chapter of fs.readdirSync(sDir)) {
      const chDir = path.join(sDir, chapter);
      if (!fs.statSync(chDir).isDirectory()) continue;
      for (const file of fs.readdirSync(chDir)) {
        if (!file.endsWith(".mdx")) continue;
        out.push({ subject, chapter, topic: file.replace(/\.mdx$/, "") });
      }
    }
  }
  return out;
}

export interface SubjectChapter {
  subject: string;
  chapter: string;
  topicCount: number;
}

/** Every (subject, chapter) with at least one MDX topic. */
export function getContentChapters(): SubjectChapter[] {
  const seen = new Map<string, SubjectChapter>();
  for (const p of getAllTopicParams()) {
    const key = `${p.subject}/${p.chapter}`;
    const entry = seen.get(key);
    if (entry) entry.topicCount += 1;
    else seen.set(key, { subject: p.subject, chapter: p.chapter, topicCount: 1 });
  }
  return [...seen.values()].sort((a, b) =>
    `${a.subject}${a.chapter}`.localeCompare(`${b.subject}${b.chapter}`),
  );
}
