/**
 * THE BLOG — reads posts from content/blog/ and builds the blog pages.
 *
 * Each post is one .mdx file with title, date and subject at the top.
 * "Related lessons" links under each post are built automatically from the
 * chapter data, so they never point to a page that doesn't exist.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { contentRoot, getTopicContent } from "./content";
import { getChapterForSubject } from "./stage-chapters";
import { getGradeForChapter, gradeSlug } from "./grades";

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  subject: string;
  subjectSlug: string;
  author: string;
  keywords: string[];
  /** Chapter ids in subjectSlug. */
  chapters: string[];
  /** "chapterId/topicId" pairs pointing at real lesson pages. */
  lessons: string[];
  /** Optional ISO date (YYYY-MM-DD) when the post was last substantially updated. */
  updated?: string;
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
    author: str(data.author, "Thread Academy"),
    keywords: arr(data.keywords),
    chapters: arr(data.chapters),
    lessons: arr(data.lessons),
    updated: data.updated ? dateStr(data.updated) || undefined : undefined,
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
  const content = getTopicContent({ subject: subjectSlug, chapter: chapterId, topic: topicId });
  if (content && content.title) return content.title;
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
  const coveredChapters = new Set<string>();

  for (const pair of post.lessons) {
    const [chapterId, topicId] = pair.split("/");
    if (!chapterId || !topicId) continue;
    const chapter = getChapterForSubject(post.subjectSlug, chapterId);
    if (!chapter) continue;
    const grade = getGradeForChapter(post.subjectSlug, chapterId);
    if (!grade) continue;
    coveredChapters.add(chapterId);
    links.push({
      title: lessonTitle(post.subjectSlug, chapterId, topicId),
      href: `/subjects/${post.subjectSlug}/${gradeSlug(grade)}/${chapterId}/${topicId}`,
    });
  }

  for (const chapterId of post.chapters) {
    if (coveredChapters.has(chapterId)) continue;
    const chapter = getChapterForSubject(post.subjectSlug, chapterId);
    if (!chapter) continue;
    const grade = getGradeForChapter(post.subjectSlug, chapterId);
    if (!grade) continue;
    links.push({ title: chapter.title, href: `/subjects/${post.subjectSlug}/${gradeSlug(grade)}/${chapterId}` });
  }

  if (post.subject) {
    links.push({ title: `${post.subject} — full subject`, href: `/subjects/${post.subjectSlug}` });
  }
  return links;
}
