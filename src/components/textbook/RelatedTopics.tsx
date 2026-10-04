/**
 * RELATED TOPICS — the "keep learning" link list, usually at the bottom of
 * a lesson or blog post. Every link is built from real chapter data.
 */
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";
import { isSafeHref } from "@/lib/urls";

export interface RelatedLink {
  title: string;
  href: string;
}

/** Related-topic rows in the reference chapter-link language. */
export function RelatedTopics({ items, lang = "en" }: { items: RelatedLink[]; lang?: Lang }) {
  const safe = (items || []).filter((item) => isSafeHref(item.href));
  if (safe.length === 0) return null;
  return (
    <div className="chapters" style={{ marginTop: 8 }}>
      {safe.map((item, i) => (
        <Link key={item.href} className="chapter-link" href={item.href}>
          <span className="chapter-index">{String(i + 1).padStart(2, "0")}</span>
          <span>
            <span className="chapter-title" style={{ fontSize: "1.35rem" }}>
              {item.title}
            </span>
          </span>
          <span className="chapter-status">{t(lang, "tb.read.lesson")}</span>
        </Link>
      ))}
    </div>
  );
}
