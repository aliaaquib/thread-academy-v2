/**
 * HOME PAGE — the page at / (the very first page visitors see).
 * Shows the hero, quick lesson links, and subject cards grouped by category
 * (STEM / Humanities / Languages). Content comes from src/lib/subjects.ts —
 * to change which subjects appear, edit that file, not this one.
 */
import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import { CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { getChaptersForSubject } from "@/lib/stage-chapters";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Thread Academy",
  description:
    "Free school lessons, worked examples, practice and tests — from foundations to advanced study. No account required.",
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
  psychology: "Ψ",
  sociology: "◉",
  "political-science": "⚖",
  russian: "Ж",
};

/** Reference "How Thread Academy works" steps, verbatim. */
const STEPS = [
  {
    num: "1",
    title: "Choose a subject",
    text: "Pick the subject you want to learn.",
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

/** The page itself — what the visitor sees. */
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
              Thread Academy is an open learning platform for school subjects. Pick a subject,
              open a chapter, and follow the thread from first principles to advanced ideas.
            </p>
          </div>
        </div>
        <HeroSearch />
      </header>

      <section className="section" id="subjects">
        <div className="section-head">
          <h2>Subjects, organised by chapter.</h2>
          <p>
            Start with a discipline, move through its chapters, and complete textbook-style topics.
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
                          {getChaptersForSubject(subject.slug).length} chapters
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
            Use the platform as a guided library: find your subject, learn the topic in depth,
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
