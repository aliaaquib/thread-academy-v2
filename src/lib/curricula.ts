/**
 * CURRICULUM ARCHITECTURE — the four planned curricula and their URL space.
 *
 * Cambridge is the only active curriculum. British, American and IB exist
 * here as "coming-soon" placeholders: they appear in the UI as disabled
 * options and MUST NOT expose subjects, chapters or curriculum mappings
 * until they are real. The data model makes that impossible by construction —
 * a coming-soon curriculum has no levels, so no curriculum pages exist for it.
 *
 * To launch a curriculum later:
 *  1. Give it levels (with grade ranges) below.
 *  2. Flip its status to "active" in curricula-status.json
 *     (the CMS admin page does this; blocked until it has content).
 *  3. Add its content. No redesign, no URL-pattern changes:
 *     every curriculum follows /{curriculum}/{level}/subjects/…
 *
 * Status lives in curricula-status.json (not here) so the CMS admin can
 * toggle it with a plain JSON write; this module merges it in at build time.
 */
import { gradeSlug, getGradesForSubject } from "./grades";
import statusJson from "./curricula-status.json";

export type CurriculumId = "cambridge" | "british" | "american" | "ib";
export type CurriculumStatus = "active" | "coming-soon";

/** One stage within a curriculum, e.g. Cambridge Lower Secondary. */
export interface CurriculumLevel {
  /** URL slug, e.g. "lower-secondary". */
  id: string;
  /** Grades that belong to this level. Empty = level exists but has no content yet. */
  grades: number[];
}

export interface Curriculum {
  id: CurriculumId;
  /** URL prefix, e.g. "cambridge" → /cambridge/… */
  pathPrefix: string;
  status: CurriculumStatus;
  levels: CurriculumLevel[];
}

const STATUS = statusJson as Record<CurriculumId, CurriculumStatus>;

function status(id: CurriculumId): CurriculumStatus {
  return STATUS[id] === "active" ? "active" : "coming-soon";
}

export const CURRICULA: Record<CurriculumId, Curriculum> = {
  cambridge: {
    id: "cambridge",
    pathPrefix: "cambridge",
    status: status("cambridge"),
    levels: [
      { id: "primary", grades: [1, 2, 3, 4, 5, 6] },
      { id: "lower-secondary", grades: [7, 8, 9] },
      { id: "upper-secondary", grades: [10, 11, 12] },
      { id: "as-a-level", grades: [] },
    ],
  },
  // Coming soon — no levels, no pages, no fake content. Levels get defined
  // when the curriculum is actually built.
  british: { id: "british", pathPrefix: "british", status: status("british"), levels: [] },
  american: { id: "american", pathPrefix: "american", status: status("american"), levels: [] },
  ib: { id: "ib", pathPrefix: "ib", status: status("ib"), levels: [] },
};

export const CURRICULUM_IDS: CurriculumId[] = ["cambridge", "british", "american", "ib"];

/** Display names — proper nouns, identical in every language. */
export const CURRICULUM_NAMES: Record<CurriculumId, string> = {
  cambridge: "Cambridge",
  british: "British",
  american: "American",
  ib: "IB",
};

/** Maps a level id to its localized UI string key in strings.ts. */
const LEVEL_STRING_KEYS: Record<string, string> = {
  "primary": "curriculum.level.primary",
  "lower-secondary": "curriculum.level.lowerSecondary",
  "upper-secondary": "curriculum.level.upperSecondary",
  "as-a-level": "curriculum.level.asALevel",
};

export function levelStringKey(levelId: string): string {
  return LEVEL_STRING_KEYS[levelId] ?? levelId;
}

/** The curriculum every existing lesson belongs to. */
export const DEFAULT_CURRICULUM: CurriculumId = "cambridge";

export function getCurriculum(id: string): Curriculum | null {
  return (CURRICULA as Record<string, Curriculum>)[id] ?? null;
}

export function activeCurricula(): Curriculum[] {
  return CURRICULUM_IDS.map((id) => CURRICULA[id]).filter((c) => c.status === "active");
}

export function comingSoonCurricula(): Curriculum[] {
  return CURRICULUM_IDS.map((id) => CURRICULA[id]).filter((c) => c.status === "coming-soon");
}

export function getLevel(curriculumId: string, levelId: string): CurriculumLevel | null {
  const c = getCurriculum(curriculumId);
  return c?.levels.find((l) => l.id === levelId) ?? null;
}

/** Which level a grade belongs to, e.g. ("cambridge", 8) → lower-secondary. */
export function getLevelForGrade(curriculumId: string, grade: number): CurriculumLevel | null {
  const c = getCurriculum(curriculumId);
  return c?.levels.find((l) => l.grades.includes(grade)) ?? null;
}

/** Levels that actually have grades assigned (i.e. can have pages). */
export function levelsWithContent(curriculumId: string): CurriculumLevel[] {
  return getCurriculum(curriculumId)?.levels.filter((l) => l.grades.length > 0) ?? [];
}

// ---------------------------------------------------------------------------
// URL builders — every curriculum URL on the site is built here, so a new
// curriculum automatically follows the same pattern. Paths are language-
// agnostic; wrap with withLang() from ./i18n at the call site.
// ---------------------------------------------------------------------------

/** "/cambridge" */
export function curriculumPath(curriculumId: string): string {
  const c = getCurriculum(curriculumId);
  return `/${c?.pathPrefix ?? curriculumId}`;
}

/** "/cambridge/lower-secondary" */
export function levelPath(curriculumId: string, levelId: string): string {
  return `${curriculumPath(curriculumId)}/${levelId}`;
}

/** "/cambridge/lower-secondary/subjects" */
export function levelSubjectsPath(curriculumId: string, levelId: string): string {
  return `${levelPath(curriculumId, levelId)}/subjects`;
}

/** "/cambridge/lower-secondary/subjects/mathematics" */
export function subjectPath(curriculumId: string, levelId: string, subject: string): string {
  return `${levelSubjectsPath(curriculumId, levelId)}/${subject}`;
}

/** "/cambridge/lower-secondary/subjects/mathematics/grade-8" */
export function gradePath(curriculumId: string, levelId: string, subject: string, grade: number): string {
  return `${subjectPath(curriculumId, levelId, subject)}/${gradeSlug(grade)}`;
}

/** "/cambridge/lower-secondary/subjects/mathematics/grade-8/algebra" */
export function chapterPath(
  curriculumId: string,
  levelId: string,
  subject: string,
  grade: number,
  chapter: string
): string {
  return `${gradePath(curriculumId, levelId, subject, grade)}/${chapter}`;
}

/** "/cambridge/lower-secondary/subjects/mathematics/grade-8/algebra/linear-equations" */
export function topicPath(
  curriculumId: string,
  levelId: string,
  subject: string,
  grade: number,
  chapter: string,
  topic: string
): string {
  return `${chapterPath(curriculumId, levelId, subject, grade, chapter)}/${topic}`;
}

/** "/cambridge/lower-secondary/resources/mathematics/grade-8/algebra" */
export function resourcesPath(
  curriculumId: string,
  levelId: string,
  subject: string,
  grade: number,
  chapter: string
): string {
  return `${levelPath(curriculumId, levelId)}/resources/${subject}/${gradeSlug(grade)}/${chapter}`;
}

/**
 * Convenience for call sites that know the grade but not the level:
 * derives the level from the grade (all current content is Cambridge).
 * Returns null when the grade isn't mapped to any level.
 */
export function levelIdForGrade(curriculumId: string, grade: number): string | null {
  return getLevelForGrade(curriculumId, grade)?.id ?? null;
}

/**
 * Full chapter/lesson path from subject + grade (level derived from grade).
 * For search indexes, blog links and other call sites that don't track the
 * level. Returns null when the grade isn't mapped to any level.
 */
export function chapterPathForGrade(
  subject: string,
  grade: number,
  chapter: string,
  topic?: string
): string | null {
  const levelId = levelIdForGrade(DEFAULT_CURRICULUM, grade);
  if (!levelId) return null;
  return topic
    ? topicPath(DEFAULT_CURRICULUM, levelId, subject, grade, chapter, topic)
    : chapterPath(DEFAULT_CURRICULUM, levelId, subject, grade, chapter);
}

/** Full resources path from subject + grade (level derived from grade). */
export function resourcesPathForGrade(
  subject: string,
  grade: number,
  chapter: string
): string | null {
  const levelId = levelIdForGrade(DEFAULT_CURRICULUM, grade);
  if (!levelId) return null;
  return resourcesPath(DEFAULT_CURRICULUM, levelId, subject, grade, chapter);
}

/**
 * Subject landing path — the subject page in the first level (in curriculum
 * order) where the subject actually has chapters. For search entries and
 * blog links that reference a subject without a grade.
 */
export function subjectLandingPath(subject: string): string | null {
  const curriculum = CURRICULA[DEFAULT_CURRICULUM];
  const subjectGrades = getGradesForSubject(subject).map((g) => g.grade);
  for (const level of curriculum.levels) {
    if (subjectGrades.some((g) => level.grades.includes(g))) {
      return subjectPath(curriculum.id, level.id, subject);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Route validation — for pages under /[curriculum]/[level]/…
// (Returns null instead of calling notFound() so node build scripts can
// safely import this module; pages call notFound() themselves.)
// ---------------------------------------------------------------------------

/**
 * Validate the curriculum + level URL params. Returns null for anything
 * unknown. Coming-soon curricula have no levels, so any level path under
 * them resolves to null — the coming-soon experience lives at /[curriculum].
 */
export function resolveCurriculumLevel(params: {
  curriculum: string;
  level: string;
}): { curriculum: Curriculum; level: CurriculumLevel } | null {
  const curriculum = getCurriculum(params.curriculum);
  if (!curriculum) return null;
  const level = getLevel(curriculum.id, params.level);
  if (!level) return null;
  return { curriculum, level };
}
