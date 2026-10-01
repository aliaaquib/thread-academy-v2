/**
 * SITEMAP — builds /sitemap.xml for the static export.
 * Lists every public, indexable page (home, subjects, grades, chapters,
 * topics, resources, blog) in every language. Search is excluded on purpose.
 * lastModified is real wherever known: blog post dates and lesson file
 * modification times. Non-English entries exist only where a genuine
 * translation exists — never for untranslated content.
 */
import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { SITE_URL } from "@/lib/seo";
import { type Lang } from "@/lib/i18n";
import { SUBJECT_SLUGS } from "@/lib/subjects";
import { getAllPosts } from "@/lib/blog";
import { contentRoot, getAllTopicParams, getContentChapters, topicFileMtime } from "@/lib/content";
import { GRADES, allGradeChapters, getGradeForChapter, gradeSlug } from "@/lib/grades";

/**
 * Generates /sitemap.xml for the static export.
 * Lists every public, indexable page in every language: home, indexes,
 * subjects, grade pages, chapters, topics and resource pages. Search is
 * intentionally excluded (it carries a noindex meta tag).
 *
 * lastModified is real wherever the site knows it: a blog post's published
 * (or updated) date, or a lesson file's actual modification time. Entries
 * without a known date fall back to build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const buildDate = new Date();
  // Structural pages (home, indexes, subjects, grades, chapters) exist in
  // every language; educational pages (topics, resources, posts) only where
  // a genuine translation exists.
  const langs: Lang[] = ["en", "tr", "ru", "ky"];
  const add = (path: string, priority: number, lastModified: Date = buildDate, lang: Lang = "en") => {
    const prefix = lang === "en" ? "" : `/${lang}`;
    urls.push({ url: `${SITE_URL}${prefix}${path}`, lastModified, priority });
  };

  for (const lang of langs) {
    add("/", 1.0, buildDate, lang);
    add("/subjects", 0.9, buildDate, lang);
    add("/resources", 0.8, buildDate, lang);
    add("/blog", 0.8, buildDate, lang);
    add("/about", 0.5, buildDate, lang);

    // Blog posts (learning journal) — only genuinely translated posts.
    for (const post of getAllPosts(lang)) {
      add(`/blog/${post.slug}`, 0.8, new Date(post.updated || post.date), lang);
    }

    for (const subject of SUBJECT_SLUGS) {
      add(`/subjects/${subject}`, 0.9, buildDate, lang);
    }

    // Subject category indexes (e.g. /subjects/stem).
    for (const category of ["stem", "humanities", "languages"]) {
      add(`/subjects/${category}`, 0.8, buildDate, lang);
    }

    // Grade index pages (e.g. /subjects/mathematics/grade-8).
    for (const subject of SUBJECT_SLUGS) {
      for (const grade of GRADES) {
        add(`/subjects/${subject}/${gradeSlug(grade)}`, 0.85, buildDate, lang);
      }
    }

    // Subject → grade → chapter routes (structure falls back to English).
    for (const { subject, grade, chapter } of allGradeChapters()) {
      add(`/subjects/${subject}/${gradeSlug(grade)}/${chapter}`, 0.9, buildDate, lang);
    }

    // Lesson pages — only where a real translated .mdx file exists.
    for (const t of getAllTopicParams(lang)) {
      const grade = getGradeForChapter(t.subject, t.chapter);
      if (!grade) continue;
      add(
        `/subjects/${t.subject}/${gradeSlug(grade)}/${t.chapter}/${t.topic}`,
        0.9,
        topicFileMtime({ subject: t.subject, chapter: t.chapter, topic: t.topic }, lang),
        lang,
      );
    }

    // Resource pages — only for chapters with translated lessons.
    for (const c of getContentChapters(lang)) {
      const chapterDir = path.join(
        contentRoot(lang),
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
      add(`/resources/${c.subject}/${gradeSlug(c.grade)}/${c.chapter}`, 0.7, mtime, lang);
    }
  }

  // Deduplicate.
  const seen = new Set<string>();
  return urls.filter((u) => {
    if (seen.has(u.url)) return false;
    seen.add(u.url);
    return true;
  });
}
