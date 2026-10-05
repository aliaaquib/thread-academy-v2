/**
 * WHICH CHAPTER GOES IN WHICH GRADE (7-12), per subject.
 *
 * To move a chapter to another grade: cut its id from one grade list and
 * paste it into another. To add a chapter: add its id to a grade list, and
 * make sure the chapter also exists in stage-chapters.ts and chapters.ts.
 * Every chapter id must appear in exactly one grade.
 */
import type { Chapter } from "./types";
import { getChapterForSubject } from "./stage-chapters";
import type { Lang } from "./i18n";

/** School grades offered after subject selection. */
export const GRADES = [7, 8, 9, 10, 11, 12] as const;
export type Grade = (typeof GRADES)[number];

/** URL slug for a grade, e.g. 8 -> "grade-8". */
export function gradeSlug(grade: number): string {
  return `grade-${grade}`;
}

/** Parse a URL grade segment ("grade-8") -> 8, or null when invalid. */
export function parseGradeSlug(slug: string): Grade | null {
  const m = /^grade-([789]|1[012])$/.exec(slug);
  if (!m) return null;
  return Number(m[1]) as Grade;
}

/**
 * Approved chapter -> grade assignment per subject (2026-09-24).
 * Chapters were ordered easiest-first (Foundations -> Developing ->
 * Examination -> Advanced) and dealt across grades 7-12 as evenly as
 * possible; every chapter belongs to exactly one grade.
 *
 * To add a chapter later:
 *  1. Add its id to the right grade list below.
 *  2. Add its metadata to src/lib/stage-chapters.ts (it must exist there).
 *  3. Add its topics to CHAPTER_TOPICS in src/lib/chapters.ts.
 *  4. Drop the lesson files in content/subject/<subject>/grade-<n>/<chapter>/.
 * The site rebuild picks everything up automatically.
 */
export const GRADE_CHAPTER_IDS: Record<string, Record<number, string[]>> = {
  "biology": {
    7: ["living-things", "plants", "animals-humans"],
    8: ["cell-biology", "organisation"],
    9: ["reproduction", "health-disease"],
    10: ["bioenergetics", "genetics"],
    11: ["ecology", "biochemistry"],
    12: ["physiology", "evolution"],
  },
  "chemistry": {
    7: ["sorting-materials", "solids-liquids", "mixtures"],
    8: ["particles", "atomic-structure"],
    9: ["periodic-table", "acids-alkalis"],
    10: ["chemical-bonding", "chemical-changes"],
    11: ["quantitative-chemistry", "physical-chemistry"],
    12: ["organic-chemistry", "analytical-chemistry"],
  },
  "computer-science": {
    7: ["networks-and-digital-communication", "computer-systems"],
    8: ["creating-media", "computational-thinking"],
    9: ["programming", "data-representation"],
    10: ["networks", "algorithms"],
    11: ["data-structures", "databases-sql"],
    12: ["ai-ethics"],
  },
  "economics": {
    7: ["needs-wants", "money"],
    8: ["jobs-work", "microeconomics"],
    9: ["markets", "government-economy"],
    10: ["macroeconomics", "behavioural-economics"],
    11: ["international-trade"],
    12: ["development-economics"],
  },
  "english": {
    7: ["phonics", "story-time"],
    8: ["handwriting", "reading-skills"],
    9: ["spoken-language", "grammar-vocabulary"],
    10: ["writing-skills", "literature"],
    11: ["language-analysis"],
    12: ["rhetoric"],
  },
  "geography": {
    7: ["my-place", "weather-seasons"],
    8: ["continents-oceans", "physical-geography"],
    9: ["weather-climate", "map-skills"],
    10: ["human-geography", "coasts"],
    11: ["urbanisation"],
    12: ["global-development"],
  },
  "history": {
    7: ["my-history", "toys-past"],
    8: ["great-events", "modern-world"],
    9: ["empire-industry", "source-skills"],
    10: ["twentieth-century", "historiography"],
    11: ["cold-war"],
    12: ["decolonisation"],
  },
  "mathematics": {
    7: ["counting", "addition-subtraction", "shapes-measures"],
    8: ["fractions-first", "number-arithmetic"],
    9: ["algebra", "ratio-proportion"],
    10: ["geometry", "statistics"],
    11: ["probability", "pure-mathematics"],
    12: ["mechanics", "further-statistics"],
  },
  "physics": {
    7: ["pushes-pulls", "everyday-materials"],
    8: ["light-shadows", "forces"],
    9: ["motion", "energy"],
    10: ["sound", "waves"],
    11: ["electricity", "further-mechanics"],
    12: ["fields", "particle-physics"],
  },
  "political-science": {
    7: ["rules", "leaders"],
    8: ["voting"],
    9: ["power-politics"],
    10: ["democracy"],
    11: ["rights"],
    12: ["global-politics"],
  },
  "psychology": {
    7: ["feelings", "friendship"],
    8: ["growing-minds"],
    9: ["mind-memory"],
    10: ["social-behaviour"],
    11: ["the-brain"],
    12: ["development"],
  },
  "russian": {
    7: ["russian-sounds", "russian-greetings"],
    8: ["russian-numbers", "cyrillic"],
    9: ["russian-my-world", "first-steps"],
    10: ["daily-russian", "russian-literature"],
    11: ["russian-advanced-grammar"],
    12: ["russian-culture"],
  },
  "sociology": {
    7: ["families", "school-society"],
    8: ["communities"],
    9: ["foundations"],
    10: ["culture-identity"],
    11: ["socialisation"],
    12: ["inequality"],
  },
};

/** Chapters for one grade of a subject, easiest-first. */
export function getChaptersForGrade(subjectSlug: string, grade: number, lang: Lang = "en"): Chapter[] {
  const ids = GRADE_CHAPTER_IDS[subjectSlug]?.[grade] ?? [];
  const out: Chapter[] = [];
  for (const id of ids) {
    const c = getChapterForSubject(subjectSlug, id, lang);
    if (c) out.push(c);
  }
  return out;
}

/** Every grade of a subject with its chapters. */
export function getGradesForSubject(
  subjectSlug: string,
  lang: Lang = "en",
): { grade: Grade; chapters: Chapter[] }[] {
  return GRADES.map((grade) => ({ grade, chapters: getChaptersForGrade(subjectSlug, grade, lang) }));
}

/** Which grade a chapter belongs to (each chapter lives in exactly one grade). */
export function getGradeForChapter(subjectSlug: string, chapterId: string): Grade | null {
  const grades = GRADE_CHAPTER_IDS[subjectSlug];
  if (!grades) return null;
  for (const grade of GRADES) {
    if ((grades[grade] ?? []).includes(chapterId)) return grade;
  }
  return null;
}

/** Every (subject, grade, chapter) chapter page on the site. */
export function allGradeChapters(): { subject: string; grade: Grade; chapter: string }[] {
  const combos: { subject: string; grade: Grade; chapter: string }[] = [];
  for (const subject of Object.keys(GRADE_CHAPTER_IDS).sort()) {
    for (const grade of GRADES) {
      for (const chapter of GRADE_CHAPTER_IDS[subject][grade] ?? []) {
        combos.push({ subject, grade, chapter });
      }
    }
  }
  return combos;
}
