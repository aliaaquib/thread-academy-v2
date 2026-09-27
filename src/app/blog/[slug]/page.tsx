/**
 * BLOG POST — the page at /blog/<post-name>.
 * Renders one .mdx file from content/blog/, plus "related lessons" links
 * built automatically from the chapter data (src/lib/blog.ts).
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/mdx-components";
import PageHero from "@/components/PageHero";
import { RelatedTopics } from "@/components/textbook/RelatedTopics";
import { getPost, getPostSlugs, getRelatedLinks } from "@/lib/blog";
import { JsonLd, absoluteUrl, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

/** Tells the site builder which pages to create ahead of time (one per subject/grade/chapter/topic). */
export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

/** The title + description Google and link previews show for this page. */
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** The page itself — what the visitor sees. */
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  const related = getRelatedLinks(post);
  const path = `/blog/${post.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          url: absoluteUrl(path),
          datePublished: post.date,
          ...(post.updated ? { dateModified: post.updated } : {}),
          keywords: post.keywords.join(", "),
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          isPartOf: { "@type": "Blog", name: `${SITE_NAME} Blog`, url: absoluteUrl("/blog") },
        }}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
        title={post.title}
        lede={post.description}
      />
      <section className="subject-overview">
        <article className="lesson-article">
          <p style={{ fontSize: "0.95rem" }}>
            By {post.author} · {formatDate(post.date)}
            {post.subject ? ` · ${post.subject}` : ""}
          </p>
          {/* blockJS:false — blog MDX is authored in-repo (trusted), same as lessons. */}
          <MDXRemote source={post.source} components={mdxComponents} options={{ blockJS: false }} />
        </article>
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            Related topics
          </div>
          <RelatedTopics items={related} />
          <div className="lesson-finish">
            <Link className="next-btn" href="/blog">
              Back to the blog
            </Link>
            {post.subjectSlug && (
              <Link className="next-btn" href={`/subjects/${post.subjectSlug}`}>
                Browse {post.subject} →
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
