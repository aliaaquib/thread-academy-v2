/**
 * BLOG POST — the page at /blog/<post-name> (and /tr/blog/…, /ru/blog/…, /ky/blog/…).
 * Renders one .mdx file from content/blog/ or content/<lang>/blog/, plus
 * "related lessons" links. Non-English versions render only when the post has
 * a genuine translation — getPostSlugs(lang) lists only translated files.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponentsForLang } from "@/mdx-components";
import PageHero from "@/components/PageHero";
import { JsonLd, absoluteUrl, pageMetadata, SITE_NAME } from "@/lib/seo";
import { getPost, getPostSlugs, getRelatedLinks, postLangs } from "@/lib/blog";
import { langMeta, withLang, type Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { requireLang, type LangParam } from "@/lib/route-lang";
import { postParams } from "@/lib/route-params";

export function generateStaticParams() {
  return postParams("en");
}

type Params = LangParam & { slug: string };

/** Format an ISO date (YYYY-MM-DD) in the page language. */
function formatPostDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  try {
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(langMeta(lang).locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return iso;
  }
}

/** The title + description Google and link previews show for this page. */
export async function generateMetadata({ params }: { params: Params }) {
  const lang: Lang = requireLang(params);
  const post = getPost(params.slug, lang);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    lang,
    alternates: postLangs(post.slug),
  });
}

/** The page itself — what the visitor sees. */
export default function BlogPostPage({ params }: { params: Params }) {
  const lang: Lang = requireLang(params);
  const post = getPost(params.slug, lang);
  if (!post) notFound();

  const related = getRelatedLinks(post, lang);
  const url = absoluteUrl(withLang(`/blog/${post.slug}`, lang));

  return (
    <>
      <PageHero
        crumbs={[
          { label: t(lang, "common.home"), href: withLang("/", lang) },
          { label: t(lang, "blog.crumb"), href: withLang("/blog", lang) },
          { label: post.title },
        ]}
        title={post.title}
        lede={post.description}
      />
      <article className="textbook-page">
        <p className="blog-byline">
          {t(lang, "blog.post.by", {
            author: post.author,
            date: formatPostDate(post.date, lang),
          })}
        </p>
        <div className="mdx">
          <MDXRemote source={post.source} components={mdxComponentsForLang(lang)} />
        </div>
        {related.length > 0 && (
          <aside className="blog-related" aria-label={t(lang, "blog.post.related")}>
            <h2>{t(lang, "blog.post.related")}</h2>
            <ul>
              {related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
        <p className="blog-back">
          <Link href={withLang("/blog", lang)}>← {t(lang, "blog.post.back")}</Link>
        </p>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          url,
          datePublished: post.date,
          ...(post.updated ? { dateModified: post.updated } : {}),
          author: { "@type": "Person", name: post.author },
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: absoluteUrl("/"),
          },
          inLanguage: langMeta(lang).locale,
        }}
      />
    </>
  );
}
