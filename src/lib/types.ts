/** Core data-model types for Thread Academy. */

export type SubjectCategory = "STEM" | "HUMANITIES" | "LANGUAGES";

export interface CurriculumYear {
  /** URL slug, e.g. "year-8", "grade-8", "myp-3" */
  slug: string;
  name: string;
  /** subject slugs offered in this year ("languages" expands to english/spanish/french) */
  subjects: string[];
}

export interface CurriculumStage {
  /** URL slug, e.g. "igcse", "secondary", "middle-school" */
  slug: string;
  name: string;
  desc: string;
  years: CurriculumYear[];
}

export interface Curriculum {
  slug: string;
  name: string;
  tagline: string;
  desc: string;
  /** Each curriculum keeps its OWN level structure — never forced into one hierarchy. */
  stages: CurriculumStage[];
}

/** A resolved "level" for routing: either a whole stage (e.g. cambridge/igcse)
 *  or a specific year inside a stage (e.g. british/year-8). */
export interface ResolvedLevel {
  kind: "stage" | "year";
  slug: string;
  name: string;
  desc: string;
  stage: CurriculumStage;
  year: CurriculumYear | null;
  /** expanded subject slugs offered at this level */
  subjects: string[];
}

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
  /** breadcrumb-style path, e.g. "Mathematics → Cambridge → IGCSE → Algebra → Linear Equations" */
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
  curriculum: string;
  level: string;
  chapter: string;
  notes: { title: string; desc: string; url: string }[];
  worksheets: WorksheetQuestion[];
  videos: ResourceVideo[];
  tools: ResourceTool[];
  revision: string[];
}
