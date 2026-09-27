/**
 * THE SHAPES OF THE DATA — what a Subject, Chapter and Topic look like.
 *
 * This file holds no content, only descriptions of the data's shape so the
 * code stays consistent. You only touch this when adding a brand-new kind
 * of data to the site.
 */
export type SubjectCategory = "STEM" | "HUMANITIES" | "LANGUAGES";

export interface Subject {
  slug: string;
  name: string;
  icon: string;
  category: SubjectCategory;
  tagline: string;
  intro: string;
  learn: string[];
  chapters: Chapter[];
}

export interface Chapter {
  /** globally-unique id, also the URL slug */
  id: string;
  title: string;
  desc: string;
}

export interface Topic {
  slug: string;
  title: string;
  desc: string;
}

export interface TopicWithContent extends Topic {
  /** URL of the textbook page */
  url: string;
}

export type SearchKind = "subject" | "chapter" | "topic" | "resource";

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  /** breadcrumb-style path, e.g. "Mathematics → Algebra → Linear Equations" */
  path: string;
  url: string;
  /** lowercased haystack for matching */
  text: string;
}

export interface ResourceVideo {
  title: string;
  url: string;
}

export interface ResourceTool {
  title: string;
  desc: string;
  /** anchor on the resources page where the tool is embedded, e.g. "#interactive-tools" */
  anchor: string;
}

export interface WorksheetQuestion {
  question: string;
  hint?: string;
  answer: string;
}

export interface ChapterResources {
  subject: string;
  chapter: string;
  notes: { title: string; desc: string; url: string }[];
  worksheets: WorksheetQuestion[];
  videos: ResourceVideo[];
  tools: ResourceTool[];
  revision: string[];
}
