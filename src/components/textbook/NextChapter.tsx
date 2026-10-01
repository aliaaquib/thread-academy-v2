/**
 * NEXT CHAPTER — the "continue to the next lesson" card at the bottom of
 * a lesson page.
 */
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

/** .next-lesson-card: footer navigation to the next lesson. */
export function NextChapter({
  kicker,
  title,
  href,
  lang = "en",
}: {
  kicker?: string;
  title: string;
  href: string;
  lang?: Lang;
}) {
  return (
    <Link className="next-lesson-card" href={href}>
      <div>
        <span className="nl-kicker">{kicker ?? t(lang, "tb.next")}</span>
        <h3>{title}</h3>
      </div>
      <span className="nl-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
