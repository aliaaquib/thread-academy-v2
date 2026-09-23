import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import { CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { CURRICULA, CURRICULUM_SLUGS } from "@/lib/curriculum";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Thread Academy",
  description:
    "Free school lessons, worked examples, practice and tests across British, Cambridge, American and IB curricula — from primary foundations to advanced study. No account required.",
  path: "/",
});

/** Reference glyphs per subject slug (approved design; not emoji). */
const GLYPHS: Record<string, string> = {
  mathematics: "x²",
  physics: "F→",
  chemistry: "H₂",
  biology: "DNA",
  "computer-science": "</>",
  english: "Aa",
  history: "AD",
  geography: "◎",
  economics: "↗",
  business: "B",
  spanish: "Ñ",
  french: "Ç",
  "environmental-science": "♻",
  "earth-science": "⊕",
  "astronomy": "✦",
  "engineering": "⚙",
  "psychology": "Ψ",
  "sociology": "◉",
  "political-science": "⚖",
  "philosophy": "φ",
  "religious-studies": "◈",
  "civics": "§",
  "global-studies": "🌐",
  "german": "Ä",
  "arabic": "ع",
  "chinese": "中",
  "japanese": "あ",
  "russian": "Ж",
};

/** Reference "How Thread Academy works" steps, verbatim. */
const STEPS = [
  {
    num: "1",
    title: "Choose a route",
    text: "Select a subject or begin with your curriculum and level.",
  },
  {
    num: "2",
    title: "Open a chapter",
    text: "See the sequence of topics and where each idea belongs.",
  },
  {
    num: "3",
    title: "Learn deeply",
    text: "Read explanations, definitions, worked examples, and diagrams.",
  },
  {
    num: "4",
    title: "Use resources",
    text: "Practise with quick checks, worksheets, notes, and revision guides.",
  },
];

export default function HomePage() {
  return (
    <>
      <header className="home-hero">
        <div className="hero-grid">
          <div>
            <h1>
              Follow the thread. <span className="underline">Understand the subject.</span>
            </h1>
            <p className="hero-copy">
              Thread Academy is an open learning platform for school subjects. Study Mathematics,
              Biology, Physics, Computer Science, languages, and more through the curriculum and
              level you actually follow.
            </p>
          </div>
        </div>
        <HeroSearch />
      </header>

      <section className="section" id="subjects">
        <div className="section-head">
          <h2>Subjects, connected to real curricula.</h2>
          <p>
            Start with a discipline, choose your curriculum and level, then move through chapters
            and complete textbook-style topics.
          </p>
        </div>
        {CATEGORY_ORDER.map((category) => (
          <div key={category}>
            <div className="eyebrow" style={{ margin: "42px 0 16px" }}>
              {category}
            </div>
            <div className="subjects-grid">
              {subjectsByCategory(category).slice(0, 3).map((subject) => (
                  <Link
                    key={subject.slug}
                    className="subject-card"
                    href={`/subjects/${subject.slug}`}
                  >
                    <div className="subject-icon" aria-hidden="true">
                      {GLYPHS[subject.slug] ?? subject.slug.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="subject-bottom">
                      <div>
                        <h3>{subject.name}</h3>
                        <div className="subject-meta">
                          {subject.chapters.length} chapter areas · four curricula
                        </div>
                      </div>
                      <span className="subject-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
            <p style={{ marginTop: 18 }}>
              <Link className="inline-link" href={`/subjects/${category.toLowerCase()}`}>
                Browse {category === "STEM" ? "STEM" : category === "HUMANITIES" ? "Humanities" : "Languages"} subjects{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </p>
          </div>
        ))}
        <p style={{ marginTop: 36 }}>
          <Link className="inline-link" href="/subjects">
            Browse every subject <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>

      <section className="section alt" id="curriculum">
        <div className="inner">
          <div className="section-head">
            <h2>Four curricula. Their own structures.</h2>
            <p>
              British, Cambridge, American, and IB pathways keep the stages, years, grades, and
              programmes that belong to them.
            </p>
          </div>
          <div className="curriculum-grid">
            {CURRICULUM_SLUGS.map((slug, i) => {
              const c = CURRICULA[slug];
              return (
                <Link key={slug} className="curriculum-card" href={`/curriculum/${slug}`}>
                  <span className="curriculum-num">
                    {String(i + 1).padStart(2, "0")} / CURRICULUM
                  </span>
                  <h3>{c.name}</h3>
                  <p>{c.desc}</p>
                  <div className="stage-line" aria-hidden="true">
                    {c.stages.map((s) => (
                      <span key={s.slug}>{s.name}</span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" id="why">
        <aside className="today-card">
          <div className="today-label">Why we built it</div>
          <h2>Learning should have a clear structure.</h2>
          <p>
            Lessons connect definitions, explanations, worked examples, practice, and revision
            so each idea leads naturally to the next.
          </p>
          <Link className="inline-link" href="/about">
            About Thread Academy <span aria-hidden="true">→</span>
          </Link>
        </aside>
      </section>

      <section className="section" id="how">
        <div className="section-head">
          <h2>How Thread Academy works.</h2>
          <p>
            Use the platform as a guided library: find the right route, learn the topic in depth,
            practise, then follow related ideas.
          </p>
        </div>
        <div className="how-grid">
          {STEPS.map((step) => (
            <div key={step.num} className="how-step">
              <div className="how-n">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
