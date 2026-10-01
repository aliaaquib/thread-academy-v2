/**
 * THE SUBJECT LIST — every subject on the site lives here.
 *
 * To add a subject: copy one block, change slug / name / icon / category /
 * tagline / intro / learn, then also add its chapters to stage-chapters.ts
 * and its grade mapping to grades.ts.
 * To remove a subject: delete its whole block here, plus its blocks in
 * stage-chapters.ts and grades.ts, plus its folder under content/subject/.
 */
import type { Subject, SubjectCategory } from "./types";
import type { Lang } from "./i18n";
import { getOverlay } from "./i18n";

/**
 * Subjects, grouped by category. Chapters are subject-level outlines;
 * the actual lessons (topics) live per chapter under content/.
 */
export const SUBJECTS: Record<string, Subject> = {
  mathematics: {
    slug: "mathematics",
    name: "Mathematics",
    icon: "📐",
    category: "STEM",
    tagline: "The language of patterns — from algebra to geometry.",
    intro:
      "Mathematics trains you to reason precisely. Start with number and arithmetic, master algebra — the art of working with unknowns — then explore geometry, statistics and probability, where patterns and chance follow strict, beautiful rules.",
    learn: [
      "Number systems and arithmetic fluency",
      "Algebraic expressions, equations and functions",
      "Angles, shapes and geometric reasoning",
      "Statistics: collecting, presenting and interpreting data",
      "Probability: measuring uncertainty",
    ],
    chapters: [
      { id: "number-arithmetic", title: "Number & Arithmetic", desc: "Number systems, fractions, decimals, percentages and the rules of arithmetic." },
      { id: "algebra", title: "Algebra", desc: "Letters that stand for numbers — expressions, equations and functions." },
      { id: "geometry", title: "Geometry", desc: "Angles, shapes, area, perimeter and the logic of space." },
      { id: "statistics", title: "Statistics", desc: "Data done properly: averages, charts and what they really mean." },
      { id: "probability", title: "Probability", desc: "Chance, likelihood and the mathematics of uncertainty." },
    ],
  },
  physics: {
    slug: "physics",
    name: "Physics",
    icon: "⚛️",
    category: "STEM",
    tagline: "The rules the universe plays by.",
    intro:
      "Physics is the study of matter, energy and how they interact. From the forces that move a football to the waves that carry light, you'll learn to describe the physical world with precision — and to predict what happens next.",
    learn: [
      "Forces, motion and Newton's laws",
      "Energy transfers and conservation",
      "Waves, light and sound",
      "Electricity and circuits",
      "Solving problems with equations and graphs",
    ],
    chapters: [
      { id: "forces", title: "Forces", desc: "Pushes, pulls and Newton's three laws of motion." },
      { id: "motion", title: "Motion", desc: "Speed, velocity, acceleration and describing movement with graphs." },
      { id: "energy", title: "Energy", desc: "Kinetic, potential and the conservation of energy." },
      { id: "waves", title: "Waves", desc: "Wave properties, sound and the electromagnetic spectrum." },
      { id: "electricity", title: "Electricity", desc: "Current, voltage, resistance and simple circuits." },
    ],
  },
  chemistry: {
    slug: "chemistry",
    name: "Chemistry",
    icon: "🧪",
    category: "STEM",
    tagline: "What stuff is made of — and why it reacts.",
    intro:
      "Chemistry explains the material world: the atoms everything is built from, how they bond into molecules, and why substances transform in reactions. You'll move from particles you can't see to predictions you can test.",
    learn: [
      "Atomic structure and the periodic table",
      "Chemical bonding and structure",
      "Representing and balancing reactions",
      "Acids, bases and rates of reaction",
      "Quantitative chemistry: moles and calculations",
    ],
    chapters: [
      { id: "atomic-structure", title: "Atomic Structure", desc: "Atoms, elements and the particles inside them." },
      { id: "periodic-table", title: "The Periodic Table", desc: "How the elements are organised — and why the pattern matters." },
      { id: "chemical-bonding", title: "Chemical Bonding", desc: "Ionic, covalent and metallic bonds: how atoms hold together." },
      { id: "chemical-changes", title: "Chemical Changes", desc: "Reactions, acids and bases, and the energy changes involved." },
      { id: "quantitative-chemistry", title: "Quantitative Chemistry", desc: "Moles, masses and doing the maths of reactions." },
    ],
  },
  biology: {
    slug: "biology",
    name: "Biology",
    icon: "🧬",
    category: "STEM",
    tagline: "The science of living things.",
    intro:
      "Biology is the study of life — from the microscopic machinery inside a single cell to entire ecosystems. You'll learn how living things are built, how they work, and how they interact with each other and their environment.",
    learn: [
      "Cell structure and organisation",
      "How the human body systems work",
      "Photosynthesis and respiration",
      "Inheritance, variation and evolution",
      "Ecology: organisms and their environment",
    ],
    chapters: [
      { id: "cell-biology", title: "Cell Biology", desc: "The building blocks of life: cells, organelles and microscopes." },
      { id: "organisation", title: "Organisation", desc: "From cells to tissues, organs and body systems." },
      { id: "bioenergetics", title: "Bioenergetics", desc: "Photosynthesis and respiration: how life gets its energy." },
      { id: "genetics", title: "Inheritance & Genetics", desc: "DNA, genes and how traits pass between generations." },
      { id: "ecology", title: "Ecology", desc: "Ecosystems, food webs and the human impact on the environment." },
    ],
  },
  "computer-science": {
    slug: "computer-science",
    name: "Computer Science",
    icon: "💻",
    category: "STEM",
    tagline: "How computers think — and how to make them do what you want.",
    intro:
      "Computer Science is about solving problems precisely. You'll learn how to break problems down, write programs in Python, and understand the ideas — from variables to functions — that every piece of software is built on.",
    learn: [
      "Computational thinking and decomposition",
      "Python programming from first principles",
      "Variables, data types and operators",
      "Conditions, loops and functions",
      "Algorithms and how data is represented",
    ],
    chapters: [
      { id: "computational-thinking", title: "Computational Thinking", desc: "The problem-solving mindset behind every program." },
      { id: "programming", title: "Programming Fundamentals", desc: "Python from zero: variables, data, logic, loops and functions." },
      { id: "algorithms", title: "Algorithms", desc: "Designing step-by-step solutions: searching, sorting and efficiency." },
      { id: "data-representation", title: "Data Representation", desc: "Binary, text, images and sound: how computers store everything." },
    ],
  },
  history: {
    slug: "history",
    name: "History",
    icon: "🏛️",
    category: "HUMANITIES",
    tagline: "What happened — and why it still matters.",
    intro:
      "History is the study of how the modern world was made. You'll investigate revolutions and empires, learn to weigh evidence like a historian, and practise building arguments from sources rather than opinions.",
    learn: [
      "Key turning points from the industrial era to today",
      "Causes, consequences and historical significance",
      "Working with sources: reliability and bias",
      "Building evidence-based arguments",
      "Connecting past events to the present",
    ],
    chapters: [
      { id: "modern-world", title: "The Modern World", desc: "Industrialisation, empire and the forces that shaped today." },
      { id: "twentieth-century", title: "The Twentieth Century", desc: "World wars, cold war and decolonisation." },
      { id: "source-skills", title: "Working with Sources", desc: "How historians use evidence: provenance, bias and reliability." },
    ],
  },
  geography: {
    slug: "geography",
    name: "Geography",
    icon: "🌍",
    category: "HUMANITIES",
    tagline: "The planet, its people and the forces connecting them.",
    intro:
      "Geography connects the physical planet with human life. You'll study rivers and coasts alongside cities and development, learning to explain patterns — and to evaluate the big challenges facing the world.",
    learn: [
      "Physical processes: rivers, coasts and tectonics",
      "Weather, climate and climate change",
      "Population, migration and urbanisation",
      "Development and global inequality",
      "Geographical skills: maps, data and fieldwork",
    ],
    chapters: [
      { id: "physical-geography", title: "Physical Geography", desc: "Rivers, coasts and the processes that sculpt landscapes." },
      { id: "weather-climate", title: "Weather & Climate", desc: "What drives our atmosphere — and how the climate is changing." },
      { id: "human-geography", title: "Human Geography", desc: "People, cities, development and global connections." },
    ],
  },
  economics: {
    slug: "economics",
    name: "Economics",
    icon: "📊",
    category: "HUMANITIES",
    tagline: "How choices, markets and money shape the world.",
    intro:
      "Economics studies how people, businesses and governments make choices when resources are scarce. From the price of bread to national inflation, you'll learn the models economists use — and their limits.",
    learn: [
      "Supply, demand and how prices are set",
      "Market structures and competition",
      "Inflation, unemployment and growth",
      "Government policy: fiscal and monetary tools",
      "Reading data and evaluating arguments",
    ],
    chapters: [
      { id: "microeconomics", title: "Microeconomics", desc: "Individual markets: supply, demand and the choices of firms and consumers." },
      { id: "macroeconomics", title: "Macroeconomics", desc: "Whole economies: growth, inflation, unemployment and policy." },
    ],
  },
  english: {
    slug: "english",
    name: "English",
    icon: "📚",
    category: "LANGUAGES",
    tagline: "Read deeply. Write clearly. Argue well.",
    intro:
      "English builds the two skills everything else depends on: understanding what you read and expressing what you think. You'll analyse texts, craft essays and stories, and master the mechanics of powerful sentences.",
    learn: [
      "Reading for meaning: theme, character and writer's craft",
      "Writing essays with clear, supported arguments",
      "Creative writing: stories that hold attention",
      "Grammar, vocabulary and sentence craft",
      "Comparing texts and evaluating viewpoints",
    ],
    chapters: [
      { id: "reading-skills", title: "Reading Skills", desc: "Understanding texts: theme, character, language and structure." },
      { id: "writing-skills", title: "Writing Skills", desc: "Essays, stories and arguments that land." },
      { id: "grammar-vocabulary", title: "Grammar & Vocabulary", desc: "The mechanics of powerful sentences." },
    ],
  },
  "psychology": {
    slug: "psychology",
    name: "Psychology",
    icon: "🧠",
    category: "HUMANITIES",
    tagline: "Why people think, feel and behave the way they do.",
    intro:
      "Psychology is the science of mind and behaviour. You’ll learn how memory works, why we conform, what emotions are for — and how psychologists know what they claim to know.",
    learn: [
      "How memory encodes, stores and retrieves",
      "The psychology of conformity and obedience",
      "Emotions, stress and mental health",
      "How children develop and learn",
      "Research methods: experiments, ethics, evidence",
    ],
    chapters: [
      { id: "mind-memory", title: "Mind and Memory", desc: "How we remember — and why we forget." },
      { id: "social-behaviour", title: "Social Behaviour", desc: "How other people shape what we do." },
      { id: "development", title: "Development", desc: "How minds grow from childhood on." },
    ],
  },
  "sociology": {
    slug: "sociology",
    name: "Sociology",
    icon: "👥",
    category: "HUMANITIES",
    tagline: "How societies shape the people in them.",
    intro:
      "Sociology studies the invisible forces — norms, institutions, inequality — that shape billions of lives. You’ll learn to see the social patterns behind personal troubles.",
    learn: [
      "What sociology studies and how",
      "Culture, norms and socialisation",
      "Class, inequality and social mobility",
      "Gender, race and identity",
      "How societies change",
    ],
    chapters: [
      { id: "foundations", title: "Foundations", desc: "What sociology is and how it thinks." },
      { id: "culture-identity", title: "Culture and Identity", desc: "Norms, socialisation and who we become." },
      { id: "inequality", title: "Inequality", desc: "Class, mobility and who gets what." },
    ],
  },
  "political-science": {
    slug: "political-science",
    name: "Political Science",
    icon: "🏛️",
    category: "HUMANITIES",
    tagline: "Power, government and how decisions get made.",
    intro:
      "Political science studies who gets what, when and how. You’ll learn how governments work, why democracies wobble, and how ordinary people can shape the decisions that shape them.",
    learn: [
      "What politics is and where power lives",
      "Democracy: how it works and why it matters",
      "Political ideologies from left to right",
      "Elections, parties and voting systems",
      "International relations and global power",
    ],
    chapters: [
      { id: "power-politics", title: "Power and Politics", desc: "What politics really is." },
      { id: "democracy", title: "Democracy", desc: "How democracies work — and why they’re fragile." },
      { id: "global-politics", title: "Global Politics", desc: "Nations, power and cooperation." },
    ],
  },
  "russian": {
    slug: "russian",
    name: "Russian",
    icon: "🇷🇺",
    category: "LANGUAGES",
    tagline: "Привет! From Tolstoy to space stations.",
    intro:
      "Russian uses the Cyrillic alphabet — learned in a weekend — and opens up 260 million speakers, great literature, and a rich scientific tradition.",
    learn: [
      "The Cyrillic alphabet",
      "Pronunciation and stress",
      "Greetings and introductions",
      "Basic grammar: nouns and verbs",
      "Numbers, time and everyday phrases",
    ],
    chapters: [
      { id: "cyrillic", title: "Cyrillic", desc: "The alphabet in a weekend." },
      { id: "first-steps", title: "First Steps", desc: "Greetings and basic grammar." },
      { id: "daily-russian", title: "Daily Russian", desc: "Numbers, time and everyday phrases." },
    ],
  },
};

export const SUBJECT_SLUGS = Object.keys(SUBJECTS);

export const CATEGORY_ORDER: SubjectCategory[] = ["STEM", "HUMANITIES", "LANGUAGES"];

export function subjectsByCategory(category: SubjectCategory, lang: Lang = "en"): Subject[] {
  return SUBJECT_SLUGS.map((s) => getSubject(s, lang)).filter(
    (s): s is Subject => !!s && s.category === category,
  );
}

export function getSubject(slug: string, lang: Lang = "en"): Subject | null {
  const base = SUBJECTS[slug];
  if (!base) return null;
  if (lang === "en") return base;
  // Teacher-written translations overlay the English text; anything missing
  // falls back to English rather than inventing content.
  const overlay = getOverlay(lang);
  const o = overlay?.subjects[slug];
  const chapterOverlays = overlay?.chapters;
  const chapters = chapterOverlays
    ? base.chapters.map((c) => {
        const co = chapterOverlays[c.id];
        return co ? { ...c, title: co.title ?? c.title, desc: co.desc ?? c.desc } : c;
      })
    : base.chapters;
  return {
    ...base,
    name: o?.name ?? base.name,
    tagline: o?.tagline ?? base.tagline,
    intro: o?.intro ?? base.intro,
    learn: o?.learn ?? base.learn,
    chapters,
  };
}

export function getChapter(subjectSlug: string, chapterId: string) {
  const subject = getSubject(subjectSlug);
  if (!subject) return null;
  return subject.chapters.find((c) => c.id === chapterId) ?? null;
}
