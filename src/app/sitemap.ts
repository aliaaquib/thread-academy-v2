import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { SUBJECT_SLUGS } from "@/lib/subjects";
import { getPostSlugs } from "@/lib/blog";
import { getAllTopicParams, getContentChapters } from "@/lib/content";
import { GRADES, allGradeChapters, getGradeForChapter, gradeSlug } from "@/lib/grades";

/**
 * Generates /sitemap.xml for the static export.
 * Lists every public, indexable page: home, indexes, subjects,
 * grade pages, chapters, topics and resource pages. Search is intentionally
 * excluded (it carries a noindex meta tag).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number) =>
    urls.push({ url: `${SITE_URL}${path}`, lastModified: new Date(), priority });

  add("/", 1.0);
  add("/subjects", 0.9);
  add("/resources", 0.8);
  add("/blog", 0.8);
  add("/about", 0.5);

  // Blog posts (learning journal).
  for (const slug of getPostSlugs()) {
    add(`/blog/${slug}`, 0.8);
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
    add(`/subjects/${t.subject}/${gradeSlug(grade)}/${t.chapter}/${t.topic}`, 0.9);
  }

  // Resource pages.
  for (const c of getContentChapters()) {
    add(`/resources/${c.subject}/${gradeSlug(c.grade)}/${c.chapter}`, 0.7);
  }

  // Deduplicate.
  const seen = new Set<string>();
  return urls.filter((u) => {
    if (seen.has(u.url)) return false;
    seen.add(u.url);
    return true;
  });
}
