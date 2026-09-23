import type { Subject, SubjectCategory } from "./types";

/**
 * Subjects, grouped by category. Chapters are curriculum-spanning outlines;
 * the actual lessons (topics) live per curriculum+level under content/.
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
  business: {
    slug: "business",
    name: "Business",
    icon: "💼",
    category: "HUMANITIES",
    tagline: "How enterprises start, grow and survive.",
    intro:
      "Business studies how organisations turn ideas into products and profit. You'll learn what makes a business work — from spotting an opportunity and reaching customers to managing money and people.",
    learn: [
      "What businesses are and why they exist",
      "Marketing: understanding and reaching customers",
      "Operations: making and delivering products",
      "Finance: costs, revenue and profit",
      "Analysing real business decisions",
    ],
    chapters: [
      { id: "business-basics", title: "Business Basics", desc: "Enterprise, business types and the fundamentals of trading." },
      { id: "marketing", title: "Marketing", desc: "Understanding customers and reaching them." },
      { id: "finance", title: "Finance", desc: "Money in, money out: costs, revenue and profit." },
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
  spanish: {
    slug: "spanish",
    name: "Spanish",
    icon: "🇪🇸",
    category: "LANGUAGES",
    tagline: "Habla español — one of the world's great languages.",
    intro:
      "Spanish opens up half a billion speakers across four continents. Starting from your very first words, you'll build the vocabulary, grammar patterns and confidence to hold real conversations.",
    learn: [
      "Greetings, introductions and everyday phrases",
      "Core vocabulary: family, school, food, time",
      "Present-tense verbs and sentence building",
      "Listening and pronunciation habits",
      "Grammar patterns that unlock the language",
    ],
    chapters: [
      { id: "spanish-basics", title: "Spanish Basics", desc: "Your first steps in español: greetings and introductions." },
      { id: "spanish-grammar", title: "Grammar Foundations", desc: "Verbs, gender and the patterns behind the language." },
    ],
  },
  french: {
    slug: "french",
    name: "French",
    icon: "🇫🇷",
    category: "LANGUAGES",
    tagline: "Parlez français — step by step, from bonjour.",
    intro:
      "French is spoken on every continent and prized in diplomacy, culture and business. You'll start with greetings and everyday phrases, then build the grammar that lets you say exactly what you mean.",
    learn: [
      "Greetings, introductions and everyday phrases",
      "Core vocabulary: family, school, food, time",
      "Present-tense verbs and sentence building",
      "Listening and pronunciation habits",
      "Grammar patterns that unlock the language",
    ],
    chapters: [
      { id: "french-basics", title: "French Basics", desc: "Your first steps in français." },
      { id: "french-grammar", title: "Grammar Foundations", desc: "Patterns that unlock the language." },
      { id: "revision", title: "Revision", desc: "Consolidate your French with mixed practice." },
    ],
  },
  "environmental-science": {
    slug: "environmental-science",
    name: "Environmental Science",
    icon: "🌱",
    category: "STEM",
    tagline: "How the natural world works — and how we protect it.",
    intro:
      "Environmental science studies how living things interact with their surroundings — and how human activity changes those relationships. You’ll learn how ecosystems function, what threatens them, and what a sustainable future could look like.",
    learn: [
      "How ecosystems cycle energy and matter",
      "The causes and effects of pollution",
      "Climate change: evidence and consequences",
      "Renewable energy and sustainable living",
      "Conservation strategies that actually work",
    ],
    chapters: [
      { id: "ecosystems", title: "Ecosystems", desc: "How living things and their environment fit together." },
      { id: "human-impact", title: "Human Impact", desc: "Pollution, climate change and their effects." },
      { id: "sustainability", title: "Sustainability", desc: "Meeting needs today without wrecking tomorrow." },
    ],
  },
  "earth-science": {
    slug: "earth-science",
    name: "Earth Science",
    icon: "🌎",
    category: "STEM",
    tagline: "The planet beneath your feet — rocks, plates and oceans.",
    intro:
      "Earth science explains the ground you stand on, the water you drink and the air you breathe. From the planet’s molten core to the cycle that moves every drop of water, you’ll learn how Earth’s systems connect.",
    learn: [
      "Earth’s layered structure and plate tectonics",
      "The rock cycle and how minerals form",
      "How the water cycle moves water around the planet",
      "Oceans, currents and their role in climate",
      "Reading Earth’s history in rocks",
    ],
    chapters: [
      { id: "earth-structure", title: "Earth’s Structure", desc: "Layers, plates and the forces that move continents." },
      { id: "rocks-minerals", title: "Rocks and Minerals", desc: "The materials that build the planet." },
      { id: "water-systems", title: "Water Systems", desc: "Oceans, rivers and the water cycle." },
    ],
  },
  "astronomy": {
    slug: "astronomy",
    name: "Astronomy",
    icon: "🔭",
    category: "STEM",
    tagline: "Planets, stars and the universe beyond.",
    intro:
      "Astronomy is the oldest science — and the most humbling. You’ll tour the solar system, learn how stars are born and die, and see how we explore a universe 93 billion light-years across.",
    learn: [
      "The layout of the solar system",
      "Why we have day, night and seasons",
      "The life cycle of stars",
      "Galaxies and the expanding universe",
      "How telescopes and space missions work",
    ],
    chapters: [
      { id: "solar-system", title: "The Solar System", desc: "Our neighbourhood in space." },
      { id: "stars-galaxies", title: "Stars and Galaxies", desc: "How stars live, die and light up the universe." },
      { id: "exploring-space", title: "Exploring Space", desc: "How we study the universe." },
    ],
  },
  "engineering": {
    slug: "engineering",
    name: "Engineering",
    icon: "⚙️",
    category: "STEM",
    tagline: "Design, build, test — solving problems that matter.",
    intro:
      "Engineering is creativity with constraints: every bridge, phone and prosthetic limb began as someone’s solution to a problem. You’ll learn to think like an engineer — define, design, test, improve.",
    learn: [
      "The engineering design cycle",
      "Choosing materials for the job",
      "How structures carry loads",
      "Simple machines and mechanisms",
      "Testing and improving prototypes",
    ],
    chapters: [
      { id: "design-process", title: "The Design Process", desc: "How engineers turn problems into solutions." },
      { id: "structures", title: "Structures", desc: "Why buildings stand up — and bridges don’t fall down." },
      { id: "machines", title: "Machines", desc: "How machines multiply human effort." },
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
  "philosophy": {
    slug: "philosophy",
    name: "Philosophy",
    icon: "💭",
    category: "HUMANITIES",
    tagline: "The biggest questions, examined carefully.",
    intro:
      "Philosophy asks the questions other subjects take for granted: What is real? What is right? How do we know? You’ll learn to argue precisely — and to spot when arguments fail.",
    learn: [
      "How to build and test an argument",
      "Ethics: what makes actions right or wrong",
      "What exists: metaphysics and the mind",
      "How we know: the theory of knowledge",
      "Great philosophers and their ideas",
    ],
    chapters: [
      { id: "thinking-clearly", title: "Thinking Clearly", desc: "Arguments, logic and fallacies." },
      { id: "ethics", title: "Ethics", desc: "What makes actions right or wrong?" },
      { id: "reality-knowledge", title: "Reality and Knowledge", desc: "What exists, and how do we know?" },
    ],
  },
  "religious-studies": {
    slug: "religious-studies",
    name: "Religious Studies",
    icon: "🕌",
    category: "HUMANITIES",
    tagline: "Beliefs, practices and the search for meaning.",
    intro:
      "Religious studies examines the world’s faiths with curiosity and respect — what they teach, how they’re practised, and the big questions they address. This is academic study, not preaching: all traditions are examined fairly.",
    learn: [
      "The world’s major religions and their core teachings",
      "Sacred texts, worship and festivals",
      "Arguments for and against God’s existence",
      "Religion, ethics and moral life",
      "Religion in the modern world",
    ],
    chapters: [
      { id: "world-religions", title: "World Religions", desc: "The great faith traditions." },
      { id: "philosophy-religion", title: "Philosophy of Religion", desc: "Does God exist? Can we know?" },
      { id: "religion-society", title: "Religion and Society", desc: "Faith in the modern world." },
    ],
  },
  "civics": {
    slug: "civics",
    name: "Civics",
    icon: "🏢",
    category: "HUMANITIES",
    tagline: "Your rights, your vote, your community.",
    intro:
      "Civics is about your place in public life: the rights you hold, how government touches your day, and how you can shape the community around you — starting now, not just when you can vote.",
    learn: [
      "Your rights and responsibilities as a citizen",
      "How local and national government work",
      "How laws are made",
      "How to participate: voting, campaigning, volunteering",
      "Media literacy: spotting manipulation",
    ],
    chapters: [
      { id: "citizenship", title: "Citizenship", desc: "Rights, duties and belonging." },
      { id: "government", title: "Government", desc: "How the state is organised." },
      { id: "media-literacy", title: "Media Literacy", desc: "Reading the news like a citizen." },
    ],
  },
  "global-studies": {
    slug: "global-studies",
    name: "Global Studies",
    icon: "🌍",
    category: "HUMANITIES",
    tagline: "One world, many connections.",
    intro:
      "Global studies looks at the ties binding the planet: trade, migration, culture and shared crises. You’ll learn how globalisation works, who it helps, and what it means to be a global citizen.",
    learn: [
      "What globalisation is and how it happened",
      "Global trade: who wins and who loses",
      "Migration: causes and consequences",
      "Cultural exchange in a connected world",
      "Global citizenship and shared challenges",
    ],
    chapters: [
      { id: "globalisation", title: "Globalisation", desc: "How the world became connected." },
      { id: "migration", title: "Migration", desc: "Why people move — and what happens when they do." },
      { id: "global-citizenship", title: "Global Citizenship", desc: "Acting in a connected world." },
    ],
  },
  "german": {
    slug: "german",
    name: "German",
    icon: "🇩🇪",
    category: "LANGUAGES",
    tagline: "Die Sprache von Dichtern, Denkern und Ingenieuren.",
    intro:
      "German opens up Europe’s biggest economy and a culture of philosophy, music and engineering. You’ll master the sounds, survive the cases, and hold real conversations.",
    learn: [
      "German sounds and pronunciation",
      "Essential greetings and introductions",
      "Present tense and basic sentence structure",
      "Noun genders and the case system",
      "Everyday conversations: shopping, travel, food",
    ],
    chapters: [
      { id: "getting-started", title: "Getting Started", desc: "Sounds, greetings and first words." },
      { id: "core-grammar", title: "Core Grammar", desc: "Verbs, word order and cases." },
      { id: "everyday-german", title: "Everyday German", desc: "Real situations, real conversations." },
    ],
  },
  "arabic": {
    slug: "arabic",
    name: "Arabic",
    icon: "🇸🇦",
    category: "LANGUAGES",
    tagline: "لغة الضاد — the language of a rich civilisation.",
    intro:
      "Arabic is spoken by 400+ million people across 25 countries. You’ll master the script, the sounds — including the famous ‘ض’ — and build real conversational foundations.",
    learn: [
      "The Arabic alphabet and script",
      "Pronunciation, including emphatic sounds",
      "Greetings and introductions",
      "Basic sentence structure",
      "Numbers, time and everyday phrases",
    ],
    chapters: [
      { id: "script", title: "The Arabic Script", desc: "Reading and writing from zero." },
      { id: "first-words", title: "First Words", desc: "Greetings and everyday phrases." },
      { id: "practical-arabic", title: "Practical Arabic", desc: "Numbers, time and daily life." },
    ],
  },
  "chinese": {
    slug: "chinese",
    name: "Chinese",
    icon: "🇨🇳",
    category: "LANGUAGES",
    tagline: "你好! The world’s most spoken language.",
    intro:
      "Mandarin Chinese opens up 1.4 billion speakers and 5,000 years of culture. You’ll conquer the four tones, meet your first characters, and start real conversations.",
    learn: [
      "Pinyin and the four tones",
      "First Chinese characters",
      "Greetings and introductions",
      "Basic sentence patterns",
      "Numbers, time and daily phrases",
    ],
    chapters: [
      { id: "sounds-tones", title: "Sounds and Tones", desc: "Pinyin and the four tones." },
      { id: "first-conversations", title: "First Conversations", desc: "Greetings and introductions." },
      { id: "daily-chinese", title: "Daily Chinese", desc: "Numbers, time and getting around." },
    ],
  },
  "japanese": {
    slug: "japanese",
    name: "Japanese",
    icon: "🇯🇵",
    category: "LANGUAGES",
    tagline: "こんにちは! Three scripts, one fascinating language.",
    intro:
      "Japanese blends three writing systems and a culture of exquisite politeness levels. You’ll master hiragana, meet your first kanji, and start speaking.",
    learn: [
      "Hiragana: the phonetic foundation",
      "Katakana and first kanji",
      "Greetings and politeness",
      "Basic sentence structure",
      "Numbers, time and daily phrases",
    ],
    chapters: [
      { id: "writing-systems", title: "Writing Systems", desc: "Hiragana, katakana, kanji." },
      { id: "speaking-basics", title: "Speaking Basics", desc: "Greetings and first sentences." },
      { id: "daily-japanese", title: "Daily Japanese", desc: "Numbers, time and everyday life." },
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

export function subjectsByCategory(category: SubjectCategory): Subject[] {
  return SUBJECT_SLUGS.map((s) => SUBJECTS[s]).filter((s) => s.category === category);
}

export function getSubject(slug: string): Subject | null {
  return SUBJECTS[slug] ?? null;
}

export function getChapter(subjectSlug: string, chapterId: string) {
  const subject = getSubject(subjectSlug);
  if (!subject) return null;
  return subject.chapters.find((c) => c.id === chapterId) ?? null;
}
