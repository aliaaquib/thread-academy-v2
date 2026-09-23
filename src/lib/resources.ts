import type { ChapterResources, WorksheetQuestion } from "./types";
import { getAvailableTopics } from "./content";

/** Real YouTube search URLs only — never invented video URLs. */
function youTubeSearch(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

const WORKSHEETS: Record<string, WorksheetQuestion[]> = {
  algebra: [
    {
      question: "Solve: 5x + 3 = 23.",
      hint: "Subtract 3 from both sides, then divide by 5.",
      answer: "5x = 20, so x = 4. Check: 5(4) + 3 = 23 ✓",
    },
    {
      question: "Solve: 7 − 2x = 1.",
      hint: "Get the x-term alone first. Watch the sign.",
      answer: "−2x = −6, so x = 3. Check: 7 − 2(3) = 1 ✓",
    },
    {
      question: "Solve: 4(x − 3) = 2x + 6.",
      hint: "Expand the bracket before collecting x-terms.",
      answer: "4x − 12 = 2x + 6 → 2x = 18 → x = 9. Check: 4(6) = 24 = 2(9) + 6 ✓",
    },
    {
      question: "Solve: x/4 + 5 = 12.",
      hint: "Undo the +5 first, then the ÷4.",
      answer: "x/4 = 7, so x = 28. Check: 28/4 + 5 = 12 ✓",
    },
    {
      question: "A rectangle's length is 3 cm more than its width. Its perimeter is 26 cm. Find the width.",
      hint: "Let width = w. Write the perimeter in terms of w, then solve.",
      answer: "2(w + w + 3) = 26 → 4w + 6 = 26 → w = 5 cm. Length = 8 cm.",
    },
    {
      question: "Solve 3x − 7 = 2(x + 4) − 1.",
      hint: "Expand, simplify the right side, then collect.",
      answer: "3x − 7 = 2x + 7 → x = 14. Check: 3(14) − 7 = 35 = 2(18) − 1 ✓",
    },
  ],
  "cell-biology": [
    {
      question: "Name three structures found in plant cells but not in animal cells.",
      hint: "Think about photosynthesis and support.",
      answer: "Cell wall, chloroplasts and the permanent vacuole.",
    },
    {
      question: "Which organelle is the site of aerobic respiration, and which carries out photosynthesis?",
      hint: "One releases energy from glucose; the other captures light.",
      answer: "Mitochondria — aerobic respiration. Chloroplasts — photosynthesis.",
    },
    {
      question: "Explain why a root hair cell does not need chloroplasts.",
      hint: "What is the job of a root hair cell, and where does it live?",
      answer: "Root hair cells absorb water underground in the dark — there is no light for photosynthesis, so chloroplasts would be useless. They are specialised for absorption instead.",
    },
    {
      question: "Put these in order of size, smallest first: cell, organ, tissue, organelle, organ system.",
      hint: "Start from the microscopic.",
      answer: "Organelle → cell → tissue → organ → organ system.",
    },
  ],
  forces: [
    {
      question: "State Newton's three laws of motion in your own words.",
      hint: "Think: keep doing what you're doing / F = ma / every action…",
      answer: "1) Objects keep their state of motion unless a resultant force acts. 2) F = ma — acceleration is proportional to resultant force. 3) Every action has an equal and opposite reaction.",
    },
    {
      question: "A 2 kg trolley accelerates at 3 m/s². What is the resultant force?",
      hint: "F = ma. Watch the units.",
      answer: "F = 2 × 3 = 6 N.",
    },
    {
      question: "Explain, using Newton's third law, how a rocket moves forward in space.",
      hint: "What does the rocket push on?",
      answer: "The rocket pushes exhaust gases backwards (action); the gases push the rocket forwards with an equal and opposite force (reaction). No air is needed.",
    },
    {
      question: "A car of mass 1200 kg needs to accelerate at 2.5 m/s². The engine provides 4000 N. Is that enough? (Ignore other forces.)",
      hint: "Calculate the force actually required.",
      answer: "Required F = 1200 × 2.5 = 3000 N. 4000 N > 3000 N, so yes — with 1000 N to spare.",
    },
  ],
  programming: [
    {
      question: "Write a program that stores your favourite food in a variable and prints 'I love …'.",
      hint: "Create the variable first, then print it inside a longer string.",
      answer: 'food = "pizza"\nprint("I love " + food)',
    },
    {
      question: "What is wrong with this code? `price = \"9.99\"` then `print(price + 1)`.",
      hint: "Check the type of price.",
      answer: 'price is a string ("9.99"), so price + 1 tries to add a number to text — a TypeError. Fix: price = 9.99 or float(price) + 1.',
    },
    {
      question: "Swap the values of a and b using a third variable temp.",
      hint: "Store one value safely before overwriting it.",
      answer: "temp = a\na = b\nb = temp",
    },
  ],
};

const REVISION: Record<string, string[]> = {
  algebra: [
    "An expression (3x + 2) has no equals sign; an equation (3x + 2 = 11) does — and can be solved.",
    "Golden rule: whatever you do to one side of an equation, do to the other.",
    "Undo operations in reverse order: addition/subtraction first, then multiplication/division.",
    "Collect x-terms on one side before isolating x when unknowns appear on both sides.",
    "Always check by substituting your answer back into the original equation.",
    "Watch signs when expanding brackets: a minus outside flips every sign inside.",
  ],
  "cell-biology": [
    "Cells are the basic building blocks of all living organisms.",
    "Nucleus holds genetic material and controls the cell; mitochondria release energy in respiration.",
    "Plant cells also have a cell wall, chloroplasts (photosynthesis) and a permanent vacuole.",
    "Cells differentiate to become specialised — structure matches function.",
    "Organisation goes: organelles → cells → tissues → organs → organ systems.",
  ],
  forces: [
    "Newton's 1st law: objects maintain their velocity unless a resultant force acts.",
    "Newton's 2nd law: F = ma — resultant force equals mass × acceleration.",
    "Newton's 3rd law: every action has an equal and opposite reaction.",
    "Weight is a force (mass × gravitational field strength), measured in newtons.",
    "Free-body diagrams show all forces acting on one object — draw them before calculating.",
  ],
  programming: [
    "A variable is a named box storing one value at a time; = assigns, it doesn't mean 'equals'.",
    "Core types: str (text), int (whole numbers), float (decimals), bool (True/False).",
    "Names must start with a letter or underscore, and should be meaningful.",
    "type() reveals a value's type; int(), float(), str() convert between types.",
    "\"17\" (text) and 17 (number) behave differently — the type decides what operations do.",
  ],
};

export function getChapterResources(
  subjectSlug: string,
  curriculumSlug: string,
  levelSlug: string,
  chapterId: string,
): ChapterResources {
  const notes = getAvailableTopics({ curriculum: curriculumSlug, level: levelSlug, subject: subjectSlug, chapter: chapterId });

  const videos = notes.map((t) => ({
    title: `${t.title} — explained`,
    url: youTubeSearch(`${t.title} ${chapterId.replace(/-/g, " ")} explained`),
  }));

  const tools =
    subjectSlug === "mathematics" && chapterId === "algebra"
      ? [
          {
            title: "Linear equation solver",
            desc: "Type any linear equation and watch it solved step by step — then try the steps yourself.",
            anchor: "#interactive-tools",
          },
        ]
      : [];

  const revision =
    REVISION[chapterId] ??
    notes.flatMap((t) => [`${t.title}: ${t.desc}`]).concat([
      "Read each lesson's summary and re-do its practice questions from memory.",
    ]);

  return {
    subject: subjectSlug,
    curriculum: curriculumSlug,
    level: levelSlug,
    chapter: chapterId,
    notes: notes.map((t) => ({ title: t.title, desc: t.desc, url: t.url })),
    worksheets: WORKSHEETS[chapterId] ?? [],
    videos,
    tools,
    revision,
  };
}
