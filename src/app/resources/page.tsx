import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getContentChapters } from "@/lib/content";
import { SUBJECT_SLUGS, getSubject } from "@/lib/subjects";
import { getChapterForSubject, getChaptersForSubject } from "@/lib/stage-chapters";
import { pageMetadata } from "@/lib/seo";

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
};

export const metadata = pageMetadata({
  title: "Resources",
  description:
    "Find notes, worksheets, worked examples, interactive tools, and revision materials beside the chapter they support.",
  path: "/resources",
});

export default function ResourcesHubPage() {
  const chapters = getContentChapters();

  const cards = SUBJECT_SLUGS.map((subjectSlug) => {
    const subject = getSubject(subjectSlug);
    if (!subject) return null;
    // First chapter (in subject order) that has published lessons.
    const withContent = new Set(
      chapters.filter((c) => c.subject === subjectSlug).map((c) => c.chapter)
    );
    const first = getChaptersForSubject(subjectSlug).find((c) => withContent.has(c.id));
    if (!first) return null;
    const chapter = getChapterForSubject(subjectSlug, first.id);
    if (!chapter) return null;
    return {
      subject,
      href: `/resources/${subjectSlug}/${chapter.id}`,
      meta: chapter.title,
    };
  }).filter((c) => c !== null);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
        title="Resources"
        lede="Find notes, worksheets, worked examples, interactive tools, and revision materials beside the chapter they support."
      />
      <section className="subject-overview">
        <div className="subjects-grid">
          {cards.map((card) => (
            <Link key={card.subject.slug} className="subject-card" href={card.href}>
              <div className="subject-icon" aria-hidden="true">
                {GLYPHS[card.subject.slug] ?? card.subject.slug.slice(0, 2).toUpperCase()}
              </div>
              <div className="subject-bottom">
                <div>
                  <h3>{card.subject.name}</h3>
                  <div className="subject-meta">{card.meta}</div>
                </div>
                <span className="subject-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
