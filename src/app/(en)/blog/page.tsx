/**
 * BLOG INDEX — the page at /blog ("The learning journal"), in every language.
 * Lists the blog posts with a genuine translation in the page language,
 * grouped by subject. To add a post, drop a new .mdx file in content/blog/
 * (or content/<lang>/blog/) — no code changes needed.
 */
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { getPostsBySubject } from "@/lib/blog";
import { withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";

export async function generateMetadata(props: { params: Promise<LangParam> }): Promise<Metadata> {
  const params = await props.params;
  const lang = requireLang(params);
  return pageMetadata({
    title: t(lang, "blog.meta.title"),
    description: t(lang, "blog.meta.desc"),
    path: "/blog",
    lang,
  });
}

/** The page itself — what the visitor sees. */
export default async function BlogIndexPage(props: { params: Promise<LangParam> }) {
  const params = await props.params;
  const lang: Lang = requireLang(params);
  const groups = getPostsBySubject(lang);
  let n = 0;
  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "blog.crumb") },
        ]}
        title={t(lang, "blog.hero.title")}
        lede={t(lang, "blog.hero.lede")}
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
                  <Link
                    key={post.slug}
                    className="chapter-link"
                    href={withLang(`/blog/${post.slug}`, lang)}
                  >
                    <span className="chapter-index">{String(n).padStart(2, "0")}</span>
                    <span>
                      <span className="chapter-title">{post.title}</span>
                      <span className="chapter-desc">{post.description}</span>
                    </span>
                    <span className="chapter-status">{t(lang, "blog.read")}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="empty-note">{t(lang, "blog.empty")}</p>
        )}
      </section>
    </>
  );
}
