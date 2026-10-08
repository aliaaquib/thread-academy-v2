/**
 * SITE SEARCH — builds the search index when the site is built.
 *
 * It reads every lesson, chapter and blog post and writes them to
 * public/search-index.json. The /search page then filters that file in the
 * visitor's browser. You never edit this file to change content.
 */
import type { SearchEntry } from "./types";
import { getSubject, subjectsByCategory, CATEGORY_ORDER } from "./subjects";
import { getChapterForSubject } from "./stage-chapters";
import { getChapterTopics } from "./chapters";
import { getAllTopicParams, getTopicContent, getContentChapters } from "./content";
import { getGradeForChapter, gradeSlug } from "./grades";
import {
  DEFAULT_CURRICULUM,
  chapterPathForGrade,
  resourcesPathForGrade,
  subjectLandingPath,
  levelIdForGrade,
} from "./curricula";
import type { Lang } from "./i18n";
import { withLang, langMeta } from "./i18n";
import { t } from "./strings";

/**
 * Build the full-text search index at build time for one language.
 * Consumed by scripts/build-search-index.ts → public/search-index-<lang>.json,
 * then filtered client-side on /search.
 * Missing translations simply produce fewer entries — nothing is invented.
 */
export function buildSearchIndex(lang: Lang = "en"): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const seen = new Set<string>();
  const locale = langMeta(lang).locale;
  const push = (e: SearchEntry) => {
    const key = `${e.kind}:${e.url}`;
    if (seen.has(key)) return;
    seen.add(key);
    // Locale-aware case folding so Turkish dotted/dotless I and Cyrillic
    // match the same way at index time and at query time.
    entries.push({ ...e, text: e.text.toLocaleLowerCase(locale) });
  };
  const gradeLabel = (grade: number) => t(lang, "topic.grade.label", { grade });

  // Subjects
  for (const category of CATEGORY_ORDER) {
    for (const s of subjectsByCategory(category, lang)) {
      const subjectUrl = subjectLandingPath(s.slug);
      if (!subjectUrl) continue;
      push({
        kind: "subject",
        title: s.name,
        path: t(lang, "common.subjects"),
        url: withLang(subjectUrl, lang),
        text: `${s.name} ${s.tagline} ${s.intro} ${s.chapters.map((c) => c.title).join(" ")}`,
      });
    }
  }

  // Topics (every MDX lesson) + chapter/resource entries per content chapter
  for (const p of getAllTopicParams(lang)) {
    const subject = getSubject(p.subject, lang);
    if (!subject) continue;
    const chapter = getChapterForSubject(p.subject, p.chapter, lang);
    if (!chapter) continue;
    const grade = getGradeForChapter(p.subject, p.chapter);
    if (!grade) continue;
    const meta = getChapterTopics(p.subject, p.chapter, lang).find((t) => t.slug === p.topic);
    const content = getTopicContent(p, lang);
    const title = content?.title ?? meta?.title ?? p.topic;
    const breadcrumb = `${subject.name} → ${gradeLabel(grade)} → ${chapter.title} → ${title}`;
    const topicUrl = chapterPathForGrade(p.subject, grade, p.chapter, p.topic);
    if (!topicUrl) continue;
    push({
      kind: "topic",
      title,
      path: breadcrumb,
      url: withLang(topicUrl, lang),
      text: `${title} ${breadcrumb} ${content?.lede ?? ""} ${meta?.desc ?? ""}`,
    });
  }

  // Chapters + resource pages (only where lessons exist)
  for (const combo of getContentChapters(lang)) {
    const subject = getSubject(combo.subject, lang);
    if (!subject) continue;
    const chapter = getChapterForSubject(combo.subject, combo.chapter, lang);
    if (!chapter) continue;
    const topicTitles = getChapterTopics(combo.subject, combo.chapter, lang)
      .map((t) => t.title)
      .join(" ");
    const breadcrumb = `${subject.name} → ${gradeLabel(combo.grade)} → ${chapter.title}`;
    const chapterUrl = chapterPathForGrade(combo.subject, combo.grade, combo.chapter);
    const resourceUrl = resourcesPathForGrade(combo.subject, combo.grade, combo.chapter);
    if (!chapterUrl || !resourceUrl) continue;
    push({
      kind: "chapter",
      title: chapter.title,
      path: breadcrumb,
      url: withLang(chapterUrl, lang),
      text: `${chapter.title} ${breadcrumb} ${chapter.desc} ${topicTitles}`,
    });
    push({
      kind: "resource",
      title: t(lang, "cres.hero.title", { title: chapter.title }),
      path: `${t(lang, "nav.resources")} → ${breadcrumb}`,
      url: withLang(resourceUrl, lang),
      text: `${t(lang, "cres.hero.title", { title: chapter.title })} ${breadcrumb} ${topicTitles}`,
    });
  }

  return entries.sort((a, b) => a.title.localeCompare(b.title));
}
