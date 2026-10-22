/**
 * KEEP GOING — the automatic ending of the new topic structure (2026-10-22).
 * Rendered by the topic page (never authored in MDX): the next topic in the
 * chapter plus related topics picked from the registry, so the links can
 * never go stale the way hand-written <RelatedTopics> did (5% coverage,
 * some pointing at old URLs). Lessons that still carry an authored
 * <RelatedTopics> keep it and skip this block.
 */
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

export interface KeepGoingLink {
  title: string;
  url: string;
}

export function KeepGoing({
  next,
  related,
  lang = "en",
}: {
  next?: KeepGoingLink | null;
  related: KeepGoingLink[];
  lang?: Lang;
}) {
  if (!next && related.length === 0) return null;
  return (
    <div className="keep-going">
      <div className="keep-going-title">{t(lang, "tb.keepgoing")}</div>
      {next && (
        <Link className="chapter-link keep-going-next" href={next.url}>
          <span className="chapter-index">→</span>
          <span>
            <span className="keep-going-label">{t(lang, "tb.keepgoing.next")}</span>
            <span className="chapter-title" style={{ fontSize: "1.35rem" }}>{next.title}</span>
          </span>
          <span className="chapter-status">{t(lang, "tb.read.lesson")}</span>
        </Link>
      )}
      {related.length > 0 && (
        <div className="keep-going-related">
          <span className="keep-going-label">{t(lang, "tb.keepgoing.related")}</span>
          {related.map((item) => (
            <Link key={item.url} className="keep-going-chip" href={item.url}>
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
