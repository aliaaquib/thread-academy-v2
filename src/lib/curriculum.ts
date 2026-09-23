import type { Curriculum, CurriculumStage, ResolvedLevel } from "./types";

/**
 * Curricula — each with its OWN level structure.
 * Ported from the approved content model; year/stage slugs added for routing.
 */
export const CURRICULA: Record<string, Curriculum> = {
  british: {
    slug: "british",
    name: "British",
    tagline: "The National Curriculum for England",
    desc: "The British curriculum organises school into Primary, Secondary, GCSE/IGCSE and A Level stages, with national assessments marking each transition.",
    stages: [
      {
        slug: "primary",
        name: "Primary",
        desc: "Foundations in literacy, numeracy and science.",
        years: [
          { slug: "year-1-2", name: "Year 1–2", subjects: ["mathematics", "english", "languages"] },
          { slug: "year-3-4", name: "Year 3–4", subjects: ["mathematics", "english", "biology", "languages"] },
          {
            slug: "year-5-6",
            name: "Year 5–6",
            subjects: ["mathematics", "english", "biology", "computer-science", "history", "geography"],
          },
        ],
      },
      {
        slug: "secondary",
        name: "Secondary",
        desc: "Broader subjects and deeper concepts in Years 7–9.",
        years: [
          {
            slug: "year-7",
            name: "Year 7",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "languages"],
          },
          {
            slug: "year-8",
            name: "Year 8",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "languages"],
          },
          {
            slug: "year-9",
            name: "Year 9",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "business", "languages"],
          },
        ],
      },
      {
        slug: "gcse-igcse",
        name: "GCSE / IGCSE",
        desc: "Two-year examined courses, usually Years 10–11.",
        years: [
          {
            slug: "year-10",
            name: "Year 10",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "business", "languages", "astronomy", "earth-science", "religious-studies"],
          },
          {
            slug: "year-11",
            name: "Year 11",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "business", "languages", "astronomy", "earth-science", "religious-studies"],
          },
        ],
      },
      {
        slug: "a-level",
        name: "A Level",
        desc: "Specialised two-year study, usually Years 12–13.",
        years: [
          {
            slug: "year-12",
            name: "Year 12",
            subjects: ["mathematics", "biology", "physics", "chemistry", "computer-science", "english", "history", "geography", "economics", "business", "languages", "engineering", "psychology", "sociology", "political-science", "philosophy"],
          },
          {
            slug: "year-13",
            name: "Year 13",
            subjects: ["mathematics", "biology", "physics", "chemistry", "computer-science", "english", "history", "geography", "economics", "business", "languages", "engineering", "psychology", "sociology", "political-science", "philosophy"],
          },
        ],
      },
    ],
  },
  cambridge: {
    slug: "cambridge",
    name: "Cambridge",
    tagline: "Cambridge Pathway",
    desc: "Cambridge International organises learning into Primary, Lower Secondary, IGCSE and AS & A Level stages, used by schools in over 160 countries.",
    stages: [
      {
        slug: "primary",
        name: "Primary",
        desc: "Cambridge Primary builds core skills from ages 5–11.",
        years: [
          { slug: "stage-4-6", name: "Stage 4–6", subjects: ["mathematics", "english", "biology", "languages"] },
        ],
      },
      {
        slug: "lower-secondary",
        name: "Lower Secondary",
        desc: "Ages 11–14: preparation for IGCSE study.",
        years: [
          {
            slug: "stage-7",
            name: "Stage 7",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "languages"],
          },
          {
            slug: "stage-8",
            name: "Stage 8",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "languages"],
          },
          {
            slug: "stage-9",
            name: "Stage 9",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "languages"],
          },
        ],
      },
      {
        slug: "igcse",
        name: "IGCSE",
        desc: "Two-year international GCSE programme.",
        years: [
          {
            slug: "igcse-year-1",
            name: "IGCSE Year 1",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "business", "languages", "environmental-science", "religious-studies"],
          },
          {
            slug: "igcse-year-2",
            name: "IGCSE Year 2",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "business", "languages", "environmental-science", "religious-studies"],
          },
        ],
      },
      {
        slug: "as-a-level",
        name: "AS / A Level",
        desc: "Advanced study for university preparation.",
        years: [
          {
            slug: "as-level",
            name: "AS Level",
            subjects: ["mathematics", "biology", "physics", "chemistry", "computer-science", "economics", "business", "english", "languages", "psychology"],
          },
          {
            slug: "a-level",
            name: "A Level",
            subjects: ["mathematics", "biology", "physics", "chemistry", "computer-science", "economics", "business", "english", "languages", "psychology"],
          },
        ],
      },
    ],
  },
  american: {
    slug: "american",
    name: "American",
    tagline: "US K–12 system",
    desc: "The American system runs from Kindergarten through Grade 12: Elementary School, Middle School and High School, with standards set state by state.",
    stages: [
      {
        slug: "elementary-school",
        name: "Elementary School",
        desc: "Grades K–5: foundations across all subjects.",
        years: [
          { slug: "grades-k-2", name: "Grades K–2", subjects: ["mathematics", "english", "languages"] },
          {
            slug: "grades-3-5",
            name: "Grades 3–5",
            subjects: ["mathematics", "english", "biology", "computer-science", "history", "geography"],
          },
        ],
      },
      {
        slug: "middle-school",
        name: "Middle School",
        desc: "Grades 6–8: subject specialists and deeper inquiry.",
        years: [
          {
            slug: "grade-6",
            name: "Grade 6",
            subjects: ["mathematics", "english", "biology", "physics", "computer-science", "history", "geography", "languages"],
          },
          {
            slug: "grade-7",
            name: "Grade 7",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "languages"],
          },
          {
            slug: "grade-8",
            name: "Grade 8",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "languages", "civics"],
          },
        ],
      },
      {
        slug: "high-school",
        name: "High School",
        desc: "Grades 9–12: credits, electives and college preparation.",
        years: [
          {
            slug: "grades-9-10",
            name: "Grades 9–10",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "business", "languages", "environmental-science", "earth-science", "astronomy", "psychology", "civics"],
          },
          {
            slug: "grades-11-12",
            name: "Grades 11–12",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "business", "languages", "environmental-science", "earth-science", "astronomy", "engineering", "psychology", "sociology", "political-science", "civics", "global-studies"],
          },
        ],
      },
    ],
  },
  ib: {
    slug: "ib",
    name: "IB",
    tagline: "International Baccalaureate",
    desc: "The IB offers three programmes — PYP, MYP and the Diploma Programme — built around inquiry, international-mindedness and the Learner Profile.",
    stages: [
      {
        slug: "pyp",
        name: "PYP",
        desc: "Primary Years Programme, ages 3–12: transdisciplinary inquiry.",
        years: [
          { slug: "pyp-lower", name: "PYP Lower", subjects: ["mathematics", "english", "biology", "languages"] },
          {
            slug: "pyp-upper",
            name: "PYP Upper",
            subjects: ["mathematics", "english", "biology", "computer-science", "history", "geography", "languages"],
          },
        ],
      },
      {
        slug: "myp",
        name: "MYP",
        desc: "Middle Years Programme, ages 11–16: eight subject groups.",
        years: [
          {
            slug: "myp-1-2",
            name: "MYP 1–2",
            subjects: ["mathematics", "english", "biology", "physics", "computer-science", "history", "geography", "languages"],
          },
          {
            slug: "myp-3",
            name: "MYP 3",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "languages"],
          },
          {
            slug: "myp-4-5",
            name: "MYP 4–5",
            subjects: ["mathematics", "english", "biology", "physics", "chemistry", "computer-science", "history", "geography", "economics", "business", "languages", "global-studies"],
          },
        ],
      },
      {
        slug: "dp",
        name: "DP",
        desc: "Diploma Programme, ages 16–19: six subjects plus the core.",
        years: [
          {
            slug: "dp-year-1",
            name: "DP Year 1",
            subjects: ["mathematics", "biology", "physics", "chemistry", "computer-science", "english", "history", "geography", "economics", "business", "languages", "environmental-science", "psychology", "political-science", "philosophy", "global-studies"],
          },
          {
            slug: "dp-year-2",
            name: "DP Year 2",
            subjects: ["mathematics", "biology", "physics", "chemistry", "computer-science", "english", "history", "geography", "economics", "business", "languages", "environmental-science", "psychology", "political-science", "philosophy", "global-studies"],
          },
        ],
      },
    ],
  },
};

export const CURRICULUM_SLUGS = Object.keys(CURRICULA);

/** "languages" in year subject lists expands to the language subjects. */
const LANGUAGE_SUBJECTS = ["english", "spanish", "french", "german", "arabic", "chinese", "japanese", "russian"];

export function expandSubjects(subjects: string[]): string[] {
  const out: string[] = [];
  for (const s of subjects) {
    if (s === "languages") out.push(...LANGUAGE_SUBJECTS);
    else if (!out.includes(s)) out.push(s);
  }
  return out;
}

/**
 * Resolve a level slug for routing. Accepts either a stage slug
 * (e.g. cambridge "igcse") or a year slug inside a stage (e.g. british "year-8").
 */
export function resolveLevel(curriculumSlug: string, levelSlug: string): ResolvedLevel | null {
  const curriculum = CURRICULA[curriculumSlug];
  if (!curriculum) return null;

  const stage = curriculum.stages.find((s) => s.slug === levelSlug);
  if (stage) {
    const subjects = expandSubjects(stage.years.flatMap((y) => y.subjects));
    return { kind: "stage", slug: stage.slug, name: stage.name, desc: stage.desc, stage, year: null, subjects };
  }
  for (const st of curriculum.stages) {
    const year = st.years.find((y) => y.slug === levelSlug);
    if (year) {
      return {
        kind: "year",
        slug: year.slug,
        name: year.name,
        desc: st.desc,
        stage: st,
        year,
        subjects: expandSubjects(year.subjects),
      };
    }
  }
  return null;
}

/** Every addressable level slug for a curriculum (stages + years). */
export function allLevelSlugs(curriculumSlug: string): { slug: string; stage: CurriculumStage }[] {
  const curriculum = CURRICULA[curriculumSlug];
  if (!curriculum) return [];
  const out: { slug: string; stage: CurriculumStage }[] = [];
  for (const stage of curriculum.stages) {
    out.push({ slug: stage.slug, stage });
    for (const year of stage.years) out.push({ slug: year.slug, stage });
  }
  return out;
}

export function getCurriculum(slug: string): Curriculum | null {
  return CURRICULA[slug] ?? null;
}

/** True when a curriculum offers a subject at one or more addressable levels
 *  (stages and years alike). */
export function curriculumOffersSubject(curriculumSlug: string, subjectSlug: string): boolean {
  return allLevelSlugs(curriculumSlug).some(
    ({ slug }) => resolveLevel(curriculumSlug, slug)?.subjects.includes(subjectSlug) ?? false
  );
}
