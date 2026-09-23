import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Thread Academy is an educational knowledge platform built to make complete school subjects easier to navigate, understand, and revisit.",
  path: "/about",
});

const PROVIDES = [
  "Curriculum-specific routes",
  "Subject and chapter maps",
  "Textbook-style explanations",
  "Practice and revision resources",
  "Open access without an account",
];

const CHAPTERS = [
  {
    title: "The problem",
    desc: "Online learning often separates explanations, practice, and curriculum context. Students can find an answer without seeing where the idea belongs.",
  },
  {
    title: "Our structure",
    desc: "Subject → Curriculum → Level → Chapter → Topic. British, Cambridge, American, and IB routes keep their own stages rather than being forced into one hierarchy.",
  },
  {
    title: "How students use it",
    desc: "Choose the route you study, read a complete topic, work through examples, answer quick checks, and follow related topics.",
  },
  {
    title: "Our approach",
    desc: "Clear definitions come first. Explanations connect ideas. Worked examples make reasoning visible. Practice asks students to use what they learned.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title="Knowledge needs a path."
        lede="Thread Academy is an educational knowledge platform built to make complete school subjects easier to navigate, understand, and revisit."
      />
      <section className="subject-overview">
        <div className="overview-grid">
          <aside className="overview-aside">
            <h2>What we provide</h2>
            <ul className="learn-list">
              {PROVIDES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
          <div className="chapters">
            {CHAPTERS.map((c, i) => (
              <div key={c.title} className="chapter-link">
                <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="chapter-title">{c.title}</span>
                  <span className="chapter-desc">{c.desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
