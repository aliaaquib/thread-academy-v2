import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CATEGORY_ORDER, subjectsByCategory } from "@/lib/subjects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Subjects",
  description:
    "Explore 28 school subjects by category. Every subject can be followed through British, Cambridge, American, or IB structures.",
  path: "/subjects",
});

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

export default function SubjectsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Subjects" }]}
        title="Subjects"
        lede="Explore school subjects by category. Every subject can be followed through British, Cambridge, American, or IB structures."
      />
      <section className="subject-overview">
        {CATEGORY_ORDER.map((category) => (
          <div key={category}>
            <div className="eyebrow" style={{ margin: "42px 0 16px" }}>
              {category}
            </div>
            <div className="subjects-grid">
              {subjectsByCategory(category).map((subject) => (
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
          </div>
        ))}
      </section>
    </>
  );
}
