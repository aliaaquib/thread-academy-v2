/**
 * BLOG INDEX — the page at /blog ("The learning journal").
 * Lists every blog post from content/blog/, grouped by subject.
 * To add a post, drop a new .mdx file in content/blog/ — no code changes needed.
 */
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { getPostsBySubject } from "@/lib/blog";

export const metadata = pageMetadata({
  title: "Blog — Learning Journal",
  description:
    "The Thread Academy learning journal: in-depth student guides to the ideas students search for most, from linear equations to photosynthesis, linked to full lessons.",
  path: "/blog",
});

/** The page itself — what the visitor sees. */
export default function BlogIndexPage() {
  const groups = getPostsBySubject();
  let n = 0;
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        title="The learning journal."
        lede="Long-form guides to the ideas students search for most — each one connected to the lessons and chapters it belongs to."
      />
      <section className="subject-overview">
        {groups.map((group) => (
          <div key={group.subjectSlug} style={{ marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              {group.subject}
            </div>
            <div className="chapters">
              {group.posts.map((post) => {
                n += 1;
                return (
                  <Link key={post.slug} className="chapter-link" href={`/blog/${post.slug}`}>
                    <span className="chapter-index">{String(n).padStart(2, "0")}</span>
                    <span>
                      <span className="chapter-title">{post.title}</span>
                      <span className="chapter-desc">{post.description}</span>
                    </span>
                    <span className="chapter-status">Read article →</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
