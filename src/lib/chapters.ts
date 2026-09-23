import type { Topic } from "./types";
import { EXTRA_TOPICS } from "./chapter-topics-extra";

/**
 * Topics per chapter. Keyed by chapter id (globally unique).
 * A topic becomes a real page when its MDX file exists at
 * content/<curriculum>/<level>/<subject>/<chapter>/<topic>.mdx —
 * adding a topic = adding an entry here + the MDX file, never rewriting components.
 */
export const CHAPTER_TOPICS: Record<string, Topic[]> = {
  algebra: [
    { slug: "introduction", title: "Introduction to Algebra", desc: "What algebra is and why letters beat numbers." },
    { slug: "variables", title: "Variables", desc: "Named boxes that store values you can reuse and change." },
    { slug: "expressions", title: "Expressions", desc: "Simplifying, expanding and collecting like terms." },
    { slug: "linear-equations", title: "Linear Equations", desc: "Solve for x: one step, two steps, both sides." },
    { slug: "quadratic-equations", title: "Quadratic Equations", desc: "When x² appears: factorising and the quadratic formula." },
    { slug: "functions", title: "Functions", desc: "Machines that turn inputs into outputs." },
  ],
  "number-arithmetic": [],
  geometry: [],
  statistics: [],
  probability: [],
  forces: [
    { slug: "newtons-laws", title: "Newton's Laws of Motion", desc: "The three laws that govern how everything moves." },
  ],
  motion: [],
  energy: [],
  waves: [],
  electricity: [],
  "atomic-structure": [
    { slug: "atoms-and-elements", title: "Atoms and Elements", desc: "Protons, neutrons, electrons — and what makes an element." },
  ],
  "periodic-table": [],
  "chemical-bonding": [],
  "chemical-changes": [],
  "quantitative-chemistry": [],
  "cell-biology": [
    { slug: "cell-structure", title: "Cell Structure", desc: "Meet the organelles: the tiny machines inside every cell." },
  ],
  organisation: [],
  bioenergetics: [],
  genetics: [],
  ecology: [],
  "computational-thinking": [],
  programming: [
    { slug: "variables", title: "Variables", desc: "A named box that stores a value — in real, runnable Python." },
  ],
  algorithms: [],
  "data-representation": [],
  "reading-skills": [
    { slug: "understanding-theme", title: "Understanding Theme", desc: "Find the big idea hiding inside a text." },
  ],
  "writing-skills": [],
  "grammar-vocabulary": [],
  "modern-world": [
    { slug: "industrial-revolution", title: "The Industrial Revolution", desc: "How steam, coal and factories remade the world." },
  ],
  "twentieth-century": [],
  "source-skills": [],
  "physical-geography": [
    { slug: "rivers-and-erosion", title: "Rivers and Erosion", desc: "How flowing water sculpts the land." },
  ],
  "weather-climate": [],
  "human-geography": [],
  microeconomics: [
    { slug: "supply-and-demand", title: "Supply and Demand", desc: "The two curves that set nearly every price." },
  ],
  macroeconomics: [],
  "business-basics": [
    { slug: "what-is-a-business", title: "What is a Business?", desc: "Enterprise, needs and wants, and the four factors of production." },
  ],
  marketing: [],
  finance: [],
  "spanish-basics": [
    { slug: "greetings", title: "Greetings and Introductions", desc: "Your first Spanish: hola, me llamo… and more." },
  ],
  "spanish-grammar": [],
  "french-basics": [
    { slug: "greetings", title: "Greetings and Introductions", desc: "Your first French: bonjour, je m'appelle… and more." },
  ],
  "french-grammar": [],
  ecosystems: [
    { slug: "what-is-an-ecosystem", title: "What Is an Ecosystem?", desc: "Biotic, abiotic, and the flows that connect them." },
    { slug: "food-webs", title: "Food Chains and Food Webs", desc: "Who eats whom — and what happens when a link breaks." },
  ],
  "human-impact": [
    { slug: "pollution", title: "Pollution", desc: "Air, water and land: where pollution comes from and what it does." },
    { slug: "climate-change", title: "Climate Change", desc: "The greenhouse effect, the evidence and the consequences." },
  ],
  sustainability: [
    { slug: "renewable-energy", title: "Renewable Energy", desc: "Solar, wind, hydro — energy that doesn’t run out." },
    { slug: "conservation", title: "Conservation", desc: "Protecting species and habitats for the future." },
  ],
  "earth-structure": [
    { slug: "layers-of-the-earth", title: "Layers of the Earth", desc: "Crust, mantle, outer core, inner core." },
    { slug: "plate-tectonics", title: "Plate Tectonics", desc: "Why continents drift and earthquakes happen." },
  ],
  "rocks-minerals": [
    { slug: "the-rock-cycle", title: "The Rock Cycle", desc: "Igneous, sedimentary, metamorphic — rock never rests." },
    { slug: "minerals", title: "Minerals", desc: "What minerals are and how we identify them." },
  ],
  "water-systems": [
    { slug: "the-water-cycle", title: "The Water Cycle", desc: "Evaporation to precipitation and back again." },
    { slug: "oceans", title: "Oceans", desc: "Currents, tides and why oceans drive the climate." },
  ],
  "solar-system": [
    { slug: "the-planets", title: "The Planets", desc: "Eight worlds, from Mercury to Neptune." },
    { slug: "the-sun-and-moon", title: "The Sun and the Moon", desc: "Day, night, seasons and eclipses." },
  ],
  "stars-galaxies": [
    { slug: "life-cycle-of-stars", title: "The Life Cycle of Stars", desc: "From nebula to white dwarf — or black hole." },
    { slug: "galaxies", title: "Galaxies", desc: "Island universes, including our Milky Way." },
  ],
  "exploring-space": [
    { slug: "telescopes", title: "Telescopes", desc: "Catching light from across the cosmos." },
    { slug: "space-missions", title: "Space Missions", desc: "Probes, stations and the journey to Mars." },
  ],
  "design-process": [
    { slug: "engineering-design-cycle", title: "The Engineering Design Cycle", desc: "Ask, imagine, plan, create, improve." },
    { slug: "materials", title: "Materials", desc: "Choosing the right material for the job." },
  ],
  structures: [
    { slug: "forces-in-structures", title: "Forces in Structures", desc: "Tension, compression and load paths." },
    { slug: "shapes-that-hold", title: "Shapes That Hold", desc: "Triangles, arches and clever geometry." },
  ],
  machines: [
    { slug: "simple-machines", title: "Simple Machines", desc: "Levers, pulleys, gears and inclined planes." },
    { slug: "mechanisms", title: "Mechanisms", desc: "Turning motion into useful work." },
  ],
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
  "thinking-clearly": [
    { slug: "arguments", title: "Arguments", desc: "Premises, conclusions and validity." },
    { slug: "fallacies", title: "Fallacies", desc: "The classic ways arguments go wrong." },
  ],
  ethics: [
    { slug: "moral-theories", title: "Moral Theories", desc: "Utilitarianism, Kant and virtue ethics." },
    { slug: "applied-ethics", title: "Applied Ethics", desc: "Real dilemmas: AI, animals, the environment." },
  ],
  "reality-knowledge": [
    { slug: "mind-and-body", title: "Mind and Body", desc: "What is consciousness?" },
    { slug: "how-we-know", title: "How We Know", desc: "Rationalism, empiricism and scepticism." },
  ],
  "world-religions": [
    { slug: "major-world-religions", title: "Major World Religions", desc: "An overview of the great traditions." },
    { slug: "sacred-texts", title: "Sacred Texts", desc: "Scriptures and how they’re read." },
  ],
  "philosophy-religion": [
    { slug: "arguments-for-god", title: "Arguments for God", desc: "The classic cases for God’s existence." },
    { slug: "problem-of-evil", title: "The Problem of Evil", desc: "If God is good and all-powerful, why suffering?" },
  ],
  "religion-society": [
    { slug: "religion-and-ethics", title: "Religion and Ethics", desc: "Does morality need God?" },
    { slug: "secularisation", title: "Secularisation", desc: "Is religion declining?" },
  ],
  citizenship: [
    { slug: "rights-and-responsibilities", title: "Rights and Responsibilities", desc: "What citizenship gives — and asks." },
    { slug: "being-an-active-citizen", title: "Being an Active Citizen", desc: "How you can make a difference now." },
  ],
  government: [
    { slug: "levels-of-government", title: "Levels of Government", desc: "Local, regional, national — who does what." },
    { slug: "how-laws-are-made", title: "How Laws Are Made", desc: "From idea to statute." },
  ],
  "media-literacy": [
    { slug: "news-and-bias", title: "News and Bias", desc: "How news is made — and slanted." },
    { slug: "misinformation", title: "Misinformation", desc: "Spotting falsehoods online." },
  ],
  globalisation: [
    { slug: "what-is-globalisation", title: "What Is Globalisation?", desc: "The shrinking of distance." },
    { slug: "winners-and-losers", title: "Winners and Losers", desc: "Who gains from globalisation — and who pays." },
  ],
  migration: [
    { slug: "why-people-migrate", title: "Why People Migrate", desc: "Push and pull factors." },
    { slug: "migration-debates", title: "Migration Debates", desc: "The arguments for and against." },
  ],
  "global-citizenship": [
    { slug: "global-citizen", title: "Being a Global Citizen", desc: "Rights, responsibilities beyond borders." },
    { slug: "sustainable-development", title: "Sustainable Development", desc: "The SDGs: a to-do list for humanity." },
  ],
  "getting-started": [
    { slug: "german-sounds", title: "German Sounds", desc: "Pronunciation from day one." },
    { slug: "greetings-introductions", title: "Greetings and Introductions", desc: "Hallo, wie geht’s, and beyond." },
  ],
  "core-grammar": [
    { slug: "present-tense", title: "Present Tense Verbs", desc: "Conjugating regular verbs." },
    { slug: "genders-and-cases", title: "Genders and Cases", desc: "der, die, das — and why they change." },
  ],
  "everyday-german": [
    { slug: "numbers-time", title: "Numbers and Time", desc: "Zahlen, Uhrzeit, Termine." },
    { slug: "shopping-food", title: "Shopping and Food", desc: "Einkaufen und Essen." },
  ],
  script: [
    { slug: "arabic-alphabet", title: "The Arabic Alphabet", desc: "28 letters, right to left." },
    { slug: "arabic-sounds", title: "Arabic Sounds", desc: "From ع to ض: the famous sounds." },
  ],
  "first-words": [
    { slug: "arabic-greetings", title: "Greetings", desc: "السلام عليكم and responses." },
    { slug: "basic-sentences", title: "Basic Sentences", desc: "Your first Arabic sentences." },
  ],
  "practical-arabic": [
    { slug: "arabic-numbers", title: "Numbers", desc: "Counting from 1 to 100." },
    { slug: "daily-phrases", title: "Daily Phrases", desc: "The phrases that run daily life." },
  ],
  "sounds-tones": [
    { slug: "pinyin-and-tones", title: "Pinyin and Tones", desc: "The sound system that makes Mandarin work." },
    { slug: "first-characters", title: "First Characters", desc: "Meeting hanzi." },
  ],
  "first-conversations": [
    { slug: "chinese-greetings", title: "Greetings", desc: "你好 and the rituals of meeting." },
    { slug: "basic-patterns", title: "Basic Sentence Patterns", desc: "Word order without conjugations." },
  ],
  "daily-chinese": [
    { slug: "chinese-numbers", title: "Numbers", desc: "Counting the logical way." },
    { slug: "time-and-plans", title: "Time and Plans", desc: "Telling time, making plans." },
  ],
  "writing-systems": [
    { slug: "hiragana", title: "Hiragana", desc: "The 46 sounds that write Japanese." },
    { slug: "katakana-and-kanji", title: "Katakana and Kanji", desc: "Foreign words and Chinese characters." },
  ],
  "speaking-basics": [
    { slug: "japanese-greetings", title: "Greetings", desc: "こんにちは and the art of politeness." },
    { slug: "sentence-structure", title: "Sentence Structure", desc: "Subject-object-verb and particles." },
  ],
  "daily-japanese": [
    { slug: "japanese-numbers", title: "Numbers", desc: "Counting and counters." },
    { slug: "time-and-daily-life", title: "Time and Daily Life", desc: "Telling time, daily routines." },
  ],
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
  revision: [
    { slug: "french-revision-mixed", title: "French Revision: Mixed Practice", desc: "Key grammar and vocabulary, all in one place." },
  ],
};

export function getChapterTopics(chapterId: string): Topic[] {
  const base = CHAPTER_TOPICS[chapterId] ?? [];
  // Hand-written topics always come first; generated ones top the chapter up to four lessons.
  if (base.length >= 4) return base;
  const extra = (EXTRA_TOPICS[chapterId] ?? []).filter((t) => !base.some((b) => b.slug === t.slug));
  return [...base, ...extra].slice(0, 4);
}
