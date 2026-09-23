import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getChapterTopics } from "./chapters";
import { CURRICULUM_SLUGS, allLevelSlugs, resolveLevel } from "./curriculum";
import { SUBJECT_SLUGS } from "./subjects";
import { getChaptersFor } from "./stage-chapters";
import type { TopicWithContent } from "./types";

/** Absolute path to the content/ directory (project root). */
export function contentRoot(): string {
  return path.join(process.cwd(), "content");
}

export interface TopicParams {
  curriculum: string;
  level: string;
  subject: string;
  chapter: string;
  topic: string;
}

function topicFile(p: TopicParams): string {
  return path.join(contentRoot(), p.curriculum, p.level, p.subject, p.chapter, `${p.topic}.mdx`);
}

/**
 * Shared lesson files live once per chapter at
 * content/chapters/<subject>/<chapter>/<topic>.mdx and serve every
 * (curriculum, level) combination that uses the chapter. A
 * curriculum-specific file above always wins when both exist.
 */
function sharedTopicFile(subject: string, chapter: string, topic: string): string {
  return path.join(contentRoot(), "chapters", subject, chapter, `${topic}.mdx`);
}

/** Resolved MDX file for a topic: combo-specific first, shared fallback second. */
function resolvedTopicFile(p: TopicParams): string | null {
  const combo = topicFile(p);
  if (fs.existsSync(combo)) return combo;
  const shared = sharedTopicFile(p.subject, p.chapter, p.topic);
  if (fs.existsSync(shared)) return shared;
  return null;
}

export function topicExists(p: TopicParams): boolean {
  return resolvedTopicFile(p) !== null;
}

export interface TopicContent {
  title: string;
  lede: string;
  source: string;
}

/** Read + parse an MDX topic file (frontmatter: title, lede). */
export function getTopicContent(p: TopicParams): TopicContent | null {
  const file = resolvedTopicFile(p);
  if (!file) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    title: typeof data.title === "string" ? data.title : p.topic,
    lede: typeof data.lede === "string" ? data.lede : "",
    source: content,
  };
}

/** Slugs of topics that actually have MDX files for this chapter (combo-specific or shared). */
export function existingTopicSlugs(p: Omit<TopicParams, "topic">): string[] {
  const found = new Set<string>();
  const comboDir = path.join(contentRoot(), p.curriculum, p.level, p.subject, p.chapter);
  if (fs.existsSync(comboDir)) {
    for (const f of fs.readdirSync(comboDir)) {
      if (f.endsWith(".mdx")) found.add(f.replace(/\.mdx$/, ""));
    }
  }
  const sharedDir = path.join(contentRoot(), "chapters", p.subject, p.chapter);
  if (fs.existsSync(sharedDir)) {
    for (const f of fs.readdirSync(sharedDir)) {
      if (f.endsWith(".mdx")) found.add(f.replace(/\.mdx$/, ""));
    }
  }
  return [...found].sort();
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
      url: `/subjects/${p.subject}/${p.curriculum}/${p.level}/${p.chapter}/${t.slug}`,
    }));
}

/** Every (curriculum, level, subject, chapter) chapter page on the site. */
export function allChapterCombos(): Omit<TopicParams, "topic">[] {
  const combos: Omit<TopicParams, "topic">[] = [];
  for (const curriculum of CURRICULUM_SLUGS) {
    for (const { slug: level } of allLevelSlugs(curriculum)) {
      const resolved = resolveLevel(curriculum, level);
      if (!resolved) continue;
      for (const subject of SUBJECT_SLUGS) {
        if (!resolved.subjects.includes(subject)) continue;
        for (const chapter of getChaptersFor(subject, curriculum, level)) {
          combos.push({ curriculum, level, subject, chapter: chapter.id });
        }
      }
    }
  }
  return combos;
}

/** Every topic that has an MDX file — for generateStaticParams. */
export function getAllTopicParams(): TopicParams[] {
  const out: TopicParams[] = [];
  const seen = new Set<string>();
  const push = (p: TopicParams) => {
    const key = `${p.curriculum}/${p.level}/${p.subject}/${p.chapter}/${p.topic}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(p);
  };

  // 1. Curriculum-specific lesson files (content/<curriculum>/<level>/...).
  const root = contentRoot();
  if (fs.existsSync(root)) {
    for (const curriculum of fs.readdirSync(root)) {
      if (curriculum === "chapters") continue;
      const cDir = path.join(root, curriculum);
      if (!fs.statSync(cDir).isDirectory()) continue;
      for (const level of fs.readdirSync(cDir)) {
        const lDir = path.join(cDir, level);
        if (!fs.statSync(lDir).isDirectory()) continue;
        for (const subject of fs.readdirSync(lDir)) {
          const sDir = path.join(lDir, subject);
          if (!fs.statSync(sDir).isDirectory()) continue;
          for (const chapter of fs.readdirSync(sDir)) {
            const chDir = path.join(sDir, chapter);
            if (!fs.statSync(chDir).isDirectory()) continue;
            for (const file of fs.readdirSync(chDir)) {
              if (!file.endsWith(".mdx")) continue;
              push({ curriculum, level, subject, chapter, topic: file.replace(/\.mdx$/, "") });
            }
          }
        }
      }
    }
  }

  // 2. Shared chapter lessons (content/chapters/<subject>/<chapter>/),
  //    expanded across every chapter page that uses the chapter.
  const sharedRoot = path.join(root, "chapters");
  if (fs.existsSync(sharedRoot)) {
    for (const combo of allChapterCombos()) {
      for (const t of getChapterTopics(combo.chapter)) {
        if (fs.existsSync(sharedTopicFile(combo.subject, combo.chapter, t.slug))) {
          push({ ...combo, topic: t.slug });
        }
      }
    }
  }
  return out;
}

export interface ChapterCombo {
  curriculum: string;
  level: string;
  subject: string;
  chapter: string;
  topicCount: number;
}

/** Every (curriculum, level, subject, chapter) with at least one MDX topic. */
export function getContentChapters(): ChapterCombo[] {
  const seen = new Map<string, ChapterCombo>();
  for (const p of getAllTopicParams()) {
    const key = `${p.curriculum}/${p.level}/${p.subject}/${p.chapter}`;
    const entry = seen.get(key);
    if (entry) entry.topicCount += 1;
    else seen.set(key, { curriculum: p.curriculum, level: p.level, subject: p.subject, chapter: p.chapter, topicCount: 1 });
  }
  return [...seen.values()].sort((a, b) =>
    `${a.subject}${a.curriculum}${a.level}${a.chapter}`.localeCompare(`${b.subject}${b.curriculum}${b.level}${b.chapter}`),
  );
}
