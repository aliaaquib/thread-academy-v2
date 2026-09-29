/**
 * Extra topic ideas per chapter, grouped by subject.
 * getChapterTopics() (in chapters.ts) uses these to top every chapter up
 * to four lessons. Key = chapter id. Slugs here never repeat a hand-written
 * slug from chapters.ts.
 */

import type { Topic } from "./types";

export const EXTRA_TOPICS: Record<string, Topic[]> = {
  // ── Mathematics ──
  counting: [
    { slug: "counting-to-10", title: "Counting to 10", desc: "Count reliably from 0 to 10 using objects and number songs." },
    { slug: "counting-to-100", title: "Counting to 100", desc: "Count on and back in ones and tens up to 100." },
    { slug: "ordering-numbers", title: "Ordering Numbers", desc: "Place numbers in order from smallest to largest and back." },
    { slug: "comparing-numbers", title: "Comparing Numbers", desc: "Use more than and fewer than to compare two groups." },
  ],
  "addition-subtraction": [
    { slug: "adding-two-numbers", title: "Adding Two Numbers", desc: "Combine two groups and count them all to find the total." },
    { slug: "number-bonds-10", title: "Number Bonds to 10", desc: "Learn the pairs of numbers that add to make 10." },
    { slug: "subtracting-objects", title: "Subtracting Objects", desc: "Take some away and count what is left to find the difference." },
    { slug: "number-line-steps", title: "Number Line Steps", desc: "Jump forwards and backwards along a number line to add and subtract." },
  ],
  "shapes-measures": [
    { slug: "flat-shapes", title: "Flat Shapes", desc: "Name and describe circles, triangles, rectangles and squares." },
    { slug: "solid-shapes", title: "Solid Shapes", desc: "Meet cubes, cuboids, spheres, cylinders and cones you can hold." },
    { slug: "measuring-length", title: "Measuring Length", desc: "Compare and measure length using rulers and centimetres." },
    { slug: "weight-and-capacity", title: "Weight and Capacity", desc: "Compare how heavy things are and how much containers hold." },
  ],
  "fractions-first": [
    { slug: "halves-of-shapes", title: "Halves of Shapes", desc: "Split shapes into two equal parts and shade one half." },
    { slug: "halves-of-numbers", title: "Halves of Numbers", desc: "Find half of small even numbers by sharing equally." },
    { slug: "quarters-of-shapes", title: "Quarters of Shapes", desc: "Split shapes and groups into four equal parts." },
    { slug: "comparing-fractions", title: "Comparing Fractions", desc: "Decide which is bigger: a half or a quarter?" },
  ],
  "number-arithmetic": [
    { slug: "place-value", title: "Place Value", desc: "Read, write and compare large numbers using place value." },
    { slug: "fractions-decimals-percentages", title: "Fractions, Decimals and Percentages", desc: "Convert fluently between fractions, decimals and percentages." },
    { slug: "order-of-operations", title: "Order of Operations", desc: "Apply BIDMAS to multi-step calculations." },
    { slug: "negative-numbers", title: "Negative Numbers", desc: "Add, subtract and order integers below zero." },
  ],
  "ratio-proportion": [
    { slug: "simplifying-ratios", title: "Simplifying Ratios", desc: "Reduce ratios to their simplest form like fractions." },
    { slug: "sharing-in-a-ratio", title: "Sharing in a Ratio", desc: "Split amounts fairly according to a given ratio." },
    { slug: "direct-proportion", title: "Direct Proportion", desc: "Solve problems where two quantities grow together." },
    { slug: "scale-and-maps", title: "Scale and Maps", desc: "Use scale factors to find real distances from maps and plans." },
  ],
  geometry: [
    { slug: "angles-and-angle-facts", title: "Angles and angle facts", desc: "Names of angles, angles on a line and around a point, and angles formed by parallel lines." },
    { slug: "triangles-and-quadrilaterals", title: "Triangles and quadrilaterals", desc: "Properties of 2D shapes, angle sums in triangles and quadrilaterals, and symmetry." },
    { slug: "perimeter-and-area", title: "Perimeter and area", desc: "Perimeter and area of rectangles, triangles, trapezia and compound shapes." },
    { slug: "circles-and-pi", title: "Circles and pi", desc: "Circumference and area of circles, with pi as the link between diameter and circumference." },
  ],
  statistics: [
    { slug: "averages-and-range", title: "Averages and range", desc: "Mean, median, mode and range, and which average suits which situation." },
    { slug: "charts-and-graphs", title: "Charts and graphs", desc: "Bar charts, pie charts, frequency diagrams and pictograms, drawn and read accurately." },
    { slug: "scatter-diagrams", title: "Scatter diagrams", desc: "Plotting paired data, spotting correlation, and drawing a line of best fit." },
    { slug: "interpreting-data", title: "Interpreting data honestly", desc: "Reading claims critically and spotting misleading scales and cherry-picked averages." },
  ],
  probability: [
    { slug: "probability-scale-and-basics", title: "Probability scale and basics", desc: "The 0 to 1 scale, equally likely outcomes, and writing probabilities as fractions, decimals or percentages." },
    { slug: "combined-outcomes", title: "Combined outcomes", desc: "Sample space diagrams and listing all outcomes for two-step experiments." },
    { slug: "independent-and-mutually-exclusive", title: "Independent and mutually exclusive events", desc: "Multiplying probabilities for independent events and adding for mutually exclusive ones." },
    { slug: "tree-diagrams-and-conditional", title: "Tree diagrams and conditional probability", desc: "Building tree diagrams for events with and without replacement, and finding conditional probabilities." },
  ],
  "pure-mathematics": [
    { slug: "functions-and-graphs", title: "Functions and graphs", desc: "Domain, range, composite and inverse functions, and transforming graphs of functions." },
    { slug: "sequences-and-series", title: "Sequences and series", desc: "Arithmetic and geometric progressions, nth terms, and sums of series." },
    { slug: "introducing-differentiation", title: "Introducing Differentiation", desc: "Gradients from first principles ideas, the power rule, and stationary points." },
    { slug: "introducing-integration", title: "Introducing Integration", desc: "Antidifferentiation, definite integrals, and areas under curves." },
  ],
  mechanics: [
    { slug: "kinematics-in-a-straight-line", title: "Kinematics in a straight line", desc: "Displacement, velocity and acceleration, with the constant-acceleration SUVAT equations." },
    { slug: "newtons-laws-of-motion", title: "Newton's laws of motion", desc: "Inertia, F = ma, and action–reaction pairs applied to real situations." },
    { slug: "friction-and-connected-particles", title: "Friction and connected particles", desc: "Modelling friction with F ≤ μR and solving systems of connected particles." },
    { slug: "projectile-motion", title: "Projectile motion", desc: "Resolving motion into independent horizontal and vertical components under gravity." },
  ],
  "further-statistics": [
    { slug: "binomial-distribution", title: "The binomial distribution", desc: "Modelling fixed numbers of independent trials with two outcomes, and computing probabilities." },
    { slug: "normal-distribution", title: "The normal distribution", desc: "The bell curve, standardisation with z-scores, and finding probabilities from tables or technology." },
    { slug: "hypothesis-testing", title: "Hypothesis testing", desc: "Null and alternative hypotheses, significance levels, and deciding whether to reject H₀." },
    { slug: "correlation-and-regression", title: "Correlation and regression", desc: "Measuring linear association and fitting regression lines for prediction." },
  ],
  // ── Physics ──
  "pushes-pulls": [
    { slug: "what-is-a-push-or-pull", title: "What Is a Push or Pull", desc: "Learning that a force is simply a push or a pull, and spotting both in everyday life." },
    { slug: "starting-and-stopping", title: "Starting and Stopping", desc: "Seeing how pushes and pulls can start things moving or bring them to a stop." },
    { slug: "changing-shape", title: "Changing Shape", desc: "Exploring how pushes and pulls can squash, stretch, bend and twist objects." },
    { slug: "friction-friend-or-foe", title: "Friction: Friend or Foe?", desc: "Discovering how friction slows moving things down and when that is useful." },
  ],
  "everyday-materials": [
    { slug: "hard-and-soft", title: "Hard and Soft", desc: "Feeling and comparing materials by how hard or soft they are." },
    { slug: "waterproof-or-not", title: "Waterproof or Not?", desc: "Testing which materials let water through and which keep it out." },
    { slug: "let-the-light-through", title: "Let the Light Through", desc: "Sorting materials into transparent, translucent and opaque." },
    { slug: "right-material-for-the-job", title: "Right Material for the Job", desc: "Choosing materials for everyday objects based on their properties." },
  ],
  "light-shadows": [
    { slug: "sources-of-light", title: "Sources of Light", desc: "Naming natural and artificial light sources, from the Sun to light bulbs." },
    { slug: "light-travels-straight", title: "Light Travels Straight", desc: "Learning that light travels in straight lines and cannot bend around corners." },
    { slug: "how-shadows-form", title: "How Shadows Form", desc: "Seeing how an opaque object blocks light to make a shadow." },
    { slug: "changing-shadows", title: "Changing Shadows", desc: "Investigating how moving a light or object makes shadows grow, shrink and move." },
  ],
  forces: [
    { slug: "types-of-forces", title: "Types of Forces", desc: "Meeting contact forces like friction and non-contact forces like gravity and magnetism." },
    { slug: "balanced-and-unbalanced", title: "Balanced and Unbalanced", desc: "Using force diagrams to see when forces cancel out or cause acceleration." },
    { slug: "friction-and-drag", title: "Friction and Drag", desc: "Exploring how surfaces and air resistance oppose motion — and when that helps." },
  ],
  motion: [
    { slug: "speed-and-velocity", title: "Speed and Velocity", desc: "Calculating speed from distance and time, and seeing how velocity adds direction." },
    { slug: "distance-time-graphs", title: "Distance–Time Graphs", desc: "Reading journeys from graphs and finding speed from the gradient." },
    { slug: "acceleration", title: "What Is Acceleration", desc: "Working out how quickly velocity changes using a = (v − u) ÷ t." },
    { slug: "velocity-time-graphs", title: "Velocity–Time Graphs", desc: "Finding acceleration from the gradient and distance from the area under the graph." },
  ],
  energy: [
    { slug: "kinetic-energy", title: "Kinetic Energy", desc: "Calculating the energy of moving objects with E = ½mv²." },
    { slug: "potential-energy", title: "Potential Energy", desc: "Working with gravitational potential energy, E = mgh, and stored elastic energy." },
    { slug: "energy-transfers", title: "Energy Transfers", desc: "Tracing energy as it moves between stores, from batteries to bouncing balls." },
    { slug: "conservation-and-efficiency", title: "Conservation and Efficiency", desc: "Using the conservation of energy and calculating the efficiency of devices." },
  ],
  sound: [
    { slug: "how-sounds-are-made", title: "How Sounds Are Made", desc: "Linking every sound you hear to a vibrating object." },
    { slug: "sound-needs-a-medium", title: "Sound Needs a Medium", desc: "Learning that sound travels through solids, liquids and gases — but not through space." },
    { slug: "pitch-and-loudness", title: "Pitch and Loudness", desc: "Relating pitch to frequency and loudness to amplitude." },
    { slug: "echoes-and-hearing", title: "Echoes and Hearing", desc: "Using echoes to find distances and seeing how the ear detects sound." },
  ],
  waves: [
    { slug: "transverse-and-longitudinal", title: "Transverse and Longitudinal", desc: "Comparing the two wave types and the direction of their vibrations." },
    { slug: "wave-speed-equation", title: "The Wave Speed Equation", desc: "Using v = f × λ to link speed, frequency and wavelength." },
    { slug: "reflection-and-refraction", title: "Reflection and Refraction", desc: "Explaining how waves bounce off surfaces and bend at boundaries." },
    { slug: "electromagnetic-spectrum", title: "The Electromagnetic Spectrum", desc: "Ordering the spectrum from radio waves to gamma rays and meeting their uses." },
  ],
  electricity: [
    { slug: "current-and-charge", title: "Current and Charge", desc: "Linking current to the flow of charge with Q = I × t." },
    { slug: "voltage-and-resistance", title: "Voltage and Resistance", desc: "Using V = I × R and reading simple circuit measurements." },
    { slug: "series-and-parallel", title: "Series and Parallel", desc: "Comparing current, voltage and resistance in the two circuit types." },
    { slug: "electrical-power", title: "Electrical Power", desc: "Calculating power with P = I × V and the energy transferred." },
  ],
  "further-mechanics": [
    { slug: "circular-motion", title: "Circular Motion", desc: "Deriving a = v²/r and applying F = mv²/r to orbits and roundabouts." },
    { slug: "simple-harmonic-motion", title: "Simple Harmonic Motion", desc: "Modelling oscillations with a = −ω²x and the mass–spring period." },
    { slug: "momentum-and-impulse", title: "Momentum and Impulse", desc: "Using p = mv and impulse FΔt = Δp for impacts and safety design." },
    { slug: "collisions", title: "Elastic and Inelastic Collisions", desc: "Applying conservation of momentum to elastic and inelastic collisions." },
  ],
  fields: [
    { slug: "gravitational-fields", title: "Gravitational Fields", desc: "Mapping g fields with F = GmM/r² and linking field strength to potential." },
    { slug: "electric-fields", title: "Electric Fields", desc: "Using E = F/Q and E = V/d for point charges and uniform fields." },
    { slug: "magnetic-fields", title: "Magnetic Fields", desc: "Finding field patterns and the force F = BIl on current-carrying wires." },
    { slug: "potentials-and-equipotentials", title: "Potentials and Equipotentials", desc: "Reading field strength from equipotential spacing and calculating work done." },
  ],
  "particle-physics": [
    { slug: "the-standard-model", title: "The Standard Model", desc: "Meeting quarks, leptons and the force-carrying bosons." },
    { slug: "antimatter", title: "Matter Meets Antimatter", desc: "Seeing how every particle has an antiparticle and what happens when they meet." },
    { slug: "quarks-and-hadrons", title: "Quarks and Hadrons", desc: "Building protons, neutrons and mesons from up and down quarks." },
    { slug: "quantum-ideas", title: "Quantum Ideas", desc: "Introducing photons, E = hf and the photoelectric effect." },
  ],
  // ── Chemistry ──
  "sorting-materials": [
    { slug: "describing-materials", title: "Describing Materials", desc: "Learn words like hard, smooth and stretchy to describe what materials are like." },
    { slug: "testing-properties", title: "Testing Properties", desc: "Carry out simple fair tests to find out which materials are waterproof, magnetic or stretchy." },
    { slug: "grouping-materials", title: "Grouping Materials", desc: "Sort objects into groups using one property at a time, such as rough or smooth." },
    { slug: "choosing-materials", title: "Choosing Materials", desc: "Decide which material suits a job, like glass for windows or fabric for clothes." },
  ],
  "solids-liquids": [
    { slug: "what-is-a-solid", title: "What Is a Solid", desc: "Discover how solids keep their shape even when you move them." },
    { slug: "what-is-a-liquid", title: "What Is a Liquid", desc: "See how liquids flow and take the shape of their container." },
    { slug: "melting-and-freezing", title: "Melting and Freezing", desc: "Watch what happens to ice, chocolate and butter when they are warmed and cooled." },
    { slug: "heating-and-cooling", title: "Heating and Cooling", desc: "Investigate how warming and cooling change materials, and how to test fairly." },
  ],
  mixtures: [
    { slug: "what-is-a-mixture", title: "What Is a Mixture", desc: "Learn how mixtures are made of two or more materials mixed together." },
    { slug: "sieving", title: "Separating by Sieving", desc: "Use a sieve to separate solids of different sizes, like flour from lumps." },
    { slug: "filtering", title: "Separating by Filtering", desc: "Use filter paper to separate a solid from a liquid, like sand from water." },
    { slug: "evaporating", title: "Separating by Evaporating", desc: "Use gentle heat to leave dissolved salt behind when water evaporates." },
  ],
  particles: [
    { slug: "particle-model", title: "The Particle Model", desc: "Meet the idea that all matter is made of tiny moving particles." },
    { slug: "solids-liquids-gases", title: "Solids, Liquids and Gases", desc: "Compare how particles are arranged and move in each state." },
    { slug: "changes-of-state", title: "Changes of State", desc: "Explain melting, boiling, condensing and freezing with particles." },
    { slug: "diffusion", title: "Spreading by Diffusion", desc: "See how particles spread from crowded places to empty ones." },
  ],
  "atomic-structure": [
    { slug: "subatomic-particles", title: "Subatomic Particles", desc: "Meet protons, neutrons and electrons and learn their charges and masses." },
    { slug: "atomic-number-mass", title: "Atomic Number and Mass Number", desc: "Use proton and nucleon numbers to describe any atom." },
    { slug: "electron-shells", title: "Electron Shells", desc: "Arrange electrons in shells and link the arrangement to the periodic table." },
  ],
  "periodic-table": [
    { slug: "arranging-elements", title: "Arranging the Elements", desc: "See how Mendeleev ordered elements by atomic mass and properties." },
    { slug: "groups-and-periods", title: "Groups and Periods", desc: "Read the table's columns and rows and what they tell you." },
    { slug: "metals-and-nonmetals", title: "Metals and Non-metals", desc: "Compare the properties of metals with those of non-metals." },
    { slug: "group-trends", title: "Trends in Groups", desc: "Predict how reactivity changes down Group 1 and Group 7." },
  ],
  "acids-alkalis": [
    { slug: "acids-everyday", title: "Acids in Everyday Life", desc: "Meet acids in citrus fruits, vinegar and your stomach." },
    { slug: "ph-scale", title: "The pH Scale", desc: "Use the 1–14 scale to measure how acidic or alkaline a solution is." },
    { slug: "indicators", title: "Testing with Indicators", desc: "Use litmus and universal indicator to test for acids and alkalis." },
    { slug: "neutralisation", title: "Acids Meet Alkalis", desc: "See how acids and alkalis cancel each other out." },
  ],
  "chemical-bonding": [
    { slug: "ionic-bonding", title: "Ionic Bonding", desc: "Learn how metals and non-metals bond by transferring electrons." },
    { slug: "covalent-bonding", title: "Covalent Bonding", desc: "See how non-metals share pairs of electrons." },
    { slug: "metallic-bonding", title: "Metallic Bonding", desc: "Discover the sea of electrons that holds metals together." },
    { slug: "structures-properties", title: "Structures and Properties", desc: "Link giant and molecular structures to melting points and conductivity." },
  ],
  "chemical-changes": [
    { slug: "acids-metals", title: "Acids with Metals and Carbonates", desc: "Write equations for acids reacting with metals and carbonates." },
    { slug: "making-salts", title: "Making Salts", desc: "Prepare pure salts by reacting acids with bases and carbonates." },
    { slug: "reactivity-series", title: "The Reactivity Series", desc: "Use the series to predict displacement and extraction reactions." },
    { slug: "energy-changes", title: "Energy in Reactions", desc: "Distinguish exothermic and endothermic reactions." },
  ],
  "quantitative-chemistry": [
    { slug: "the-mole", title: "The Mole", desc: "Count particles using the mole and Avogadro's constant." },
    { slug: "reacting-masses", title: "Masses in Reactions", desc: "Calculate how much product a reaction makes." },
    { slug: "yield-and-atom-economy", title: "Yield and Atom Economy", desc: "Measure how efficient a reaction is." },
    { slug: "concentrations", title: "Concentrations of Solutions", desc: "Work with moles per cubic decimetre." },
  ],
  "physical-chemistry": [
    { slug: "enthalpy-changes", title: "Enthalpy Changes", desc: "Measure heat changes with calorimetry and standard enthalpy definitions." },
    { slug: "hess-law", title: "Hess's Law", desc: "Calculate enthalpy changes indirectly using energy cycles." },
    { slug: "reaction-rates", title: "Rates of Reaction", desc: "Use collision theory to explain how reactions speed up." },
    { slug: "equilibria", title: "Chemical Equilibria", desc: "Apply Le Chatelier's principle and calculate equilibrium constants." },
  ],
  "organic-chemistry": [
    { slug: "alkanes", title: "Meeting the Alkanes", desc: "Study saturated hydrocarbons, fractional distillation and combustion." },
    { slug: "alkenes", title: "The Reactive Alkenes", desc: "Explore the double bond, electrophilic addition and polymers." },
    { slug: "alcohols", title: "Alcohols and Oxidation", desc: "Classify alcohols and follow their oxidation to carbonyls and acids." },
    { slug: "organic-synthesis", title: "Organic Synthesis", desc: "Plan reaction routes and identify functional groups." },
  ],
  "analytical-chemistry": [
    { slug: "chemical-tests", title: "Chemical Tests", desc: "Identify gases and ions with classic test-tube tests." },
    { slug: "flame-tests", title: "Flame Tests and Precipitates", desc: "Use flame colours and precipitation to identify metal ions." },
    { slug: "mass-spectrometry", title: "Mass Spectrometry", desc: "Find relative masses and molecular formulae from m/z peaks." },
    { slug: "spectroscopy", title: "Infrared and NMR Spectroscopy", desc: "Identify bonds and hydrogen environments in molecules." },
  ],
  // ── Biology ──
  "living-things": [
    { slug: "what-is-alive", title: "What Is Alive?", desc: "Learn the seven life processes (MRS GREN) that separate living things from things that were never alive." },
    { slug: "habitats-nearby", title: "Habitats Near You", desc: "Explore local habitats and discover how animals and plants suit the places where they live." },
    { slug: "sorting-animals", title: "Sorting Animals", desc: "Group animals by their features into mammals, birds, fish, reptiles, amphibians and minibeasts." },
    { slug: "simple-food-chains", title: "Simple Food Chains", desc: "Follow food chains from producer to consumer and see why plants start them all." },
  ],
  plants: [
    { slug: "parts-of-a-plant", title: "Parts of a Plant", desc: "Name the roots, stem, leaves and flower and learn what each part does for the plant." },
    { slug: "what-plants-need", title: "What Plants Need", desc: "Discover the light, water, warmth and air that plants need to stay healthy and grow." },
    { slug: "how-seeds-grow", title: "How Seeds Grow", desc: "Follow germination as a seed sprouts roots and shoots and becomes a new plant." },
    { slug: "making-food", title: "How Plants Make Food", desc: "Meet photosynthesis in simple words: leaves use sunlight, water and air to make food." },
  ],
  "animals-humans": [
    { slug: "five-senses", title: "The Five Senses", desc: "Explore sight, hearing, smell, taste and touch and the body parts that carry them." },
    { slug: "bones-and-skeletons", title: "Bones and Skeletons", desc: "Learn how the skeleton supports the body, protects delicate organs and helps us move." },
    { slug: "healthy-food", title: "Food for Health", desc: "Sort foods into groups and build a balanced plate that keeps your body strong." },
    { slug: "staying-healthy", title: "Staying Healthy", desc: "See why exercise, sleep, clean hands and clean teeth matter every single day." },
  ],
  "cell-biology": [
    { slug: "using-microscopes", title: "Using Microscopes", desc: "Learn how light microscopes work and practise calculating magnification." },
    { slug: "specialised-cells", title: "Specialised Cells", desc: "See how root hair cells, sperm cells, red blood cells and neurones are adapted to their jobs." },
    { slug: "mitosis", title: "Cell Division: Mitosis", desc: "Follow the stages of mitosis and learn why growth and repair need identical cells." },
  ],
  organisation: [
    { slug: "levels-of-organisation", title: "Levels of Organisation", desc: "Build the hierarchy from cells to tissues, organs and organ systems." },
    { slug: "digestive-system", title: "The Digestive System", desc: "Trace food through the gut and learn how nutrients reach the blood." },
    { slug: "heart-circulation", title: "Heart and Circulation", desc: "Explore the double circulatory system and how blood moves around the body." },
    { slug: "enzymes-in-digestion", title: "Enzymes in Digestion", desc: "Meet amylase, protease and lipase and see how enzymes speed up digestion." },
  ],
  reproduction: [
    { slug: "plant-reproduction", title: "Plant Reproduction", desc: "Learn how flowers, pollination and seeds create the next generation of plants." },
    { slug: "animal-life-cycles", title: "Animal Life Cycles", desc: "Compare the life cycles of mammals, birds, amphibians and insects, including metamorphosis." },
    { slug: "human-life-cycle", title: "The Human Life Cycle", desc: "Follow the stages from baby to adult to older age and what changes at each stage." },
    { slug: "puberty-and-growth", title: "Puberty and Growing Up", desc: "Understand the physical and emotional changes of adolescence in a factual, sensitive way." },
  ],
  "health-disease": [
    { slug: "pathogens", title: "Meet the Pathogens", desc: "Meet bacteria, viruses, fungi and protists and find out how they make us ill." },
    { slug: "body-defences", title: "The Body's Defences", desc: "Discover skin, stomach acid, white blood cells and antibodies that fight infection." },
    { slug: "vaccines", title: "How Vaccines Work", desc: "Learn how vaccination trains the immune system to defeat a disease before it strikes." },
    { slug: "healthy-lifestyle", title: "A Healthy Lifestyle", desc: "Explore how diet, exercise, sleep and avoiding smoking protect long-term health." },
  ],
  bioenergetics: [
    { slug: "photosynthesis", title: "How Photosynthesis Works", desc: "Master the word and symbol equations and how leaves are adapted for the job." },
    { slug: "limiting-factors", title: "Limiting Factors", desc: "Investigate how light, carbon dioxide and temperature limit the rate of photosynthesis." },
    { slug: "respiration", title: "Aerobic and Anaerobic Respiration", desc: "Compare the equations for respiration with and without oxygen, and their uses." },
    { slug: "energy-in-ecosystems", title: "Energy in Ecosystems", desc: "Calculate the percentage efficiency of energy transfer between trophic levels." },
  ],
  genetics: [
    { slug: "dna-genes-chromosomes", title: "DNA, Genes and Chromosomes", desc: "Connect DNA, genes, chromosomes and alleles into one clear picture." },
    { slug: "punnett-squares", title: "Punnett Squares", desc: "Predict the outcomes of single-gene crosses with step-by-step Punnett squares." },
    { slug: "inherited-disorders", title: "Inherited Disorders", desc: "Trace cystic fibrosis and polydactyly through family trees." },
    { slug: "variation-and-selection", title: "Variation and Selection", desc: "Explain the genetic and environmental causes of variation in populations." },
  ],
  ecology: [
    { slug: "food-webs", title: "Food Webs", desc: "Build food webs and identify producers, consumers, predators and decomposers." },
    { slug: "pyramids-of-biomass", title: "Pyramids of Biomass", desc: "Construct pyramids of biomass and explain why energy transfer is inefficient." },
    { slug: "carbon-cycle", title: "The Carbon Cycle", desc: "Follow carbon through photosynthesis, respiration, decay and combustion." },
    { slug: "human-impacts", title: "Humans and the Environment", desc: "Evaluate deforestation, pollution and global warming, and how we can respond." },
  ],
  biochemistry: [
    { slug: "biological-molecules", title: "Biological Molecules", desc: "Classify carbohydrates, lipids, proteins and nucleic acids, and test foods for them." },
    { slug: "protein-structure", title: "Protein Structure", desc: "Build proteins from amino acids through primary to quaternary structure." },
    { slug: "enzymes", title: "Enzymes in Depth", desc: "Explain specificity, the induced-fit model, and the effects of pH and temperature." },
    { slug: "dna-replication", title: "DNA Structure and Replication", desc: "Describe the double helix and the semi-conservative replication mechanism." },
  ],
  physiology: [
    { slug: "neurones-synapses", title: "Neurones and Synapses", desc: "Trace nerve impulses along neurones and across synapses in detail." },
    { slug: "reflex-arc", title: "The Reflex Arc", desc: "Map the five stages of a spinal reflex and explain why speed matters." },
    { slug: "hormones", title: "Hormonal Control", desc: "Compare nervous and hormonal control and explore the glands of the endocrine system." },
    { slug: "homeostasis", title: "Homeostasis: Blood Glucose", desc: "Explain the negative-feedback control of blood glucose by insulin and glucagon." },
  ],
  evolution: [
    { slug: "natural-selection", title: "Natural Selection", desc: "Explain Darwin's theory step by step, with real examples like antibiotic resistance." },
    { slug: "evidence-for-evolution", title: "Evidence for Evolution", desc: "Weigh the fossil, anatomical, embryological and DNA evidence for common ancestry." },
    { slug: "speciation", title: "How Speciation Happens", desc: "Show how isolation and selection split one species into two." },
    { slug: "classification", title: "Classification and Phylogeny", desc: "Use the taxonomic hierarchy and DNA data to build evolutionary trees." },
  ],
  // ── Computer Science ──
  "creating-media": [
    { slug: "planning-your-project", title: "Planning Your Project", desc: "Sketch a simple storyboard before you start making anything." },
    { slug: "making-images", title: "Making Images", desc: "Create and edit pictures, then save them with sensible file names." },
    { slug: "adding-text-and-sound", title: "Text and Sound", desc: "Add clear titles, captions and recorded sound to your work." },
    { slug: "animation-basics", title: "Animation Basics", desc: "Make simple animations and slideshows that tell a story in order." },
  ],
  "computational-thinking": [
    { slug: "decomposition", title: "Breaking Problems Down", desc: "Split large problems into smaller, solvable pieces." },
    { slug: "pattern-recognition", title: "Pattern Recognition", desc: "Spot similarities and repetitions that let you reuse solutions." },
    { slug: "abstraction", title: "Focusing on What Matters", desc: "Strip away unimportant detail to focus on what matters." },
    { slug: "algorithmic-thinking", title: "Algorithmic Thinking", desc: "Turn your plan into clear, ordered steps a computer can follow." },
  ],
  programming: [
    { slug: "output-and-input", title: "Output and Input", desc: "Make programs talk to the user with print and input." },
    { slug: "selection", title: "Making Decisions", desc: "Branch your program's behaviour with if, elif and else." },
    { slug: "loops", title: "Repeating with Loops", desc: "Repeat actions efficiently with for and while loops." },
  ],
  "data-representation": [
    { slug: "binary-numbers", title: "Binary Numbers", desc: "Count in base 2 and convert between binary and denary." },
    { slug: "text-and-characters", title: "Text and Characters", desc: "See how ASCII and Unicode turn letters into numbers." },
    { slug: "images-pixels", title: "Images and Pixels", desc: "Discover how grids of coloured dots become photographs." },
    { slug: "sound-sampling", title: "Sound and Sampling", desc: "Learn how sound waves are sampled into digital audio." },
  ],
  networks: [
    { slug: "what-is-a-network", title: "What Is a Network?", desc: "Explore LANs, WANs and the hardware that connects devices." },
    { slug: "packets-and-protocols", title: "Packets and Protocols", desc: "See how data is split into packets that follow agreed rules." },
    { slug: "how-the-internet-works", title: "How the Internet Works", desc: "Trace a web request from your device to a server and back." },
    { slug: "network-security", title: "Network Security", desc: "Learn how encryption and firewalls keep networks safe." },
  ],
  algorithms: [
    { slug: "linear-search", title: "Linear Search", desc: "Find items by checking each one in turn." },
    { slug: "binary-search", title: "Binary Search", desc: "Search sorted lists far faster by halving the problem." },
    { slug: "bubble-sort", title: "Bubble Sort", desc: "Sort lists by repeatedly swapping neighbouring items." },
    { slug: "measuring-efficiency", title: "Measuring Efficiency", desc: "Compare algorithms using Big-O notation and worst cases." },
  ],
  "data-structures": [
    { slug: "stacks", title: "Using Stacks", desc: "Store data last-in, first-out, like a pile of plates." },
    { slug: "queues", title: "Using Queues", desc: "Store data first-in, first-out, like a real queue." },
    { slug: "trees", title: "Tree Structures", desc: "Organise hierarchical data with binary trees and traversals." },
    { slug: "graphs", title: "Graph Networks", desc: "Model networks and relationships with nodes and edges." },
  ],
  "databases-sql": [
    { slug: "tables-and-keys", title: "Tables and Keys", desc: "Design tables with primary keys that uniquely identify each row." },
    { slug: "relationships", title: "Table Relationships", desc: "Link tables with foreign keys in one-to-many relationships." },
    { slug: "select-queries", title: "SELECT Queries", desc: "Retrieve exactly the data you need with SELECT, WHERE and ORDER BY." },
    { slug: "changing-data", title: "Changing Data", desc: "Add, update and delete rows safely with INSERT, UPDATE and DELETE." },
  ],
  "ai-ethics": [
    { slug: "how-machine-learning-works", title: "How Machine Learning Works", desc: "See how models learn patterns from data instead of following coded rules." },
    { slug: "training-data", title: "Training Data", desc: "Understand why the quality and quantity of data decides what AI learns." },
    { slug: "bias-and-fairness", title: "Bias and Fairness", desc: "Explore how biased data creates unfair AI — and how to fight it." },
    { slug: "using-ai-responsibly", title: "Using AI Responsibly", desc: "Weigh up privacy, accountability and honest use of AI tools." },
  ],
  // ── History ──
  "my-history": [
    { slug: "me-and-my-timeline", title: "Me and My Timeline", desc: "Make a timeline of your own life, from birth to today." },
    { slug: "family-tree-basics", title: "Family Tree Basics", desc: "Draw a simple family tree and learn who came before you." },
    { slug: "past-present-future", title: "Past, Present, Future", desc: "Sort pictures and words into what happened, what is happening, and what will happen." },
    { slug: "stories-from-home", title: "Stories from Home", desc: "Ask family members about the past and record their memories." },
  ],
  "toys-past": [
    { slug: "toys-then-and-now", title: "Toys Then and Now", desc: "Compare old toys like wooden trains with the toys children play with today." },
    { slug: "what-toys-are-made-of", title: "What Toys Are Made Of", desc: "Discover how toys changed as makers switched from wood to tin to plastic." },
    { slug: "games-grandparents-played", title: "Games Grandparents Played", desc: "Learn playground games from long ago and try playing one yourself." },
    { slug: "museum-detectives", title: "Museum Detectives", desc: "Use old objects like a historian: look closely and ask what each object tells us." },
  ],
  "great-events": [
    { slug: "great-fire-of-london", title: "The Great Fire of London", desc: "How a bakery fire in 1666 burned down most of London and changed the city." },
    { slug: "explorers-and-voyages", title: "Explorers and Voyages", desc: "Meet the sailors who crossed unknown oceans in wooden ships." },
    { slug: "kings-queens-and-crowns", title: "Kings, Queens and Crowns", desc: "How monarchs ruled Britain and what a crown really means." },
    { slug: "moon-landing-1969", title: "The Moon Landing", desc: "How astronauts first walked on the Moon in 1969." },
  ],
  "modern-world": [
    { slug: "railways-and-steam", title: "Railways and Steam", desc: "How steam power and railways shrank distances and sped up Victorian Britain." },
    { slug: "life-in-victorian-britain", title: "Life in Victorian Britain", desc: "Work, school and home for ordinary people during Queen Victoria's reign, 1837-1901." },
    { slug: "the-british-empire", title: "The British Empire", desc: "How Britain built a worldwide empire and what it meant for the peoples ruled." },
  ],
  "empire-industry": [
    { slug: "machines-that-changed-work", title: "Machines That Changed Work", desc: "Spinning jenny, power loom and steam engine: the inventions behind the factory age." },
    { slug: "mill-towns-and-workers", title: "Mill Towns and Workers", desc: "Twelve-hour days, child labour and the first factory laws." },
    { slug: "cotton-and-the-world", title: "Cotton and the World", desc: "How Lancashire's mills depended on cotton grown across the globe." },
    { slug: "railways-ships-and-trade", title: "Railways, Ships and Trade", desc: "The transport revolution that carried British goods around the world." },
  ],
  "source-skills": [
    { slug: "what-counts-as-evidence", title: "What Counts as Evidence", desc: "Primary and secondary sources, and why historians need both." },
    { slug: "provenance-and-purpose", title: "Provenance and Purpose", desc: "Who made a source, when, and why it matters." },
    { slug: "spotting-bias", title: "Spotting Bias", desc: "How to detect one-sided sources without dismissing them." },
    { slug: "sources-in-exam-answers", title: "Sources in Exam Answers", desc: "How to quote, compare and evaluate sources in GCSE answers." },
  ],
  "twentieth-century": [
    { slug: "causes-of-the-first-world-war", title: "Causes of the First World War", desc: "Alliances, arms races and the assassination that lit the fuse in 1914." },
    { slug: "trench-warfare-1914-1918", title: "Trench Warfare 1914-1918", desc: "Life and death on the Western Front, and why the war lasted so long." },
    { slug: "road-to-the-second-world-war", title: "Road to the Second World War", desc: "Treaty of Versailles, the Depression and Hitler's rise." },
    { slug: "britain-in-the-second-world-war", title: "Britain in the Second World War", desc: "The Blitz, Dunkirk and the home front, 1939-1945." },
  ],
  historiography: [
    { slug: "what-is-historiography", title: "What Is Historiography", desc: "Why history is an argument about the past, not just a list of facts." },
    { slug: "schools-of-thought", title: "Schools of Thought", desc: "Marxist, Whig, revisionist and postmodern approaches to writing history." },
    { slug: "debating-the-first-world-war", title: "Debating the First World War", desc: "Fischer, revisionists and the argument over who caused the war." },
    { slug: "history-in-public", title: "History in Public", desc: "Museums, memorials and media: who decides how the past is remembered?" },
  ],
  "cold-war": [
    { slug: "origins-of-the-cold-war", title: "Origins of the Cold War", desc: "From wartime allies to superpower rivals, 1945-1949." },
    { slug: "crises-and-confrontation", title: "Crises and Confrontation", desc: "Berlin, Korea and Cuba: how close the world came to nuclear war." },
    { slug: "the-cold-war-worldwide", title: "The Cold War Worldwide", desc: "Proxy wars, decolonisation and the superpowers' global contest." },
    { slug: "how-the-cold-war-ended", title: "How the Cold War Ended", desc: "Gorbachev, people power and the fall of the Berlin Wall in 1989." },
  ],
  decolonisation: [
    { slug: "why-empires-ended", title: "Why Empires Ended", desc: "War, debt and nationalism: the forces that broke up the European empires." },
    { slug: "india-independence-1947", title: "India: Independence 1947", desc: "Gandhi, partition and the birth of India and Pakistan." },
    { slug: "africa-free", title: "Africa Free", desc: "From Ghana in 1957 to the independence movements across the continent." },
    { slug: "legacies-of-empire", title: "Legacies of Empire", desc: "Borders, migration and memory: how empire still shapes the world." },
  ],
  // ── Geography ──
  "my-place": [
    { slug: "my-classroom-map", title: "My Classroom Map", desc: "Draw a bird's-eye plan of your classroom and label the desks, door and windows." },
    { slug: "school-grounds-map", title: "Our School Grounds", desc: "Map the school buildings, playgrounds and entrances as seen from above." },
    { slug: "map-symbols-keys", title: "Symbols and Keys", desc: "Learn how simple pictures and a key help readers understand any map." },
    { slug: "my-neighbourhood", title: "My Neighbourhood", desc: "Spot human and physical features near your home on a local map." },
  ],
  "weather-seasons": [
    { slug: "what-is-weather", title: "What Is Weather?", desc: "Name and describe sunshine, cloud, rain, wind, snow and fog." },
    { slug: "recording-weather", title: "Recording the Weather", desc: "Keep a daily weather diary using words and simple symbols." },
    { slug: "weather-tools", title: "Weather Tools", desc: "Meet the thermometer, rain gauge, wind vane and anemometer." },
    { slug: "the-four-seasons", title: "The Four Seasons", desc: "Discover how spring, summer, autumn and winter change the world around you." },
  ],
  "continents-oceans": [
    { slug: "seven-continents", title: "The Seven Continents", desc: "Name all seven continents and locate each one on a world map." },
    { slug: "five-oceans", title: "The Five Oceans", desc: "Name the five oceans and learn which is the largest." },
    { slug: "continent-highlights", title: "Continent Highlights", desc: "Discover a famous landscape or animal from each continent." },
    { slug: "compass-points", title: "Compass Points", desc: "Use north, south, east and west to describe where continents and oceans lie." },
  ],
  "physical-geography": [
    { slug: "rivers-journey", title: "A River's Journey", desc: "Follow a river from its source to its mouth through the upper, middle and lower courses." },
    { slug: "erosion-processes", title: "Erosion Processes", desc: "Learn how hydraulic action, abrasion, attrition and solution wear away rock." },
    { slug: "meanders-oxbow-lakes", title: "Meanders and Ox-bow Lakes", desc: "Explain how river bends migrate and get cut off to form ox-bow lakes." },
  ],
  "weather-climate": [
    { slug: "water-cycle", title: "The Water Cycle", desc: "Trace water from sea to cloud to rain through evaporation, condensation and precipitation." },
    { slug: "what-shapes-climate", title: "What Shapes Climate", desc: "Discover how latitude, altitude and distance from the sea change temperature and rainfall." },
    { slug: "reading-climate-graphs", title: "Reading Climate Graphs", desc: "Interpret temperature lines and rainfall bars to describe a place's climate." },
    { slug: "climate-change", title: "Climate Change", desc: "Compare natural and human causes of climate change and their effects." },
  ],
  "map-skills": [
    { slug: "os-map-symbols", title: "OS Map Symbols", desc: "Recognise common Ordnance Survey symbols for roads, buildings and land use." },
    { slug: "four-figure-grid-references", title: "Four-Figure Grid References", desc: "Pinpoint one-kilometre squares using eastings first, then northings." },
    { slug: "six-figure-grid-references", title: "Six-Figure Grid References", desc: "Give precise locations by dividing each grid square into tenths." },
    { slug: "map-scale", title: "Map Scale", desc: "Convert map distances to real distances using ratios like 1:50,000." },
  ],
  "human-geography": [
    { slug: "population-distribution-density", title: "Population Distribution", desc: "Explain why people cluster in some places and avoid others." },
    { slug: "migration-push-pull", title: "Migration: Push and Pull", desc: "Analyse the forces that push people away and pull them towards new homes." },
    { slug: "urban-growth", title: "Urban Growth", desc: "Investigate how towns and cities expand through migration and natural increase." },
    { slug: "global-connections", title: "Global Connections", desc: "Explore how trade, transport and communications link countries together." },
  ],
  coasts: [
    { slug: "coastal-processes", title: "Coastal Processes", desc: "Examine destructive and constructive waves, weathering and mass movement at the coast." },
    { slug: "erosional-landforms", title: "Erosional Landforms", desc: "Trace the sequence from crack to cave to arch to stack to stump." },
    { slug: "depositional-landforms", title: "Depositional Landforms", desc: "Explain how longshore drift builds spits, bars and tombolos." },
    { slug: "coastal-management", title: "Managing Coasts", desc: "Evaluate hard and soft engineering strategies and their trade-offs." },
  ],
  urbanisation: [
    { slug: "causes-of-urbanisation", title: "Causes of Urbanisation", desc: "Analyse rural–urban migration and natural increase as drivers of city growth." },
    { slug: "urban-land-use-models", title: "Urban Land-Use Models", desc: "Apply the Burgess and Hoyt models to explain how cities are organised." },
    { slug: "challenges-in-cities", title: "Challenges in Cities", desc: "Assess housing, congestion, pollution and inequality in growing cities." },
    { slug: "sustainable-cities", title: "Sustainable Cities", desc: "Evaluate strategies for greener, fairer cities, from green belts to public transport." },
  ],
  "global-development": [
    { slug: "measuring-development", title: "Measuring Development", desc: "Compare GNI per capita, HDI and other indicators of development." },
    { slug: "causes-of-inequality", title: "Causes of Inequality", desc: "Explain the physical, economic and historical roots of the development gap." },
    { slug: "development-strategies", title: "Development Strategies", desc: "Assess aid, trade and debt relief as routes out of poverty." },
    { slug: "sustainable-development-goals", title: "Sustainable Development Goals", desc: "Explore how the UN's 17 goals aim to end poverty by 2030." },
  ],
  // ── Economics ──
  "needs-wants": [
    { slug: "needs-versus-wants", title: "Needs vs Wants", desc: "Learn the difference between things we must have to live and things we would simply like." },
    { slug: "scarcity-explained", title: "What Is Scarcity?", desc: "Discover why nobody can have everything they want, no matter how rich they are." },
    { slug: "making-choices", title: "Making Choices", desc: "See how every choice means giving something else up." },
    { slug: "saving-and-spending", title: "Saving and Spending", desc: "Practise using limited money wisely through saving first and spending carefully." },
  ],
  money: [
    { slug: "what-money-is", title: "What Money Is", desc: "Learn what money is and why everyone agrees to accept it." },
    { slug: "using-money", title: "Using Money", desc: "See how we pay with cash, cards and phones." },
    { slug: "where-money-comes-from", title: "Where Money Comes From", desc: "Find out how people earn money through work." },
    { slug: "smart-with-money", title: "Being Smart with Money", desc: "Practise budgeting, saving and safe spending habits." },
  ],
  "jobs-work": [
    { slug: "kinds-of-jobs", title: "Kinds of Jobs", desc: "Meet the huge variety of jobs people do." },
    { slug: "why-people-work", title: "Why People Work", desc: "Explore the reasons people work beyond earning money." },
    { slug: "goods-and-services", title: "Goods and Services", desc: "Learn the difference between things we make and help we give." },
    { slug: "jobs-in-our-community", title: "Jobs in Our Community", desc: "See how local jobs keep a community running." },
  ],
  microeconomics: [
    { slug: "market-equilibrium", title: "Market Equilibrium", desc: "Find the price where quantity demanded equals quantity supplied." },
    { slug: "elasticity", title: "Elasticity of Demand", desc: "Measure how strongly demand reacts to price changes." },
    { slug: "costs-of-production", title: "Costs of Production", desc: "Explore fixed, variable and marginal costs for firms." },
  ],
  markets: [
    { slug: "what-is-a-market", title: "What Is a Market?", desc: "Discover what economists mean by a market." },
    { slug: "buyers-and-sellers", title: "Buyers and Sellers", desc: "See how the two sides of every market meet and trade." },
    { slug: "how-prices-are-set", title: "How Prices Are Set", desc: "Learn how bargaining and competition discover prices." },
    { slug: "competition-in-markets", title: "Competition in Markets", desc: "Explore why competition usually helps consumers." },
  ],
  "government-economy": [
    { slug: "role-of-government", title: "What Governments Do", desc: "Learn the main economic jobs of a government." },
    { slug: "taxes-explained", title: "Taxes Explained", desc: "Find out how taxes raise money and who pays them." },
    { slug: "public-services", title: "Public Services", desc: "Explore the services that taxes pay for." },
    { slug: "spending-and-budgets", title: "Spending and Budgets", desc: "See how governments plan their spending and handle trade-offs." },
  ],
  macroeconomics: [
    { slug: "economic-growth", title: "Economic Growth", desc: "Learn how GDP measures growth and why it matters." },
    { slug: "inflation-explained", title: "Inflation Explained", desc: "Understand rising prices and how they are measured." },
    { slug: "unemployment", title: "Unemployment Explained", desc: "Explore the types and costs of joblessness." },
    { slug: "macro-policy", title: "Macroeconomic Policy", desc: "See how governments and central banks steady the economy." },
  ],
  "behavioural-economics": [
    { slug: "rational-choice-theory", title: "Rational Choice Theory", desc: "Examine the traditional model of the rational consumer." },
    { slug: "biases-and-heuristics", title: "Biases and Heuristics", desc: "Meet the mental shortcuts that systematically skew decisions." },
    { slug: "nudge-theory", title: "Nudge Theory", desc: "Learn how small design changes steer behaviour." },
    { slug: "behavioural-policy", title: "Behavioural Economics in Policy", desc: "See how governments apply behavioural insights." },
  ],
  "international-trade": [
    { slug: "why-nations-trade", title: "Why Nations Trade", desc: "Explore comparative advantage and the gains from trade." },
    { slug: "exchange-rates", title: "Exchange Rates", desc: "Learn how currencies are priced and why they move." },
    { slug: "protectionism", title: "Protectionism Explained", desc: "Examine tariffs, quotas and the arguments for and against them." },
    { slug: "globalisation", title: "Globalisation Debated", desc: "Assess the winners, losers and future of global integration." },
  ],
  "development-economics": [
    { slug: "measuring-development", title: "Measuring Development", desc: "Compare GDP, HDI and wider measures of progress." },
    { slug: "causes-of-underdevelopment", title: "Causes of Underdevelopment", desc: "Investigate why some countries stay poor." },
    { slug: "inequality", title: "Inequality Explored", desc: "Explore income gaps within and between countries." },
    { slug: "development-strategies", title: "Development Strategies", desc: "Evaluate aid, trade and investment as routes to growth." },
  ],
  // ── English ──
  phonics: [
    { slug: "single-letter-sounds", title: "Single Letter Sounds", desc: "Learn the sound each letter of the alphabet makes, from a to z." },
    { slug: "blending-cvc-words", title: "Blending Simple Words", desc: "Push letter sounds together to read three-letter words like c-a-t." },
    { slug: "digraphs-and-blends", title: "Digraphs and Blends", desc: "Read two-letter sounds such as sh, ch and th, plus blends like st and br." },
    { slug: "tricky-words", title: "Tricky Words", desc: "Recognise common words that break the rules, like said and the." },
  ],
  "story-time": [
    { slug: "listening-to-stories", title: "Listening to Stories", desc: "Practise sitting, listening and following a story from start to finish." },
    { slug: "story-structure", title: "Beginning, Middle, End", desc: "Learn that every story has a beginning, a middle and an ending." },
    { slug: "characters-and-settings", title: "Characters and Settings", desc: "Meet the people in stories and describe where their adventures happen." },
    { slug: "retelling-stories", title: "Retelling Stories", desc: "Tell a story back in your own words, keeping the events in order." },
  ],
  handwriting: [
    { slug: "grip-and-posture", title: "Grip and Posture", desc: "Hold your pencil correctly and sit comfortably so writing feels easy." },
    { slug: "letter-formation", title: "Forming Letters", desc: "Learn where each letter starts and which way it travels." },
    { slug: "lowercase-uppercase", title: "Lowercase and Uppercase", desc: "Practise small letters and capital letters, and know when to use each." },
    { slug: "joining-letters", title: "Joining Letters", desc: "Connect letters smoothly to build fluent, joined-up writing." },
  ],
  "reading-skills": [
    { slug: "retrieval-skills", title: "Finding Information", desc: "Locate key facts and quotations quickly and accurately in a text." },
    { slug: "making-inferences", title: "Reading Between the Lines", desc: "Work out what a writer implies without saying it directly." },
    { slug: "writers-methods", title: "Writers' Methods", desc: "Spot how language and structure shape a reader's response." },
  ],
  "spoken-language": [
    { slug: "listening-and-responding", title: "Listen and Respond", desc: "Show you are listening and build on what others say." },
    { slug: "planning-a-talk", title: "Planning a Talk", desc: "Organise ideas into a clear beginning, middle and end." },
    { slug: "using-your-voice", title: "Using Your Voice", desc: "Control pace, volume and emphasis to keep listeners engaged." },
    { slug: "group-discussion", title: "Group Discussion", desc: "Take turns, disagree politely and reach decisions together." },
  ],
  "grammar-vocabulary": [
    { slug: "word-classes", title: "Word Classes", desc: "Name the eight parts of speech and use each one correctly." },
    { slug: "clauses-and-sentences", title: "Clauses and Sentences", desc: "Build simple, compound and complex sentences for different effects." },
    { slug: "punctuation-that-works", title: "Punctuation That Works", desc: "Master commas, apostrophes and colons so your meaning is never in doubt." },
    { slug: "building-vocabulary", title: "Building Vocabulary", desc: "Learn new words deeply and choose the precise one every time." },
  ],
  "writing-skills": [
    { slug: "planning-before-writing", title: "Planning Before Writing", desc: "Turn a question into a plan with clear, ordered points." },
    { slug: "essay-paragraphs", title: "Essay Paragraphs", desc: "Build PEED paragraphs that argue, evidence and develop ideas." },
    { slug: "descriptive-writing", title: "Descriptive Writing", desc: "Create vivid settings using the five senses and precise language." },
    { slug: "writing-to-argue", title: "Writing to Argue", desc: "Persuade readers with structured arguments and rhetorical devices." },
  ],
  literature: [
    { slug: "reading-shakespeare", title: "Reading Shakespeare", desc: "Unlock Shakespeare's language, verse and stagecraft." },
    { slug: "studying-the-novel", title: "Studying the Novel", desc: "Analyse narrative voice, character and structure in prose fiction." },
    { slug: "analysing-poetry", title: "Analysing Poetry", desc: "Explore form, rhythm and imagery in poems from different eras." },
    { slug: "critical-lenses", title: "Critical Lenses", desc: "Apply feminist, Marxist and other readings to literary texts." },
  ],
  "language-analysis": [
    { slug: "meaning-and-semantics", title: "Meaning and Semantics", desc: "Explore how words carry denotation, connotation and ambiguity." },
    { slug: "grammar-choices", title: "Grammar Choices", desc: "See how syntax, tense and voice shape a reader's response." },
    { slug: "pragmatics-in-action", title: "Pragmatics in Action", desc: "Uncover implied meaning, politeness and what is left unsaid." },
    { slug: "stylistic-analysis", title: "Stylistic Analysis", desc: "Combine every linguistic level into a full critical commentary." },
  ],
  rhetoric: [
    { slug: "ethos-pathos-logos", title: "Ethos, Pathos, Logos", desc: "Master Aristotle's three modes of persuasion." },
    { slug: "rhetorical-devices", title: "Rhetorical Devices", desc: "Deploy anaphora, tricolon and rhetorical questions with precision." },
    { slug: "building-an-argument", title: "Building an Argument", desc: "Structure claims, evidence and counterarguments convincingly." },
    { slug: "great-speeches", title: "Great Speeches", desc: "Study landmark speeches and the techniques that made them endure." },
  ],
  // ── Psychology ──
  feelings: [
    { slug: "naming-our-feelings", title: "Naming Our Feelings", desc: "Learn the words for happy, sad, angry, scared, surprised and calm, and practise spotting each feeling in yourself." },
    { slug: "what-feelings-are-for", title: "What Feelings Are For", desc: "Discover how emotions are messages from your brain that tell you what you need, like comfort, rest or fairness." },
    { slug: "expressing-feelings-safely", title: "Expressing Feelings Safely", desc: "Practise healthy ways to show big feelings, such as using words, drawing, slow breathing and asking for help." },
    { slug: "understanding-other-people", title: "Understanding Other People", desc: "Learn to notice how others feel from their faces and voices, and how to show you care." },
  ],
  friendship: [
    { slug: "what-makes-a-good-friend", title: "What Makes a Good Friend", desc: "Spot the qualities of a good friend, such as kindness, honesty and listening, and practise being one yourself." },
    { slug: "taking-turns-and-sharing", title: "Taking Turns and Sharing", desc: "Learn why turn-taking keeps games fair and fun, and practise waiting patiently for your go." },
    { slug: "fixing-arguments", title: "Fixing Arguments", desc: "Discover a simple step-by-step way to sort out disagreements without shouting or sulking." },
    { slug: "kindness-and-inclusion", title: "Kindness and Inclusion", desc: "Explore how small acts of kindness help everyone feel welcome, especially someone new or left out." },
  ],
  "growing-minds": [
    { slug: "practice-makes-progress", title: "Practice Makes Progress", desc: "See how trying again and again grows new skills, and learn why effort matters more than being perfect first time." },
    { slug: "asking-for-help", title: "Asking for Help", desc: "Discover why asking for help is a smart strategy rather than a weakness, and practise asking clear questions." },
    { slug: "mistakes-are-normal", title: "Mistakes Are Normal", desc: "Learn how mistakes teach your brain, and why every expert was once a beginner." },
    { slug: "the-growth-mindset", title: "The Growth Mindset", desc: "Explore Carol Dweck's idea that abilities can grow with effort, and how your self-talk shapes your learning." },
  ],
  "mind-memory": [
    { slug: "the-multi-store-model", title: "The Multi-Store Model", desc: "Meet Atkinson and Shiffrin's model of how memories flow from the sensory register through short-term to long-term memory." },
    { slug: "types-of-long-term-memory", title: "Types of Long-Term Memory", desc: "Compare semantic, episodic and procedural memory, and see how each one is stored and used." },
  ],
  "social-behaviour": [
    { slug: "the-bystander-effect", title: "The Bystander Effect", desc: "Find out why crowds can make people less likely to help, through Darley and Latané's classic research." },
    { slug: "persuasion-and-attitudes", title: "Persuasion and Attitudes", desc: "Learn how attitudes form and change, from the elaboration likelihood model to the discomfort of cognitive dissonance." },
  ],
  "the-brain": [
    { slug: "neurons-and-synapses", title: "Neurons and Synapses", desc: "Meet the brain's messenger cells and the tiny gaps where they pass signals to each other." },
    { slug: "parts-of-the-brain", title: "Parts of the Brain", desc: "Tour the cerebrum, cerebellum and brain stem, and find out what each part does." },
    { slug: "messages-along-nerves", title: "Messages Along Nerves", desc: "Follow an electrical signal racing along a neuron and jumping the synapse as a chemical message." },
    { slug: "connections-that-grow", title: "Connections That Grow", desc: "Discover how learning strengthens the links between neurons — and why practice matters." },
  ],
  development: [
    { slug: "piagets-stages", title: "Piaget's Stages", desc: "Walk through Piaget's four stages of cognitive development, from object permanence to abstract thought." },
    { slug: "vygotskys-scaffolding", title: "Vygotsky's Scaffolding", desc: "Learn how the zone of proximal development and scaffolding explain learning with help from others." },
  ],
  // ── Sociology ──
  families: [
    { slug: "what-is-a-family", title: "What Makes a Family?", desc: "Discover what families have in common and why they are so important." },
    { slug: "nuclear-and-extended", title: "Nuclear and Extended Families", desc: "Compare small family households with big family groups that share a home." },
    { slug: "one-parent-and-blended", title: "One-Parent and Blended Families", desc: "See how families take new shapes when parents live apart or remarry." },
    { slug: "families-around-the-world", title: "Families Around the World", desc: "Travel the globe to see how family life differs between cultures." },
  ],
  "school-society": [
    { slug: "why-we-have-rules", title: "Why We Have Rules", desc: "Find out why school rules exist and who they protect." },
    { slug: "roles-at-school", title: "Roles at School", desc: "Meet the different roles people play, from pupil to headteacher." },
    { slug: "belonging-to-a-group", title: "Belonging to a Group", desc: "Learn what belonging feels like and why groups matter." },
    { slug: "being-a-good-citizen", title: "Being a Good Citizen", desc: "Practise the small acts that make school better for everyone." },
  ],
  communities: [
    { slug: "what-is-a-community", title: "What Is a Community?", desc: "Discover what makes a group of people a community." },
    { slug: "community-helpers", title: "Community Helpers", desc: "Meet the people whose jobs keep a community running safely." },
    { slug: "communities-change", title: "How Communities Change", desc: "See how places change as new people and buildings arrive." },
    { slug: "helping-your-community", title: "Helping Your Community", desc: "Find simple ways to make a difference where you live." },
  ],
  foundations: [
    { slug: "three-core-perspectives", title: "Three Core Perspectives", desc: "Compare functionalism, conflict theory and symbolic interactionism." },
    { slug: "structure-and-agency", title: "Structure and Agency", desc: "Debate how much society shapes us versus how much we shape ourselves." },
  ],
  "culture-identity": [
    { slug: "subcultures-and-countercultures", title: "Subcultures and Countercultures", desc: "Explore groups that live by different rules, from mods to hippies." },
    { slug: "globalisation-and-hybridity", title: "Globalisation and Hybridity", desc: "See how world cultures mix, blend and borrow from each other." },
  ],
  socialisation: [
    { slug: "agents-of-socialisation", title: "Agents of Socialisation", desc: "Meet the family, school, peers, media and religion as our social teachers." },
    { slug: "primary-and-secondary", title: "Primary and Secondary Socialisation", desc: "Compare childhood's first lessons with the ones that come later." },
    { slug: "meads-i-and-me", title: "Mead's I and Me", desc: "Explore how George Herbert Mead saw the self growing through other people." },
    { slug: "socialisation-for-life", title: "Socialisation for Life", desc: "See how learning society's ways continues from cradle to old age." },
  ],
  inequality: [
    { slug: "marx-vs-weber", title: "Marx vs Weber on Stratification", desc: "Contrast Marx's two-class model with Weber's class, status and party." },
    { slug: "gender-inequality", title: "Gender Inequality", desc: "Examine the gender pay gap and the barrier called the glass ceiling." },
  ],
  // ── Political Science ──
  rules: [
    { slug: "why-we-have-rules", title: "Why We Have Rules", desc: "Explores how rules keep everyone safe, fair and able to get along at home and at school." },
    { slug: "rules-vs-laws", title: "Rules Versus Laws", desc: "Shows the difference between school rules and the country's laws, and who enforces each." },
    { slug: "fair-and-unfair-rules", title: "Fair and Unfair Rules", desc: "Helps learners spot the difference between rules that protect everyone and rules that are unfair." },
    { slug: "following-rules", title: "Following Rules and Consequences", desc: "Explains what happens when rules are kept or broken, and why consequences should be fair." },
  ],
  leaders: [
    { slug: "what-leaders-do", title: "What Leaders Do", desc: "Describes how leaders make decisions, look after people and take responsibility." },
    { slug: "kinds-of-leaders", title: "Different Kinds of Leaders", desc: "Meets leaders from the classroom to the country, such as class reps, mayors and the prime minister." },
    { slug: "choosing-leaders", title: "Choosing Leaders Fairly", desc: "Shows how fair elections, votes and rotas let everyone have a say." },
    { slug: "good-leader-qualities", title: "Good Leader Qualities", desc: "Identifies the qualities of a good leader, like honesty, kindness and listening." },
  ],
  voting: [
    { slug: "what-is-voting", title: "What Voting Is", desc: "Explains how voting lets a group choose fairly when people disagree." },
    { slug: "one-person-one-vote", title: "One Person, One Vote", desc: "Shows why every vote should count equally in a fair election." },
    { slug: "secret-ballot", title: "Secret Ballots", desc: "Explains why voting in secret keeps people free from pressure and bullying." },
    { slug: "accepting-results", title: "Accepting Results Gracefully", desc: "Teaches why accepting a fair result matters, even when your side loses." },
  ],
  "power-politics": [
    { slug: "understanding-power", title: "Understanding Power", desc: "Covers Max Weber's definition of power as getting your way despite resistance, plus Joseph Nye's hard power and soft power." },
    { slug: "authority-and-legitimacy", title: "Authority and Legitimacy", desc: "Explains Weber's three types of legitimate authority: traditional, charismatic and rational-legal." },
  ],
  democracy: [
    { slug: "liberal-democracy-features", title: "Features of Liberal Democracy", desc: "Identifies the pillars of liberal democracy, from free elections to the rule of law and Montesquieu's separation of powers." },
    { slug: "direct-vs-representative", title: "Direct Versus Representative Democracy", desc: "Compares ancient Athens, where citizens voted directly, with modern systems that elect representatives." },
  ],
  rights: [
    { slug: "what-are-human-rights", title: "What Human Rights Are", desc: "Introduces human rights as freedoms and protections that belong to every person." },
    { slug: "universal-declaration", title: "The Universal Declaration", desc: "Explores the Universal Declaration of Human Rights, adopted by the United Nations in 1948." },
    { slug: "childrens-rights", title: "Children's Rights", desc: "Covers the UN Convention on the Rights of the Child and the protections it gives young people." },
    { slug: "rights-and-responsibilities", title: "Rights and Responsibilities", desc: "Shows how rights come with responsibilities, using real-world rights issues." },
  ],
  "global-politics": [
    { slug: "the-united-nations", title: "The United Nations", desc: "Explains the UN's founding in 1945 and the roles of the Security Council and General Assembly." },
    { slug: "the-european-union", title: "The European Union", desc: "Describes the EU as a supranational body sharing sovereignty across its member states." },
  ],
  // ── Russian ──
  "russian-sounds": [
    { slug: "meet-the-vowels", title: "Meet the Vowels", desc: "Learn the ten vowel letters and the sounds they make, from А (a) to Я (ya)." },
    { slug: "consonant-friends", title: "Consonant Friends", desc: "Meet friendly consonants like М (m), К (k) and Т (t) and practise saying them clearly." },
    { slug: "tricky-pairs", title: "Tricky Letter Pairs", desc: "Spot the difference between look-alike letters such as В (v) and Б (b), and Р (r) and П (p)." },
    { slug: "read-your-first-words", title: "Read Your First Words", desc: "Blend letters together to read your first real Russian words, like мама (máma — mum) and кот (kot — cat)." },
  ],
  "russian-greetings": [
    { slug: "hello-and-goodbye", title: "Hello and Goodbye", desc: "Learn the friendly and polite ways to say hello and goodbye in Russian." },
    { slug: "how-are-you", title: "How Are You?", desc: "Ask Как дела? (kak delá — how are you?) and answer with words like хорошо (khoroshó — good) and отлично (otlíchnо — excellent)." },
    { slug: "saying-my-name", title: "Saying My Name", desc: "Introduce yourself with Меня зовут… (menyá zovút — my name is…) and ask someone's name in return." },
    { slug: "magic-polite-words", title: "Magic Polite Words", desc: "Say спасибо (spasíbo — thank you), пожалуйста (pozháluysta — please) and извините (izviníte — excuse me) to sound kind and polite." },
  ],
  "russian-numbers": [
    { slug: "counting-to-ten", title: "Counting to Ten", desc: "Learn the numbers from один (odín — one) to десять (désyat' — ten) with rhymes and games." },
    { slug: "counting-to-twenty", title: "Counting to Twenty", desc: "Build on ten to reach двадцать (dvádtsat' — twenty) and count like a pro." },
    { slug: "rainbow-of-colours", title: "A Rainbow of Colours", desc: "Learn the colour words from красный (krásnyy — red) to белый (bélyy — white) and spot them everywhere." },
    { slug: "describing-things", title: "Describing Things", desc: "Put colours and nouns together to describe the world: красная машина (krásnaya mashína — red car)!" },
  ],
  cyrillic: [
    { slug: "lookalike-letters", title: "Look-Alike Letters", desc: "Tell apart tricky pairs like Ш (sha) and Щ (shcha), И (i) and Й (short y), Е (ye) and Ё (yo)." },
    { slug: "hard-and-soft-signs", title: "Hard and Soft Signs", desc: "Learn what Ъ (the hard sign) and Ь (the soft sign) really do and why they change pronunciation." },
  ],
  "russian-my-world": [
    { slug: "my-family", title: "My Family", desc: "Name your family members, from мама (máma — mum) to двоюродный брат (dvoyúrodnyy brat — cousin), and describe them." },
    { slug: "friends-and-school", title: "Friends and School", desc: "Talk about your friends, your teachers and a normal school day." },
    { slug: "hobbies-and-freetime", title: "Hobbies and Free Time", desc: "Say what you love doing, from football to music to gaming." },
    { slug: "describing-people", title: "Describing People", desc: "Use adjectives to describe what people look like and what they are like." },
  ],
  "first-steps": [
    { slug: "formal-and-informal", title: "Formal or Friendly?", desc: "Master ты (ty — informal you) and вы (vy — formal you) and learn when each is appropriate." },
    { slug: "noun-genders", title: "Noun Genders", desc: "Sort nouns into masculine, feminine and neuter using their endings." },
  ],
  "daily-russian": [
    { slug: "telling-the-time", title: "Telling the Time", desc: "Say the time in Russian, from час (chas — one o'clock) to половина третьего (polovína trét'yevo — half past two)." },
    { slug: "days-and-dates", title: "Days and Dates", desc: "Name the days of the week and say dates like первое сентября (pérvoye sentyabryá — 1st September)." },
  ],
  "russian-literature": [
    { slug: "pushkin-and-onegin", title: "Pushkin and Onegin", desc: "Meet Eugene Onegin, the original superfluous man, and the famous 14-line stanza." },
    { slug: "chekhovs-short-stories", title: "Chekhov's Short Stories", desc: "Explore subtext and the famous gun in stories like 'The Lady with the Dog'." },
    { slug: "tolstoy-and-realism", title: "Tolstoy and Realism", desc: "Tackle War and Peace and the moral questions of the Russian realist novel." },
    { slug: "russian-film-classics", title: "Russian Film Classics", desc: "From Eisenstein's montage to Tarkovsky's long takes, learn to read film as text." },
  ],
  "russian-advanced-grammar": [
    { slug: "verbs-of-motion", title: "Verbs of Motion", desc: "Conquer идти (idtí — to go on foot) versus ходить (khodít'), ехать (yékhat' — to go by transport) versus ездить (yézdit'), and their prefixes." },
    { slug: "aspect-pairs", title: "Aspect Pairs", desc: "Choose between imperfective and perfective with pairs like делать (délat' — to do) and сделать (sdélat' — to have done)." },
    { slug: "participles-in-action", title: "Participles in Action", desc: "Build and decode active and passive participles such as читающий (chitáyushchiy — reading) and прочитанный (prochítannyy — read)." },
    { slug: "gerunds-and-complex-sentences", title: "Gerunds and Complex Sentences", desc: "Use деепричастия (deyeprichástiya — gerunds) like читая (chitáya — while reading) to link ideas elegantly." },
  ],
  "russian-culture": [
    { slug: "russian-holidays", title: "Russian Holidays", desc: "From Новый год (Nóvyy god — New Year) to Масленица (Máslenitsa — pancake week), learn how Russia celebrates." },
    { slug: "food-and-hospitality", title: "Food and Hospitality", desc: "Explore bread-and-salt welcomes, the groaning festive table and endless tea culture." },
    { slug: "geography-and-cities", title: "Geography and Cities", desc: "Travel from Moscow to Vladivostok across eleven time zones." },
    { slug: "traditions-and-etiquette", title: "Traditions and Etiquette", desc: "Master the unwritten rules, from flowers to slippers to the баня (bánya — steam bath)." },
  ],
};
