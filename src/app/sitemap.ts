import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { SITE_URL } from "@/lib/seo";
import { SUBJECT_SLUGS } from "@/lib/subjects";
import { getAllPosts } from "@/lib/blog";
import { contentRoot, getAllTopicParams, getContentChapters, topicFileMtime } from "@/lib/content";
import { GRADES, allGradeChapters, getGradeForChapter, gradeSlug } from "@/lib/grades";

/**
 * Generates /sitemap.xml for the static export.
 * Lists every public, indexable page: home, indexes, subjects,
 * grade pages, chapters, topics and resource pages. Search is intentionally
 * excluded (it carries a noindex meta tag).
 *
 * lastModified is real wherever the site knows it: a blog post's published
 * (or updated) date, or a lesson file's actual modification time. Entries
 * without a known date fall back to build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const buildDate = new Date();
  const add = (path: string, priority: number, lastModified: Date = buildDate) =>
    urls.push({ url: `${SITE_URL}${path}`, lastModified, priority });

  add("/", 1.0);
  add("/subjects", 0.9);
  add("/resources", 0.8);
  add("/blog", 0.8);
  add("/about", 0.5);

  // Blog posts (learning journal) — real publish/update dates.
  for (const post of getAllPosts()) {
    add(`/blog/${post.slug}`, 0.8, new Date(post.updated || post.date));
  }

  for (const subject of SUBJECT_SLUGS) {
    add(`/subjects/${subject}`, 0.9);
  }

  // Subject category indexes (e.g. /subjects/stem).
  for (const category of ["stem", "humanities", "languages"]) {
    add(`/subjects/${category}`, 0.8);
  }

  // Grade index pages (e.g. /subjects/mathematics/grade-8).
  for (const subject of SUBJECT_SLUGS) {
    for (const grade of GRADES) {
      add(`/subjects/${subject}/${gradeSlug(grade)}`, 0.85);
    }
  }

  // Subject → grade → chapter routes.
  for (const { subject, grade, chapter } of allGradeChapters()) {
    add(`/subjects/${subject}/${gradeSlug(grade)}/${chapter}`, 0.9);
  }
  for (const t of getAllTopicParams()) {
    const grade = getGradeForChapter(t.subject, t.chapter);
    if (!grade) continue;
    add(
      `/subjects/${t.subject}/${gradeSlug(grade)}/${t.chapter}/${t.topic}`,
      0.9,
      topicFileMtime({ subject: t.subject, chapter: t.chapter, topic: t.topic }),
    );
  }

  // Resource pages — the chapter's folder modification time.
  for (const c of getContentChapters()) {
    const chapterDir = path.join(
      contentRoot(),
      "subject",
      c.subject,
      gradeSlug(c.grade),
      c.chapter,
    );
    let mtime = buildDate;
    try {
      mtime = fs.statSync(chapterDir).mtime;
    } catch {
      /* keep buildDate */
    }
    add(`/resources/${c.subject}/${gradeSlug(c.grade)}/${c.chapter}`, 0.7, mtime);
  }

  // Deduplicate.
  const seen = new Set<string>();
  return urls.filter((u) => {
    if (seen.has(u.url)) return false;
    seen.add(u.url);
    return true;
  });
}
