/**
 * Topics inside each chapter, grouped by subject.
 * Key = chapter id (the folder name under content/subject/<subject>/grade-<n>/).
 *
 * A topic becomes a real page only when its lesson file exists:
 *   content/subject/<subject>/grade-<n>/<chapter>/<topic>.mdx
 * So adding a topic = adding one line here + one .mdx file. Nothing else changes.
 *
 * Hand-written topics below always come first. getChapterTopics() tops each
 * chapter up to four lessons using chapter-topics-extra.ts.
 */

import type { Topic } from "./types";
import { EXTRA_TOPICS } from "./chapter-topics-extra";

export const CHAPTER_TOPICS: Record<string, Topic[]> = {
  // ── Mathematics ──
  algebra: [
    { slug: "introduction", title: "Introduction to Algebra", desc: "What algebra is and why letters beat numbers." },
    { slug: "variables", title: "Variables", desc: "Named boxes that store values you can reuse and change." },
    { slug: "expressions", title: "Expressions", desc: "Simplifying, expanding and collecting like terms." },
    { slug: "linear-equations", title: "Linear Equations", desc: "Solve for x: one step, two steps, both sides." },
    { slug: "quadratic-equations", title: "Quadratic Equations", desc: "When x² appears: factorising and the quadratic formula." },
    { slug: "functions", title: "Functions", desc: "Machines that turn inputs into outputs." },
  ],
  // ── Physics ──
  forces: [
    { slug: "newtons-laws", title: "Newton's Laws of Motion", desc: "The three laws that govern how everything moves." },
  ],
  // ── Chemistry ──
  "atomic-structure": [
    { slug: "atoms-and-elements", title: "Atoms and Elements", desc: "Protons, neutrons, electrons — and what makes an element." },
  ],
  // ── Biology ──
  "cell-biology": [
    { slug: "cell-structure", title: "Cell Structure", desc: "Meet the organelles: the tiny machines inside every cell." },
  ],
  // ── Computer Science ──
  "computational-thinking-programming": [
    { slug: "flowcharts", title: "Flowcharts", desc: "Draw the steps of a solution with standard flowchart symbols." },
    { slug: "selection-and-logic-in-flowcharts", title: "Selection and Logic in Flowcharts", desc: "Make decisions with diamonds, and combine conditions with AND, OR and NOT." },
    { slug: "pattern-recognition-and-subroutines-in-flowcharts", title: "Pattern Recognition and Sub-routines in Flowcharts", desc: "Spot repeated steps and package them into reusable sub-routines." },
    { slug: "introduction-to-text-based-programming", title: "Introduction to Text-Based Programming", desc: "From blocks to typed code: what a programming language actually is." },
    { slug: "python-programming", title: "Python Programming", desc: "Your first Python: print, variables, input and if-statements." },
    { slug: "software-development-and-testing", title: "Software Development and Testing", desc: "Plan, code, test, fix: how software gets built properly." },
    { slug: "physical-computing", title: "Physical Computing", desc: "Programs that touch the real world: sensors, buttons and lights." },
  ],
  programming: [
    { slug: "variables", title: "Variables", desc: "A named box that stores a value — in real, runnable Python." },
  ],
  // ── History ──
  "modern-world": [
    { slug: "industrial-revolution", title: "The Industrial Revolution", desc: "How steam, coal and factories remade the world." },
  ],
  // ── Geography ──
  "physical-geography": [
    { slug: "rivers-and-erosion", title: "Rivers and Erosion", desc: "How flowing water sculpts the land." },
  ],
  // ── Economics ──
  microeconomics: [
    { slug: "supply-and-demand", title: "Supply and Demand", desc: "The two curves that set nearly every price." },
  ],
  // ── English ──
  "reading-skills": [
    { slug: "understanding-theme", title: "Understanding Theme", desc: "Find the big idea hiding inside a text." },
  ],
  // ── Psychology ──
  "mind-memory": [
    { slug: "how-memory-works", title: "How Memory Works", desc: "Encoding, storage and retrieval." },
    { slug: "thinking-biases", title: "Thinking and Biases", desc: "The shortcuts and traps in human reasoning." },
  ],
  "social-behaviour": [
    { slug: "conformity", title: "Conformity", desc: "Why we go along with the group." },
    { slug: "obedience", title: "Obedience", desc: "Milgram’s shocking study of authority." },
  ],
  development: [
    { slug: "child-development", title: "Child Development", desc: "Piaget, attachment and growing minds." },
    { slug: "stress-wellbeing", title: "Stress and Wellbeing", desc: "What stress does and how to handle it." },
  ],
  // ── Sociology ──
  foundations: [
    { slug: "the-sociological-imagination", title: "The Sociological Imagination", desc: "Seeing personal troubles as public issues." },
    { slug: "research-methods", title: "Research Methods", desc: "How sociologists gather evidence." },
  ],
  "culture-identity": [
    { slug: "culture-and-norms", title: "Culture and Norms", desc: "The unwritten rules that run society." },
    { slug: "socialisation", title: "Socialisation", desc: "How we learn to be members of society." },
  ],
  inequality: [
    { slug: "social-class", title: "Social Class", desc: "How class shapes life chances." },
    { slug: "social-mobility", title: "Social Mobility", desc: "Can people move up — and does education help?" },
  ],
  // ── Political Science ──
  "power-politics": [
    { slug: "what-is-politics", title: "What Is Politics?", desc: "Power, authority and the state." },
    { slug: "ideologies", title: "Political Ideologies", desc: "Liberalism, conservatism, socialism and beyond." },
  ],
  democracy: [
    { slug: "how-democracy-works", title: "How Democracy Works", desc: "Elections, rights and the rule of law." },
    { slug: "voting-systems", title: "Voting Systems", desc: "How votes become seats — and why the rules matter." },
  ],
  "global-politics": [
    { slug: "international-relations", title: "International Relations", desc: "Why states cooperate — and why they fight." },
    { slug: "global-challenges", title: "Global Challenges", desc: "Climate, pandemics and problems no state can solve alone." },
  ],
  // ── Russian ──
  cyrillic: [
    { slug: "cyrillic-alphabet", title: "The Cyrillic Alphabet", desc: "33 letters, many familiar." },
    { slug: "pronunciation-stress", title: "Pronunciation and Stress", desc: "Stress changes everything." },
  ],
  "first-steps": [
    { slug: "russian-greetings", title: "Greetings", desc: "Привет and Здравствуйте." },
    { slug: "nouns-and-verbs", title: "Nouns and Verbs", desc: "Gender, cases preview, conjugation." },
  ],
  "daily-russian": [
    { slug: "russian-numbers", title: "Numbers", desc: "Counting to 100 and beyond." },
    { slug: "time-and-phrases", title: "Time and Phrases", desc: "Telling time, daily expressions." },
  ],
};

export function getChapterTopics(chapterId: string): Topic[] {
  const base = CHAPTER_TOPICS[chapterId] ?? [];
  // Hand-written topics always come first; generated ones top the chapter up to four lessons.
  if (base.length >= 4) return base;
  const extra = (EXTRA_TOPICS[chapterId] ?? []).filter((t) => !base.some((b) => b.slug === t.slug));
  return [...base, ...extra].slice(0, 4);
}
