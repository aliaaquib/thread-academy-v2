import type { Chapter } from "./types";
import { getSubject } from "./subjects";
import { resolveLevel } from "./curriculum";

/**
 * Chapter sets per (subject, curriculum, level) — the data behind the
 * Subject → Curriculum → Level → Chapters flow. Levels resolve to their
 * stage; each stage maps to one of four bands. Every subject defines its
 * own chapters per band, so chapters genuinely differ across grades.
 * Bands holding a subject's published MDX lessons reuse that subject's
 * existing chapter ids, keeping every lesson link working.
 */

export type Band = "foundations" | "developing" | "examination" | "advanced";

const STAGE_BANDS: Record<string, Band> = {
  "british:primary": "foundations",
  "british:secondary": "developing",
  "british:gcse-igcse": "examination",
  "british:a-level": "advanced",
  "cambridge:primary": "foundations",
  "cambridge:lower-secondary": "developing",
  "cambridge:igcse": "examination",
  "cambridge:as-a-level": "advanced",
  "american:elementary-school": "foundations",
  "american:middle-school": "developing",
  "american:high-school": "examination",
  "ib:pyp": "foundations",
  "ib:myp": "developing",
  "ib:dp": "advanced",
};

/** Finer-grained overrides for individual year slugs. */
const YEAR_BANDS: Record<string, Band> = {
  "american:grades-11-12": "advanced",
};

/** Which band a (curriculum, level) route belongs to. */
export function bandFor(curriculumSlug: string, levelSlug: string): Band {
  const yearBand = YEAR_BANDS[`${curriculumSlug}:${levelSlug}`];
  if (yearBand) return yearBand;
  const resolved = resolveLevel(curriculumSlug, levelSlug);
  const stageBand = STAGE_BANDS[`${curriculumSlug}:${resolved?.stage.slug ?? levelSlug}`];
  return stageBand ?? "developing";
}

export const BAND_CHAPTERS: Record<string, Record<Band, Chapter[]>> = {
  "arabic": {
    "foundations": [
      { id: "arabic-sounds", title: "The Arabic Alphabet", desc: "Meet the letters and how they join together." },
      { id: "arabic-greetings", title: "Greetings", desc: "Say hello, goodbye and introduce yourself in Arabic." },
      { id: "arabic-numbers", title: "Numbers and Colours", desc: "Count and describe the world around you in Arabic." },
    ],
    "developing": [
      { id: "script", title: "The Arabic Script", desc: "Reading and writing from zero." },
      { id: "arabic-my-world", title: "My World", desc: "Family, friends, school and hobbies in Arabic." },
      { id: "first-words", title: "First Words", desc: "Greetings and everyday phrases." },
    ],
    "examination": [
      { id: "script", title: "The Arabic Script", desc: "Reading and writing from zero." },
      { id: "first-words", title: "First Words", desc: "Greetings and everyday phrases." },
      { id: "practical-arabic", title: "Practical Arabic", desc: "Numbers, time and daily life." },
    ],
    "advanced": [
      { id: "arabic-literature", title: "Literature and Film", desc: "Stories, poems and films in Arabic." },
      { id: "arabic-advanced-grammar", title: "Advanced Grammar", desc: "Complex sentences and refined expression in Arabic." },
      { id: "arabic-culture", title: "Culture and Society", desc: "Daily life and traditions across the Arabic-speaking world." },
    ],
  },
  "astronomy": {
    "foundations": [
      { id: "night-sky", title: "The Night Sky", desc: "Stars, the Moon and finding constellations." },
      { id: "planets-tour", title: "The Planets", desc: "A tour of the eight planets." },
      { id: "sun-rises", title: "Day and Night", desc: "Why the Sun rises and sets each day." },
    ],
    "developing": [
      { id: "solar-system", title: "The Solar System", desc: "Our neighbourhood in space." },
      { id: "gravity-orbits", title: "Gravity and Orbits", desc: "Why planets stay in orbit around the Sun." },
      { id: "stars-galaxies", title: "Stars and Galaxies", desc: "How stars live, die and light up the universe." },
    ],
    "examination": [
      { id: "solar-system", title: "The Solar System", desc: "Our neighbourhood in space." },
      { id: "stars-galaxies", title: "Stars and Galaxies", desc: "How stars live, die and light up the universe." },
      { id: "exploring-space", title: "Exploring Space", desc: "How we study the universe." },
    ],
    "advanced": [
      { id: "cosmology", title: "Cosmology", desc: "The Big Bang and the fate of the universe." },
      { id: "exoplanets", title: "Exoplanets", desc: "Worlds orbiting other stars." },
      { id: "astrophysics", title: "Astrophysics", desc: "The physics of stars and galaxies." },
    ],
  },
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
  "business": {
    "foundations": [
      { id: "young-entrepreneurs", title: "Young Entrepreneurs", desc: "Ideas for small businesses you could run." },
      { id: "money-matters", title: "Money Matters", desc: "Earning, saving and spending wisely." },
      { id: "teamwork", title: "Teamwork", desc: "Working together to get things done." },
    ],
    "developing": [
      { id: "business-basics", title: "Business Basics", desc: "Enterprise, business types and the fundamentals of trading." },
      { id: "marketing", title: "Marketing", desc: "Understanding customers and reaching them." },
      { id: "enterprise", title: "Enterprise", desc: "Spotting opportunities and taking risks." },
    ],
    "examination": [
      { id: "business-basics", title: "Business Basics", desc: "Enterprise, business types and the fundamentals of trading." },
      { id: "marketing", title: "Marketing", desc: "Understanding customers and reaching them." },
      { id: "finance", title: "Finance", desc: "Money in, money out: costs, revenue and profit." },
    ],
    "advanced": [
      { id: "strategy", title: "Business Strategy", desc: "Competing and growing in global markets." },
      { id: "corporate-finance", title: "Corporate Finance", desc: "Investment, takeovers and financial planning." },
      { id: "operations", title: "Operations Management", desc: "Making production lean and efficient." },
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
  "chinese": {
    "foundations": [
      { id: "chinese-sounds", title: "Sounds and Tones", desc: "Pinyin sounds and the four tones of Mandarin." },
      { id: "chinese-greetings", title: "Greetings", desc: "Say hello, goodbye and introduce yourself in Chinese." },
      { id: "chinese-numbers", title: "Numbers and Colours", desc: "Count and describe the world around you in Chinese." },
    ],
    "developing": [
      { id: "sounds-tones", title: "Sounds and Tones", desc: "Pinyin and the four tones." },
      { id: "chinese-my-world", title: "My World", desc: "Family, friends, school and hobbies in Chinese." },
      { id: "first-conversations", title: "First Conversations", desc: "Greetings and introductions." },
    ],
    "examination": [
      { id: "sounds-tones", title: "Sounds and Tones", desc: "Pinyin and the four tones." },
      { id: "first-conversations", title: "First Conversations", desc: "Greetings and introductions." },
      { id: "daily-chinese", title: "Daily Chinese", desc: "Numbers, time and getting around." },
    ],
    "advanced": [
      { id: "chinese-literature", title: "Literature and Film", desc: "Stories, poems and films in Chinese." },
      { id: "chinese-advanced-grammar", title: "Advanced Grammar", desc: "Complex sentences and refined expression in Chinese." },
      { id: "chinese-culture", title: "Culture and Society", desc: "Daily life and traditions across the Chinese-speaking world." },
    ],
  },
  "civics": {
    "foundations": [
      { id: "community-helpers", title: "Community Helpers", desc: "The people who help our community." },
      { id: "rules-fairness", title: "Rules and Fairness", desc: "Why rules keep everyone safe." },
      { id: "symbols", title: "Symbols", desc: "Flags, anthems and what they stand for." },
    ],
    "developing": [
      { id: "citizenship", title: "Citizenship", desc: "Rights, duties and belonging." },
      { id: "government", title: "Government", desc: "How the state is organised." },
      { id: "media-literacy", title: "Media Literacy", desc: "Reading the news like a citizen." },
    ],
    "examination": [
      { id: "citizenship", title: "Citizenship", desc: "Rights, duties and belonging." },
      { id: "government", title: "Government", desc: "How the state is organised." },
      { id: "constitution", title: "The Constitution", desc: "How a country's most important rules are written." },
      { id: "elections", title: "Elections", desc: "Campaigns, voting and results." },
    ],
    "advanced": [
      { id: "comparative-politics", title: "Comparative Politics", desc: "How different countries govern." },
      { id: "civil-rights", title: "Civil Rights", desc: "The movements that changed history." },
      { id: "media-democracy", title: "Media and Democracy", desc: "Press freedom, bias and propaganda." },
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
  "earth-science": {
    "foundations": [
      { id: "rocks-soil", title: "Rocks and Soil", desc: "Explore rocks, soil and what lies underground." },
      { id: "day-night-seasons", title: "Day, Night and Seasons", desc: "The Sun, the Moon and why seasons change." },
      { id: "weather-watch", title: "Weather Watch", desc: "Measure and describe the weather around you." },
    ],
    "developing": [
      { id: "earth-structure", title: "Earth’s Structure", desc: "Layers, plates and the forces that move continents." },
      { id: "rocks-minerals", title: "Rocks and Minerals", desc: "The materials that build the planet." },
      { id: "volcanoes-earthquakes", title: "Volcanoes and Earthquakes", desc: "Plate tectonics in action." },
    ],
    "examination": [
      { id: "earth-structure", title: "Earth’s Structure", desc: "Layers, plates and the forces that move continents." },
      { id: "rocks-minerals", title: "Rocks and Minerals", desc: "The materials that build the planet." },
      { id: "water-systems", title: "Water Systems", desc: "Oceans, rivers and the water cycle." },
    ],
    "advanced": [
      { id: "geochemistry", title: "Geochemistry", desc: "The chemistry of rocks and minerals." },
      { id: "oceanography", title: "Oceanography", desc: "Currents, tides and marine systems." },
      { id: "palaeontology", title: "Palaeontology", desc: "Fossils and the history of life on Earth." },
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
  "engineering": {
    "foundations": [
      { id: "building-things", title: "Building Things", desc: "Design and build simple structures that stand up." },
      { id: "materials-job", title: "Materials", desc: "Choosing the right material for the job." },
      { id: "pulleys-levers", title: "Pulleys and Levers", desc: "How simple machines make work easier." },
    ],
    "developing": [
      { id: "design-process", title: "The Design Process", desc: "How engineers turn problems into solutions." },
      { id: "structures", title: "Structures", desc: "Why buildings stand up — and bridges don’t fall down." },
      { id: "mechanisms", title: "Mechanisms", desc: "Gears, cams and linkages in machines." },
    ],
    "examination": [
      { id: "design-process", title: "The Design Process", desc: "How engineers turn problems into solutions." },
      { id: "structures", title: "Structures", desc: "Why buildings stand up — and bridges don’t fall down." },
      { id: "machines", title: "Machines", desc: "How machines multiply human effort." },
    ],
    "advanced": [
      { id: "design-process", title: "The Design Process", desc: "How engineers turn problems into solutions." },
      { id: "structures", title: "Structures", desc: "Why buildings stand up — and bridges don’t fall down." },
      { id: "machines", title: "Machines", desc: "How machines multiply human effort." },
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
  "environmental-science": {
    "foundations": [
      { id: "nature-around-us", title: "Nature Around Us", desc: "Plants, animals and habitats in your neighbourhood." },
      { id: "reduce-reuse", title: "Reduce and Reuse", desc: "Why waste matters and what we can do about it." },
      { id: "water-precious", title: "Water", desc: "Where water comes from and why it is precious." },
    ],
    "developing": [
      { id: "ecosystems", title: "Ecosystems", desc: "How living things and their environment fit together." },
      { id: "food-webs", title: "Food Webs", desc: "How energy flows through living communities." },
      { id: "human-impact", title: "Human Impact", desc: "Pollution, climate change and their effects." },
    ],
    "examination": [
      { id: "ecosystems", title: "Ecosystems", desc: "How living things and their environment fit together." },
      { id: "human-impact", title: "Human Impact", desc: "Pollution, climate change and their effects." },
      { id: "sustainability", title: "Sustainability", desc: "Meeting needs today without wrecking tomorrow." },
    ],
    "advanced": [
      { id: "climate-policy", title: "Climate Policy", desc: "International agreements and climate action." },
      { id: "conservation-biology", title: "Conservation Biology", desc: "Protecting biodiversity around the world." },
      { id: "environmental-economics", title: "Environmental Economics", desc: "Valuing nature in human decisions." },
    ],
  },
  "french": {
    "foundations": [
      { id: "french-sounds", title: "French Sounds", desc: "The French alphabet and its sounds." },
      { id: "french-greetings", title: "Greetings", desc: "Say hello, goodbye and introduce yourself in French." },
      { id: "french-numbers", title: "Numbers and Colours", desc: "Count and describe the world around you in French." },
    ],
    "developing": [
      { id: "french-basics", title: "French Basics", desc: "Your first steps in français." },
      { id: "french-my-world", title: "My World", desc: "Family, friends, school and hobbies in French." },
      { id: "french-grammar", title: "Grammar Foundations", desc: "Patterns that unlock the language." },
    ],
    "examination": [
      { id: "french-basics", title: "French Basics", desc: "Your first steps in français." },
      { id: "french-grammar", title: "Grammar Foundations", desc: "Patterns that unlock the language." },
      { id: "revision", title: "Revision", desc: "Consolidate your French with mixed practice." },
    ],
    "advanced": [
      { id: "french-literature", title: "Literature and Film", desc: "Stories, poems and films in French." },
      { id: "french-advanced-grammar", title: "Advanced Grammar", desc: "Complex sentences and refined expression in French." },
      { id: "french-culture", title: "Culture and Society", desc: "Daily life and traditions across the French-speaking world." },
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
  "german": {
    "foundations": [
      { id: "german-sounds", title: "German Sounds", desc: "The German alphabet and its sounds." },
      { id: "german-greetings", title: "Greetings", desc: "Say hello, goodbye and introduce yourself in German." },
      { id: "german-numbers", title: "Numbers and Colours", desc: "Count and describe the world around you in German." },
    ],
    "developing": [
      { id: "getting-started", title: "Getting Started", desc: "Sounds, greetings and first words." },
      { id: "german-my-world", title: "My World", desc: "Family, friends, school and hobbies in German." },
      { id: "core-grammar", title: "Core Grammar", desc: "Verbs, word order and cases." },
    ],
    "examination": [
      { id: "getting-started", title: "Getting Started", desc: "Sounds, greetings and first words." },
      { id: "core-grammar", title: "Core Grammar", desc: "Verbs, word order and cases." },
      { id: "everyday-german", title: "Everyday German", desc: "Real situations, real conversations." },
    ],
    "advanced": [
      { id: "german-literature", title: "Literature and Film", desc: "Stories, poems and films in German." },
      { id: "german-advanced-grammar", title: "Advanced Grammar", desc: "Complex sentences and refined expression in German." },
      { id: "german-culture", title: "Culture and Society", desc: "Daily life and traditions across the German-speaking world." },
    ],
  },
  "global-studies": {
    "foundations": [
      { id: "our-world", title: "Our World", desc: "Countries, flags and maps." },
      { id: "cultures", title: "Cultures", desc: "Food, clothes and customs around the world." },
      { id: "helping-others", title: "Helping Others", desc: "Kindness that crosses borders." },
    ],
    "developing": [
      { id: "globalisation", title: "Globalisation", desc: "How the world became connected." },
      { id: "migration", title: "Migration", desc: "Why people move — and what happens when they do." },
      { id: "trade", title: "Trade", desc: "How goods travel around the world." },
    ],
    "examination": [
      { id: "globalisation", title: "Globalisation", desc: "How the world became connected." },
      { id: "migration", title: "Migration", desc: "Why people move — and what happens when they do." },
      { id: "global-citizenship", title: "Global Citizenship", desc: "Acting in a connected world." },
    ],
    "advanced": [
      { id: "globalisation", title: "Globalisation", desc: "How the world became connected." },
      { id: "migration", title: "Migration", desc: "Why people move — and what happens when they do." },
      { id: "global-citizenship", title: "Global Citizenship", desc: "Acting in a connected world." },
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
  "japanese": {
    "foundations": [
      { id: "japanese-sounds", title: "Hiragana and Katakana", desc: "The two syllable scripts of Japanese." },
      { id: "japanese-greetings", title: "Greetings", desc: "Say hello, goodbye and introduce yourself in Japanese." },
      { id: "japanese-numbers", title: "Numbers and Colours", desc: "Count and describe the world around you in Japanese." },
    ],
    "developing": [
      { id: "writing-systems", title: "Writing Systems", desc: "Hiragana, katakana, kanji." },
      { id: "japanese-my-world", title: "My World", desc: "Family, friends, school and hobbies in Japanese." },
      { id: "speaking-basics", title: "Speaking Basics", desc: "Greetings and first sentences." },
    ],
    "examination": [
      { id: "writing-systems", title: "Writing Systems", desc: "Hiragana, katakana, kanji." },
      { id: "speaking-basics", title: "Speaking Basics", desc: "Greetings and first sentences." },
      { id: "daily-japanese", title: "Daily Japanese", desc: "Numbers, time and everyday life." },
    ],
    "advanced": [
      { id: "japanese-literature", title: "Literature and Film", desc: "Stories, poems and films in Japanese." },
      { id: "japanese-advanced-grammar", title: "Advanced Grammar", desc: "Complex sentences and refined expression in Japanese." },
      { id: "japanese-culture", title: "Culture and Society", desc: "Daily life and traditions across the Japanese-speaking world." },
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
  "philosophy": {
    "foundations": [
      { id: "big-questions", title: "Big Questions", desc: "Wondering about the world around us." },
      { id: "thinking", title: "Thinking", desc: "Giving reasons for what you believe." },
      { id: "fairness", title: "Fairness", desc: "What is fair and what is unfair?" },
    ],
    "developing": [
      { id: "thinking-clearly", title: "Thinking Clearly", desc: "Arguments, logic and fallacies." },
      { id: "ethics", title: "Ethics", desc: "What makes actions right or wrong?" },
      { id: "logic", title: "Logic", desc: "Spotting good arguments and bad ones." },
    ],
    "examination": [
      { id: "thinking-clearly", title: "Thinking Clearly", desc: "Arguments, logic and fallacies." },
      { id: "ethics", title: "Ethics", desc: "What makes actions right or wrong?" },
      { id: "reality-knowledge", title: "Reality and Knowledge", desc: "What exists, and how do we know?" },
    ],
    "advanced": [
      { id: "thinking-clearly", title: "Thinking Clearly", desc: "Arguments, logic and fallacies." },
      { id: "ethics", title: "Ethics", desc: "What makes actions right or wrong?" },
      { id: "reality-knowledge", title: "Reality and Knowledge", desc: "What exists, and how do we know?" },
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
  "religious-studies": {
    "foundations": [
      { id: "celebrations", title: "Celebrations", desc: "Festivals celebrated around the world." },
      { id: "sacred-stories", title: "Sacred Stories", desc: "Stories told by different traditions." },
      { id: "kindness", title: "Kindness", desc: "How religions teach us to treat others." },
    ],
    "developing": [
      { id: "world-religions", title: "World Religions", desc: "The great faith traditions." },
      { id: "beliefs", title: "Beliefs", desc: "What different people believe." },
      { id: "worship", title: "Worship", desc: "How people pray and celebrate." },
    ],
    "examination": [
      { id: "world-religions", title: "World Religions", desc: "The great faith traditions." },
      { id: "philosophy-religion", title: "Philosophy of Religion", desc: "Does God exist? Can we know?" },
      { id: "religion-society", title: "Religion and Society", desc: "Faith in the modern world." },
    ],
    "advanced": [
      { id: "philosophy-religion", title: "Philosophy of Religion", desc: "Does God exist? Can we know?" },
      { id: "theology", title: "Theology", desc: "Arguing carefully about God and meaning." },
      { id: "religion-ethics", title: "Religion and Ethics", desc: "Moral questions seen through faith." },
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
  "spanish": {
    "foundations": [
      { id: "spanish-sounds", title: "Spanish Sounds", desc: "The Spanish alphabet and its sounds." },
      { id: "spanish-greetings", title: "Greetings", desc: "Say hello, goodbye and introduce yourself in Spanish." },
      { id: "spanish-numbers", title: "Numbers and Colours", desc: "Count and describe the world around you in Spanish." },
    ],
    "developing": [
      { id: "spanish-basics", title: "Spanish Basics", desc: "Your first steps in español: greetings and introductions." },
      { id: "spanish-my-world", title: "My World", desc: "Family, friends, school and hobbies in Spanish." },
      { id: "spanish-grammar", title: "Grammar Foundations", desc: "Verbs, gender and the patterns behind the language." },
    ],
    "examination": [
      { id: "spanish-basics", title: "Spanish Basics", desc: "Your first steps in español: greetings and introductions." },
      { id: "spanish-grammar", title: "Grammar Foundations", desc: "Verbs, gender and the patterns behind the language." },
    ],
    "advanced": [
      { id: "spanish-literature", title: "Literature and Film", desc: "Stories, poems and films in Spanish." },
      { id: "spanish-advanced-grammar", title: "Advanced Grammar", desc: "Complex sentences and refined expression in Spanish." },
      { id: "spanish-culture", title: "Culture and Society", desc: "Daily life and traditions across the Spanish-speaking world." },
    ],
  },
};

/** Chapters for a specific subject + curriculum + level. Falls back to
 *  the subject's default chapter list when no band data exists. */
export function getChaptersFor(subjectSlug: string, curriculumSlug: string, levelSlug: string): Chapter[] {
  const band = bandFor(curriculumSlug, levelSlug);
  const byBand = BAND_CHAPTERS[subjectSlug]?.[band];
  if (byBand && byBand.length > 0) return byBand;
  return getSubject(subjectSlug)?.chapters ?? [];
}

/** Find one chapter within a subject + curriculum + level. Checks the
 *  band chapters first, then the subject's default chapters. */
export function getChapterFor(
  subjectSlug: string,
  curriculumSlug: string,
  levelSlug: string,
  chapterId: string
): Chapter | null {
  const inBand = getChaptersFor(subjectSlug, curriculumSlug, levelSlug).find((c) => c.id === chapterId);
  if (inBand) return inBand;
  return getSubject(subjectSlug)?.chapters.find((c) => c.id === chapterId) ?? null;
}
