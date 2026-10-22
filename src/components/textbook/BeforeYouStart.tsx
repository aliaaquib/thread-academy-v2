/**
 * BEFORE YOU START — the bridge block of the new topic structure (2026-10-22).
 * Two lines that connect this lesson to what the student already learned.
 *
 * Teachers can author it in MDX:
 *   <BeforeYouStart>
 *     You already know that 8 bits make 1 byte…
 *   </BeforeYouStart>
 *
 * When a lesson does not carry one, the topic page renders an automatic
 * version (AutoBeforeYouStart below) naming the previous topic in the
 * chapter, so the sequence is visible inside every lesson.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/strings";

export function BeforeYouStart({ children, lang = "en" }: { children: ReactNode; lang?: Lang }) {
  return (
    <div className="before-start">
      <div className="before-start-title">{t(lang, "tb.before")}</div>
      <div>{children}</div>
    </div>
  );
}

/** Automatic bridge: names the previous topic and links back to it. */
export function AutoBeforeYouStart({
  prevTitle,
  prevUrl,
  lang = "en",
}: {
  prevTitle: string;
  prevUrl: string;
  lang?: Lang;
}) {
  return (
    <div className="before-start">
      <div className="before-start-title">{t(lang, "tb.before")}</div>
      <p>
        {t(lang, "tb.before.auto", { title: prevTitle })}{" "}
        <Link href={prevUrl}>{t(lang, "tb.before.revisit")}</Link>
      </p>
    </div>
  );
}
