import type { SearchEntry } from "./types";
import { SUBJECTS } from "./subjects";
import { getChapterForSubject } from "./stage-chapters";
import { getChapterTopics } from "./chapters";
import { getAllTopicParams, getTopicContent, getContentChapters } from "./content";

/**
 * Build the full-text search index at build time.
 * Consumed by scripts/build-search-index.ts → public/search-index.json,
 * then filtered client-side on /search.
 */
export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  const seen = new Set<string>();
  const push = (e: SearchEntry) => {
    const key = `${e.kind}:${e.url}`;
    if (seen.has(key)) return;
    seen.add(key);
    entries.push({ ...e, text: e.text.toLowerCase() });
  };

  // Subjects
  for (const slug of Object.keys(SUBJECTS)) {
    const s = SUBJECTS[slug];
    push({
      kind: "subject",
      title: s.name,
      path: "Subjects",
      url: `/subjects/${slug}`,
      text: `${s.name} ${s.tagline} ${s.intro} ${s.chapters.map((c) => c.title).join(" ")}`,
    });
  }

  // Topics (every MDX lesson) + chapter/resource entries per content chapter
  for (const p of getAllTopicParams()) {
    const subject = SUBJECTS[p.subject];
    if (!subject) continue;
    const chapter = getChapterForSubject(p.subject, p.chapter);
    if (!chapter) continue;
    const meta = getChapterTopics(p.chapter).find((t) => t.slug === p.topic);
    const content = getTopicContent(p);
    const title = content?.title ?? meta?.title ?? p.topic;
    const breadcrumb = `${subject.name} → ${chapter.title} → ${title}`;
    push({
      kind: "topic",
      title,
      path: breadcrumb,
      url: `/subjects/${p.subject}/${p.chapter}/${p.topic}`,
      text: `${title} ${breadcrumb} ${content?.lede ?? ""} ${meta?.desc ?? ""}`,
    });
  }

  // Chapters + resource pages (only where lessons exist)
  for (const combo of getContentChapters()) {
    const subject = SUBJECTS[combo.subject];
    if (!subject) continue;
    const chapter = getChapterForSubject(combo.subject, combo.chapter);
    if (!chapter) continue;
    const topicTitles = getChapterTopics(combo.chapter)
      .map((t) => t.title)
      .join(" ");
    const breadcrumb = `${subject.name} → ${chapter.title}`;
    push({
      kind: "chapter",
      title: chapter.title,
      path: breadcrumb,
      url: `/subjects/${combo.subject}/${combo.chapter}`,
      text: `${chapter.title} ${breadcrumb} ${chapter.desc} ${topicTitles}`,
    });
    push({
      kind: "resource",
      title: `${chapter.title} resources`,
      path: `Resources → ${breadcrumb}`,
      url: `/resources/${combo.subject}/${combo.chapter}`,
      text: `${chapter.title} resources notes worksheets videos revision ${breadcrumb} ${topicTitles}`,
    });
  }

  return entries.sort((a, b) => a.title.localeCompare(b.title));
}
