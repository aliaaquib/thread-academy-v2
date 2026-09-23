import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { contentRoot } from "./content";
import { getChapterFor } from "./stage-chapters";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  subject: string;
  subjectSlug: string;
  curriculum: string;
  /** Level slug, e.g. "igcse". */
  level: string;
  levelName: string;
  author: string;
  keywords: string[];
  /** Chapter ids in (subjectSlug, curriculum, level). */
  chapters: string[];
  /** "chapterId/topicId" pairs pointing at real lesson pages. */
  lessons: string[];
}

export interface BlogPost extends BlogPostMeta {
  /** MDX body (frontmatter stripped). */
  source: string;
}

function blogDir(): string {
  return path.join(contentRoot(), "blog");
}

function readPost(file: string): BlogPost | null {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const slug = String(data.slug ?? path.basename(file, ".mdx"));
  if (!data.title || !data.description || !data.date) return null;
  const str = (v: unknown, fallback = ""): string =>
    typeof v === "string" ? v : fallback;
  const dateStr = (v: unknown): string => {
    if (typeof v === "string") return v;
    // YAML parses unquoted 2026-09-22 into a Date.
    if (v instanceof Date && !Number.isNaN(v.getTime())) return v.toISOString().slice(0, 10);
    return "";
  };
  const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);
  return {
    slug,
    title: str(data.title, slug),
    description: str(data.description),
    date: dateStr(data.date),
    subject: str(data.subject),
    subjectSlug: str(data.subject_slug),
    curriculum: str(data.curriculum),
    level: str(data.level),
    levelName: str(data.level_name),
    author: str(data.author, "Thread Academy"),
    keywords: arr(data.keywords),
    chapters: arr(data.chapters),
    lessons: arr(data.lessons),
    source: content,
  };
}

/** All blog posts, newest first. */
export function getAllPosts(): BlogPostMeta[] {
  const dir = blogDir();
  if (!fs.existsSync(dir)) return [];
  const posts: BlogPostMeta[] = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".mdx")) continue;
    const post = readPost(path.join(dir, f));
    if (post) {
      const { source, ...meta } = post;
      void source;
      posts.push(meta);
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** All blog slugs — for generateStaticParams. */
export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** Full post (meta + MDX source) for a slug. */
export function getPost(slug: string): BlogPost | null {
  const file = path.join(blogDir(), `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return readPost(file);
}

/** Posts grouped by subject, preserving newest-first order within groups. */
export function getPostsBySubject(): { subject: string; subjectSlug: string; posts: BlogPostMeta[] }[] {
  const groups = new Map<string, { subject: string; subjectSlug: string; posts: BlogPostMeta[] }>();
  for (const post of getAllPosts()) {
    const key = post.subjectSlug || post.subject;
    const entry = groups.get(key);
    if (entry) entry.posts.push(post);
    else groups.set(key, { subject: post.subject, subjectSlug: post.subjectSlug, posts: [post] });
  }
  return [...groups.values()];
}

/** Lesson (topic) page title from its MDX frontmatter. */
function lessonTitle(subjectSlug: string, chapterId: string, topicId: string): string {
  const file = path.join(contentRoot(), "chapters", subjectSlug, chapterId, `${topicId}.mdx`);
  if (fs.existsSync(file)) {
    const { data } = matter(fs.readFileSync(file, "utf8"));
    if (typeof data.title === "string" && data.title) return data.title;
  }
  return topicId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export interface RelatedLink {
  title: string;
  href: string;
}

/**
 * Related links for a blog post: deep lesson links first, then their
 * chapter pages, then the subject page. Every href is derived from the
 * site's real chapter data, so links never 404.
 */
export function getRelatedLinks(post: BlogPostMeta): RelatedLink[] {
  const links: RelatedLink[] = [];
  const base = `/subjects/${post.subjectSlug}/${post.curriculum}/${post.level}`;
  const coveredChapters = new Set<string>();

  for (const pair of post.lessons) {
    const [chapterId, topicId] = pair.split("/");
    if (!chapterId || !topicId) continue;
    const chapter = getChapterFor(post.subjectSlug, post.curriculum, post.level, chapterId);
    if (!chapter) continue;
    coveredChapters.add(chapterId);
    links.push({
      title: lessonTitle(post.subjectSlug, chapterId, topicId),
      href: `${base}/${chapterId}/${topicId}`,
    });
  }

  for (const chapterId of post.chapters) {
    if (coveredChapters.has(chapterId)) continue;
    const chapter = getChapterFor(post.subjectSlug, post.curriculum, post.level, chapterId);
    if (!chapter) continue;
    links.push({ title: chapter.title, href: `${base}/${chapterId}` });
  }

  if (post.subject) {
    links.push({ title: `${post.subject} — full subject`, href: `/subjects/${post.subjectSlug}` });
  }
  return links;
}
