import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CURRICULA, CURRICULUM_SLUGS } from "@/lib/curriculum";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Curriculum",
  description:
    "Each curriculum is represented on its own terms. Choose British, Cambridge, American or IB to see its stages and levels, then continue to subjects and chapters.",
  path: "/curriculum",
});

export default function CurriculumIndexPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Curriculum" }]}
        title="Curriculum"
        lede="Each curriculum is represented on its own terms. Choose one to see its stages and levels, then continue to subjects and chapters."
      />
      <section className="section" style={{ paddingTop: 0 }}>
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
      </section>
    </>
  );
}
