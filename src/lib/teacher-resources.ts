/**
 * TEACHER RESOURCES — reads teacher-contributed resources from
 * content/resources/*.mdx and serves them to the chapter resource pages.
 *
 * Each file carries frontmatter:
 *   title, description, kind (video|link|document|worksheet), url,
 *   subject, subject_slug, grade, chapter, chapter_title,
 *   author, author_username, date
 * and an optional Markdown body (used for worksheets).
 *
 * Teachers publish these through the CMS; the CMS stamps author_username
 * so only the author (or a CMS owner) can edit them.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { contentRoot } from "./content";

export type TeacherResourceKind = "video" | "link" | "document" | "worksheet";

export interface TeacherResource {
  slug: string;
  title: string;
  description: string;
  kind: TeacherResourceKind;
  url: string;
  author: string;
  date: string;
  body: string;
}

const KINDS: TeacherResourceKind[] = ["video", "link", "document", "worksheet"];

function resourcesDir(): string {
  return path.join(contentRoot(), "resources");
}

function readResource(file: string): { resource: TeacherResource; subjectSlug: string; chapter: string } | null {
  try {
    const raw = fs.readFileSync(path.join(resourcesDir(), file), "utf8");
    const { data, content } = matter(raw);
    const kind = String(data.kind ?? "link");
    const slug = file.replace(/\.mdx$/, "");
    return {
      resource: {
        slug,
        title: typeof data.title === "string" ? data.title : slug,
        description: typeof data.description === "string" ? data.description : "",
        kind: (KINDS as string[]).includes(kind) ? (kind as TeacherResourceKind) : "link",
        url: typeof data.url === "string" ? data.url : "",
        author: typeof data.author === "string" ? data.author : "",
        date: typeof data.date === "string" ? data.date : "",
        body: content.trim(),
      },
      subjectSlug: typeof data.subject_slug === "string" ? data.subject_slug : "",
      chapter: typeof data.chapter === "string" ? data.chapter : "",
    };
  } catch {
    return null;
  }
}

/** All resources a teacher attached to this subject + chapter. */
export function getTeacherResources(subject: string, chapter: string): TeacherResource[] {
  const dir = resourcesDir();
  if (!fs.existsSync(dir)) return [];
  const out: TeacherResource[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const parsed = readResource(file);
    if (!parsed) continue;
    if (parsed.subjectSlug !== subject || parsed.chapter !== chapter) continue;
    out.push(parsed.resource);
  }
  return out.sort((a, b) => a.title.localeCompare(b.title));
}
