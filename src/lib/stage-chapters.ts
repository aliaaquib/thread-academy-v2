/**
 * CHAPTER NAMES — every chapter's display title and description, per subject.
 *
 * To rename a chapter: change its `title` here (keep the `id` the same so
 * links don't break). To add a chapter: add a line to the right subject and
 * band below, then add the chapter id to grades.ts and its topics to
 * chapters.ts. Bands run easiest -> hardest: foundations, developing,
 * examination, advanced.
 */
import type { Chapter } from "./types";
import { getSubject } from "./subjects";

/**
 * Chapter sets per subject — the data behind the Subject → Chapters flow.
 * Every subject defines its own chapters per band (foundations → developing
 * → examination → advanced); the subject page merges the four bands into one
 * ordered chapter list, deduplicated by chapter id. Bands holding a subject's
 * published MDX lessons reuse that subject's existing chapter ids, keeping
 * every lesson link working.
 */

export type Band = "foundations" | "developing" | "examination" | "advanced";

/** Band order for the merged per-subject chapter list. */
const BAND_ORDER: Band[] = ["foundations", "developing", "examination", "advanced"];

export const BAND_CHAPTERS: Record<string, Record<Band, Chapter[]>> = {
  "biology": {
    "foundations": [
      { id: "living-things", title: "Living Things", desc: "What makes something alive? Explore habitats near you." },
      { id: "plants", title: "Plants", desc: "What plants need to grow and stay healthy." },
      { id: "animals-humans", title: "Animals and Humans", desc: "Senses, skeletons and how to stay healthy." },
    ],
    "developing": [
      { id: "cell-biology", title: "Cell Biology", desc: "The building blocks of life: cells, organelles and microscopes." },
      { id: "organisation", title: "Organisation", desc: "From cells to tissues, organs and body systems." },
      { id: "reproduction", title: "Reproduction", desc: "Life cycles in plants, animals and humans." },
      { id: "health-disease", title: "Health and Disease", desc: "Pathogens, immunity and healthy lifestyles." },
    ],
    "examination": [
      { id: "cell-biology", title: "Cell Biology", desc: "The building blocks of life: cells, organelles and microscopes." },
      { id: "organisation", title: "Organisation", desc: "From cells to tissues, organs and body systems." },
      { id: "bioenergetics", title: "Bioenergetics", desc: "Photosynthesis and respiration: how life gets its energy." },
      { id: "genetics", title: "Inheritance & Genetics", desc: "DNA, genes and how traits pass between generations." },
      { id: "ecology", title: "Ecology", desc: "Ecosystems, food webs and the human impact on the environment." },
    ],
    "advanced": [
      { id: "biochemistry", title: "Biochemistry", desc: "The molecules of life: proteins, enzymes and DNA." },
      { id: "physiology", title: "Human Physiology", desc: "Nervous and hormonal control in depth." },
      { id: "evolution", title: "Evolution", desc: "Natural selection, speciation and the evidence." },
    ],
  },
  "chemistry": {
    "foundations": [
      { id: "sorting-materials", title: "Sorting Materials", desc: "Grouping everyday materials by their properties." },
      { id: "solids-liquids", title: "Solids and Liquids", desc: "What happens when materials are heated or cooled." },
      { id: "mixtures", title: "Mixtures", desc: "Separating mixtures by filtering, sieving and evaporating." },
    ],
    "developing": [
      { id: "particles", title: "Particles", desc: "Everything is made of tiny particles that are always moving." },
      { id: "atomic-structure", title: "Atomic Structure", desc: "Atoms, elements and the particles inside them." },
      { id: "periodic-table", title: "The Periodic Table", desc: "How the elements are organised — and why the pattern matters." },
      { id: "acids-alkalis", title: "Acids and Alkalis", desc: "The pH scale, indicators and neutralisation." },
    ],
    "examination": [
      { id: "atomic-structure", title: "Atomic Structure", desc: "Atoms, elements and the particles inside them." },
      { id: "periodic-table", title: "The Periodic Table", desc: "How the elements are organised — and why the pattern matters." },
      { id: "chemical-bonding", title: "Chemical Bonding", desc: "Ionic, covalent and metallic bonds: how atoms hold together." },
      { id: "chemical-changes", title: "Chemical Changes", desc: "Reactions, acids and bases, and the energy changes involved." },
      { id: "quantitative-chemistry", title: "Quantitative Chemistry", desc: "Moles, masses and doing the maths of reactions." },
    ],
    "advanced": [
      { id: "physical-chemistry", title: "Physical Chemistry", desc: "Energetics, reaction rates and equilibria." },
      { id: "organic-chemistry", title: "Organic Chemistry", desc: "Carbon compounds, mechanisms and synthesis." },
      { id: "analytical-chemistry", title: "Analytical Techniques", desc: "Spectroscopy and chemical tests for substances." },
    ],
  },
  "computer-science": {
    "foundations": [
      { id: "algorithms-unplugged", title: "Algorithms Without Computers", desc: "Give precise step-by-step instructions to solve tasks." },
      { id: "staying-safe-online", title: "Staying Safe Online", desc: "Passwords, privacy and kind communication." },
      { id: "creating-media", title: "Creating Digital Media", desc: "Make simple presentations, images and animations." },
    ],
    "developing": [
      { id: "computational-thinking", title: "Computational Thinking", desc: "The problem-solving mindset behind every program." },
      { id: "programming", title: "Programming Fundamentals", desc: "Python from zero: variables, data, logic, loops and functions." },
      { id: "data-representation", title: "Data Representation", desc: "Binary, text, images and sound: how computers store everything." },
      { id: "networks", title: "Networks", desc: "How computers connect and share information." },
    ],
    "examination": [
      { id: "computational-thinking", title: "Computational Thinking", desc: "The problem-solving mindset behind every program." },
      { id: "programming", title: "Programming Fundamentals", desc: "Python from zero: variables, data, logic, loops and functions." },
      { id: "algorithms", title: "Algorithms", desc: "Designing step-by-step solutions: searching, sorting and efficiency." },
      { id: "data-representation", title: "Data Representation", desc: "Binary, text, images and sound: how computers store everything." },
    ],
    "advanced": [
      { id: "data-structures", title: "Data Structures", desc: "Stacks, queues, trees and graphs." },
      { id: "databases-sql", title: "Databases and SQL", desc: "Design tables and query them with SQL." },
      { id: "ai-ethics", title: "AI and Ethics", desc: "How machine learning works and using it responsibly." },
    ],
  },
  "economics": {
    "foundations": [
      { id: "needs-wants", title: "Needs and Wants", desc: "Why we cannot have everything we want." },
      { id: "money", title: "Money", desc: "What money is and how we use it every day." },
      { id: "jobs-work", title: "Jobs and Work", desc: "Different jobs and why people work." },
    ],
    "developing": [
      { id: "microeconomics", title: "Microeconomics", desc: "Individual markets: supply, demand and the choices of firms and consumers." },
      { id: "markets", title: "Markets", desc: "How buyers and sellers together set prices." },
      { id: "government-economy", title: "Government and the Economy", desc: "Taxes, spending and public services." },
    ],
    "examination": [
      { id: "microeconomics", title: "Microeconomics", desc: "Individual markets: supply, demand and the choices of firms and consumers." },
      { id: "macroeconomics", title: "Macroeconomics", desc: "Whole economies: growth, inflation, unemployment and policy." },
    ],
    "advanced": [
      { id: "behavioural-economics", title: "Behavioural Economics", desc: "How psychology shapes economic choices." },
      { id: "international-trade", title: "International Trade", desc: "Exchange rates, tariffs and globalisation." },
      { id: "development-economics", title: "Development Economics", desc: "Growth, poverty and inequality." },
    ],
  },
  "english": {
    "foundations": [
      { id: "phonics", title: "Phonics", desc: "Letter sounds and blending them to read words." },
      { id: "story-time", title: "Story Time", desc: "Listening to stories and retelling them." },
      { id: "handwriting", title: "Handwriting", desc: "Forming letters clearly and correctly." },
    ],
    "developing": [
      { id: "reading-skills", title: "Reading Skills", desc: "Understanding texts: theme, character, language and structure." },
      { id: "spoken-language", title: "Spoken Language", desc: "Presenting and discussing with confidence." },
      { id: "grammar-vocabulary", title: "Grammar & Vocabulary", desc: "The mechanics of powerful sentences." },
    ],
    "examination": [
      { id: "reading-skills", title: "Reading Skills", desc: "Understanding texts: theme, character, language and structure." },
      { id: "writing-skills", title: "Writing Skills", desc: "Essays, stories and arguments that land." },
      { id: "grammar-vocabulary", title: "Grammar & Vocabulary", desc: "The mechanics of powerful sentences." },
    ],
    "advanced": [
      { id: "literature", title: "Literature", desc: "Shakespeare, novels and poetry in depth." },
      { id: "language-analysis", title: "Language Analysis", desc: "How writers craft meaning." },
      { id: "rhetoric", title: "Rhetoric", desc: "The art of persuasive speaking and writing." },
    ],
  },
  "geography": {
    "foundations": [
      { id: "my-place", title: "My Place", desc: "Maps of your classroom, school and neighbourhood." },
      { id: "weather-seasons", title: "Weather and Seasons", desc: "Observe and record the daily weather." },
      { id: "continents-oceans", title: "Continents and Oceans", desc: "The seven continents and five oceans." },
    ],
    "developing": [
      { id: "physical-geography", title: "Physical Geography", desc: "Rivers, coasts and the processes that sculpt landscapes." },
      { id: "weather-climate", title: "Weather & Climate", desc: "What drives our atmosphere — and how the climate is changing." },
      { id: "map-skills", title: "Map Skills", desc: "Grid references, scale and map symbols." },
    ],
    "examination": [
      { id: "physical-geography", title: "Physical Geography", desc: "Rivers, coasts and the processes that sculpt landscapes." },
      { id: "weather-climate", title: "Weather & Climate", desc: "What drives our atmosphere — and how the climate is changing." },
      { id: "human-geography", title: "Human Geography", desc: "People, cities, development and global connections." },
    ],
    "advanced": [
      { id: "coasts", title: "Coastal Systems", desc: "Erosion, deposition and managing coasts." },
      { id: "urbanisation", title: "Urbanisation", desc: "Why cities grow and how they change." },
      { id: "global-development", title: "Development", desc: "Measuring and explaining global inequality." },
    ],
  },
  "history": {
    "foundations": [
      { id: "my-history", title: "My History", desc: "Timelines of your own life and family." },
      { id: "toys-past", title: "Toys from the Past", desc: "How everyday objects have changed over time." },
      { id: "great-events", title: "Great Events", desc: "Famous people and events that shaped nations." },
    ],
    "developing": [
      { id: "modern-world", title: "The Modern World", desc: "Industrialisation, empire and the forces that shaped today." },
      { id: "empire-industry", title: "Empire and Industry", desc: "The industrial revolution and its global reach." },
      { id: "source-skills", title: "Working with Sources", desc: "How historians use evidence: provenance, bias and reliability." },
    ],
    "examination": [
      { id: "modern-world", title: "The Modern World", desc: "Industrialisation, empire and the forces that shaped today." },
      { id: "twentieth-century", title: "The Twentieth Century", desc: "World wars, cold war and decolonisation." },
      { id: "source-skills", title: "Working with Sources", desc: "How historians use evidence: provenance, bias and reliability." },
    ],
    "advanced": [
      { id: "historiography", title: "Historiography", desc: "How historians argue about the past." },
      { id: "cold-war", title: "The Cold War", desc: "Superpower rivalry and how it ended." },
      { id: "decolonisation", title: "Decolonisation", desc: "Independence movements across the world." },
    ],
  },
  "mathematics": {
    "foundations": [
      { id: "counting", title: "Counting", desc: "Count, order and compare whole numbers with confidence." },
      { id: "addition-subtraction", title: "Addition and Subtraction", desc: "Add and subtract using objects, pictures and number lines." },
      { id: "shapes-measures", title: "Shapes and Measures", desc: "Recognise common shapes and compare length, weight and capacity." },
      { id: "fractions-first", title: "First Fractions", desc: "Halves and quarters of shapes and small quantities." },
    ],
    "developing": [
      { id: "number-arithmetic", title: "Number & Arithmetic", desc: "Number systems, fractions, decimals, percentages and the rules of arithmetic." },
      { id: "algebra", title: "Algebra", desc: "Letters that stand for numbers — expressions, equations and functions." },
      { id: "ratio-proportion", title: "Ratio and Proportion", desc: "Ratios, scale factors and proportional reasoning." },
      { id: "geometry", title: "Geometry", desc: "Angles, shapes, area, perimeter and the logic of space." },
      { id: "statistics", title: "Statistics", desc: "Data done properly: averages, charts and what they really mean." },
    ],
    "examination": [
      { id: "number-arithmetic", title: "Number & Arithmetic", desc: "Number systems, fractions, decimals, percentages and the rules of arithmetic." },
      { id: "algebra", title: "Algebra", desc: "Letters that stand for numbers — expressions, equations and functions." },
      { id: "geometry", title: "Geometry", desc: "Angles, shapes, area, perimeter and the logic of space." },
      { id: "statistics", title: "Statistics", desc: "Data done properly: averages, charts and what they really mean." },
      { id: "probability", title: "Probability", desc: "Chance, likelihood and the mathematics of uncertainty." },
    ],
    "advanced": [
      { id: "pure-mathematics", title: "Pure Mathematics", desc: "Functions, sequences and an introduction to calculus." },
      { id: "mechanics", title: "Mechanics", desc: "Kinematics, forces and Newton's laws applied to motion." },
      { id: "further-statistics", title: "Further Statistics", desc: "Distributions, hypothesis testing and regression." },
    ],
  },
  "physics": {
    "foundations": [
      { id: "pushes-pulls", title: "Pushes and Pulls", desc: "How pushes and pulls can change how things move." },
      { id: "everyday-materials", title: "Everyday Materials", desc: "Sorting materials by what they feel and look like." },
      { id: "light-shadows", title: "Light and Shadows", desc: "Light sources and how shadows are formed." },
    ],
    "developing": [
      { id: "forces", title: "Forces", desc: "Pushes, pulls and Newton's three laws of motion." },
      { id: "motion", title: "Motion", desc: "Speed, velocity, acceleration and describing movement with graphs." },
      { id: "energy", title: "Energy", desc: "Kinetic, potential and the conservation of energy." },
      { id: "sound", title: "Sound", desc: "How vibrations make sounds that travel to our ears." },
    ],
    "examination": [
      { id: "forces", title: "Forces", desc: "Pushes, pulls and Newton's three laws of motion." },
      { id: "motion", title: "Motion", desc: "Speed, velocity, acceleration and describing movement with graphs." },
      { id: "energy", title: "Energy", desc: "Kinetic, potential and the conservation of energy." },
      { id: "waves", title: "Waves", desc: "Wave properties, sound and the electromagnetic spectrum." },
      { id: "electricity", title: "Electricity", desc: "Current, voltage, resistance and simple circuits." },
    ],
    "advanced": [
      { id: "further-mechanics", title: "Further Mechanics", desc: "Circular motion, oscillations and momentum in depth." },
      { id: "fields", title: "Fields", desc: "Gravitational, electric and magnetic fields." },
      { id: "particle-physics", title: "Particle Physics", desc: "The standard model and ideas from quantum physics." },
    ],
  },
  "political-science": {
    "foundations": [
      { id: "rules", title: "Rules", desc: "Why we have rules at home and at school." },
      { id: "leaders", title: "Leaders", desc: "Who makes decisions and how they are chosen." },
      { id: "voting", title: "Voting", desc: "Choosing fairly, together." },
    ],
    "developing": [
      { id: "power-politics", title: "Power and Politics", desc: "What politics really is." },
      { id: "democracy", title: "Democracy", desc: "How democracies work — and why they’re fragile." },
      { id: "rights", title: "Rights", desc: "Human rights and why they matter." },
    ],
    "examination": [
      { id: "power-politics", title: "Power and Politics", desc: "What politics really is." },
      { id: "democracy", title: "Democracy", desc: "How democracies work — and why they’re fragile." },
      { id: "global-politics", title: "Global Politics", desc: "Nations, power and cooperation." },
    ],
    "advanced": [
      { id: "power-politics", title: "Power and Politics", desc: "What politics really is." },
      { id: "democracy", title: "Democracy", desc: "How democracies work — and why they’re fragile." },
      { id: "global-politics", title: "Global Politics", desc: "Nations, power and cooperation." },
    ],
  },
  "psychology": {
    "foundations": [
      { id: "feelings", title: "Feelings", desc: "Naming and understanding our emotions." },
      { id: "friendship", title: "Friendship", desc: "Getting along with other people." },
      { id: "growing-minds", title: "Growing Minds", desc: "How we learn new things every day." },
    ],
    "developing": [
      { id: "mind-memory", title: "Mind and Memory", desc: "How we remember — and why we forget." },
      { id: "social-behaviour", title: "Social Behaviour", desc: "How other people shape what we do." },
      { id: "the-brain", title: "The Brain", desc: "Neurons and how the brain works." },
    ],
    "examination": [
      { id: "mind-memory", title: "Mind and Memory", desc: "How we remember — and why we forget." },
      { id: "social-behaviour", title: "Social Behaviour", desc: "How other people shape what we do." },
      { id: "development", title: "Development", desc: "How minds grow from childhood on." },
    ],
    "advanced": [
      { id: "mind-memory", title: "Mind and Memory", desc: "How we remember — and why we forget." },
      { id: "social-behaviour", title: "Social Behaviour", desc: "How other people shape what we do." },
      { id: "development", title: "Development", desc: "How minds grow from childhood on." },
    ],
  },
  "russian": {
    "foundations": [
      { id: "russian-sounds", title: "The Cyrillic Alphabet", desc: "Meet the letters of the Russian alphabet." },
      { id: "russian-greetings", title: "Greetings", desc: "Say hello, goodbye and introduce yourself in Russian." },
      { id: "russian-numbers", title: "Numbers and Colours", desc: "Count and describe the world around you in Russian." },
    ],
    "developing": [
      { id: "cyrillic", title: "Cyrillic", desc: "The alphabet in a weekend." },
      { id: "russian-my-world", title: "My World", desc: "Family, friends, school and hobbies in Russian." },
      { id: "first-steps", title: "First Steps", desc: "Greetings and basic grammar." },
    ],
    "examination": [
      { id: "cyrillic", title: "Cyrillic", desc: "The alphabet in a weekend." },
      { id: "first-steps", title: "First Steps", desc: "Greetings and basic grammar." },
      { id: "daily-russian", title: "Daily Russian", desc: "Numbers, time and everyday phrases." },
    ],
    "advanced": [
      { id: "russian-literature", title: "Literature and Film", desc: "Stories, poems and films in Russian." },
      { id: "russian-advanced-grammar", title: "Advanced Grammar", desc: "Complex sentences and refined expression in Russian." },
      { id: "russian-culture", title: "Culture and Society", desc: "Daily life and traditions across the Russian-speaking world." },
    ],
  },
  "sociology": {
    "foundations": [
      { id: "families", title: "Families", desc: "Different kinds of families around the world." },
      { id: "school-society", title: "School and Society", desc: "Rules, roles and belonging." },
      { id: "communities", title: "Communities", desc: "Where we live and who helps us." },
    ],
    "developing": [
      { id: "foundations", title: "Foundations", desc: "What sociology is and how it thinks." },
      { id: "culture-identity", title: "Culture and Identity", desc: "Norms, socialisation and who we become." },
      { id: "socialisation", title: "Socialisation", desc: "How we learn to be part of society." },
    ],
    "examination": [
      { id: "foundations", title: "Foundations", desc: "What sociology is and how it thinks." },
      { id: "culture-identity", title: "Culture and Identity", desc: "Norms, socialisation and who we become." },
      { id: "inequality", title: "Inequality", desc: "Class, mobility and who gets what." },
    ],
    "advanced": [
      { id: "foundations", title: "Foundations", desc: "What sociology is and how it thinks." },
      { id: "culture-identity", title: "Culture and Identity", desc: "Norms, socialisation and who we become." },
      { id: "inequality", title: "Inequality", desc: "Class, mobility and who gets what." },
    ],
  },
};

/** Chapters for a subject: the four bands merged into one ordered list,
 *  deduplicated by chapter id (first band wins). Falls back to the
 *  subject's default chapter list when no band data exists. */
export function getChaptersForSubject(subjectSlug: string): Chapter[] {
  const byBand = BAND_CHAPTERS[subjectSlug];
  if (byBand) {
    const seen = new Set<string>();
    const merged: Chapter[] = [];
    for (const band of BAND_ORDER) {
      for (const chapter of byBand[band] ?? []) {
        if (!seen.has(chapter.id)) {
          seen.add(chapter.id);
          merged.push(chapter);
        }
      }
    }
    if (merged.length > 0) return merged;
  }
  return getSubject(subjectSlug)?.chapters ?? [];
}

/** Find one chapter within a subject. Checks the merged band chapters
 *  first, then the subject's default chapters. */
export function getChapterForSubject(subjectSlug: string, chapterId: string): Chapter | null {
  const inBands = getChaptersForSubject(subjectSlug).find((c) => c.id === chapterId);
  if (inBands) return inBands;
  return getSubject(subjectSlug)?.chapters.find((c) => c.id === chapterId) ?? null;
}
