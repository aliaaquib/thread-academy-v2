import type { Chapter } from "./types";
import { getChapterForSubject } from "./stage-chapters";

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
  "arabic": {
    7: ["arabic-sounds", "arabic-greetings"],
    8: ["arabic-numbers", "script"],
    9: ["arabic-my-world", "first-words"],
    10: ["practical-arabic", "arabic-literature"],
    11: ["arabic-advanced-grammar"],
    12: ["arabic-culture"],
  },
  "astronomy": {
    7: ["night-sky", "planets-tour"],
    8: ["sun-rises", "solar-system"],
    9: ["gravity-orbits", "stars-galaxies"],
    10: ["exploring-space", "cosmology"],
    11: ["exoplanets"],
    12: ["astrophysics"],
  },
  "biology": {
    7: ["living-things", "plants", "animals-humans"],
    8: ["cell-biology", "organisation"],
    9: ["reproduction", "health-disease"],
    10: ["bioenergetics", "genetics"],
    11: ["ecology", "biochemistry"],
    12: ["physiology", "evolution"],
  },
  "business": {
    7: ["young-entrepreneurs", "money-matters"],
    8: ["teamwork", "business-basics"],
    9: ["marketing", "enterprise"],
    10: ["finance", "strategy"],
    11: ["corporate-finance"],
    12: ["operations"],
  },
  "chemistry": {
    7: ["sorting-materials", "solids-liquids", "mixtures"],
    8: ["particles", "atomic-structure"],
    9: ["periodic-table", "acids-alkalis"],
    10: ["chemical-bonding", "chemical-changes"],
    11: ["quantitative-chemistry", "physical-chemistry"],
    12: ["organic-chemistry", "analytical-chemistry"],
  },
  "chinese": {
    7: ["chinese-sounds", "chinese-greetings"],
    8: ["chinese-numbers", "sounds-tones"],
    9: ["chinese-my-world", "first-conversations"],
    10: ["daily-chinese", "chinese-literature"],
    11: ["chinese-advanced-grammar"],
    12: ["chinese-culture"],
  },
  "civics": {
    7: ["community-helpers", "rules-fairness"],
    8: ["symbols", "citizenship"],
    9: ["government", "media-literacy"],
    10: ["constitution", "elections"],
    11: ["comparative-politics", "civil-rights"],
    12: ["media-democracy"],
  },
  "computer-science": {
    7: ["algorithms-unplugged", "staying-safe-online"],
    8: ["creating-media", "computational-thinking"],
    9: ["programming", "data-representation"],
    10: ["networks", "algorithms"],
    11: ["data-structures", "databases-sql"],
    12: ["ai-ethics"],
  },
  "earth-science": {
    7: ["rocks-soil", "day-night-seasons"],
    8: ["weather-watch", "earth-structure"],
    9: ["rocks-minerals", "volcanoes-earthquakes"],
    10: ["water-systems", "geochemistry"],
    11: ["oceanography"],
    12: ["palaeontology"],
  },
  "economics": {
    7: ["needs-wants", "money"],
    8: ["jobs-work", "microeconomics"],
    9: ["markets", "government-economy"],
    10: ["macroeconomics", "behavioural-economics"],
    11: ["international-trade"],
    12: ["development-economics"],
  },
  "engineering": {
    7: ["building-things", "materials-job"],
    8: ["pulleys-levers"],
    9: ["design-process"],
    10: ["structures"],
    11: ["mechanisms"],
    12: ["machines"],
  },
  "english": {
    7: ["phonics", "story-time"],
    8: ["handwriting", "reading-skills"],
    9: ["spoken-language", "grammar-vocabulary"],
    10: ["writing-skills", "literature"],
    11: ["language-analysis"],
    12: ["rhetoric"],
  },
  "environmental-science": {
    7: ["nature-around-us", "reduce-reuse"],
    8: ["water-precious", "ecosystems"],
    9: ["food-webs", "human-impact"],
    10: ["sustainability", "climate-policy"],
    11: ["conservation-biology"],
    12: ["environmental-economics"],
  },
  "french": {
    7: ["french-sounds", "french-greetings"],
    8: ["french-numbers", "french-basics"],
    9: ["french-my-world", "french-grammar"],
    10: ["revision", "french-literature"],
    11: ["french-advanced-grammar"],
    12: ["french-culture"],
  },
  "geography": {
    7: ["my-place", "weather-seasons"],
    8: ["continents-oceans", "physical-geography"],
    9: ["weather-climate", "map-skills"],
    10: ["human-geography", "coasts"],
    11: ["urbanisation"],
    12: ["global-development"],
  },
  "german": {
    7: ["german-sounds", "german-greetings"],
    8: ["german-numbers", "getting-started"],
    9: ["german-my-world", "core-grammar"],
    10: ["everyday-german", "german-literature"],
    11: ["german-advanced-grammar"],
    12: ["german-culture"],
  },
  "global-studies": {
    7: ["our-world", "cultures"],
    8: ["helping-others"],
    9: ["globalisation"],
    10: ["migration"],
    11: ["trade"],
    12: ["global-citizenship"],
  },
  "history": {
    7: ["my-history", "toys-past"],
    8: ["great-events", "modern-world"],
    9: ["empire-industry", "source-skills"],
    10: ["twentieth-century", "historiography"],
    11: ["cold-war"],
    12: ["decolonisation"],
  },
  "japanese": {
    7: ["japanese-sounds", "japanese-greetings"],
    8: ["japanese-numbers", "writing-systems"],
    9: ["japanese-my-world", "speaking-basics"],
    10: ["daily-japanese", "japanese-literature"],
    11: ["japanese-advanced-grammar"],
    12: ["japanese-culture"],
  },
  "mathematics": {
    7: ["counting", "addition-subtraction", "shapes-measures"],
    8: ["fractions-first", "number-arithmetic"],
    9: ["algebra", "ratio-proportion"],
    10: ["geometry", "statistics"],
    11: ["probability", "pure-mathematics"],
    12: ["mechanics", "further-statistics"],
  },
  "philosophy": {
    7: ["big-questions", "thinking"],
    8: ["fairness"],
    9: ["thinking-clearly"],
    10: ["ethics"],
    11: ["logic"],
    12: ["reality-knowledge"],
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
  "religious-studies": {
    7: ["celebrations", "sacred-stories"],
    8: ["kindness", "world-religions"],
    9: ["beliefs", "worship"],
    10: ["philosophy-religion", "religion-society"],
    11: ["theology"],
    12: ["religion-ethics"],
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
  "spanish": {
    7: ["spanish-sounds", "spanish-greetings"],
    8: ["spanish-numbers", "spanish-basics"],
    9: ["spanish-my-world", "spanish-grammar"],
    10: ["spanish-literature"],
    11: ["spanish-advanced-grammar"],
    12: ["spanish-culture"],
  },
};

/** Chapters for one grade of a subject, easiest-first. */
export function getChaptersForGrade(subjectSlug: string, grade: number): Chapter[] {
  const ids = GRADE_CHAPTER_IDS[subjectSlug]?.[grade] ?? [];
  const out: Chapter[] = [];
  for (const id of ids) {
    const c = getChapterForSubject(subjectSlug, id);
    if (c) out.push(c);
  }
  return out;
}

/** Every grade of a subject with its chapters. */
export function getGradesForSubject(subjectSlug: string): { grade: Grade; chapters: Chapter[] }[] {
  return GRADES.map((grade) => ({ grade, chapters: getChaptersForGrade(subjectSlug, grade) }));
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
